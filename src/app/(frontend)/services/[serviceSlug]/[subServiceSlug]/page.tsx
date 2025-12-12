import React from 'react'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { getSubServiceBySlug, getServiceBySlug } from '@/lib/payload'
import AnimatedButton from '../../../components/AnimatedButton'
import BenefitsCarousel from '../../../components/BenefitsCarousel'
import dynamic from 'next/dynamic'

// Dynamically import heavy components for better code splitting
const TestimonialsSection = dynamic(() => import('@/app/(frontend)/components/TestimonialsSection'), {
  loading: () => <div className="h-[600px] w-full" />,
})

const ContactSection = dynamic(() => import('@/app/(frontend)/components/ContactSection'), {
  loading: () => <div className="h-[500px] w-full" />,
})
import SuccessStoriesParallax from '@/app/(frontend)/components/SuccessStoriesParallax'
import ChallengesSectionClient from '@/app/(frontend)/components/ChallengesSectionClient'
import IGAServicesSection from '@/app/(frontend)/components/IGAServicesSection'
import testimonialsData from '@/app/(frontend)/data/testimonials.json'

type PageProps = {
  params: Promise<{ serviceSlug: string; subServiceSlug: string }>
}

const SubServiceDetailPage = async ({ params }: PageProps) => {
  const { serviceSlug, subServiceSlug } = await params
  const subService = await getSubServiceBySlug(serviceSlug, subServiceSlug)
  const service = await getServiceBySlug(serviceSlug)

  if (!subService || !service) {
    notFound()
  }

  // Extract data with fallbacks
  const heroTitle = subService.heroTitle || subService.title
  const heroImage = subService.heroImage
  const defaultTestimonialsData = {
    overline: 'client testimonials',
    testimonials: testimonialsData.testimonials.map((t) => ({
      name: t.name,
      position: t.position,
      company: t.company,
      image: t.image ? { url: t.image } : undefined,
      quote: t.quote,
    })),
  }
  // New sections
  const importanceTitle = subService.importanceTitle
  const importanceDescription = subService.importanceDescription
  const importanceImage = subService.importanceImage
  const downloadBannerTitle = subService.downloadBannerTitle
  const downloadBannerDescription = subService.downloadBannerDescription
  const downloadBannerButtonText = subService.downloadBannerButtonText || 'Download Now'
  const downloadBannerButtonLink = subService.downloadBannerButtonLink || '#'
  const downloadBannerImage = subService.downloadBannerImage

  const challengesTitle = subService.challengesTitle
  const challengesDescription = subService.challengesDescription
  const challengesButtonText = subService.challengesButtonText || 'Start Assessment'
  const challengesButtonLink = subService.challengesButtonLink || '#'
  const challenges = Array.isArray(subService.challenges) ? subService.challenges : []

  const benefitsTitle = subService.benefitsTitle
  const benefitsDescription = subService.benefitsDescription
  const benefitsConclusion = subService.benefitsConclusion
  const benefitsButtonText = subService.benefitsButtonText || 'Book Now'
  const benefitsButtonLink = subService.benefitsButtonLink || '#'
  const advantages = Array.isArray(subService.advantages) ? subService.advantages : []

  const coreFeaturesTitle = subService.coreFeaturesTitle
  const coreFeaturesDescription = subService.coreFeaturesDescription
  const coreFeaturesImage = subService.coreFeaturesImage
  const coreFeatures = Array.isArray(subService.coreFeatures) ? subService.coreFeatures : []

  const igaServicesTitle = subService.igaServicesTitle
  const igaServicesDescription = subService.igaServicesDescription
  const igaServices = Array.isArray(subService.igaServices) ? subService.igaServices : []

  const successStoriesTitle = subService.successStoriesTitle
  const successStoriesDescription = subService.successStoriesDescription
  const successStoriesCtaText = subService.successStoriesCtaText
  const successStoriesCtaLink = subService.successStoriesCtaLink || '#'
  const successStoriesBackgroundImage = subService.successStoriesBackgroundImage
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-white">
        <div className="relative w-full">
          {/* White background at top */}
          <div className="relative bg-white pt-26 md:pt-26 lg:pt-[179px] pb-[89px]">
            <div className="containersection px-4 md:px-6 lg:px-24">
              <p className="text-[#488BF3] uppercase font-manrope-bold text-xs md:text-sm lg:text-base tracking-wider md:tracking-widest ml-0 md:ml-8 lg:ml-36">
                {service.title?.toUpperCase()} / {subService.title?.toUpperCase()}
              </p>
              <h1 className="text-[#000F19] font-manrope-bold text-2xl md:text-3xl lg:text-5xl leading-tight md:leading-[40px] lg:leading-[60px] w-full md:w-[90%] lg:w-[80%] mb-3 ml-0 md:ml-8 lg:ml-36">
                {subService.title}
              </h1>
              <p className="text-[#000F19] text-base md:text-lg lg:text-xl font-manrope-normal leading-6 md:leading-7 lg:leading-8 w-full md:w-[90%] lg:w-[80%] mb-6 md:mb-8 lg:mb-[39px] ml-0 md:ml-8 lg:ml-36">
                {subService.description}
              </p>
              <div className="ml-0 md:ml-8 lg:ml-36 mt-4 md:mt-6">
                <AnimatedButton
                  text="Schedule Free Consultation"
                  link="#"
                  bgColor="#488BF3"
                  hoverBgColor="#3a7be0"
                  width="w-72"
                  className="px-6 md:px-8"
                />
              </div>
            </div>
          </div>

          {/* Bottom image/gradient section */}
          <div className="relative w-full h-48 md:h-64 lg:h-96">
            {heroImage?.url ? (
              <div className="absolute inset-0">
                <img src={heroImage.url} alt={heroTitle} className="w-full h-full object-cover" />
              </div>
            ) : (
              <div
                className="absolute inset-0"
                style={{
                  background: 'linear-gradient(to right, #E3F2FD 0%, #F3E5F5 100%)',
                }}
              />
            )}
          </div>
        </div>
      </section>

      {/* Importance Section */}
      {importanceTitle && (
        <section className="bg-white relative overflow-hidden">
          {/* Mobile/Tablet: Column Layout */}
          <div className="lg:hidden">
            <div className="containersection px-4 md:px-6 py-8 md:py-12">
              <h2 className="text-[#000F19] font-manrope-bold text-2xl md:text-3xl lg:text-5xl leading-tight md:leading-[40px] lg:leading-[60px] mb-4 md:mb-6">
                {importanceTitle}
              </h2>
              <p className="text-[#000F19]/60 text-base md:text-lg lg:text-xl font-manrope-normal leading-6 md:leading-7 lg:leading-8 mb-6 md:mb-8">
                {importanceDescription}
              </p>
              {importanceImage?.url && (
                <div className="w-full h-64 md:h-80 lg:h-96 rounded-lg overflow-hidden">
                  <img
                    src={importanceImage.url}
                    alt={importanceTitle}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Desktop: Side-by-side Layout */}
          <div className="hidden lg:block relative">
            <div className="containersection px-24 mx-auto mr-0 relative z-10">
              <div className="pt-20 pb-40 w-[619px]">
                <h2 className="text-[#000F19] font-manrope-bold text-5xl leading-[60px] mb-[30px]">
                  {importanceTitle}
                </h2>
                <p className="text-[#000F19]/60 text-xl font-manrope-normal leading-8">
                  {importanceDescription}
                </p>
              </div>
            </div>
            {importanceImage?.url && (
              <div className="absolute right-0 top-0 bottom-0 w-[50vw] min-w-[400px]">
                <img
                  src={importanceImage.url}
                  alt={importanceTitle}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
          </div>
        </section>
      )}

      {/* Download Banner */}
      {downloadBannerTitle && (
        <section className="bg-[#488BF3]">
          <div className="containersection px-4 md:px-6 h-full py-16 md:py-12 lg:py-12 lg:w-[70%]! lg:mx-auto">
            <div className="flex flex-col md:flex-row justify-center md:justify-between items-start md:items-center h-full gap-6 md:gap-8 lg:gap-[123px]">
              {downloadBannerImage?.url && (
                <div className="relative w-fit h-64 md:h-72 lg:h-96 flex-shrink-0 shadow-[12px_13px_12.899999618530273px_-1px_rgba(0,0,0,0.36)] flex items-center justify-center overflow-hidden order-1 md:order-1 mx-auto md:mx-0">
                  <img
                    src={downloadBannerImage.url}
                    alt={downloadBannerTitle}
                    className="w-full h-full object-contain object-center"
                    style={{
                      maxHeight: '100%',
                      maxWidth: '100%'
                    }}
                  />
                </div>
              )}
              <div className="text-white w-full md:flex-1 lg:w-[818px] -mt-0 md:-mt-[30px] lg:-mt-[50px] ml-0 text-left order-2 md:order-2">
                <h2 className="text-white font-manrope-semibold text-2xl md:text-3xl lg:text-5xl leading-tight md:leading-[40px] lg:leading-[58px] mb-2 md:mb-3 lg:mb-1">
                  {downloadBannerTitle}
                </h2>
                <p className="text-white/90 text-base md:text-lg lg:text-xl mb-6 md:mb-8 lg:mb-[67px] font-manrope-normal leading-6 md:leading-7 lg:leading-8">
                  {downloadBannerDescription}
                </p>
                <div className="flex justify-start">
                  <AnimatedButton
                    text={downloadBannerButtonText}
                    link={downloadBannerButtonLink}
                    bgColor="#ffffff"
                    hoverBgColor="#f0f0f0"
                    textColor="#000F19"
                    hoverTextColor="#000F19"
                    width="w-44"
                    className="px-6 md:px-8"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Challenges Section */}
      {challengesTitle && challenges.length > 0 && (
        <ChallengesSectionClient
          challengesTitle={challengesTitle}
          challengesDescription={challengesDescription}
          challengesButtonText={challengesButtonText}
          challengesButtonLink={challengesButtonLink}
          challenges={challenges}
        />
      )}

      {/* Benefits Section */}
      {benefitsTitle && advantages.length > 0 && (
        <section className="pb-8 md:pb-12 lg:pb-[65px] pt-8 md:pt-12 lg:pt-[83px] bg-[#F4F7FF]">
          <div className="mx-auto overflow-visible!">
            <div className="text-left mb-6 md:mb-8 lg:mb-12 containersection px-4 md:px-6 lg:px-10">
              <h2 className="text-[#000F19] font-manrope-semibold text-2xl md:text-3xl lg:text-5xl leading-tight md:leading-[45px] lg:leading-[60px] mb-3 md:mb-4">
                {benefitsTitle}
              </h2>
              <p className="text-[#000F19] text-base md:text-lg lg:text-xl font-manrope-semibold leading-6 md:leading-7 ml-0 w-full md:w-[90%] lg:w-[1009px]">
                {benefitsDescription}
              </p>
            </div>
            <div className="mt-6 md:mt-8 lg:mt-12">
              <BenefitsCarousel benefits={advantages} />
            </div>
            {benefitsConclusion && (
              <div className="flex flex-col items-center justify-center mt-6 md:mt-8 lg:mt-[44px] px-4 md:px-6 lg:px-0">
                <p className="text-[#000F19] font-manrope-semibold text-base md:text-lg lg:text-xl leading-6 md:leading-7 max-w-full md:max-w-[90%] lg:max-w-[1088px] text-center mb-4 md:mb-6 lg:mb-[25px]">
                  {benefitsConclusion}
                </p>
                {benefitsButtonText && (
                  <div className="flex justify-center">
                    <AnimatedButton
                      text={benefitsButtonText}
                      link={benefitsButtonLink}
                      bgColor="#488BF3"
                      hoverBgColor="#3a7be0"
                      width="w-35"
                      className="px-6 md:px-8"
                    />
                  </div>
                )}
              </div>
            )}
          </div>
        </section>
      )}

      {/* Core Features Section */}
      {coreFeaturesTitle && coreFeatures.length > 0 && (
        <section className="py-8 md:py-12 lg:py-24 bg-white">
          <div className="containersection px-4 md:px-6 lg:px-28 mx-auto lg:w-[85%]!">
            <div className="flex flex-col lg:flex-row gap-8 md:gap-12 lg:gap-16 items-start">
              {coreFeaturesImage?.url && (
                <div className="relative w-full lg:w-[559px] h-[300px] md:h-[400px] lg:h-[548px] flex-shrink-0 order-1 lg:order-1">
                  <Image
                    src={coreFeaturesImage.url}
                    alt={coreFeaturesTitle || 'Core Features'}
                    width={559}
                    height={548}
                    className="rounded-[10px] object-cover w-full h-full"
                    unoptimized={true}
                    priority={false}
                  />
                </div>
              )}
              <div className="order-2 lg:order-2 flex-1 w-full">
                <h2 className="text-[#000F19] font-manrope-semibold text-2xl md:text-3xl lg:text-4xl leading-tight md:leading-[40px] lg:leading-[50px] mb-2 md:mb-3 lg:mb-1">
                  {coreFeaturesTitle}
                </h2>
                <p className="text-[#000F19] text-base md:text-lg lg:text-xl font-manrope-medium leading-6 md:leading-7 mb-4 md:mb-5">
                  {coreFeaturesDescription}
                </p>
                <ul className="space-y-2 md:space-y-[10px] list-none">
                  {coreFeatures.map((feature: any, index: number) => (
                    <li key={index} className="flex items-start">
                      <span className="text-[#000F19] font-manrope-bold text-lg md:text-xl mr-2 -mt-0.5 flex-shrink-0">•</span>
                      <div className="flex-1 min-w-0">
                        <span className="text-[#000F19] font-manrope-bold text-sm md:text-base leading-relaxed">
                          {feature.title}:
                        </span>
                        <span className="text-[#000F19] font-manrope-medium text-sm md:text-base leading-relaxed ml-1">
                          {feature.description}
                        </span>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* IGA Services Section */}
      {igaServicesTitle && igaServices.length > 0 && (
        <section className="pt-8 md:pt-12 lg:pt-24 pb-8 md:pb-12 lg:pb-24 bg-white">
          <div className="containersection px-0 md:px-0 lg:px-10 mx-auto">
            <div className="text-center mb-6 md:mb-8 lg:mb-12">
              <h2 className="text-[#000F19] font-manrope-semibold text-2xl md:text-3xl lg:text-5xl leading-tight md:leading-[45px] lg:leading-[60px] mb-3 md:mb-4">
                {igaServicesTitle}
              </h2>
              <p className="text-[#000F19] text-base md:text-lg lg:text-xl font-manrope-normal leading-6 md:leading-7 lg:leading-8 max-w-full md:max-w-3xl lg:max-w-4xl mx-auto px-4 md:px-0">
                {igaServicesDescription}
              </p>
            </div>
            <div className="mt-6 md:mt-8 lg:mt-[55px]">
              <IGAServicesSection igaServices={igaServices} />
            </div>
          </div>
        </section>
      )}

      {/* Success Stories Section */}
      {successStoriesTitle && (
        <SuccessStoriesParallax
          successStoriesTitle={successStoriesTitle}
          successStoriesDescription={successStoriesDescription}
          successStoriesCtaText={successStoriesCtaText}
          successStoriesCtaLink={successStoriesCtaLink}
          successStoriesBackgroundImage={successStoriesBackgroundImage}
        />
      )}
      <TestimonialsSection />
      <ContactSection />
    </div>
  )
}

export default SubServiceDetailPage
