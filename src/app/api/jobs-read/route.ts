import { NextResponse } from 'next/server'
import { getJobsPageData } from '@/lib/payload'
import { getCacheManager } from '@/lib/cache-manager'

export const runtime = 'nodejs' // Required for ioredis compatibility
export const revalidate = 1800 // Revalidate every 30 minutes

export async function GET() {
  try {
    const cache = getCacheManager()
    const cacheKey = 'api-jobs-read'

    // Try cache first (increased TTL from 30 min to 1 hour for better performance)
    const cached = await cache.get(cacheKey, { ttl: 3600 })
    if (cached) {
      const etag = `"${Date.now()}"`
      const response = NextResponse.json(cached)
      response.headers.set('Cache-Control', 'public, s-maxage=3600, stale-while-revalidate=7200')
      response.headers.set('ETag', etag)
      response.headers.set('X-Cache', 'HIT')
      return response
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

    // Store in cache (increased TTL from 30 min to 1 hour for better performance)
    await cache.set(cacheKey, safeData, { ttl: 3600 })

    const etag = `"${Date.now()}"`
    const response = NextResponse.json(safeData, { status: 200 })
    response.headers.set('Cache-Control', 'public, s-maxage=3600, stale-while-revalidate=7200')
    response.headers.set('ETag', etag)
    response.headers.set('X-Cache', 'MISS')
    return response
  } catch (error) {
    console.error('Error fetching jobs page data:', error)
    return NextResponse.json(
      { jobsSection: null },
      { status: 200 } // Return 200 with null data instead of 500 to prevent build failures
    )
  }
}

