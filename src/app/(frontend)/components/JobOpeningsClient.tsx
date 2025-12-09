'use client'

import React, { useState } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Pagination } from 'swiper/modules'
import type { Swiper as SwiperType } from 'swiper'
import JobCard from './JobCard'

// Import Swiper styles
import 'swiper/css'
import 'swiper/css/pagination'

interface Job {
  id?: string
  image?: {
    url: string
  }
  applyByDate?: string
  title: string
  location: string
  type: string
  description: string
  link?: string
  slug?: string
}

interface JobOpeningsClientProps {
  jobs: Job[]
}

const JobOpeningsClient: React.FC<JobOpeningsClientProps> = ({ jobs }) => {
  const [swiper, setSwiper] = useState<SwiperType | null>(null)

  const handleSwiper = (swiperInstance: SwiperType) => {
    setSwiper(swiperInstance)
  }

  if (!jobs || jobs.length === 0) {
    return null
  }

  return (
    <>
      {/* Swiper for Mobile and Tablet */}
      <div className="lg:hidden">
        <Swiper
          onSwiper={handleSwiper}
          modules={[Pagination]}
          spaceBetween={16}
          slidesPerView={1}
          pagination={{
            clickable: true,
          }}
          breakpoints={{
            640: {
              slidesPerView: 1,
              spaceBetween: 16,
            },
            768: {
              slidesPerView: 2,
              spaceBetween: 20,
            },
          }}
          className="job-openings-swiper"
        >
          {jobs.map((job, index) => (
            <SwiperSlide key={job?.id || index}>
              <JobCard
                image={job?.image?.url || ''}
                applyByDate={job?.applyByDate ? `Apply By: ${new Date(job.applyByDate).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}` : ''}
                title={job?.title || ''}
                location={job?.location || ''}
                type={job?.type || ''}
                description={job?.description || ''}
                link={job?.link}
                slug={job?.slug}
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* Grid for Desktop */}
      <div className="hidden lg:grid grid-cols-3 gap-[20px]">
        {jobs.map((job, index) => (
          <JobCard
            key={job?.id || index}
            image={job?.image?.url || ''}
            applyByDate={job?.applyByDate ? `Apply By: ${new Date(job.applyByDate).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}` : ''}
            title={job?.title || ''}
            location={job?.location || ''}
            type={job?.type || ''}
            description={job?.description || ''}
            link={job?.link}
            slug={job?.slug}
          />
        ))}
      </div>
    </>
  )
}

export default JobOpeningsClient

