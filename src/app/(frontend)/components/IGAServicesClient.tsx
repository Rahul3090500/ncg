'use client'

import React, { useState } from 'react'
import dynamic from 'next/dynamic'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation } from 'swiper/modules'
import type { Swiper as SwiperType } from 'swiper'

// Import Swiper styles
import 'swiper/css'
import 'swiper/css/navigation'

interface IGAService {
  title: string
  description: string
  backgroundImage?: {
    url: string
  }
  number?: string
}

interface IGAServicesClientProps {
  igaServices: IGAService[]
}

const IGAServicesClient: React.FC<IGAServicesClientProps> = ({ igaServices }) => {
  const [swiper, setSwiper] = useState<SwiperType | null>(null)
  const [isBeginning, setIsBeginning] = useState(true)
  const [isEnd, setIsEnd] = useState(false)
  const [currentIndex, setCurrentIndex] = useState(0)

  const handleSwiper = (swiperInstance: SwiperType) => {
    setSwiper(swiperInstance)
    setIsBeginning(swiperInstance.isBeginning)
    setIsEnd(swiperInstance.isEnd)
  }

  const handleSlideChange = (swiperInstance: SwiperType) => {
    setIsBeginning(swiperInstance.isBeginning)
    setIsEnd(swiperInstance.isEnd)
    setCurrentIndex(swiperInstance.activeIndex)
  }

  const goToPrev = () => {
    if (swiper) {
      swiper.slidePrev()
    }
  }

  const goToNext = () => {
    if (swiper) {
      swiper.slideNext()
    }
  }

  if (!igaServices || igaServices.length === 0) {
    return null
  }

  return (
    <>
      {/* Mobile/Tablet: Swiper Carousel */}
      <div className="lg:hidden">
        <div className="relative w-full overflow-hidden">
          <Swiper
            modules={[Navigation]}
            spaceBetween={0}
            slidesPerView={1}
            onSwiper={handleSwiper}
            onSlideChange={handleSlideChange}
            className="iga-services-swiper w-full"
            allowTouchMove={true}
            loop={false}
            speed={700}
            breakpoints={{
              640: {
                slidesPerView: 1,
                spaceBetween: 0,
              },
              768: {
                slidesPerView: 2,
                spaceBetween: 0,
              },
            }}
          >
            {igaServices.map((igaService: IGAService, index: number) => (
              <SwiperSlide key={index}>
                <div className="w-full h-auto bg-white border-[0.5px] border-[#DDE9F1] flex flex-col overflow-hidden">
                  {/* TOP IMAGE CONTAINER */}
                  <div className="relative w-full overflow-hidden">
                    {igaService.backgroundImage?.url ? (
                      <img
                        src={igaService.backgroundImage.url}
                        alt={igaService.title}
                        className="w-full h-36 md:h-40 object-cover"
                      />
                    ) : (
                      <div className="w-full h-36 md:h-40 bg-gray-200" />
                    )}
                    <div className="absolute text-white font-manrope-normal text-lg md:text-[21px] top-12 md:top-16 leading-[23px] left-6 md:left-[29px]">
                      {igaService.number || String(index + 1).padStart(2, '0')}
                    </div>
                  </div>

                  {/* CONTENT SECTION */}
                  <div className="flex-1 flex flex-col px-6 md:px-8 pt-4 md:pt-6 pb-6">
                    <h3 className="text-[#000F19] font-manrope-semibold text-lg md:text-xl leading-6 mb-2 md:mb-3">
                      {igaService.title}
                    </h3>
                    <p className="text-[#000F19]/60 text-sm md:text-base font-manrope-light leading-5">
                      {igaService.description}
                    </p>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        {/* Navigation Arrows - Mobile/Tablet */}
        <div className="flex justify-center items-center gap-4 mt-6 md:mt-8">
          <button
            onClick={goToPrev}
            disabled={isBeginning}
            className={`w-10 h-10 md:w-12 md:h-12 rounded-lg flex items-center justify-center transition-all duration-300 ${
              isBeginning
                ? 'bg-[#488BF3]/30 cursor-not-allowed'
                : 'bg-[#488BF3] hover:bg-[#3a7be0] cursor-pointer'
            }`}
            aria-label="Previous service"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M15 18L9 12L15 6"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
          <button
            onClick={goToNext}
            disabled={isEnd}
            className={`w-10 h-10 md:w-12 md:h-12 rounded-lg flex items-center justify-center transition-all duration-300 ${
              isEnd
                ? 'bg-[#488BF3]/30 cursor-not-allowed'
                : 'bg-[#488BF3] hover:bg-[#3a7be0] cursor-pointer'
            }`}
            aria-label="Next service"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M9 18L15 12L9 6"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Desktop: Grid Layout */}
      <div className="hidden lg:flex lg:flex-row gap-0">
        {igaServices.map((igaService: IGAService, index: number) => (
          <div
            key={index}
            className="flex-1 w-full h-auto bg-white border-[0.5px] border-[#DDE9F1] flex flex-col overflow-hidden"
          >
            {/* TOP IMAGE CONTAINER */}
            <div className="relative w-full overflow-hidden">
              {igaService.backgroundImage?.url ? (
                <img
                  src={igaService.backgroundImage.url}
                  alt={igaService.title}
                  className="w-full h-36 object-cover"
                />
              ) : (
                <div className="w-full h-36 bg-gray-200" />
              )}
              <div className="absolute text-white font-manrope-normal text-[21px] top-16 leading-[23px] left-[29px]">
                {igaService.number || String(index + 1).padStart(2, '0')}
              </div>
            </div>

            {/* CONTENT SECTION */}
            <div className="flex-1 flex flex-col px-8 pt-6 pb-6">
              <h3 className="text-[#000F19] font-manrope-semibold text-xl leading-6 mb-3">
                {igaService.title}
              </h3>
              <p className="text-[#000F19]/60 text-base font-manrope-light leading-5">
                {igaService.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </>
  )
}

export default IGAServicesClient

