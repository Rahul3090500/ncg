'use client'

import React, { useState, useCallback } from 'react'
import BenefitsCarousel from './BenefitsCarousel'
import ArrowButton from './ArrowButton'
import AnimatedButton from './AnimatedButton'

interface BenefitsSectionClientProps {
  benefitsTitle?: string
  benefitsDescription?: string
  benefitsConclusion?: string
  benefitsButtonText?: string
  benefitsButtonLink?: string
  advantages: Array<{
    title: string
    description: string
    image?: {
      url?: string
    }
  }>
}

const BenefitsSectionClient: React.FC<BenefitsSectionClientProps> = ({
  benefitsTitle,
  benefitsDescription,
  benefitsConclusion,
  benefitsButtonText,
  benefitsButtonLink,
  advantages,
}) => {
  const scrollFunctionsRef = React.useRef<{
    scrollLeft: () => void
    scrollRight: () => void
  } | null>(null)
  const [isReady, setIsReady] = useState(false)

  const handleScrollRef = React.useCallback((functions: { scrollLeft: () => void; scrollRight: () => void }) => {
    if (!scrollFunctionsRef.current) {
      scrollFunctionsRef.current = functions
      setIsReady(true)
    }
  }, [])

  return (
    <section className="pb-8 md:pb-12 lg:pb-[65px] pt-8 md:pt-12 lg:pt-[83px] bg-[#F4F7FF]">
      <div className="mx-auto overflow-visible!">
        <div className="text-left mb-6 md:mb-8 lg:mb-12 containersection px-4 md:px-6 lg:px-10">
          <h2 className="text-[#000F19] font-manrope-semibold text-2xl md:text-3xl lg:text-4xl w-full leading-tight md:leading-[45px] md:w-full lg:w-[85%] lg:leading-[40px] mb-3 md:mb-1">
            {benefitsTitle}
          </h2>
          <div className="flex items-center gap-3 lg:gap-4">
            <p className="text-[#000F19] text-base md:text-lg lg:text-xl font-manrope-semibold leading-6 md:leading-7 ml-0 w-full md:w-[90%] lg:w-[85%] flex-1">
              {benefitsDescription}
            </p>
            {/* Chevron arrow buttons - Desktop/Laptop only */}
            <div className="hidden lg:flex items-center gap-2 flex-shrink-0">
              <ArrowButton
                direction="left"
                onClick={() => scrollFunctionsRef.current?.scrollLeft()}
                disabled={!isReady}
                ariaLabel="Scroll left"
                bgColor="bg-white"
                hoverBgColor="hover:bg-[#488bf3]"
                arrowColor="#000F19"
                hoverArrowColor="#fff"
                useChevron={true}
                className="!w-12"
              />
              <ArrowButton
                direction="right"
                onClick={() => scrollFunctionsRef.current?.scrollRight()}
                disabled={!isReady}
                ariaLabel="Scroll right"
                bgColor="bg-white"
                hoverBgColor="hover:bg-[#488bf3]"
                arrowColor="#000F19"
                hoverArrowColor="#fff"
                useChevron={true}
                className="!w-12"
              />
            </div>
          </div>
        </div>
        <div className="mt-6 md:mt-8 lg:mt-12">
          <BenefitsCarousel benefits={advantages} onScrollRef={handleScrollRef} />
        </div>
        <div className="flex flex-col items-center justify-center mt-6 md:mt-8 lg:mt-[44px] px-4 md:px-6 lg:px-0">
          {benefitsConclusion && (
            <p className="text-[#000F19] font-manrope-semibold text-base md:text-lg lg:text-xl leading-6 md:leading-7 max-w-full md:max-w-[90%] lg:max-w-[1088px] text-center mb-4 md:mb-6 lg:mb-[25px]">
              {benefitsConclusion}
            </p>
          )}
          
          {benefitsButtonText && (
            <div className="flex justify-center">
              <AnimatedButton
                text={benefitsButtonText}
                link={benefitsButtonLink || '#'}
                bgColor="#488BF3"
                hoverBgColor="#3a7be0"
                width="w-35"
                className="px-6 md:px-8"
              />
            </div>
          )}
        </div>

      </div>
    </section>
  )
}

export default BenefitsSectionClient
