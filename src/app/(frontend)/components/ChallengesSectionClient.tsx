'use client'

import React from 'react'
import dynamic from 'next/dynamic'
import AnimatedButton from './AnimatedButton'

// Dynamically import Swiper component with SSR disabled
const ChallengesSwiper = dynamic(() => import('./ChallengesSwiper'), {
  ssr: false,
  loading: () => <div className="h-[200px] w-full" />
})

interface Challenge {
  image?: {
    url: string
  }
  title: string
  description: string
  number?: string
}

interface ChallengesSectionClientProps {
  challengesTitle: string
  challengesDescription: string
  challengesButtonText?: string
  challengesButtonLink?: string
  challenges: Challenge[]
}

const ChallengesSectionClient: React.FC<ChallengesSectionClientProps> = ({
  challengesTitle,
  challengesDescription,
  challengesButtonText,
  challengesButtonLink,
  challenges,
}) => {
  return (
    <section className="pt-8 pb-[95px] md:pb-[95px] md:pt-12 lg:py-[95px] bg-white">
      <div className="containersection px-4 md:px-6 lg:px-40 mx-auto">
        <div className="text-left mb-8 md:mb-10 lg:mb-12">
          <h2 className="text-[#000F19] font-manrope-semibold text-2xl md:text-3xl lg:text-5xl leading-tight md:leading-[45px] lg:leading-[60px] mb-2 md:mb-3 lg:mb-1.5">
            {challengesTitle}
          </h2>
          <p className="text-[#000F19] text-base md:text-lg lg:text-xl leading-6 md:leading-7 lg:leading-8 font-manrope-normal ml-0 mb-4 md:mb-6 lg:mb-[23px] w-full md:w-[90%] lg:w-[94%]">
            {challengesDescription}
          </p>
          {challengesButtonText && (
            <AnimatedButton
              text={challengesButtonText}
              link={challengesButtonLink || '#'}
              bgColor="#488BF3"
              hoverBgColor="#3a7be0"
              width="w-48"
              className="px-6 md:px-8"
            />
          )}
        </div>

        {/* Mobile: Swiper */}
        <div className="md:hidden mt-8">
          <ChallengesSwiper challenges={challenges} />
        </div>

        {/* Tablet/Desktop: Grid */}
        <div className="hidden md:grid md:grid-cols-2 gap-y-12 gap-x-[50px] mt-12 lg:mt-[73px]">
          {challenges.map((challenge: any, index: number) => (
            <div key={index} className="bg-white overflow-hidden">
              <div className="flex flex-col md:flex-col lg:flex-row h-full">
                {challenge.image?.url && (
                  <div className="w-40 h-36 rounded-[10px] relative shrink-0 mb-4 md:mb-4 lg:mb-0">
                    <img
                      src={challenge.image.url}
                      alt={challenge.title}
                      className="w-full h-full object-cover rounded-[10px]"
                    />
                  </div>
                )}
                <div className={`flex-1 md:pl-0 lg:pl-6 ${challenge.image?.url ? '' : 'w-full'}`}>
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
          ))}
        </div>
      </div>
    </section>
  )
}

export default ChallengesSectionClient

