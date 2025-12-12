import { NextResponse } from 'next/server'
import { getJobsPageData } from '@/lib/payload'
import { getCacheManager } from '@/lib/cache-manager'
import { getCacheTTL, getRevalidateTime, getCacheControlHeader, shouldUseCache } from '@/lib/cache-config'

export const runtime = 'nodejs' // Required for ioredis compatibility
// Dynamic revalidate: instant updates in development, 5 min in production
export const revalidate = getRevalidateTime()

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

    // Cache miss - fetch fresh data
    const data = await getJobsPageData()
    // Ensure data structure is always safe
    const safeData = {
      jobsSection: data?.jobsSection || null
    }
    // Ensure selectedJobs is always an array
    if (safeData.jobsSection && !Array.isArray(safeData.jobsSection.selectedJobs)) {
      safeData.jobsSection.selectedJobs = []
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

