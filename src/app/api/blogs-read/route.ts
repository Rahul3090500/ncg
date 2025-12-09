import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@/payload.config'
import { getCacheManager } from '@/lib/cache-manager'
import { isBuildTime, getBuildTimeGlobalFallback, getBuildTimeCollectionFallback } from '@/lib/build-time-helpers'

export const runtime = 'nodejs' // Required for ioredis compatibility
export const revalidate = 3600 // Revalidate every hour

export async function GET() {
  // CRITICAL: Check build time FIRST before any database operations
  if (isBuildTime()) {
    return NextResponse.json(
      {
        blogsPageHeroSection: null,
        blogsAll: getBuildTimeCollectionFallback(),
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
    const cacheKey = 'api-blogs-read'

    // Try cache first (blogs are semi-static, cache for 1 hour)
    const cached = await cache.get(cacheKey, { ttl: 3600 })
    if (cached) {
      const etag = `"${Date.now()}"`

      const response = NextResponse.json(cached)
      response.headers.set('Cache-Control', 'public, s-maxage=3600, stale-while-revalidate=7200')
      response.headers.set('ETag', etag)
      response.headers.set('X-Cache', 'HIT')
      return response
    }

    // Cache miss - fetch from database
    const payloadClient = await getPayload({ config })
    const [blogsPageHeroSection, blogsAll] = await Promise.all([
      payloadClient.findGlobal({ slug: 'blogs-page-hero' }).catch(() => null),
      payloadClient.find({ 
        collection: 'blogs', 
        limit: 100, 
        depth: 2,
        // Optimize: Only fetch needed fields
        select: {
          id: true,
          title: true,
          slug: true,
          excerpt: true,
          image: true,
          publishedDate: true,
          readTime: true,
        }
      }).catch(() => ({ docs: [] })),
    ])

    const result = { blogsPageHeroSection, blogsAll }
    
    // Store in cache
    await cache.set(cacheKey, result, { ttl: 3600 })
    
    const response = NextResponse.json(result)
    response.headers.set('Cache-Control', 'public, s-maxage=3600, stale-while-revalidate=7200')
    response.headers.set('ETag', `"${Date.now()}"`)
    response.headers.set('X-Cache', 'MISS')
    return response
  } catch (error: any) {
    console.error('Error fetching blogs:', error)
    
    // Check if it's a database connection error
    const isDatabaseError = 
      error?.message?.toLowerCase().includes('timeout') ||
      error?.message?.toLowerCase().includes('connection') ||
      error?.cause?.message?.toLowerCase().includes('timeout') ||
      error?.code === '53300'
    
    if (isDatabaseError) {
      return NextResponse.json(
        { 
          error: 'Database connection timeout',
          errorType: 'DATABASE_CONNECTION_ERROR',
          message: 'The database query timed out. Please try again later.'
        },
        { status: 503 } // Service Unavailable
      )
    }
    
    return NextResponse.json(
      { error: 'Failed to fetch blogs data' },
      { status: 500 }
    )
  }
}