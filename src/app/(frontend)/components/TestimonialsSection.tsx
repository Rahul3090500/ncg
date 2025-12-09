import React from 'react'
import { getPayloadClient } from '@/lib/payload-retry'
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
  // Fetch testimonials section data from CMS
  let cmsData: TestimonialsData | null = null
  
  try {
    const payloadClient = await getPayloadClient()
    const testimonialsSection = await payloadClient.findGlobal({ slug: 'testimonials-section' }).catch(() => null)
    
    if (testimonialsSection?.overline && Array.isArray(testimonialsSection.testimonials)) {
      cmsData = {
        overline: String(testimonialsSection.overline),
        testimonials: testimonialsSection.testimonials.map((t: any) => ({
          name: String(t?.name || ''),
          position: String(t?.position || ''),
          company: String(t?.company || ''),
          image: t?.image?.url ? { url: String(t.image.url) } : undefined,
          quote: String(t?.quote || ''),
        })),
      }
    }
  } catch (error) {
    console.error('Error fetching testimonials section data:', error)
  }

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
