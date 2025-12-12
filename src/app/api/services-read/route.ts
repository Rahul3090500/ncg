import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@/payload.config'
import { getCacheManager } from '@/lib/cache-manager'
import { isBuildTime, isDatabaseConnectionError, getBuildTimeCollectionFallback } from '@/lib/build-time-helpers'
import { getCacheTTL, getRevalidateTime, getCacheControlHeader, shouldUseCache } from '@/lib/cache-config'

export const runtime = 'nodejs' // Required for ioredis compatibility

// Dynamic revalidate: instant updates in development, 5 min in production
export const revalidate = getRevalidateTime()

export async function GET() {
  try {
    const cache = getCacheManager()
    const cacheKey = 'api-services-read'
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
    const payload = await getPayload({ config })
    
    const result = await payload.find({
      collection: 'services',
      limit: 100,
      depth: 2,
      sort: 'title',
      // Optimize: Only fetch needed fields (depth: 2 already limits, but we can be explicit)
    })
    
    // Store in cache (skip cache in development for instant updates)
    if (shouldUseCache()) {
      await cache.set(cacheKey, result, { ttl: cacheTTL })
    }
    
    const response = NextResponse.json(result)
    response.headers.set('Cache-Control', getCacheControlHeader())
    response.headers.set('ETag', `"${Date.now()}"`)
    response.headers.set('X-Cache', shouldUseCache() ? 'MISS' : 'NO-CACHE')
    return response
  } catch (error: any) {
    console.error('Error fetching services:', error)
    
    // Check if it's a database connection error
    if (isDatabaseConnectionError(error)) {
      const isTimeout = error?.message?.toLowerCase().includes('timeout') || 
                       error?.cause?.message?.toLowerCase().includes('timeout') ||
                       error?.cause?.message?.toLowerCase().includes('terminated')
      
      // During build time, return empty data gracefully instead of error
      // This allows static generation to succeed, data will be fetched at runtime
      if (isBuildTime()) {
        console.warn('Build-time database connection failed, returning empty data. Will fetch at runtime.')
        return NextResponse.json(
          getBuildTimeCollectionFallback(),
          { 
            status: 200, // Return 200 so build succeeds
            headers: {
              'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300', // Short cache during build
              'X-Build-Time-Fallback': 'true'
            }
          }
        )
      }
      
      // Runtime error - return proper error response
      return NextResponse.json(
        { 
          error: isTimeout ? 'Database connection timeout' : 'Database connection unavailable',
          errorType: 'DATABASE_CONNECTION_ERROR',
          message: isTimeout 
            ? 'The database query timed out. Please try again later.' 
            : 'The database connection pool is exhausted. Please try again later.',
          code: error?.code || '53300'
        },
        { status: 503 } // Service Unavailable
      )
    }
    
    return NextResponse.json(
      { 
        error: 'Failed to fetch services',
        errorType: 'GENERAL_ERROR'
      },
      { status: 500 }
    )
  }
}

