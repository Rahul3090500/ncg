/**
 * Cache Configuration Helper
 * 
 * Provides dynamic cache TTL and revalidate times based on NODE_ENV
 * - Development: Instant updates (no cache or very short cache)
 * - Production: Optimized caching (5 minutes)
 */

/**
 * Get cache TTL in seconds
 * - Development: 0 (no cache for instant updates)
 * - Production: 300 (5 minutes)
 */
export function getCacheTTL(): number {
  return process.env.NODE_ENV === 'development' ? 0 : 300
}

/**
 * Get revalidate time in seconds for Next.js ISR
 * - Development: 0 (always revalidate for instant updates)
 * - Production: 300 (5 minutes)
 */
export function getRevalidateTime(): number {
  return process.env.NODE_ENV === 'development' ? 0 : 300
}

/**
 * Get Cache-Control header value
 * - Development: no-cache for instant updates
 * - Production: public cache with stale-while-revalidate
 */
export function getCacheControlHeader(): string {
  const ttl = getCacheTTL()
  if (ttl === 0) {
    return 'no-cache, no-store, must-revalidate'
  }
  return 'public, s-maxage=300, stale-while-revalidate=600'
}

/**
 * Check if caching should be enabled
 */
export function shouldUseCache(): boolean {
  return process.env.NODE_ENV !== 'development'
}
