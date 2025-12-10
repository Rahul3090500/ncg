'use client'

import React, { useEffect, useRef, useState } from 'react'

interface CaseStudiesHeroSectionProps {
  data: {
    overline: string
    heading: string
    backgroundImage?: {
      url: string
    }
  }
}

const CaseStudiesHeroSection = ({ data }: CaseStudiesHeroSectionProps) => {
  const bgImage = data.backgroundImage?.url || '/home-images/case-studies-bg.png'
  const sectionRef = useRef<HTMLElement>(null)
  const [parallaxData, setParallaxData] = useState({
    scrollY: 0,
    opacity: 1,
  })
  const rafId = useRef<number | null>(null)

  useEffect(() => {
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
  const contentTransform = `translate3d(0, ${parallaxData.scrollY * 0.15}px, 0)`

  return (
    <section
      ref={sectionRef}
      className="h-[400px] md:h-[500px] lg:h-[539px] text-white relative overflow-hidden"
      style={{
        willChange: 'transform',
      }}
    >
      {/* Background Layer - Moves slowest for depth */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `url('${bgImage}')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          transform: backgroundTransform,
          willChange: 'transform',
          transition: 'transform 0.1s ease-out',
        }}
      />

      {/* Overlay Layer - Moves at medium speed */}
      <div
        className="absolute inset-0 bg-black/30"
        style={{
          transform: backgroundTransform,
          willChange: 'transform',
          transition: 'transform 0.1s ease-out',
        }}
      />

      {/* Content Layer - Moves fastest, stays in foreground */}
      <div
        className="relative z-10 w-full containersection px-4 md:px-6 flex justify-start pb-8 md:pb-12 lg:pb-14 items-end h-full"
        style={{
          transform: contentTransform,
          opacity: parallaxData.opacity,
          willChange: 'transform, opacity',
          transition: 'transform 0.1s ease-out, opacity 0.2s ease-out',
        }}
      >
        <div className="text-left w-full max-w-full md:max-w-[950px]">
          <h3
            className="text-white text-sm md:text-base lg:text-[19px] font-manrope-bold uppercase leading-tight md:leading-[17px] tracking-[2px] md:tracking-[3.80px] mb-3 md:mb-4"
            style={{
              transform: `translate3d(0, ${parallaxData.scrollY * -0.05}px, 0)`,
              willChange: 'transform',
            }}
          >
            {data.overline}
          </h3>
          <h2
            className="text-white text-4xl sm:text-5xl md:text-6xl lg:text-[100px] font-manrope-semibold leading-tight md:leading-[60px] lg:leading-[90px] mb-0 md:mb-4 w-full"
            style={{
              transform: `translate3d(0, ${parallaxData.scrollY * -0.08}px, 0)`,
              willChange: 'transform',
            }}
          >
            {data.heading.split('\n').map((line, index) => (
              <React.Fragment key={index}>
                {line}
                {index < data.heading.split('\n').length - 1 && <br />}
              </React.Fragment>
            ))}
          </h2>
        </div>
      </div>
    </section>
  )
}

export default CaseStudiesHeroSection