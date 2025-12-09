'use client'

/**
 * Client Cache Provider
 * 
 * Provides client-side caching context for React components
 * - Manages localStorage/sessionStorage cache
 * - Handles cache invalidation
 * - Provides cache stats
 */

import React, { createContext, useContext, useEffect, useState } from 'react'
import { getAPICache } from '@/lib/api-cache'

interface CacheContextType {
  invalidate: (key: string) => void
  invalidatePattern: (pattern: string) => void
  clear: () => void
  stats: {
    localStorage: { count: number; size: number }
    sessionStorage: { count: number; size: number }
  }
}

const CacheContext = createContext<CacheContextType | null>(null)

export function ClientCacheProvider({ children }: { children: React.ReactNode }) {
  const [stats, setStats] = useState({
    localStorage: { count: 0, size: 0 },
    sessionStorage: { count: 0, size: 0 },
  })

  const cache = getAPICache()

  useEffect(() => {
    // Update stats on mount
    setStats(cache.getStats())

    // Listen for storage events (cache updates from other tabs)
    const handleStorageChange = () => {
      setStats(cache.getStats())
    }

    window.addEventListener('storage', handleStorageChange)
    return () => window.removeEventListener('storage', handleStorageChange)
  }, [])

  const invalidate = (key: string) => {
    cache.invalidate(key)
    setStats(cache.getStats())
  }

  const invalidatePattern = (pattern: string) => {
    cache.invalidatePattern(pattern)
    setStats(cache.getStats())
  }

  const clear = () => {
    cache.clear()
    setStats(cache.getStats())
  }

  return (
    <CacheContext.Provider value={{ invalidate, invalidatePattern, clear, stats }}>
      {children}
    </CacheContext.Provider>
  )
}

export function useCache() {
  const context = useContext(CacheContext)
  if (!context) {
    throw new Error('useCache must be used within ClientCacheProvider')
  }
  return context
}

