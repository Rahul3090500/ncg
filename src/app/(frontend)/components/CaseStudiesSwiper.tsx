'use client'

import React, { useState, useEffect } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import type { Swiper as SwiperType } from 'swiper'
import CaseStudyCardMobile from './CaseStudyCardMobile'

// Import Swiper styles
import 'swiper/css'

interface CaseStudiesSwiperProps {
  caseStudies: Array<{
    id: string
    image?: {
      url: string
    }
    category: string
    iconType: string
    iconAssetUrl?: string
    title: string
    description: string
    link?: string
    slug?: string
  }>
  getIcon: (iconType: string, iconAssetUrl?: string) => React.ReactNode
  onSwiperChange?: (swiper: SwiperType | null) => void
  onSlideChange?: (swiper: SwiperType) => void
}

const CaseStudiesSwiper: React.FC<CaseStudiesSwiperProps> = ({
  caseStudies,
  getIcon,
  onSwiperChange,
  onSlideChange,
}) => {
  const [swiper, setSwiper] = useState<SwiperType | null>(null)
  const [slidesPerView, setSlidesPerView] = useState(1)

  useEffect(() => {
    const updateSlidesPerView = () => {
      const width = window.innerWidth
      if (width >= 1024) {
        setSlidesPerView(caseStudies.length)
      } else if (width >= 768) {
        setSlidesPerView(2)
      } else {
        setSlidesPerView(1)
      }
    }

    updateSlidesPerView()
    window.addEventListener('resize', updateSlidesPerView)
    return () => window.removeEventListener('resize', updateSlidesPerView)
  }, [caseStudies.length])

  const handleSwiper = (swiperInstance: SwiperType) => {
    setSwiper(swiperInstance)
    onSwiperChange?.(swiperInstance)
  }

  const handleSlideChange = (swiperInstance: SwiperType) => {
    onSlideChange?.(swiperInstance)
  }

  return (
    <Swiper
      spaceBetween={slidesPerView > 1 ? 16 : 0}
      slidesPerView={slidesPerView === 1 ? 1 : 'auto'}
      onSwiper={handleSwiper}
      onSlideChange={handleSlideChange}
      className="case-studies-swiper"
      grabCursor={true}
      watchSlidesProgress={true}
      breakpoints={{
        0: {
          slidesPerView: 1,
          spaceBetween: 0,
        },
        768: {
          slidesPerView: 'auto',
          spaceBetween: 16,
        },
        1024: {
          slidesPerView: caseStudies.length === 1 ? 1 : 'auto',
          spaceBetween: caseStudies.length > 1 ? 16 : 0,
        },
      }}
      style={{
        width: '100%',
      }}
    >
      {caseStudies.map((caseStudy, index: number) => {
        const link = caseStudy.slug 
          ? `/case-studies/${caseStudy.slug}` 
          : (caseStudy.link || '#')
        
        return (
          <SwiperSlide key={caseStudy.id}>
            <CaseStudyCardMobile
              image={caseStudy.image?.url || ''}
              alt={`${caseStudy.category} Case Study`}
              category={caseStudy.category}
              title={caseStudy.title}
              description={caseStudy.description}
              link={link}
              icon={getIcon(caseStudy.iconType, caseStudy.iconAssetUrl)}
              isFirst={index === 0}
              isLast={index === caseStudies.length - 1}
            />
          </SwiperSlide>
        )
      })}
    </Swiper>
  )
}

export default CaseStudiesSwiper


