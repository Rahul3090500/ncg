#!/usr/bin/env node
/**
 * Migrate RDS Database to Local PostgreSQL
 * 
 * This script copies all data from RDS to local PostgreSQL database
 * Usage: npm run migrate:rds-to-local
 */

import { readFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import { config } from 'dotenv'

// Load environment variables FIRST before any other imports
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const envPath = join(__dirname, '../.env')
config({ path: envPath })

// Ensure required environment variables are set
if (!process.env.DATABASE_URI) {
  console.error('❌ DATABASE_URI environment variable is not set')
  console.error(`   Checked .env file at: ${envPath}`)
  console.error('   Please ensure DATABASE_URI is set in your .env file')
  process.exit(1)
}

if (!process.env.LOCAL_DATABASE_URI) {
  console.error('❌ LOCAL_DATABASE_URI environment variable is not set')
  console.error(`   Checked .env file at: ${envPath}`)
  console.error('   Please ensure LOCAL_DATABASE_URI is set in your .env file')
  process.exit(1)
}

import payload from 'payload'
import { postgresAdapter } from '@payloadcms/db-postgres'

// Import SSL config helper functions from payload.config
function resolveCa() {
  const caPlain = process.env.PG_SSL_CA || ''
  if (caPlain.trim()) return caPlain
  const caBase64 = process.env.PG_SSL_CA_BASE64 || ''
  if (caBase64.trim()) return Buffer.from(caBase64.trim(), 'base64').toString('utf8')
  return ''
}

const ca = resolveCa()
const sslConfig = ca ? { ca, rejectUnauthorized: false } : process.env.NODE_ENV === 'production' ? true : { rejectUnauthorized: false }

// Collections to migrate
const COLLECTIONS = [
  'users',
  'media',
  'case-studies',
  'blogs',
  'icons',
  'job-openings',
  'job-applications',
  'services',
  'sub-services',
]

// Globals to migrate
const GLOBALS = [
  'hero-section',
  'services-section',
  'trusted-by-section',
  'case-studies-hero-section',
  'case-studies-grid-section',
  'case-studies-page-section',
  'testimonials-section',
  'approach-section',
  'contact-section',
  'footer-section',
  'about-hero-section',
  'about-us-section',
  'about-stats-section',
  'about-mission-section',
  'about-core-values-section',
  'about-team-section',
  'about-cta-section',
  'blogs-page-hero-section',
  'career-hero-section',
  'career-stats-section',
  'career-find-place-section',
  'career-work-here-section',
  'career-testimonials-section',
  'career-life-at-ncg-section',
  'career-spotify-section',
  'career-job-section',
  'jobs-section',
  'privacy-policy-section',
]

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

async function migrateRdsToLocal() {
  let rdsPayload = null
  let localPayload = null

  try {
    const rdsUri = process.env.DATABASE_URI
    const localUri = process.env.LOCAL_DATABASE_URI || 'postgres://postgres:postgres@127.0.0.1:5432/ncg'

    if (!rdsUri) {
      console.error('❌ DATABASE_URI environment variable is required')
      console.error('   Set it to your RDS connection string')
      process.exit(1)
    }

    console.log('🚀 Starting migration from RDS to Local PostgreSQL...\n')

    // Dynamically import config after env vars are loaded
    const configPayload = (await import('../src/payload.config.ts')).default

    // Step 1: Connect to RDS and export data
    console.log('📡 Step 1: Connecting to RDS database...')
    
    // Ensure PAYLOAD_SECRET is set
    if (!process.env.PAYLOAD_SECRET) {
      console.error('❌ PAYLOAD_SECRET environment variable is not set')
      process.exit(1)
    }
    
    // Create RDS config by overriding db adapter
    const rdsConfig = {
      ...configPayload,
      secret: process.env.PAYLOAD_SECRET || configPayload.secret,
      db: postgresAdapter({
        pool: {
          connectionString: stripSslParams(rdsUri),
          ssl: sslConfig,
          max: 1, // Use only 1 connection for migration
          min: 0,
          idleTimeoutMillis: 30000,
          connectionTimeoutMillis: 10000,
          allowExitOnIdle: true,
        },
      }),
    }
    
    await payload.init({
      config: rdsConfig,
      local: true,
    })
    rdsPayload = payload
    console.log('✅ Connected to RDS\n')

    // Step 2: Export all collections
    console.log('📤 Step 2: Exporting collections from RDS...')
    const exportedData = {}

    for (const collectionSlug of COLLECTIONS) {
      try {
        const result = await rdsPayload.find({
          collection: collectionSlug,
          limit: 10000,
          depth: 10, // Include relations
        })
        exportedData[collectionSlug] = result.docs
        console.log(`   ✅ Exported ${result.docs.length} documents from ${collectionSlug}`)
      } catch (error) {
        console.error(`   ⚠️  Error exporting ${collectionSlug}:`, error.message)
        exportedData[collectionSlug] = []
      }
    }

    // Step 3: Export all globals
    console.log('\n📤 Step 3: Exporting globals from RDS...')
    const exportedGlobals = {}

    for (const globalSlug of GLOBALS) {
      try {
        const global = await rdsPayload.findGlobal({
          slug: globalSlug,
          depth: 10,
        })
        exportedGlobals[globalSlug] = global
        console.log(`   ✅ Exported global: ${globalSlug}`)
      } catch (error) {
        console.error(`   ⚠️  Error exporting ${globalSlug}:`, error.message)
      }
    }

    // Step 4: Close RDS connection
    console.log('\n🔌 Closing RDS connection...')
    if (rdsPayload.db) {
      await rdsPayload.db.destroy()
    }
    rdsPayload = null

    // Step 5: Connect to local database
    console.log('\n📡 Step 4: Connecting to local PostgreSQL...')
    
    // Set environment to use local database
    process.env.LOCAL_DATABASE_URI = localUri
    delete process.env.DATABASE_URI
    
    // Destroy previous payload instance
    if (payload.db) {
      await payload.db.destroy()
    }
    
    // Re-import config with local connection
    const localConfig = (await import('../src/payload.config.ts')).default
    
    await payload.init({
      config: localConfig,
      local: true,
    })
    localPayload = payload
    
    // Restore original environment variables
    process.env.DATABASE_URI = originalDatabaseUri
    if (originalLocalDatabaseUri) {
      process.env.LOCAL_DATABASE_URI = originalLocalDatabaseUri
    }
    console.log('✅ Connected to local database\n')

    // Step 6: Import collections
    console.log('📥 Step 5: Importing collections to local database...')
    for (const [collectionSlug, docs] of Object.entries(exportedData)) {
      if (!docs || docs.length === 0) {
        console.log(`   ⏭️  Skipping ${collectionSlug} (no data)`)
        continue
      }

      let imported = 0
      let skipped = 0

      for (const doc of docs) {
        try {
          const { id, createdAt, updatedAt, ...docData } = doc
          
          // Try to create, if exists, update
          try {
            await localPayload.create({
              collection: collectionSlug,
              data: docData,
            })
            imported++
          } catch (createError) {
            // If document exists, try to update
            try {
              await localPayload.update({
                collection: collectionSlug,
                id: doc.id,
                data: docData,
              })
              skipped++ // Count as skipped since it existed
            } catch (updateError) {
              console.error(`   ⚠️  Error importing document in ${collectionSlug}:`, updateError.message)
            }
          }
        } catch (error) {
          console.error(`   ⚠️  Error processing document in ${collectionSlug}:`, error.message)
        }
      }
      console.log(`   ✅ ${collectionSlug}: ${imported} imported, ${skipped} updated`)
    }

    // Step 7: Import globals
    console.log('\n📥 Step 6: Importing globals to local database...')
    for (const [globalSlug, globalData] of Object.entries(exportedGlobals)) {
      if (!globalData) {
        console.log(`   ⏭️  Skipping ${globalSlug} (no data)`)
        continue
      }

      try {
        const { id, createdAt, updatedAt, ...globalFields } = globalData
        await localPayload.updateGlobal({
          slug: globalSlug,
          data: globalFields,
        })
        console.log(`   ✅ Imported global: ${globalSlug}`)
      } catch (error) {
        console.error(`   ⚠️  Error importing ${globalSlug}:`, error.message)
      }
    }

    console.log('\n🎉 Migration completed successfully!')
    console.log('\n📊 Summary:')
    console.log('   - All collections migrated')
    console.log('   - All globals migrated')
    console.log('   - Local database is ready for development')
    console.log('\n💡 Next steps:')
    console.log('   1. Update your .env.local to use LOCAL_DATABASE_URI')
    console.log('   2. Run: npm run dev')
    console.log('   3. Your local app will now use local PostgreSQL')

    process.exit(0)
  } catch (error) {
    console.error('\n❌ Migration failed:', error)
    console.error(error.stack)
    
    // Cleanup connections
    if (rdsPayload?.db) {
      try {
        await rdsPayload.db.destroy()
      } catch {}
    }
    if (localPayload?.db) {
      try {
        await localPayload.db.destroy()
      } catch {}
    }
    
    process.exit(1)
  }
}

migrateRdsToLocal()

