#!/usr/bin/env node
/**
 * RDS Health Monitor Script
 * 
 * Monitors RDS database health and automatically restarts if needed.
 * Run this as a cron job or background service.
 * 
 * Usage:
 *   node scripts/monitor-rds-health.mjs
 * 
 * Or add to cron (every 5 minutes):
 *   */5 * * * * cd /path/to/project && node scripts/monitor-rds-health.mjs
 */

import { createRequire } from 'module'
import https from 'https'
import http from 'http'

const require = createRequire(import.meta.url)

const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL || process.env.VERCEL_URL || 'http://localhost:3000'
const HEALTH_CHECK_ENDPOINT = `${SERVER_URL}/api/db-health`
const MAX_FAILURES = 3
const CHECK_INTERVAL = 60000 // 1 minute

let consecutiveFailures = 0

async function checkDatabaseHealth() {
  return new Promise((resolve, reject) => {
    const url = new URL(HEALTH_CHECK_ENDPOINT)
    const client = url.protocol === 'https:' ? https : http
    
    const req = client.get(url, (res) => {
      let data = ''
      
      res.on('data', (chunk) => {
        data += chunk
      })
      
      res.on('end', () => {
        try {
          const result = JSON.parse(data)
          if (result.ok && result.healthy) {
            resolve(result)
          } else {
            reject(new Error(result.error || 'Database unhealthy'))
          }
        } catch (error) {
          reject(new Error(`Failed to parse response: ${error.message}`))
        }
      })
    })
    
    req.on('error', (error) => {
      reject(error)
    })
    
    req.setTimeout(10000, () => {
      req.destroy()
      reject(new Error('Health check timeout'))
    })
  })
}

async function performHealthCheck() {
  try {
    const result = await checkDatabaseHealth()
    consecutiveFailures = 0
    
    console.log(`[${new Date().toISOString()}] ✅ Database health check passed`, {
      latency: result.latency,
      healthy: result.healthy,
    })
    
    return true
  } catch (error) {
    consecutiveFailures++
    
    console.error(`[${new Date().toISOString()}] ❌ Database health check failed (${consecutiveFailures}/${MAX_FAILURES}):`, {
      error: error.message,
      consecutiveFailures,
    })
    
    if (consecutiveFailures >= MAX_FAILURES) {
      console.error(`[${new Date().toISOString()}] 🚨 CRITICAL: Database has failed ${MAX_FAILURES} consecutive health checks!`)
      console.error('⚠️  Manual intervention may be required. Check your RDS instance status.')
      
      // You can add automatic recovery actions here, such as:
      // - Sending alerts
      // - Triggering AWS Lambda to restart RDS
      // - Sending notifications to monitoring services
    }
    
    return false
  }
}

async function startMonitoring() {
  console.log(`[${new Date().toISOString()}] 🔍 Starting RDS health monitoring...`)
  console.log(`Monitoring endpoint: ${HEALTH_CHECK_ENDPOINT}`)
  console.log(`Check interval: ${CHECK_INTERVAL / 1000} seconds`)
  console.log(`Max consecutive failures: ${MAX_FAILURES}`)
  console.log('---')
  
  // Perform initial check
  await performHealthCheck()
  
  // Set up periodic checks
  setInterval(async () => {
    await performHealthCheck()
  }, CHECK_INTERVAL)
}

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log('\n[${new Date().toISOString()}] 👋 Stopping health monitor...')
  process.exit(0)
})

process.on('SIGTERM', () => {
  console.log('\n[${new Date().toISOString()}] 👋 Stopping health monitor...')
  process.exit(0)
})

// Start monitoring
startMonitoring().catch((error) => {
  console.error('Fatal error in health monitor:', error)
  process.exit(1)
})

