/**
 * Performance Utilities
 * 
 * Tools for monitoring and optimizing website performance
 */

export function measurePerformance(name: string) {
  if (typeof window === 'undefined') return () => {}

  const start = performance.now()
  return () => {
    const duration = performance.now() - start
    console.log(`[Performance] ${name}: ${duration.toFixed(2)}ms`)
    
    // Send to analytics if available
    if (typeof window !== 'undefined' && (window as any).gtag) {
      ;(window as any).gtag('event', 'timing_complete', {
        name,
        value: Math.round(duration),
      })
    }
  }
}

export function reportWebVitals(metric: any) {
  // Send to analytics
  if (typeof window !== 'undefined' && (window as any).gtag) {
    ;(window as any).gtag('event', metric.name, {
      value: Math.round(metric.value),
      event_category: 'Web Vitals',
      event_label: metric.id,
      non_interaction: true,
    })
  }
}

export function prefetchRoute(href: string) {
  if (typeof window === 'undefined') return
  
  const link = document.createElement('link')
  link.rel = 'prefetch'
  link.href = href
  document.head.appendChild(link)
}

export function preloadResource(href: string, as: string) {
  if (typeof window === 'undefined') return
  
  const link = document.createElement('link')
  link.rel = 'preload'
  link.href = href
  link.as = as
  document.head.appendChild(link)
}

