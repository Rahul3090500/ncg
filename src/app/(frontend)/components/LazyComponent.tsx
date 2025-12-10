'use client'

/**
 * Lazy Component Loader
 * 
 * Dynamically imports components only when needed
 */

import dynamic from 'next/dynamic'
import { ComponentType } from 'react'

interface LazyComponentOptions {
  loading?: () => JSX.Element
  ssr?: boolean
}

export function createLazyComponent<P = {}>(
  importFunc: () => Promise<{ default: ComponentType<P> }>,
  options: LazyComponentOptions = {}
) {
  return dynamic(importFunc, {
    loading: options.loading || (() => (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    )),
    ssr: options.ssr !== false,
  })
}

