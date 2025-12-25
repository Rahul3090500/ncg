'use client'

import React, { useState, useRef, useEffect } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation } from 'swiper/modules'
import type { Swiper as SwiperType } from 'swiper'
import ArrowButton from './ArrowButton'

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
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(false)
  const cardWidth = 400 // Minimum width of each card

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

  // Desktop scroll functions
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

    // Check initial state
    checkScrollability()

    // Listen to scroll events
    container.addEventListener('scroll', checkScrollability)

    // Check on resize
    window.addEventListener('resize', checkScrollability)

    return () => {
      container.removeEventListener('scroll', checkScrollability)
      window.removeEventListener('resize', checkScrollability)
    }
  }, [igaServices])

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current
      const scrollAmount = cardWidth
      container.scrollBy({
        left: -scrollAmount,
        behavior: 'smooth',
      })
    }
  }

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current
      const scrollAmount = cardWidth
      container.scrollBy({
        left: scrollAmount,
        behavior: 'smooth',
      })
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
                <div className="w-full h-full bg-white border-[0.5px] border-[#DDE9F1] flex flex-col overflow-hidden">
                  {/* TOP IMAGE CONTAINER */}
                  <div className="relative w-full overflow-hidden flex-shrink-0">
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
                  <div className="flex-1 flex flex-col px-6 md:px-8 pt-4 md:pt-6 pb-[50px] md:pb-6">
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
        <div className="flex justify-center items-center bg-[#F4F7FF] gap-4 pt-6 pb-6 md:pt-8 md:pb-8">
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

      {/* Desktop: Grid Layout with Scroll */}
      <div className="hidden lg:block">
        <div 
          ref={scrollContainerRef}
          className="overflow-x-auto [&::-webkit-scrollbar]:hidden" 
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' } as React.CSSProperties}
          onScroll={checkScrollability}
        >
          <div className="flex gap-0">
            {igaServices.map((igaService: IGAService, index: number) => (
              <div
                key={index}
                className="w-[33.333vw] min-w-[400px] flex-shrink-0 h-auto bg-white border-[0.5px] border-[#DDE9F1] flex flex-col overflow-hidden pb-8 md:pb-12 lg:pb-16"
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
        </div>

        {/* Navigation Buttons - Desktop */}
        {igaServices.length > 3 && (
          <div className="flex justify-center gap-4 pt-8 pb-8 md:pt-12 md:pb-12 lg:pt-[57px] lg:pb-[57px] bg-[#F4F7FF] ">
            <ArrowButton
              direction="left"
              onClick={scrollLeft}
              disabled={!canScrollLeft}
              ariaLabel="Scroll left"
              bgColor="bg-white"
              hoverBgColor="hover:bg-white"
              arrowColor="black"
            />

            <ArrowButton
              direction="right"
              onClick={scrollRight}
              disabled={!canScrollRight}
              ariaLabel="Scroll right"
              bgColor="bg-white"
              hoverBgColor="hover:bg-white"
              arrowColor="black"
            />
          </div>
        )}
      </div>
    </>
  )
}

export default IGAServicesClient

