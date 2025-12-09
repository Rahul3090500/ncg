/**
 * Build-time helper utilities
 * Handles graceful fallbacks during Next.js static generation
 */

/**
 * Detect if we're in build time (Next.js static generation)
 * During build, database connections may timeout, so we return empty data gracefully
 */
export function isBuildTime(): boolean {
  // Check for Next.js build phase (most reliable indicator)
  if (
    process.env.NEXT_PHASE === 'phase-production-build' ||
    process.env.NEXT_PHASE === 'phase-production-compile'
  ) {
    return true
  }
  
  // Check for Vercel build environment
  // During Vercel builds, VERCEL is always set
  // VERCEL_URL is NOT set during build, only at runtime
  if (process.env.VERCEL && !process.env.VERCEL_URL) {
    // VERCEL is set but VERCEL_URL is not = we're in build phase
    return true
  }
  
  // Check for Vercel CI environment
  if (process.env.VERCEL && process.env.CI) {
    // CI=true indicates build environment on Vercel
    return true
  }
  
  // Check for build context (Vercel sets this during builds)
  if (process.env.VERCEL_ENV === 'production' && process.env.VERCEL && !process.env.VERCEL_URL) {
    // During build, VERCEL_URL is not set yet
    return true
  }
  
  // Check for local build: if NODE_ENV is production but we're not in a runtime environment
  // During local `next build`, NODE_ENV=production but no VERCEL_URL or NEXT_PUBLIC_SERVER_URL
  if (
    typeof window === 'undefined' && 
    process.env.NODE_ENV === 'production' && 
    !process.env.VERCEL &&
    !process.env.VERCEL_URL &&
    !process.env.NEXT_PUBLIC_SERVER_URL &&
    // Additional check: if we're in a build context (no request object available)
    typeof process !== 'undefined' &&
    process.env.NEXT_RUNTIME !== 'nodejs' // During build, NEXT_RUNTIME is not set
  ) {
    return true
  }
  
  // Additional check: if NEXT_PUBLIC_SERVER_URL is not set during production build
  // This catches local builds where the server URL isn't configured
  if (
    typeof window === 'undefined' &&
    process.env.NODE_ENV === 'production' &&
    !process.env.NEXT_PUBLIC_SERVER_URL &&
    !process.env.VERCEL_URL
  ) {
    // Likely a build-time environment
    return true
  }
  
  return false
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
    errorMessage.includes('timeout exceeded when trying to connect') ||
    errorMessage.includes('unavailable') ||
    errorMessage.includes('exhausted') ||
    errorMessage.includes('failed query') ||
    causeMessage.includes('connection timeout') ||
    causeMessage.includes('connection terminated') ||
    causeMessage.includes('terminated unexpectedly') ||
    causeMessage.includes('timeout exceeded') ||
    causeMessage.includes('timeout exceeded when trying to connect') ||
    causeMessage.includes('pool') ||
    // Check for pg-pool specific errors
    errorMessage.includes('timeout waiting for connection') ||
    errorMessage.includes('all connection attempts failed') ||
    errorMessage.includes('ETIMEDOUT') ||
    errorMessage.includes('ECONNREFUSED')
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

/**
 * Check if error is Payload's generic "Something went wrong" error
 * This usually indicates a database connection issue
 */
export function isPayloadGenericError(error: any): boolean {
  const errorMessage = error?.message || ''
  const errorResponse = error?.response || error?.data || {}
  
  return (
    errorMessage.includes('Something went wrong') ||
    errorResponse?.errors?.some((e: any) => e?.message?.includes('Something went wrong')) ||
    errorResponse?.message?.includes('Something went wrong') ||
    (typeof errorResponse === 'string' && errorResponse.includes('Something went wrong'))
  )
}

