import { NextRequest, NextResponse } from 'next/server'
import { getCacheManager } from '@/lib/cache-manager'
import { getAPICache } from '@/lib/api-cache'

export const runtime = 'nodejs' // Required for ioredis compatibility
export const dynamic = 'force-dynamic'
export const revalidate = 0

/**
 * Cache Invalidation Endpoint
 * 
 * Call this when data changes to invalidate caches
 * POST /api/cache-invalidate
 * Body: { keys: ['homepage-data', 'services-data'], pattern: 'homepage-*' }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { keys = [], pattern } = body

    const serverCache = getCacheManager()
    const clientCache = getAPICache()

    // Invalidate server-side cache
    for (const key of keys) {
      await serverCache.invalidate(key)
    }

    // Invalidate client-side cache (localStorage/sessionStorage)
    // This ensures client components get fresh data on next request
    for (const key of keys) {
      clientCache.invalidate(key)
    }

    // Invalidate by pattern
    if (pattern) {
      await serverCache.invalidateByTag(pattern)
      clientCache.invalidatePattern(pattern.replace('*', '.*'))
    }

    return NextResponse.json({
      success: true,
      invalidated: keys.length,
      pattern: pattern || null,
      message: 'Server and client caches invalidated',
    })
  } catch (error: any) {
    return NextResponse.json(
      { error: 'Failed to invalidate cache', message: error?.message },
      { status: 500 }
    )
  }
}

