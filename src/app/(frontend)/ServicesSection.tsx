'use client'
import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect } from 'react'
import ArrowIcon from './components/ArrowIcon'
import AnimatedButton from './components/AnimatedButton'
import Link from 'next/link'

interface ServiceData {
  id: string | number
  title: string
  description: string
  slug?: string
  heroImage?: {
    id: number
    alt?: string
    url: string
    thumbnailURL?: string | null
    filename?: string
    mimeType?: string
    filesize?: number
    width?: number
    height?: number
  }
  heroAlt?: string
  subServices?: SubServiceData[]
}

interface SubServiceData {
  id: string | number
  title: string
  description: string
  slug?: string
  heroImage?: {
    id: number
    alt?: string
    url: string
    thumbnailURL?: string | null
    filename?: string
    mimeType?: string
    filesize?: number
    width?: number
    height?: number
  }
}

interface ServiceItem {
  service: ServiceData | string | number // Can be object or ID
  subServices?: (SubServiceData | string | number)[] // Can be array of objects or IDs
}

interface ServicesData {
  sectionTitle?: string
  services?: ServiceItem[]
}

interface ServicesSectionProps {
  servicesData: ServicesData
}

// Helper function to generate URL-friendly slugs
const generateSlug = (text: string): string => {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

const ServicesSection = ({ servicesData }: ServicesSectionProps) => {
  const [activeServiceIndex, setActiveServiceIndex] = useState<number>(0)
  // Transform services data to handle relationships (could be IDs or objects)
  const transformServices = (): ServiceData[] => {
    if (!servicesData?.services) {
      console.warn('ServicesSection: No services data found. Make sure services are added to the Services Section global in Payload admin.')
      return []
    }

    if (!Array.isArray(servicesData.services) || servicesData.services.length === 0) {
      console.warn('ServicesSection: Services array is empty. Add services in Payload admin: Globals > Services Section')
      return []
    }

    // Debug: Log raw data structure in production
    if (process.env.NODE_ENV === 'production') {
      console.log('ServicesSection: Raw servicesData structure:', {
        servicesCount: servicesData.services.length,
        firstService: servicesData.services[0] ? {
          serviceType: typeof servicesData.services[0].service,
          serviceIsObject: typeof servicesData.services[0].service === 'object',
          subServicesType: typeof servicesData.services[0].subServices,
          subServicesIsArray: Array.isArray(servicesData.services[0].subServices),
          subServicesLength: Array.isArray(servicesData.services[0].subServices) ? servicesData.services[0].subServices.length : 0,
          subServicesSample: Array.isArray(servicesData.services[0].subServices) && servicesData.services[0].subServices.length > 0
            ? {
                type: typeof servicesData.services[0].subServices[0],
                isObject: typeof servicesData.services[0].subServices[0] === 'object',
                value: servicesData.services[0].subServices[0]
              }
            : null
        } : null
      })
    }

    return servicesData.services
      .map((item, index) => {
        // Handle service - could be ID or object
        // If it's just an ID (number or string), we can't use it - relationships should be populated
        const service = typeof item.service === 'object' && item.service !== null
          ? item.service
          : null

        if (!service) {
          console.warn(`ServicesSection: Service at index ${index} is not populated. Expected object but got:`, typeof item.service, item.service)
          console.warn('This usually means the relationship was not populated. Check that depth: 2 is set when fetching the global.')
          return null
        }

        // Ensure service has required fields
        if (!service.title) {
          console.warn(`ServicesSection: Service at index ${index} is missing title:`, service)
          return null
        }

        // Transform sub-services with better debugging
        const subServicesArray = Array.isArray(item.subServices) ? item.subServices : []
        
        if (process.env.NODE_ENV === 'production' && subServicesArray.length > 0) {
          console.log(`ServicesSection: Service "${service.title}" has ${subServicesArray.length} sub-services (raw):`, 
            subServicesArray.map((sub: any) => ({
              type: typeof sub,
              isObject: typeof sub === 'object',
              id: typeof sub === 'object' ? sub?.id : sub,
              title: typeof sub === 'object' ? sub?.title : 'N/A'
            }))
          )
        }

        const transformedSubServices = subServicesArray
          .map((sub: any) => {
            const subService = typeof sub === 'object' && sub !== null ? sub : null
            
            if (!subService) {
              if (process.env.NODE_ENV === 'production') {
                console.warn(`ServicesSection: Sub-service is not an object, got:`, typeof sub, sub)
              }
              return null
            }
            
            if (!subService.title) {
              if (process.env.NODE_ENV === 'production') {
                console.warn(`ServicesSection: Sub-service missing title:`, subService)
              }
              return null
            }
            
            return {
              id: subService.id || String(subService.id),
              title: subService.title || '',
              description: subService.description || '',
              slug: subService.slug,
              heroImage: subService.heroImage,
            }
          })
          .filter(Boolean)

        if (process.env.NODE_ENV === 'production' && transformedSubServices.length > 0) {
          console.log(`ServicesSection: Service "${service.title}" transformed to ${transformedSubServices.length} sub-services:`, 
            transformedSubServices.map((s: SubServiceData | null) => s?.title || 'N/A').filter(Boolean)
          )
        }

        return {
          id: service.id || String(service.id),
          title: service.title || '',
          description: service.description || '',
          slug: service.slug,
          heroImage: service.heroImage,
          heroAlt: service.heroAlt,
          subServices: transformedSubServices,
        }
      })
      .filter(Boolean) as ServiceData[]
  }

  const services = transformServices()
  
  // Debug logging and force re-render when data changes
  useEffect(() => {
    const servicesArrayLength = servicesData?.services?.length ?? 0
    if (services.length === 0 && servicesArrayLength > 0) {
      console.error('ServicesSection: Services were filtered out. Check console for warnings above.')
      console.error('Raw servicesData:', JSON.stringify(servicesData, null, 2))
    }
    
    // Log when sub-services change for debugging
    if (services.length > 0) {
      const totalSubServices = services.reduce((sum, s) => sum + (s.subServices?.length || 0), 0)
      console.log(`ServicesSection: ${services.length} services, ${totalSubServices} total sub-services`)
    }
  }, [services, servicesData])
  
  // Reset active service index when services change
  useEffect(() => {
    if (services.length > 0 && activeServiceIndex >= services.length) {
      setActiveServiceIndex(0)
    }
  }, [services, activeServiceIndex])
  
  const currentService = services[activeServiceIndex]

  const handleServiceChange = (index: number) => {
    setActiveServiceIndex(index)
  }

  // Generate service slug for navigation
  const getServiceSlug = (service: ServiceData): string => {
    return service.slug || generateSlug(service.title)
  }

  // Generate sub-service slug for navigation
  const getSubServiceSlug = (subService: SubServiceData): string => {
    return subService.slug || generateSlug(subService.title)
  }

  return (
    <section className="bg-white relative">
      <div className="mx-auto relative">
        {/* Mobile/Tablet Header - Horizontal tabs */}
        <div className="lg:hidden bg-[#001D5C] text-white z-10">
          <div className="containersection px-4 md:px-6 pt-4 md:pt-6">
            <h3 className="text-3xl md:text-4xl lg:text-5xl font-manrope-semibold leading-tight mb-4 md:mb-6">Our Services</h3>
            <div className="flex gap-4 md:gap-6 overflow-x-auto  scrollbar-hide">
              {services.map((service, index) => (
                <motion.button
                  key={service.id}
                  onClick={() => handleServiceChange(index)}
                  className={`px-0 py-3 text-base md:text-lg font-manrope-semibold whitespace-nowrap transition-all duration-300 relative ${
                    activeServiceIndex === index
                      ? 'text-white'
                      : 'text-[#5899ff] hover:text-white'
                  }`}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                >
                  {service.title}
                  {/* Active underline */}
                  {activeServiceIndex === index && (
                    <motion.div
                      className="absolute bottom-0 left-0 right-0 h-1 bg-[#5899FF]"
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: 1 }}
                      transition={{ duration: 0.3 }}
                    />
                  )}
                </motion.button>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 containersection">
          <div className="hidden lg:block absolute z-0 inset-0 w-screen"
            style={{
              backgroundImage: "linear-gradient(to right, #001D5C 50%, #f4f7ff 50%)"
            }} />
          {/* Desktop Left Menu */}
          <div className="hidden lg:block lg:col-span-4 z-10 bg-[#001D5C] text-white p-6">
            <h3 className="text-[80px] font-manrope-semibold leading-[70px] mb-8 mt-4">Our <br /> Services</h3>
            <div className="space-y-4 pt-11">
              {services.map((service, index) => (
                <motion.div
                  key={service.id}
                  className={`pb-[16px] text-[22px] font-manrope-semibold leading-[29px] cursor-pointer transition-all duration-300 ${activeServiceIndex === index
                    ? ' border-white border-b'
                    : 'border-[#5899FF] border-b hover:border-white'
                    }`}
                  onClick={() => handleServiceChange(index)}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <h4
                    className={`font-manrope-semibold text-xl ${activeServiceIndex === index
                      ? 'text-white'
                      : 'text-[#5899ff] hover:text-white'
                      }`}
                  >
                    {service.title}
                  </h4>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Content Area */}
          <div className="lg:col-span-8 bg-[#f4f7ff] px-4 md:px-8 lg:px-[58px] py-6 md:py-8 lg:py-[61px] z-10">
            <AnimatePresence mode="wait">
              {currentService && (
                <motion.div
                  key={activeServiceIndex}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.4 }}
                  className="space-y-3 mt-6"
                >
                  {/* Service Header */}
                  <div>
                    <h3 className="text-[#000f19] text-2xl md:text-3xl lg:text-[40px] font-manrope-bold leading-tight md:leading-[29px]">
                      {currentService.title}
                    </h3>
                    <p className="w-full max-w-full md:max-w-2xl lg:w-[933px] text-[#000f19] text-base md:text-lg font-manrope-medium mt-4 leading-6">
                      {currentService.description}
                    </p>
                  </div>
                  {/* Call to Action */}
                  <div className="flex flex-col sm:flex-row gap-4">
                    <div className="mt-4">
                      <AnimatedButton width="w-36" link={`/services/${getServiceSlug(currentService)}`} text="Learn More" />
                    </div>
                  </div>

                  {/* Hero Image with Featured Service Card (Card 01 - First Sub-Service Only) */}
                  {currentService.subServices && currentService.subServices.length > 0 && (currentService.subServices[0].heroImage?.url || currentService.heroImage?.url) && (
                    <Link href={`/services/${getServiceSlug(currentService)}/${getSubServiceSlug(currentService.subServices[0])}`}>
                      <motion.div
                        className="flex flex-col md:flex-row bg-white rounded-[10px] border-[1.50px] border-[#000f19]/10 hover:border-[#000f19] group relative mt-8 md:mt-12 cursor-pointer transition-all duration-300 ease-in-out min-h-[200px] md:h-64"
                        initial={{ opacity: 0, }}
                        animate={{ opacity: 1, }}
                        transition={{ duration: 0.4, ease: 'easeOut' }}
                      >
                        {/* Hero Image */}
                        <motion.div
                          className="relative overflow-hidden rounded-t-lg md:rounded-l-lg md:rounded-t-none w-full md:w-80 h-48 md:h-full flex-shrink-0"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ duration: 0.4, delay: 0.1, ease: 'easeOut' }}
                        >
                          <img
                            src={currentService.subServices[0].heroImage?.url || currentService.heroImage?.url}
                            alt={currentService.subServices[0].heroImage?.alt || currentService.heroAlt || currentService.subServices[0].title}
                            className="w-full h-full object-cover rounded-t-lg md:rounded-l-lg md:rounded-t-none transition-transform duration-500 ease-in-out group-hover:scale-110"
                          />
                        </motion.div>

                        {/* Featured Service Card - First Sub-Service */}
                        <motion.div
                          className="h-fit flex-1 pt-4 md:pt-5 p-4 md:p-6"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.4, delay: 0.2, ease: 'easeOut' }}
                        >
                          <h5 className="text-[#000f19] text-lg md:text-[21px] font-manrope-bold leading-tight md:leading-[23px] mb-2 md:mb-3 transition-colors duration-300">
                            {currentService.subServices[0].title}
                          </h5>
                          <p className="text-[#000f19]/60 text-sm md:text-base font-manrope-medium leading-relaxed md:leading-[23px] group-hover:text-[#000f19]/80 transition-colors duration-300">
                            {currentService.subServices[0].description}
                          </p>
                        </motion.div>
                        <div className="absolute z-40 bottom-4 right-4">
                          <ArrowIcon hoverOnParent={true} />
                        </div>
                      </motion.div>
                    </Link>
                  )}

                  {/* Remaining Sub-Service Cards (Cards 02+) */}
                  {currentService.subServices && currentService.subServices.length > 1 && (
                    <motion.div
                      initial={{ opacity: 0, }}
                      animate={{ opacity: 1, }}
                      transition={{ duration: 0.4, delay: 0.3, ease: 'easeOut' }}
                      className="mt-4 md:mt-6"
                    >
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {currentService.subServices.slice(1).map((subService, index) => {
                          const serviceSlug = getServiceSlug(currentService)
                          const subServiceSlug = getSubServiceSlug(subService)
                          return (
                            <Link
                              key={subService.id || index}
                              href={`/services/${serviceSlug}/${subServiceSlug}`}
                            >
                              <motion.div
                                className="bg-white rounded-[10px] border-[1.50px] border-[#000f19]/10 hover:border-[#000f19] min-h-[200px] md:h-64 group relative p-4 md:p-5 cursor-pointer transition-all duration-300 ease-in-out"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 0.4, delay: 0.4 + index * 0.1, ease: 'easeOut' }}
                              >
                                <h5 className="text-[#000f19] text-lg md:text-[21px] font-manrope-semibold leading-tight md:leading-[23px] mb-2 md:mb-3 transition-colors duration-300">
                                  {subService.title}
                                </h5>
                                <p className="text-[#000f19]/60 text-sm md:text-base font-manrope-medium leading-relaxed md:leading-[23px] group-hover:text-[#000f19]/80 transition-colors duration-300">
                                  {subService.description}
                                </p>
                                <div className="absolute z-40 bottom-4 right-4">
                                  <ArrowIcon hoverOnParent={true} />
                                </div>
                              </motion.div>
                            </Link>
                          )
                        })}
                      </div>
                    </motion.div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  )
}

export default ServicesSection
