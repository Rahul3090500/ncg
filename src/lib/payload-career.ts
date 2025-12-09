import { getPayload } from 'payload'
import config from '@/payload.config'
import { isDatabaseConnectionError } from '@/lib/build-time-helpers'

// Helper function to retry database operations with exponential backoff
async function retryDatabaseOperation<T>(
  operation: () => Promise<T>,
  operationName: string,
  maxRetries: number = 2
): Promise<T | null> {
  let lastError: any = null
  
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await operation()
    } catch (error: any) {
      lastError = error
      
      // Only retry on database connection errors
      if (isDatabaseConnectionError(error) && attempt < maxRetries) {
        const delay = Math.min((attempt + 1) * 2000, 10000) // 2s, 4s, max 10s
        console.warn(`Database query failed for ${operationName} (attempt ${attempt + 1}/${maxRetries + 1}), retrying in ${delay}ms...`)
        await new Promise(resolve => setTimeout(resolve, delay))
        continue
      }
      
      // If not a connection error or max retries reached, log and return null
      console.error(`Error fetching ${operationName}:`, error)
      return null
    }
  }
  
  console.error(`Failed to fetch ${operationName} after ${maxRetries + 1} attempts:`, lastError)
  return null
}

export async function getCareerPageData() {
  const payload = await getPayload({ config })
  
  // Fetch each section with retry logic and individual error handling to prevent page crash
  const [heroData, statsData, findPlaceData, workHereData, testimonialsData, lifeAtNCGData, spotifyData, jobOpeningsSectionData] = await Promise.all([
    retryDatabaseOperation(() => payload.findGlobal({ slug: 'career-hero' }), 'career-hero'),
    retryDatabaseOperation(() => payload.findGlobal({ slug: 'career-stats' }), 'career-stats'),
    retryDatabaseOperation(() => payload.findGlobal({ slug: 'career-find-place' }), 'career-find-place'),
    retryDatabaseOperation(() => payload.findGlobal({ slug: 'career-work-here' }), 'career-work-here'),
    retryDatabaseOperation(() => payload.findGlobal({ slug: 'career-testimonials' }), 'career-testimonials'),
    retryDatabaseOperation(() => payload.findGlobal({ slug: 'career-life-at-ncg' }), 'career-life-at-ncg'),
    retryDatabaseOperation(() => payload.findGlobal({ slug: 'career-spotify' }), 'career-spotify'),
    retryDatabaseOperation(() => payload.findGlobal({ slug: 'career-job-section', depth: 2 }), 'career-job-section'),
  ])

  return {
    careerHeroSection: heroData,
    careerStatsSection: statsData,
    careerFindPlaceSection: findPlaceData,
    careerWorkHereSection: workHereData,
    careerTestimonialsSection: testimonialsData,
    careerLifeAtNCGSection: lifeAtNCGData,
    careerSpotifySection: spotifyData,
    careerJobSection: jobOpeningsSectionData,
  }
}

