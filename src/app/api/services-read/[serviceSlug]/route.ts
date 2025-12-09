import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@/payload.config'
import { getCacheManager } from '@/lib/cache-manager'

export const runtime = 'nodejs' // Required for ioredis compatibility
export const revalidate = 3600 // Revalidate every hour

type RouteParams = {
  params: Promise<{ serviceSlug: string }>
}

export async function GET(_request: NextRequest, { params }: RouteParams) {
  try {
    const { serviceSlug } = await params
    const cache = getCacheManager()
    const cacheKey = `api-services-read-${serviceSlug}`

    // Try cache first
    const cached = await cache.get(cacheKey, { ttl: 7200 })
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
    
    // Store in cache
    await cache.set(cacheKey, service, { ttl: 7200 })
    
    const response = NextResponse.json(service)
    response.headers.set('Cache-Control', 'public, s-maxage=7200, stale-while-revalidate=86400')
    response.headers.set('ETag', `"${Date.now()}"`)
    response.headers.set('X-Cache', 'MISS')
    return response
  } catch (error) {
    console.error('Error fetching service:', error)
    return NextResponse.json({ error: 'Failed to fetch service' }, { status: 500 })
  }
}

