import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@/payload.config'
import { getCacheManager } from '@/lib/cache-manager'

export const runtime = 'nodejs' // Required for ioredis compatibility
export const revalidate = 3600 // Revalidate every hour

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params
    const cache = getCacheManager()
    const cacheKey = `api-blogs-read-${slug}`

    // Try cache first
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
    
    // Store in cache
    await cache.set(cacheKey, blogData, { ttl: 3600 })
    
    const response = NextResponse.json(blogData)
    response.headers.set('Cache-Control', 'public, s-maxage=3600, stale-while-revalidate=7200')
    response.headers.set('ETag', `"${Date.now()}"`)
    response.headers.set('X-Cache', 'MISS')
    return response
  } catch (error: any) {
    console.error('Error fetching blog by slug:', error)
    
    // Check if it's a database connection error
    const isDatabaseError = 
      error?.message?.toLowerCase().includes('timeout') ||
      error?.message?.toLowerCase().includes('connection') ||
      error?.cause?.message?.toLowerCase().includes('timeout') ||
      error?.code === '53300'
    
    if (isDatabaseError) {
      return NextResponse.json(
        { 
          error: 'Database connection timeout',
          errorType: 'DATABASE_CONNECTION_ERROR',
          message: 'The database query timed out. Please try again later.'
        },
        { status: 503 } // Service Unavailable
      )
    }
    
    return NextResponse.json(
      { error: 'Failed to fetch blog' },
      { status: 500 }
    )
  }
}

