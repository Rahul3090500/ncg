import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@/payload.config'

type RouteParams = {
  params: Promise<{ serviceSlug: string; subServiceSlug: string }>
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { serviceSlug, subServiceSlug } = await params
    const payload = await getPayload({ config })
    
    // First get the service
    const serviceResult = await payload.find({
      collection: 'services',
      where: {
        slug: {
          equals: serviceSlug,
        },
      },
      limit: 1,
      depth: 1,
    })
    
    const service = serviceResult?.docs?.[0]
    if (!service) {
      return NextResponse.json({ error: 'Service not found' }, { status: 404 })
    }
    
    // Then get the sub-service (check if it belongs to this service)
    const subServiceResult = await payload.find({
      collection: 'sub-services',
      where: {
        and: [
          {
            slug: {
              equals: subServiceSlug,
            },
          },
          {
            services: {
              contains: typeof service.id === 'number' ? service.id : service.id,
            },
          },
        ],
      },
      limit: 1,
      depth: 2,
    })
    
    const subService = subServiceResult?.docs?.[0]
    if (!subService) {
      return NextResponse.json({ error: 'Sub-service not found' }, { status: 404 })
    }
    
    const response = NextResponse.json(subService)
    response.headers.set('Cache-Control', 'no-cache, no-store, must-revalidate')
    response.headers.set('Pragma', 'no-cache')
    response.headers.set('Expires', '0')
    return response
  } catch (error) {
    console.error('Error fetching sub-service:', error)
    return NextResponse.json({ error: 'Failed to fetch sub-service' }, { status: 500 })
  }
}

