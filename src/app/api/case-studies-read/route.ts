import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@/payload.config'
import { getCacheManager } from '@/lib/cache-manager'
import { getCacheTTL, getRevalidateTime, getCacheControlHeader, shouldUseCache } from '@/lib/cache-config'

export const runtime = 'nodejs' // Required for ioredis compatibility
// Dynamic revalidate: instant updates in development, 5 min in production
export const revalidate = getRevalidateTime()

export async function GET() {
  try {
    const cache = getCacheManager()
    const cacheKey = 'api-case-studies-read'
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
    const [caseStudiesPage, caseStudiesAll, contactSection] = await Promise.all([
      payload.findGlobal({ slug: 'case-studies-page', depth: 2 }).catch(() => null),
      payload.find({ 
        collection: 'case-studies', 
        limit: 100, 
        depth: 2,
        // Optimize: Only fetch needed fields
        select: {
          id: true,
          title: true,
          slug: true,
          excerpt: true,
          image: true,
          category: true,
          clientName: true,
        }
      }).catch(() => ({ docs: [] })),
      payload.findGlobal({ slug: 'contact-section' }).catch(() => null),
    ])
    const result = {
      caseStudiesAll,
      caseStudiesPageHeroSection: caseStudiesPage?.hero || null,
      caseStudiesPageGridSection: caseStudiesPage?.grid || null,
      contactSection: contactSection || null,
    }
    
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
    return NextResponse.json({ error: 'Failed to fetch case studies data' }, { status: 500 })
  }
}