'use client'

import React from 'react'
import Link from 'next/link'

interface TwoColumnLayoutProps {
  // Left column content
  leftTitle?: string
  leftSubtitle?: string
  // Right column content
  rightTitle?: string
  rightDescription?: string
  // Success state
  isSubmitted?: boolean
  successTitle?: string
  successDescription?: string
  // Children for right column content (form, calendly, etc.)
  children: React.ReactNode
  // Swap button styles (which one is filled vs outlined)
  primaryButton?: 'consultation' | 'contact'
}

const TwoColumnLayout = ({
  leftTitle = "Let's Connect",
  leftSubtitle = "What can we do for you?",
  rightTitle,
  rightDescription,
  isSubmitted = false,
  successTitle = "Thank you for reaching out to us.",
  successDescription = "Your message has been successfully submitted. Our team will get back to you shortly.",
  children,
  primaryButton = 'contact',
}: TwoColumnLayoutProps) => {
  
  // Button components based on which is primary
  const ConsultationButton = primaryButton === 'consultation' ? FilledButton : OutlinedButton
  const ContactButton = primaryButton === 'contact' ? FilledButton : OutlinedButton

  if (isSubmitted) {
    return (
      <section className="h-[100dvh] flex flex-col lg:flex-row overflow-hidden">
        {/* Left Column - Blue Background (40%) */}
        <div className="w-full lg:w-[40%] bg-[#488BF3] flex flex-col justify-center px-4 md:px-6 lg:px-10 xl:px-14 py-12 md:py-16 lg:py-24 flex-shrink-0">
          <h1 className="text-white text-4xl md:text-5xl lg:text-5xl xl:text-8xl font-manrope-normal leading-tight md:leading-[50px] lg:leading-[55px] xl:leading-[70px]">
            {leftTitle}
          </h1>
          <p className="text-white text-xl md:text-2xl lg:text-2xl xl:text-3xl font-manrope-normal leading-7 md:leading-8 lg:leading-9 mt-4 md:mt-5 lg:mt-[20px] mb-8 md:mb-10 lg:mb-[40px]">
            {leftSubtitle}
          </p>
          <div className="flex flex-col gap-6 md:gap-8 lg:gap-5">
            <ConsultationButton href="/free-consultation">Free Consultation</ConsultationButton>
            <ContactButton href="/contact">Contact Us</ContactButton>
          </div>
        </div>

        {/* Right Column - Success Message (60%) */}
        <div className="w-full lg:w-[60%] bg-[#e6f5ff] flex flex-col justify-center px-4 md:px-6 lg:px-12 xl:px-16 py-12 md:py-16 lg:py-24">
          <h1 className="text-slate-950 text-2xl  md:text-3xl lg:text-4xl xl:text-5xl font-manrope-normal leading-tight md:leading-[40px] lg:leading-[50px] xl:leading-[65px]">
            {successTitle}
          </h1>
          <p className="text-slate-950 text-base md:text-lg lg:text-xl font-manrope-normal leading-6 md:leading-7 lg:leading-8 mt-4 md:mt-5 lg:mt-[16px]">
            {successDescription}
          </p>
        </div>
      </section>
    )
  }

  return (
    <section className="min-h-screen lg:h-[100dvh] flex flex-col lg:flex-row overflow-hidden">
      {/* Left Column - Blue Background (40%) */}
      <div className="w-full lg:w-[40%] bg-[#488BF3] flex flex-col justify-center px-4 md:px-6 lg:px-10 xl:px-14 py-12 md:py-16 lg:py-24 flex-shrink-0">
        <h1 className="text-white text-4xl md:text-5xl lg:text-5xl xl:text-8xl font-manrope-normal leading-tight md:leading-[50px] lg:leading-[55px] xl:leading-[80px]">
          {leftTitle}
        </h1>
        <p className="text-white text-xl md:text-2xl lg:text-2xl xl:text-3xl font-manrope-normal leading-7 md:leading-8 lg:leading-9 mt-4 md:mt-5 lg:mt-[20px] mb-8 md:mb-10 lg:mb-[40px]">
          {leftSubtitle}
        </p>
        <div className="flex flex-col gap-6 md:gap-8 lg:gap-5">
          <ConsultationButton href="/free-consultation">Free Consultation</ConsultationButton>
          <ContactButton href="/contact">Contact Us</ContactButton>
        </div>
      </div>

      {/* Right Column - Content Area (60%) */}
      <div className="w-full bg-[#e6f5ff] flex flex-col h-full lg:h-[100dvh] px-4 md:px-6 lg:px-12 xl:px-16 py-8 md:py-10 lg:py-12">
        {/* Header Section */}
        {(rightTitle || rightDescription) && (
          <div className="flex-shrink-0 mb-6 md:mb-8">
            {rightTitle && (
              <h2 className="text-slate-950 mt-4 text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-manrope-normal leading-tight md:leading-[40px] lg:leading-[50px] xl:leading-[65px]">
                {rightTitle}
              </h2>
            )}
            {rightDescription && (
              <p className="text-zinc-950 text-base md:text-lg lg:text-xl xl:text-2xl font-manrope-medium mt-2 md:mt-3 lg:mt-1 leading-6 md:leading-7 lg:leading-8">
                {rightDescription}
              </p>
            )}
          </div>
        )}

        {/* Main Content (Form, Calendly, etc.) */}
        <div className="flex-1 min-h-0">
          {children}
        </div>
      </div>
    </section>
  )
}

// Reusable button components
const FilledButton = ({ href, children }: { href: string; children: React.ReactNode }) => (
  <Link
    href={href}
    className="w-full h-12 md:h-14 lg:h-16 bg-white rounded-[10px] text-center flex justify-center items-center text-slate-950 text-base md:text-lg lg:text-xl font-manrope-medium leading-6 md:leading-7 lg:leading-8 transition-colors duration-300"
  >
    {children}
  </Link>
)

const OutlinedButton = ({ href, children }: { href: string; children: React.ReactNode }) => (
  <Link
    href={href}
    className="w-full h-12 md:h-14 lg:h-16 rounded-[10px] hover:bg-white hover:text-[#000F19] transition-colors duration-300 border-2 border-white text-center text-white text-base md:text-lg lg:text-xl font-manrope-medium flex items-center justify-center leading-6 md:leading-7 lg:leading-8"
  >
    {children}
  </Link>
)

export default TwoColumnLayout

