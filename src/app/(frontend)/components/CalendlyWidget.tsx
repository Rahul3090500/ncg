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
  const [calendarHeight, setCalendarHeight] = useState<number | string>(700)
  const [isMobileOrTablet, setIsMobileOrTablet] = useState(false)
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
      const isMobile = window.innerWidth < 768
      const isTablet = window.innerWidth >= 768 && window.innerWidth < 1024
      const mobileOrTablet = isMobile || isTablet
      setIsMobileOrTablet(mobileOrTablet)

      if (containerRef.current) {
        // For mobile and tablet, use full viewport height
        if (mobileOrTablet) {
          const viewportHeight = window.innerHeight
          setCalendarHeight(viewportHeight)
          return
        }

        // For desktop, use parent container height or 100%
        const container = containerRef.current
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

        // Desktop fallback - use 100% to fill parent
        setCalendarHeight('100%')
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
      className={`w-full h-full overflow-hidden relative ${className}`}
      style={isMobileOrTablet && typeof calendarHeight === 'number' ? {
        height: `${calendarHeight}px`
      } : undefined}
    >
      <InlineWidget
        url={iframeUrl}
        styles={{
          height: isMobileOrTablet && typeof calendarHeight === 'number'
            ? `${calendarHeight}px`
            : typeof calendarHeight === 'number'
            ? `${calendarHeight}px`
            : '100%',
          width: '100%',
          borderRadius: '8px',
          overflow: 'hidden',
        }}
      />
    </div>
  )
}

export default CalendlyWidget
