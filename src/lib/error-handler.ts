/**
 * Centralized Error Handler
 * 
 * Prevents errors from crashing the application or overloading RDS
 * - Graceful error handling
 * - Error rate limiting
 * - Automatic recovery
 * - Prevents database overload
 */

interface ErrorStats {
  count: number
  lastError: number
  errors: Array<{ time: number; message: string }>
}

class ErrorHandler {
  private errorStats: Map<string, ErrorStats> = new Map()
  private maxErrorsPerMinute = 50 // Max errors per minute before throttling
  private errorWindow = 60000 // 1 minute window

  private getErrorKey(error: Error): string {
    // Group errors by type and message prefix
    const message = error.message || 'Unknown error'
    const prefix = message.substring(0, 50) // First 50 chars
    return `${error.name}:${prefix}`
  }

  private shouldThrottle(errorKey: string): boolean {
    const stats = this.errorStats.get(errorKey)
    if (!stats) return false

    const now = Date.now()
    const recentErrors = stats.errors.filter((e) => now - e.time < this.errorWindow)

    return recentErrors.length >= this.maxErrorsPerMinute
  }

  private recordError(error: Error): void {
    const errorKey = this.getErrorKey(error)
    const now = Date.now()

    if (!this.errorStats.has(errorKey)) {
      this.errorStats.set(errorKey, {
        count: 0,
        lastError: now,
        errors: [],
      })
    }

    const stats = this.errorStats.get(errorKey)!
    stats.count++
    stats.lastError = now
    stats.errors.push({ time: now, message: error.message })

    // Clean up old errors
    stats.errors = stats.errors.filter((e) => now - e.time < this.errorWindow * 2)
  }

  handleError(error: unknown, context?: string): {
    handled: boolean
    message: string
    shouldRetry: boolean
    shouldLog: boolean
  } {
    const err = error instanceof Error ? error : new Error(String(error))
    
    // Suppress non-critical S3 abort errors (client disconnections)
    if (this.isNonCriticalAbortError(err)) {
      return {
        handled: true,
        message: err.message,
        shouldRetry: false,
        shouldLog: false, // Don't log non-critical abort errors
      }
    }
    
    const errorKey = this.getErrorKey(err)

    // Record error
    this.recordError(err)

    // Check if we should throttle
    const throttled = this.shouldThrottle(errorKey)

    // Determine if error is recoverable
    const isRecoverable = this.isRecoverableError(err)
    const isDatabaseError = this.isDatabaseError(err)

    // If too many errors, don't retry and don't log excessively
    if (throttled) {
      console.warn(`Error throttling active for: ${errorKey}`)
      return {
        handled: true,
        message: 'Service temporarily unavailable due to high error rate',
        shouldRetry: false,
        shouldLog: false, // Don't spam logs
      }
    }

    // Database errors - be more careful
    if (isDatabaseError) {
      // RDS connection exhaustion - don't retry, wait for connections to free up
      if (this.isRdsConnectionExhaustion(err)) {
        return {
          handled: true,
          message: 'Database connection limit reached - please try again in a moment',
          shouldRetry: false, // Don't retry immediately - would make it worse
          shouldLog: true,
        }
      }
      
      // Other database errors - don't retry immediately
      return {
        handled: true,
        message: 'Database error - please try again later',
        shouldRetry: false,
        shouldLog: true,
      }
    }

    // Recoverable errors - can retry
    if (isRecoverable) {
      return {
        handled: false, // Let caller handle retry
        message: err.message,
        shouldRetry: true,
        shouldLog: true,
      }
    }

    // Non-recoverable errors - don't retry
    return {
      handled: true,
      message: err.message,
      shouldRetry: false,
      shouldLog: true,
    }
  }

  private isRecoverableError(error: Error): boolean {
    const recoverablePatterns = [
      'ECONNREFUSED',
      'ETIMEDOUT',
      'ENOTFOUND',
      'ECONNRESET',
      'timeout',
      'network',
    ]

    const message = error.message.toLowerCase()
    return recoverablePatterns.some((pattern) => message.includes(pattern.toLowerCase()))
  }

  private isDatabaseError(error: Error): boolean {
    const dbPatterns = [
      'database',
      'postgres',
      'connection',
      'query',
      'rds',
      'remaining connection slots',
      'rds_reserved',
      'too many connections',
      'connection pool',
      '53300', // RDS connection exhaustion error code
    ]

    const message = error.message.toLowerCase()
    const causeMessage = (error as any)?.cause?.message?.toLowerCase() || ''
    return dbPatterns.some((pattern) => 
      message.includes(pattern.toLowerCase()) ||
      causeMessage.includes(pattern.toLowerCase())
    )
  }
  
  private isRdsConnectionExhaustion(error: Error): boolean {
    const message = error.message.toLowerCase()
    const causeMessage = (error as any)?.cause?.message?.toLowerCase() || ''
    const errorCode = (error as any)?.code || (error as any)?.cause?.code || ''
    
    return (
      errorCode === '53300' ||
      message.includes('remaining connection slots') ||
      message.includes('rds_reserved') ||
      causeMessage.includes('remaining connection slots') ||
      causeMessage.includes('rds_reserved')
    )
  }

  private isNonCriticalAbortError(error: Error): boolean {
    // Suppress AbortError from S3 storage when clients disconnect
    // These are non-critical and happen when:
    // - Client navigates away before request completes
    // - Request is cancelled
    // - Connection is closed prematurely
    const isAbortError = 
      error.name === 'AbortError' ||
      error.message.toLowerCase().includes('request aborted') ||
      error.message.toLowerCase().includes('aborted')
    
    // Check if it's from S3 storage operations
    const isS3Error = 
      error.stack?.includes('storage-s3') ||
      error.stack?.includes('@smithy/node-http-handler') ||
      error.stack?.includes('S3Client')
    
    return isAbortError && (isS3Error || true) // Allow all abort errors for now
  }

  getErrorStats(): Record<string, ErrorStats> {
    const stats: Record<string, ErrorStats> = {}
    for (const [key, value] of this.errorStats.entries()) {
      stats[key] = { ...value }
    }
    return stats
  }

  resetStats(): void {
    this.errorStats.clear()
  }
}

// Singleton instance
let errorHandler: ErrorHandler | null = null

export function getErrorHandler(): ErrorHandler {
  if (!errorHandler) {
    errorHandler = new ErrorHandler()
  }
  return errorHandler
}

export function handleError(error: unknown, context?: string) {
  return getErrorHandler().handleError(error, context)
}

