import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@/payload.config'
import { getCacheManager } from '@/lib/cache-manager'
import { isBuildTime, getBuildTimeGlobalFallback } from '@/lib/build-time-helpers'

export const runtime = 'nodejs' // Required for ioredis compatibility
export const revalidate = 3600 // Revalidate every hour

export async function GET() {
  // CRITICAL: Check build time FIRST before any database operations
  if (isBuildTime()) {
    return NextResponse.json(
      {
        footerSection: null,
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
    const cacheKey = 'api-footer-read'

    // Try cache first (footer is relatively static)
    const cached = await cache.get(cacheKey, { ttl: 7200 }) // 2 hours
    if (cached) {
      const etag = `"${Date.now()}"`

      const response = NextResponse.json(cached)
      response.headers.set('Cache-Control', 'public, s-maxage=7200, stale-while-revalidate=86400')
      response.headers.set('ETag', etag)
      response.headers.set('X-Cache', 'HIT')
      return response
    }

    // Cache miss - fetch from database
    const payload = await getPayload({ config })
    const footerSection = await payload.findGlobal({ slug: 'footer-section' }).catch(() => null)
    const result = { footerSection }
    
    // Store in cache
    await cache.set(cacheKey, result, { ttl: 7200 })
    
    const response = NextResponse.json(result)
    response.headers.set('Cache-Control', 'public, s-maxage=7200, stale-while-revalidate=86400')
    response.headers.set('ETag', `"${Date.now()}"`)
    response.headers.set('X-Cache', 'MISS')
    return response
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch footer data' }, { status: 500 })
  }
}