'use client'

import React, { useEffect, useRef, useState } from 'react'

interface HeroParallaxImageProps {
  imageUrl?: string
  alt?: string
  gradientFallback?: boolean
}

const HeroParallaxImage: React.FC<HeroParallaxImageProps> = ({
  imageUrl,
  alt = 'Hero image',
  gradientFallback = true,
}) => {
  const sectionRef = useRef<HTMLDivElement>(null)
  const [parallaxData, setParallaxData] = useState({
    scrollY: 0,
  })
  const rafId = useRef<number | null>(null)

  useEffect(() => {
    // Check if we're in browser environment
    if (typeof window === 'undefined') return

    const handleScroll = () => {
      if (rafId.current) {
        cancelAnimationFrame(rafId.current)
      }

      rafId.current = requestAnimationFrame(() => {
        if (!sectionRef.current) return

        const rect = sectionRef.current.getBoundingClientRect()
        const sectionTop = rect.top

        // Calculate parallax offset
        const parallaxOffset = sectionTop * 0.3

        setParallaxData({
          scrollY: parallaxOffset,
        })
      })
    }

    // Initial check
    handleScroll()

    window.addEventListener('scroll', handleScroll, { passive: true })
    window.addEventListener('resize', handleScroll, { passive: true })

    return () => {
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('resize', handleScroll)
      if (rafId.current) {
        cancelAnimationFrame(rafId.current)
      }
    }
  }, [])

  // Calculate parallax transform with scale 1.2
  const backgroundTransform = `translate3d(0, ${parallaxData.scrollY * 0.4}px, 0) scale(1.2)`

  return (
    <div
      ref={sectionRef}
      className="relative w-full h-64 md:h-80 lg:h-[500px] overflow-hidden"
      style={{
        willChange: 'transform',
      }}
    >
      {imageUrl ? (
        <div
          className="absolute inset-0 scale-[1.4]"
          style={{
            backgroundImage: `url('${imageUrl}')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            transform: backgroundTransform,
            willChange: 'transform',
            transition: 'transform 0.1s ease-out',
          }}
        />
      ) : gradientFallback ? (
        <div
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(to right, #E3F2FD 0%, #F3E5F5 100%)',
          }}
        />
      ) : null}
    </div>
  )
}

export default HeroParallaxImage
