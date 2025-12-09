'use client'

/**
 * Prefetch Hook
 * 
 * React hook for prefetching routes
 */

import { useEffect, useRef } from 'react'
import { prefetchOnHover, prefetchOnVisible } from '@/lib/prefetch'

export function usePrefetch(href: string, trigger: 'hover' | 'visible' = 'hover') {
  const ref = useRef<HTMLElement>(null)

  useEffect(() => {
    if (!ref.current) return

    if (trigger === 'hover') {
      return prefetchOnHover(ref.current, href)
    } else {
      return prefetchOnVisible(ref.current, href)
    }
  }, [href, trigger])

  return ref
}

