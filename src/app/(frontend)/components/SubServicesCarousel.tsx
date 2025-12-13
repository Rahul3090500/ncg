'use client'

import React, { useRef, useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import AnimatedButton from './AnimatedButton'
import ArrowButton from './ArrowButton'

interface SubService {
  id?: string | number
  slug: string
  title: string
  description: string
  heroImage?: {
    url?: string
  }
}

interface SubServicesCarouselProps {
  subServices: SubService[]
  serviceSlug: string
}

const SubServicesCarousel: React.FC<SubServicesCarouselProps> = ({
  subServices,
  serviceSlug,
}) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [isTablet, setIsTablet] = useState(false)
  const cardWidth = 505 // Width of each card (desktop)
  const gap = 1 // Gap between cards (ml-px = 1px)

  const checkScrollability = () => {
    if (!scrollContainerRef.current) return

    const container = scrollContainerRef.current
    const { scrollLeft, scrollWidth, clientWidth } = container

    setCanScrollLeft(scrollLeft > 10) // 10px threshold
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10)
  }

  useEffect(() => {
    const container = scrollContainerRef.current
    if (!container) return

    const checkScreenSize = () => {
      const width = window.innerWidth
      setIsMobile(width < 768)
      setIsTablet(width >= 768 && width < 1024)
    }

    // Check initial state
    checkScreenSize()
    checkScrollability()

    // Listen to scroll events
    container.addEventListener('scroll', checkScrollability)

    // Check on resize
    window.addEventListener('resize', () => {
      checkScreenSize()
      checkScrollability()
    })

    return () => {
      container.removeEventListener('scroll', checkScrollability)
      window.removeEventListener('resize', checkScrollability)
    }
  }, [subServices])

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current
      const scrollAmount = isMobile 
        ? container.clientWidth 
        : isTablet 
        ? container.clientWidth / 2 
        : cardWidth + gap
      container.scrollBy({
        left: -scrollAmount,
        behavior: 'smooth',
      })
    }
  }

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current
      const scrollAmount = isMobile 
        ? container.clientWidth 
        : isTablet 
        ? container.clientWidth / 2 
        : cardWidth + gap
      container.scrollBy({
        left: scrollAmount,
        behavior: 'smooth',
      })
    }
  }

  if (!subServices || subServices.length === 0) {
    return null
  }

  const showNavigation = subServices.length > (isMobile ? 1 : isTablet ? 2 : 3)
  const isMobileOrTablet = isMobile || isTablet

  return (
    <div className="relative bg-[#F4F7FF] pb-12 md:pb-16 lg:pb-[100px]">
      {/* Cards Container */}
      <div
        className="overflow-x-auto scrollbar-hide"
        ref={scrollContainerRef}
        onScroll={checkScrollability}
      >
        <div className="flex lg:px-0 gap-0 items-stretch">
          {subServices.map((subService, index) => (
            <motion.div
              key={subService.id || index}
              initial="default"
              whileHover={isMobileOrTablet ? "default" : "hover"}
              variants={{
                default: {},
                hover: {},
              }}
              className="w-full md:w-[calc(50%-4px)] lg:w-[505px] bg-white border-[0.5px] border-[#DDE9F1] flex flex-col overflow-hidden group shrink-0"
            >
                {/* TOP IMAGE CONTAINER — fixed height for consistency across all cards */}
                <div className="relative w-full overflow-hidden flex-shrink-0" style={{ height: isMobileOrTablet ? '90px' : '137px' }}>
                  {subService.heroImage?.url ? (
                    <img
                      src={subService.heroImage.url}
                      alt=""
                      className="absolute inset-0 w-full h-full object-cover object-center"
                      style={{
                        objectFit: 'cover',
                        objectPosition: 'center'
                      }}
                    />
                  ) : (
                    <div className="absolute inset-0 w-full h-full bg-gray-200" />
                  )}
                  {/* NUMBER — fixed position, mobile/tablet shows hovered state */}
                  <div 
                    className="absolute text-white font-manrope-medium text-lg md:text-xl lg:text-[21px] leading-tight md:leading-[23px] left-4 md:left-6 lg:left-[29px] z-10"
                    style={{ top: isMobileOrTablet ? '34px' : '57px' }}
                  >
                    {String(index + 1).padStart(2, "0")}
                  </div>
                </div>

                {/* CONTENT SECTION — grows to fill space, ensuring equal card heights */}
                <div className="flex-1 flex flex-col px-4 md:px-6 lg:px-8 pt-4 md:pt-5 lg:pt-6 pb-4 md:pb-6 lg:pb-0 relative">
                  {/* TITLE — animates upward, mobile/tablet shows hovered state */}
                  <motion.h3
                    className="text-[#000F19] font-manrope-bold text-lg md:text-xl leading-5 md:leading-6 mb-2 md:mb-3 flex-shrink-0"
                    variants={{
                      default: { marginTop: 0 },
                      hover: { marginTop: -4 },
                    }}
                    animate={isMobileOrTablet ? "hover" : undefined}
                    transition={{ duration: 0.35, ease: "easeInOut" }}
                  >
                    {subService.title}
                  </motion.h3>

                  {/* DESCRIPTION — grows to fill available space */}
                  <motion.p
                    className="text-[#000F19]/60 text-sm md:text-base font-manrope-medium leading-5 mb-3 md:mb-4 flex-1 min-h-0"
                    variants={{
                      default: { marginTop: 0 },
                      hover: { marginTop: -4 },
                    }}
                    animate={isMobileOrTablet ? "hover" : undefined}
                    transition={{ duration: 0.35, ease: "easeInOut" }}
                  >
                    {subService.description}
                  </motion.p>

                  {/* BUTTON — fades in + slides up on desktop, always visible on mobile/tablet */}
                  <motion.div
                    className={isMobileOrTablet ? "mb-2 mt-auto" : "mb-8 md:mb-12 lg:mb-16 mt-auto"}
                    variants={{
                      default: { 
                        opacity: 0, 
                        marginBottom: 90 
                      },
                      hover: { 
                        opacity: 1, 
                        marginBottom: isMobileOrTablet ? 8 : 90 ,
                        marginTop: isMobileOrTablet ? 30 : 0
                      },
                    }}
                    animate={isMobileOrTablet ? "hover" : undefined}
                    transition={{ duration: 0.35, ease: "easeInOut" }}
                  >
                    <AnimatedButton link={`/services/${serviceSlug}/${subService.slug}`} text="Learn More" width='w-36' />
                  </motion.div>
                </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Navigation Buttons */}
      {showNavigation && (
        <div className="flex justify-center gap-4 pt-8 md:pt-12 lg:pt-[57px]">
          <ArrowButton
            direction="left"
            onClick={scrollLeft}
            disabled={!canScrollLeft}
            ariaLabel="Scroll left"
          />

          <ArrowButton
            direction="right"
            onClick={scrollRight}
            disabled={!canScrollRight}
            ariaLabel="Scroll right"
          />
        </div>
      )}
    </div>
  )
}

export default SubServicesCarousel


