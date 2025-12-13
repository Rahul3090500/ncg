'use client'

import React, { useState } from 'react'
import Link from 'next/link'

interface FreeConsultationSectionProps {
  data?: {
    leftTitle?: string
    leftSubtitle?: string
    rightTitle?: string
    rightDescription?: string
    msTeamsLink?: string
    submitButtonText?: string
    privacyText?: string
  }
}

const FreeConsultationSection = ({ data }: FreeConsultationSectionProps) => {
  const [isSubmitted, setIsSubmitted] = useState(false)

  // Dummy links for demonstration - replace with actual links in production
  const dummyCalendlyLink = 'https://calendly.com/demo/30min'
  const dummyMSTeamsLink = 'https://calendly.com/joshua-ekaathedesigncollective/ekaa-the-design-collective-1?embed_type=Inline&embed_domain=1'
  
  const defaultData = {
    leftTitle: "Let's Connect",
    leftSubtitle: "What can we do for you?",
    rightTitle: "Free Consultation",
    rightDescription: "Our experts are ready to understand your challenges, answer your questions, and offer tailored cybersecurity guidance – no cost, no commitment.",
    msTeamsLink: process.env.NEXT_PUBLIC_MS_TEAMS_LINK || process.env.NEXT_PUBLIC_CALENDLY_LINK || dummyCalendlyLink,
  }

  const finalData = { ...defaultData, ...data }

  if (isSubmitted) {
    return (
      <section className="min-h-screen flex flex-col lg:flex-row">
        {/* Left Column - Blue Background */}
        <div className="w-full lg:w-1/2 bg-[#488BF3] flex flex-col justify-center px-4 md:px-6 lg:px-12 xl:px-16 py-20 md:py-24 lg:py-24">
        <h1 className="text-white text-4xl md:text-5xl lg:text-6xl xl:text-8xl font-manrope-normal leading-tight md:leading-[50px] lg:leading-[65px] xl:leading-[85px]">
          {finalData.leftTitle}
        </h1>
        <p className="text-white text-xl md:text-2xl lg:text-3xl xl:text-4xl font-manrope-normal leading-7 md:leading-8 lg:leading-9 xl:leading-10 mt-4 md:mt-5 lg:mt-[20px] mb-8 md:mb-10 lg:mb-[54px]">
          {finalData.leftSubtitle}
        </p>
        <div className="flex flex-col gap-6 md:gap-8 lg:gap-[35px]">
          <Link
            href="/free-consultation"
            className="w-full h-12 md:h-14 lg:h-16 bg-white rounded-[10px] text-center flex justify-center items-center text-slate-950 text-base md:text-lg lg:text-xl font-manrope-medium leading-6 md:leading-7 lg:leading-8"

          >
            Free Consultation
          </Link>
          <Link
            href="/contact"
            className="w-full h-12 md:h-14 lg:h-16 rounded-[10px] hover:bg-white hover:text-[#000F19] transition-colors duration-300 border-2 border-white text-center text-white text-base md:text-lg lg:text-xl font-manrope-medium flex items-center justify-center leading-6 md:leading-7 lg:leading-8"

          >
            Contact Us
          </Link>
        </div>
      </div>

        {/* Right Column - Success Message */}
        <div className="w-full lg:w-2/3 bg-[#e6f5ff] flex flex-col justify-center px-4 md:px-6 lg:px-12 xl:px-[133px] py-12 md:py-16 lg:py-24">
        <h1 className="text-slate-950 text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-manrope-normal leading-tight md:leading-[40px] lg:leading-[50px] xl:leading-[65px]">
            You&apos;re all set. Your consultation is confirmed.
          </h1>
          <p className="text-slate-950 text-base md:text-lg lg:text-xl font-manrope-normal leading-6 md:leading-7 lg:leading-8 mt-4 md:mt-5 lg:mt-[16px] mb-8 md:mb-10 lg:mb-[54px]">
          Thanks for booking a free 30-minute consultation with the Nordic Cyber Group. We&apos;ve sent the meeting details to your email. Our team is excited to connect and explore how we can support your cybersecurity goals.
          </p>
        </div>
      </section>
    )
  }

  return (
    <section className="min-h-screen flex flex-col lg:flex-row">
      {/* Left Column - Blue Background */}
      <div className="w-full lg:w-1/2 bg-[#488BF3] flex flex-col justify-center px-4 md:px-6 lg:px-12 xl:px-16 py-20 md:py-24 lg:py-24">
        <h1 className="text-white text-4xl md:text-5xl lg:text-6xl xl:text-8xl font-manrope-normal leading-tight md:leading-[50px] lg:leading-[65px] xl:leading-[85px]">
          {finalData.leftTitle}
        </h1>
        <p className="text-white text-xl md:text-2xl lg:text-3xl xl:text-4xl font-manrope-normal leading-7 md:leading-8 lg:leading-9 xl:leading-10 mt-4 md:mt-5 lg:mt-[20px] mb-8 md:mb-10 lg:mb-[54px]">
          {finalData.leftSubtitle}
        </p>
        <div className="flex flex-col gap-6 md:gap-8 lg:gap-[35px]">
          <Link
            href="/free-consultation"
            className="w-full h-12 md:h-14 lg:h-16 bg-white rounded-[10px] text-center flex justify-center items-center text-slate-950 text-base md:text-lg lg:text-xl font-manrope-medium leading-6 md:leading-7 lg:leading-8"

          >
            Free Consultation
          </Link>
          <Link
            href="/contact"
            className="w-full h-12 md:h-14 lg:h-16 rounded-[10px] hover:bg-white hover:text-[#000F19] transition-colors duration-300 border-2 border-white text-center text-white text-base md:text-lg lg:text-xl font-manrope-medium flex items-center justify-center leading-6 md:leading-7 lg:leading-8"

          >
            Contact Us
          </Link>
        </div>
      </div>
      {/* Right Column - Form or Booking Widget */}
      <div className="w-full lg:w-2/3 bg-[#e6f5ff] pt-8 md:pt-10 lg:pt-[43px] flex flex-col justify-center px-4 md:px-6 lg:px-12 xl:px-[133px] pb-8 md:pb-12 lg:pb-0">
      <h2 className="w-full max-w-full lg:max-w-[670px] text-slate-950 text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-manrope-normal leading-tight md:leading-[40px] lg:leading-[50px] xl:leading-[65px]">
      {finalData.rightTitle}
        </h2>
        <p className="w-full max-w-full lg:max-w-[670px] text-zinc-950 text-base md:text-lg lg:text-xl xl:text-2xl font-manrope-normal mt-2 md:mt-3 lg:mt-[4px] mb-6 md:mb-8 lg:mb-[67px] leading-6 md:leading-7 lg:leading-8">
          {finalData.rightDescription}
        </p>

        {/* Calendly/MS Teams Booking Calendar */}
        <div className="w-full relative overflow-hidden rounded-lg bg-white shadow-sm">
          <div 
            className="w-full relative"
            style={{ 
              height: 'clamp(400px, 50vh, 800px)',
              minHeight: '400px'
            }}
          >
            <iframe
              src={"https://calendly.com/joshua-ekaathedesigncollective/ekaa-the-design-collective-1?embed_type=Inline&embed_domain=1"}
              className="absolute top-0 left-0 w-full h-full border-0"
              title="Booking Calendar - Calendly or MS Teams"
              allow="camera; microphone; fullscreen; autoplay"
              allowFullScreen
              loading="lazy"
            />
          </div>
        </div>
      </div>
    </section>
  )
}

export default FreeConsultationSection

