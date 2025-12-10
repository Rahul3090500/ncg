'use client'

import React, { useState } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import type { Swiper as SwiperType } from 'swiper'

// Import Swiper styles
import 'swiper/css'

interface Challenge {
  image?: {
    url: string
  }
  title: string
  description: string
  number?: string
}

interface ChallengesSwiperProps {
  challenges: Challenge[]
}

const ChallengesSwiper: React.FC<ChallengesSwiperProps> = ({ challenges }) => {
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
    <div className="w-full">
      <Swiper
        slidesPerView={1}
        spaceBetween={24}
        onSwiper={handleSwiper}
        onSlideChange={handleSlideChange}
        className="challenges-swiper"
        grabCursor={true}
        watchSlidesProgress={true}
      >
        {challenges.map((challenge, index) => (
          <SwiperSlide key={index}>
            <div className="bg-white overflow-hidden">
              <div className="flex h-full">
                {challenge.image?.url && (
                  <div className="w-40 h-36 rounded-[10px] relative shrink-0">
                    <img
                      src={challenge.image.url}
                      alt={challenge.title}
                      className="w-full h-full object-cover rounded-[10px]"
                    />
                  </div>
                )}
                <div className={`flex-1 pl-6 ${challenge.image?.url ? '' : 'w-full'}`}>
                  <div className="text-[#000F19] font-manrope-semibold text-lg leading-8 mb-2">
                    {challenge.number || String(index + 1).padStart(2, '0')}
                  </div>
                  <h3 className="text-[#000F19] font-manrope-semibold text-2xl leading-8 mb-1">
                    {challenge.title}
                  </h3>
                  <p className="text-[#000F19]/70 text-base font-manrope-medium leading-6">
                    {challenge.description}
                  </p>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Pagination Dots */}
      {challenges.length > 1 && (
        <div className="flex justify-center items-center gap-2 mt-6">
          {challenges.map((_, index) => {
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
                aria-label={`Go to challenge ${index + 1}`}
              />
            )
          })}
        </div>
      )}
    </div>
  )
}

export default ChallengesSwiper

