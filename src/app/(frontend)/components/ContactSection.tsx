import React from 'react'
import Link from 'next/link'
import SocialIcon from './SocialIcon'
import { getPayloadClient } from '@/lib/payload-retry'
import dynamic from 'next/dynamic'

const ContactForm = dynamic(() => import('./ContactForm'), {
  loading: () => <div className="h-[400px] w-full" />,
})

interface ContactSectionData {
  heading: string
  teamMember: {
    name: string
    position: string
    image?: {
      url: string
    }
    certifications: Array<{
      name: string
    }>
    linkedinUrl?: string
  }
  submitButtonText: string
  privacyText: string
}

const ContactSection = async () => {
  // Fetch contact section data from CMS
  let data: ContactSectionData | null = null
  
  try {
    const payloadClient = await getPayloadClient()
    const contactSection = await payloadClient.findGlobal({ slug: 'contact-section' }).catch(() => null)
    
    if (contactSection?.heading) {
      data = contactSection as ContactSectionData
    }
  } catch (error) {
    console.error('Error fetching contact section data:', error)
  }

  // Default fallback data
  const defaultData: ContactSectionData = {
    heading: 'Partner with NCG for cybersecurity excellence',
    teamMember: {
      name: 'Shivam Mukhi',
      position: 'Identity Security Specialist',
      certifications: [
        { name: 'CISSP - Certified Information Systems Security Professional' },
        { name: 'Certified Information Security Manager' },
        { name: 'Certified Identity And Access Manager' },
        { name: 'ISO/IEC 27001 Lead Implementer' },
      ],
    },
    submitButtonText: 'Connect Today',
    privacyText:
      'By clicking submit, you acknowledge our Privacy Policy and agree to receive email communication from us.',
  }

  const contactData = data || defaultData
  const teamImage = contactData.teamMember.image?.url || '/home-images/team-member.png'
  return (
    <section className="py-12 md:py-44 bg-[#e6f5ff] z-10 relative">
      <div className="mx-auto containersection px-4 md:px-10">
        <div className="flex flex-col lg:grid lg:grid-cols-2 gap-8 lg:gap-8">
          {/* Team Member Card */}
          <div className="relative">
            <div className="relative h-[400px] md:h-[685px] rounded-lg overflow-hidden">
              <img
                src={teamImage}
                alt={contactData.teamMember.name}
                className="w-full h-full object-cover object-left-top"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>

              {/* Team Member Info */}
              <div className="absolute bottom-0 left-0 right-0 px-4 md:px-12 pb-6 md:pb-8 text-white">
                <div className="flex justify-between items-end">
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-white font-manrope-bold text-2xl md:text-3xl leading-[1em] mb-1">
                          {contactData.teamMember.name}
                        </h3>
                        <p className="text-white font-manrope-medium text-lg md:text-xl mt-2 mb-4">
                          {contactData.teamMember.position}
                        </p>
                      </div>
                      {contactData.teamMember.linkedinUrl && (
                        <a
                          href={contactData.teamMember.linkedinUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:opacity-80 transition-opacity duration-300 ml-2"
                          aria-label={`${contactData.teamMember.name}'s LinkedIn profile`}
                        >
                          <SocialIcon>
                            <svg
                              width="19"
                              height="19"
                              viewBox="0 0 19 19"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <g clipPath="url(#clip0_5436_6243)">
                                <path
                                  d="M4.23261 5.84229H0.58278C0.420742 5.84229 0.289612 5.97393 0.289612 6.1361V17.8873C0.289612 18.0497 0.420969 18.1811 0.58278 18.1811H4.23261C4.39464 18.1811 4.52577 18.0495 4.52577 17.8873V6.1361C4.52577 5.9737 4.39442 5.84229 4.23261 5.84229Z"
                                  fill="#000F19"
                                />
                                <path
                                  d="M2.40852 0C1.0804 0 0 1.08165 0 2.4111C0 3.74055 1.0804 4.82311 2.40852 4.82311C3.73664 4.82311 4.815 3.74101 4.815 2.4111C4.815 1.08165 3.7355 0 2.40852 0Z"
                                  fill="#000F19"
                                />
                                <path
                                  d="M13.5159 5.5498C12.05 5.5498 10.9662 6.18139 10.309 6.89907V6.13584C10.309 5.97344 10.1776 5.84202 10.0158 5.84202H6.52052C6.35849 5.84202 6.22736 5.97367 6.22736 6.13584V17.887C6.22736 18.0494 6.35871 18.1809 6.52052 18.1809H10.1624C10.3244 18.1809 10.4556 18.0492 10.4556 17.887V12.0729C10.4556 10.1137 10.9867 9.35049 12.3493 9.35049C13.8336 9.35049 13.9515 10.574 13.9515 12.1738V17.8873C13.9515 18.0497 14.0829 18.1811 14.2447 18.1811H17.8879C18.05 18.1811 18.1811 18.0494 18.1811 17.8873V11.4416C18.1811 8.52826 17.6268 5.55003 13.5159 5.55003V5.5498Z"
                                  fill="#000F19"
                                />
                              </g>
                              <defs>
                                <clipPath id="clip0_5436_6243">
                                  <rect width="18.181" height="18.181" fill="white" />
                                </clipPath>
                              </defs>
                            </svg>
                          </SocialIcon>
                        </a>
                      )}
                    </div>
                    <div className="w-full h-px bg-white mb-2"></div>

                    <div className="text-white">
                      <p className="text-white font-manrope-medium text-xs md:text-[14px] leading-[1.5em] mb-1">
                        {contactData.teamMember.certifications.map((cert) => cert.name).join(', ')}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Heading and Form Section */}
          <ContactForm 
            heading={contactData.heading}
            submitButtonText={contactData.submitButtonText}
            privacyText={contactData.privacyText}
          />
        </div>
      </div>
    </section>
  )
}

export default ContactSection
