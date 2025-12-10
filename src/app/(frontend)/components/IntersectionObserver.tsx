'use client'

/**
 * Intersection Observer Component
 * 
 * Lazy loads content when it enters viewport
 */

import { useEffect, useRef, useState, ReactNode } from 'react'

interface IntersectionObserverProps {
  children: ReactNode
  fallback?: ReactNode
  rootMargin?: string
  threshold?: number
  triggerOnce?: boolean
}

export function IntersectionObserver({
  children,
  fallback = null,
  rootMargin = '100px',
  threshold = 0,
  triggerOnce = true,
}: IntersectionObserverProps) {
  const [isVisible, setIsVisible] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!ref.current || (isVisible && triggerOnce)) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          if (triggerOnce) {
            observer.disconnect()
          }
        }
      },
      { rootMargin, threshold }
    )

    observer.observe(ref.current)

    return () => {
      observer.disconnect()
    }
  }, [rootMargin, threshold, triggerOnce, isVisible])

  return (
    <div ref={ref}>
      {isVisible ? children : fallback}
    </div>
  )
}

