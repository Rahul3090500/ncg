'use client'

/**
 * Performance Monitor Component
 * 
 * Monitors and reports Core Web Vitals
 * Only active in development mode
 */

import { useEffect } from 'react'
import { onCLS, onFCP, onLCP, onTTFB, onINP } from 'web-vitals'

export function PerformanceMonitor() {
  useEffect(() => {
    if (process.env.NODE_ENV !== 'development') return

    const reportMetric = (metric: any) => {
      console.log(`[Web Vital] ${metric.name}:`, {
        value: metric.value,
        rating: metric.rating,
        id: metric.id,
      })
    }

    onCLS(reportMetric)
    onFCP(reportMetric)
    onLCP(reportMetric)
    onTTFB(reportMetric)
    onINP(reportMetric)
  }, [])

  return null
}

