import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@/payload.config'
import { getCacheManager } from '@/lib/cache-manager'
import { getCacheTTL, getCacheControlHeader, shouldUseCache } from '@/lib/cache-config'

export const runtime = 'nodejs' // Required for ioredis compatibility
// Dynamic revalidate: instant updates in development, 1 hour in production
// Revalidate: 0 = always revalidate for instant updates
export const revalidate = 0

type RouteParams = {
  params: Promise<{ serviceSlug: string }>
}

export async function GET(_request: NextRequest, { params }: RouteParams) {
  try {
    const { serviceSlug } = await params
    const cache = getCacheManager()
    const cacheKey = `api-services-read-${serviceSlug}`
    const cacheTTL = process.env.NODE_ENV === 'development' ? 0 : 7200

    // Try cache first (skip cache in development for instant updates)
    if (shouldUseCache()) {
      const cached = await cache.get(cacheKey, { ttl: cacheTTL })
      if (cached) {
        const etag = `"${Date.now()}"`

        const response = NextResponse.json(cached)
        response.headers.set('Cache-Control', process.env.NODE_ENV === 'development' 
          ? 'no-cache, no-store, must-revalidate'
          : 'public, s-maxage=7200, stale-while-revalidate=86400')
        response.headers.set('ETag', etag)
        response.headers.set('X-Cache', 'HIT')
        return response
      }
    }

    // Cache miss - fetch from database
    const payload = await getPayload({ config })
    
    const result = await payload.find({
      collection: 'services',
      where: {
        slug: {
          equals: serviceSlug,
        },
      },
      limit: 1,
      depth: 2,
    })
    
    const service = result?.docs?.[0]
    if (!service) {
      return NextResponse.json({ error: 'Service not found' }, { status: 404 })
    }
    
    // Filter out broken relationships (null or missing documents)
    if (Array.isArray(service.caseStudies)) {
      service.caseStudies = service.caseStudies.filter((cs: any) => cs && cs.id)
    }
    if (Array.isArray(service.subServices)) {
      service.subServices = service.subServices.filter((ss: any) => ss && ss.id)
    }
    
    // Store in cache (skip cache in development for instant updates)
    if (shouldUseCache()) {
      await cache.set(cacheKey, service, { ttl: cacheTTL })
    }
    
    const response = NextResponse.json(service)
    response.headers.set('Cache-Control', process.env.NODE_ENV === 'development' 
      ? 'no-cache, no-store, must-revalidate'
      : 'public, s-maxage=7200, stale-while-revalidate=86400')
    response.headers.set('ETag', `"${Date.now()}"`)
    response.headers.set('X-Cache', shouldUseCache() ? 'MISS' : 'NO-CACHE')
    return response
  } catch (error) {
    console.error('Error fetching service:', error)
    return NextResponse.json({ error: 'Failed to fetch service' }, { status: 500 })
  }
}

