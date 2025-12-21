import React from 'react'
import dynamicImport from 'next/dynamic'
import { getAboutPageData } from '@/lib/payload'
import AnimatedButton from '../components/AnimatedButton'
import AnimatedCounter from '../components/AnimatedCounter'
import TeamCardsSection from '../components/TeamCardsSection'
import ValuesSectionWrapper from '../components/ValuesSectionWrapper'

const VideoHero = dynamicImport(() => import('../components/VideoHero'), {
  ssr: true,
})

// Revalidate: 0 = always revalidate for instant updates
export const revalidate = 0

/**
 * Helper function to parse and render highlighted text
 * 
 * Usage in Payload CMS:
 * Add words/phrases to the "Highlight Words/Phrases" field (comma-separated)
 * Those words will be automatically highlighted in blue (text-blue-400)
 * 
 * @param text - The full text to display
 * @param highlightWords - Comma-separated words/phrases to highlight
 * 
 * Example:
 * text: "We build trust and innovation"
 * highlightWords: "trust, innovation"
 * Result: "We build [trust] and [innovation]" (in blue)
 */
const parseHighlightedText = (text: string, highlightWords?: string) => {
  if (!highlightWords || !highlightWords.trim()) {
    return text
  }

  // Parse highlight words from comma-separated string
  const wordsToHighlight = highlightWords
    .split(',')
    .map(word => word.trim())
    .filter(word => word.length > 0)

  if (wordsToHighlight.length === 0) {
    return text
  }

  // Create a regex pattern to match any of the highlight words (case-insensitive)
  // Escape special regex characters and sort by length (longest first) to match longer phrases first
  const escapedWords = wordsToHighlight
    .sort((a, b) => b.length - a.length)
    .map(word => word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))

  const pattern = new RegExp(`(${escapedWords.join('|')})`, 'gi')

  // Split text by the pattern while keeping the matches
  const parts = text.split(pattern)

  return parts.map((part, index) => {
    // Check if this part matches any highlight word (case-insensitive)
    const isHighlighted = wordsToHighlight.some(
      word => word.toLowerCase() === part.toLowerCase()
    )

    if (isHighlighted) {
      return (
        <span key={index} className="text-blue-400">
          {part}
        </span>
      )
    }
    return <span key={index}>{part}</span>
  })
}

const About = async () => {
  const data = await getAboutPageData()
  const hero = data?.aboutHeroSection || null
  const localVideoUrl = '/videos/about-video.mp4'
  const cmsVideoUrl = hero?.backgroundVideo?.url || null
  const cmsVideoUrlMobile = hero?.backgroundVideoMobile?.url || null
  const thumbnailUrl = '/videos/thumbnail-about.png'
  const heroOverlay = typeof hero?.overlayOpacity === 'number' ? hero.overlayOpacity : undefined
  const heroQuote = hero?.quote
  const heroHighlightWords = hero?.highlightWords
  const heroAttribution = hero?.attribution

  const aboutUs = data?.aboutUsSection || null
  const aboutUsImage = aboutUs?.image?.url
  const aboutUsLabel = aboutUs?.sectionLabel
  const aboutUsHeading = aboutUs?.heading
  const aboutUsParas = Array.isArray(aboutUs?.paragraphs) ? aboutUs.paragraphs : []

  const stats = Array.isArray(data?.aboutStatsSection?.stats) ? data.aboutStatsSection.stats.slice(0, 4) : []

  const mission = data?.aboutMissionSection || null
  const missionTitle = mission?.title
  const missionDesc = mission?.description

  const valuesRaw = Array.isArray(data?.aboutCoreValuesSection?.values) ? data.aboutCoreValuesSection.values : []
  const values = valuesRaw
    .filter((v: any) => {
      const mt = v?.icon?.mimeType || ''
      const url = v?.icon?.url || ''
      return mt === 'image/svg+xml' || url.endsWith('.svg')
    })
    .slice(0, 4)
  const valuesTitle = data?.aboutCoreValuesSection?.title
  const valuesSubtitle = data?.aboutCoreValuesSection?.subtitle

  const team = Array.isArray(data?.aboutTeamSection?.members) ? data.aboutTeamSection.members : []
  const teamTitle = data?.aboutTeamSection?.title
  const teamDesc = data?.aboutTeamSection?.description

  const cta = data?.aboutCTASection || null
  const ctaBg = cta?.backgroundImage?.url
  const ctaBgMobile = cta?.backgroundImageMobile?.url
  const ctaOverlay = typeof cta?.overlayOpacity === 'number' ? cta.overlayOpacity : undefined
  const ctaTitle = cta?.title
  const ctaDesc = cta?.description
  const ctaText = cta?.buttonText
  const ctaLink = cta?.buttonLink

  return (
    <div className="min-h-screen bg-white ">
      {hero && (
        <VideoHero
          localVideoUrl={localVideoUrl}
          cmsVideoUrl={cmsVideoUrl}
          cmsVideoUrlMobile={cmsVideoUrlMobile}
          thumbnailUrl={thumbnailUrl}
          overlayOpacity={heroOverlay}
        >
          <div className="max-w-6xl text-left mt-32 md:mt-48 lg:mt-[400px] px-4 md:px-6 lg:px-0">
            {heroQuote && (
              <h1 className="text-white text-2xl md:text-4xl lg:text-[50px] leading-tight md:leading-[50px] lg:leading-[60px] font-manrope-medium">
                {parseHighlightedText(heroQuote, heroHighlightWords)}
              </h1>
            )}
            {heroAttribution && (
              <p className="text-white leading-4 md:leading-5 tracking-[2px] md:tracking-[3px] lg:tracking-[3.80px] uppercase text-sm md:text-base lg:text-[19px] mt-4 md:mt-6 lg:mt-9 font-manrope-bold">{heroAttribution}</p>
            )}
          </div>
        </VideoHero>
      )}

      {aboutUs && (
        <section className="py-12 md:py-16 lg:py-20 bg-white">
          <div className="containersection px-4 md:px-6 lg:px-20">
            <div className="grid grid-cols-1 lg:grid-cols-2 items-center gap-8 md:gap-10 lg:gap-12">
              <div className="relative order-1">
                {aboutUsImage && (
                  <img src={aboutUsImage} alt="NCG Team" className="w-full max-w-full md:max-w-full lg:w-fullh-auto md:h-[400px] lg:h-[548px] object-cover mx-auto lg:mx-0" />
                )}
              </div>
              <div className="space-y-2 md:space-y-3 lg:space-y-3 order-2">
                <div>
                  {aboutUsLabel && (
                    <h3 className="text-[#000F19] text-xs md:text-sm uppercase font-manrope-bold leading-3 tracking-[2px] md:tracking-[3px] lg:tracking-[3.80px] mb-3 md:mb-4">{aboutUsLabel}</h3>
                  )}
                  {aboutUsHeading && (
                    <h2 className="text-[#000F19] text-2xl md:text-3xl lg:text-4xl leading-tight md:leading-[40px] lg:leading-[50px] mb-4 md:mb-5 lg:mb-0 font-manrope-semibold">{aboutUsHeading}</h2>
                  )}
                </div>
                <div className="space-y-0 md:space-y-0 lg:space-y-0">
                  {aboutUsParas.map((p: any, i: number) => (
                    <p key={i} className="text-slate-950/60 text-sm md:text-base font-manrope-light leading-6 md:leading-7">{p?.text || ''}</p>
                  ))}
                </div>
                <AnimatedButton
                  link="/contact"
                  text="Contact Us"
                  bgColor="#000F19"
                  hoverBgColor="#488BF3"
                  textColor="#fff"
                  hoverTextColor="#fff"
                  className="w-[150px]! rounded-[10px]! mt-[40px]"
                />
              </div>
            </div>
          </div>
        </section>
      )}

      {stats.length > 0 && (
        <section className="py-16 bg-white">
          <div className="containersection px-[15px] md:px-[15px] lg:px-9">
            <div className="grid grid-cols-2 lg:flex lg:flex-row gap-y-[39px] gap-x-[23px] md:gap-x-[84px] md:gap-y-[68px] justify-center relative">
              {stats.slice(0, 4).map((s: any, i: number) => (
                <React.Fragment key={`stat-${i}`}>
                  <div className="flex-1 w-full text-left">
                    <AnimatedCounter
                      value={s?.value || '0'}
                      duration={2000}
                      className="text-[#488BF3] font-manrope-semibold text-5xl md:text-7xl lg:text-[90px] leading-tight md:leading-[50px] lg:leading-[90px] mb-2 md:mb-3 lg:mb-[14px]"
                    />
                    <p className="text-[#000F19] font-manrope-normal text-base md:text-xl lg:text-[21px] leading-5 md:leading-6 lg:leading-[27px]">
                      {s?.label || ''}
                    </p>                  </div>
                  {i < 3 && <div className="hidden lg:block w-[1px] h-[185px] bg-black/30 self-center"></div>}
                </React.Fragment>
              ))}
              <div className="lg:hidden absolute left-1/2 top-0 h-[calc(50%-19.5px)] w-[1px] bg-black/30 transform -translate-x-1/2"></div>
              <div className="lg:hidden absolute left-1/2 bottom-0 h-[calc(50%-19.5px)] w-[1px] bg-black/30 transform -translate-x-1/2"></div>
            </div>
          </div>
        </section>
      )}

      {mission && (missionTitle || missionDesc) && (
        <section className="py-12 md:py-16 lg:py-20 bg-[#000F19] text-white">
          <div className="containersection px-4 md:px-6 lg:px-16">
            <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-6 md:gap-8">
              <div>
                {missionTitle && (
                  <h2 className="text-white font-manrope-semibold text-2xl md:text-3xl lg:text-5xl leading-tight md:leading-[40px] lg:leading-[50px] text-left">{missionTitle}</h2>
                )}
              </div>
              <div>
                {missionDesc && (
                  <p className="text-white w-full lg:w-[928px] font-manrope-normal text-base md:text-xl lg:text-3xl leading-6 md:leading-8 lg:leading-10">{missionDesc}</p>
                )}
              </div>
            </div>
          </div>
        </section>
      )}

      {values.length > 0 && (
        <section className="py-12 md:py-16 lg:py-20 bg-[#F4F7FF]">
          <div className="containersection px-4 md:px-6">
            <div className="text-center mb-8 md:mb-12 lg:mb-16">
              {valuesTitle && (
                <h2 className="text-[#000F19] text-3xl md:text-4xl lg:text-5xl font-manrope-semibold leading-tight md:leading-[40px] lg:leading-[50px] mb-0 md:mb-4">{valuesTitle}</h2>
              )}
              {valuesSubtitle && (
                <p className="text-[#000F19] text-base md:text-lg lg:text-xl leading-6 md:leading-7 font-manrope-medium">{valuesSubtitle}</p>
              )}
            </div>
            <ValuesSectionWrapper values={values.slice(0, 4)} />
          </div>
        </section>
      )}

      {team.length > 0 && (
        <section className="py-12 md:py-16 lg:py-20 bg-white">
          <div className="containersection px-4 md:px-6 lg:px-16">
            <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start mb-8 md:mb-12 lg:mb-10 gap-4 md:gap-6">
              <div>
                {teamTitle && (
                  <h2 className="text-[#000F19] font-manrope-semibold text-2xl md:text-3xl lg:text-5xl leading-tight">{teamTitle}</h2>
                )}
              </div>
              <div>
                {teamDesc && (
                  <p className="text-[#000F19] w-full lg:w-[928px] font-manrope-normal text-base md:text-lg lg:text-xl leading-6 md:leading-7 lg:leading-8">{teamDesc}</p>
                )}
              </div>
            </div>
            <div className="border-t border-black pt-4 md:pt-6 lg:pt-0">
              <TeamCardsSection team={team.slice(0, 4)} />
            </div>
          </div>
        </section>
      )}

      {(ctaBg || ctaBgMobile || ctaTitle || ctaDesc) && (
        <section className="relative py-12 md:py-16 lg:py-20 text-white overflow-hidden">
          {/* Desktop Background Image */}
          {ctaBg && (
            <div className="hidden lg:block absolute inset-0 bg-cover bg-center bg-no-repeat" style={{ backgroundImage: `url('${ctaBg}')` }}></div>
          )}
          {/* Mobile/Tablet Background Image */}
          {ctaBgMobile ? (
            <div className="block lg:hidden absolute inset-0 bg-cover bg-center bg-no-repeat" style={{ backgroundImage: `url('${ctaBgMobile}')` }}></div>
          ) : ctaBg ? (
            <div className="block lg:hidden absolute inset-0 bg-cover bg-center bg-no-repeat" style={{ backgroundImage: `url('${ctaBg}')` }}></div>
          ) : null}
          {typeof ctaOverlay === 'number' && (
            <div className="absolute inset-0" style={{ backgroundColor: `rgba(0,0,0,${ctaOverlay})` }}></div>
          )}
          <div className="relative z-10 containersection px-4 md:px-6 lg:px-20">
            {ctaTitle && (
              <h2 className="text-white font-manrope-semibold text-3xl md:text-4xl lg:text-6xl leading-tight md:leading-[50px] lg:leading-[70px] mb-4 md:mb-5 lg:mb-6 w-full lg:w-[95%]">{ctaTitle}</h2>
            )}
            {ctaDesc && (
              <p className="text-white font-manrope-normal text-base md:text-lg lg:text-xl leading-6 md:leading-7 lg:leading-8 mb-6 md:mb-8 lg:mb-10 max-w-full lg:max-w-[90%]">{ctaDesc}</p>
            )}
            {ctaLink && ctaText && (
              <div className="flex">
                <AnimatedButton
                  link="/contact"
                  text="Contact Us"
                  bgColor="#488BF3"
                  hoverBgColor="#000F19"
                  textColor="#fff"
                  hoverTextColor="#fff"
                  className="w-[150px]! rounded-[10px]!"
                />
              </div>
            )}
          </div>
        </section>
      )}
    </div>
  )
}

export default About
