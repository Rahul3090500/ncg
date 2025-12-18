import React from 'react'
import dynamicImport from 'next/dynamic'
import { getCareerPageData } from '@/lib/payload-career'
import AnimatedCounter from '../components/AnimatedCounter'
import AnimatedButton from '../components/AnimatedButton'
import LottieAnimation from '../components/LottieAnimation'

// Dynamically import heavy components for better code splitting
const JobOpeningsSection = dynamicImport(() => import('../components/JobOpeningsSection'), {
  loading: () => <div className="h-[500px] w-full" />,
})

const TestimonialsCarouselCareer = dynamicImport(() => import('../components/TestimonialsCarouselCareer'), {
  loading: () => <div className="h-[600px] w-full" />,
})

const WorkHereCardsSection = dynamicImport(() => import('../components/WorkHereCardsSection'), {
  loading: () => <div className="h-[400px] w-full" />,
})

export const dynamic = 'force-dynamic'
export const revalidate = 0

// Helper function to parse and format text with bold and light styling
// Use **text** for bold and *text* for light
const parseFormattedText = (text: string) => {
  if (!text) return null;

  const parts = [];
  let currentIndex = 0;
  let key = 0;

  const regex = /(\*\*.*?\*\*)/g;
  let match;

  while ((match = regex.exec(text)) !== null) {
    // Add text before the match
    if (match.index > currentIndex) {
      parts.push(
        <span key={key++} className="font-manrope-normal">
          {text.substring(currentIndex, match.index)}
        </span>
      );
    }

    const matchedText = match[0];

    // Check if it's bold (**text**)
    if (matchedText.startsWith('**') && matchedText.endsWith('**')) {
      parts.push(
        <span key={key++} className="font-manrope-semibold">
          {matchedText.slice(2, -2)}
        </span>
      );
    }

    currentIndex = match.index + matchedText.length;
  }

  // Add remaining text after last match
  if (currentIndex < text.length) {
    parts.push(
      <span key={key++} className="font-manrope-light">
        {text.substring(currentIndex)}
      </span>
    );
  }

  return parts.length > 0 ? parts : text;
};

const Career = async () => {
  const data: any = await getCareerPageData()

  // Extract all sections
  const hero: any = data?.careerHeroSection || null
  const stats: any = data?.careerStatsSection || null
  const findPlace: any = data?.careerFindPlaceSection || null
  const workHere: any = data?.careerWorkHereSection || null
  const testimonials: any = data?.careerTestimonialsSection || null
  // const lifeAtNCG: any = data?.careerLifeAtNCGSection || null
  const spotify: any = data?.careerSpotifySection || null
  const jobOpeningsSection: any = data?.careerJobSection || null

  return (
    <div className="bg-white">
      {/* Hero Section - Why Work with Us */}
      {hero && (
        <section className="relative h-screen overflow-hidden">
          {/* Background Image */}
          <div className="absolute inset-0">
            {/* Desktop Image */}
            {hero.backgroundImage?.url && (
              <img
                src={hero.backgroundImage.url}
                alt="Hero Background"
                className="hidden lg:block w-full h-full object-cover"
              />
            )}
            {/* Mobile/Tablet Image */}
            {hero.backgroundImageMobile?.url ? (
              <img
                src={hero.backgroundImageMobile.url}
                alt="Hero Background"
                className="block lg:hidden w-full h-full object-cover"
              />
            ) : hero.backgroundImage?.url ? (
              <img
                src={hero.backgroundImage.url}
                alt="Hero Background"
                className="block lg:hidden w-full h-full object-cover"
              />
            ) : null}
          </div>

          {/* Gradient Overlays */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black"></div>
          <div className="absolute inset-0 bg-black/20"></div>

          {/* Content */}
          <div className="relative z-10 containersection px-4 md:px-6 lg:px-20 h-full flex flex-col justify-center items-start text-left">
            <div>
              {hero.title && (
                <h1 className="text-white font-manrope-semibold text-3xl md:text-4xl lg:text-[70px] leading-tight md:leading-[45px] lg:leading-[70px] mb-3 md:mb-4 lg:mb-[18px] capitalize">
                  {hero.title}
                </h1>
              )}
              {hero.subtitle && (
                <p className="text-white font-manrope-semibold text-lg md:text-xl lg:text-2xl leading-6 md:leading-[24px] lg:leading-[26px] mb-3 md:mb-4 lg:mb-[20px]">
                  {hero.subtitle}
                </p>
              )}
              {hero.description && (
                <p className="text-white font-manrope-medium text-sm md:text-base lg:text-[19px] leading-5 md:leading-6 lg:leading-[23px] max-w-full md:max-w-2xl lg:max-w-[1268px]">
                  {hero.description}
                </p>
              )}
            </div>

            {/* View Job Openings Button */}
            {hero.buttonText && hero.buttonLink && (
              <div className="mt-8 relative z-10">
                <AnimatedButton text={hero.buttonText} width='w-52' link={hero.buttonLink} />
              </div>
            )}
          </div>
        </section>
      )}
      {/* Things we are proud of Section */}
      {stats && stats.stats && Array.isArray(stats.stats) && stats.stats.length > 0 && (
        <section className="pt-[61px] pb-[61px] lg:pt-[100px] lg:pb-0">
          <div className="max-w-[1512px] mx-auto px-4 md:px-6 lg:px-12">
            {stats.title && (
              <h2 className="text-[#000F19] font-manrope-semibold text-2xl md:text-3xl lg:text-[50px] leading-tight md:leading-[40px] lg:leading-[50px] text-center mb-6 md:mb-8 lg:mb-[75px] capitalize">
                {stats.title}
              </h2>
            )}

            <div className="grid grid-cols-2 lg:flex lg:flex-row gap-y-[39px] gap-x-[23px] md:gap-x-[84px] md:gap-y-[68px] justify-center relative">
              {stats.stats.slice(0, 4).map((stat: any, index: number) => (
                <React.Fragment key={index}>
                  <div className="flex-1 w-full text-left">
                    <AnimatedCounter
                      value={stat?.value || '0'}
                      duration={2000}
                      className="text-[#488BF3] font-manrope-semibold text-5xl md:text-7xl lg:text-[90px] leading-tight md:leading-[50px] lg:leading-[90px] mb-2 md:mb-3 lg:mb-[14px]"
                    />
                    <p className="text-[#000F19] font-manrope-normal text-base md:text-xl lg:text-[21px] leading-5 md:leading-6 lg:leading-[27px]">
                      {stat?.label || ''}
                    </p>
                  </div>
                  {/* Vertical divider for desktop (between items in row) */}
                  {index < 3 && (
                    <div className="hidden lg:block w-[1px] h-[185px] bg-black/30 self-center"></div>
                  )}
                </React.Fragment>
              ))}
              {/* Vertical dividers for mobile/tablet (between columns in 2x2 grid - split into 2 parts) */}
              <div className="lg:hidden absolute left-1/2 top-0 h-[calc(50%-19.5px)] w-[1px] bg-black/30 transform -translate-x-1/2"></div>
              <div className="lg:hidden absolute left-1/2 bottom-0 h-[calc(50%-19.5px)] w-[1px] bg-black/30 transform -translate-x-1/2"></div>
            </div>
          </div>
        </section>
      )}

      {/* Find Your Place at NCG Section */}
      {findPlace && (
        <section className="py-8 md:py-12 lg:py-[70px]">
          <div className="containersection px-4 md:px-6 lg:px-12">
            <div className="flex flex-col lg:flex-row gap-6 md:gap-8 lg:gap-[40px]">
              {/* Left Side - Image */}
              {findPlace.image?.url && (
                <div className="w-full lg:w-[629px] h-[300px] md:h-[400px] lg:h-[590px] bg-blend-multiply rounded-[10px] bg-cover bg-center relative flex-shrink-0"
                  style={{ backgroundImage: `url('${findPlace.image.url}')` }}>
                  <div className="absolute inset-0 bg-black/30 rounded-[10px]"></div>
                </div>
              )}
              {/* Right Side - Content */}
              <div className="flex-1 mt-0 lg:mt-8">
                {findPlace.title && (
                  <h2 className="text-[#000F19] font-manrope-bold text-2xl md:text-3xl lg:text-[50px] leading-tight md:leading-[40px] lg:leading-[50px] mb-2 md:mb-3 lg:mb-[8px] capitalize">
                    {findPlace.title}
                  </h2>
                )}
                {findPlace.tagline && (
                  <p className="text-[#000F19] font-manrope-semibold text-lg md:text-xl lg:text-2xl leading-6 md:leading-7 lg:leading-[30px] mb-3 md:mb-4 lg:mb-[10px]">
                    {findPlace.tagline}
                  </p>
                )}

                <div className="text-[#000F19]/60 font-manrope-normal text-sm md:text-base leading-6 md:leading-7 lg:leading-[27px] w-full lg:w-[85%]">
                  {Array.isArray(findPlace.paragraphs) && findPlace.paragraphs.map((p: any, i: number) => (
                    <p key={i} className="mb-2 md:mb-3 last:mb-0">{p?.text || ''}</p>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* What It's Like to Work Here Section */}
      {workHere && workHere.cards && Array.isArray(workHere.cards) && workHere.cards.length > 0 && (
        <>
          <section className="pt-8 md:pt-12 lg:pt-[100px]">
            <div className="containersection px-4 md:px-6 lg:px-12">
              {workHere.title && (
                <h2 className="text-[#000F19] font-manrope-semibold text-2xl md:text-3xl lg:text-5xl leading-tight md:leading-[40px] lg:leading-[50px] text-center mb-6 md:mb-8 lg:mb-[47px] capitalize">
                  {workHere.title}
                </h2>
              )}
            </div>
          </section>

          {/* Work Here Cards Section */}
          <section className="bg-white">
            <div className="w-full bg-white">
              <div className="containersection lg:px-12 bg-white">
                <WorkHereCardsSection cards={workHere.cards} />
              </div>
            </div>
          </section>
        </>
      )}


      {/* Team Testimonials Section */}
      {testimonials && testimonials.testimonials && Array.isArray(testimonials.testimonials) && testimonials.testimonials.length > 0 && (
        <TestimonialsCarouselCareer
          testimonials={testimonials.testimonials}
        />
      )}

      {/* Life at NCG Section - Commented out */}
      {/* {lifeAtNCG && lifeAtNCG.images && Array.isArray(lifeAtNCG.images) && lifeAtNCG.images.length === 11 && (
        <section className="pt-[10px] bg-white overflow-hidden">
          <div className="w-full">
            {/* Row 1: 3 images */}
            {/* <div className="flex flex-col md:flex-row">
              {lifeAtNCG.images.slice(0, 3).map((item: any, index: number) => (
                <div
                  key={`row1-${index}`}
                  className="flex-1 h-48 md:h-64 lg:h-80 bg-black/50 bg-cover bg-center"
                  style={{ backgroundImage: `url('${item?.image?.url || ''}')` }}
                ></div>
              ))}
            </div> */}

            {/* Row 2: 4 images with center text overlay */}
            {/* <div className="grid grid-cols-2 md:grid-cols-4 gap-0 relative">
              {lifeAtNCG.images.slice(3, 7).map((item: any, index: number) => (
                <div
                  key={`row2-${index}`}
                  className="h-48 md:h-56 bg-black/50 bg-cover bg-center"
                  style={{ backgroundImage: `url('${item?.image?.url || ''}')` }}
                ></div>
              ))}

              {/* Center Text Overlay */}
              {/* <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#488BF3] h-auto md:h-56 w-[90%] md:w-[537px] flex flex-col items-center justify-center px-4 py-6 md:py-0 z-10">
                <p className="text-white font-manrope-bold text-2xl md:text-4xl lg:text-7xl leading-tight md:leading-[40px] lg:leading-[50px] uppercase text-center mb-2">
                  {lifeAtNCG.title || 'Life at NCG'}
                </p>
                {lifeAtNCG.subtitle && (
                  <p className="text-white font-manrope-semibold text-base md:text-xl lg:text-3xl leading-6 md:leading-7 lg:leading-[30px] text-center mt-2 md:mt-[20px]">
                    {lifeAtNCG.subtitle}
                  </p>
                )}
              </div>
            </div> */}

            {/* Row 3: 4 images (3 full + 1 cut off on right) */}
            {/* <div className="flex flex-col md:flex-row">
              {lifeAtNCG.images.slice(7, 10).map((item: any, index: number) => (
                <div
                  key={`row3-${index}`}
                  className="flex-1 h-48 md:h-64 lg:h-80 bg-black/50 bg-cover bg-center"
                  style={{ backgroundImage: `url('${item?.image?.url || ''}')` }}
                ></div>
              ))}
              {lifeAtNCG.images[10] && (
                <div
                  className="w-full md:w-[15%] h-48 md:h-64 lg:h-80 bg-black/50 bg-cover bg-center shrink-0"
                  style={{ backgroundImage: `url('${lifeAtNCG.images[10]?.image?.url || ''}')` }}
                ></div>
              )}
            </div>
          </div>
        </section>
      )} */}

      {/* Job Openings Section */}
      {jobOpeningsSection?.selectedJobs && Array.isArray(jobOpeningsSection.selectedJobs) && jobOpeningsSection.selectedJobs.length > 0 && (
        <section className="py-12 md:py-16 lg:py-[100px] bg-[#000F19]">
          <div className="containersection px-4 md:px-6 lg:px-12">
            <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-8 md:mb-12 lg:mb-[90px] gap-4 md:gap-0">
              {jobOpeningsSection?.heading && (
                <h2 className="text-[#FFFFFF] font-manrope-semibold text-2xl md:text-3xl lg:text-[50px] leading-tight md:leading-[40px] lg:leading-[50px] capitalize">
                  {jobOpeningsSection.heading}
                </h2>
              )}
              {/* Button in header - hidden on mobile, visible on tablet/desktop */}
              {jobOpeningsSection?.buttonText && jobOpeningsSection?.buttonLink && (
                <div className="hidden md:block">
                  <AnimatedButton
                    text={jobOpeningsSection.buttonText}
                    width='w-28'
                    link={jobOpeningsSection.buttonLink}
                  />
                </div>
              )}
            </div>

            {/* Job Cards */}
            {jobOpeningsSection?.selectedJobs && Array.isArray(jobOpeningsSection.selectedJobs) && jobOpeningsSection.selectedJobs.length > 0 && (
              <>
                <JobOpeningsSection jobs={jobOpeningsSection.selectedJobs.slice(0, 3)} />
                {/* Button after carousel - visible on mobile, hidden on tablet/desktop */}
                {jobOpeningsSection?.buttonText && jobOpeningsSection?.buttonLink && (
                  <div className="mt-6 md:hidden flex justify-center">
                    <AnimatedButton
                      text={jobOpeningsSection.buttonText}
                      width='w-29'
                      link={jobOpeningsSection.buttonLink}
                    />
                  </div>
                )}
              </>
            )}
          </div>
        </section>
      )}


      {/* Discover the NCG Soundtrack Section */}
      {spotify && (
        <section className="bg-[#488BF3]">
          <div className="max-w-[1512px] mx-auto px-4 md:px-6 lg:px-[242px] py-8 md:py-12 lg:py-[95px] text-center">
            {/* Lottie Animation */}
            <div className="mb-4 flex justify-center">
              <LottieAnimation width="w-36 h-24" />
            </div>

            {spotify.title && (
              <h2 className="text-white font-manrope-semibold text-2xl md:text-3xl lg:text-[50px] leading-tight md:leading-[40px] lg:leading-[50px] mb-3 md:mb-4 lg:mb-[12px] capitalize">
                {spotify.title}
              </h2>
            )}

            {spotify.description && (
              <p className="text-white font-manrope-medium text-base md:text-lg lg:text-2xl leading-6 md:leading-7 lg:leading-[30px] mb-6 md:mb-8 lg:mb-[50px] max-w-full md:max-w-2xl lg:max-w-[1027px] mx-auto px-4 md:px-0">
                {spotify.description}
              </p>
            )}

            {spotify.buttonText && spotify.spotifyLink && (
              <div className='mx-auto flex justify-center'>
                <AnimatedButton
                  centered={true}
                  bgColor='#FFFFFF'
                  textColor='#000F19'
                  hoverTextColor='#000F19'
                  hoverBgColor='#FFFFFF'
                  text={spotify.buttonText}
                  width='w-full md:w-auto lg:w-52'
                  link={spotify.spotifyLink}
                  openInNewTab={true}
                />
              </div>
            )}
          </div>
        </section>
      )}
    </div>
  );
};

export default Career;
