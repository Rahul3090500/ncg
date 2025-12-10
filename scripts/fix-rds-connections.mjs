#!/usr/bin/env node
/**
 * Fix RDS Connection Exhaustion
 * 
 * This script helps diagnose and fix RDS connection slot exhaustion
 * - Checks current connection count
 * - Kills idle connections
 * - Provides recommendations
 */

import pg from 'pg'
import { readFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import { config } from 'dotenv'

// Load environment variables
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const envPath = join(__dirname, '../.env')
config({ path: envPath })

function resolveCa() {
  const caBase64 = process.env.PG_SSL_CA_BASE64 || ''
  if (caBase64.trim()) return Buffer.from(caBase64.trim(), 'base64').toString('utf8')
  return ''
}

async function checkConnections() {
  const connectionString = process.env.DATABASE_URI
  
  if (!connectionString) {
    console.error('❌ DATABASE_URI not set')
    console.error(`   Checked .env file at: ${envPath}`)
    process.exit(1)
  }

  // Strip SSL params from connection string
  function stripSslParams(uri) {
    if (!uri) return uri
    try {
      const u = new URL(uri)
      ;['sslmode', 'sslcert', 'sslkey', 'sslrootcert'].forEach((p) => u.searchParams.delete(p))
      return u.toString()
    } catch {
      return uri
    }
  }
  
  const cleanConnectionString = stripSslParams(connectionString)
  const ca = resolveCa()
  // Always use SSL for RDS, with proper certificate handling
  const ssl = ca 
    ? { ca, rejectUnauthorized: false } 
    : { rejectUnauthorized: false } // Allow self-signed certificates

  const client = new pg.Client({
    connectionString: cleanConnectionString,
    ssl,
  })

  try {
    await client.connect()
    console.log('✅ Connected to database')

    // Get current connection count
    const result = await client.query(`
      SELECT 
        count(*) as total_connections,
        count(*) FILTER (WHERE state = 'active') as active,
        count(*) FILTER (WHERE state = 'idle') as idle,
        count(*) FILTER (WHERE state = 'idle in transaction') as idle_in_transaction
      FROM pg_stat_activity
      WHERE datname = current_database()
    `)

    const stats = result.rows[0]
    console.log('\n📊 Current Connection Stats:')
    console.log(`   Total: ${stats.total_connections}`)
    console.log(`   Active: ${stats.active}`)
    console.log(`   Idle: ${stats.idle}`)
    console.log(`   Idle in Transaction: ${stats.idle_in_transaction}`)

    // Get max connections
    const maxResult = await client.query('SHOW max_connections')
    const maxConnections = parseInt(maxResult.rows[0].max_connections)
    console.log(`\n📈 Max Connections Allowed: ${maxConnections}`)
    console.log(`   Utilization: ${Math.round((stats.total_connections / maxConnections) * 100)}%`)

    // Find idle connections older than 5 minutes
    const idleResult = await client.query(`
      SELECT 
        pid,
        usename,
        application_name,
        state,
        state_change,
        now() - state_change as idle_duration
      FROM pg_stat_activity
      WHERE datname = current_database()
        AND state = 'idle'
        AND state_change < now() - interval '5 minutes'
      ORDER BY state_change ASC
    `)

    if (idleResult.rows.length > 0) {
      console.log(`\n⚠️  Found ${idleResult.rows.length} idle connections older than 5 minutes:`)
      idleResult.rows.forEach((row, i) => {
        console.log(`   ${i + 1}. PID ${row.pid} - ${row.application_name || 'unknown'} - Idle for ${row.idle_duration}`)
      })

      console.log('\n💡 Recommendation: Kill idle connections to free up slots')
      console.log('   Run: SELECT pg_terminate_backend(pid) FROM pg_stat_activity WHERE state = \'idle\' AND state_change < now() - interval \'5 minutes\';')
    } else {
      console.log('\n✅ No stale idle connections found')
    }

    // Check for connections from this application
    const appConnections = await client.query(`
      SELECT 
        count(*) as count,
        application_name
      FROM pg_stat_activity
      WHERE datname = current_database()
        AND application_name LIKE 'ncg-payload-cms%'
      GROUP BY application_name
    `)

    if (appConnections.rows.length > 0) {
      console.log('\n🔗 Application Connections:')
      appConnections.rows.forEach((row) => {
        console.log(`   ${row.application_name}: ${row.count} connections`)
      })
    }

    await client.end()
  } catch (error) {
    console.error('❌ Error:', error.message)
    if (error.code === '53300') {
      console.error('\n💡 Connection slots exhausted!')
      console.error('   Solutions:')
      console.error('   1. Reduce PM2 instances: PM2_INSTANCES=1 npm run pm2:start')
      console.error('   2. Reduce connection pool max: Set max: 5 in payload.config.ts')
      console.error('   3. Wait for connections to timeout')
      console.error('   4. Kill idle connections manually in RDS')
    }
    process.exit(1)
  }
}

checkConnections().catch(console.error)

