import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@/payload.config'
import { getCacheManager } from '@/lib/cache-manager'
import { getCacheTTL, getRevalidateTime, getCacheControlHeader, shouldUseCache } from '@/lib/cache-config'

export const runtime = 'nodejs' // Required for ioredis compatibility
// Dynamic revalidate: instant updates in development, 1 hour in production
export const revalidate = process.env.NODE_ENV === 'development' ? 0 : 3600

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params
    const cache = getCacheManager()
    const cacheKey = `api-blogs-read-${slug}`
    const cacheTTL = process.env.NODE_ENV === 'development' ? 0 : 3600

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
      collection: 'blogs',
      where: {
        slug: {
          equals: slug,
        },
      },
      limit: 1,
      depth: 2,
    })
    
    if (result.docs.length === 0) {
      return NextResponse.json({ error: 'Blog not found' }, { status: 404 })
    }
    
    const blogData = result.docs[0]
    
    // Store in cache (skip cache in development for instant updates)
    if (shouldUseCache()) {
      await cache.set(cacheKey, blogData, { ttl: cacheTTL })
    }
    
    const response = NextResponse.json(blogData)
    response.headers.set('Cache-Control', getCacheControlHeader())
    response.headers.set('ETag', `"${Date.now()}"`)
    response.headers.set('X-Cache', shouldUseCache() ? 'MISS' : 'NO-CACHE')
    return response
  } catch (error) {
    console.error('Error fetching blog by slug:', error)
    return NextResponse.json({ error: 'Failed to fetch blog' }, { status: 500 })
  }
}

