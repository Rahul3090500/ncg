/**
 * Build-time helper utilities
 * Handles graceful fallbacks during Next.js static generation
 */

/**
 * Detect if we're in build time (Next.js static generation)
 * During build, database connections may timeout, so we return empty data gracefully
 */
export function isBuildTime(): boolean {
  return (
    process.env.NEXT_PHASE === 'phase-production-build' ||
    process.env.NEXT_PHASE === 'phase-production-compile' ||
    (typeof window === 'undefined' && 
     process.env.NODE_ENV === 'production' && 
     !process.env.VERCEL &&
     !process.env.VERCEL_ENV)
  )
}

/**
 * Check if error is a database connection timeout/error
 */
export function isDatabaseConnectionError(error: any): boolean {
  const errorMessage = error?.message?.toLowerCase() || ''
  const errorCode = error?.code || ''
  const causeMessage = error?.cause?.message?.toLowerCase() || ''
  
  return (
    errorCode === '53300' ||
    errorMessage.includes('remaining connection slots') ||
    errorMessage.includes('too many connections') ||
    errorMessage.includes('connection pool') ||
    errorMessage.includes('pool') ||
    errorMessage.includes('rds_reserved') ||
    errorMessage.includes('database connection') ||
    errorMessage.includes('connection timeout') ||
    errorMessage.includes('connection terminated') ||
    errorMessage.includes('timeout exceeded') ||
    errorMessage.includes('unavailable') ||
    errorMessage.includes('exhausted') ||
    causeMessage.includes('connection timeout') ||
    causeMessage.includes('connection terminated') ||
    causeMessage.includes('terminated unexpectedly') ||
    causeMessage.includes('timeout exceeded') ||
    causeMessage.includes('pool') ||
    // Check for pg-pool specific errors
    errorMessage.includes('timeout waiting for connection') ||
    errorMessage.includes('all connection attempts failed')
  )
}

/**
 * Get build-time fallback response for collection queries
 * Returns empty collection structure that matches Payload CMS format
 */
export function getBuildTimeCollectionFallback() {
  return {
    docs: [],
    totalDocs: 0,
    limit: 100,
    totalPages: 0,
    page: 1,
    pagingCounter: 1,
    hasPrevPage: false,
    hasNextPage: false,
    prevPage: null,
    nextPage: null,
    _buildTimeFallback: true, // Flag to indicate this is build-time fallback
  }
}

/**
 * Get build-time fallback response for global queries
 * Returns null for all globals (will be fetched at runtime)
 */
export function getBuildTimeGlobalFallback() {
  return {
    _buildTimeFallback: true, // Flag to indicate this is build-time fallback
  }
}

