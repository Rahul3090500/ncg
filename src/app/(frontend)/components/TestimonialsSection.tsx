import React from 'react'
import dynamic from 'next/dynamic'

// Dynamically import TestimonialsCarousel for better code splitting
const TestimonialsCarousel = dynamic(() => import('./TestimonialsCarousel'), {
  loading: () => <div className="h-[600px] w-full" />,
})
import testimonialsData from '../data/testimonials.json'

interface Testimonial {
  name: string
  position: string
  company: string
  image?: {
    url: string
  }
  quote: string
}

interface TestimonialsData {
  overline: string
  testimonials: Testimonial[]
}

const TestimonialsSection = async () => {
  // Use fallback data - don't fetch from database (would block page load)
  // Data can be fetched client-side if needed
  let cmsData: TestimonialsData | null = null
  
  // Try to get from homepage data if available (passed via props or context)
  // For now, use fallback to avoid blocking

  // Use CMS data if available, otherwise use fallback
  const data: TestimonialsData = cmsData || {
    overline: 'client testimonials',
    testimonials: testimonialsData.testimonials.map((t) => ({
      name: String(t.name || ''),
      position: String(t.position || ''),
      company: String(t.company || ''),
      image: t.image ? { url: String(t.image) } : undefined,
      quote: String(t.quote || ''),
    })),
  }

  return <div className="containersection px-4 md:px-6 lg:px-10"><TestimonialsCarousel data={data} /></div>
}

export default TestimonialsSection
