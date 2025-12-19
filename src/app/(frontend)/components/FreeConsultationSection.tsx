'use client'

import React, { useState, useEffect, useRef } from 'react'
import TwoColumnLayout from './TwoColumnLayout'
import { InlineWidget } from "react-calendly";

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
  const [calendarHeight, setCalendarHeight] = useState(700)
  const containerRef = React.useRef<HTMLDivElement>(null)

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

  // Calculate responsive calendar height
  useEffect(() => {
    const calculateHeight = () => {
      if (containerRef.current) {
        const container = containerRef.current
        const rect = container.getBoundingClientRect()
        const availableHeight = rect.height
        
        // Use available height, with responsive minimums
        const minHeight = window.innerWidth < 768 ? 500 : window.innerWidth < 1024 ? 600 : 650
        const calculatedHeight = Math.max(availableHeight, minHeight)
        setCalendarHeight(calculatedHeight)
      }
    }

    // Calculate on mount and resize
    calculateHeight()
    window.addEventListener('resize', calculateHeight)
    
    // Recalculate after a short delay to ensure layout is complete
    const timeoutId = setTimeout(calculateHeight, 100)

    return () => {
      window.removeEventListener('resize', calculateHeight)
      clearTimeout(timeoutId)
    }
  }, [])

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
      <div ref={containerRef} className="w-full h-full overflow-hidden relative">
        <InlineWidget
          url={iframeUrl}
          styles={{
            height: `${calendarHeight}px`,
            width: "100%",
            borderRadius: "8px",
          }}
        />
      </div>
    </TwoColumnLayout>
  )
}

export default FreeConsultationSection
