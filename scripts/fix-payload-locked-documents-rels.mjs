#!/usr/bin/env node

/**
 * Fix payload_locked_documents_rels table
 * Adds missing columns for all collections
 */

import pg from 'pg'
import { config } from 'dotenv'
import { fileURLToPath } from 'url'
import { dirname, resolve } from 'path'

// Load environment variables from .env file
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
config({ path: resolve(__dirname, '..', '.env') })

const { Client } = pg

async function fixTable() {
  let client = null

  try {
    console.log('🔧 Fixing payload_locked_documents_rels table...\n')

    const dbUrl = process.env.DATABASE_URL
    if (!dbUrl) {
      console.error('❌ DATABASE_URL environment variable is not set')
      process.exit(1)
    }

    // Strip SSL params - we'll handle SSL via config
    const connectionString = dbUrl.replace(/[?&]sslmode=[^&]*/g, '').replace(/[?&]supa=[^&]*/g, '')

    client = new Client({
      connectionString,
      ssl: {
        rejectUnauthorized: false,
      },
    })

    await client.connect()
    console.log('✅ Connected to Supabase database\n')

    // Check existing columns
    const existingColumns = await client.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'payload_locked_documents_rels'
      AND table_schema = 'public'
      ORDER BY column_name
    `)

    const columnNames = existingColumns.rows.map(r => r.column_name)
    console.log('📋 Existing columns:', columnNames.join(', '), '\n')

    // Columns that should exist (based on collections)
    const requiredColumns = [
      { name: 'case_studies_id', type: 'integer' },
      { name: 'blogs_id', type: 'integer' },
      { name: 'icons_id', type: 'integer' },
      { name: 'job_openings_id', type: 'integer' },
      { name: 'job_applications_id', type: 'integer' },
      { name: 'services_id', type: 'integer' },
      { name: 'sub_services_id', type: 'integer' },
    ]

    // Add missing columns
    let addedCount = 0
    for (const col of requiredColumns) {
      if (!columnNames.includes(col.name)) {
        try {
          await client.query(`ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "${col.name}" ${col.type}`)
          console.log(`✅ Added column: ${col.name}`)
          addedCount++
        } catch (error) {
          console.log(`⚠️  Failed to add ${col.name}: ${error.message}`)
        }
      } else {
        console.log(`✓ Column already exists: ${col.name}`)
      }
    }

    // Add foreign key constraints (if tables exist)
    const foreignKeys = [
      { column: 'case_studies_id', table: 'case_studies', constraint: 'payload_locked_documents_rels_case_studies_fk' },
      { column: 'blogs_id', table: 'blogs', constraint: 'payload_locked_documents_rels_blogs_fk' },
      { column: 'icons_id', table: 'icons', constraint: 'payload_locked_documents_rels_icons_fk' },
      { column: 'job_openings_id', table: 'job_openings', constraint: 'payload_locked_documents_rels_job_openings_fk' },
      { column: 'job_applications_id', table: 'job_applications', constraint: 'payload_locked_documents_rels_job_applications_fk' },
      { column: 'services_id', table: 'services', constraint: 'payload_locked_documents_rels_services_fk' },
      { column: 'sub_services_id', table: 'sub_services', constraint: 'payload_locked_documents_rels_sub_services_fk' },
    ]

    console.log('\n📋 Adding foreign key constraints...\n')

    // Check which tables exist
    const tablesResult = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_type = 'BASE TABLE'
    `)
    const existingTables = tablesResult.rows.map(r => r.table_name)

    // Check existing constraints
    const existingConstraints = await client.query(`
      SELECT constraint_name 
      FROM information_schema.table_constraints 
      WHERE table_name = 'payload_locked_documents_rels'
      AND constraint_type = 'FOREIGN KEY'
    `)
    const constraintNames = existingConstraints.rows.map(r => r.constraint_name)

    let fkAddedCount = 0
    for (const fk of foreignKeys) {
      if (!existingTables.includes(fk.table)) {
        console.log(`⚠️  Table ${fk.table} doesn't exist, skipping FK constraint`)
        continue
      }

      if (constraintNames.includes(fk.constraint)) {
        console.log(`✓ FK constraint already exists: ${fk.constraint}`)
        continue
      }

      try {
        await client.query(`
          ALTER TABLE "payload_locked_documents_rels" 
          ADD CONSTRAINT "${fk.constraint}" 
          FOREIGN KEY ("${fk.column}") 
          REFERENCES "public"."${fk.table}"("id") 
          ON DELETE cascade 
          ON UPDATE no action
        `)
        console.log(`✅ Added FK constraint: ${fk.constraint}`)
        fkAddedCount++
      } catch (error) {
        console.log(`⚠️  Failed to add FK ${fk.constraint}: ${error.message}`)
      }
    }

    // Add indexes for new columns
    console.log('\n📋 Adding indexes...\n')

    const indexes = [
      { column: 'case_studies_id', index: 'payload_locked_documents_rels_case_studies_id_idx' },
      { column: 'blogs_id', index: 'payload_locked_documents_rels_blogs_id_idx' },
      { column: 'icons_id', index: 'payload_locked_documents_rels_icons_id_idx' },
      { column: 'job_openings_id', index: 'payload_locked_documents_rels_job_openings_id_idx' },
      { column: 'job_applications_id', index: 'payload_locked_documents_rels_job_applications_id_idx' },
      { column: 'services_id', index: 'payload_locked_documents_rels_services_id_idx' },
      { column: 'sub_services_id', index: 'payload_locked_documents_rels_sub_services_id_idx' },
    ]

    // Check existing indexes
    const existingIndexes = await client.query(`
      SELECT indexname 
      FROM pg_indexes 
      WHERE tablename = 'payload_locked_documents_rels'
    `)
    const indexNames = existingIndexes.rows.map(r => r.indexname)

    let indexAddedCount = 0
    for (const idx of indexes) {
      if (indexNames.includes(idx.index)) {
        console.log(`✓ Index already exists: ${idx.index}`)
        continue
      }

      if (!columnNames.includes(idx.column) && !requiredColumns.find(c => c.name === idx.column)) {
        console.log(`⚠️  Column ${idx.column} doesn't exist, skipping index`)
        continue
      }

      try {
        await client.query(`CREATE INDEX IF NOT EXISTS "${idx.index}" ON "payload_locked_documents_rels" USING btree ("${idx.column}")`)
        console.log(`✅ Added index: ${idx.index}`)
        indexAddedCount++
      } catch (error) {
        console.log(`⚠️  Failed to add index ${idx.index}: ${error.message}`)
      }
    }

    console.log('\n✅ Table fix completed!')
    console.log(`   Added ${addedCount} columns`)
    console.log(`   Added ${fkAddedCount} foreign key constraints`)
    console.log(`   Added ${indexAddedCount} indexes\n`)

    await client.end()
    process.exit(0)
  } catch (error) {
    console.error('\n❌ Error:')
    console.error(error.message)
    if (error.stack) {
      console.error('\nStack trace:')
      console.error(error.stack)
    }
    if (client) {
      await client.end()
    }
    process.exit(1)
  }
}

fixTable()


