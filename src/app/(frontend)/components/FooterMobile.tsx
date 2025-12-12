import React from 'react'
import Link from 'next/link'
import InstagramIcon from './icons/InstagramIcon'
import TwitterXIcon from './icons/TwitterXIcon'
import LinkedInIcon from './icons/LinkedInIcon'

interface Service {
  id: string | number
  title: string
  slug?: string
}

interface FooterMobileProps {
  services: Service[]
  contact: {
    phoneHeading?: string
    phone?: {
      sweden?: string
      denmark?: string
    }
    emailHeading?: string
    email?: string
  } | null
  follow: {
    title?: string
  } | null
  sweden: {
    title?: string
    officeHeading?: string
    addressLine1?: string
    addressLine2?: string
  } | null
  malmo: {
    title?: string
    officeHeading?: string
    addressLine1?: string
    addressLine2?: string
  } | null
  bottomBar: {
    copyrightText?: string
    privacyLabel?: string
    privacyHref?: string
  } | null
}

// Helper function to generate URL-friendly slugs
const generateSlug = (text: string): string => {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

const FooterMobile: React.FC<FooterMobileProps> = ({
  services,
  contact,
  follow,
  sweden,
  malmo,
  bottomBar,
}) => {
  return (
    <footer className="bg-[#000F19] text-white pt-8 md:pt-10 lg:hidden">
      <div className="containersection px-4 md:px-6">
        {/* Mobile: Single Column, Tablet: Two Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-6 mb-8 md:mb-10">
          {/* Left Column - Mobile & Tablet */}
          <div className="space-y-8 md:space-y-6">
            {/* Services */}
            <div>
              <ul className="space-y-3">
                <div className="flex items-center">
                  <div className="w-1.5 h-1.5 mr-4 bg-blue-400" />
                  <h4 className="text-blue-400 font-manrope-medium text-lg md:text-xl">Services</h4>
                </div>
                {services.length > 0 ? (
                  services.map((service) => {
                    const serviceSlug = service.slug || generateSlug(service.title)
                    return (
                      <li key={service.id} className="pl-5.5">
                        <Link
                          href={`/services/${serviceSlug}`}
                          className="footer-link text-sm md:text-base"
                        >
                          {service.title}
                        </Link>
                      </li>
                    )
                  })
                ) : (
                  <>
                    <li className="pl-5.5">
                      <Link
                        href="/services"
                        className="footer-link text-sm md:text-base"
                      >
                        Digital Fraud & Fin Crime
                      </Link>
                    </li>
                    <li className="pl-5.5">
                      <Link
                        href="/services"
                        className="footer-link text-sm md:text-base"
                      >
                        Identity Security
                      </Link>
                    </li>
                    <li className="pl-5.5">
                      <Link
                        href="/services"
                        className="footer-link text-sm md:text-base"
                      >
                        Digital Compliance & Cybersecurity
                      </Link>
                    </li>
                  </>
                )}
              </ul>
            </div>
       {/* The Company */}
       <div>
              <ul className="space-y-3">
                <div className="flex items-center">
                  <div className="w-1.5 h-1.5 mr-4 bg-blue-400" />
                  <h4 className="text-blue-400 font-manrope-medium text-lg md:text-xl">The Company</h4>
                </div>
                <li className="pl-5.5">
                  <Link
                    href="/about"
                    className="footer-link text-sm md:text-base"
                  >
                    About Us
                  </Link>
                </li>
                <li className="pl-5.5">
                  <Link
                    href="/case-studies"
                    className="footer-link text-sm md:text-base"
                  >
                    Case Studies
                  </Link>
                </li>
                <li className="pl-5.5">
                  <Link
                    href="/blogs"
                    className="footer-link text-sm md:text-base"
                  >
                    Blogs
                  </Link>
                </li>
                <li className="pl-5.5">
                  <Link
                    href="/career"
                    className="footer-link text-sm md:text-base"
                  >
                    Career
                  </Link>
                </li>
                <li className="pl-5.5">
                  <Link
                    href="/contact"
                    className="footer-link text-sm md:text-base"
                  >
                    Book Free Consultation
                  </Link>
                </li>
                <li className="pl-5.5">
                  <Link
                    href="/contact"
                    className="footer-link text-sm md:text-base"
                  >
                    Contact Us
                  </Link>
                </li>
                <li className="pl-5.5">
                  <Link
                    href="/privacy-policy"
                    className="footer-link text-sm md:text-base"
                  >
                    Privacy Policy
                  </Link>
                </li>
              </ul>
            </div>
            {/* Contact Us */}
            <div>
              <ul className="space-y-3">
                <div className="flex items-center">
                  <div className="w-1.5 h-1.5 mr-4 bg-blue-400" />
                  <h4 className="text-blue-400 font-manrope-medium text-lg md:text-xl">Contact Us</h4>
                </div>
                <li className="pl-5.5">
                  <p className="text-white font-manrope-semibold text-base md:text-lg">{contact?.phoneHeading || 'Phone:'}</p>
                </li>
                <li className="pl-5.5">
                  <p className="text-white font-manrope-medium text-sm md:text-base">{contact?.phone?.sweden || 'Sweden: +46-732-442-583'}</p>
                </li>
                <li className="pl-5.5">
                  <p className="text-white font-manrope-medium text-sm md:text-base">{contact?.phone?.denmark || 'Denmark: +12 34 45 67 80'}</p>
                </li>
                <li className="pl-5.5">
                  <p className="text-white font-manrope-semibold text-base md:text-lg">{contact?.emailHeading || 'Email:'}</p>
                </li>
                <li className="pl-5.5">
                  <p className="text-white font-manrope-medium text-sm md:text-base">{contact?.email || 'info@ncgrp.se'}</p>
                </li>
              </ul>
            </div>

            {/* Sweden */}
            <div>
              <ul className="space-y-3">
                <div className="flex items-center">
                  <div className="w-1.5 h-1.5 mr-4 bg-blue-400" />
                  <h4 className="text-blue-400 font-manrope-medium text-lg md:text-xl">{sweden?.title || 'Sweden'}</h4>
                </div>
                <li className="pl-5.5">
                  <p className="text-white font-manrope-semibold text-base md:text-lg">{sweden?.officeHeading || 'Head Office Stockholm'}</p>
                </li>
                <li className="pl-5.5">
                  <p className="text-white font-manrope-medium text-sm md:text-base leading-relaxed">
                    {sweden?.addressLine1 || 'Kungsbro Strand 29, 112 26'}
                    <br />
                    {sweden?.addressLine2 || 'Stockholm, Sweden'}
                  </p>
                </li>
              </ul>
            </div>
          </div>

          {/* Right Column - Mobile & Tablet */}
          <div className="space-y-8 md:space-y-6">
     




            {/* Malmo */}
            <div>
              <ul className="space-y-3">
                <div className="flex items-center">
                  <div className="w-1.5 h-1.5 mr-4 bg-blue-400" />
                  <h4 className="text-blue-400 font-manrope-medium text-lg md:text-xl">{malmo?.title || 'Malmo'}</h4>
                </div>
                <li className="pl-5.5">
                  <p className="text-white font-manrope-semibold text-base md:text-lg">{malmo?.officeHeading || 'Branch Office'}</p>
                </li>
                <li className="pl-5.5">
                  <p className="text-white font-manrope-medium text-sm md:text-base leading-relaxed">
                    {malmo?.addressLine1 || 'Torggatan 4, Seventh Floor'}
                    <br />
                    {malmo?.addressLine2 || '211 40 Malmo'}
                  </p>
                </li>
              </ul>
            </div>
                        {/* Follow Us */}
                        <div>
              <ul className="space-y-3">
                <div className="flex items-center">
                  <div className="w-1.5 h-1.5 mr-4 bg-blue-400" />
                  <h4 className="text-blue-400 font-manrope-medium text-lg md:text-xl">{follow?.title || 'Follow Us'}</h4>
                </div>
                <li className="pl-5.5">
                  <div className="flex gap-4">
                    <Link
                      href="#"
                      className="w-6.5 h-6.5 flex items-center justify-center transition-colors duration-300"
                    >
                      <InstagramIcon width={25} height={25} />
                    </Link>
                    <Link
                      href="#"
                      className="w-6.5 h-6.5 bg-white rounded-lg flex items-center justify-center hover:bg-gray-200 transition-colors duration-300"
                    >
                      <TwitterXIcon width={20} height={20} />
                    </Link>
                    <Link
                      href="https://www.linkedin.com/company/nordic-cyber-group/"
                      className="w-6.5 h-6.5 bg-white rounded-lg flex items-center justify-center hover:bg-gray-200 transition-colors duration-300"
                    >
                      <LinkedInIcon width={17} height={17} />
                    </Link>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Separator Line */}

        {/* Logo */}
        <div className="flex items-center mb-6 md:mb-8">
          <img
            src="/assets/ncg-logo-black.svg"
            alt="NCG Logo"
            width="174"
            height="81"
            className="h-16 md:h-20 w-auto invert"
          />
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-row justify-between items-center gap-4 mb-4">
          <p className="text-white font-manrope-normal text-xs">{bottomBar?.copyrightText || '© 2025 Nordic Cyber Group'}</p>
          <Link
            href={bottomBar?.privacyHref || '/privacy-policy'}
            className="footer-link font-manrope-normal text-xs"
          >
            {bottomBar?.privacyLabel || 'Privacy Policy'}
          </Link>
        </div>
        <div className="border-t border-gray-600 pt-6 md:pt-8 "></div>

      </div>
    </footer>
  )
}

export default FooterMobile

