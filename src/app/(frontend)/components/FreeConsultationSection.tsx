'use client'

import React, { useState } from 'react'
import TwoColumnLayout from './TwoColumnLayout'
import CalendlyWidget from './CalendlyWidget'

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

  const defaultData = {
    leftTitle: "Let's Connect",
    leftSubtitle: "What can we do for you?",
    rightTitle: 'Free Consultation',
    rightDescription:
      'Our experts are ready to understand your challenges, answer your questions, and offer tailored cybersecurity guidance – no cost, no commitment.',
  }

  const finalData = { ...defaultData, ...data }

  const handleEventScheduled = () => {
    setIsSubmitted(true)
  }

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
      removeBottomPaddingOnDesktop={true}
    >
      <CalendlyWidget
        calendlyUrl={data?.calendlyUrl}
        onEventScheduled={handleEventScheduled}
      />
    </TwoColumnLayout>
  )
}

export default FreeConsultationSection
