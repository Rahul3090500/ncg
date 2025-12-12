import React from 'react'
import CaseStudiesFilter from '../components/CaseStudiesFilter'
import ContactSection from '../components/ContactSection'
import { getCaseStudiesPageData } from '@/lib/payload'

// Dynamic revalidate: instant updates in development, 1 hour in production
// Revalidate: 0 = always revalidate for instant updates
export const revalidate = 0

const CaseStudies = async () => {
  const { caseStudiesPageHeroSection, caseStudiesPageGridSection } = await getCaseStudiesPageData()

  const bgImage = caseStudiesPageHeroSection?.backgroundImage?.url || '/home-images/case-studies-bg.png'

  return (
    <div className="min-h-screen bg-white">
      <section className="relative h-[400px] md:h-[500px] lg:h-[770px] flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url('${bgImage}')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
          }}
        >
          <div className="absolute inset-0 bg-black/50"></div>
        </div>
        
        <div className="relative z-10 w-full h-full flex items-end justify-start containersection px-4 md:px-6 lg:px-8 pb-8 md:pb-12 lg:pb-20">
          <div className="text-left text-white">
            <div className="mb-2 md:mb-3 lg:mb-4">
              <span className="font-manrope-bold text-xs md:text-sm lg:text-[19px] uppercase tracking-[0.15em] md:tracking-[0.18em] lg:tracking-[0.2em]">{caseStudiesPageHeroSection?.overline || 'case studies'}</span>
            </div>
            <h1 className="text-white font-manrope-semibold text-3xl md:text-4xl lg:text-[70px] leading-tight md:leading-[1.1em] lg:leading-[1em] max-w-full lg:max-w-[1000px]">
              {(() => {
                const raw = caseStudiesPageHeroSection?.heading || 'Real Results.\nProven Security.'
                const lines = String(raw).split('\n')
                return (
                  <>
                    <span className="text-[#5799FF]">{lines[0] || ''} </span>
                    {lines.slice(1).join(' ')}
                  </>
                )
              })()}
            </h1>
          </div>
        </div>
      </section>
      <div className="containersection px-4 md:px-6 lg:px-2">
      <p className="text-black font-manrope-medium text-base md:text-lg lg:text-[21px] leading-6 md:leading-7 lg:leading-[1.29em] max-w-full lg:max-w-[1431px] px-4 md:px-6 lg:px-[25px] py-4 md:py-5 lg:py-[20px]">
        {caseStudiesPageHeroSection?.introText || "At NCG, we pride ourselves on delivering tailored, high-impact cybersecurity solutions. These case studies showcase how we've addressed complex challenges and delivered measurable value to industry leaders."}
      </p>
      <CaseStudiesFilter
        items={(Array.isArray(caseStudiesPageGridSection?.selectedCaseStudies) ? caseStudiesPageGridSection.selectedCaseStudies : []).map((cs: any) => ({
          id: cs?.id,
          image: cs?.image?.url ? { url: cs.image.url } : undefined,
          category: cs?.category,
          iconType: cs?.iconType,
          iconAssetUrl: cs?.icon?.svg?.url,
          title: cs?.title,
          description: cs?.description,
          link: cs?.link,
          slug: cs?.slug,
        }))}
      /></div>
      {(() => {
        return <ContactSection />
      })()}
      
    </div>
  )
};

export default CaseStudies
