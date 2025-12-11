import React from 'react'
import { notFound } from 'next/navigation'
import dynamic from 'next/dynamic'
import { getServiceBySlug, getSubServicesForService, getHomepageData } from '@/lib/payload'
import AnimatedButton from '../../components/AnimatedButton'

// Dynamically import heavy components for better code splitting
const CaseStudiesGridSection = dynamic(() => import('../../components/CaseStudiesGridSection'), {
  loading: () => <div className="h-[500px] w-full" />,
})

const SubServicesCarousel = dynamic(() => import('../../components/SubServicesCarousel'), {
  loading: () => <div className="h-[400px] w-full" />,
})

const ContactSection = dynamic(() => import('../../components/ContactSection'), {
  loading: () => <div className="h-[500px] w-full" />,
})

const RelatedInsights = dynamic(() => import('../../components/RelatedInsights'), {
  loading: () => <div className="h-[400px] w-full" />,
})

const CaseStudiesParallaxHero = dynamic(() => import('../../components/CaseStudiesParallaxHero'), {
  loading: () => (
    <section style={{ backgroundColor: "#000F19" }} className="h-[539px] text-white relative overflow-hidden bg-[#000F19]">
      <div className="absolute scale-[1.4] inset-0 bg-cover bg-center" style={{ backgroundImage: "url('/assets/8669139b5ad96631528dce4a3734eddb4b03dc40.jpg')" }} />
      <div className="absolute inset-0 bg-black/30" />
    </section>
  )
})

type PageProps = {
  params: Promise<{ serviceSlug: string }>
}

const ServiceDetailPage = async ({ params }: PageProps) => {
  const { serviceSlug } = await params
  const service = await getServiceBySlug(serviceSlug)
  const subServices = await getSubServicesForService(serviceSlug)

  if (!service) {
    notFound()
  }

  // Fetch case studies grid data for fallback
  const homepageData = await getHomepageData()
  const caseStudiesGridSection = (homepageData as any)?.caseStudiesGridSection
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

  // Use service data or fallback to hardcoded values
  const heroTagline = service.heroTagline || 'YOUR TRUSTED IDENTITY SECURITY PARTNER'
  const heroTitle = service.heroTitle || service.title
  const heroSubtitle = service.heroSubtitle || service.description
  const heroImage = service.heroImage
  const subServiceTitle = service.subServiceTitle || 'Our Sub Services'
  const subServiceDescription = service.subServiceDescription || service.description
  const ctaTitle = service.ctaTitle || 'Ready to Strengthen Your Identity Security?'
  const ctaDescription = service.ctaDescription || 'Connect directly with one of our experts. We\'ll listen to your challenges, discuss your goals, and share tailored recommendations to help you build a stronger, more secure setup.'
  const advantagesTitle = service.advantagesTitle || `Identity Security Isn't Just An IT Concern – It's A Business Imperative`
  const advantagesDescription = service.advantagesDescription || 'Strong identity security protects more than systems – it protects your people, business continuity, compliance posture, and brand reputation. As attacks grow more sophisticated and regulations tighten, securing digital identities is now a boardroom priority, not just an IT task.'
  const advantages = service.advantages || []
  const caseStudiesLabel = service.caseStudiesLabel || 'case studies'
  const caseStudiesHeroTitle = service.caseStudiesHeroTitle || `${service.title} In Action`
  const caseStudiesHeroImage = service.caseStudiesHeroImage?.url || null
  const caseStudiesIntro = service.caseStudiesIntro || 'Discover how NCG has helped organizations protect digital identities, streamline access management, and build trust across their digital landscape. Our case studies highlight real-world challenges, tailored solutions, and measurable results—showing you what\'s possible when identity is secured the right way.'
  // Filter out any null or invalid case studies (broken relationships)
  const caseStudies = Array.isArray(service.caseStudies)
    ? service.caseStudies.filter((cs: any) => cs && cs.id && typeof cs === 'object')
    : []
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative min-h-[863px] overflow-hidden">
        {heroImage?.url ? (
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url('${heroImage.url}')` }}
          />
        ) : (
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: "url('/assets/2c635137081a2267e6ebfee54bd7a7d6302cff75.png')" }}
          />
        )}
        <div className="absolute inset-0 bg-blend-multiply bg-gradient-to-l from-slate-900/0 to-slate-900"></div>

        <div className="relative containersection min-h-[863px] px-4 md:px-6 lg:px-24 flex items-center py-8 md:py-12 lg:py-0">
          <div className="w-full max-w-full md:max-w-[600px] lg:max-w-[855px] lg:absolute lg:top-[120px] lg:left-[107px]">
            <p className="text-white font-manrope-bold text-sm md:text-base lg:text-[17px] tracking-widest uppercase leading-5 md:leading-6 lg:leading-[30px] mb-2 md:mb-[10px] mt-0 md:mt-[30px] lg:mt-[70px]">
              {heroTagline}
            </p>
            <h1 className="text-white font-manrope-semibold text-3xl md:text-4xl lg:text-[70px] leading-tight md:leading-[45px] lg:leading-[75px] mb-4 md:mb-6 lg:mb-[37px]">
              {heroTitle}
            </h1>
            <p className="text-white font-manrope-medium text-base md:text-lg lg:text-[21px] leading-6 md:leading-7 lg:leading-[30px]">
              {heroSubtitle}
            </p>
          </div>
        </div>
      </section>

      {/* Sub-Services Section */}
      <section className="pt-8 md:pt-12 lg:pt-[50px] bg-[#FFFFFF]">
        <div className="mx-auto">
          <div className="text-center mb-6 md:mb-8 lg:mb-[40px] containersection px-4 md:px-6 lg:px-72">
            <h2 className="text-[#000F19] font-manrope-semibold text-2xl md:text-3xl lg:text-5xl leading-tight md:leading-[40px] lg:leading-[50px] mb-3 md:mb-4 lg:mb-[13px]">
              {subServiceTitle}
            </h2>
            <p className="text-[#000F19] mb-[20px] font-manrope-normal text-base md:text-lg lg:text-xl leading-6 md:leading-7 lg:leading-8">
              {subServiceDescription}
            </p>
          </div>

          {/* Sub-Services Cards */}
          {subServices && subServices.length > 0 && (
            <SubServicesCarousel subServices={subServices} serviceSlug={serviceSlug} />
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="min-h-[391px] bg-[#488BF3] flex items-center py-8 md:py-12 lg:py-0">
        <div className="containersection px-4 md:px-6 lg:px-40 w-full">
          <h2 className="text-white font-manrope-semibold text-2xl md:text-3xl lg:text-5xl leading-tight md:leading-9 lg:leading-10 text-left mb-3 md:mb-4 lg:mb-[13px]">
            {ctaTitle}
          </h2>
          <p className="text-white font-manrope-normal text-base md:text-lg lg:text-2xl leading-6 md:leading-7 lg:leading-8 text-left mt-4 md:mt-5 lg:mt-6 mb-6 md:mb-8 lg:mb-[56px] max-w-full lg:max-w-[1108px]">
            {ctaDescription}
          </p>
          <AnimatedButton text="Contact Us" width='w-32 md:w-36' link='/contact' bgColor='#fff' textColor='#000F19' hoverBgColor='#fff' hoverTextColor='#000F19' />
        </div>
      </section>

      {/* Advantages Section */}
      {advantages.length > 0 && (
        <section className="pt-8 md:pt-12 lg:pt-[65px] pb-8 md:pb-10 lg:pb-[37px] relative">
          <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, #000F19 50%, #F4F7FF 50%)' }}></div>
          <div className="relative containersection px-4 md:px-6 lg:px-14">
            <div className="text-center px-0 md:px-8 lg:px-[234px]">
              <h2 className="text-[#000F19] font-manrope-semibold text-2xl md:text-3xl lg:text-4xl leading-tight md:leading-9 lg:leading-10 mb-3 md:mb-4 lg:mb-[12px]">
                {advantagesTitle}
              </h2>
              {advantagesDescription && (
                <p className="text-[#000F19] font-manrope-normal text-sm md:text-base lg:text-lg leading-5 md:leading-6 mt-3 md:mt-4">
                  {advantagesDescription}
                </p>
              )}
            </div>
            {/* Mobile/Tablet: Horizontal Scrollable */}
            <div className="lg:hidden mt-6 md:mt-8 lg:mt-[31px]">
              <div className="overflow-x-auto scrollbar-hide -mx-4 md:-mx-6 px-4 md:px-6">
                <div className="flex gap-3 md:gap-4">
                  {advantages.map((adv: any, index: number) => (
                    <div key={index} className="bg-white rounded-[10px] p-1 border-[1.30px] border-slate-950/20 flex-shrink-0 w-[280px] md:w-[320px]">
                      {adv.image?.url && (
                        <div
                          className="w-full h-40 md:h-48 lg:h-52 rounded-md bg-cover bg-center mb-2 md:mb-3"
                          style={{ backgroundImage: `url('${adv.image.url}')` }}
                        />
                      )}
                      <h3 className="text-[#000F19] font-manrope-semibold text-base md:text-lg lg:text-xl leading-5 mb-1 px-2 md:px-3 mt-2 md:mt-3 lg:mt-4">
                        {adv.title}
                      </h3>
                      <p className="text-[#000F19] font-manrope-normal text-sm md:text-base leading-5 md:leading-6 px-2 md:px-3 pb-4 md:pb-5 lg:pb-6">
                        {adv.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            {/* Desktop: Grid Layout */}
            <div className="hidden lg:grid grid-cols-4 gap-[10px] mt-[31px]">
              {advantages.map((adv: any, index: number) => (
                <div key={index} className="bg-white rounded-[10px] p-1 border-[1.30px] border-slate-950/20">
                  {adv.image?.url && (
                    <div
                      className="w-full h-52 rounded-md bg-cover bg-center mb-3"
                      style={{ backgroundImage: `url('${adv.image.url}')` }}
                    />
                  )}
                  <h3 className="text-[#000F19] font-manrope-semibold text-xl leading-5 mb-1 px-3 mt-4">
                    {adv.title}
                  </h3>
                  <p className="text-[#000F19] font-manrope-normal text-base leading-6 px-3 pb-6">
                    {adv.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Case Studies Section */}
      {caseStudies.length > 0 && (
        <div className="pb-16">
          <CaseStudiesParallaxHero
            caseStudiesLabel={caseStudiesLabel}
            caseStudiesHeroTitle={caseStudiesHeroTitle}
            caseStudiesHeroImage={caseStudiesHeroImage}
          />
          {caseStudiesIntro && (
            <section className="pt-8 md:pt-12 lg:pt-[51px] pb-6 md:pb-8 lg:pb-[35px] bg-white">
              <div className="containersection px-4 md:px-6 lg:px-52">
                <p className="text-[#000F19] font-manrope-medium text-base md:text-lg lg:text-xl leading-6 md:leading-7 lg:leading-[30px] text-left">
                  {caseStudiesIntro}
                </p>
              </div>
            </section>
          )}
          <CaseStudiesGridSection data={caseStudiesGridData} showButton={false} />
        </div>
      )}
      <RelatedInsights hoverColor='#000F19'/>
      {/* Contact Section */}
      <ContactSection />
    </div>
  )
}

export default ServiceDetailPage

