import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@/payload.config'
import { getCacheManager } from '@/lib/cache-manager'
import { isBuildTime, isDatabaseConnectionError, getBuildTimeGlobalFallback } from '@/lib/build-time-helpers'

export const runtime = 'nodejs'
// Force runtime execution so we don't bake build-time fallbacks into a static response
export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function GET(request: NextRequest) {
  // CRITICAL: Check build time FIRST before any database operations
  if (isBuildTime()) {
    console.log('[api/homepage-read] Build time detected - returning fallback')
    return NextResponse.json(
      {
        heroSection: null,
        servicesSection: null,
        trustedBySection: null,
        caseStudiesHeroSection: null,
        caseStudiesGridSection: null,
        testimonialsSection: null,
        approachSection: null,
        contactSection: null,
        ...getBuildTimeGlobalFallback(),
      },
      { 
        status: 200,
        headers: {
          'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300',
          'X-Build-Time-Fallback': 'true'
        }
      }
    )
  }

  try {
    const cache = getCacheManager()
    const cacheKey = 'api-homepage-read'
    
    // Check for cache-bust query parameter (?cache=clear)
    const cacheBust = request.nextUrl.searchParams.get('cache') === 'clear'
    
    // Try cache first (increased TTL from 1 hour to 2 hours for better performance)
    const cached = cacheBust ? null : await cache.get(cacheKey, { ttl: 7200 })
    if (cached) {
      // Check if cached data has all nulls (bad cache)
      const hasNullData = Object.values(cached).every(value => value === null)
      if (hasNullData) {
        console.warn('[api/homepage-read] Cache contains all nulls - ignoring cache and fetching fresh')
      } else {
        console.log('[api/homepage-read] Cache HIT')
        const etag = `"${Date.now()}"` // Simple ETag

        const response = NextResponse.json(cached)
        response.headers.set('Cache-Control', 'public, s-maxage=7200, stale-while-revalidate=86400')
        response.headers.set('ETag', etag)
        response.headers.set('X-Cache', 'HIT')
        return response
      }
    }

    // Cache miss - fetch from database
    const payload = await getPayload({ config })
    
    // Fetch all globals in parallel
    const [
      heroSection,
      servicesSection,
      trustedBySection,
      caseStudiesHeroSection,
      caseStudiesGridSection,
      testimonialsSection,
      approachSection,
      contactSection,
    ] = await Promise.all([
      payload.findGlobal({ slug: 'hero-section', depth: 2 }).catch(() => null),
      payload.findGlobal({ slug: 'services-section', depth: 2 }).catch(() => null),
      payload.findGlobal({ slug: 'trusted-by-section' }).catch(() => null),
      payload.findGlobal({ slug: 'case-studies-hero' }).catch(() => null),
      payload.findGlobal({ slug: 'case-studies-grid', depth: 2 }).catch(() => null),
      payload.findGlobal({ slug: 'testimonials-section' }).catch(() => null),
      payload.findGlobal({ slug: 'approach-section' }).catch(() => null),
      payload.findGlobal({ slug: 'contact-section' }).catch(() => null),
    ])
    
    const result = {
      heroSection,
      servicesSection,
      trustedBySection,
      caseStudiesHeroSection,
      caseStudiesGridSection,
      testimonialsSection,
      approachSection,
      contactSection,
    }
    
    // Only cache if we got at least some data (don't cache all nulls)
    const hasData = Object.values(result).some(value => value !== null)
    if (hasData) {
      await cache.set(cacheKey, result, { ttl: 7200 })
    }
    
    const etag = `"${Date.now()}"`
    const response = NextResponse.json(result)
    response.headers.set('Cache-Control', 'public, s-maxage=7200, stale-while-revalidate=86400')
    response.headers.set('ETag', etag)
    response.headers.set('X-Cache', 'MISS')
    return response
  } catch (error: any) {
    console.error('[api/homepage-read] Error:', error?.message || error)
    
    // During build time, return empty data gracefully instead of error
    if (isBuildTime() && isDatabaseConnectionError(error)) {
      console.warn('[api/homepage-read] Build-time DB error, returning fallback for build.')
      return NextResponse.json(
        {
          heroSection: null,
          servicesSection: null,
          trustedBySection: null,
          caseStudiesHeroSection: null,
          caseStudiesGridSection: null,
          testimonialsSection: null,
          approachSection: null,
          contactSection: null,
          ...getBuildTimeGlobalFallback(),
        },
        { 
          status: 200, // Return 200 so build succeeds
          headers: {
            'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300',
            'X-Build-Time-Fallback': 'true'
          }
        }
      )
    }
    
    return NextResponse.json({ error: 'Failed to fetch homepage data' }, { status: 500 })
  }
}