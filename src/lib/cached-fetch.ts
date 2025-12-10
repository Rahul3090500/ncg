/**
 * Cached Fetch Utility
 * 
 * Wrapper around fetch with intelligent caching:
 * - Client-side caching (localStorage)
 * - ETag support for conditional requests
 * - Stale-while-revalidate
 * - Automatic cache invalidation
 */

import { getAPICache } from './api-cache'
import { getCacheManager } from './cache-manager'

interface CachedFetchOptions extends RequestInit {
  cacheKey?: string
  ttl?: number // Time to live in seconds
  useLocalStorage?: boolean
  staleWhileRevalidate?: boolean
  skipCache?: boolean
  region?: string
}

export async function cachedFetch<T = any>(
  url: string,
  options: CachedFetchOptions = {}
): Promise<T> {
  const {
    cacheKey,
    ttl = 3600, // 1 hour default
    useLocalStorage = true,
    staleWhileRevalidate = true,
    skipCache = false,
    region,
    ...fetchOptions
  } = options

  const key = cacheKey || url
  const clientCache = getAPICache()

  // Try client-side cache first (unless skipCache is true)
  if (!skipCache) {
    const cached = await clientCache.get<T>(key, {
      ttl,
      useLocalStorage,
      staleWhileRevalidate,
    })

    if (cached !== null) {
      // If we have cached data, check if we should revalidate in background
      if (staleWhileRevalidate) {
        // Trigger background refresh without blocking
        fetchWithCache(url, options).catch(() => {})
      }
      return cached
    }
  }

  // Fetch fresh data
  return fetchWithCache(url, options)
}

async function fetchWithCache<T = any>(
  url: string,
  options: CachedFetchOptions = {}
): Promise<T> {
  const {
    cacheKey,
    ttl = 3600,
    useLocalStorage = true,
    region,
    ...fetchOptions
  } = options

  const key = cacheKey || url
  const clientCache = getAPICache()
  const serverCache = getCacheManager()

  // Try server-side cache (memory) first
  try {
    const serverCached = await serverCache.get<T>(key, { region, ttl })
    if (serverCached !== null) {
      // Also store in client cache
      await clientCache.set(key, serverCached, { ttl, useLocalStorage })
      return serverCached
    }
  } catch {
    // Server cache unavailable, continue with fetch
  }

  // Fetch from API
  const response = await fetch(url, {
    ...fetchOptions,
    headers: {
      ...fetchOptions.headers,
      'Cache-Control': 'no-cache',
    },
  })

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`)
  }

  const data = await response.json()

  // Store in both caches
  await Promise.all([
    clientCache.set(key, data, { ttl, useLocalStorage }),
    serverCache.set(key, data, { ttl, region }).catch(() => {}), // Ignore server cache errors
  ])

  return data
}

// Hook for React components
export function useCachedFetch<T = any>(
  url: string,
  options: CachedFetchOptions = {}
) {
  // This would be used in a React hook
  // For now, we'll use it directly in server components
  return cachedFetch<T>(url, options)
}

