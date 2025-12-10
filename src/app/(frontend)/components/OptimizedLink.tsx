'use client'

/**
 * Optimized Link Component
 * 
 * Link component with automatic prefetching
 */

import Link from 'next/link'
import { usePrefetch } from '../hooks/usePrefetch'
import { ReactNode } from 'react'

interface OptimizedLinkProps {
  href: string
  children: ReactNode
  className?: string
  prefetch?: boolean
  prefetchTrigger?: 'hover' | 'visible'
  [key: string]: any
}

export function OptimizedLink({
  href,
  children,
  className = '',
  prefetch = true,
  prefetchTrigger = 'hover',
  ...props
}: OptimizedLinkProps) {
  const ref = usePrefetch(prefetch ? href : '', prefetchTrigger)

  return (
    <Link href={href} className={className} ref={ref as any} {...props}>
      {children}
    </Link>
  )
}

