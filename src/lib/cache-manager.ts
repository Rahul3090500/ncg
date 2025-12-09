/**
 * Memory-Based Cache Manager
 * 
 * Handles caching for 10,000+ concurrent users
 * - In-memory caching (per-instance)
 * - Region-aware caching
 * - Cache invalidation strategies
 * - Automatic cleanup of expired entries
 */

interface CacheOptions {
  ttl?: number // Time to live in seconds
  region?: string // Region identifier
  tags?: string[] // Cache tags for invalidation (stored in memory)
}

class CacheManager {
  private memoryCache: Map<string, { value: any; expires: number; tags?: string[] }> = new Map()

  constructor() {
    // Memory-based caching - no external dependencies
  }

  private getCacheKey(key: string, region?: string): string {
    const regionPrefix = region || process.env.AWS_REGION || 'default'
    return `ncg:${regionPrefix}:${key}`
  }

  async get<T>(key: string, options?: CacheOptions): Promise<T | null> {
    const cacheKey = this.getCacheKey(key, options?.region)

    // Use memory cache
    const memoryItem = this.memoryCache.get(cacheKey)
    if (memoryItem && memoryItem.expires > Date.now()) {
      return memoryItem.value as T
    }

    // Clean up expired item
    if (memoryItem) {
      this.memoryCache.delete(cacheKey)
    }

    return null
  }

  async set(key: string, value: any, options?: CacheOptions): Promise<void> {
    const cacheKey = this.getCacheKey(key, options?.region)
    const ttl = options?.ttl || 3600 // Default 1 hour
    const expires = Date.now() + ttl * 1000

    // Store in memory cache with tags
    this.memoryCache.set(cacheKey, { 
      value, 
      expires,
      tags: options?.tags || []
    })

    // Clean up old entries if memory cache gets too large (optimized for better performance)
    // Increased limit from 10,000 to 50,000 for better cache hit rate
    if (this.memoryCache.size > 50000) {
      const entries = Array.from(this.memoryCache.entries())
      entries.sort((a, b) => a[1].expires - b[1].expires)
      // Clean up 10% of oldest entries (more efficient than fixed 1000)
      const toDelete = entries.slice(0, Math.floor(entries.length * 0.1))
      toDelete.forEach(([key]) => this.memoryCache.delete(key))
    }
  }

  async invalidate(key: string, region?: string): Promise<void> {
    const cacheKey = this.getCacheKey(key, region)
    this.memoryCache.delete(cacheKey)
  }

  async invalidateByTag(tag: string): Promise<void> {
    // Invalidate memory cache entries with tag
    for (const [key, item] of this.memoryCache.entries()) {
      if (item.tags && item.tags.includes(tag)) {
        this.memoryCache.delete(key)
      }
    }
  }

  async clear(region?: string): Promise<void> {
    // Clear memory cache
    if (region) {
      const regionPrefix = `ncg:${region}:`
      for (const [key] of this.memoryCache.entries()) {
        if (key.startsWith(regionPrefix)) {
          this.memoryCache.delete(key)
        }
      }
    } else {
      this.memoryCache.clear()
    }
  }

  async getStats(): Promise<{
    type: 'memory'
    size: number
    available: boolean
  }> {
    return {
      type: 'memory',
      size: this.memoryCache.size,
      available: true,
    }
  }
}

// Singleton instance
let cacheManager: CacheManager | null = null

export function getCacheManager(): CacheManager {
  if (!cacheManager) {
    cacheManager = new CacheManager()
  }
  return cacheManager
}

export async function getCached<T>(
  key: string,
  fetcher: () => Promise<T>,
  options?: CacheOptions
): Promise<T> {
  const cache = getCacheManager()
  
  // Try to get from cache
  const cached = await cache.get<T>(key, options)
  if (cached !== null) {
    return cached
  }

  // Fetch fresh data
  const fresh = await fetcher()
  
  // Store in cache
  await cache.set(key, fresh, options)
  
  return fresh
}

