'use client'

import React, { useState } from 'react'
import dynamic from 'next/dynamic'

interface Testimonial {
  name: string
  position: string
  company: string
  image?: {
    url: string
  }
  quote: string
}

interface TestimonialsData {
  overline: string
  testimonials: Testimonial[]
}

interface TestimonialsCarouselProps {
  data: TestimonialsData
}

// Dynamically import Swiper component with SSR disabled to avoid hydration issues
const TestimonialsSwiper = dynamic(() => import('./TestimonialsSwiper'), {
  ssr: false,
  loading: () => <div className="h-[497px] w-full" />
})

const TestimonialsCarousel = ({ data }: TestimonialsCarouselProps) => {
  const { testimonials, overline } = data

  if (!testimonials || testimonials.length === 0) {
    return null
  }

  return (
    <section className="py-12 md:py-20 lg:py-20 bg-white">
      <div className="containersection lg:w-[70%]!">
        {/* Heading - Centered on tablet, separate column on desktop */}
        <div className="text-center md:text-center lg:hidden mb-8 md:mb-12">
          <h3 className="text-[#000f19] text-base md:text-lg font-manrope-semibold mt-1 uppercase leading-[17px] tracking-widest">
            {overline}
          </h3>
        </div>
        <TestimonialsSwiper
          testimonials={testimonials}
          overline={overline}
        />
      </div>
    </section>
  )
}

export default TestimonialsCarousel
