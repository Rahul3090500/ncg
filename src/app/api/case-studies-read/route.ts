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
        caseStudiesAll: getBuildTimeCollectionFallback(),
        caseStudiesPageHeroSection: null,
        caseStudiesPageGridSection: null,
        contactSection: null,
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
    const cacheKey = 'api-case-studies-read'

    // Try cache first (case studies are semi-static, cache for 1 hour)
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
    
    // Store in cache
    await cache.set(cacheKey, result, { ttl: 3600 })
    
    const response = NextResponse.json(result)
    response.headers.set('Cache-Control', 'public, s-maxage=3600, stale-while-revalidate=7200')
    response.headers.set('ETag', `"${Date.now()}"`)
    response.headers.set('X-Cache', 'MISS')
    return response
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch case studies data' }, { status: 500 })
  }
}