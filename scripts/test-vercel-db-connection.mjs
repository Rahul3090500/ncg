#!/usr/bin/env node

/**
 * Test Database Connection on Vercel Deployment
 * Usage: node scripts/test-vercel-db-connection.mjs [url]
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

async function testEndpoint(url, name) {
  try {
    log(`\n🔍 ${name}`, 'cyan')
    log('─'.repeat(50), 'cyan')
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    })

    const status = response.status
    const data = await response.json().catch(() => ({ error: 'Invalid JSON response' }))

    if (status === 200) {
      log(`✅ Status: OK (HTTP ${status})`, 'green')
    } else {
      log(`❌ Status: Error (HTTP ${status})`, 'red')
    }

    console.log('\nResponse:')
    console.log(JSON.stringify(data, null, 2))

    return { status, data }
  } catch (error) {
    log(`❌ Request failed: ${error.message}`, 'red')
    return { status: 0, error: error.message }
  }
}

async function main() {
  log('='.repeat(50), 'blue')
  log('Testing Database Connection on Vercel', 'blue')
  log('='.repeat(50), 'blue')
  log(`Vercel URL: ${VERCEL_URL}`, 'blue')
  log('')

  // Test 1: Database Health
  const healthResult = await testEndpoint(
    `${VERCEL_URL}/api/database-health`,
    'Test 1: Database Health Check'
  )

  // Extract key info
  const dbType = healthResult.data?.database?.databaseType || 'unknown'
  const dbStatus = healthResult.data?.status || 'unknown'
  const dbConnected = healthResult.data?.database?.connectionTest?.connected || false
  const errors = healthResult.data?.errors || []

  log('\n📊 Health Check Summary:', 'yellow')
  log(`  Database Type: ${dbType}`, 'yellow')
  log(`  Status: ${dbStatus}`, 'yellow')
  log(`  Connected: ${dbConnected}`, 'yellow')
  
  if (errors.length > 0) {
    log(`  Errors: ${errors.length}`, 'red')
    errors.forEach((error, i) => {
      log(`    ${i + 1}. ${error}`, 'red')
    })
  }

  // Test 2: Connection Check (optional - may not exist)
  log(`\n🔍 Test 2: Connection Check (Optional)`, 'cyan')
  log('─'.repeat(50), 'cyan')
  try {
    const connResponse = await fetch(`${VERCEL_URL}/api/connection-check`)
    if (connResponse.ok) {
      const connData = await connResponse.json()
      log(`✅ Connection check available`, 'green')
      console.log(JSON.stringify(connData, null, 2))
    } else {
      log(`⚠️  Connection check endpoint not available (HTTP ${connResponse.status})`, 'yellow')
      log(`   This is OK - database-health endpoint provides all needed info`, 'yellow')
    }
  } catch (error) {
    log(`⚠️  Connection check endpoint not available`, 'yellow')
    log(`   This is OK - database-health endpoint provides all needed info`, 'yellow')
  }

  // Test 3: Admin Panel
  log(`\n🔍 Test 3: Admin Panel Accessibility`, 'cyan')
  log('─'.repeat(50), 'cyan')
  try {
    const adminResponse = await fetch(`${VERCEL_URL}/admin`, {
      method: 'HEAD',
      redirect: 'follow',
    })
    const adminStatus = adminResponse.status
    if (adminStatus === 200 || adminStatus === 302 || adminStatus === 307) {
      log(`✅ Admin panel is accessible (HTTP ${adminStatus})`, 'green')
    } else {
      log(`⚠️  Admin panel returned HTTP ${adminStatus}`, 'yellow')
    }
  } catch (error) {
    log(`❌ Admin panel check failed: ${error.message}`, 'red')
  }

  // Final Summary
  log('\n' + '='.repeat(50), 'blue')
  log('Final Summary', 'blue')
  log('='.repeat(50), 'blue')

  if (dbStatus === 'healthy' && dbConnected === true) {
    log('✅ Database connection is working!', 'green')
    log('✅ Your admin panel should be accessible', 'green')
    process.exit(0)
  } else if (dbStatus === 'error' || errors.length > 0) {
    log('❌ Database connection failed!', 'red')
    log('\nCommon issues:', 'yellow')
    log('1. Check RDS security group allows inbound PostgreSQL (port 5432)', 'yellow')
    log('2. Verify DATABASE_URI is set in Vercel environment variables', 'yellow')
    log('3. Verify PG_SSL_CA_BASE64 is set in Vercel', 'yellow')
    log('4. Check Vercel logs for detailed error messages', 'yellow')
    log('\nSee DATABASE_CONNECTION_TROUBLESHOOTING.md for detailed help', 'cyan')
    process.exit(1)
  } else {
    log('⚠️  Database connection status unclear', 'yellow')
    log('Check the responses above for details', 'yellow')
    process.exit(2)
  }
}

main().catch((error) => {
  log(`\n❌ Script error: ${error.message}`, 'red')
  console.error(error)
  process.exit(1)
})




