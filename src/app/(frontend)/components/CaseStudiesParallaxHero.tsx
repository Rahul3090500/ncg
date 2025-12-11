'use client'

import React, { useEffect, useRef, useState } from 'react'

interface CaseStudiesParallaxHeroProps {
  caseStudiesLabel: string
  caseStudiesHeroTitle: string
  caseStudiesHeroImage?: string | null
}

const CaseStudiesParallaxHero: React.FC<CaseStudiesParallaxHeroProps> = ({
  caseStudiesLabel,
  caseStudiesHeroTitle,
  caseStudiesHeroImage,
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

  return (
    <section
      ref={sectionRef}
      className="h-80 md:h-[500px] lg:h-[664px] text-white relative overflow-hidden bg-[#000F19]"
      style={{
        willChange: 'transform',
      }}
    >
      <div
        className="absolute inset-0 scale-[1.3]"
        style={{
          backgroundImage: caseStudiesHeroImage 
            ? `url('${caseStudiesHeroImage}')` 
            : "url('/assets/8669139b5ad96631528dce4a3734eddb4b03dc40.jpg')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          transform: backgroundTransform,
          willChange: 'transform',
          transition: 'transform 0.1s ease-out',
        }}
      />
      <div
        className="absolute inset-0 bg-black/30 scale-[1.3]"
        style={{
          transform: backgroundTransform,
          willChange: 'transform',
          transition: 'transform 0.1s ease-out',
        }}
      />
      <div
        className="relative z-10 w-full containersection px-4 md:px-9 flex justify-start pb-8 md:pb-12 lg:pb-14 items-end h-full">
        <div className="text-left flex flex-col  w-full max-w-full md:max-w-[950px]">
        <h3
          className="text-white text-sm md:text-base lg:text-[19px] font-manrope-bold uppercase leading-tight md:leading-[17px] tracking-[2px] md:tracking-[3.80px] mb-[18px]"
          style={{
            transform: `translate3d(0, ${parallaxData.scrollY * -0.05}px, 0)`,
            willChange: 'transform',
          }}
        >
          {caseStudiesLabel}
        </h3>
        <h2
          className="text-white text-4xl sm:text-5xl md:text-6xl lg:text-[100px] font-manrope-semibold leading-tight md:leading-[60px] lg:leading-[90px] mb-0 md:mb-4 w-full"
          style={{
            transform: `translate3d(0, ${parallaxData.scrollY * -0.08}px, 0)`,
            willChange: 'transform',
          }}
        >
          {caseStudiesHeroTitle.split('**').map((part: string, index: number) =>
            index % 2 === 0 ? (
              <React.Fragment key={index}>{part}</React.Fragment>
            ) : (
              <span key={index} className="text-[#5799FF]">{part}</span>
            )
          )}
        </h2>
        </div>
      </div>
    </section >
  )
}

export default CaseStudiesParallaxHero
