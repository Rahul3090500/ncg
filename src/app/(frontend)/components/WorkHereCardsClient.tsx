'use client'

import React, { useState } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation } from 'swiper/modules'
import type { Swiper as SwiperType } from 'swiper'

// Import Swiper styles
import 'swiper/css'
import 'swiper/css/navigation'

interface WorkHereCard {
  number?: string
  description?: string
  image?: {
    url: string
  }
}

interface WorkHereCardsClientProps {
  cards: WorkHereCard[]
}

// Helper function to parse and format text with bold styling
// Use **text** for bold
const parseFormattedText = (text: string) => {
  if (!text) return null;

  const parts = [];
  let currentIndex = 0;
  let key = 0;

  const regex = /(\*\*.*?\*\*)/g;
  let match;

  while ((match = regex.exec(text)) !== null) {
    // Add text before the match
    if (match.index > currentIndex) {
      parts.push(
        <span key={key++} className="font-manrope-normal">
          {text.substring(currentIndex, match.index)}
        </span>
      );
    }

    const matchedText = match[0];

    // Check if it's bold (**text**)
    if (matchedText.startsWith('**') && matchedText.endsWith('**')) {
      parts.push(
        <span key={key++} className="font-manrope-semibold">
          {matchedText.slice(2, -2)}
        </span>
      );
    }

    currentIndex = match.index + matchedText.length;
  }

  // Add remaining text
  if (currentIndex < text.length) {
    parts.push(
      <span key={key++} className="font-manrope-normal">
        {text.substring(currentIndex)}
      </span>
    );
  }

  return parts.length > 0 ? <>{parts}</> : text;
}

const WorkHereCardsClient: React.FC<WorkHereCardsClientProps> = ({ cards }) => {
  const [swiper, setSwiper] = useState<SwiperType | null>(null)
  const [isBeginning, setIsBeginning] = useState(true)
  const [isEnd, setIsEnd] = useState(false)

  const handleSwiper = (swiperInstance: SwiperType) => {
    setSwiper(swiperInstance)
    setIsBeginning(swiperInstance.isBeginning)
    setIsEnd(swiperInstance.isEnd)
  }

  const handleSlideChange = (swiperInstance: SwiperType) => {
    setIsBeginning(swiperInstance.isBeginning)
    setIsEnd(swiperInstance.isEnd)
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

  if (!cards || cards.length === 0) {
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
            className="work-here-swiper w-full"
            allowTouchMove={true}
            loop={false}
            speed={700}
            breakpoints={{
              0: {
                slidesPerView: 1,
                spaceBetween: 0,
              },
              768: {
                slidesPerView: 2.2,
                spaceBetween: 0,
              },
            }}
          >
            {cards.slice(0, 4).map((card: any, index: number) => (
              <SwiperSlide key={index}>
                <div className="w-full h-auto min-h-[378px] bg-white border border-[#DDE9F1] flex flex-col">
                  {/* Text Content */}
                  <div className="p-6 md:p-[28px] flex-1 flex flex-col justify-center bg-white">
                    <p className="text-[#488BF3] font-manrope-semibold text-base md:text-[19px] leading-5 md:leading-[24px] mb-4 md:mb-[21px]">
                      {card?.number || ''}
                    </p>
                    <p className="text-[#000F19] text-sm md:text-base lg:text-[19px] leading-6 md:leading-[24px]">
                      {parseFormattedText(card?.description || '')}
                    </p>
                  </div>
                  {/* Image */}
                  {card?.image?.url && (
                    <div className="h-[200px] md:h-[192px] scale-[1.005] bg-cover bg-center bg-gray-100" style={{ backgroundImage: `url('${card.image.url}')` }}></div>
                  )}
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
            aria-label="Previous card"
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
            aria-label="Next card"
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
      <div className="hidden lg:flex">
        {cards.slice(0, 4).map((card: any, index: number) => (
          <div
            key={index}
            className={`flex-1 h-[378px] bg-white border-y border-l border-[#DDE9F1] flex flex-col ${
              index === cards.slice(0, 4).length - 1 ? 'border-r' : ''
            }`}
          >
            {/* Text Content */}
            <div className="p-[28px] flex-1 flex flex-col justify-center bg-white">
              <p className="text-[#488BF3] font-manrope-semibold text-[19px] leading-[24px] mb-[21px]">
                {card?.number || ''}
              </p>
              <p className="text-[#000F19] text-[19px] leading-[24px]">
                {parseFormattedText(card?.description || '')}
              </p>
            </div>
            {/* Image */}
            {card?.image?.url && (
              <div className="h-[192px] scale-[1.005] bg-cover bg-center" style={{ backgroundImage: `url('${card.image.url}')` }}></div>
            )}
          </div>
        ))}
      </div>
    </>
  )
}

export default WorkHereCardsClient

