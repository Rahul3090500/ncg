'use client'

import React, { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import NCGLogo from './NCGLogo'
import AnimatedButton from './AnimatedButton'

interface Service {
  id: string | number
  title: string
  slug?: string
  subServices?: SubService[]
}

interface SubService {
  id: string | number
  title: string
  slug?: string
}

// Helper function to generate URL-friendly slugs (same as ServicesSection)
const generateSlug = (text: string): string => {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

const Header: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [isServicesDropdownOpen, setIsServicesDropdownOpen] = useState(false)
  const [isServicesHovered, setIsServicesHovered] = useState(false)
  const [isInsightsHovered, setIsInsightsHovered] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isMobileServicesOpen, setIsMobileServicesOpen] = useState(false)
  const [isMobileInsightsOpen, setIsMobileInsightsOpen] = useState(false)
  const [services, setServices] = useState<Service[]>([])
  const [isServicesLoading, setIsServicesLoading] = useState(true)
  const [databaseError, setDatabaseError] = useState<string | null>(null)
  const pathname = usePathname()
  const isContactPage = pathname === '/contact'
  const isFreeConsultationPage = pathname === '/free-consultation'
  const isSpecialPage = isContactPage || isFreeConsultationPage
  const dropdownRef = useRef<HTMLDivElement>(null)
  const servicesDropdownRef = useRef<HTMLDivElement>(null)
  const mobileMenuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const checkBackgroundColor = () => {
      // Check if body or main element has white background
      const body = document.body
      const main = document.querySelector('main')
      
      // Get computed styles
      const bodyStyle = window.getComputedStyle(body)
      const mainStyle = main ? window.getComputedStyle(main) : null
      
      // Check background color
      const bodyBg = bodyStyle.backgroundColor
      const mainBg = mainStyle?.backgroundColor
      
      // Check if background is white (rgb(255, 255, 255) or similar)
      const isWhiteBackground = (color: string) => {
        if (!color || color === 'transparent' || color === 'rgba(0, 0, 0, 0)') {
          return false
        }
        // Check for white or very light colors
        const rgbMatch = color.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/)
        if (rgbMatch) {
          const r = parseInt(rgbMatch[1])
          const g = parseInt(rgbMatch[2])
          const b = parseInt(rgbMatch[3])
          // Consider it white if all RGB values are > 240
          return r > 240 && g > 240 && b > 240
        }
        return color.toLowerCase().includes('white')
      }
      
      // Also check if the first section has white background
      const firstSection = document.querySelector('section')
      const sectionStyle = firstSection ? window.getComputedStyle(firstSection) : null
      const sectionBg = sectionStyle?.backgroundColor
      
      const hasWhiteBg = isWhiteBackground(bodyBg) || 
                         isWhiteBackground(mainBg || '') || 
                         isWhiteBackground(sectionBg || '')
      
      return hasWhiteBg
    }

    const handleScroll = () => {
      // Disable scroll logic on special pages (contact/free-consultation)
      if (isSpecialPage) {
        setIsScrolled(true)
        return
      }
      
      if (window.scrollY > 0.1) {
        setIsScrolled(true)
      } else {
        // Check if page has white background even at top
        const hasWhiteBg = checkBackgroundColor()
        setIsScrolled(hasWhiteBg)
      }
    }

    // Check on mount and when pathname changes
    // Use setTimeout to ensure DOM is ready
    const checkInitialState = () => {
      // Always set scrolled on special pages
      if (isSpecialPage) {
        setIsScrolled(true)
        return
      }
      
      const hasWhiteBg = checkBackgroundColor()
      setIsScrolled(hasWhiteBg || window.scrollY > 0.1)
    }
    
    // Check immediately
    checkInitialState()
    
    // Also check after a short delay to ensure DOM is fully rendered
    const timeoutId = setTimeout(checkInitialState, 100)

    window.addEventListener('scroll', handleScroll)
    return () => {
      window.removeEventListener('scroll', handleScroll)
      clearTimeout(timeoutId)
    }
  }, [pathname, isSpecialPage])

  // Fetch services data - same as ServicesSection uses
  useEffect(() => {
    const fetchServices = async () => {
      setIsServicesLoading(true)
      setDatabaseError(null)
      try {
        // Fetch from homepage API to get services-section global (same as ServicesSection)
        const response = await fetch('/api/homepage-read', {
          cache: 'no-store',
          headers: { 'Cache-Control': 'no-cache' },
        })
        
        if (response.ok) {
          const result = await response.json()
          const servicesSection = result?.servicesSection
          
          if (!servicesSection?.services || !Array.isArray(servicesSection.services)) {
            setServices([])
            setIsServicesLoading(false)
            return
          }

          // Transform services data - same logic as ServicesSection
          const transformedServices = servicesSection.services
            .map((item: any) => {
              // Handle service - could be ID or object
              const service = typeof item.service === 'object' && item.service !== null
                ? item.service
                : null

              if (!service) return null

              // Transform sub-services - same as ServicesSection
              const subServicesArray: SubService[] = Array.isArray(item.subServices)
                ? item.subServices
                    .map((sub: any) => {
                      const subService = typeof sub === 'object' && sub !== null ? sub : null
                      if (!subService) return null
                      return {
                        id: subService.id || String(subService.id),
                        title: subService.title || '',
                        slug: subService.slug || undefined,
                      }
                    })
                    .filter((sub: SubService | null): sub is SubService => sub !== null)
                : []

              return {
                id: service.id || String(service.id),
                title: service.title || '',
                slug: service.slug || undefined,
                subServices: subServicesArray,
              }
            })
            .filter((service: Service | null): service is Service => service !== null)
            .slice(0, 3) // Limit to first 3 services for header dropdown

          setServices(transformedServices)
        } else {
          // Check if it's a database connection error
          const errorData = await response.json().catch(() => ({}))
          if (errorData.errorType === 'DATABASE_CONNECTION_ERROR' || response.status === 503) {
            setDatabaseError(errorData.message || 'Database connection unavailable')
          }
        }
      } catch (error) {
        console.error('Error fetching services:', error)
        // Check if error message indicates database connection issue
        const errorMessage = error instanceof Error ? error.message : String(error)
        if (errorMessage.toLowerCase().includes('database') || 
            errorMessage.toLowerCase().includes('connection')) {
          setDatabaseError('Database connection error occurred')
        }
      } finally {
        setIsServicesLoading(false)
      }
    }
    fetchServices()
  }, [])

  const handleReload = () => {
    if (typeof window !== 'undefined') {
      window.location.reload()
    }
  }

  // Set isScrolled to true when any dropdown opens
  useEffect(() => {
    if (isDropdownOpen || isServicesDropdownOpen || isMobileMenuOpen) {
      setIsScrolled(true)
    }
  }, [isDropdownOpen, isServicesDropdownOpen, isMobileMenuOpen])

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isMobileMenuOpen])

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false)
      }
      if (servicesDropdownRef.current && !servicesDropdownRef.current.contains(event.target as Node)) {
        setIsServicesDropdownOpen(false)
      }
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target as Node)) {
        // Don't close if clicking the hamburger button itself
        const target = event.target as HTMLElement
        if (!target.closest('button[aria-label="Toggle mobile menu"]')) {
          setIsMobileMenuOpen(false)
        }
      }
    }

    if (isDropdownOpen || isServicesDropdownOpen || isMobileMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isDropdownOpen, isServicesDropdownOpen, isMobileMenuOpen])

  return (
    <>
      {databaseError && (
        <div className="fixed top-0 left-0 right-0 z-[60] bg-red-600 text-white px-6 py-3 flex items-center justify-between shadow-lg">
          <div className="max-w-container mx-auto w-full flex items-center justify-between">
            <p className="text-sm font-manrope-medium">
              {databaseError}
            </p>
            <button
              onClick={handleReload}
              className="ml-4 px-4 py-1.5 bg-white text-red-600 font-manrope-medium rounded hover:bg-gray-100 transition-colors text-sm"
            >
              Reload
            </button>
          </div>
        </div>
      )}
      <header 
        className={`fixed py-2 top-0 left-0 right-0 z-50 font-manrope transition-all duration-300 ${
          isSpecialPage ? 'bg-transparent' : (isScrolled ? 'bg-white' : 'bg-transparent')
        } ${databaseError ? 'mt-12' : ''}`}
      >
        <div className="containersection overflow-visible! px-6 mx-auto flex justify-between items-center">
        <div className="flex items-center">
          <Link href="/" className="flex items-center group" onClick={() => setIsMobileMenuOpen(false)}>
            <NCGLogo strokeColor={isSpecialPage ? '#000F19' : (isScrolled ? '#000F19' : '#FFFFFF')} hoverColor={isSpecialPage ? '#000F19' : '#488BF3'} />
          </Link>
        </div>
        
        {/* Desktop Navigation - Hidden on tablet/mobile */}
        <nav className="hidden lg:flex items-center gap-6">
          <div 
            ref={servicesDropdownRef}
            className=""
          >
            <button
              onClick={() => setIsServicesDropdownOpen(!isServicesDropdownOpen)}
              onMouseEnter={() => setIsServicesHovered(true)}
              onMouseLeave={() => setIsServicesHovered(false)}
              className={`no-underline text-lg transition-colors duration-300 font-manrope-semibold flex items-center gap-1 bg-transparent border-none cursor-pointer ${
                isServicesDropdownOpen
                  ? 'text-[#488bf3]' 
                  : isSpecialPage
                    ? 'text-[#000F19] hover:text-[#488bf3]'
                    : isScrolled 
                      ? 'text-ncg-dark hover:text-[#488bf3]' 
                      : 'text-white'
              }`}
            >
              Services
              <motion.div
                animate={{ y: isServicesHovered ? 3 : 0 }}
                transition={{ duration: 0.2, ease: "easeInOut" }}
                className="inline-flex"
              >
                <svg 
                  className={`w-4 h-4 transition-transform duration-300 ${isServicesDropdownOpen ? 'rotate-180' : ''}`}
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </motion.div>
            </button>
            <AnimatePresence>
              {isServicesDropdownOpen && (
                <motion.div
                  className="absolute top-full left-1/2 -translate-x-1/2 mt-[3px] bg-white rounded-lg shadow-lg overflow-hidden z-50"
                  style={{ 
                    width: '98%', 
                    maxWidth: '1794px',
                    transformOrigin: 'top center'
                  }}
                  initial={{ 
                    scaleY: 0,
                    opacity: 0,
                    y: -10,
                    rotateX: -15
                  }}
                  animate={{ 
                    scaleY: 1,
                    opacity: 1,
                    y: 0,
                    rotateX: 0
                  }}
                  exit={{ 
                    scaleY: 0,
                    opacity: 0,
                    y: -10,
                    rotateX: -15
                  }}
                  transition={{ 
                    duration: 0.5,
                    ease: [0.34, 1.56, 0.64, 1]
                  }}
                >
                  {isServicesLoading ? (
                    <motion.div 
                      className="grid grid-cols-3 gap-10 p-8"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.2 }}
                    >
                      {[1, 2, 3].map((index) => (
                        <motion.div 
                          key={index} 
                          className="flex flex-col"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.3 + index * 0.1 }}
                        >
                          {/* Service Title Skeleton */}
                          <div className="h-7 bg-gray-200 rounded mb-4 w-3/4 animate-pulse"></div>
                          {/* Sub-Services Skeleton */}
                          <ul className="space-y-2.5">
                            {[1, 2, 3, 4].map((subIndex) => (
                              <li key={subIndex}>
                                <div className="flex items-start">
                                  <div className="h-5 bg-gray-200 rounded w-full animate-pulse"></div>
                                </div>
                              </li>
                            ))}
                          </ul>
                        </motion.div>
                      ))}
                    </motion.div>
                  ) : (
                    <motion.div 
                      className="grid grid-cols-3 gap-10 p-8"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.2 }}
                    >
                      {services.map((service, index) => (
                        <motion.div 
                          key={service.id} 
                          className="flex flex-col"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.3 + index * 0.1 }}
                        >
                          {/* Service Title */}
                          <Link
                            href={service.slug ? `/services/${service.slug}` : `/services/${generateSlug(service.title)}`}
                            className="header-link-blue font-bold text-lg mb-4 font-manrope-semibold block"
                            onClick={() => setIsServicesDropdownOpen(false)}
                          >
                            {service.title}
                          </Link>
                          {/* Sub-Services List */}
                          {service.subServices && service.subServices.length > 0 && (
                            <ul className="space-y-2.5">
                              {service.subServices.map((subService, subIndex) => {
                                const serviceSlug = service.slug || generateSlug(service.title)
                                const subServiceSlug = subService.slug || generateSlug(subService.title)
                                return (
                                  <motion.li 
                                    key={subService.id}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.4 + index * 0.1 + subIndex * 0.05 }}
                                  >
                                    <Link
                                      href={`/services/${serviceSlug}/${subServiceSlug}`}
                                      className="header-link-dark font-manrope-medium text-base flex items-start group"
                                      onClick={() => setIsServicesDropdownOpen(false)}
                                    >
                                      <span className="leading-relaxed">{subService.title}</span>
                                    </Link>
                                  </motion.li>
                                )
                              })}
                            </ul>
                          )}
                        </motion.div>
                      ))}
                    </motion.div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          <Link
            href="/about"
            className={`no-underline text-lg transition-colors duration-300 font-manrope-semibold ${
            isSpecialPage
                  ? 'text-[#000F19] hover:text-[#488bf3]'
                  : isScrolled 
                    ? 'text-ncg-dark hover:text-[#488bf3]' 
                    : 'text-white'
            }`}
          >
            About Us
          </Link>
          <div 
            ref={dropdownRef}
            className="relative"
          >
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              onMouseEnter={() => setIsInsightsHovered(true)}
              onMouseLeave={() => setIsInsightsHovered(false)}
              className={`no-underline text-lg transition-colors duration-300 font-manrope-semibold flex items-center gap-1 bg-transparent border-none cursor-pointer ${
                isDropdownOpen 
                  ? 'text-[#488bf3]' 
                  : isSpecialPage
                    ? 'text-[#000F19] hover:text-[#488bf3]'
                    : isScrolled 
                      ? 'text-ncg-dark hover:text-[#488bf3]' 
                      : 'text-white'
              }`}
            >
              Insights
              <motion.div
                animate={{ y: isInsightsHovered ? 3 : 0 }}
                transition={{ duration: 0.2, ease: "easeInOut" }}
                className="inline-flex"
              >
                <svg 
                  className={`w-4 h-4 transition-transform duration-300 ${isDropdownOpen ? 'rotate-180' : ''}`}
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </motion.div>
            </button>
            {isDropdownOpen && (
              <div className="absolute top-full left-0 mt-[25px] bg-white rounded-lg overflow-hidden min-w-48 z-50">
                <Link
                  href="/case-studies"
                  prefetch={true}
                  className={`px-4 h-12 flex items-center hover:bg-[#488bf3] transition-colors duration-200 mb-px font-manrope-semibold ${
                    pathname === '/case-studies' || pathname?.startsWith('/case-studies/')
                      ? 'text-[#fff] bg-[#488bf3]'
                      : 'text-ncg-dark  hover:text-[#FFF]'
                  }`}
                  onClick={() => setIsDropdownOpen(false)}
                >
                  Case Studies
                </Link>
                <Link
                  href="/blogs"
                  prefetch={true}
                  className={`px-4 h-12 flex items-center hover:bg-[#488bf3] transition-colors duration-200 font-manrope-semibold ${
                    pathname === '/blogs' || pathname?.startsWith('/blogs/')
                      ? 'text-white bg-[#488bf3]'
                      : 'text-ncg-dark hover:text-[#FFF]'
                  }`}
                  onClick={() => setIsDropdownOpen(false)}
                >
                  Blogs
                </Link>
              </div>
            )}
          </div>
          <Link
            href="/career"
            prefetch={true}
            className={`no-underline text-lg transition-colors duration-300 font-manrope-semibold ${
              isSpecialPage
                  ? 'text-[#000F19] hover:text-[#488bf3]'
                  : isScrolled 
                    ? 'text-ncg-dark hover:text-[#488bf3]' 
                    : 'text-white'
            }`}
          >
            Career
          </Link>

          <AnimatedButton
            link="/contact"
            text="Contact Us"
            bgColor="#000F19"
            hoverBgColor="#488BF3"
            textColor="#fff"
            hoverTextColor="#fff"
            className="w-[150px]! rounded-[10px]!"
          />
        </nav>

        {/* Tablet/Mobile Right Side - Contact Button (tablet only) + Hamburger */}
        <div className="flex lg:hidden items-center gap-4">
          {/* Contact Us Button - Visible on tablet, hidden on mobile */}
          <div className="hidden md:block">
            <AnimatedButton
              link="/contact"
              text="Contact Us"
              bgColor="#000F19"
              hoverBgColor="#488BF3"
              textColor="#fff"
              hoverTextColor="#fff"
              className="w-[150px]! rounded-[10px]!"
            />
          </div>
          
          {/* Hamburger Menu Button */}
          <button
            aria-label="Toggle mobile menu"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className={`p-2 transition-colors duration-300 ${
              isSpecialPage
                ? 'text-[#000F19]'
                : isScrolled
                  ? 'text-ncg-dark'
                  : 'text-white'
            }`}
          >
            {isMobileMenuOpen ? (
              <svg
                className="w-8 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            ) : (
              <svg
                width="32"
                height="21"
                viewBox="0 0 32 21"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="w-8 h-5"
              >
                <path d="M0 1H32" stroke="currentColor" strokeWidth="2"/>
                <path d="M0 10H32" stroke="currentColor" strokeWidth="2"/>
                <path d="M0 19L32 19" stroke="currentColor" strokeWidth="2"/>
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
              onClick={() => setIsMobileMenuOpen(false)}
            />
            
            {/* Mobile Menu Drawer */}
            <motion.div
              ref={mobileMenuRef}
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 bottom-0 w-[85%] max-w-sm bg-white z-50 shadow-2xl overflow-y-auto lg:hidden"
            >
              <div className="flex flex-col h-full">
                {/* Mobile Menu Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                  <Link href="/" onClick={() => setIsMobileMenuOpen(false)}>
                    <NCGLogo strokeColor="#000F19" hoverColor="#488BF3" />
                  </Link>
                  <button
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="p-2 text-ncg-dark hover:text-[#488bf3] transition-colors"
                    aria-label="Close mobile menu"
                  >
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>

                {/* Mobile Menu Content */}
                <nav className="flex-1 px-6 py-6">
                  <div className="space-y-1">
                    {/* Services */}
                    <div>
                      <button
                        onClick={() => setIsMobileServicesOpen(!isMobileServicesOpen)}
                        className={`w-full flex items-center justify-between py-4 text-lg font-manrope-semibold text-ncg-dark transition-colors ${
                          isMobileServicesOpen ? 'text-[#488bf3]' : ''
                        }`}
                      >
                        <span>Services</span>
                        <svg
                          className={`w-5 h-5 transition-transform duration-300 ${
                            isMobileServicesOpen ? 'rotate-180' : ''
                          }`}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 9l-7 7-7-7"
                          />
                        </svg>
                      </button>
                      <AnimatePresence>
                        {isMobileServicesOpen && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className="overflow-hidden"
                          >
                            <div className="pl-4 pb-4 space-y-3">
                              {isServicesLoading ? (
                                <div className="space-y-3">
                                  {[1, 2, 3].map((index) => (
                                    <div key={index} className="space-y-2">
                                      <div className="h-5 bg-gray-200 rounded w-3/4 animate-pulse"></div>
                                      <div className="space-y-1 pl-4">
                                        {[1, 2].map((subIndex) => (
                                          <div
                                            key={subIndex}
                                            className="h-4 bg-gray-200 rounded w-full animate-pulse"
                                          ></div>
                                        ))}
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              ) : (
                                services.map((service) => (
                                  <div key={service.id} className="space-y-2">
                                    <Link
                                      href={service.slug ? `/services/${service.slug}` : `/services/${generateSlug(service.title)}`}
                                      className="block text-base font-manrope-semibold text-[#488bf3] hover:text-[#488bf3]/80 transition-colors"
                                      onClick={() => {
                                        setIsMobileServicesOpen(false)
                                        setIsMobileMenuOpen(false)
                                      }}
                                    >
                                      {service.title}
                                    </Link>
                                    {service.subServices && service.subServices.length > 0 && (
                                      <div className="pl-4 space-y-2">
                                        {service.subServices.map((subService) => {
                                          const serviceSlug = service.slug || generateSlug(service.title)
                                          const subServiceSlug = subService.slug || generateSlug(subService.title)
                                          return (
                                            <Link
                                              key={subService.id}
                                              href={`/services/${serviceSlug}/${subServiceSlug}`}
                                              className="block text-sm font-manrope-medium text-ncg-dark hover:text-[#488bf3] transition-colors"
                                              onClick={() => {
                                                setIsMobileServicesOpen(false)
                                                setIsMobileMenuOpen(false)
                                              }}
                                            >
                                              {subService.title}
                                            </Link>
                                          )
                                        })}
                                      </div>
                                    )}
                                  </div>
                                ))
                              )}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                    {/* About Us */}
                    <Link
                      href="/about"
                      className="block py-4 text-lg font-manrope-semibold text-ncg-dark hover:text-[#488bf3] transition-colors"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      About Us
                    </Link>

                    {/* Insights */}
                    <div>
                      <button
                        onClick={() => setIsMobileInsightsOpen(!isMobileInsightsOpen)}
                        className={`w-full flex items-center justify-between py-4 text-lg font-manrope-semibold text-ncg-dark transition-colors ${
                          isMobileInsightsOpen ? 'text-[#488bf3]' : ''
                        }`}
                      >
                        <span>Insights</span>
                        <svg
                          className={`w-5 h-5 transition-transform duration-300 ${
                            isMobileInsightsOpen ? 'rotate-180' : ''
                          }`}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 9l-7 7-7-7"
                          />
                        </svg>
                      </button>
                      <AnimatePresence>
                        {isMobileInsightsOpen && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className="overflow-hidden"
                          >
                            <div className="pl-4 pb-4 space-y-2">
                              <Link
                                href="/case-studies"
                                className={`block py-2 text-base font-manrope-semibold transition-colors ${
                                  pathname === '/case-studies' || pathname?.startsWith('/case-studies/')
                                    ? 'text-[#488bf3]'
                                    : 'text-ncg-dark hover:text-[#488bf3]'
                                }`}
                                onClick={() => {
                                  setIsMobileInsightsOpen(false)
                                  setIsMobileMenuOpen(false)
                                }}
                              >
                                Case Studies
                              </Link>
                              <Link
                                href="/blogs"
                                className={`block py-2 text-base font-manrope-semibold transition-colors ${
                                  pathname === '/blogs' || pathname?.startsWith('/blogs/')
                                    ? 'text-[#488bf3]'
                                    : 'text-ncg-dark hover:text-[#488bf3]'
                                }`}
                                onClick={() => {
                                  setIsMobileInsightsOpen(false)
                                  setIsMobileMenuOpen(false)
                                }}
                              >
                                Blogs
                              </Link>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                    {/* Career */}
                    <Link
                      href="/career"
                      className="block py-4 text-lg font-manrope-semibold text-ncg-dark hover:text-[#488bf3] transition-colors"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Career
                    </Link>

                    {/* Contact Us Button - Mobile */}
                    <div className="pt-4 border-t border-gray-200 mt-4">
                      <Link
                        href="/contact"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="block w-full bg-[#000F19] hover:bg-[#488BF3] text-white text-center py-3 px-6 rounded-[10px] font-manrope-semibold transition-colors duration-300"
                      >
                        Contact Us
                      </Link>
                    </div>
                  </div>
                </nav>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
    </>
  )
}

export default Header

