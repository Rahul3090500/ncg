import { NextResponse } from 'next/server'
import { Client } from 'pg'
import { readFileSync } from 'fs'
import { resolve } from 'path'

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

export const runtime = 'nodejs'

export async function GET() {
  const startTime = Date.now()
  const healthCheck = {
    status: 'unknown',
    timestamp: new Date().toISOString(),
    environment: {
      nodeEnv: process.env.NODE_ENV,
      vercel: process.env.VERCEL ? 'true' : 'false',
      vercelEnv: process.env.VERCEL_ENV || 'N/A',
      vercelUrl: process.env.VERCEL_URL || 'N/A',
      nextRuntime: process.env.NEXT_RUNTIME || 'N/A',
    },
    database: {
      configured: !!(process.env.DATABASE_URL || process.env.DATABASE_URI),
      uriPresent: !!(process.env.DATABASE_URL || process.env.DATABASE_URI),
      databaseType: 'unknown' as 'neon' | 'rds' | 'unknown',
      sslCaPresent: !!(process.env.PG_SSL_CA || process.env.PG_SSL_CA_BASE64),
      connectionTest: null as any,
    },
    errors: [] as string[],
  }

  try {
    // Check for database connection string (priority: DATABASE_URL > DATABASE_URI)
    const neonDbUrl = process.env.DATABASE_URL?.trim()
    const rdsDbUri = process.env.DATABASE_URI?.trim()
    const dbUri = neonDbUrl || rdsDbUri
    const isNeon = !!neonDbUrl && neonDbUrl.includes('neon.tech')
    const isRds = !!rdsDbUri && !isNeon

    if (!dbUri) {
      healthCheck.status = 'error'
      healthCheck.errors.push('DATABASE_URL or DATABASE_URI not configured')
      healthCheck.database.configured = false
      return NextResponse.json(healthCheck, { status: 500 })
    }

    healthCheck.database.uriPresent = true
    healthCheck.database.databaseType = isNeon ? 'neon' : isRds ? 'rds' : 'unknown'

    // Extract connection info
    const uriMatch = dbUri.match(/postgresql:\/\/[^:]+:[^@]+@([^:]+):(\d+)\/([^?]+)/)
    if (uriMatch) {
      healthCheck.database.connectionTest = {
        host: uriMatch[1],
        port: uriMatch[2],
        database: uriMatch[3],
        type: isNeon ? 'Neon' : isRds ? 'RDS' : 'Unknown',
      }
    }

    // Test connection
    // Neon uses standard SSL, RDS requires custom CA certificate
    let sslConfig: any
    if (isNeon) {
      // Neon uses standard SSL (no custom CA needed)
      sslConfig = {
        rejectUnauthorized: false,
        checkServerIdentity: () => undefined,
      }
    } else {
      // RDS requires custom CA certificate
      const ca = resolveCa()
      sslConfig = ca
        ? {
            ca,
            rejectUnauthorized: false,
            checkServerIdentity: () => undefined,
          }
        : {
            rejectUnauthorized: false,
            checkServerIdentity: () => undefined,
          }
    }

    // For RDS, strip SSL params; for Neon, keep them
    const cleanUri = isNeon ? dbUri : dbUri.replace(/[?&]sslmode=[^&]*/, '')
    const client = new Client({
      connectionString: cleanUri,
      ssl: sslConfig,
      connectionTimeoutMillis: 10000,
    })

    try {
      const connectStart = Date.now()
      await client.connect()
      const connectTime = Date.now() - connectStart

      // Test query
      const queryStart = Date.now()
      const result = await client.query(`
        SELECT 
          version() as pg_version,
          current_database() as database,
          current_user as user,
          now() as server_time,
          (SELECT count(*) FROM pg_stat_activity WHERE datname = current_database()) as connections,
          (SELECT setting::int FROM pg_settings WHERE name = 'max_connections') as max_connections
      `)
      const queryTime = Date.now() - queryStart

      const dbInfo = result.rows[0]

      healthCheck.database.connectionTest = {
        ...healthCheck.database.connectionTest,
        connected: true,
        connectTime: `${connectTime}ms`,
        queryTime: `${queryTime}ms`,
        totalTime: `${Date.now() - startTime}ms`,
        serverInfo: {
          version: dbInfo.pg_version.split(',')[0],
          database: dbInfo.database,
          user: dbInfo.user,
          serverTime: dbInfo.server_time,
        },
        connections: {
          current: parseInt(dbInfo.connections),
          max: parseInt(dbInfo.max_connections),
          percentage: ((parseInt(dbInfo.connections) / parseInt(dbInfo.max_connections)) * 100).toFixed(1) + '%',
        },
      }

      // Test a simple write (SELECT only, no actual write)
      const writeTestStart = Date.now()
      await client.query('SELECT 1')
      const writeTestTime = Date.now() - writeTestStart
      healthCheck.database.connectionTest.writeTestTime = `${writeTestTime}ms`

      await client.end()

      healthCheck.status = 'healthy'
      healthCheck.database.configured = true

    } catch (connError: any) {
      healthCheck.status = 'error'
      healthCheck.errors.push(`Connection failed: ${connError.message}`)
      healthCheck.database.connectionTest = {
        ...healthCheck.database.connectionTest,
        connected: false,
        error: connError.message,
        errorCode: connError.code,
        totalTime: `${Date.now() - startTime}ms`,
      }

      // Try to determine error type
      if (connError.message.includes('timeout')) {
        healthCheck.errors.push('Connection timeout - possible network latency or SSL handshake issue')
      }
      if (connError.message.includes('ECONNREFUSED')) {
        healthCheck.errors.push('Connection refused - check security groups and RDS accessibility')
      }
      if (connError.message.includes('certificate')) {
        healthCheck.errors.push('SSL certificate issue - check PG_SSL_CA_BASE64 configuration')
      }
    }

  } catch (error: any) {
    healthCheck.status = 'error'
    healthCheck.errors.push(`Health check failed: ${error.message}`)
  }

  const statusCode = healthCheck.status === 'healthy' ? 200 : 500
  return NextResponse.json(healthCheck, { status: statusCode })
}

