import { NextResponse } from 'next/server'
import { Client } from 'pg'
import { readFileSync } from 'fs'
import { resolve } from 'path'

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

export const runtime = 'nodejs'

export async function GET() {
  try {
    const dbUri = process.env.DATABASE_URI?.trim()
    if (!dbUri) {
      return NextResponse.json(
        { error: 'DATABASE_URI not configured' },
        { status: 500 }
      )
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

    const cleanUri = dbUri.replace(/[?&]sslmode=[^&]*/, '')
    const client = new Client({
      connectionString: cleanUri,
      ssl: sslConfig,
      connectionTimeoutMillis: 10000,
    })

    await client.connect()

    // Get all connections
    const connections = await client.query(`
      SELECT 
        pid,
        usename as username,
        application_name,
        client_addr,
        client_port,
        state,
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

    // Get max connections
    const maxConn = await client.query(`
      SELECT 
        setting as max_connections,
        (SELECT count(*) FROM pg_stat_activity WHERE datname = current_database()) as current_connections
      FROM pg_settings 
      WHERE name = 'max_connections'
    `)

    // Format connections
    const formattedConnections = connections.rows.map(conn => {
      const backendAge = conn.backend_start 
        ? Math.floor((Date.now() - new Date(conn.backend_start).getTime()) / 1000)
        : null
      const queryAge = conn.query_start
        ? Math.floor((Date.now() - new Date(conn.query_start).getTime()) / 1000)
        : null

      return {
        pid: conn.pid,
        username: conn.username,
        application: conn.application_name || 'unknown',
        clientAddress: conn.client_addr ? `${conn.client_addr}:${conn.client_port || ''}` : 'N/A',
        state: conn.state,
        waitEvent: conn.wait_event_type ? `${conn.wait_event_type} - ${conn.wait_event || 'N/A'}` : null,
        backendAge: backendAge ? formatDuration(backendAge) : null,
        queryAge: queryAge ? formatDuration(queryAge) : null,
        currentQuery: conn.query && conn.query.trim() && conn.state === 'active'
          ? (conn.query.length > 200 ? conn.query.substring(0, 200) + '...' : conn.query)
          : null,
      }
    })

    // Group by state
    const byState: Record<string, number> = {}
    connections.rows.forEach(conn => {
      const state = conn.state || 'unknown'
      byState[state] = (byState[state] || 0) + 1
    })

    // Group by application
    const byApp: Record<string, number> = {}
    connections.rows.forEach(conn => {
      const app = conn.application_name || 'unknown'
      byApp[app] = (byApp[app] || 0) + 1
    })

    const max = parseInt(maxConn.rows[0]?.max_connections || '0')
    const current = parseInt(maxConn.rows[0]?.current_connections || '0')
    const percentage = max > 0 ? ((current / max) * 100).toFixed(1) : '0'

    await client.end()

    return NextResponse.json({
      summary: {
        total: connections.rows.length,
        byState,
        byApplication: byApp,
        limits: {
          current,
          max,
          available: max - current,
          percentage: `${percentage}%`,
        },
      },
      connections: formattedConnections,
      timestamp: new Date().toISOString(),
    })

  } catch (error: any) {
    console.error('Error checking connections:', error)
    return NextResponse.json(
      {
        error: 'Failed to check connections',
        message: error.message,
      },
      { status: 500 }
    )
  }
}

function formatDuration(seconds: number): string {
  if (seconds < 60) return `${seconds}s`
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ${seconds % 60}s`
  return `${Math.floor(seconds / 3600)}h ${Math.floor((seconds % 3600) / 60)}m`
}

