import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@/payload.config'
import { getCacheManager } from '@/lib/cache-manager'
import { getCacheTTL, getCacheControlHeader, shouldUseCache } from '@/lib/cache-config'

export const runtime = 'nodejs' // Required for ioredis compatibility
// Dynamic revalidate: instant updates in development, 5 min in production
// Revalidate: 0 = always revalidate for instant updates
export const revalidate = 0

export async function GET() {
  try {
    const cache = getCacheManager()
    const cacheKey = 'api-blogs-read'
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
    return NextResponse.json({ error: 'Failed to fetch blogs data' }, { status: 500 })
  }
}