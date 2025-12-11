/**
 * Payload Hooks for Cache Invalidation
 * 
 * Automatically invalidates cache when data changes in Payload CMS
 */

import type { 
  CollectionAfterChangeHook, 
  CollectionAfterDeleteHook,
  GlobalAfterChangeHook,
} from 'payload/types'

async function invalidateCaches(cacheKeys: string[]) {
  if (cacheKeys.length === 0) return

  const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'
  
  try {
    await fetch(`${serverUrl}/api/cache-invalidate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ keys: cacheKeys }),
    }).catch(() => {
      // Ignore errors - cache will expire naturally
      console.warn('Cache invalidation failed, will expire naturally')
    })
  } catch (error) {
    // Ignore errors
    console.warn('Cache invalidation error:', error)
  }
}

export const invalidateCacheAfterChange: CollectionAfterChangeHook = async ({
  doc,
  req,
  operation,
}) => {
  // Invalidate relevant caches when data changes
  const cacheKeys: string[] = []

  // Determine which caches to invalidate based on collection
  if (req.collection?.config?.slug) {
    const collectionSlug = req.collection.config.slug

    switch (collectionSlug) {
      case 'services':
      case 'sub-services':
        cacheKeys.push('homepage-data', 'services-data', 'api-services-read', 'api-homepage-read')
        break
      case 'blogs':
        cacheKeys.push('blogs-data', 'api-blogs-read')
        break
      case 'case-studies':
        cacheKeys.push('case-studies-data', 'api-case-studies-read', 'homepage-data', 'api-homepage-read')
        break
      case 'job-openings':
        cacheKeys.push('jobs-data', 'api-jobs-read', 'homepage-data', 'api-homepage-read')
        break
      case 'media':
        // Media changes affect homepage (hero images, etc.)
        cacheKeys.push('homepage-data', 'api-homepage-read')
        break
      default:
        // For other collections, invalidate homepage cache as well
        cacheKeys.push('homepage-data', 'api-homepage-read')
    }
  }

  await invalidateCaches(cacheKeys)
}

export const invalidateCacheAfterDelete: CollectionAfterDeleteHook = async ({
  doc,
  req,
}) => {
  // Same logic as afterChange
  return invalidateCacheAfterChange({ doc, req, operation: 'delete' } as any)
}

/**
 * Global Hook: Invalidate cache when globals are updated
 * This is critical for homepage updates to show immediately
 */
export const invalidateCacheAfterGlobalChange: GlobalAfterChangeHook = async ({
  doc,
  req,
  global,
}) => {
  const cacheKeys: string[] = []

  // Determine which caches to invalidate based on global slug
  if (global?.slug) {
    const globalSlug = global.slug

    // All homepage-related globals should invalidate homepage cache
    const homepageGlobals = [
      'hero-section',
      'services-section',
      'trusted-by-section',
      'case-studies-hero',
      'case-studies-grid',
      'testimonials-section',
      'approach-section',
      'contact-section',
      'footer-section',
    ]

    if (homepageGlobals.includes(globalSlug)) {
      cacheKeys.push('homepage-data', 'api-homepage-read', 'homepage-data-dev')
    }

    // Other globals
    switch (globalSlug) {
      case 'about-hero-section':
      case 'about-us-section':
      case 'about-stats-section':
      case 'about-mission-section':
      case 'about-core-values-section':
      case 'about-team-section':
      case 'about-cta-section':
        cacheKeys.push('about-data', 'api-about-read')
        break
      case 'blogs-page-hero-section':
        cacheKeys.push('blogs-data', 'api-blogs-read')
        break
      case 'career-hero-section':
      case 'career-stats-section':
      case 'career-find-place-section':
      case 'career-work-here-section':
      case 'career-testimonials-section':
      case 'career-life-at-ncg-section':
      case 'career-spotify-section':
      case 'career-job-section':
        cacheKeys.push('career-data', 'api-career-read')
        break
    }
  }

  await invalidateCaches(cacheKeys)
  
  // Log for debugging
  if (cacheKeys.length > 0) {
    console.log(`Cache invalidated for global: ${global?.slug}`, cacheKeys)
  }
}

