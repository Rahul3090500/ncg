import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@/payload.config'
import { getCacheManager } from '@/lib/cache-manager'
import { getCacheTTL, getCacheControlHeader, shouldUseCache } from '@/lib/cache-config'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function GET() {
  try {
    const cache = getCacheManager()
    const cacheKey = 'api-privacy-policy-read'
    const cacheTTL = getCacheTTL()

    // Try cache first (skip cache in development for instant updates)
    if (shouldUseCache()) {
      const cached = await cache.get(cacheKey, { ttl: cacheTTL })
      if (cached) {
        const response = NextResponse.json(cached, {
          status: 200,
          headers: {
            'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
            'Pragma': 'no-cache',
            'Expires': '0',
            'X-Cache': 'HIT',
          },
        })
        return response
      }
    }

    // Cache miss - fetch from database directly
    const payload = await getPayload({ config })
    const privacyPolicySection = await payload.findGlobal({ slug: 'privacy-policy-section', depth: 2 }).catch(() => null)
    
    const result = { privacyPolicySection }

    // Store in cache (skip cache in development for instant updates)
    if (shouldUseCache()) {
      await cache.set(cacheKey, result, { ttl: cacheTTL })
    }

    return NextResponse.json(result, {
      status: 200,
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
        'X-Cache': shouldUseCache() ? 'MISS' : 'NO-CACHE',
      },
    })
  } catch (error) {
    console.error('Error fetching privacy policy page data:', error)
    return NextResponse.json(
      { error: 'Failed to fetch privacy policy page data', privacyPolicySection: null },
      { status: 200 } // Return 200 with null data to prevent build failures
    )
  }
}

