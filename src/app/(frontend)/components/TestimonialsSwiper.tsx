'use client'

import React, { useState, useEffect } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation } from 'swiper/modules'
import type { Swiper as SwiperType } from 'swiper'
import TestimonialCard from './TestimonialCard'
import ArrowButton from './ArrowButton'

// Import Swiper styles
import 'swiper/css'
import 'swiper/css/navigation'

interface Testimonial {
  name: string
  position: string
  company: string
  image?: {
    url: string
  }
  quote: string
}

interface TestimonialsSwiperProps {
  testimonials: Testimonial[]
  overline: string
  onSwiperChange?: (swiper: SwiperType | null) => void
}

const TestimonialsSwiper: React.FC<TestimonialsSwiperProps> = ({
  testimonials,
  overline,
  onSwiperChange,
}) => {
  const [swiper, setSwiper] = useState<SwiperType | null>(null)
  const [isBeginning, setIsBeginning] = useState(true)
  const [isEnd, setIsEnd] = useState(false)

  const handleSwiper = (swiperInstance: SwiperType) => {
    setSwiper(swiperInstance)
    setIsBeginning(swiperInstance.isBeginning)
    setIsEnd(swiperInstance.isEnd)
    onSwiperChange?.(swiperInstance)
    
    // Force update after a small delay to ensure DOM is ready
    setTimeout(() => {
      if (swiperInstance && swiperInstance.slides && swiperInstance.slides.length > 0) {
        swiperInstance.update()
      }
    }, 100)
  }

  const handleSlideChange = (swiperInstance: SwiperType) => {
    setIsBeginning(swiperInstance.isBeginning)
    setIsEnd(swiperInstance.isEnd)
  }

  const handlePrevious = () => {
    if (swiper && !swiper.isBeginning) {
      swiper.slidePrev()
    }
  }

  const handleNext = () => {
    if (swiper && !swiper.isEnd) {
      swiper.slideNext()
    }
  }

  // Update button states when swiper changes
  useEffect(() => {
    if (swiper) {
      setIsBeginning(swiper.isBeginning)
      setIsEnd(swiper.isEnd)
      // Only update if slides are initialized
      if (swiper.slides && swiper.slides.length > 0) {
        swiper.update()
      }
    }
  }, [swiper])

  // Update Swiper when testimonials change
  useEffect(() => {
    if (swiper && testimonials.length > 0) {
      // Use requestAnimationFrame to ensure DOM is ready
      requestAnimationFrame(() => {
        if (swiper.slides && swiper.slides.length > 0) {
          swiper.update()
          setIsBeginning(swiper.isBeginning)
          setIsEnd(swiper.isEnd)
        }
      })
    }
  }, [testimonials, swiper])

  const getImageUrl = (image: { url: string } | string | undefined): string => {
    if (!image) return ''
    if (typeof image === 'string') return image
    return image.url || ''
  }

  if (!testimonials || testimonials.length === 0) {
    return null
  }

  return (
    <div className="relative w-full">
      <div className="w-full overflow-hidden">
        <Swiper
          modules={[Navigation]}
          spaceBetween={0}
          slidesPerView={1}
          onSwiper={handleSwiper}
          onSlideChange={handleSlideChange}
          className="testimonials-swiper w-full"
          allowTouchMove={true}
          loop={false}
          speed={700}
          watchSlidesProgress={true}
          observer={true}
          observeParents={true}
          updateOnWindowResize={true}
          preventClicks={false}
          preventClicksPropagation={false}
        >
          {testimonials.map((testimonial, index) => {
            const imageUrl = getImageUrl(testimonial.image as any)
            return (
              <SwiperSlide 
                key={`testimonial-${testimonial.name}-${index}`} 
                style={{ height: 'auto', width: '100%' }}
              >
                <div className="w-full h-full">
                  <TestimonialCard
                    name={testimonial.name}
                    position={testimonial.position}
                    company={testimonial.company}
                    image={imageUrl}
                    overline={overline}
                    quote={testimonial.quote}
                  />
                </div>
              </SwiperSlide>
            )
          })}
        </Swiper>
      </div>
      
      {/* Navigation arrows - Centered on mobile/tablet, left-aligned on desktop */}
      <div className="flex gap-4 justify-center md:justify-center lg:justify-start mt-8">
        <ArrowButton
          direction="left"
          onClick={handlePrevious}
          disabled={isBeginning || testimonials.length <= 1}
          ariaLabel="Previous testimonial"
          bgColor="bg-[#488BF3]"
          hoverBgColor="hover:bg-[#3a7bd5]"
        />
        <ArrowButton
          direction="right"
          onClick={handleNext}
          disabled={isEnd || testimonials.length <= 1}
          ariaLabel="Next testimonial"
          bgColor="bg-[#488BF3]"
          hoverBgColor="hover:bg-[#3a7bd5]"
        />
      </div>
    </div>
  )
}

export default TestimonialsSwiper

