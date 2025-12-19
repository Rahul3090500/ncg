'use client'

import React, { useEffect, useRef, useState } from 'react'
import { InlineWidget } from 'react-calendly'

interface CalendlyWidgetProps {
  calendlyUrl?: string
  onEventScheduled?: () => void
  className?: string
}

const CalendlyWidget: React.FC<CalendlyWidgetProps> = ({
  calendlyUrl,
  onEventScheduled,
  className = '',
}) => {
  const [calendarHeight, setCalendarHeight] = useState(700)
  const containerRef = useRef<HTMLDivElement>(null)

  // Default Calendly URL - fallback if not provided
  const defaultCalendlyUrl =
    'https://calendly.com/joshua-ekaathedesigncollective/ekaa-the-design-collective-1'

  // Use provided URL, environment variable, or default
  const finalCalendlyUrl =
    calendlyUrl || process.env.NEXT_PUBLIC_CALENDLY_URL || defaultCalendlyUrl

  // Build iframe URL with parameters
  const iframeUrl = finalCalendlyUrl.includes('?')
    ? `${finalCalendlyUrl}&hide_gdpr_banner=1&hide_landing_page_details=1&text_color=0f172a&primary_color=488BF3`
    : `${finalCalendlyUrl}?hide_gdpr_banner=1&hide_landing_page_details=1&text_color=0f172a&primary_color=488BF3`

  // Calculate responsive calendar height to fit container
  useEffect(() => {
    const calculateHeight = () => {
      if (containerRef.current) {
        const container = containerRef.current
        // Get the parent container (flex-1 div from TwoColumnLayout)
        const parent = container.parentElement
        if (parent) {
          const parentRect = parent.getBoundingClientRect()
          const availableHeight = parentRect.height

          // Use the actual parent container height
          if (availableHeight > 0) {
            setCalendarHeight(availableHeight)
            return
          }
        }

        // Fallback: use viewport height minus estimated header/padding
        const viewportHeight = window.innerHeight
        const isMobile = window.innerWidth < 768
        const isTablet = window.innerWidth >= 768 && window.innerWidth < 1024

        // More accurate calculation for right column
        const headerSectionHeight = isMobile ? 120 : isTablet ? 140 : 160
        const padding = isMobile ? 32 : isTablet ? 40 : 48
        const calculatedHeight = viewportHeight - headerSectionHeight - padding

        const minHeight = isMobile ? 400 : isTablet ? 500 : 600
        setCalendarHeight(Math.max(calculatedHeight, minHeight))
      }
    }

    // Calculate on mount
    calculateHeight()
    
    // Use ResizeObserver for better performance
    const resizeObserver = new ResizeObserver(() => {
      calculateHeight()
    })

    if (containerRef.current) {
      resizeObserver.observe(containerRef.current)
    }

    // Also listen to window resize
    window.addEventListener('resize', calculateHeight)

    // Recalculate after delays to ensure layout is complete
    const timeoutId1 = setTimeout(calculateHeight, 100)
    const timeoutId2 = setTimeout(calculateHeight, 500)

    return () => {
      resizeObserver.disconnect()
      window.removeEventListener('resize', calculateHeight)
      clearTimeout(timeoutId1)
      clearTimeout(timeoutId2)
    }
  }, [])

  // Listen for Calendly events
  useEffect(() => {
    const handleCalendlyEvent = (e: MessageEvent) => {
      if (e.origin === 'https://calendly.com') {
        if (e.data.event === 'calendly.event_scheduled') {
          onEventScheduled?.()
        }
      }
    }

    window.addEventListener('message', handleCalendlyEvent)
    return () => window.removeEventListener('message', handleCalendlyEvent)
  }, [onEventScheduled])

  return (
    <div
      ref={containerRef}
      className={`w-full h-full overflow-hidden  relative ${className}`}
    >
      <InlineWidget
        url={iframeUrl}
        styles={{
          height: `100%`,
          width: '100%',
          borderRadius: '8px',
          overflow: 'hidden',
        }}
      />
    </div>
  )
}

export default CalendlyWidget
