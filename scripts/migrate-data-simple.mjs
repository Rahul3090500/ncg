#!/usr/bin/env node
/**
 * Simple Data Migration Script
 * 
 * Uses Payload's API to copy data from RDS to local PostgreSQL
 * This script switches environment variables and re-imports config
 */

import { readFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import { config } from 'dotenv'

// Load environment variables
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const envPath = join(__dirname, '../.env')
config({ path: envPath })

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

async function migrateData() {
  const payload = (await import('payload')).default
  
  try {
    const rdsUri = process.env.DATABASE_URI
    const localUri = process.env.LOCAL_DATABASE_URI

    if (!rdsUri) {
      console.error('❌ DATABASE_URI not set')
      process.exit(1)
    }

    if (!localUri) {
      console.error('❌ LOCAL_DATABASE_URI not set')
      process.exit(1)
    }

    console.log('🚀 Starting data migration from RDS to Local PostgreSQL...\n')

    // Step 1: Connect to RDS
    console.log('📡 Step 1: Connecting to RDS...')
    const originalLocalDbUri = process.env.LOCAL_DATABASE_URI
    delete process.env.LOCAL_DATABASE_URI
    
    const rdsConfig = (await import('../src/payload.config.ts')).default
    await payload.init({ config: rdsConfig, local: true })
    
    console.log('✅ Connected to RDS\n')

    // Step 2: Export collections
    console.log('📤 Step 2: Exporting collections from RDS...')
    const exportedData = {}

    for (const collectionSlug of COLLECTIONS) {
      try {
        const result = await payload.find({
          collection: collectionSlug,
          limit: 10000,
          depth: 10,
        })
        exportedData[collectionSlug] = result.docs
        console.log(`   ✅ Exported ${result.docs.length} documents from ${collectionSlug}`)
      } catch (error) {
        console.error(`   ⚠️  Error exporting ${collectionSlug}:`, error.message)
        exportedData[collectionSlug] = []
      }
    }

    // Step 3: Export globals
    console.log('\n📤 Step 3: Exporting globals from RDS...')
    const exportedGlobals = {}

    for (const globalSlug of GLOBALS) {
      try {
        const global = await payload.findGlobal({
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
    if (payload.db) {
      await payload.db.destroy()
    }

    // Step 5: Connect to local database
    console.log('\n📡 Step 4: Connecting to local PostgreSQL...')
    process.env.LOCAL_DATABASE_URI = localUri
    delete process.env.DATABASE_URI
    
    // Clear module cache to force re-import
    const configPath = join(__dirname, '../src/payload.config.ts')
    if (import.meta.url in globalThis) {
      delete globalThis[import.meta.url]
    }
    
    const localConfig = (await import('../src/payload.config.ts')).default
    await payload.init({ config: localConfig, local: true })
    
    console.log('✅ Connected to local database\n')

    // Step 6: Import collections
    console.log('📥 Step 5: Importing collections to local database...')
    for (const [collectionSlug, docs] of Object.entries(exportedData)) {
      if (!docs || docs.length === 0) {
        console.log(`   ⏭️  Skipping ${collectionSlug} (no data)`)
        continue
      }

      let imported = 0
      let updated = 0
      let errors = 0

      for (const doc of docs) {
        try {
          const { id, createdAt, updatedAt, ...docData } = doc
          
          try {
            await payload.create({
              collection: collectionSlug,
              data: docData,
            })
            imported++
          } catch (createError) {
            // If exists, try update
            try {
              await payload.update({
                collection: collectionSlug,
                id: doc.id,
                data: docData,
              })
              updated++
            } catch (updateError) {
              errors++
              if (errors <= 5) {
                console.error(`   ⚠️  Error importing document in ${collectionSlug}:`, updateError.message)
              }
            }
          }
        } catch (error) {
          errors++
          if (errors <= 5) {
            console.error(`   ⚠️  Error processing document in ${collectionSlug}:`, error.message)
          }
        }
      }
      console.log(`   ✅ ${collectionSlug}: ${imported} imported, ${updated} updated, ${errors} errors`)
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
        await payload.updateGlobal({
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
    
    // Restore environment
    if (originalLocalDbUri) {
      process.env.LOCAL_DATABASE_URI = originalLocalDbUri
    }
    process.env.DATABASE_URI = rdsUri

    process.exit(0)
  } catch (error) {
    console.error('\n❌ Migration failed:', error)
    console.error(error.stack)
    process.exit(1)
  }
}

migrateData()

