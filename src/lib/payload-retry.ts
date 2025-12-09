/**
 * Payload Client with Automatic Retry and Recovery
 * 
 * Wraps Payload client operations with automatic retry logic
 * to handle RDS connection issues gracefully.
 */

import { getPayload } from 'payload'
import config from '@/payload.config'
import { withCircuitBreaker } from './circuit-breaker'
import { handleError } from './error-handler'
import { guardPayloadInit } from './payload-connection-guard'

let payloadInstance: any = null
let initializationPromise: Promise<any> | null = null
let lastError: Error | null = null
let reconnectAttempts = 0
const MAX_RECONNECT_ATTEMPTS = 10

interface RetryOptions {
  maxRetries?: number
  delay?: number
  backoffMultiplier?: number
}

const DEFAULT_RETRY_OPTIONS: Required<RetryOptions> = {
  maxRetries: 3,
  delay: 1000,
  backoffMultiplier: 2,
}

async function initializePayload(): Promise<any> {
  if (payloadInstance) {
    // Quick validation check
    try {
      if (payloadInstance.config && payloadInstance.config.collections) {
        return payloadInstance
      }
    } catch {
      // Instance is invalid, reset it
      payloadInstance = null
    }
  }

  if (initializationPromise) {
    return initializationPromise
  }

  initializationPromise = (async () => {
    try {
      // Guard against connection exhaustion during initialization
      payloadInstance = await guardPayloadInit(async () => {
        return await getPayload({ config })
      })
      reconnectAttempts = 0
      lastError = null
      console.log('Payload client initialized successfully')
      return payloadInstance
    } catch (error) {
      lastError = error as Error
      console.error('Failed to initialize Payload client:', error)
      payloadInstance = null
      throw error
    } finally {
      initializationPromise = null
    }
  })()

  return initializationPromise
}

async function getPayloadClientWithRetry(): Promise<any> {
  // If we have a valid instance, return it
  if (payloadInstance) {
    try {
      // Quick health check - try to access a simple property
      if (payloadInstance.config) {
        return payloadInstance
      }
    } catch {
      // Instance seems invalid, reset it
      payloadInstance = null
    }
  }

  // Try to initialize
  try {
    return await initializePayload()
  } catch (error) {
    // If initialization fails, try to reconnect
    if (reconnectAttempts < MAX_RECONNECT_ATTEMPTS) {
      reconnectAttempts++
      const delay = Math.min(
        DEFAULT_RETRY_OPTIONS.delay * Math.pow(DEFAULT_RETRY_OPTIONS.backoffMultiplier, reconnectAttempts - 1),
        30000 // Max 30 seconds
      )
      
      console.log(`Payload initialization failed. Retrying in ${delay}ms (attempt ${reconnectAttempts}/${MAX_RECONNECT_ATTEMPTS})...`)
      
      await new Promise((resolve) => setTimeout(resolve, delay))
      return await initializePayload()
    }
    
    throw error
  }
}

export async function executeWithRetry<T>(
  operation: (payload: any) => Promise<T>,
  options: RetryOptions = {}
): Promise<T> {
  // Use circuit breaker to prevent cascading failures
  return withCircuitBreaker('payload-database', async () => {
    const retryOptions = { ...DEFAULT_RETRY_OPTIONS, ...options }
    let lastError: Error | null = null

    for (let attempt = 0; attempt <= retryOptions.maxRetries; attempt++) {
      try {
        const payload = await getPayloadClientWithRetry()
        const result = await operation(payload)
        
        // Success - reset error tracking
        lastError = null
        reconnectAttempts = 0
        
        return result
      } catch (error: any) {
        lastError = error as Error
        
        // Handle error through centralized error handler
        const errorHandling = handleError(error, 'payload-operation')
        
        // If error handler says don't retry, throw immediately
        if (!errorHandling.shouldRetry) {
          if (errorHandling.shouldLog) {
            console.error('Payload operation failed (non-retryable):', error?.message)
          }
          throw error
        }

        // If max retries reached, throw
        if (attempt === retryOptions.maxRetries) {
          if (errorHandling.shouldLog) {
            console.error('Payload operation failed after all retries:', error?.message)
          }
          throw error
        }

        // Reset instance on connection errors to force reconnection
        const errorCode = error?.code || error?.message || ''
        const errorMessage = error?.message || ''
        const causeError = (error as any)?.cause
        
        // Check for RDS connection exhaustion (code 53300)
        const isRdsConnectionExhaustion = 
          errorCode === '53300' ||
          errorMessage.includes('remaining connection slots') ||
          errorMessage.includes('rds_reserved') ||
          (causeError && (
            causeError.code === '53300' ||
            causeError.message?.includes('remaining connection slots') ||
            causeError.message?.includes('rds_reserved')
          ))
        
        const isConnectionError = [
          'ECONNREFUSED',
          'ETIMEDOUT',
          'ENOTFOUND',
          'ECONNRESET',
          'remaining connection slots',
          'rds_reserved',
          'connection',
          'timeout',
          '53300',
        ].some((code) => 
          errorCode.includes(code) || 
          errorMessage.toLowerCase().includes(code.toLowerCase()) ||
          (causeError && causeError.message?.toLowerCase().includes(code.toLowerCase()))
        )

        if (isConnectionError) {
          // For RDS exhaustion, wait longer before retrying to allow connections to free up
          if (isRdsConnectionExhaustion) {
            console.warn('RDS connection exhaustion detected. Waiting longer before retry...')
            // Don't reset instance immediately - wait for connections to free up
            await new Promise((resolve) => setTimeout(resolve, 5000)) // Wait 5 seconds
          } else {
            payloadInstance = null
          }
        }

        // Wait before retrying with exponential backoff
        const delay = Math.min(
          retryOptions.delay * Math.pow(retryOptions.backoffMultiplier, attempt),
          30000 // Max 30 seconds
        )

        if (errorHandling.shouldLog) {
          console.warn(
            `Payload operation failed (attempt ${attempt + 1}/${retryOptions.maxRetries + 1}). Retrying in ${delay}ms...`,
            error?.message
          )
        }

        await new Promise((resolve) => setTimeout(resolve, delay))
      }
    }

    throw lastError || new Error('Operation failed after all retries')
  })
}

export function resetPayloadClient(): void {
  payloadInstance = null
  initializationPromise = null
  reconnectAttempts = 0
  lastError = null
}

export async function getPayloadClient(): Promise<any> {
  return getPayloadClientWithRetry()
}

