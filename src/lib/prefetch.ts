/**
 * Route Prefetching Utility
 * 
 * Prefetches routes on hover or when in viewport
 */

export function prefetchRoute(href: string) {
  if (typeof window === 'undefined') return

  // Use Next.js router prefetch
  const link = document.createElement('link')
  link.rel = 'prefetch'
  link.href = href
  link.as = 'document'
  document.head.appendChild(link)
}

export function prefetchOnHover(element: HTMLElement, href: string) {
  if (typeof window === 'undefined') return

  let prefetched = false

  const handleMouseEnter = () => {
    if (!prefetched) {
      prefetchRoute(href)
      prefetched = true
    }
  }

  element.addEventListener('mouseenter', handleMouseEnter, { once: true })

  return () => {
    element.removeEventListener('mouseenter', handleMouseEnter)
  }
}

export function prefetchOnVisible(element: HTMLElement, href: string) {
  if (typeof window === 'undefined') return

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          prefetchRoute(href)
          observer.disconnect()
        }
      })
    },
    { rootMargin: '200px' } // Start prefetching 200px before visible
  )

  observer.observe(element)

  return () => {
    observer.disconnect()
  }
}

