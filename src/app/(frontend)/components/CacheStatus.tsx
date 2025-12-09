'use client'

/**
 * Cache Status Component
 * 
 * Shows cache status for debugging (development only)
 */

import { useCache } from './ClientCacheProvider'

export function CacheStatus() {
  const { stats, clear } = useCache()

  // Only show in development
  if (process.env.NODE_ENV !== 'development') {
    return null
  }

  return (
    <div className="fixed bottom-4 right-4 bg-black/80 text-white p-4 rounded-lg text-xs z-50">
      <div className="font-manrope-bold mb-2">Cache Status</div>
      <div>LocalStorage: {stats.localStorage.count} entries ({Math.round(stats.localStorage.size / 1024)}KB)</div>
      <div>SessionStorage: {stats.sessionStorage.count} entries ({Math.round(stats.sessionStorage.size / 1024)}KB)</div>
      <button
        onClick={clear}
        className="mt-2 px-2 py-1 bg-red-600 rounded text-xs hover:bg-red-700"
      >
        Clear Cache
      </button>
    </div>
  )
}

