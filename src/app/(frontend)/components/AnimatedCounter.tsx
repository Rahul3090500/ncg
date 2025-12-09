'use client'

import React, { useState, useEffect, useRef } from 'react'

interface AnimatedCounterProps {
  value: string | number
  duration?: number
  className?: string
}

const AnimatedCounter: React.FC<AnimatedCounterProps> = ({ 
  value, 
  duration = 2000,
  className = '' 
}) => {
  const [count, setCount] = useState(0)
  const [isVisible, setIsVisible] = useState(false)
  const elementRef = useRef<HTMLDivElement>(null)
  const hasAnimatedRef = useRef(false)

  // Parse the value - it might contain non-numeric characters like "50+" or "10K+"
  const parseValue = (val: string | number): { numeric: number; suffix: string } => {
    const str = String(val)
    const match = str.match(/^(\d+\.?\d*)(.*)$/)
    
    if (match) {
      return {
        numeric: parseFloat(match[1]),
        suffix: match[2] || ''
      }
    }
    
    return { numeric: 0, suffix: '' }
  }

  const { numeric: targetValue, suffix } = parseValue(value)

  useEffect(() => {
    // If already animated, set final value and don't observe
    if (hasAnimatedRef.current) {
      setCount(targetValue)
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimatedRef.current) {
          // Reset count and trigger animation when entering viewport for the first time
          setCount(0)
          setIsVisible(true)
          hasAnimatedRef.current = true
          // Stop observing after first animation
          observer.unobserve(entry.target)
        }
      },
      {
        threshold: 0.3, // Trigger when 30% of the element is visible
      }
    )

    if (elementRef.current) {
      observer.observe(elementRef.current)
    }

    return () => {
      const element = elementRef.current
      if (element) {
        observer.unobserve(element)
      }
    }
  }, [targetValue])

  useEffect(() => {
    if (!isVisible) return

    let startTime: number | null = null
    let animationFrame: number

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp
      const progress = timestamp - startTime

      if (progress < duration) {
        // Ease out function for smooth animation
        const easeOutQuad = (t: number) => t * (2 - t)
        const percentage = easeOutQuad(progress / duration)
        setCount(Math.floor(targetValue * percentage))
        animationFrame = requestAnimationFrame(animate)
      } else {
        setCount(targetValue)
      }
    }

    animationFrame = requestAnimationFrame(animate)

    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame)
      }
    }
  }, [isVisible, targetValue, duration])

  return (
    <div ref={elementRef} className={className}>
      {count}{suffix}
    </div>
  )
}

export default AnimatedCounter

