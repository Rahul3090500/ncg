'use client'

import React, { useState } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Pagination } from 'swiper/modules'
import type { Swiper as SwiperType } from 'swiper'

// Import Swiper styles
import 'swiper/css'
import 'swiper/css/pagination'

interface TeamMember {
  id?: string
  name?: string
  role?: string
  bio?: string
  image?: {
    url: string
  }
}

interface TeamCardsClientProps {
  team: TeamMember[]
}

const TeamCardsClient: React.FC<TeamCardsClientProps> = ({ team }) => {
  const [swiper, setSwiper] = useState<SwiperType | null>(null)

  const handleSwiper = (swiperInstance: SwiperType) => {
    setSwiper(swiperInstance)
  }

  if (!team || team.length === 0) {
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
          className="team-cards-swiper"
        >
          {team.map((member, index) => (
            <SwiperSlide key={member?.id || index}>
              <div className="bg-white overflow-hidden pt-4">
                <div className="h-[250px] md:h-[300px]">
                  {member?.image?.url && (
                    <img src={member.image.url} alt={member?.name || ''} className="w-full h-full object-cover rounded-[5px]" />
                  )}
                </div>
                <div className="py-4 md:py-6">
                  {member?.name && (
                    <h3 className="text-[#000F19] font-manrope-semibold text-lg md:text-xl mb-2">{member.name}</h3>
                  )}
                  {member?.role && (
                    <p className="text-[#000F19] text-xs uppercase font-manrope-bold leading-4 tracking-wide mb-3 md:mb-4 border-b border-[#000F19] pb-3 md:pb-4">{member.role}</p>
                  )}
                  {member?.bio && (
                    <p className="text-slate-950/80 font-manrope-normal text-sm leading-relaxed">{member.bio}</p>
                  )}
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* Grid for Desktop */}
      <div className="hidden lg:grid grid-cols-4 gap-8">
        {team.map((member, index) => (
          <div key={member?.id || index} className="bg-white overflow-hidden pt-[16px]">
            <div className="h-[300px]">
              {member?.image?.url && (
                <img src={member.image.url} alt={member?.name || ''} className="w-full h-full object-cover rounded-[5px]" />
              )}
            </div>
            <div className="py-6">
              {member?.name && (
                <h3 className="text-[#000F19] font-manrope-semibold text-xl mb-2">{member.name}</h3>
              )}
              {member?.role && (
                <p className="text-[#000F19] text-xs uppercase font-manrope-bold leading-4 tracking-wide mb-4 border-b border-[#000F19] pb-4">{member.role}</p>
              )}
              {member?.bio && (
                <p className="text-slate-950/80 font-manrope-normal text-sm leading-relaxed">{member.bio}</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </>
  )
}

export default TeamCardsClient

