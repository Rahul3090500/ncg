import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@/payload.config'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ jobSlug: string }> }
) {
  try {
    const { jobSlug } = await params
    const payload = await getPayload({ config })
    
    const result = await payload.find({
      collection: 'job-openings',
      where: {
        slug: {
          equals: jobSlug,
        },
      },
      limit: 1,
      depth: 2,
    })
    
    if (result.docs.length === 0) {
      return NextResponse.json({ error: 'Job not found' }, { status: 404 })
    }
    
    const response = NextResponse.json(result.docs[0])
    response.headers.set('Cache-Control', 'no-cache, no-store, must-revalidate')
    response.headers.set('Pragma', 'no-cache')
    response.headers.set('Expires', '0')
    return response
  } catch (error) {
    console.error('Error fetching job by slug:', error)
    return NextResponse.json({ error: 'Failed to fetch job' }, { status: 500 })
  }
}

