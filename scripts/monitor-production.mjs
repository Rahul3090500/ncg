#!/usr/bin/env node
/**
 * Production Monitoring Script
 * 
 * Monitors application health, performance, and availability
 * Sends alerts if issues are detected
 */

import { createRequire } from 'module'
import https from 'https'
import http from 'http'
import { exec } from 'child_process'
import { promisify } from 'util'

const require = createRequire(import.meta.url)
const execAsync = promisify(exec)

const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'
const HEALTH_ENDPOINT = `${SERVER_URL}/api/health`
const DB_HEALTH_ENDPOINT = `${SERVER_URL}/api/db-health`
const CHECK_INTERVAL = 30000 // 30 seconds
const MAX_FAILURES = 3
const MEMORY_THRESHOLD = 90 // Alert if memory usage > 90%

let consecutiveFailures = 0
let lastHealthStatus = null

async function checkHealth() {
  return new Promise((resolve, reject) => {
    const url = new URL(HEALTH_ENDPOINT)
    const client = url.protocol === 'https:' ? https : http
    
    const req = client.get(url, { timeout: 10000 }, (res) => {
      let data = ''
      
      res.on('data', (chunk) => {
        data += chunk
      })
      
      res.on('end', () => {
        try {
          const result = JSON.parse(data)
          resolve({ status: res.statusCode, data: result })
        } catch (error) {
          reject(new Error(`Failed to parse response: ${error.message}`))
        }
      })
    })
    
    req.on('error', (error) => {
      reject(error)
    })
    
    req.on('timeout', () => {
      req.destroy()
      reject(new Error('Health check timeout'))
    })
  })
}

async function checkPM2Status() {
  try {
    const { stdout } = await execAsync('pm2 jlist')
    const processes = JSON.parse(stdout)
    return processes.filter(p => p.name === 'ncg-backend')
  } catch (error) {
    console.error('Failed to check PM2 status:', error.message)
    return []
  }
}

async function performHealthCheck() {
  const timestamp = new Date().toISOString()
  
  try {
    // Check application health
    const healthResult = await checkHealth()
    const { status, data } = healthResult
    
    if (status === 200 && data.status === 'healthy') {
      consecutiveFailures = 0
      
      // Check PM2 processes
      const pm2Processes = await checkPM2Status()
      const runningInstances = pm2Processes.filter(p => p.pm2_env.status === 'online').length
      
      console.log(`[${timestamp}] ✅ Application healthy`, {
        status: data.status,
        uptime: `${Math.floor(data.uptime / 60)}m ${data.uptime % 60}s`,
        database: data.database.connected ? `✅ (${data.database.latency}ms)` : '❌',
        memory: `${data.memory.percentage}% (${data.memory.used}MB/${data.memory.total}MB)`,
        pm2Instances: `${runningInstances}/${pm2Processes.length}`,
      })
      
      // Memory warning
      if (data.memory.percentage > MEMORY_THRESHOLD) {
        console.warn(`[${timestamp}] ⚠️  HIGH MEMORY USAGE: ${data.memory.percentage}%`)
      }
      
      // Check if all PM2 instances are running
      if (runningInstances < pm2Processes.length) {
        console.warn(`[${timestamp}] ⚠️  Some PM2 instances are not running: ${runningInstances}/${pm2Processes.length}`)
      }
      
      lastHealthStatus = data
      return true
    } else {
      throw new Error(`Unhealthy status: ${data.status}`)
    }
  } catch (error) {
    consecutiveFailures++
    
    console.error(`[${timestamp}] ❌ Health check failed (${consecutiveFailures}/${MAX_FAILURES}):`, {
      error: error.message,
    })
    
    if (consecutiveFailures >= MAX_FAILURES) {
      console.error(`[${timestamp}] 🚨 CRITICAL: Application has failed ${MAX_FAILURES} consecutive health checks!`)
      console.error('⚠️  Immediate action required!')
      
      // Try to restart PM2 instances
      try {
        console.log('🔄 Attempting to restart PM2 instances...')
        await execAsync('pm2 restart ncg-backend')
        console.log('✅ PM2 restart command sent')
      } catch (restartError) {
        console.error('❌ Failed to restart PM2:', restartError.message)
      }
    }
    
    return false
  }
}

async function startMonitoring() {
  console.log(`[${new Date().toISOString()}] 🔍 Starting Production Monitoring...`)
  console.log(`Monitoring endpoint: ${HEALTH_ENDPOINT}`)
  console.log(`Check interval: ${CHECK_INTERVAL / 1000} seconds`)
  console.log(`Max consecutive failures: ${MAX_FAILURES}`)
  console.log(`Memory threshold: ${MEMORY_THRESHOLD}%`)
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
  console.log(`\n[${new Date().toISOString()}] 👋 Stopping monitor...`)
  process.exit(0)
})

process.on('SIGTERM', () => {
  console.log(`\n[${new Date().toISOString()}] 👋 Stopping monitor...`)
  process.exit(0)
})

// Start monitoring
startMonitoring().catch((error) => {
  console.error('Fatal error in production monitor:', error)
  process.exit(1)
})

