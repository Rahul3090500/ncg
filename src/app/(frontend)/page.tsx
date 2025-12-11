import { getHomepageData } from '../../lib/payload'
import ClientHomepage from './ClientHomepage'
import approachData from './data/approach.json'
import React from 'react'
import dynamicImport from 'next/dynamic'

// Dynamically import heavy sections for better code splitting
const TrustedBySection = dynamicImport(() => import('./components/TrustedBySection'), {
  loading: () => <div className="h-[300px] w-full" />,
})

const CaseStudiesHeroSection = dynamicImport(() => import('./components/CaseStudiesHeroSection'), {
  loading: () => <div className="h-[400px] w-full" />,
})

const CaseStudiesGridSection = dynamicImport(() => import('./components/CaseStudiesGridSection'), {
  loading: () => <div className="h-[500px] w-full" />,
})

const TestimonialsSection = dynamicImport(() => import('./components/TestimonialsSection'), {
  loading: () => <div className="h-[600px] w-full" />,
})

const OurApproachSection = dynamicImport(() => import('./components/OurApproachSection'), {
  loading: () => <div className="h-[800px] w-full" />,
})

const OurApproachSectionMobile = dynamicImport(() => import('./components/OurApproachSectionMobile'), {
  loading: () => <div className="h-[800px] w-full md:hidden" />,
})

const ContactSection = dynamicImport(() => import('./components/ContactSection'), {
  loading: () => <div className="h-[500px] w-full" />,
})

interface HomepageData {
  heroSection: {
    mainHeading: string
    backgroundImage?: {
      url: string
    } | null
    animatedTexts?: Array<{
      id?: string | number
      text: string
    }> | null
    backgroundImages?: Array<{
      id?: string | number
      image?: {
        url: string
      } | number | null
    }> | null
    callToAction: {
      description: string
      ctaHeading: string
      ctaLink: string
      backgroundColor: string
    }
  }
  servicesSection?: {
    sectionTitle: string
    services: Array<any>
  }
  trustedBySection?: {
    overline: string
    heading: string
    description: string
    clients: Array<{
      name: string
      logo: {
        url: string
      }
    }>
  }
  caseStudiesHeroSection?: {
    overline: string
    heading: string
    backgroundImage?: {
      url: string
    }
  }
  caseStudiesGridSection?: {
    caseStudies: Array<{
      id: string
      image?: {
        url: string
      }
      category: string
      iconType: string
      title: string
      description: string
      link?: string
    }>
    buttonText: string
    buttonLink: string
  }
  approachSection?: {
    title: string
    heading: string
    description: string
    buttonText: string
    buttonLink: string
    steps: Array<{
      id: string
      title: string
      description: string
      image?: {
        url: string
      }
    }>
  }
}

// Use ISR - revalidate every 5 minutes (reduced for instant updates)
export const revalidate = 300

const Home = async () => {
  // Fetch data on the server
  const homepageData = await getHomepageData()

  // Use CMS data if available, otherwise fall back to defaults
  const defaultHeroData = {
    mainHeading: 'Your Trusted\nCybersecurity Partner',
    backgroundImage: undefined as { url: string } | null | undefined,
    animatedTexts: [
      { text: 'Identity Security' },
      { text: 'Digital Compliance' },
      { text: 'Digital Fraud' },
    ] as Array<{ id?: string | number; text: string }>,
    backgroundImages: [
      { image: { url: '/assets/8669139b5ad96631528dce4a3734eddb4b03dc40.jpg' } },
      { image: { url: '/assets/44a78bc1d93f3caa1a0285e1634dbba906ab3fe9.jpg' } },
      { image: { url: '/assets/a0b2532e796484e0f389291d63718e140a6b2848.jpg' } },
    ] as Array<{ id?: string | number; image?: { url: string } | number | null }>,
    callToAction: {
      description:
        "You don't need another security provider sending you generic reports. You need cybersecurity experts who understand your business, give honest advice, and solve problems others can't even see.",
      ctaHeading: 'Get Free\nConsultation',
      ctaLink: '/contact',
      backgroundColor: '#001D5C',
    },
  }
  const heroSection = (homepageData as HomepageData)?.heroSection
  
  const heroData: HomepageData['heroSection'] = heroSection?.mainHeading ? {
    ...defaultHeroData,
    ...heroSection,
    // Merge animatedTexts and backgroundImages if they exist in CMS
    // Payload returns: { id: string, text: string }[] or { id: string, image: Media }[]
    animatedTexts: (heroSection.animatedTexts && Array.isArray(heroSection.animatedTexts) && heroSection.animatedTexts.length > 0)
      ? heroSection.animatedTexts
          .map((item: any): { id?: string | number; text: string } | null => {
            // Handle Payload structure: { id: string, text: string }
            if (typeof item === 'object' && item !== null && 'text' in item && typeof item.text === 'string') {
              return { id: item.id, text: item.text };
            }
            // Handle direct string
            if (typeof item === 'string') {
              return { text: item };
            }
            return null;
          })
          .filter((item): item is { id?: string | number; text: string } => item !== null)
      : defaultHeroData.animatedTexts,
    backgroundImages: (heroSection.backgroundImages && Array.isArray(heroSection.backgroundImages) && heroSection.backgroundImages.length > 0)
      ? heroSection.backgroundImages
          .map((item: any): { id?: string | number; image?: { url: string } | number | null } | null => {
            // Handle Payload structure: { id: string, image: Media }
            if (typeof item === 'object' && item !== null) {
              const image = item.image;
              // If image is a Media object with url
              if (typeof image === 'object' && image !== null && 'url' in image && typeof image.url === 'string') {
                return { id: item.id, image: { url: image.url } };
              }
              // If image is a number (ID), we'll need to resolve it, but for now pass it through
              if (typeof image === 'number') {
                return { id: item.id, image: image };
              }
              // Handle direct url structure: { url: string }
              if ('url' in item && typeof item.url === 'string') {
                return { id: item.id, image: { url: item.url } };
              }
            }
            // Handle direct string
            if (typeof item === 'string') {
              return { image: { url: item } };
            }
            return null;
          })
          .filter((item): item is { id?: string | number; image?: { url: string } | number | null } => 
            item !== null && (item.image === null || typeof item.image === 'number' || (typeof item.image === 'object' && 'url' in item.image))
          )
      : defaultHeroData.backgroundImages,
  } : defaultHeroData

  // Use CMS services data if available, otherwise fall back to empty structure
  const servicesSection = (homepageData as HomepageData)?.servicesSection
  
  // Debug: Log services section structure in production
  if (process.env.NODE_ENV === 'production' && servicesSection) {
    console.log('Homepage: servicesSection structure:', {
      hasServices: !!servicesSection.services,
      servicesIsArray: Array.isArray(servicesSection.services),
      servicesLength: Array.isArray(servicesSection.services) ? servicesSection.services.length : 0,
      firstServiceSubServices: Array.isArray(servicesSection.services) && servicesSection.services.length > 0
        ? {
            hasSubServices: !!servicesSection.services[0].subServices,
            subServicesIsArray: Array.isArray(servicesSection.services[0].subServices),
            subServicesLength: Array.isArray(servicesSection.services[0].subServices) 
              ? servicesSection.services[0].subServices.length 
              : 0
          }
        : null
    })
  }
  
  // If services-section exists but has no services, or doesn't exist, fetch all services as fallback
  let servicesDataFromCMS
  if (servicesSection?.sectionTitle && servicesSection?.services && Array.isArray(servicesSection.services) && servicesSection.services.length > 0) {
    // Use CMS data if it has services
    servicesDataFromCMS = servicesSection
  } else {
    // Fallback: fetch all services and create structure
    const { getServicesData } = await import('../../lib/payload')
    const allServices = await getServicesData()
    
    if (allServices.length > 0) {
      // Transform services to match the expected structure
      servicesDataFromCMS = {
        sectionTitle: servicesSection?.sectionTitle || 'Our\nServices',
        services: allServices.map((service: any) => ({
          service: service, // Full service object
          subServices: [], // Empty - user can add sub-services in admin
        })),
      }
    } else {
      // No services at all
      servicesDataFromCMS = {
        sectionTitle: servicesSection?.sectionTitle || 'Our\nServices',
        services: [],
      }
    }
  }

  const defaultTrustedByData = {
    overline: 'our clients',
    heading: 'Trusted by Industry Leaders',
    description: 'Helping banks, fintechs, governments, and global enterprises stay secure',
    clients: [],
  }
  const trustedBySection = (homepageData as HomepageData)?.trustedBySection
  const trustedByData = trustedBySection?.heading ? trustedBySection : defaultTrustedByData

  const defaultCaseStudiesHeroData = {
    overline: 'case studies',
    heading: 'Real Results.\nProven Security.',
  }
  const caseStudiesHeroSection = (homepageData as HomepageData)?.caseStudiesHeroSection
  const caseStudiesHeroData = caseStudiesHeroSection?.heading ? caseStudiesHeroSection : defaultCaseStudiesHeroData

  const caseStudiesGridSection = (homepageData as HomepageData)?.caseStudiesGridSection as any
  const selected = Array.isArray(caseStudiesGridSection?.selectedCaseStudies)
    ? caseStudiesGridSection.selectedCaseStudies
    : []
  const mappedSelected = selected.map((cs: any) => ({
    id: cs?.id,
    image: cs?.image?.url ? { url: cs.image.url } : undefined,
    category: cs?.category,
    iconType: cs?.iconType,
    iconAssetUrl: cs?.icon?.svg?.url,
    title: cs?.title,
    description: cs?.description,
    link: cs?.link,
  }))
  const caseStudiesGridData = {
    buttonText: caseStudiesGridSection?.buttonText || 'All Case Studies',
    buttonLink: caseStudiesGridSection?.buttonLink || '/case-studies',
    caseStudies: mappedSelected.slice(0, 3),
  }

  const defaultApproachData = {
    title: 'Our Approach',
    heading: 'Embracing the power of simplified cybersecurity',
    description:
      "In an era where digital threats morph and expand daily, we answer not by complicating our defences, but by simplifying them. We're pioneering a shift: redefining cybersecurity for tomorrow's challenges.",
    buttonText: 'Contact Us',
    buttonLink: '/contact',
    steps: approachData.steps,
  }
  const approachSection = (homepageData as HomepageData)?.approachSection
  const approachDataFromCMS = approachSection?.title ? approachSection : defaultApproachData

  return (
    <div>
      <ClientHomepage heroData={heroData} servicesData={servicesDataFromCMS} />
      <TrustedBySection data={trustedByData} />
      <CaseStudiesHeroSection data={caseStudiesHeroData} />
      <CaseStudiesGridSection data={caseStudiesGridData} />
      <TestimonialsSection />
      <OurApproachSection data={approachDataFromCMS} />
      <OurApproachSectionMobile data={approachDataFromCMS} />
      <ContactSection />
    </div>
  )
}

export default Home
