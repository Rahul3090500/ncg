import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@/payload.config'
import { getCacheManager } from '@/lib/cache-manager'
import { getCacheTTL, getRevalidateTime, getCacheControlHeader, shouldUseCache } from '@/lib/cache-config'

export const runtime = 'nodejs' // Required for ioredis compatibility
// Dynamic revalidate: instant updates in development, 5 min in production
export const revalidate = getRevalidateTime()

export async function GET() {
  try {
    const cache = getCacheManager()
    const cacheKey = 'api-about-read'
    const cacheTTL = getCacheTTL()

    // Try cache first (skip cache in development for instant updates)
    if (shouldUseCache()) {
      const cached = await cache.get(cacheKey, { ttl: cacheTTL })
      if (cached) {
        const etag = `"${Date.now()}"`

        const response = NextResponse.json(cached)
        response.headers.set('Cache-Control', getCacheControlHeader())
        response.headers.set('ETag', etag)
        response.headers.set('X-Cache', 'HIT')
        return response
      }
    }

    // Cache miss - fetch from database
    const payloadClient = (await getPayload({ config })) as any
    const [
      aboutHeroSection,
      aboutUsSection,
      aboutStatsSection,
      aboutMissionSection,
      aboutCoreValuesSection,
      aboutTeamSection,
      aboutCTASection,
    ] = await Promise.all([
      payloadClient.findGlobal({ slug: 'about-hero' }).catch(() => null),
      payloadClient.findGlobal({ slug: 'about-us-section' }).catch(() => null),
      payloadClient.findGlobal({ slug: 'about-stats-section' }).catch(() => null),
      payloadClient.findGlobal({ slug: 'about-mission-section' }).catch(() => null),
      payloadClient.findGlobal({ slug: 'about-core-values-section' }).catch(() => null),
      payloadClient.findGlobal({ slug: 'about-team-section' }).catch(() => null),
      payloadClient.findGlobal({ slug: 'about-cta-section' }).catch(() => null),
    ])
    const result = {
      aboutHeroSection,
      aboutUsSection,
      aboutStatsSection,
      aboutMissionSection,
      aboutCoreValuesSection,
      aboutTeamSection,
      aboutCTASection,
    }
    
    // Store in cache (skip cache in development for instant updates)
    if (shouldUseCache()) {
      await cache.set(cacheKey, result, { ttl: cacheTTL })
    }
    
    const response = NextResponse.json(result)
    response.headers.set('Cache-Control', getCacheControlHeader())
    response.headers.set('ETag', `"${Date.now()}"`)
    response.headers.set('X-Cache', shouldUseCache() ? 'MISS' : 'NO-CACHE')
    return response
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch about page data' }, { status: 500 })
  }
}