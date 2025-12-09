/**
 * Database Connection Manager with Automatic Recovery
 * 
 * This module provides:
 * - Automatic retry logic with exponential backoff
 * - Connection health monitoring
 * - Automatic reconnection on failures
 * - Connection pool management
 */

import { Pool, PoolClient } from 'pg'
import type { PoolConfig } from 'pg'

interface RetryOptions {
  maxRetries?: number
  initialDelay?: number
  maxDelay?: number
  backoffMultiplier?: number
}

const DEFAULT_RETRY_OPTIONS: Required<RetryOptions> = {
  maxRetries: 5,
  initialDelay: 1000, // 1 second
  maxDelay: 30000, // 30 seconds
  backoffMultiplier: 2,
}

export class DatabaseConnectionManager {
  private pool: Pool | null = null
  private isHealthy: boolean = true
  private lastHealthCheck: number = 0
  private healthCheckInterval: number = 30000 // 30 seconds
  private reconnectAttempts: number = 0
  private maxReconnectAttempts: number = 10
  private config: PoolConfig
  private healthCheckTimer: NodeJS.Timeout | null = null

  constructor(config: PoolConfig) {
    // Detect serverless environment
    const isServerless = 
      process.env.AWS_LAMBDA_FUNCTION_NAME || 
      process.env.VERCEL || 
      process.env.AWS_EXECUTION_ENV ||
      process.env.AMPLIFY_ENV ||
      process.env.NEXT_RUNTIME === 'nodejs' // Next.js serverless runtime

    this.config = {
      ...config,
      // Enhanced pool configuration for resilience
      max: config.max || 5,
      min: config.min || 1, // Keep at least 1 connection alive
      idleTimeoutMillis: config.idleTimeoutMillis || 30000, // 30 seconds
      connectionTimeoutMillis: config.connectionTimeoutMillis || 10000, // 10 seconds
      // In serverless environments, allow pool to close when idle to prevent connection leaks
      // In long-running processes (EC2, PM2), keep pool alive for better performance
      allowExitOnIdle: isServerless ? true : false,
    }
    this.initializePool()
    this.startHealthCheck()
  }

  private initializePool() {
    // Close existing pool if any
    if (this.pool) {
      this.pool.end().catch(() => {})
    }

    this.pool = new Pool(this.config)

    // Handle pool errors
    this.pool.on('error', (err) => {
      console.error('Unexpected database pool error:', err)
      this.isHealthy = false
      this.handleConnectionError(err)
    })

    // Handle connection errors
    this.pool.on('connect', () => {
      this.isHealthy = true
      this.reconnectAttempts = 0
      console.log('Database connection established')
    })

    // Test initial connection
    this.testConnection()
      .then(() => {
        this.isHealthy = true
        console.log('Database connection manager initialized successfully')
      })
      .catch((err) => {
        console.error('Initial database connection test failed:', err)
        this.isHealthy = false
        this.scheduleReconnect()
      })
  }

  private async testConnection(): Promise<boolean> {
    if (!this.pool) {
      throw new Error('Pool not initialized')
    }

    try {
      const client = await this.pool.connect()
      await client.query('SELECT 1')
      client.release()
      return true
    } catch (error) {
      throw error
    }
  }

  private startHealthCheck() {
    // Disable automatic health checks in serverless environments (AWS Amplify, Vercel, etc.)
    // These environments don't maintain long-running processes, so continuous health checks
    // can cause excessive compute costs and are unnecessary
    const isServerless = 
      process.env.AWS_LAMBDA_FUNCTION_NAME || 
      process.env.VERCEL || 
      process.env.AWS_EXECUTION_ENV ||
      process.env.AMPLIFY_ENV ||
      process.env.NEXT_RUNTIME === 'nodejs' // Next.js serverless runtime
    
    if (isServerless) {
      console.log('Serverless environment detected - automatic health checks disabled')
      return
    }

    // Clear existing timer
    if (this.healthCheckTimer) {
      clearInterval(this.healthCheckTimer)
    }

    // Run health check periodically (only in non-serverless environments)
    this.healthCheckTimer = setInterval(async () => {
      const now = Date.now()
      // Only check if enough time has passed
      if (now - this.lastHealthCheck >= this.healthCheckInterval) {
        await this.performHealthCheck()
      }
    }, this.healthCheckInterval)
  }

  private async performHealthCheck(): Promise<void> {
    try {
      const isHealthy = await this.testConnection()
      this.isHealthy = isHealthy
      this.lastHealthCheck = Date.now()
      
      if (isHealthy) {
        this.reconnectAttempts = 0
      }
    } catch (error) {
      console.warn('Health check failed:', error)
      this.isHealthy = false
      this.scheduleReconnect()
    }
  }

  private handleConnectionError(error: any) {
    console.error('Database connection error:', {
      code: error?.code,
      message: error?.message,
      reconnectAttempts: this.reconnectAttempts,
    })

    // Common RDS error codes that indicate connection issues
    const recoverableErrors = [
      'ECONNREFUSED',
      'ETIMEDOUT',
      'ENOTFOUND',
      'ECONNRESET',
      '57P01', // Admin shutdown
      '57P02', // Crash shutdown
      '57P03', // Cannot connect now
      '08003', // Connection does not exist
      '08006', // Connection failure
    ]

    const errorCode = error?.code || error?.sqlState || ''
    const isRecoverable = recoverableErrors.some((code) => 
      errorCode.includes(code) || error?.message?.includes(code)
    )

    if (isRecoverable && this.reconnectAttempts < this.maxReconnectAttempts) {
      this.scheduleReconnect()
    }
  }

  private scheduleReconnect() {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.error('Max reconnection attempts reached. Manual intervention may be required.')
      return
    }

    this.reconnectAttempts++
    const delay = Math.min(
      DEFAULT_RETRY_OPTIONS.initialDelay * 
      Math.pow(DEFAULT_RETRY_OPTIONS.backoffMultiplier, this.reconnectAttempts - 1),
      DEFAULT_RETRY_OPTIONS.maxDelay
    )

    console.log(`Scheduling reconnection attempt ${this.reconnectAttempts}/${this.maxReconnectAttempts} in ${delay}ms`)

    setTimeout(() => {
      console.log(`Attempting to reconnect to database (attempt ${this.reconnectAttempts})...`)
      this.initializePool()
    }, delay)
  }

  async query<T = any>(text: string, params?: any[]): Promise<T[]> {
    return this.executeWithRetry(async () => {
      if (!this.pool) {
        throw new Error('Database pool not initialized')
      }

      const client = await this.pool.connect()
      try {
        const result = await client.query(text, params)
        return result.rows as T[]
      } finally {
        client.release()
      }
    })
  }

  async getClient(): Promise<PoolClient> {
    return this.executeWithRetry(async () => {
      if (!this.pool) {
        throw new Error('Database pool not initialized')
      }
      return await this.pool.connect()
    })
  }

  private async executeWithRetry<T>(
    operation: () => Promise<T>,
    options: RetryOptions = {}
  ): Promise<T> {
    const retryOptions = { ...DEFAULT_RETRY_OPTIONS, ...options }
    let lastError: Error | null = null

    for (let attempt = 0; attempt <= retryOptions.maxRetries; attempt++) {
      try {
        // If unhealthy, wait a bit before retrying
        if (!this.isHealthy && attempt > 0) {
          const delay = Math.min(
            retryOptions.initialDelay * Math.pow(retryOptions.backoffMultiplier, attempt - 1),
            retryOptions.maxDelay
          )
          await new Promise((resolve) => setTimeout(resolve, delay))
        }

        const result = await operation()
        
        // Success - mark as healthy
        this.isHealthy = true
        this.reconnectAttempts = 0
        return result
      } catch (error: any) {
        lastError = error as Error
        
        // Check if error is recoverable
        const errorCode = error?.code || error?.sqlState || ''
        const isRecoverable = [
          'ECONNREFUSED',
          'ETIMEDOUT',
          'ENOTFOUND',
          'ECONNRESET',
          '57P01',
          '57P02',
          '57P03',
          '08003',
          '08006',
        ].some((code) => errorCode.includes(code) || error?.message?.includes(code))

        if (!isRecoverable || attempt === retryOptions.maxRetries) {
          // Non-recoverable error or max retries reached
          this.isHealthy = false
          throw error
        }

        // Mark as unhealthy and schedule reconnect
        this.isHealthy = false
        this.handleConnectionError(error)

        // Wait before retrying
        const delay = Math.min(
          retryOptions.initialDelay * Math.pow(retryOptions.backoffMultiplier, attempt),
          retryOptions.maxDelay
        )
        
        console.warn(
          `Database operation failed (attempt ${attempt + 1}/${retryOptions.maxRetries + 1}). Retrying in ${delay}ms...`,
          error?.message
        )
        
        await new Promise((resolve) => setTimeout(resolve, delay))
      }
    }

    throw lastError || new Error('Database operation failed after all retries')
  }

  async healthCheck(): Promise<{ healthy: boolean; latency?: number; error?: string }> {
    const start = Date.now()
    try {
      await this.testConnection()
      const latency = Date.now() - start
      return { healthy: true, latency }
    } catch (error: any) {
      return {
        healthy: false,
        error: error?.message || 'Unknown error',
      }
    }
  }

  getPool(): Pool | null {
    return this.pool
  }

  async close(): Promise<void> {
    if (this.healthCheckTimer) {
      clearInterval(this.healthCheckTimer)
      this.healthCheckTimer = null
    }

    if (this.pool) {
      await this.pool.end()
      this.pool = null
    }
  }
}

// Singleton instance
let connectionManager: DatabaseConnectionManager | null = null

export function getConnectionManager(config: PoolConfig): DatabaseConnectionManager {
  if (!connectionManager) {
    connectionManager = new DatabaseConnectionManager(config)
  }
  return connectionManager
}

export function resetConnectionManager(): void {
  if (connectionManager) {
    connectionManager.close().catch(console.error)
    connectionManager = null
  }
}

