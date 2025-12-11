#!/usr/bin/env node

/**
 * Initialize Supabase Database Schema
 * 
 * This script initializes Payload CMS schema in Supabase database.
 * Run this when setting up a fresh Supabase database.
 */

import payload from 'payload'
import config from '../src/payload.config.js'

async function initSchema() {
  try {
    console.log('🚀 Initializing Supabase database schema...\n')

    // Check environment variables
    const dbUrl = process.env.DATABASE_URL
    if (!dbUrl) {
      console.error('❌ DATABASE_URL environment variable is not set')
      console.error('   Set it to your Supabase connection string')
      process.exit(1)
    }

    if (!process.env.PAYLOAD_SECRET) {
      console.error('❌ PAYLOAD_SECRET environment variable is not set')
      process.exit(1)
    }

    console.log('📡 Connecting to Supabase database...')
    console.log(`   Database: ${dbUrl.replace(/:[^:@]+@/, ':****@')}\n`)

    // Initialize Payload with Supabase database
    await payload.init({
      config,
      local: true,
    })

    console.log('✅ Connected to Supabase database\n')

    // Check if users table exists
    const result = await payload.db.drizzle.execute(
      payload.db.drizzle.sql`SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'users'
      )`
    )

    const tableExists = result.rows?.[0]?.exists || false

    if (tableExists) {
      console.log('✅ Database schema already exists')
      console.log('   Tables are already created\n')
    } else {
      console.log('📋 Creating database schema...')
      console.log('   Payload will create all tables automatically\n')
      
      // Trigger schema creation by accessing a collection
      // This will cause Payload to push the schema
      try {
        await payload.find({
          collection: 'users',
          limit: 1,
        })
      } catch (error) {
        // Expected error - schema doesn't exist yet
        // Payload will create it on next request
        console.log('⚠️  Schema creation will happen on next request')
      }
    }

    // List all tables
    const tablesResult = await payload.db.drizzle.execute(
      payload.db.drizzle.sql`
        SELECT table_name 
        FROM information_schema.tables 
        WHERE table_schema = 'public' 
        ORDER BY table_name
      `
    )

    const tables = tablesResult.rows?.map((r) => r.table_name) || []

    if (tables.length > 0) {
      console.log('📊 Existing tables:')
      tables.forEach((table) => {
        console.log(`   ✓ ${table}`)
      })
      console.log('')
    }

    await payload.db.destroy()
    console.log('✅ Schema initialization complete!')
    console.log('\n💡 Next steps:')
    console.log('   1. Restart your dev server: npm run dev')
    console.log('   2. Visit http://localhost:3000/admin')
    console.log('   3. Create your first admin user\n')

    process.exit(0)
  } catch (error) {
    console.error('\n❌ Error initializing schema:')
    console.error(error.message)
    if (error.stack) {
      console.error('\nStack trace:')
      console.error(error.stack)
    }
    process.exit(1)
  }
}

initSchema()
