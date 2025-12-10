'use client'

import React, { useEffect, useRef, useState } from 'react'
import Link from 'next/link'

interface SuccessStoriesParallaxProps {
  successStoriesTitle: string
  successStoriesDescription: string
  successStoriesCtaText?: string
  successStoriesCtaLink?: string
  successStoriesBackgroundImage?: {
    url: string
  }
}

const SuccessStoriesParallax: React.FC<SuccessStoriesParallaxProps> = ({
  successStoriesTitle,
  successStoriesDescription,
  successStoriesCtaText,
  successStoriesCtaLink = '#',
  successStoriesBackgroundImage,
}) => {
  const sectionRef = useRef<HTMLElement>(null)
  const [parallaxData, setParallaxData] = useState({
    scrollY: 0,
    opacity: 1,
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
        const windowHeight = window.innerHeight
        const sectionTop = rect.top

        // Calculate parallax offset - more aggressive when scrolling past
        const parallaxOffset = sectionTop * 0.5

        // Calculate opacity fade effect based on scroll position
        // Fade in as section enters viewport, fade out as it leaves
        const scrollProgress = Math.max(
          0,
          Math.min(1, (windowHeight - sectionTop) / (windowHeight * 0.8))
        )
        const opacity = Math.max(0.4, Math.min(1, scrollProgress))

        setParallaxData({
          scrollY: parallaxOffset,
          opacity,
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

  // Calculate parallax transforms for different layers with different speeds
  // Background moves slowest (0.4x), overlay medium (0.25x), content fastest (0.15x)
  const backgroundTransform = `translate3d(0, ${parallaxData.scrollY * 0.4}px, 0) scale(1.15)`
  const overlayTransform = `translate3d(0, ${parallaxData.scrollY * 0.25}px, 0)`
  const contentTransform = `translate3d(0, ${parallaxData.scrollY * -0.08}px, 0)`

  return (
    <section
      ref={sectionRef}
      className="relative py-12 md:py-16 lg:py-32 overflow-hidden h-[400px] md:h-[500px] lg:h-[664px] flex items-center"
      style={{
        willChange: 'transform',
      }}
    >
      {successStoriesBackgroundImage?.url ? (
        <>
          <div
            className="absolute inset-0 scale-[1.3] md:scale-[1.3] lg:scale-[1.3]"
            style={{
              backgroundImage: `url('${successStoriesBackgroundImage.url}')`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
              transform: backgroundTransform,
              willChange: 'transform',
              transition: 'transform 0.1s ease-out',
            }}
          />
          <div
            className="absolute inset-0 bg-black/70 scale-[1.3] md:scale-[1.3] lg:scale-[1.3]"
            style={{
              transform: backgroundTransform,
              willChange: 'transform',
              transition: 'transform 0.1s ease-out',
            }}
          />
        </>
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-[#000F19] via-[#1a2d3d] to-[#000F19]" />
      )}
      <div className="relative z-10 containersection px-4 md:px-6 lg:px-52">
        <div className="mx-auto">
          <h2 className="text-white font-manrope-medium text-3xl md:text-5xl lg:text-8xl leading-tight md:leading-[60px] lg:leading-[90px] mb-3 md:mb-4 lg:mb-5 mt-0 md:mt-8 lg:mt-[100px]">
            {successStoriesTitle}
          </h2>
          <p className="text-white text-sm md:text-base lg:text-xl font-manrope-light leading-6 md:leading-7 lg:leading-8 w-full md:w-[90%] lg:w-[1181px] mb-4 md:mb-6 lg:mb-[37px]">
            {successStoriesDescription}
          </p>
          {successStoriesCtaText && (
            <Link
              href={successStoriesCtaLink}
              className="text-blue-300 font-manrope-medium text-base md:text-lg lg:text-xl inline-block"
            >
              {successStoriesCtaText}
            </Link>
          )}
        </div>
      </div>
    </section>
  )
}

export default SuccessStoriesParallax

