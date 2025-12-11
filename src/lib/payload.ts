import { getPayloadClient as getPayloadClientWithRetry, executeWithRetry } from './payload-retry'
import { getCachedAPIResponse } from './api-cache'
import { getCacheManager } from './cache-manager'

// Use the retry-enabled Payload client
async function getPayloadClient() {
  return getPayloadClientWithRetry()
}

export async function getHomepageData() {
  return getCachedAPIResponse(
    'homepage-data',
    async () => {
      try {
        // In production, use the custom API route with caching
        if (process.env.NODE_ENV === 'production' && process.env.NEXT_PUBLIC_SERVER_URL) {
          const serverCache = getCacheManager()
          
          // Try server cache first (reduced TTL for faster updates - 5 minutes)
          const cached = await serverCache.get('homepage-data', { ttl: 300 })
          if (cached) {
            return cached
          }

          const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/homepage-read`, {
            next: { revalidate: 300 }, // Revalidate every 5 minutes
            headers: {
              'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
            },
          })
          
          if (response.ok) {
            const result = await response.json()
            if (result) {
              // Store in server cache (reduced TTL for faster updates)
              await serverCache.set('homepage-data', result, { ttl: 300 })
              return result
            }
          }
        } else {
          // In development, fetch all globals separately with caching
          const serverCache = getCacheManager()
          
          // Try server cache first
          const cached = await serverCache.get('homepage-data-dev', { ttl: 300 }) // 5 min cache in dev
          if (cached) {
            return cached
          }

          const payloadClient = await getPayloadClient()
          
          const [
            heroSection,
            servicesSection,
            trustedBySection,
            caseStudiesHeroSection,
            caseStudiesGridSection,
            testimonialsSection,
            approachSection,
            contactSection,
          ] = await Promise.all([
            payloadClient.findGlobal({ slug: 'hero-section', depth: 2 }).catch(() => null),
            // Use depth: 3 to ensure sub-services are fully populated (nested relationships)
            payloadClient.findGlobal({ slug: 'services-section', depth: 3 }).catch(() => null),
            payloadClient.findGlobal({ slug: 'trusted-by-section' }).catch(() => null),
            payloadClient.findGlobal({ slug: 'case-studies-hero' }).catch(() => null),
            payloadClient.findGlobal({ slug: 'case-studies-grid', depth: 2 }).catch(() => null),
            payloadClient.findGlobal({ slug: 'testimonials-section' }).catch(() => null),
            payloadClient.findGlobal({ slug: 'approach-section' }).catch(() => null),
            payloadClient.findGlobal({ slug: 'contact-section' }).catch(() => null),
          ])

          const result = {
            heroSection,
            servicesSection,
            trustedBySection,
            caseStudiesHeroSection,
            caseStudiesGridSection,
            testimonialsSection,
            approachSection,
            contactSection,
          }

          // Store in server cache
          await serverCache.set('homepage-data-dev', result, { ttl: 300 })
          return result
        }

        // Return empty data if no CMS data exists
        return {}
      } catch (error) {
        console.error('Error fetching homepage data:', error)
        return {}
      }
    },
    {
      ttl: 300, // 5 minutes client cache (reduced for instant updates)
      useLocalStorage: true,
      staleWhileRevalidate: true,
    }
  )
}

export async function getFooterData() {
  try {
    if (process.env.NODE_ENV === 'production' && process.env.NEXT_PUBLIC_SERVER_URL) {
      const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/footer-read`, {
        next: { revalidate: 300 }, // Cache for 5 minutes (reduced for instant updates)
      })
      if (response.ok) {
        const result = await response.json()
        if (result) return result
      }
    } else {
      const payloadClient = await getPayloadClient()
      const footerSection = await payloadClient.findGlobal({ slug: 'footer-section' }).catch(() => null)
      return { footerSection }
    }
    return {}
  } catch (error) {
    console.error('Error fetching footer data:', error)
    return {}
  }
}

export async function getCaseStudiesPageData() {
  try {
    if (process.env.NODE_ENV === 'production' && process.env.NEXT_PUBLIC_SERVER_URL) {
      const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/case-studies-read`, {
        next: { revalidate: 300 }, // Cache for 5 minutes (reduced for instant updates)
      })
      if (response.ok) {
        const result = await response.json()
        return {
          caseStudiesAll: Array.isArray(result?.caseStudiesAll?.docs) ? result.caseStudiesAll.docs : [],
          caseStudiesPageGridSection: result?.caseStudiesPageGridSection || null,
          caseStudiesPageHeroSection: result?.caseStudiesPageHeroSection || null,
          contactSection: result?.contactSection || null,
        }
      }
    } else {
      const payloadClient = await getPayloadClient()
      const [caseStudiesPage, caseStudiesAll, contactSection] = await Promise.all([
        payloadClient.findGlobal({ slug: 'case-studies-page', depth: 2 }).catch(() => null),
        payloadClient.find({ collection: 'case-studies', limit: 100, depth: 2 }).catch(() => ({ docs: [] })),
        payloadClient.findGlobal({ slug: 'contact-section' }).catch(() => null),
      ])
      return {
        caseStudiesAll: Array.isArray(caseStudiesAll?.docs) ? caseStudiesAll.docs : [],
        caseStudiesPageGridSection: caseStudiesPage?.grid || null,
        caseStudiesPageHeroSection: caseStudiesPage?.hero || null,
        contactSection: contactSection || null,
      }
    }
    return { caseStudiesAll: [], caseStudiesPageGridSection: null, caseStudiesPageHeroSection: null, contactSection: null }
  } catch (error) {
    console.error('Error fetching case studies page data:', error)
    return { caseStudiesAll: [], caseStudiesPageGridSection: null, caseStudiesPageHeroSection: null, contactSection: null }
  }
}

export async function getCaseStudyBySlug(slug: string) {
  try {
    if (process.env.NODE_ENV === 'production' && process.env.NEXT_PUBLIC_SERVER_URL) {
      const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/case-studies-read/${slug}`, {
        next: { revalidate: 300 }, // Cache for 5 minutes (reduced for instant updates)
      })
      if (response.ok) {
        const result = await response.json()
        return result || null
      }
    } else {
      const payloadClient = await getPayloadClient()
      const result = await payloadClient.find({
        collection: 'case-studies',
        where: {
          slug: {
            equals: slug,
          },
        },
        limit: 1,
        depth: 2,
      }).catch(() => ({ docs: [] }))
      return result?.docs?.[0] || null
    }
    return null
  } catch (error) {
    console.error(`Error fetching case study by slug (${slug}):`, error)
    return null
  }
}

export async function getAboutPageData() {
  try {
    if (process.env.NODE_ENV === 'production' && process.env.NEXT_PUBLIC_SERVER_URL) {
      const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/about-read`, {
        next: { revalidate: 300 }, // Cache for 5 minutes (reduced for instant updates)
      })
      if (response.ok) {
        const result = await response.json()
        return result || {}
      }
    } else {
      const payloadClient = await getPayloadClient()
      const [
        aboutHeroSection,
        aboutUsSection,
        aboutStatsSection,
        aboutMissionSection,
        aboutCoreValuesSection,
        aboutTeamSection,
        aboutCTASection,
      ] = await Promise.all([
        payloadClient.findGlobal({ slug: 'about-hero' }).catch(() => null),
        payloadClient.findGlobal({ slug: 'about-us-section' }).catch(() => null),
        payloadClient.findGlobal({ slug: 'about-stats-section' }).catch(() => null),
        payloadClient.findGlobal({ slug: 'about-mission-section' }).catch(() => null),
        payloadClient.findGlobal({ slug: 'about-core-values-section' }).catch(() => null),
        payloadClient.findGlobal({ slug: 'about-team-section' }).catch(() => null),
        payloadClient.findGlobal({ slug: 'about-cta-section' }).catch(() => null),
      ])
      return {
        aboutHeroSection,
        aboutUsSection,
        aboutStatsSection,
        aboutMissionSection,
        aboutCoreValuesSection,
        aboutTeamSection,
        aboutCTASection,
      }
    }
    return {}
  } catch (error) {
    console.error('Error fetching about page data:', error)
    return {}
  }
}

export async function getBlogsPageData() {
  try {
    if (process.env.NODE_ENV === 'production' && process.env.NEXT_PUBLIC_SERVER_URL) {
      const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/blogs-read`, {
        next: { revalidate: 300 }, // Cache for 5 minutes (reduced for instant updates)
      })
      if (response.ok) {
        const result = await response.json()
        return result || {}
      }
    } else {
      const payloadClient = await getPayloadClient()
      const [blogsPageHeroSection, blogsAll] = await Promise.all([
        payloadClient.findGlobal({ slug: 'blogs-page-hero' }).catch(() => null),
        payloadClient.find({ collection: 'blogs', limit: 100, depth: 2 }).catch(() => ({ docs: [] })),
      ])
      return { blogsPageHeroSection, blogsAll }
    }
    return {}
  } catch (error) {
    console.error('Error fetching blogs page data:', error)
    return {}
  }
}

export async function getBlogBySlug(slug: string) {
  try {
    if (process.env.NODE_ENV === 'production' && process.env.NEXT_PUBLIC_SERVER_URL) {
      const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/blogs-read/${slug}`, {
        next: { revalidate: 300 }, // Cache for 5 minutes (reduced for instant updates)
      })
      if (response.ok) {
        const result = await response.json()
        return result || null
      }
    } else {
      const payloadClient = await getPayloadClient()
      const result = await payloadClient.find({
        collection: 'blogs',
        where: {
          slug: {
            equals: slug,
          },
        },
        limit: 1,
        depth: 2,
      }).catch(() => ({ docs: [] }))
      return result?.docs?.[0] || null
    }
    return null
  } catch (error) {
    console.error(`Error fetching blog by slug (${slug}):`, error)
    return null
  }
}

export async function getJobsPageData() {
  return getCachedAPIResponse(
    'jobs-page-data',
    async () => {
      try {
        const serverCache = getCacheManager()
        const cached = await serverCache.get<any>('jobs-page-data', { ttl: 300 }) // 5 min cache (reduced for instant updates)
        if (cached) {
          // Ensure selectedJobs is always an array
          if (cached?.jobsSection && !Array.isArray(cached.jobsSection.selectedJobs)) {
            cached.jobsSection.selectedJobs = []
          }
          return cached
        }

        if (process.env.NODE_ENV === 'production' && process.env.NEXT_PUBLIC_SERVER_URL) {
          const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/jobs-read`, {
            next: { revalidate: 300 },
            headers: { 'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600' },
          })
          if (response.ok) {
            const result = await response.json()
            // Ensure jobsSection has selectedJobs array
            if (result?.jobsSection && !Array.isArray(result.jobsSection.selectedJobs)) {
              result.jobsSection.selectedJobs = []
            }
            if (result) {
              await serverCache.set('jobs-page-data', result, { ttl: 300 })
              return result
            }
          }
        } else {
          const payloadClient = await getPayloadClient()
          const jobsSection = await payloadClient.findGlobal({ slug: 'jobs-section', depth: 2 }).catch(() => null)
          // Ensure selectedJobs is always an array
          if (jobsSection && !Array.isArray(jobsSection.selectedJobs)) {
            jobsSection.selectedJobs = []
          }
          const result = { jobsSection }
          await serverCache.set('jobs-page-data', result, { ttl: 300 }) // 5 min in dev
          return result
        }
        return { jobsSection: null }
      } catch (error) {
        console.error('Error fetching jobs page data:', error)
        return { jobsSection: null }
      }
    },
    { ttl: 300, useLocalStorage: true, staleWhileRevalidate: true }
  )
}

export async function getPrivacyPolicyPageData() {
  try {
    if (process.env.NODE_ENV === 'production' && process.env.NEXT_PUBLIC_SERVER_URL) {
      const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/privacy-policy-read`, {
        next: { revalidate: 300 }, // Cache for 5 minutes (reduced for instant updates)
      })
      if (response.ok) {
        const result = await response.json()
        return result || {}
      }
    } else {
      const payloadClient = await getPayloadClient()
      const privacyPolicySection = await payloadClient.findGlobal({ slug: 'privacy-policy-section', depth: 2 }).catch(() => null)
      return { privacyPolicySection }
    }
    return {}
  } catch (error) {
    console.error('Error fetching privacy policy page data:', error)
    return {}
  }
}

// Services data fetching functions
export async function getServicesData() {
  try {
    if (process.env.NODE_ENV === 'production' && process.env.NEXT_PUBLIC_SERVER_URL) {
      const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/services-read`, {
        next: { revalidate: 300 }, // Cache for 5 minutes (reduced for instant updates)
      })
      if (response.ok) {
        const result = await response.json()
        return Array.isArray(result?.docs) ? result.docs : []
      }
    } else {
      const payloadClient = await getPayloadClient()
      const result = await payloadClient.find({ collection: 'services', limit: 100, depth: 2, sort: 'title' }).catch(() => ({ docs: [] }))
      return Array.isArray(result?.docs) ? result.docs : []
    }
    return []
  } catch (error) {
    console.error('Error fetching services data:', error)
    return []
  }
}

export async function getServiceBySlug(slug: string) {
  try {
    if (process.env.NODE_ENV === 'production' && process.env.NEXT_PUBLIC_SERVER_URL) {
      const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/services-read/${slug}`, {
        next: { revalidate: 300 }, // Cache for 5 minutes (reduced for instant updates)
      })
      if (response.ok) {
        const result = await response.json()
        if (result) {
          // Filter out broken relationships
          if (Array.isArray(result.caseStudies)) {
            result.caseStudies = result.caseStudies.filter((cs: any) => cs && cs.id)
          }
        }
        return result || null
      }
    } else {
      const payloadClient = await getPayloadClient()
      const result = await payloadClient.find({
        collection: 'services',
        where: {
          slug: {
            equals: slug,
          },
        },
        limit: 1,
        depth: 2,
      }).catch((error: any) => {
        // Only log actual errors, not null/undefined
        if (error) {
          console.error(`Error fetching service by slug (${slug}):`, error)
        }
        return { docs: [] }
      })
      
      const service = result?.docs?.[0] || null
      if (!service) {
        // Service not found - this is not an error, just log for debugging
        console.log(`Service with slug "${slug}" not found in database`)
        return null
      }
      
      // Filter out broken relationships
      if (Array.isArray(service.caseStudies)) {
        service.caseStudies = service.caseStudies.filter((cs: any) => cs && cs.id)
      }
      return service
    }
    return null
  } catch (error) {
    console.error(`Error fetching service by slug (${slug}):`, error)
    return null
  }
}

export async function getSubServicesForService(serviceSlug: string) {
  try {
    // First get the service to get its ID
    const service = await getServiceBySlug(serviceSlug)
    if (!service) return []

    if (process.env.NODE_ENV === 'production' && process.env.NEXT_PUBLIC_SERVER_URL) {
      const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/services-read/${serviceSlug}/sub-services`, {
        next: { revalidate: 300 }, // Cache for 5 minutes (reduced for instant updates)
      })
      if (response.ok) {
        const result = await response.json()
        return Array.isArray(result?.docs) ? result.docs : []
      }
    } else {
      const payloadClient = await getPayloadClient()
      const result = await payloadClient.find({
        collection: 'sub-services',
        where: {
          services: {
            contains: typeof service.id === 'number' ? service.id : service.id,
          },
        },
        limit: 100,
        depth: 2,
        sort: 'order',
      }).catch(() => ({ docs: [] }))
      return Array.isArray(result?.docs) ? result.docs : []
    }
    return []
  } catch (error) {
    console.error(`Error fetching sub-services for service (${serviceSlug}):`, error)
    return []
  }
}

export async function getSubServiceBySlug(serviceSlug: string, subServiceSlug: string) {
  try {
    // First get the service to get its ID
    const service = await getServiceBySlug(serviceSlug)
    if (!service) return null

    if (process.env.NODE_ENV === 'production' && process.env.NEXT_PUBLIC_SERVER_URL) {
      const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/services-read/${serviceSlug}/${subServiceSlug}`, {
        next: { revalidate: 300 }, // Cache for 5 minutes (reduced for instant updates)
      })
      if (response.ok) {
        const result = await response.json()
        return result || null
      }
    } else {
      const payloadClient = await getPayloadClient()
      const result = await payloadClient.find({
        collection: 'sub-services',
        where: {
          and: [
            {
              slug: {
                equals: subServiceSlug,
              },
            },
            {
              services: {
                contains: typeof service.id === 'number' ? service.id : service.id,
              },
            },
          ],
        },
        limit: 1,
        depth: 2,
      }).catch(() => ({ docs: [] }))
      return result?.docs?.[0] || null
    }
    return null
  } catch (error) {
    console.error(`Error fetching sub-service by slug (${serviceSlug}/${subServiceSlug}):`, error)
    return null
  }
}

export async function getJobBySlug(slug: string) {
  try {
    if (process.env.NODE_ENV === 'production' && process.env.NEXT_PUBLIC_SERVER_URL) {
      const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/jobs-read/${slug}`, {
        next: { revalidate: 300 }, // Cache for 5 minutes (reduced for instant updates)
      })
      if (response.ok) {
        const result = await response.json()
        return result || null
      }
    } else {
      const payloadClient = await getPayloadClient()
      const result = await payloadClient.find({
        collection: 'job-openings',
        where: {
          slug: {
            equals: slug,
          },
        },
        limit: 1,
        depth: 2,
      }).catch(() => ({ docs: [] }))
      return result?.docs?.[0] || null
    }
    return null
  } catch (error) {
    console.error(`Error fetching job by slug (${slug}):`, error)
    return null
  }
}