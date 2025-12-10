import React from 'react'
import Image from 'next/image'
import { getPrivacyPolicyPageData } from '@/lib/payload'

// Helper function to parse and format text with bold styling
// Use **text** for bold
const parseFormattedText = (text: string) => {
  if (!text) return null

  let key = 0

  // Split by line breaks first
  const lines = text.split('\n')

  return lines.map((line, lineIndex) => {
    if (!line.trim()) {
      return <br key={`line-${lineIndex}`} />
    }

    const lineParts: React.ReactNode[] = []
    const regex = /(\*\*.*?\*\*)/g
    let match
    let lineCurrentIndex = 0

    while ((match = regex.exec(line)) !== null) {
      // Add text before the match
      if (match.index > lineCurrentIndex) {
        lineParts.push(
          <span key={`${lineIndex}-${key++}`}>
            {line.substring(lineCurrentIndex, match.index)}
          </span>
        )
      }

      const matchedText = match[0]

      // Check if it's bold (**text**)
      if (matchedText.startsWith('**') && matchedText.endsWith('**')) {
        lineParts.push(
          <strong key={`${lineIndex}-${key++}`}>
            {matchedText.slice(2, -2)}
          </strong>
        )
      }

      lineCurrentIndex = match.index + matchedText.length
    }

    // Add remaining text after last match
    if (lineCurrentIndex < line.length) {
      lineParts.push(
        <span key={`${lineIndex}-${key++}`}>
          {line.substring(lineCurrentIndex)}
        </span>
      )
    }

    return (
      <p key={`line-${lineIndex}`} className=" text-sm sm:text-base lg:text-[19px] leading-5 sm:leading-6 lg:leading-[28px] text-[#000F19] mt-3 sm:mt-4">
        {lineParts.length > 0 ? lineParts : line}
      </p>
    )
  })
}

const PrivacyPolicyPage = async () => {
  const data: any = await getPrivacyPolicyPageData()
  const privacyPolicySection: any = data?.privacyPolicySection || null

  const hero = privacyPolicySection?.hero || null
  const introduction = privacyPolicySection?.introduction || ''
  const privacySections = Array.isArray(privacyPolicySection?.privacyPolicySections) 
    ? privacyPolicySection.privacyPolicySections 
    : []
  const cookiesPolicy = privacyPolicySection?.cookiesPolicy || null
  const cookiesIntroduction = cookiesPolicy?.introduction || ''
  const cookiesSections = Array.isArray(cookiesPolicy?.sections) 
    ? cookiesPolicy.sections 
    : []

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section with Background Image */}
      <div className="relative w-full overflow-hidden">
        {/* Background Image */}
        <div className="fixed top-0 inset-0 h-full">
          {hero?.backgroundImage?.url ? (
            <Image
              src={hero.backgroundImage.url}
              alt="Privacy Policy Background"
              fill
              className="object-cover"
              priority
            />
          ) : (
            <div className="w-full h-full bg-gray-800" />
          )}
        </div>

        {/* Content */}
        <div className="relative z-10  flex h-full items-center container flex-col justify-center px-0 sm:px-8 lg:px-48 mx-auto">
          <div className="text-center px-4 pt-20 sm:pt-24 lg:pt-28 pb-8 sm:pb-12 lg:pb-16">
            <h1 className="font-diagrammSemibold text-3xl sm:text-4xl md:text-5xl lg:text-[70px] leading-tight sm:leading-[50px] lg:leading-[75px] text-white mb-4">
              {hero?.title || 'Privacy Policy'}
            </h1>
            <p className="font-manrope-medium  text-sm sm:text-base lg:text-[17px] leading-6 sm:leading-7 lg:leading-[30px] text-white tracking-[1px] sm:tracking-[1.5px] lg:tracking-[1.7px] uppercase">
              Effective Date: {hero?.effectiveDate || '25 August 2025'}
            </p>
          </div>
          <div className="bg-white mx-auto pb-40">
            {/* White Content Container */}
            <div className="px-4 sm:px-8 lg:px-16 pt-8 sm:pt-12 lg:pt-16">
              {/* Introduction */}
              <div className="mb-8 sm:mb-12 lg:mb-16">
                <p className=" text-base sm:text-lg lg:text-[21px] leading-6 sm:leading-7 lg:leading-[32px] text-[#000F19] mb-6 sm:mb-8">
                  {introduction}
                </p>

                {/* Divider Line */}
                <div className="w-full h-px bg-black mb-6 sm:mb-8" />
              </div>
            </div>

            {/* Policy Sections Container */}
            <div className="mx-auto w-full">
              <div className="px-4 sm:px-8 lg:px-16">
                {/* Policy Sections */}
                <div className="space-y-6 sm:space-y-8 lg:space-y-10">
                  {/* Privacy Policy Sections */}
                  {privacySections.map((section: any, index: number) => (
                    <section key={index}>
                      <h2 className="Semibold text-xl sm:text-2xl lg:text-[26px] leading-6 sm:leading-7 lg:leading-[32px] text-[#000F19] mb-3 sm:mb-4">
                        {section?.title || ''}
                      </h2>
                      <div className="pl-4 sm:pl-6 lg:pl-8">
                        {parseFormattedText(section?.content || '')}
                      </div>
                    </section>
                  ))}

                  {/* Divider Line */}
                  {privacySections.length > 0 && cookiesSections.length > 0 && (
                    <div className="w-full h-px bg-black my-8 sm:my-12 lg:my-16" />
                  )}

                  {/* Cookies Policy Section */}
                  {cookiesSections.length > 0 && (
                    <section>
                      <h2 className="Semibold text-xl sm:text-2xl lg:text-5xl leading-6 sm:leading-7 lg:leading-[32px] text-[#000F19] mb-3 sm:mb-6">
                        Cookies Policy
                      </h2>
                      <div className="pl-4 sm:pl-6 lg:pl-8">
                        {cookiesIntroduction && (
                          <>
                            <h3 className="Semibold text-lg sm:text-xl lg:text-[22px] leading-6 sm:leading-7 lg:leading-[28px] text-[#000F19] mb-3 sm:mb-4 mt-4">
                              What Are Cookies?
                            </h3>
                            <p className=" text-sm sm:text-base lg:text-[19px] leading-5 sm:leading-6 lg:leading-[28px] text-[#000F19] mb-6 sm:mb-8">
                              {cookiesIntroduction}
                            </p>
                          </>
                        )}

                        {/* Cookies Policy Sections */}
                        {cookiesSections.map((section: any, index: number) => (
                          <div key={index}>
                            <h3 className="Semibold text-lg sm:text-xl lg:text-[22px] leading-6 sm:leading-7 lg:leading-[28px] text-[#000F19] mb-3 sm:mb-4 mt-6">
                              {section?.title || ''}
                            </h3>
                            {parseFormattedText(section?.content || '')}
                          </div>
                        ))}
                      </div>
                    </section>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PrivacyPolicyPage
