'use client'

import React, { useState, useEffect } from 'react'
import TwoColumnLayout from './TwoColumnLayout'

interface FreeConsultationSectionProps {
  data?: {
    leftTitle?: string
    leftSubtitle?: string
    rightTitle?: string
    rightDescription?: string
    calendlyUrl?: string
  }
}

const FreeConsultationSection = ({ data }: FreeConsultationSectionProps) => {
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isIframeLoaded, setIsIframeLoaded] = useState(false)

  // Default Calendly URL - replace with your actual Calendly link
  const defaultCalendlyUrl = 'https://calendly.com/joshua-ekaathedesigncollective/ekaa-the-design-collective-1'
  
  const defaultData = {
    leftTitle: "Let's Connect",
    leftSubtitle: "What can we do for you?",
    rightTitle: "Free Consultation",
    rightDescription: "Our experts are ready to understand your challenges, answer your questions, and offer tailored cybersecurity guidance – no cost, no commitment.",
    calendlyUrl: process.env.NEXT_PUBLIC_CALENDLY_URL || defaultCalendlyUrl,
  }

  const finalData = { ...defaultData, ...data }

  // Build iframe URL with parameters
  const iframeUrl = finalData.calendlyUrl.includes('?') 
    ? `${finalData.calendlyUrl}&hide_gdpr_banner=1&hide_landing_page_details=1&text_color=0f172a&primary_color=488BF3` 
    : `${finalData.calendlyUrl}?hide_gdpr_banner=1&hide_landing_page_details=1&text_color=0f172a&primary_color=488BF3`

  // Listen for Calendly events
  useEffect(() => {
    const handleCalendlyEvent = (e: MessageEvent) => {
      if (e.origin === 'https://calendly.com') {
        if (e.data.event === 'calendly.event_scheduled') {
          setIsSubmitted(true)
        }
      }
    }

    window.addEventListener('message', handleCalendlyEvent)
    return () => window.removeEventListener('message', handleCalendlyEvent)
  }, [])

  return (
    <TwoColumnLayout
      leftTitle={finalData.leftTitle}
      leftSubtitle={finalData.leftSubtitle}
      rightTitle={finalData.rightTitle}
      rightDescription={finalData.rightDescription}
      isSubmitted={isSubmitted}
      successTitle="You're all set. Your consultation is confirmed."
      successDescription="Thanks for booking a free 30-minute consultation with the Nordic Cyber Group. We've sent the meeting details to your email. Our team is excited to connect and explore how we can support your cybersecurity goals."
      primaryButton="consultation"
    >
      {/* Calendly Iframe */}
      <div className="w-full h-full overflow-hidden relative">
        {/* Loading State */}
        {!isIframeLoaded && (
          <div className="absolute inset-0 w-full h-full flex items-center justify-center bg-[#e6f5ff] z-10">
            <div className="flex flex-col items-center gap-4">
              <div className="w-12 h-12 border-4 border-[#488BF3] border-t-transparent rounded-full animate-spin" />
              <p className="text-slate-600 font-manrope-medium">Loading calendar...</p>
            </div>
          </div>
        )}
        
        <iframe
          src={iframeUrl}
          width="auto"
          height="100%"
          frameBorder="0"
          title="Schedule a consultation"
          onLoad={() => setIsIframeLoaded(true)}
        />
      </div>
    </TwoColumnLayout>
  )
}

export default FreeConsultationSection
