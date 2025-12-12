import { getPayload } from 'payload'
import config from '@/payload.config'

export async function getCareerPageData() {
  const payload = await getPayload({ config })
  
  // Fetch each section with individual error handling to prevent page crash
  let heroData = null
  let statsData = null
  let findPlaceData = null
  let workHereData = null
  let testimonialsData = null
  // let lifeAtNCGData = null
  let spotifyData = null
  let jobOpeningsSectionData = null

  try {
    heroData = await payload.findGlobal({ slug: 'career-hero' })
  } catch (error) {
    console.error('Error fetching career-hero:', error)
  }

  try {
    statsData = await payload.findGlobal({ slug: 'career-stats' })
  } catch (error) {
    console.error('Error fetching career-stats:', error)
  }

  try {
    findPlaceData = await payload.findGlobal({ slug: 'career-find-place' })
  } catch (error) {
    console.error('Error fetching career-find-place:', error)
  }

  try {
    workHereData = await payload.findGlobal({ slug: 'career-work-here' })
  } catch (error) {
    console.error('Error fetching career-work-here:', error)
  }

  try {
    testimonialsData = await payload.findGlobal({ slug: 'career-testimonials' })
  } catch (error) {
    console.error('Error fetching career-testimonials:', error)
  }

  // try {
  //   lifeAtNCGData = await payload.findGlobal({ slug: 'career-life-at-ncg' })
  // } catch (error) {
  //   console.error('Error fetching career-life-at-ncg:', error)
  // }

  try {
    spotifyData = await payload.findGlobal({ slug: 'career-spotify' })
  } catch (error) {
    console.error('Error fetching career-spotify:', error)
  }

  try {
    jobOpeningsSectionData = await payload.findGlobal({ slug: 'career-job-section', depth: 2 })
  } catch (error) {
    console.error('Error fetching career-job-section:', error)
  }

  return {
    careerHeroSection: heroData,
    careerStatsSection: statsData,
    careerFindPlaceSection: findPlaceData,
    careerWorkHereSection: workHereData,
    careerTestimonialsSection: testimonialsData,
    // careerLifeAtNCGSection: lifeAtNCGData,
    careerSpotifySection: spotifyData,
    careerJobSection: jobOpeningsSectionData,
  }
}

