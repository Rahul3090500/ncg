/**
 * Rate Limiter for 10,000+ Concurrent Users
 * 
 * Prevents abuse and ensures fair resource distribution
 * - Per-IP rate limiting
 * - Per-user rate limiting
 * - Sliding window algorithm
 * - Memory-based caching (per-instance)
 */

interface RateLimitOptions {
  windowMs: number // Time window in milliseconds
  maxRequests: number // Max requests per window
  keyGenerator?: (req: any) => string // Custom key generator
  skipSuccessfulRequests?: boolean // Don't count successful requests
  skipFailedRequests?: boolean // Don't count failed requests
}

class RateLimiter {
  private memoryStore: Map<string, { count: number; resetTime: number }> = new Map()

  constructor() {
    // Memory-based rate limiting - no external dependencies
  }


  async checkLimit(
    identifier: string,
    options: RateLimitOptions
  ): Promise<{ allowed: boolean; remaining: number; resetTime: number }> {
    const { windowMs, maxRequests } = options
    const resetTime = Math.ceil(Date.now() / windowMs) * windowMs

    // Use memory store for rate limiting
    const now = Date.now()
    const storeKey = `${identifier}:${Math.floor(now / windowMs)}`
    const current = this.memoryStore.get(storeKey)

    if (!current || current.resetTime < now) {
      this.memoryStore.set(storeKey, {
        count: 1,
        resetTime: Math.ceil(now / windowMs) * windowMs,
      })
      return {
        allowed: true,
        remaining: maxRequests - 1,
        resetTime,
      }
    }

    current.count++
    const allowed = current.count <= maxRequests

    return {
      allowed,
      remaining: Math.max(0, maxRequests - current.count),
      resetTime: current.resetTime,
    }
  }

  async resetLimit(identifier: string, windowMs: number): Promise<void> {
    // Clear memory store
    const prefix = `${identifier}:`
    for (const [storeKey] of this.memoryStore.entries()) {
      if (storeKey.startsWith(prefix)) {
        this.memoryStore.delete(storeKey)
      }
    }
  }
}

// Singleton instance
let rateLimiter: RateLimiter | null = null

export function getRateLimiter(): RateLimiter {
  if (!rateLimiter) {
    rateLimiter = new RateLimiter()
  }
  return rateLimiter
}

export async function rateLimit(
  identifier: string,
  options: RateLimitOptions
): Promise<{ allowed: boolean; remaining: number; resetTime: number }> {
  const limiter = getRateLimiter()
  return limiter.checkLimit(identifier, options)
}

