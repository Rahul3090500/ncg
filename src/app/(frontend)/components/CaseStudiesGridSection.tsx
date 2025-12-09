'use client'

import React, { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import type { Swiper as SwiperType } from 'swiper'
import { RealEstateIcon, FinanceIcon, HealthcareIcon } from './icons'
import AnimatedButton from './AnimatedButton'
import CaseStudiesGrid from './CaseStudiesGrid'

// Dynamically import Swiper component with SSR disabled to avoid hydration issues
const CaseStudiesSwiper = dynamic(() => import('./CaseStudiesSwiper'), {
  ssr: false,
  loading: () => <div className="h-[450px] md:h-[520px] w-full" />
})

interface CaseStudiesGridSectionProps {
  data: {
    caseStudies: Array<{
      id: string
      image?: {
        url: string
      }
      category: string
      iconType: string
      iconAssetUrl?: string
      title: string
      description: string
      link?: string
      slug?: string
    }>
    buttonText: string
    buttonLink: string
  }
  showButton?: boolean
  showTitle?: boolean
  useSwiper?: boolean // Prop to control swiper vs grid layout
}

const CaseStudiesGridSection = ({ data, showButton = true, showTitle = false, useSwiper = true }: CaseStudiesGridSectionProps) => {
  const [swiper, setSwiper] = useState<SwiperType | null>(null)
  const [currentSlide, setCurrentSlide] = useState(0)
  const [slidesPerView, setSlidesPerView] = useState(1)
  const [isMounted, setIsMounted] = useState(false)
  const [isDesktop, setIsDesktop] = useState(false)

  const getIcon = (iconType: string, iconAssetUrl?: string) => {
    if (iconAssetUrl) return <img src={iconAssetUrl} alt="Icon" className="w-4 h-4" />
    switch (iconType) {
      case 'realEstate':
        return <RealEstateIcon className="w-4 h-4" />
      case 'finance':
        return <FinanceIcon className="w-4 h-4" />
      case 'healthcare':
        return <HealthcareIcon className="w-4 h-4" />
      default:
        return null
    }
  }

  const { caseStudies, buttonText, buttonLink } = data

  // Set mounted state to avoid hydration issues
  useEffect(() => {
    setIsMounted(true)
  }, [])

  // Determine slides per view and screen size
  useEffect(() => {
    if (!isMounted) return

    const updateSlidesPerView = () => {
      const width = window.innerWidth
      setIsDesktop(width >= 1024)
      if (width >= 1024) {
        // Desktop: show all cards
        setSlidesPerView(caseStudies.length)
      } else if (width >= 768) {
        // Tablet: show 2 cards
        setSlidesPerView(2)
      } else {
        // Mobile: show 1 card
        setSlidesPerView(1)
      }
    }

    updateSlidesPerView()
    window.addEventListener('resize', updateSlidesPerView)
    return () => window.removeEventListener('resize', updateSlidesPerView)
  }, [caseStudies.length, isMounted])

  // Determine whether to use swiper or grid
  // If showButton is true: use grid on desktop, swiper on tablet/mobile
  // If showButton is false: use swiper on all devices (if useSwiper is true)
  const shouldUseSwiper = useSwiper && (!showButton || !isDesktop)

  // Calculate total slides for pagination
  // For 'auto' mode or when showing all cards, pagination is per card
  const totalSlides = caseStudies.length

  // Handle slide change
  const handleSlideChange = (swiper: SwiperType) => {
    // Update current slide based on active index
    setCurrentSlide(swiper.activeIndex)
  }

  if (!caseStudies || caseStudies.length === 0) {
    return null
  }

  // Show loading state until mounted to avoid hydration mismatch (only for swiper)
  if (!isMounted && shouldUseSwiper) {
    return (
      <section className="pt-6 md:pt-10 pb-12 md:pb-20 bg-white">
        <div className="w-full mx-auto flex flex-col items-center">
          {showTitle && (
            <div className="text-center mb-8 md:mb-12 lg:mb-[64px]">
              <h2 className="text-slate-950 text-2xl md:text-4xl lg:text-5xl font-manrope-bold leading-tight md:leading-[60px] lg:leading-[70px]">Related Case Studies</h2>
            </div>
          )}
          <div className="containersection px-4 md:px-6">
            <div className="h-[450px] md:h-[520px] w-full" />
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="pt-6 md:pt-10 pb-12 md:pb-20 bg-white">
      <div className="w-full mx-auto flex flex-col items-center">
        {showTitle && (
          <div className="text-center mb-8 md:mb-12 lg:mb-[64px]">
            <h2 className="text-slate-950 text-2xl md:text-4xl lg:text-5xl font-manrope-bold leading-tight md:leading-[60px] lg:leading-[70px]">Related Case Studies</h2>
          </div>
        )}
        
        {shouldUseSwiper ? (
          /* Swiper/Carousel Layout - Used on tablet/mobile when showButton is true, or all devices when showButton is false */
          <div className="containersection px-4 md:px-6">
            <CaseStudiesSwiper
              caseStudies={caseStudies}
              getIcon={getIcon}
              onSwiperChange={setSwiper}
              onSlideChange={handleSlideChange}
            />

            {/* Custom Pagination Dots */}
            {caseStudies.length > 1 && (
              <div className="flex justify-center items-center gap-2 mt-6 md:mt-8">
                {caseStudies.map((_, index) => {
                  const isActive = swiper ? swiper.activeIndex === index : index === currentSlide
                  return (
                    <button
                      key={index}
                      onClick={() => swiper?.slideTo(index)}
                      className={`h-2 rounded-full transition-all duration-300 ${
                        isActive
                          ? 'bg-[#488BF3] w-8'
                          : 'bg-[#488BF3]/30 hover:bg-[#488BF3]/50 w-2'
                      }`}
                      aria-label={`Go to slide ${index + 1}`}
                    />
                  )
                })}
              </div>
            )}
          </div>
        ) : (
          /* Grid Layout */
          <CaseStudiesGrid caseStudies={caseStudies} getIcon={getIcon} />
        )}

        {showButton && (
          <div className="text-center mt-8 md:mt-12 lg:mt-15">
            <div className="flex items-center mx-auto w-fit">
              <AnimatedButton link={buttonLink} text={buttonText} />
            </div>
          </div>
        )}
      </div>
    </section>
  )
}

export default CaseStudiesGridSection
