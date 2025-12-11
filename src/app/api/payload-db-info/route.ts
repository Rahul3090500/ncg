import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@/payload.config'

/**
 * Payload Database Info Endpoint
 * 
 * Shows what database Payload CMS is actually using.
 * This helps verify if Payload is using RDS or Neon.
 */

export const runtime = 'nodejs'

export async function GET() {
  try {
    // Get environment variables (what Payload sees)
    const localDbUri = process.env.LOCAL_DATABASE_URI?.trim()
    const neonDbUrl = process.env.DATABASE_URL?.trim()
    const rdsDbUri = process.env.DATABASE_URI?.trim()
    
    // Determine which database Payload would use (same logic as payload.config.ts)
    const isProduction = process.env.NODE_ENV === 'production'
    let databaseInUse = 'unknown'
    let connectionString = ''
    
    const isSupabase = neonDbUrl?.includes('supabase.com') || neonDbUrl?.includes('supabase.co')
    
    if (localDbUri && !isProduction) {
      databaseInUse = 'local'
      connectionString = localDbUri.replace(/:[^:@]+@/, ':****@') // Hide password
    } else if (neonDbUrl) {
      databaseInUse = isSupabase ? 'supabase' : 'postgres'
      connectionString = neonDbUrl.replace(/:[^:@]+@/, ':****@') // Hide password
    } else if (rdsDbUri) {
      databaseInUse = 'rds'
      connectionString = rdsDbUri.replace(/:[^:@]+@/, ':****@') // Hide password
    }
    
    // Try to get Payload instance to verify it's working
    let payloadStatus = 'not_initialized'
    let payloadError = null
    
    try {
      const payload = await getPayload({ config })
      if (payload && payload.config) {
        payloadStatus = 'initialized'
        
        // Try a simple query to verify connection
        try {
          await payload.find({ collection: 'users', limit: 1 })
          payloadStatus = 'connected'
        } catch (queryError: any) {
          payloadStatus = 'query_failed'
          payloadError = queryError.message
        }
      }
    } catch (initError: any) {
      payloadStatus = 'initialization_failed'
      payloadError = initError.message
    }
    
    // Extract host from connection string
    let host = 'unknown'
    try {
      const uri = neonDbUrl || rdsDbUri || localDbUri || ''
      const match = uri.match(/@([^:]+):/)
      if (match) {
        host = match[1]
      }
    } catch {}
    
    return NextResponse.json({
      timestamp: new Date().toISOString(),
      environment: {
        nodeEnv: process.env.NODE_ENV,
        vercel: !!process.env.VERCEL,
        vercelEnv: process.env.VERCEL_ENV || 'N/A',
      },
      environmentVariables: {
        LOCAL_DATABASE_URI: localDbUri ? 'SET' : 'NOT SET',
        DATABASE_URL: neonDbUrl ? 'SET ⚠️ (will use Neon)' : 'NOT SET ✅',
        DATABASE_URI: rdsDbUri ? 'SET ✅' : 'NOT SET',
        PG_SSL_CA_BASE64: process.env.PG_SSL_CA_BASE64 ? 'SET ✅' : 'NOT SET',
      },
      databaseConfiguration: {
        databaseInUse,
        connectionString,
        host,
        isProduction,
        priority: localDbUri && !isProduction 
          ? 'LOCAL_DATABASE_URI (local dev)'
          : neonDbUrl 
          ? `DATABASE_URL (${isSupabase ? 'Supabase' : 'PostgreSQL'}) ${isProduction ? '⚠️' : '✅'}`
          : rdsDbUri 
          ? 'DATABASE_URI (RDS) ✅'
          : 'NONE - ERROR!',
      },
      payloadStatus: {
        status: payloadStatus,
        error: payloadError,
        message: payloadStatus === 'connected' 
          ? '✅ Payload is connected and working'
          : payloadStatus === 'initialized'
          ? '⚠️ Payload initialized but query failed'
          : payloadStatus === 'initialization_failed'
          ? '❌ Payload initialization failed'
          : '❌ Payload not initialized',
      },
      recommendation: neonDbUrl && rdsDbUri
        ? `⚠️ WARNING: Both DATABASE_URL and DATABASE_URI are set. Payload will use DATABASE_URL (${isSupabase ? 'Supabase' : 'PostgreSQL'}). Delete DATABASE_URL to use RDS.`
        : databaseInUse === 'rds'
        ? '✅ Configuration is correct for RDS (Production)'
        : databaseInUse === 'supabase'
        ? '✅ Configuration is correct for Supabase (Development)'
        : '❌ No database configured',
    })
  } catch (error: any) {
    return NextResponse.json(
      {
        error: 'Failed to check Payload database configuration',
        message: error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
      },
      { status: 500 }
    )
  }
}
