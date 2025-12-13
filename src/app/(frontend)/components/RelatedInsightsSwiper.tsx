'use client'

import React, { useState, useEffect } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Pagination } from 'swiper/modules'
import type { Swiper as SwiperType } from 'swiper'
import BlogsGridDarkMobile from '../blogs/BlogsGridDarkMobile'
import BlogsGridLightMobile from '../blogs/BlogsGridLightMobile'
import ArrowButton from './ArrowButton'

// Import Swiper styles
import 'swiper/css'
import 'swiper/css/pagination'

interface BlogItem {
  imageUrl: string
  date: string
  title: string
  description: string
  href?: string
  slug?: string
}

interface RelatedInsightsSwiperProps {
  blogs: BlogItem[]
  theme?: 'light' | 'dark'
  onSwiperChange?: (swiper: SwiperType | null) => void
  onSlideChange?: (swiper: SwiperType) => void
}

const RelatedInsightsSwiper: React.FC<RelatedInsightsSwiperProps> = ({
  blogs,
  theme = 'dark',
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

  const showNavigation = blogs.length > 1

  return (
    <div className="relative w-full">
      <Swiper
        modules={[Pagination]}
        spaceBetween={slidesPerView > 1 ? 24 : 0}
        slidesPerView={slidesPerView}
        onSwiper={handleSwiper}
        onSlideChange={handleSlideChange}
        className="related-insights-swiper"
        grabCursor={true}
        watchSlidesProgress={true}
        allowTouchMove={true}
        touchRatio={1}
        pagination={{
          clickable: true,
          bulletClass: 'swiper-pagination-bullet related-insights-bullet',
          bulletActiveClass: 'swiper-pagination-bullet-active related-insights-bullet-active',
          enabled: true,
        }}
        breakpoints={{
          0: {
            slidesPerView: 1,
            spaceBetween: 0,
            pagination: {
              enabled: true,
            },
          },
          768: {
            slidesPerView: 2,
            spaceBetween: 24,
            pagination: {
              enabled: false,
            },
          },
        }}
        style={{
          width: '100%',
        }}
      >
        {blogs.map((blog, index) => (
          <SwiperSlide key={blog.slug || index} className="!flex">
            <div className="w-full">
              {theme === 'dark' ? (
                <BlogsGridDarkMobile
                  imageUrl={blog.imageUrl}
                  date={blog.date}
                  title={blog.title}
                  description={blog.description}
                  href={blog.slug ? `/blogs/${blog.slug}` : (blog.href && blog.href !== '#' ? blog.href : '#')}
                  slug={blog.slug}
                />
              ) : (
                <BlogsGridLightMobile
                  imageUrl={blog.imageUrl}
                  date={blog.date}
                  title={blog.title}
                  description={blog.description}
                  href={blog.slug ? `/blogs/${blog.slug}` : (blog.href && blog.href !== '#' ? blog.href : '#')}
                  slug={blog.slug}
                />
              )}
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Navigation arrows at bottom - Hidden on mobile, visible on tablet/desktop */}
      {showNavigation && (
        <div className="hidden md:flex gap-4 justify-center mt-6 md:mt-8 z-10 relative pb-2">
          <ArrowButton
            direction="left"
            onClick={handlePrevious}
            disabled={isBeginning}
            ariaLabel="Previous insight"
            bgColor="bg-[#488BF3]"
            hoverBgColor="hover:bg-[#3a7bd5]"
            arrowColor="white"
          />
          <ArrowButton
            direction="right"
            onClick={handleNext}
            disabled={isEnd}
            ariaLabel="Next insight"
            bgColor="bg-[#488BF3]"
            hoverBgColor="hover:bg-[#3a7bd5]"
            arrowColor="white"
          />
        </div>
      )}
    </div>
  )
}

export default RelatedInsightsSwiper

