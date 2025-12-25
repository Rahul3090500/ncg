import { NextResponse } from 'next/server'
import { getPayloadClient } from '@/lib/payload-retry'
import { getCacheManager } from '@/lib/cache-manager'
import { getCacheTTL, getCacheControlHeader, shouldUseCache } from '@/lib/cache-config'

export const runtime = 'nodejs' // Required for ioredis compatibility
// Dynamic revalidate: instant updates in development, 5 min in production
// Revalidate: 0 = always revalidate for instant updates
export const revalidate = 0

export async function GET() {
  try {
    const cache = getCacheManager()
    const cacheKey = 'api-jobs-read'
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

    // Cache miss - fetch fresh data directly from Payload (avoid circular dependency)
    const payloadClient = await getPayloadClient()
    const jobsSection = await payloadClient.findGlobal({ slug: 'jobs-section', depth: 2 }).catch((error) => {
      console.error('Error fetching jobs-section global from Payload:', error)
      return null
    })
    
    if (!jobsSection) {
      console.warn('jobs-section global not found or failed to fetch')
    } else if (jobsSection.selectedJobs) {
      console.log(`Found ${Array.isArray(jobsSection.selectedJobs) ? jobsSection.selectedJobs.length : 0} selected jobs`)
    }
    
    // Ensure selectedJobs is always an array
    if (jobsSection && !Array.isArray(jobsSection.selectedJobs)) {
      jobsSection.selectedJobs = []
    }
    
    // Ensure data structure is always safe
    const safeData = {
      jobsSection: jobsSection || null
    }

    // Store in cache (skip cache in development for instant updates)
    if (shouldUseCache()) {
      await cache.set(cacheKey, safeData, { ttl: cacheTTL })
    }

    const etag = `"${Date.now()}"`
    const response = NextResponse.json(safeData, { status: 200 })
    response.headers.set('Cache-Control', getCacheControlHeader())
    response.headers.set('ETag', etag)
    response.headers.set('X-Cache', shouldUseCache() ? 'MISS' : 'NO-CACHE')
    return response
  } catch (error) {
    console.error('Error fetching jobs page data:', error)
    return NextResponse.json(
      { jobsSection: null },
      { status: 200 } // Return 200 with null data instead of 500 to prevent build failures
    )
  }
}

