'use client'

/**
 * React Hook for Cached Data
 * 
 * Provides React hook for fetching and caching data on the client side
 */

import { useEffect, useState, useCallback } from 'react'
import { cachedFetch } from '@/lib/cached-fetch'
import { getAPICache } from '@/lib/api-cache'

interface UseCachedDataOptions {
  ttl?: number
  useLocalStorage?: boolean
  staleWhileRevalidate?: boolean
  enabled?: boolean
}

export function useCachedData<T = any>(
  url: string,
  options: UseCachedDataOptions = {}
) {
  const {
    ttl = 3600,
    useLocalStorage = true,
    staleWhileRevalidate = true,
    enabled = true,
  } = options

  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const fetchData = useCallback(async () => {
    if (!enabled) return

    setLoading(true)
    setError(null)

    try {
      // Try cache first
      const cache = getAPICache()
      const cached = await cache.get<T>(url, {
        ttl,
        useLocalStorage,
        staleWhileRevalidate,
      })

      if (cached !== null) {
        setData(cached)
        setLoading(false)

        // If stale, refresh in background
        if (staleWhileRevalidate) {
          try {
            const fresh = await cachedFetch<T>(url, {
              cacheKey: url,
              ttl,
              useLocalStorage,
              staleWhileRevalidate: false,
            })
            setData(fresh)
          } catch {
            // Ignore refresh errors, keep cached data
          }
        }
        return
      }

      // No cache, fetch fresh
      const fresh = await cachedFetch<T>(url, {
        cacheKey: url,
        ttl,
        useLocalStorage,
        staleWhileRevalidate: false,
      })
      setData(fresh)
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch data'))
    } finally {
      setLoading(false)
    }
  }, [url, ttl, useLocalStorage, staleWhileRevalidate, enabled])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const refetch = useCallback(() => {
    // Clear cache and refetch
    const cache = getAPICache()
    cache.invalidate(url)
    fetchData()
  }, [url, fetchData])

  return { data, loading, error, refetch }
}

