import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@/payload.config'
import { getCacheManager } from '@/lib/cache-manager'

export const runtime = 'nodejs' // Required for ioredis compatibility
export const revalidate = 300 // Revalidate every 5 minutes

export async function GET() {
  try {
    const cache = getCacheManager()
    const cacheKey = 'api-case-studies-read'

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

    // Cache miss - fetch from database
    const payload = await getPayload({ config })
    const [caseStudiesPage, caseStudiesAll, contactSection] = await Promise.all([
      payload.findGlobal({ slug: 'case-studies-page', depth: 2 }).catch(() => null),
      payload.find({ 
        collection: 'case-studies', 
        limit: 100, 
        depth: 3, // Increased depth to ensure relationships (icon, image) are populated
      }).catch(() => ({ docs: [] })),
      payload.findGlobal({ slug: 'contact-section' }).catch(() => null),
    ])
    const result = {
      caseStudiesAll,
      caseStudiesPageHeroSection: caseStudiesPage?.hero || null,
      caseStudiesPageGridSection: caseStudiesPage?.grid || null,
      contactSection: contactSection || null,
    }
    
    // Store in cache (reduced TTL for instant updates - 5 minutes)
    await cache.set(cacheKey, result, { ttl: 300 })
    
    const response = NextResponse.json(result)
    response.headers.set('Cache-Control', 'public, s-maxage=300, stale-while-revalidate=600')
    response.headers.set('ETag', `"${Date.now()}"`)
    response.headers.set('X-Cache', 'MISS')
    return response
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch case studies data' }, { status: 500 })
  }
}