import React from 'react'
import { notFound } from 'next/navigation'
import dynamic from 'next/dynamic'
import { getCaseStudyBySlug, getHomepageData } from '@/lib/payload'

// Dynamically import heavy components for better code splitting
const ContactSection = dynamic(() => import('../../components/ContactSection'), {
  loading: () => <div className="h-[500px] w-full" />,
})

const TestimonialsSection = dynamic(() => import('../../components/TestimonialsSection'), {
  loading: () => <div className="h-[600px] w-full" />,
})

const CaseStudiesGridSection = dynamic(() => import('../../components/CaseStudiesGridSection'), {
  loading: () => <div className="h-[500px] w-full" />,
})

const ValueDeliveredSection = dynamic(() => import('../../components/ValueDeliveredSection'), {
  loading: () => <div className="h-[400px] w-full" />,
})

type PageProps = {
  params: Promise<{ slug: string }>
}

const CaseStudyDetailPage = async ({ params }: PageProps) => {
  const { slug } = await params
  const caseStudy = await getCaseStudyBySlug(slug)

  if (!caseStudy) {
    notFound()
  }

  // Fetch homepage data to get case studies grid section
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
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-end justify-center overflow-hidden">
        {/* Background Image */}
        {caseStudy.heroBackgroundImage?.url && (
          <div className="absolute inset-0">
            <img
              src={caseStudy.heroBackgroundImage.url}
              alt={caseStudy.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-blend-multiply bg-gradient-to-b from-black/0 to-black/80"></div>
          </div>
        )}

        {/* Hero Logo */}


        {/* Content */}
        <div className="relative z-10 containersection mb-0 mx-auto px-4 md:px-6 lg:px-12 w-full pb-8 md:pb-12 lg:pb-[68px]">
          {/* Category Tag */}
          {caseStudy.category && (

            <div className="w-32 h-10 py-[5px] bg-white rounded-[3px] shadow-[0px_4px_30px_0px_rgba(0,0,0,0.15)] outline outline-1 outline-slate-950/20 inline-flex justify-center items-center gap-[5px]">
              <img
                src={caseStudy.heroLogo.url}
                alt="Client Logo"
                className="max-h-20 max-w-[200px] object-contain"
              />
              <div className="text-right justify-start text-stone-950 text-base font-manrope-medium">{caseStudy.category}</div>
            </div>
          )}
          {/* Title */}
          <h1 className="text-white font-manrope-bold text-2xl md:text-3xl lg:text-5xl leading-tight md:leading-[40px] lg:leading-[50px] capitalize mb-4 md:mb-5 lg:mb-[20px] mt-4 md:mt-5 lg:mt-[24px]">
            {caseStudy.title}
          </h1>

          {/* Intro Description */}
          {caseStudy.introDescription && (
            <p className="text-white text-base md:text-xl lg:text-2xl leading-6 md:leading-7 mb-6 md:mb-8 lg:mb-[30px] font-manrope-medium">
              {caseStudy.introDescription}
            </p>
          )}

          {/* Solution Tags */}
          {caseStudy.solutionTags && Array.isArray(caseStudy.solutionTags) && caseStudy.solutionTags.length > 0 && (
            <div className="flex flex-wrap gap-2 md:gap-[8px] lg:gap-[10px]">
              {caseStudy.solutionTags.map((tag: any, index: number) => (
                <span
                  key={index}
                  className="bg-[#F4F7FF] text-[#000F19] px-3 md:px-4 lg:px-[20px] py-2 md:py-[8px] lg:py-[10px] rounded-[8px] md:rounded-[9px] lg:rounded-[10px] text-xs md:text-[13px] lg:text-sm font-manrope-semibold border border-white/20"
                >
                  {tag.tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Client Overview & Challenges Section */}
      {(caseStudy.clientOverview || caseStudy.challenges) && (
        <section className="pt-8 md:pt-10 lg:pt-[51px] bg-white pb-8 md:pb-10 lg:pb-[66px]">
          <div className="containersection px-4 md:px-6 lg:px-12">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10 lg:gap-12">
              {/* Client Overview */}
              {caseStudy.clientOverview && (
                <div>
                  <h2 className="text-[#000F19] font-manrope-bold text-xl md:text-2xl mb-6 md:mb-7 lg:mb-[27px]">Client Overview</h2>
                  <div className="space-y-6 md:space-y-8 lg:space-y-[40px] text-[#000F19]">
                    {caseStudy.clientOverview.clientName && (
                      <div className="flex items-start gap-2 md:gap-[10px] flex-col">
                        <span className="font-manrope-semibold text-sm md:text-base text-[#000F1999]">Client: </span>
                        <span className="font-manrope-semibold text-lg md:text-xl text-[#000F19] leading-5">{caseStudy.clientOverview.clientName}</span>
                      </div>
                    )}
                    {caseStudy.clientOverview.industry && (
                      <div className="flex items-start gap-2 md:gap-[10px] flex-col">
                        <span className="font-manrope-semibold text-sm md:text-base text-[#000F1999]">Industry: </span>
                        <span className="font-manrope-semibold text-lg md:text-xl text-[#000F19] leading-5">{caseStudy.clientOverview.industry}</span>
                      </div>
                    )}
                    {caseStudy.clientOverview.location && (
                      <div className="flex items-start gap-2 md:gap-[10px] flex-col">
                        <span className="font-manrope-semibold text-sm md:text-base text-[#000F1999]">Location: </span>
                        <span className="font-manrope-semibold text-lg md:text-xl text-[#000F19] leading-5">{caseStudy.clientOverview.location}</span>
                      </div>
                    )}
                    {caseStudy.clientOverview.size && (
                      <div className="flex items-start gap-2 md:gap-[10px] flex-col">
                        <span className="font-manrope-semibold text-sm md:text-base text-[#000F1999]">Size: </span>
                        <span className="font-manrope-semibold text-lg md:text-xl text-[#000F19] leading-5">{caseStudy.clientOverview.size}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Challenges */}
              {caseStudy.challenges && (
                <div>
                  <h2 className="text-[#000F19] font-manrope-semibold text-2xl md:text-3xl lg:text-4xl mb-4 md:mb-5 lg:mb-[16px]">
                    {caseStudy.challenges.title || 'Challenges Faced By Client'}
                  </h2>
                  {caseStudy.challenges.description && (
                    <p className="text-[#000F19] text-base md:text-lg lg:text-xl leading-6 md:leading-7 lg:leading-8 mb-4">
                      {caseStudy.challenges.description}
                    </p>
                  )}
                  {caseStudy.challenges.challengeItems && Array.isArray(caseStudy.challenges.challengeItems) && (
                    <ul className="list-none space-y-2 md:space-y-3 text-[#000F19] font-manrope-semibold text-base md:text-lg leading-6 md:leading-7">
                      {caseStudy.challenges.challengeItems.map((item: any, index: number) => (
                        <li key={index} className="flex items-start gap-2 md:gap-3">
                          <span className="flex-shrink-0 w-1 h-1 rounded-full bg-[#000F19] mt-2 md:mt-3"></span>
                          <span>{item.challenge}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* How NCG Helped Section */}
      {caseStudy.howNCGHelped && caseStudy.howNCGHelped.solutions && Array.isArray(caseStudy.howNCGHelped.solutions) && caseStudy.howNCGHelped.solutions.length > 0 && (
        <section className="py-8 md:py-12 lg:py-[71px] bg-violet-50">
          <div className="containersection px-4 md:px-6 lg:px-14">
            <div className="text-center mb-6 md:mb-8 lg:mb-[32px]">
              <h2 className="text-[#000F19] font-manrope-bold text-2xl md:text-3xl lg:text-4xl mb-2 md:mb-3 lg:mb-[5px]">
                {caseStudy.howNCGHelped.title || 'How NCG Helped'}
              </h2>
              {caseStudy.howNCGHelped.subtitle && (
                <p className="text-[#000F19] text-base md:text-lg lg:text-xl leading-6 md:leading-7 lg:leading-8 text-center mx-auto max-w-full md:max-w-2xl lg:max-w-none">
                  {caseStudy.howNCGHelped.subtitle}
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5 lg:gap-[20px]">
              {caseStudy.howNCGHelped.solutions.map((solution: any, index: number) => (
                <div key={index} className="bg-white rounded-[10px] overflow-hidden pt-4 md:pt-5 lg:pt-[18px] px-4 md:px-5 lg:px-[16px] pb-8 md:pb-10 lg:pb-[52px]">
                  {solution.image?.url && (
                    <div className="relative h-48 md:h-56 lg:h-72 overflow-hidden">
                      <img
                        src={solution.image.url}
                        alt={solution.title}
                        className="w-full h-full object-cover rounded-[10px]"
                      />
                    </div>
                  )}
                  <div className="px-0 md:px-1 lg:px-2 pt-4 md:pt-5 lg:pt-[21px]">
                    <h3 className="text-[#000F19] font-manrope-semibold text-base md:text-lg leading-5 mb-3 md:mb-4 lg:mb-[13px]">
                      {solution.title}
                    </h3>
                    <p className="text-[#000F19] text-sm md:text-base leading-5 md:leading-6 font-manrope-normal">
                      {solution.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Solutions Implemented Section */}
      {caseStudy.solutionsImplemented && (
        <section className="pt-12 md:pt-16 lg:pt-[122px] pb-12 md:pb-16 lg:pb-[187px] bg-[#000F19]">
          <div className="containersection px-4 md:px-6 lg:px-16">
            <div className="flex flex-col lg:flex-row justify-center gap-8 md:gap-10 lg:gap-[79px] items-center">
              {/* Icon Image */}
              {caseStudy.solutionsImplemented.iconImage?.url && (
                <div className="relative w-full md:w-[400px] lg:w-[483px] h-auto md:h-[350px] lg:h-[463px] flex items-center justify-center order-2 lg:order-1">
                  <img
                    src={caseStudy.solutionsImplemented.iconImage.url}
                    alt="Solutions"
                    className="max-w-full max-h-full w-auto h-auto object-contain rounded-[10px] outline outline-1 outline-violet-50/20"
                  />
                </div>
              )}

              {/* Content */}
              <div className="w-full md:w-full lg:w-[640px] order-1 lg:order-2">
                <h2 className="text-[#ffffff] font-manrope-semibold text-2xl md:text-3xl lg:text-4xl leading-tight md:leading-[40px] lg:leading-[50px] mb-2 md:mb-3 lg:mb-1">
                  {caseStudy.solutionsImplemented.title || 'Solutions Implemented By NCG'}
                </h2>
                {caseStudy.solutionsImplemented.description && (
                  <p className="text-[#ffffff] text-base md:text-lg leading-6 md:leading-7 mb-6 md:mb-8 lg:mb-[25px]">
                    {caseStudy.solutionsImplemented.description}
                  </p>
                )}
                {caseStudy.solutionsImplemented.solutionItems && Array.isArray(caseStudy.solutionsImplemented.solutionItems) && (
                  <ul className="list-none space-y-2 md:space-y-3 text-[#ffffff] text-base md:text-lg">
                    {caseStudy.solutionsImplemented.solutionItems.map((item: any, index: number) => (
                      <li key={index} className="flex items-start gap-2 md:gap-3 lg:gap-3.5">
                        <span className="flex-shrink-0 w-1 h-1 rounded-full bg-[#ffffff] mt-2 md:mt-2.5"></span>
                        <span className="font-manrope-normal text-sm md:text-base text-[#ffffff] leading-5 md:leading-6">{item.solution}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Value Delivered Section */}
      {caseStudy.valueDelivered && caseStudy.valueDelivered.valueCards && Array.isArray(caseStudy.valueDelivered.valueCards) && caseStudy.valueDelivered.valueCards.length > 0 && (
        <ValueDeliveredSection
          valueCards={caseStudy.valueDelivered.valueCards}
          title={caseStudy.valueDelivered.title || 'Value Delivered'}
        />
      )}

      <TestimonialsSection />
      <CaseStudiesGridSection showTitle={true} showButton={true} data={caseStudiesGridData} />

      <ContactSection />
    </div>
  )
}

export default CaseStudyDetailPage

