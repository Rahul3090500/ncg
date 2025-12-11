import { NextResponse } from 'next/server'
import { getJobsPageData } from '@/lib/payload'
import { getCacheManager } from '@/lib/cache-manager'

export const runtime = 'nodejs' // Required for ioredis compatibility
export const revalidate = 300 // Revalidate every 5 minutes

export async function GET() {
  try {
    const cache = getCacheManager()
    const cacheKey = 'api-jobs-read'

    // Try cache first (reduced TTL for instant updates - 5 minutes)
    const cached = await cache.get(cacheKey, { ttl: 300 })
    if (cached) {
      const etag = `"${Date.now()}"`
      const response = NextResponse.json(cached)
      response.headers.set('Cache-Control', 'public, s-maxage=300, stale-while-revalidate=600')
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

    // Store in cache (reduced TTL for instant updates - 5 minutes)
    await cache.set(cacheKey, safeData, { ttl: 300 })

    const etag = `"${Date.now()}"`
    const response = NextResponse.json(safeData, { status: 200 })
    response.headers.set('Cache-Control', 'public, s-maxage=300, stale-while-revalidate=600')
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

