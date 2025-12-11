#!/usr/bin/env node

/**
 * Migrate Data from Supabase to RDS
 * 
 * This script migrates all data from Supabase (development) to RDS (production).
 * 
 * Usage:
 *   node scripts/migrate-supabase-to-rds.mjs
 * 
 * Requirements:
 *   - SUPABASE_DATABASE_URL environment variable (Supabase connection string)
 *   - DATABASE_URI environment variable (RDS connection string)
 *   - PG_SSL_CA_BASE64 environment variable (RDS SSL certificate)
 */

import { Client } from 'pg'
import { readFileSync } from 'fs'
import { resolve } from 'path'
import { createReadStream } from 'fs'
import { pipeline } from 'stream/promises'
import { exec } from 'child_process'
import { promisify } from 'util'

const execAsync = promisify(exec)

// Colors for output
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

// Resolve SSL CA certificate for RDS
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

async function testConnection(client, name) {
  try {
    await client.query('SELECT 1')
    log(`✅ ${name} connection successful`, 'green')
    return true
  } catch (error) {
    log(`❌ ${name} connection failed: ${error.message}`, 'red')
    return false
  }
}

async function getTableList(client) {
  const result = await client.query(`
    SELECT table_name 
    FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_type = 'BASE TABLE'
    ORDER BY table_name
  `)
  return result.rows.map(row => row.table_name)
}

async function migrateTable(supabaseClient, rdsClient, tableName) {
  log(`\n📦 Migrating table: ${tableName}`, 'cyan')
  
  try {
    // Get row count
    const countResult = await supabaseClient.query(`SELECT COUNT(*) FROM "${tableName}"`)
    const rowCount = parseInt(countResult.rows[0].count)
    
    if (rowCount === 0) {
      log(`   ⏭️  Table is empty, skipping`, 'yellow')
      return { migrated: 0, skipped: true }
    }
    
    log(`   📊 Found ${rowCount} rows`, 'blue')
    
    // Get table structure
    const columnsResult = await supabaseClient.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = $1 
      ORDER BY ordinal_position
    `, [tableName])
    
    const columns = columnsResult.rows.map(row => row.column_name)
    log(`   📋 Columns: ${columns.join(', ')}`, 'blue')
    
    // Fetch data in batches
    const batchSize = 1000
    let migrated = 0
    let offset = 0
    
    while (offset < rowCount) {
      const result = await supabaseClient.query(
        `SELECT * FROM "${tableName}" ORDER BY id LIMIT $1 OFFSET $2`,
        [batchSize, offset]
      )
      
      if (result.rows.length === 0) break
      
      // Insert into RDS
      for (const row of result.rows) {
        const values = columns.map(col => row[col])
        const placeholders = values.map((_, i) => `$${i + 1}`).join(', ')
        const columnNames = columns.map(col => `"${col}"`).join(', ')
        
        try {
          await rdsClient.query(
            `INSERT INTO "${tableName}" (${columnNames}) VALUES (${placeholders}) ON CONFLICT DO NOTHING`,
            values
          )
          migrated++
        } catch (error) {
          if (!error.message.includes('duplicate key')) {
            log(`   ⚠️  Error inserting row: ${error.message}`, 'yellow')
          }
        }
      }
      
      offset += batchSize
      process.stdout.write(`   ⏳ Migrated ${Math.min(offset, rowCount)}/${rowCount} rows\r`)
    }
    
    log(`\n   ✅ Migrated ${migrated} rows`, 'green')
    return { migrated, skipped: false }
  } catch (error) {
    log(`   ❌ Error migrating table: ${error.message}`, 'red')
    return { migrated: 0, skipped: false, error: error.message }
  }
}

async function main() {
  log('='.repeat(60), 'blue')
  log('Supabase to RDS Migration Script', 'blue')
  log('='.repeat(60), 'blue')
  log('')

  // Check environment variables
  const supabaseUrl = process.env.SUPABASE_DATABASE_URL || process.env.DATABASE_URL
  const rdsUri = process.env.DATABASE_URI

  if (!supabaseUrl) {
    log('❌ SUPABASE_DATABASE_URL or DATABASE_URL not set', 'red')
    log('   Set SUPABASE_DATABASE_URL with your Supabase connection string', 'yellow')
    process.exit(1)
  }

  if (!rdsUri) {
    log('❌ DATABASE_URI not set', 'red')
    log('   Set DATABASE_URI with your RDS connection string', 'yellow')
    process.exit(1)
  }

  // Check if Supabase URL
  if (!supabaseUrl.includes('supabase')) {
    log('⚠️  Warning: DATABASE_URL does not appear to be a Supabase URL', 'yellow')
    log('   Continuing anyway...', 'yellow')
  }

  log('📋 Configuration:', 'cyan')
  log(`   Supabase: ${supabaseUrl.replace(/:[^:@]+@/, ':****@')}`, 'cyan')
  log(`   RDS: ${rdsUri.replace(/:[^:@]+@/, ':****@')}`, 'cyan')
  log('')

  // Create clients
  const supabaseClient = new Client({
    connectionString: supabaseUrl,
    ssl: { rejectUnauthorized: false },
  })

  const ca = resolveCa()
  const rdsClient = new Client({
    connectionString: rdsUri.replace(/[?&]sslmode=[^&]*/, ''),
    ssl: ca
      ? { ca, rejectUnauthorized: false }
      : { rejectUnauthorized: false },
  })

  try {
    // Connect to both databases
    log('🔌 Connecting to databases...', 'cyan')
    await supabaseClient.connect()
    await rdsClient.connect()

    // Test connections
    const supabaseOk = await testConnection(supabaseClient, 'Supabase')
    const rdsOk = await testConnection(rdsClient, 'RDS')

    if (!supabaseOk || !rdsOk) {
      log('\n❌ Connection test failed', 'red')
      process.exit(1)
    }

    // Get table list from Supabase
    log('\n📋 Getting table list from Supabase...', 'cyan')
    const tables = await getTableList(supabaseClient)
    log(`   Found ${tables.length} tables: ${tables.join(', ')}`, 'blue')

    if (tables.length === 0) {
      log('\n⚠️  No tables found in Supabase', 'yellow')
      process.exit(0)
    }

    // Confirm migration
    log('\n⚠️  This will migrate all data from Supabase to RDS', 'yellow')
    log('   Press Ctrl+C to cancel, or wait 5 seconds to continue...', 'yellow')
    await new Promise(resolve => setTimeout(resolve, 5000))

    // Migrate each table
    log('\n🚀 Starting migration...', 'cyan')
    const results = []
    
    for (const table of tables) {
      const result = await migrateTable(supabaseClient, rdsClient, table)
      results.push({ table, ...result })
    }

    // Summary
    log('\n' + '='.repeat(60), 'blue')
    log('Migration Summary', 'blue')
    log('='.repeat(60), 'blue')
    
    let totalMigrated = 0
    let successCount = 0
    
    results.forEach(({ table, migrated, skipped, error }) => {
      if (skipped) {
        log(`  ${table}: ⏭️  Skipped (empty)`, 'yellow')
      } else if (error) {
        log(`  ${table}: ❌ Failed - ${error}`, 'red')
      } else {
        log(`  ${table}: ✅ ${migrated} rows migrated`, 'green')
        totalMigrated += migrated
        successCount++
      }
    })

    log('')
    log(`✅ Successfully migrated ${successCount}/${tables.length} tables`, 'green')
    log(`📊 Total rows migrated: ${totalMigrated}`, 'green')

  } catch (error) {
    log(`\n❌ Migration failed: ${error.message}`, 'red')
    console.error(error)
    process.exit(1)
  } finally {
    await supabaseClient.end()
    await rdsClient.end()
  }
}

main().catch((error) => {
  log(`\n❌ Script error: ${error.message}`, 'red')
  console.error(error)
  process.exit(1)
})
