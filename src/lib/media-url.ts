/**
 * Media URL Utilities
 * 
 * Helper functions to normalize and transform media URLs for Next.js image optimization.
 * Converts S3 URLs to use the proxy route when needed.
 */

/**
 * Normalize media URL for Next.js Image component
 * 
 * If the URL is an S3 URL, converts it to use the proxy route (/api/media/...)
 * Otherwise returns the URL as-is
 */
export function normalizeMediaUrl(url: string | null | undefined): string {
  if (!url) return ''
  
  try {
    const urlObj = new URL(url)
    
    // Check if it's an S3 URL
    const isS3Url = 
      urlObj.hostname.includes('s3') && 
      (urlObj.hostname.includes('amazonaws.com') || urlObj.hostname.includes('s3.amazonaws.com'))
    
    if (isS3Url) {
      // Extract the key from the S3 URL
      // S3 URLs can be:
      // - https://bucket.s3.region.amazonaws.com/key
      // - https://s3.region.amazonaws.com/bucket/key
      // - https://bucket.s3.amazonaws.com/key
      
      let key = urlObj.pathname
      
      // Remove leading slash
      if (key.startsWith('/')) {
        key = key.substring(1)
      }
      
      // If using path-style URLs, remove bucket name from path
      if (urlObj.hostname.startsWith('s3.') && !urlObj.hostname.includes('.s3.')) {
        // Path-style: https://s3.region.amazonaws.com/bucket/key
        const parts = key.split('/')
        if (parts.length > 1) {
          key = parts.slice(1).join('/')
        }
      }
      
      // Use proxy route
      return `/api/media/${key}`
    }
    
    // For non-S3 URLs, check if they're already using our proxy
    if (urlObj.pathname.startsWith('/api/media/')) {
      return url
    }
    
    // Return as-is for other URLs
    return url
  } catch {
    // If URL parsing fails, return as-is
    return url
  }
}

/**
 * Check if a URL is an S3 URL
 */
export function isS3Url(url: string | null | undefined): boolean {
  if (!url) return false
  
  try {
    const urlObj = new URL(url)
    return urlObj.hostname.includes('s3') && 
           (urlObj.hostname.includes('amazonaws.com') || urlObj.hostname.includes('s3.amazonaws.com'))
  } catch {
    return false
  }
}

/**
 * Get the S3 key from a media URL
 */
export function getS3KeyFromUrl(url: string | null | undefined): string | null {
  if (!url) return null
  
  try {
    const urlObj = new URL(url)
    
    if (!isS3Url(url)) return null
    
    let key = urlObj.pathname
    
    // Remove leading slash
    if (key.startsWith('/')) {
      key = key.substring(1)
    }
    
    // Handle path-style URLs
    if (urlObj.hostname.startsWith('s3.') && !urlObj.hostname.includes('.s3.')) {
      const parts = key.split('/')
      if (parts.length > 1) {
        key = parts.slice(1).join('/')
      }
    }
    
    return key || null
  } catch {
    return null
  }
}
