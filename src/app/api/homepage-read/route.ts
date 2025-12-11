import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@/payload.config'
import { getCacheManager } from '@/lib/cache-manager'
import { isBuildTime, isDatabaseConnectionError, getBuildTimeGlobalFallback } from '@/lib/build-time-helpers'

export const runtime = 'nodejs'
// Use ISR - revalidate every 5 minutes (reduced for instant updates)
export const revalidate = 300

export async function GET() {
  try {
    const cache = getCacheManager()
    const cacheKey = 'api-homepage-read'

    // Try cache first (reduced TTL for faster updates - 5 minutes)
    const cached = await cache.get(cacheKey, { ttl: 300 })
    if (cached) {
      const etag = `"${Date.now()}"` // Simple ETag

      const response = NextResponse.json(cached)
      response.headers.set('Cache-Control', 'public, s-maxage=300, stale-while-revalidate=600')
      response.headers.set('ETag', etag)
      response.headers.set('X-Cache', 'HIT')
      return response
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
      // Use depth: 3 to ensure sub-services are fully populated (nested relationships)
      payload.findGlobal({ slug: 'services-section', depth: 3 }).catch(() => null),
      payload.findGlobal({ slug: 'trusted-by-section' }).catch(() => null),
      payload.findGlobal({ slug: 'case-studies-hero' }).catch(() => null),
      payload.findGlobal({ slug: 'case-studies-grid', depth: 3 }).catch(() => null),
      payload.findGlobal({ slug: 'testimonials-section' }).catch(() => null),
      // Use depth: 2 to ensure step images are fully populated
      payload.findGlobal({ slug: 'approach-section', depth: 2 }).catch(() => null),
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
    
    // Store in cache (reduced TTL for faster updates - 5 minutes)
    await cache.set(cacheKey, result, { ttl: 300 })
    
    const etag = `"${Date.now()}"`
    const response = NextResponse.json(result)
    response.headers.set('Cache-Control', 'public, s-maxage=300, stale-while-revalidate=600')
    response.headers.set('ETag', etag)
    response.headers.set('X-Cache', 'MISS')
    return response
  } catch (error: any) {
    console.error('Error fetching homepage data:', error)
    
    // During build time, return empty data gracefully instead of error
    if (isBuildTime() && isDatabaseConnectionError(error)) {
      console.warn('Build-time database connection failed, returning empty data. Will fetch at runtime.')
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