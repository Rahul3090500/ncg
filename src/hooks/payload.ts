/**
 * Payload Hooks for Cache Invalidation
 * 
 * Automatically invalidates cache when data changes in Payload CMS
 */

import type { CollectionAfterChangeHook, CollectionAfterDeleteHook } from 'payload/types'

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
        cacheKeys.push('homepage-data', 'services-data', 'api-services-read')
        break
      case 'blogs':
        cacheKeys.push('blogs-data', 'api-blogs-read')
        break
      case 'case-studies':
        cacheKeys.push('case-studies-data', 'api-case-studies-read', 'homepage-data')
        break
      case 'job-openings':
        cacheKeys.push('jobs-data', 'api-jobs-read', 'homepage-data')
        break
      default:
        // For globals, invalidate homepage cache
        cacheKeys.push('homepage-data', 'api-homepage-read')
    }
  }

  // Invalidate caches
  if (cacheKeys.length > 0 && process.env.NEXT_PUBLIC_SERVER_URL) {
    try {
      await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/cache-invalidate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ keys: cacheKeys }),
      }).catch(() => {
        // Ignore errors - cache will expire naturally
      })
    } catch {
      // Ignore errors
    }
  }
}

export const invalidateCacheAfterDelete: CollectionAfterDeleteHook = async ({
  doc,
  req,
}) => {
  // Same logic as afterChange
  return invalidateCacheAfterChange({ doc, req, operation: 'delete' } as any)
}

