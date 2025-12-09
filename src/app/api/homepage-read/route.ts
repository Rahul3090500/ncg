import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@/payload.config'
import { getCacheManager } from '@/lib/cache-manager'
import { isBuildTime, isDatabaseConnectionError, getBuildTimeGlobalFallback } from '@/lib/build-time-helpers'

export const runtime = 'nodejs'
// Use ISR - revalidate every hour
export const revalidate = 3600

export async function GET() {
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

    // Try cache first (increased TTL from 1 hour to 2 hours for better performance)
    const cached = await cache.get(cacheKey, { ttl: 7200 })
    if (cached) {
      console.log('[api/homepage-read] Cache HIT')
      const etag = `"${Date.now()}"` // Simple ETag

      const response = NextResponse.json(cached)
      response.headers.set('Cache-Control', 'public, s-maxage=7200, stale-while-revalidate=86400')
      response.headers.set('ETag', etag)
      response.headers.set('X-Cache', 'HIT')
      return response
    }

    // Cache miss - fetch from database
    console.log('[api/homepage-read] Cache MISS - fetching from database')
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
    
    // Store in cache (increased TTL from 1 hour to 2 hours for better performance)
    await cache.set(cacheKey, result, { ttl: 7200 })
    
    const etag = `"${Date.now()}"`
    const response = NextResponse.json(result)
    response.headers.set('Cache-Control', 'public, s-maxage=7200, stale-while-revalidate=86400')
    response.headers.set('ETag', etag)
    response.headers.set('X-Cache', 'MISS')
    console.log('[api/homepage-read] DB fetch SUCCESS - cached result')
    return response
  } catch (error: any) {
    console.error('[api/homepage-read] Error fetching homepage data:', error?.message || error)
    
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