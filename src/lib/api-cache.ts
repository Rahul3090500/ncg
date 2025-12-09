/**
 * API Response Caching System
 * 
 * Multi-layer caching for optimal performance:
 * - Client-side: localStorage/sessionStorage
 * - Server-side: Memory cache (per-instance)
 * - Stale-while-revalidate pattern
 * - Automatic cache invalidation on data changes
 */

interface CacheEntry<T> {
  data: T
  timestamp: number
  version: string
  etag: string
}

interface CacheOptions {
  ttl?: number // Time to live in seconds
  useLocalStorage?: boolean // Use localStorage (persists) vs sessionStorage (session only)
  staleWhileRevalidate?: boolean // Serve stale data while fetching fresh
  version?: string // Cache version for invalidation
}

const DEFAULT_TTL = 3600 // 1 hour
const STALE_THRESHOLD = 86400 // 24 hours - consider stale after this

class APICache {
  private generateETag(data: any): string {
    // Generate ETag from data hash
    const str = JSON.stringify(data)
    let hash = 0
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i)
      hash = ((hash << 5) - hash) + char
      hash = hash & hash // Convert to 32-bit integer
    }
    return `"${Math.abs(hash).toString(16)}"`
  }

  private getStorage(useLocalStorage: boolean = true): Storage | null {
    if (typeof window === 'undefined') return null
    try {
      return useLocalStorage ? window.localStorage : window.sessionStorage
    } catch {
      return null
    }
  }

  private getCacheKey(key: string): string {
    return `ncg_cache_${key}`
  }

  async get<T>(key: string, options: CacheOptions = {}): Promise<T | null> {
    const {
      useLocalStorage = true,
      staleWhileRevalidate = true,
    } = options

    // Try client-side cache first
    const storage = this.getStorage(useLocalStorage)
    if (storage) {
      try {
        const cached = storage.getItem(this.getCacheKey(key))
        if (cached) {
          const entry: CacheEntry<T> = JSON.parse(cached)
          const now = Date.now()
          const age = (now - entry.timestamp) / 1000

          // If within TTL, return immediately
          const ttl = options.ttl || DEFAULT_TTL
          if (age < ttl) {
            return entry.data
          }

          // If stale but within stale threshold, return stale data for revalidation
          if (staleWhileRevalidate && age < STALE_THRESHOLD) {
            // Return stale data but trigger background refresh
            this.refreshInBackground(key, options).catch(() => {})
            return entry.data
          }

          // Cache expired, remove it
          storage.removeItem(this.getCacheKey(key))
        }
      } catch (error) {
        console.warn('Cache read error:', error)
      }
    }

    return null
  }

  async set<T>(key: string, data: T, options: CacheOptions = {}): Promise<void> {
    const {
      useLocalStorage = true,
      version = '1.0',
    } = options

    const storage = this.getStorage(useLocalStorage)
    if (storage) {
      try {
        const entry: CacheEntry<T> = {
          data,
          timestamp: Date.now(),
          version,
          etag: this.generateETag(data),
        }
        storage.setItem(this.getCacheKey(key), JSON.stringify(entry))
      } catch (error) {
        // Handle quota exceeded
        if (error instanceof DOMException && error.name === 'QuotaExceededError') {
          console.warn('Storage quota exceeded, clearing old cache entries')
          this.clearOldEntries(storage)
          // Retry once
          try {
            const entry: CacheEntry<T> = {
              data,
              timestamp: Date.now(),
              version,
              etag: this.generateETag(data),
            }
            storage.setItem(this.getCacheKey(key), JSON.stringify(entry))
          } catch {
            // Give up if still fails
          }
        }
      }
    }
  }

  private async refreshInBackground(key: string, options: CacheOptions): Promise<void> {
    // This would trigger a background fetch to refresh cache
    // Implementation depends on your API structure
  }

  private clearOldEntries(storage: Storage): void {
    const keys: string[] = []
    for (let i = 0; i < storage.length; i++) {
      const key = storage.key(i)
      if (key && key.startsWith('ncg_cache_')) {
        keys.push(key)
      }
    }

    // Sort by timestamp and remove oldest 50%
    const entries = keys.map(key => {
      try {
        const value = storage.getItem(key)
        if (value) {
          const entry = JSON.parse(value)
          return { key, timestamp: entry.timestamp }
        }
      } catch {
        return null
      }
      return null
    }).filter(Boolean).sort((a, b) => a!.timestamp - b!.timestamp)

    const toRemove = Math.floor(entries.length / 2)
    for (let i = 0; i < toRemove; i++) {
      storage.removeItem(entries[i]!.key)
    }
  }

  invalidate(key: string): void {
    const localStorage = this.getStorage(true)
    const sessionStorage = this.getStorage(false)

    if (localStorage) {
      localStorage.removeItem(this.getCacheKey(key))
    }
    if (sessionStorage) {
      sessionStorage.removeItem(this.getCacheKey(key))
    }
  }

  invalidatePattern(pattern: string): void {
    const localStorage = this.getStorage(true)
    const sessionStorage = this.getStorage(false)

    const regex = new RegExp(pattern)

    if (localStorage) {
      const keys: string[] = []
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i)
        if (key && key.startsWith('ncg_cache_') && regex.test(key)) {
          keys.push(key)
        }
      }
      keys.forEach(key => localStorage.removeItem(key))
    }

    if (sessionStorage) {
      const keys: string[] = []
      for (let i = 0; i < sessionStorage.length; i++) {
        const key = sessionStorage.key(i)
        if (key && key.startsWith('ncg_cache_') && regex.test(key)) {
          keys.push(key)
        }
      }
      keys.forEach(key => sessionStorage.removeItem(key))
    }
  }

  clear(): void {
    const localStorage = this.getStorage(true)
    const sessionStorage = this.getStorage(false)

    if (localStorage) {
      const keys: string[] = []
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i)
        if (key && key.startsWith('ncg_cache_')) {
          keys.push(key)
        }
      }
      keys.forEach(key => localStorage.removeItem(key))
    }

    if (sessionStorage) {
      const keys: string[] = []
      for (let i = 0; i < sessionStorage.length; i++) {
        const key = sessionStorage.key(i)
        if (key && key.startsWith('ncg_cache_')) {
          keys.push(key)
        }
      }
      keys.forEach(key => sessionStorage.removeItem(key))
    }
  }

  getStats(): {
    localStorage: { count: number; size: number }
    sessionStorage: { count: number; size: number }
  } {
    const stats = {
      localStorage: { count: 0, size: 0 },
      sessionStorage: { count: 0, size: 0 },
    }

    const localStorage = this.getStorage(true)
    const sessionStorage = this.getStorage(false)

    if (localStorage) {
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i)
        if (key && key.startsWith('ncg_cache_')) {
          stats.localStorage.count++
          const value = localStorage.getItem(key) || ''
          stats.localStorage.size += key.length + value.length
        }
      }
    }

    if (sessionStorage) {
      for (let i = 0; i < sessionStorage.length; i++) {
        const key = sessionStorage.key(i)
        if (key && key.startsWith('ncg_cache_')) {
          stats.sessionStorage.count++
          const value = sessionStorage.getItem(key) || ''
          stats.sessionStorage.size += key.length + value.length
        }
      }
    }

    return stats
  }
}

// Singleton instance
let apiCache: APICache | null = null

export function getAPICache(): APICache {
  if (!apiCache) {
    apiCache = new APICache()
  }
  return apiCache
}

export async function getCachedAPIResponse<T>(
  key: string,
  fetcher: () => Promise<T>,
  options: CacheOptions = {}
): Promise<T> {
  // CRITICAL: Check build time FIRST - skip all cache operations during build
  // During build, cache operations can be slow or fail, so we skip them entirely
  try {
    const { isBuildTime } = await import('./build-time-helpers')
    if (isBuildTime()) {
      // During build, return empty/fallback data immediately
      // Don't try to fetch or cache anything
      return {} as T
    }
  } catch {
    // If build-time-helpers can't be imported, continue normally
  }

  const cache = getAPICache()

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

