import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@/payload.config'

type RouteParams = {
  params: Promise<{ serviceSlug: string }>
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { serviceSlug } = await params
    const payload = await getPayload({ config })
    
    // First get the service to get its ID
    const serviceResult = await payload.find({
      collection: 'services',
      where: {
        slug: {
          equals: serviceSlug,
        },
      },
      limit: 1,
    })
    
    const service = serviceResult?.docs?.[0]
    if (!service) {
      return NextResponse.json({ error: 'Service not found' }, { status: 404 })
    }
    
    // Get sub-services for this service (many-to-many relationship)
    const result = await payload.find({
      collection: 'sub-services',
      where: {
        services: {
          contains: typeof service.id === 'number' ? service.id : service.id,
        },
      },
      limit: 100,
      depth: 2,
      sort: 'order',
    })
    
    const response = NextResponse.json(result)
    response.headers.set('Cache-Control', 'no-cache, no-store, must-revalidate')
    response.headers.set('Pragma', 'no-cache')
    response.headers.set('Expires', '0')
    return response
  } catch (error) {
    console.error('Error fetching sub-services:', error)
    return NextResponse.json({ error: 'Failed to fetch sub-services' }, { status: 500 })
  }
}

