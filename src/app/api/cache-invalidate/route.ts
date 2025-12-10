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

    // Invalidate specific keys
    for (const key of keys) {
      await Promise.all([
        serverCache.invalidate(key),
        // Note: Client cache invalidation happens on next request
      ])
    }

    // Invalidate by pattern
    if (pattern) {
      await serverCache.invalidateByTag(pattern)
      // Client cache will be invalidated on next access
    }

    return NextResponse.json({
      success: true,
      invalidated: keys.length,
      pattern: pattern || null,
    })
  } catch (error: any) {
    return NextResponse.json(
      { error: 'Failed to invalidate cache', message: error?.message },
      { status: 500 }
    )
  }
}

