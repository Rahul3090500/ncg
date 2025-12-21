'use client'

import React, { useState } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import type { Swiper as SwiperType } from 'swiper'

// Import Swiper styles
import 'swiper/css'

interface Value {
  icon?: {
    url: string
    mimeType?: string
  }
  title?: string
  description?: string
}

interface ValuesSectionProps {
  values: Value[]
}

const ValuesSection: React.FC<ValuesSectionProps> = ({ values }) => {
  const [swiperInstance, setSwiperInstance] = useState<SwiperType | null>(null)
  const [activeIndex, setActiveIndex] = useState(0)

  const handleSwiper = (swiper: SwiperType) => {
    setSwiperInstance(swiper)
    setActiveIndex(swiper.activeIndex)
  }

  const handleSlideChange = (swiper: SwiperType) => {
    setActiveIndex(swiper.activeIndex)
  }

  return (
    <>
      {/* Mobile Slider - Only visible on mobile */}
      <div className="block md:hidden">
        <Swiper
          slidesPerView={1}
          spaceBetween={16}
          onSwiper={handleSwiper}
          onSlideChange={handleSlideChange}
          className="values-swiper"
          grabCursor={true}
          watchSlidesProgress={true}
        >
          {values.map((v: any, i: number) => (
            <SwiperSlide key={`value-${i}`}>
              <div className="bg-white rounded-[5px] p-6 md:p-6 lg:p-8 min-h-[400px] md:min-h-0 flex flex-col">
                <div className="w-24 h-24 rounded-lg flex items-center justify-center mb-14 mt-1">
                  {v?.icon?.url && (
                    <img src={v.icon.url} alt={v?.title || ''} className="rounded-lg object-contain w-full h-full" />
                  )}
                </div>
                {v?.title && (
                  <h3 className="text-[#000F19] text-xl font-manrope-semibold leading-8 mb-3">{v.title}</h3>
                )}
                {v?.description && (
                  <p className="text-[#000F19] font-manrope-normal text-base leading-6 flex-grow">{v.description}</p>
                )}
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Pagination Dots */}
        {values.length > 1 && (
          <div className="flex justify-center items-center gap-2 mt-6">
            {values.map((_, index) => {
              const isActive = activeIndex === index
              return (
                <button
                  key={index}
                  onClick={() => swiperInstance?.slideTo(index)}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    isActive
                      ? 'bg-[#488BF3] w-8'
                      : 'bg-[#488BF3]/30 hover:bg-[#488BF3]/50 w-2'
                  }`}
                  aria-label={`Go to value ${index + 1}`}
                />
              )
            })}
          </div>
        )}
      </div>

      {/* Desktop Grid - Only visible on md and above */}
      <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 lg:gap-8">
        {values.map((v: any, i: number) => (
          <div key={`value-${i}`} className="bg-white rounded-[5px] p-4 md:p-6 lg:p-8">
            <div className="w-12 h-12 md:w-14 md:h-14 lg:w-20 lg:h-20 rounded-lg flex items-center justify-center mb-6 md:mb-8 lg:mb-10">
              {v?.icon?.url && (
                <img src={v.icon.url} alt={v?.title || ''} className="rounded-lg object-contain" />
              )}
            </div>
            {v?.title && (
              <h3 className="text-[#000F19] text-lg md:text-xl font-manrope-semibold leading-6 md:leading-7 mb-2">{v.title}</h3>
            )}
            {v?.description && (
              <p className="text-[#000F19] font-manrope-normal text-sm md:text-base leading-5">{v.description}</p>
            )}
          </div>
        ))}
      </div>
    </>
  )
}

export default ValuesSection
