import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { rateLimit } from './lib/rate-limiter'
import { getCircuitBreaker } from './lib/circuit-breaker'

// Compression middleware
function compressResponse(response: NextResponse): NextResponse {
  // Next.js handles compression automatically, but we can add headers
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('X-Frame-Options', 'DENY')
  response.headers.set('X-XSS-Protection', '1; mode=block')
  return response
}
import { handleError } from './lib/error-handler'

/**
 * Middleware for 10,000+ concurrent users across regions
 * - Rate limiting
 * - Circuit breaker protection
 * - Error handling
 * - Health check bypass
 * - Security headers
 * - Region detection
 */

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const ip = request.ip || request.headers.get('x-forwarded-for') || 'unknown'
  const userAgent = request.headers.get('user-agent') || 'unknown'
  
  // Detect region from headers (CloudFront/ALB)
  const region = request.headers.get('cloudfront-viewer-country') || 
                 request.headers.get('x-region') || 
                 process.env.AWS_REGION || 
                 'default'


  // Check circuit breaker for API routes
  if (pathname.startsWith('/api/')) {
    const apiBreaker = getCircuitBreaker('api-requests')
    const breakerState = apiBreaker.getState()
    
    // If circuit is open, return error immediately without hitting database
    if (breakerState === 'OPEN') {
      const stats = apiBreaker.getStats()
      return NextResponse.json(
        {
          error: 'Service temporarily unavailable',
          message: 'Too many errors detected. Please try again later.',
          retryAfter: Math.ceil(stats.timeSinceStateChange / 1000),
        },
        {
          status: 503,
          headers: {
            'Retry-After': Math.ceil(stats.timeSinceStateChange / 1000).toString(),
            'X-Circuit-Breaker': 'OPEN',
          },
        }
      )
    }

    // Rate limiting for API routes
    try {
      const limitResult = await rateLimit(ip, {
        windowMs: 60000, // 1 minute
        maxRequests: 100, // 100 requests per minute per IP
      })

      if (!limitResult.allowed) {
        return NextResponse.json(
          {
            error: 'Too many requests',
            message: 'Rate limit exceeded. Please try again later.',
            resetTime: limitResult.resetTime,
          },
          {
            status: 429,
            headers: {
              'X-RateLimit-Limit': '100',
              'X-RateLimit-Remaining': limitResult.remaining.toString(),
              'X-RateLimit-Reset': limitResult.resetTime.toString(),
              'Retry-After': Math.ceil((limitResult.resetTime - Date.now()) / 1000).toString(),
            },
          }
        )
      }
    } catch (error) {
      // If rate limiting fails, handle error gracefully
      const errorHandling = handleError(error, 'rate-limiting')
      if (errorHandling.shouldLog) {
        console.error('Rate limiting error:', error)
      }
      // Allow request to proceed if rate limiting fails
    }
  }

  // Add security and performance headers
  const response = NextResponse.next()
  
  // Security headers
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('X-Frame-Options', 'DENY')
  response.headers.set('X-XSS-Protection', '1; mode=block')
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
  response.headers.set('Permissions-Policy', 'geolocation=(), microphone=(), camera=()')
  
  // Performance headers
  response.headers.set('X-DNS-Prefetch-Control', 'on')
  response.headers.set('X-Region', region)
  // Add pathname header for server components
  response.headers.set('x-pathname', pathname)
  
  // Caching headers for static assets
  if (pathname.startsWith('/_next/static') || pathname.startsWith('/images')) {
    response.headers.set('Cache-Control', 'public, max-age=31536000, immutable')
  }
  
  // CORS headers for API routes
  if (pathname.startsWith('/api/')) {
    const origin = request.headers.get('origin')
    const allowedOrigins = process.env.CORS_ORIGINS?.split(',') || []
    
    if (origin && allowedOrigins.includes(origin)) {
      response.headers.set('Access-Control-Allow-Origin', origin)
      response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
      response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization')
      response.headers.set('Access-Control-Max-Age', '86400')
    }
  }
  
  // Add Strict-Transport-Security header
  response.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains')
  
  return compressResponse(response)
}

// Configure middleware to use Node.js runtime
export const runtime = 'nodejs'

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (public directory)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
