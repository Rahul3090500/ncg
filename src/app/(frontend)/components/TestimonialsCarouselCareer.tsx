'use client'

import React, { useRef, useState, useEffect } from 'react'

interface Testimonial {
  image?: { url: string }
  name?: string
  role?: string
  quote?: string
}

interface TestimonialsCarouselCareerProps {
  testimonials: Testimonial[]
}

const TestimonialsCarouselCareer: React.FC<TestimonialsCarouselCareerProps> = ({ testimonials }) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(false)

  const checkScrollPosition = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current
      setCanScrollLeft(scrollLeft > 0)
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 1)
    }
  }

  useEffect(() => {
    checkScrollPosition()
    const container = scrollContainerRef.current
    if (container) {
      container.addEventListener('scroll', checkScrollPosition)
      return () => {
        container.removeEventListener('scroll', checkScrollPosition)
        // Clean up any pending timeouts
        if (scrollTimeoutRef.current) {
          clearTimeout(scrollTimeoutRef.current)
        }
      }
    }
  }, [testimonials])

  const scrollLeft = () => {
    if (scrollContainerRef.current && canScrollLeft) {
      scrollContainerRef.current.scrollBy({
        left: -400,
        behavior: 'smooth'
      })
      // Clear any existing timeout
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current)
      }
      // Update scroll position after animation
      scrollTimeoutRef.current = setTimeout(checkScrollPosition, 300)
    }
  }

  const scrollRight = () => {
    if (scrollContainerRef.current && canScrollRight) {
      scrollContainerRef.current.scrollBy({
        left: 400,
        behavior: 'smooth'
      })
      // Clear any existing timeout
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current)
      }
      // Update scroll position after animation
      scrollTimeoutRef.current = setTimeout(checkScrollPosition, 300)
    }
  }

  return (
    <section className="pb-[100px] pt-[80px] md:pt-[80px] lg:pt-[20px] px-0 md:px-0 lg:px-[20px]">
      <div className="containersection px-0 md:px-0 lg:px-12">
        {/* Testimonials Container */}
        <div
          ref={scrollContainerRef}
          className="flex gap-[20px] overflow-y-hidden overflow-x-auto scrollbar-hide scroll-smooth"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {testimonials.map((testimonial: Testimonial, index: number) => (
            <div key={index} className={`shrink-0 w-[calc(25%-15px)] min-w-[300px] h-[497px] bg-white ${index === 0 ? 'pl-[20px] md:pl-[20px] lg:pl-0' : ''}`}>
              {testimonial?.image?.url && (
                <div
                  className="h-[302px] bg-cover bg-start"
                  style={{ backgroundImage: `url('${testimonial.image.url}')` }}
                ></div>
              )}
              <div className="py-[20px]">
                {testimonial?.name && (
                  <h3 className="text-[#000F19] font-manrope-semibold text-2xl leading-6 mb-[10px] capitalize">
                    {testimonial.name}
                  </h3>
                )}
                {testimonial?.role && (
                  <p className="text-[#000F19] font-manrope-medium text-lg leading-5 mb-[10px] capitalize">
                    {testimonial.role}
                  </p>
                )}
                <div className="h-[3px] bg-[#488BF3]"></div>

                {testimonial?.quote && (
                  <p className="text-[#000F19]/60 font-manrope-medium text-base leading-6 mt-[10px]">
                    {testimonial.quote}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
        <div className="flex gap-4 justify-center mt-[30px]">
          <button
            onClick={scrollLeft}
            disabled={!canScrollLeft}
            className="w-28 h-12 bg-blue-500 rounded-[10px] hover:bg-[#3a7bd5] flex items-center justify-center cursor-pointer transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-[#488bf3] "
            aria-label="Previous testimonials"
          >
            <svg width="21" height="18" viewBox="0 0 21 18" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M20.5039 8.9245L1.059 8.92456" stroke="white" strokeWidth="1.5" />
              <path d="M9.45508 0.530273L1.06021 8.92514L9.45508 17.32" stroke="white" strokeWidth="1.5" />
            </svg>

          </button>
          <button
            onClick={scrollRight}
            disabled={!canScrollRight}
            className="w-28 h-12 bg-blue-500 rounded-[10px] hover:bg-[#3a7bd5] flex items-center justify-center cursor-pointer transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-[#488bf3]"
            aria-label="Next testimonials"
          >
            <svg width="115" height="50" viewBox="0 0 115 50" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect width="115" height="50" rx="10" fill="#488BF3" />
              <path d="M47.5547 24.6005L66.9996 24.6006" stroke="white" strokeWidth="1.5" />
              <path d="M58.6035 16.2063L66.9984 24.6012L58.6035 32.996" stroke="white" strokeWidth="1.5" />
            </svg>

          </button>
        </div>
      </div>

      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </section>
  )
}

export default TestimonialsCarouselCareer


