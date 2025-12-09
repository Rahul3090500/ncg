#!/usr/bin/env node
/**
 * Test RDS Connection
 * 
 * Uses DATABASE_URI from .env to test AWS RDS connectivity
 * Shows database information and connection stats
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
  
  // Fallback to environment variable
  return process.env.DATABASE_URI
}

async function testConnection() {
  const uri = getDatabaseUri()
  
  if (!uri) {
    console.error('❌ DATABASE_URI not found in .env or environment variables')
    process.exit(1)
  }

  console.log('🔍 Testing RDS Connection...')
  console.log('')
  console.log('Connection Details:')
  console.log(`  URI: ${uri.replace(/:[^:@]+@/, ':****@')}`) // Hide password
  
  // Extract connection info
  const match = uri.match(/postgresql:\/\/[^:]+:[^@]+@([^:]+):(\d+)\/([^?]+)/)
  if (match) {
    console.log(`  Host: ${match[1]}`)
    console.log(`  Port: ${match[2]}`)
    console.log(`  Database: ${match[3]}`)
  }
  console.log('')

  // Resolve SSL CA certificate (same logic as payload.config.ts)
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

  const ca = resolveCa()
  // Use same SSL config as payload.config.ts
  const sslConfig = ca
    ? {
        ca,
        rejectUnauthorized: false,
        checkServerIdentity: () => undefined, // Skip hostname verification for RDS
      }
    : {
        rejectUnauthorized: false,
        checkServerIdentity: () => undefined, // Skip hostname verification for RDS
      }

  // Remove sslmode from URI if present (we handle SSL in config)
  const cleanUri = uri.replace(/[?&]sslmode=[^&]*/, '')

  const client = new Client({
    connectionString: cleanUri,
    ssl: sslConfig,
    connectionTimeoutMillis: 10000, // 10 second timeout
  })

  try {
    console.log('⏳ Connecting...')
    await client.connect()
    console.log('✅ Connection successful!')
    console.log('')

    // Get database info
    console.log('📊 Database Information:')
    const dbInfo = await client.query(`
      SELECT 
        version() as pg_version,
        current_database() as database,
        current_user as user,
        inet_server_addr() as server_ip,
        inet_server_port() as server_port
    `)
    
    const info = dbInfo.rows[0]
    console.log(`  PostgreSQL Version: ${info.pg_version.split(',')[0]}`)
    console.log(`  Database: ${info.database}`)
    console.log(`  User: ${info.user}`)
    if (info.server_ip) {
      console.log(`  Server IP: ${info.server_ip}`)
    }
    if (info.server_port) {
      console.log(`  Server Port: ${info.server_port}`)
    }
    console.log('')

    // Get connection stats
    console.log('🔌 Connection Statistics:')
    const connStats = await client.query(`
      SELECT 
        count(*) as total_connections,
        count(*) FILTER (WHERE state = 'active') as active_connections,
        count(*) FILTER (WHERE state = 'idle') as idle_connections,
        count(*) FILTER (WHERE state = 'idle in transaction') as idle_in_transaction
      FROM pg_stat_activity 
      WHERE datname = current_database()
    `)
    
    const stats = connStats.rows[0]
    console.log(`  Total Connections: ${stats.total_connections}`)
    console.log(`  Active: ${stats.active_connections}`)
    console.log(`  Idle: ${stats.idle_connections}`)
    console.log(`  Idle in Transaction: ${stats.idle_in_transaction}`)
    console.log('')

    // Get database size
    const dbSize = await client.query(`
      SELECT pg_size_pretty(pg_database_size(current_database())) as size
    `)
    console.log(`  Database Size: ${dbSize.rows[0].size}`)
    console.log('')

    // Test query performance
    console.log('⚡ Performance Test:')
    const startTime = Date.now()
    await client.query('SELECT 1')
    const queryTime = Date.now() - startTime
    console.log(`  Simple Query Latency: ${queryTime}ms`)
    console.log('')

    // Get table count
    const tableCount = await client.query(`
      SELECT count(*) as count 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `)
    console.log(`  Tables in Database: ${tableCount.rows[0].count}`)
    console.log('')

    console.log('✅ All checks passed!')
    await client.end()
    process.exit(0)

  } catch (error) {
    console.error('❌ Connection failed!')
    console.error('')
    console.error('Error Details:')
    console.error(`  Message: ${error.message}`)
    console.error(`  Code: ${error.code || 'N/A'}`)
    
    if (error.message.includes('timeout')) {
      console.error('')
      console.error('💡 Possible Issues:')
      console.error('  - Network latency (cross-continental connection)')
      console.error('  - Security group not allowing your IP')
      console.error('  - RDS instance not publicly accessible')
      console.error('  - SSL handshake timeout')
    }
    
    if (error.message.includes('ECONNREFUSED')) {
      console.error('')
      console.error('💡 Possible Issues:')
      console.error('  - Security group blocking connection')
      console.error('  - RDS instance not running')
      console.error('  - Wrong endpoint/port')
    }

    process.exit(1)
  }
}

testConnection()

