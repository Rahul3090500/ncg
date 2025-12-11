#!/usr/bin/env node

/**
 * Check what database configuration Payload is actually using
 * This helps diagnose if DATABASE_URL is overriding DATABASE_URI
 */

const VERCEL_URL = process.argv[2] || 'https://ncg-beta.vercel.app'

const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
}

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`)
}

async function main() {
  log('='.repeat(60), 'blue')
  log('Checking Payload Database Configuration', 'blue')
  log('='.repeat(60), 'blue')
  log('')

  // Check database health to see what's configured
  try {
    log('🔍 Checking database health endpoint...', 'cyan')
    const healthResponse = await fetch(`${VERCEL_URL}/api/database-health`)
    const healthData = await healthResponse.json()

    log('\n📊 Database Health Check Results:', 'yellow')
    log(`  Database Type: ${healthData.database?.databaseType || 'unknown'}`, 'yellow')
    log(`  Status: ${healthData.status || 'unknown'}`, 'yellow')
    log(`  Connected: ${healthData.database?.connectionTest?.connected || false}`, 'yellow')
    log(`  Host: ${healthData.database?.connectionTest?.host || 'unknown'}`, 'yellow')

    // Check if it's using RDS or Neon
    const dbType = healthData.database?.databaseType
    const host = healthData.database?.connectionTest?.host || ''

    if (dbType === 'rds' || host.includes('rds.amazonaws.com')) {
      log('\n✅ Database is using RDS', 'green')
      log(`   Host: ${host}`, 'green')
    } else if (dbType === 'supabase' || host.includes('supabase')) {
      log('\n✅ Database is using Supabase (Development)', 'green')
      log(`   Host: ${host}`, 'green')
    } else {
      log('\n⚠️  Database type unclear', 'yellow')
      log(`   Host: ${host}`, 'yellow')
    }

    // Check for errors
    if (healthData.errors && healthData.errors.length > 0) {
      log('\n❌ Errors found:', 'red')
      healthData.errors.forEach((error, i) => {
        log(`   ${i + 1}. ${error}`, 'red')
      })
    }

    // Try to access admin API to see what Payload is using
    log('\n🔍 Checking Payload admin API...', 'cyan')
    try {
      // Try to get a simple Payload endpoint
      const adminResponse = await fetch(`${VERCEL_URL}/admin/api/users`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
        redirect: 'follow',
      })

      if (adminResponse.status === 401 || adminResponse.status === 403) {
        log('✅ Admin API is accessible (auth required)', 'green')
        log('   This means Payload is initialized', 'green')
      } else if (adminResponse.ok) {
        log('✅ Admin API is accessible', 'green')
      } else {
        log(`⚠️  Admin API returned HTTP ${adminResponse.status}`, 'yellow')
        const errorText = await adminResponse.text()
        log(`   Response: ${errorText.substring(0, 200)}`, 'yellow')
      }
    } catch (error) {
      log(`⚠️  Could not check admin API: ${error.message}`, 'yellow')
    }

    // Summary
    log('\n' + '='.repeat(60), 'blue')
    log('Summary', 'blue')
    log('='.repeat(60), 'blue')

    if (dbType === 'rds') {
      log('✅ RDS is configured and connected', 'green')
      log('\nIf admin panel still shows errors:', 'yellow')
      log('  1. Clear browser cache and cookies', 'yellow')
      log('  2. Try incognito/private window', 'yellow')
      log('  3. Check Vercel logs for Payload initialization errors', 'yellow')
    } else if (dbType === 'neon') {
      log('❌ Currently using Neon, not RDS', 'red')
      log('\nTo switch to RDS:', 'yellow')
      log('  1. Remove DATABASE_URL from Vercel environment variables', 'yellow')
      log('  2. Ensure DATABASE_URI is set', 'yellow')
      log('  3. Redeploy', 'yellow')
    } else {
      log('⚠️  Could not determine database type', 'yellow')
      log('   Check Vercel environment variables:', 'yellow')
      log('   - DATABASE_URI should be set (for RDS)', 'yellow')
      log('   - DATABASE_URL should NOT be set', 'yellow')
    }

  } catch (error) {
    log(`\n❌ Error checking database: ${error.message}`, 'red')
    console.error(error)
    process.exit(1)
  }
}

main().catch((error) => {
  log(`\n❌ Script error: ${error.message}`, 'red')
  console.error(error)
  process.exit(1)
})
