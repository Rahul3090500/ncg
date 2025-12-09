#!/usr/bin/env node
/**
 * Check Active RDS Connections
 * 
 * Shows detailed information about all active connections to AWS RDS
 */

import { Client } from 'pg'
import { readFileSync } from 'fs'
import { resolve } from 'path'

// Read DATABASE_URI from .env
function getDatabaseUri() {
  try {
    const envPath = resolve(process.cwd(), '.env')
    const envContent = readFileSync(envPath, 'utf8')
    const match = envContent.match(/^DATABASE_URI=(.+)$/m)
    if (match) {
      return match[1].trim()
    }
  } catch (err) {
    console.error('Error reading .env file:', err.message)
  }
  return process.env.DATABASE_URI
}

// Resolve SSL CA certificate
function resolveCa() {
  const caPlain = process.env.PG_SSL_CA || ''
  if (caPlain.trim()) return caPlain
  const caBase64 = process.env.PG_SSL_CA_BASE64 || ''
  if (caBase64.trim()) return Buffer.from(caBase64.trim(), 'base64').toString('utf8')
  try {
    const caPath = resolve(process.cwd(), 'infra/aws/rds-global-bundle.base64.txt')
    const caBase64 = readFileSync(caPath, 'utf8').trim()
    return Buffer.from(caBase64, 'base64').toString('utf8')
  } catch {
    return ''
  }
}

async function checkConnections() {
  const uri = getDatabaseUri()
  
  if (!uri) {
    console.error('❌ DATABASE_URI not found in .env or environment variables')
    process.exit(1)
  }

  const ca = resolveCa()
  const sslConfig = ca
    ? {
        ca,
        rejectUnauthorized: false,
        checkServerIdentity: () => undefined,
      }
    : {
        rejectUnauthorized: false,
        checkServerIdentity: () => undefined,
      }

  const cleanUri = uri.replace(/[?&]sslmode=[^&]*/, '')
  const client = new Client({
    connectionString: cleanUri,
    ssl: sslConfig,
    connectionTimeoutMillis: 10000,
  })

  try {
    await client.connect()
    
    console.log('🔍 Checking Active Connections...')
    console.log('')

    // Get all connections
    const connections = await client.query(`
      SELECT 
        pid,
        usename as username,
        application_name,
        client_addr,
        client_port,
        state,
        state_change,
        wait_event_type,
        wait_event,
        query_start,
        state_change,
        query,
        backend_start,
        xact_start
      FROM pg_stat_activity
      WHERE datname = current_database()
      ORDER BY state, backend_start DESC
    `)

    console.log(`📊 Total Connections: ${connections.rows.length}`)
    console.log('')

    // Group by state
    const byState = {}
    connections.rows.forEach(conn => {
      const state = conn.state || 'unknown'
      if (!byState[state]) byState[state] = []
      byState[state].push(conn)
    })

    // Show summary
    console.log('📈 Connection Summary by State:')
    Object.keys(byState).forEach(state => {
      console.log(`  ${state}: ${byState[state].length}`)
    })
    console.log('')

    // Show detailed connection info
    console.log('🔌 Detailed Connection Information:')
    console.log('')
    
    connections.rows.forEach((conn, index) => {
      console.log(`Connection ${index + 1}:`)
      console.log(`  PID: ${conn.pid}`)
      console.log(`  Username: ${conn.username || 'N/A'}`)
      console.log(`  Application: ${conn.application_name || 'N/A'}`)
      console.log(`  Client Address: ${conn.client_addr || 'N/A'}:${conn.client_port || 'N/A'}`)
      console.log(`  State: ${conn.state || 'N/A'}`)
      
      if (conn.wait_event_type) {
        console.log(`  Waiting: ${conn.wait_event_type} - ${conn.wait_event || 'N/A'}`)
      }
      
      if (conn.backend_start) {
        const backendAge = Math.floor((Date.now() - new Date(conn.backend_start).getTime()) / 1000)
        console.log(`  Backend Started: ${formatDuration(backendAge)} ago`)
      }
      
      if (conn.query_start) {
        const queryAge = Math.floor((Date.now() - new Date(conn.query_start).getTime()) / 1000)
        console.log(`  Query Running: ${formatDuration(queryAge)}`)
      }
      
      if (conn.xact_start) {
        const xactAge = Math.floor((Date.now() - new Date(conn.xact_start).getTime()) / 1000)
        console.log(`  Transaction Started: ${formatDuration(xactAge)} ago`)
      }
      
      if (conn.query && conn.query.trim() && conn.state === 'active') {
        const queryPreview = conn.query.length > 100 
          ? conn.query.substring(0, 100) + '...' 
          : conn.query
        console.log(`  Current Query: ${queryPreview}`)
      }
      
      console.log('')
    })

    // Show connection by application name
    console.log('📱 Connections by Application:')
    const byApp = {}
    connections.rows.forEach(conn => {
      const app = conn.application_name || 'unknown'
      if (!byApp[app]) byApp[app] = []
      byApp[app].push(conn)
    })
    
    Object.keys(byApp).forEach(app => {
      console.log(`  ${app}: ${byApp[app].length} connection(s)`)
      byApp[app].forEach(conn => {
        console.log(`    - PID ${conn.pid} (${conn.state})`)
      })
    })
    console.log('')

    // Show max connections info
    const maxConn = await client.query(`
      SELECT 
        setting as max_connections,
        (SELECT count(*) FROM pg_stat_activity WHERE datname = current_database()) as current_connections
      FROM pg_settings 
      WHERE name = 'max_connections'
    `)
    
    if (maxConn.rows[0]) {
      const max = parseInt(maxConn.rows[0].max_connections)
      const current = parseInt(maxConn.rows[0].current_connections)
      const percentage = ((current / max) * 100).toFixed(1)
      console.log('📊 Connection Limits:')
      console.log(`  Current: ${current} / ${max} (${percentage}%)`)
      console.log(`  Available: ${max - current}`)
      console.log('')
    }

    await client.end()
    process.exit(0)

  } catch (error) {
    console.error('❌ Error checking connections:', error.message)
    process.exit(1)
  }
}

function formatDuration(seconds) {
  if (seconds < 60) return `${seconds}s`
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ${seconds % 60}s`
  return `${Math.floor(seconds / 3600)}h ${Math.floor((seconds % 3600) / 60)}m`
}

checkConnections()

