import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@/payload.config'
import { getCacheManager } from '@/lib/cache-manager'
import { isBuildTime, isDatabaseConnectionError, getBuildTimeCollectionFallback } from '@/lib/build-time-helpers'

export const runtime = 'nodejs' // Required for ioredis compatibility

// Use ISR - revalidate every hour
export const revalidate = 3600

export async function GET() {
  // CRITICAL: Check build time FIRST before any database operations
  // During build, return fallback immediately to prevent 60+ second timeouts
  if (isBuildTime()) {
    return NextResponse.json(
      getBuildTimeCollectionFallback(),
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
    const cacheKey = 'api-services-read'

    // Try cache first (services are relatively static, cache for 2 hours)
    const cached = await cache.get(cacheKey, { ttl: 7200 })
    if (cached) {
      const etag = `"${Date.now()}"`

      const response = NextResponse.json(cached)
      response.headers.set('Cache-Control', 'public, s-maxage=7200, stale-while-revalidate=86400')
      response.headers.set('ETag', etag)
      response.headers.set('X-Cache', 'HIT')
      return response
    }

    // Cache miss - fetch from database with retry logic
    const payload = await getPayload({ config })
    
    // Retry the query up to 3 times if it fails due to connection issues
    // Increased retries and delays for extreme cross-continental latency
    let result
    let lastError: any = null
    const maxRetries = 3
    
    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        result = await payload.find({
          collection: 'services',
          limit: 100,
          depth: 2,
          sort: 'title',
          // Optimize: Only fetch needed fields (depth: 2 already limits, but we can be explicit)
        })
        break // Success, exit retry loop
      } catch (error: any) {
        lastError = error
        // Only retry on connection/timeout errors
        if (isDatabaseConnectionError(error) && attempt < maxRetries) {
          // Exponential backoff: 2s, 4s, 8s delays (max 10s)
          const delay = Math.min(Math.pow(2, attempt + 1) * 1000, 10000)
          console.warn(`Database query failed (attempt ${attempt + 1}/${maxRetries + 1}), retrying in ${delay}ms...`)
          await new Promise(resolve => setTimeout(resolve, delay))
          continue
        }
        throw error // Re-throw if not a connection error or max retries reached
      }
    }
    
    if (!result) {
      throw lastError || new Error('Failed to fetch services after retries')
    }
    
    // Store in cache
    await cache.set(cacheKey, result, { ttl: 7200 })
    
    const response = NextResponse.json(result)
    response.headers.set('Cache-Control', 'public, s-maxage=7200, stale-while-revalidate=86400')
    response.headers.set('ETag', `"${Date.now()}"`)
    response.headers.set('X-Cache', 'MISS')
    return response
  } catch (error: any) {
    // Check if it's a database connection error
    if (isDatabaseConnectionError(error)) {
      const isTimeout = error?.message?.toLowerCase().includes('timeout') || 
                       error?.cause?.message?.toLowerCase().includes('timeout') ||
                       error?.cause?.message?.toLowerCase().includes('terminated')
      
      // During build time, return empty data gracefully instead of error
      // This allows static generation to succeed, data will be fetched at runtime
      if (isBuildTime()) {
        // Suppress error logging during build time - this is expected behavior
        // Data will be fetched at runtime when the database is available
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
      
      // Runtime error - log it
      console.error('Error fetching services:', error)
      
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

