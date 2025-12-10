import Link from 'next/link'
import InstagramIcon from './icons/InstagramIcon'
import TwitterXIcon from './icons/TwitterXIcon'
import LinkedInIcon from './icons/LinkedInIcon'
import { getFooterData } from '@/lib/payload'
import { getPayloadClient } from '@/lib/payload-retry'
import FooterMobile from './FooterMobile'

interface Service {
  id: string | number
  title: string
  slug?: string
}

// Helper function to generate URL-friendly slugs
const generateSlug = (text: string): string => {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

const Footer = async () => {
  const { footerSection } = await getFooterData()
  const contact = footerSection?.contactUs || null
  const follow = footerSection?.followUs || null
  const sweden = footerSection?.sweden || null
  const malmo = footerSection?.malmo || null
  const bottomBar = footerSection?.bottomBar || null

  // Fetch services data - same approach as Header
  let services: Service[] = []
  try {
    const payloadClient = await getPayloadClient()
    const servicesSection = await payloadClient.findGlobal({ slug: 'services-section', depth: 2 }).catch(() => null)
    
    if (servicesSection?.services && Array.isArray(servicesSection.services)) {
      services = servicesSection.services
        .map((item: any) => {
          // Handle service - could be ID or object
          const service = typeof item.service === 'object' && item.service !== null
            ? item.service
            : null

          if (!service) return null

          return {
            id: service.id || String(service.id),
            title: service.title || '',
            slug: service.slug || undefined,
          }
        })
        .filter((service: Service | null): service is Service => service !== null)
    }
  } catch (error) {
    console.error('Error fetching services for footer:', error)
  }
  return (
    <>
      {/* Mobile and Tablet Footer */}
      <FooterMobile
        services={services}
        contact={contact}
        follow={follow}
        sweden={sweden}
        malmo={malmo}
        bottomBar={bottomBar}
      />

      {/* Desktop Footer */}
      <footer className="hidden lg:block bg-[#000F19] text-white py-14 z-30 relative">
        <div className="containersection px-10">
        <div className="grid grid-cols-4 gap-8 mb-24">
          {/* Services */}
          <div className="space-y-4 flex flex-col items-center">
            <ul className="space-y-2 ">
              <div className="flex items-center -ml-5.5">
                <div className="w-1.5 h-1.5 mr-4 bg-blue-400" />
                <h4 className="text-blue-400 font-manrope-medium text-xl">Services</h4>
              </div>
              {services.length > 0 ? (
                services.map((service) => {
                  const serviceSlug = service.slug || generateSlug(service.title)
                  return (
                    <li key={service.id}>
                      <Link
                        href={`/services/${serviceSlug}`}
                        className="footer-link text-base"
                      >
                        {service.title}
                      </Link>
                    </li>
                  )
                })
              ) : (
                // Fallback to default services if none found
                <>
                  <li>
                    <Link
                      href="/services"
                      className="footer-link text-base"
                    >
                      Digital Fraud & Fin Crime
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/services"
                      className="footer-link text-base"
                    >
                      Identity Security
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/services"
                      className="footer-link text-base"
                    >
                      Digital Compliance & Cybersecurity
                    </Link>
                  </li>
                </>
              )}
            </ul>
          </div>
          <div className="space-y-4 flex flex-col items-center">
            <ul className="space-y-2">
              <div className="flex items-center -ml-5.5">
                <div className="w-1.5 h-1.5 mr-4 bg-blue-400" />
                <h4 className="text-blue-400 font-manrope-medium text-xl">The Company</h4>
              </div>
              <li>
                <Link
                  href="/about"
                  className="footer-link text-base"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href="/case-studies"
                  className="footer-link text-base"
                >
                  Case Studies
                </Link>
              </li>
              <li>
                <Link
                  href="/blogs"
                  className="footer-link text-base"
                >
                  Blogs
                </Link>
              </li>
              <li>
                <Link
                  href="/career"
                  className="footer-link text-base"
                >
                  Career
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="footer-link text-base"
                >
                  Book Free Consultation
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="footer-link text-base"
                >
                  Contact Us
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy-policy"
                  className="footer-link text-base"
                >
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>
          <div className="space-y-4 flex flex-col items-start">
            <ul className="space-y-2">
              <div className="flex items-center -ml-5.5">
                <div className="w-1.5 h-1.5 mr-4 bg-blue-400" />
                <h4 className="text-blue-400 font-manrope-medium text-xl">Contact Us</h4>
              </div>
              <li>
                <p className="text-white font-manrope-semibold text-lg">{contact?.phoneHeading || 'Phone:'}</p>
              </li>
              <li>
                <p className="text-white font-manrope-medium text-base">{contact?.phone?.sweden || 'Sweden: +46-732-442-583'}</p>
              </li>
              <li>
                <p className="text-white font-manrope-medium text-base">{contact?.phone?.denmark || 'Denmark: +12 34 45 67 80'}</p>
              </li>
              <li>
                <p className="text-white font-manrope-semibold text-lg">{contact?.emailHeading || 'Email:'}</p>
              </li>
              <li>
                <p className="text-white font-manrope-medium text-base">{contact?.email || 'info@ncgrp.se'}</p>
              </li>
            </ul>
          </div>
          <div className="space-y-4 flex flex-col items-start">
            <ul className="space-y-2">
              <div className="flex items-center -ml-5.5">
                <div className="w-1.5 h-1.5 mr-4 bg-blue-400" />
                <h4 className="text-blue-400 font-manrope-medium text-xl">{follow?.title || 'Follow Us'}</h4>
              </div>
              <li>
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
                    href="#"
                    className="w-6.5 h-6.5 bg-white rounded-lg flex items-center justify-center hover:bg-gray-200 transition-colors duration-300"
                  >
                    <LinkedInIcon width={17} height={17} />
                  </Link>
                </div>
              </li>

            </ul>
          </div>
          {/* Empty columns to maintain grid alignment */}
          <div />
          <div />
          {/* Sweden - aligns with third column (right side) */}
          <div className="space-y-4 flex flex-col items-start">
            <ul className="space-y-2">
              <div className="flex items-center -ml-5.5">
                <div className="w-1.5 h-1.5 mr-4 bg-blue-400" />
                <h4 className="text-blue-400 font-manrope-medium text-xl">{sweden?.title || 'Sweden'}</h4>
              </div>
              <li>
                <p className="text-white font-manrope-semibold text-lg">{sweden?.officeHeading || 'Head Office Stockholm'}</p>
              </li>
              <li>
                <p className="text-white font-manrope-medium text-base leading-relaxed">
                  {sweden?.addressLine1 || 'Kungsbro Strand 29, 112 26'}
                  <br />
                  {sweden?.addressLine2 || 'Stockholm, Sweden'}
                </p>
              </li>
            </ul>
          </div>
          {/* Malmo - aligns with fourth column (right side) */}
          <div className="space-y-4 flex flex-col items-start">
            <ul className="space-y-2">
              <div className="flex items-center -ml-5.5">
                <div className="w-1.5 h-1.5 mr-4 bg-blue-400" />
                <h4 className="text-blue-400 font-manrope-medium text-xl">{malmo?.title || 'Malmo'}</h4>
              </div>
              <li>
                <p className="text-white font-manrope-semibold text-lg">{malmo?.officeHeading || 'Branch Office'}</p>
              </li>
              <li>
                <p className="text-white font-manrope-medium text-base leading-relaxed">
                  {malmo?.addressLine1 || 'Torggatan 4, Seventh Floor'}
                  <br />
                  {malmo?.addressLine2 || '211 40 Malmo'}
                </p>
              </li>
            </ul>
          </div>
        </div>

        <div className="flex items-center mb-4 md:mb-0">
          <img
            src="/assets/ncg-logo-black.svg"
            alt="NCG Logo"
            width="174"
            height="81"
            className="h-20 w-auto invert"
          />
        </div>
          <div className="flex flex-col md:flex-row items-center gap-4 justify-between mb-2 mt-6">
            <p className="text-white font-manrope-normal text-xs">{bottomBar?.copyrightText || '© 2025 Nordic Cyber Group'}</p>
            <Link
              href={bottomBar?.privacyHref || '/privacy-policy'}
              className="footer-link font-manrope-normal text-xs"
            >
              {bottomBar?.privacyLabel || 'Privacy Policy'}
            </Link>
          </div>
        <div className="border-t border-gray-600 pt-8 flex flex-col md:flex-row justify-between items-center"/>
        </div>
      </footer>
    </>
  )
}

export default Footer
