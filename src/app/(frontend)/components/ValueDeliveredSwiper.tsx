'use client'

import React, { useState, useEffect } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import type { Swiper as SwiperType } from 'swiper'
import ArrowButton from './ArrowButton'

// Import Swiper styles
import 'swiper/css'

interface ValueCard {
  image?: {
    url: string
  }
  number?: string
  title: string
  description: string
}

interface ValueDeliveredSwiperProps {
  valueCards: ValueCard[]
  onSwiperChange?: (swiper: SwiperType | null) => void
  onSlideChange?: (swiper: SwiperType) => void
}

const ValueDeliveredSwiper: React.FC<ValueDeliveredSwiperProps> = ({
  valueCards,
  onSwiperChange,
  onSlideChange,
}) => {
  const [swiperInstance, setSwiperInstance] = useState<SwiperType | null>(null)
  const [slidesPerView, setSlidesPerView] = useState(1)
  const [isBeginning, setIsBeginning] = useState(true)
  const [isEnd, setIsEnd] = useState(false)

  useEffect(() => {
    const updateSlidesPerView = () => {
      const width = window.innerWidth
      if (width >= 768) {
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
  }, [])

  const handleSwiper = (swiper: SwiperType) => {
    setSwiperInstance(swiper)
    setIsBeginning(swiper.isBeginning)
    setIsEnd(swiper.isEnd)
    onSwiperChange?.(swiper)
  }

  const handleSlideChange = (swiper: SwiperType) => {
    setIsBeginning(swiper.isBeginning)
    setIsEnd(swiper.isEnd)
    onSlideChange?.(swiper)
  }

  const handlePrevious = () => {
    if (swiperInstance) {
      swiperInstance.slidePrev()
    }
  }

  const handleNext = () => {
    if (swiperInstance) {
      swiperInstance.slideNext()
    }
  }

  const showNavigation = valueCards.length > slidesPerView

  return (
    <div className="relative w-full">
      <Swiper
        spaceBetween={0}
        slidesPerView={slidesPerView}
        onSwiper={handleSwiper}
        onSlideChange={handleSlideChange}
        className="value-delivered-swiper"
        grabCursor={true}
        watchSlidesProgress={true}
        breakpoints={{
          0: {
            slidesPerView: 1,
            spaceBetween: 0,
          },
          768: {
            slidesPerView: 2,
            spaceBetween: 0,
          },
        }}
        style={{
          width: '100%',
        }}
      >
        {valueCards.map((card, index) => (
          <SwiperSlide key={index}>
            <div className="w-full h-96 bg-white border-[0.5px] border-[#DDE9F1] flex flex-col overflow-hidden group shrink-0">
              {/* TOP IMAGE CONTAINER */}
              <div className="relative w-full overflow-hidden">
                {card.image?.url ? (
                  <img
                    src={card.image.url}
                    alt={card.title}
                    className="w-full h-36 object-cover"
                  />
                ) : (
                  <div className="w-full h-36 bg-gray-200" />
                )}
                <div className="absolute text-white font-manrope-normal text-[21px] top-16 leading-[23px] left-[29px]">
                  {card.number || String(index + 1).padStart(2, '0')}
                </div>
              </div>

              {/* CONTENT SECTION */}
              <div className="flex-1 flex flex-col px-8 pt-6 relative">
                {/* TITLE */}
                <h3 className="text-[#000F19] font-manrope-semibold text-xl leading-6 mb-3">
                  {card.title}
                </h3>

                {/* DESCRIPTION */}
                <p className="text-[#000F19]/60 text-base font-manrope-light leading-5 mb-4">
                  {card.description}
                </p>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Navigation arrows */}
      {showNavigation && (
        <div className="flex gap-4 justify-center mt-6 md:mt-8">
          <ArrowButton
            direction="left"
            onClick={handlePrevious}
            disabled={isBeginning || valueCards.length <= slidesPerView}
            ariaLabel="Previous value card"
            bgColor="bg-[#488BF3]"
            hoverBgColor="hover:bg-[#3a7bd5]"
          />
          <ArrowButton
            direction="right"
            onClick={handleNext}
            disabled={isEnd || valueCards.length <= slidesPerView}
            ariaLabel="Next value card"
            bgColor="bg-[#488BF3]"
            hoverBgColor="hover:bg-[#3a7bd5]"
          />
        </div>
      )}
    </div>
  )
}

export default ValueDeliveredSwiper

