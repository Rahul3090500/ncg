#!/usr/bin/env node

/**
 * Create Payload CMS Schema in Supabase
 * 
 * This script runs the migration to create all required tables in Supabase.
 * Run this when setting up a fresh Supabase database.
 */

import pg from 'pg'
const { Client } = pg

async function createSchema() {
  let client = null

  try {
    console.log('🚀 Creating Payload CMS schema in Supabase...\n')

    // Get database URL from environment
    const dbUrl = process.env.DATABASE_URL
    if (!dbUrl) {
      console.error('❌ DATABASE_URL environment variable is not set')
      console.error('   Set it to your Supabase connection string')
      process.exit(1)
    }

    // Strip SSL params - we'll handle SSL via config
    const connectionString = dbUrl.replace(/[?&]sslmode=[^&]*/g, '').replace(/[?&]supa=[^&]*/g, '')

    console.log('📡 Connecting to Supabase database...')
    console.log(`   Database: ${connectionString.replace(/:[^:@]+@/, ':****@')}\n`)

    // Create client with SSL config
    client = new Client({
      connectionString,
      ssl: {
        rejectUnauthorized: false,
      },
    })

    await client.connect()
    console.log('✅ Connected to Supabase database\n')

    // Check if users table already exists
    const checkResult = await client.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'users'
      )
    `)

    const schemaExists = checkResult.rows[0]?.exists || false

    if (schemaExists) {
      console.log('⚠️  Schema already exists!')
      console.log('   Tables are already created.\n')
      
      // List existing tables
      const tablesResult = await client.query(`
        SELECT table_name 
        FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_type = 'BASE TABLE'
        ORDER BY table_name
      `)
      
      const tables = tablesResult.rows.map((r) => r.table_name)
      console.log('📊 Existing tables:')
      tables.forEach((table) => {
        console.log(`   ✓ ${table}`)
      })
      console.log('')
      
      await client.end()
      console.log('✅ Schema already initialized!')
      process.exit(0)
    }

    console.log('📋 Creating database schema...\n')

    // Run migration SQL from the migration file
    // This matches the structure from src/migrations/20251026_222335.ts
    const migrationSQL = `
      -- Create users_sessions table
      CREATE TABLE IF NOT EXISTS "users_sessions" (
        "_order" integer NOT NULL,
        "_parent_id" integer NOT NULL,
        "id" varchar PRIMARY KEY NOT NULL,
        "created_at" timestamp(3) with time zone,
        "expires_at" timestamp(3) with time zone NOT NULL
      );

      -- Create users table
      CREATE TABLE IF NOT EXISTS "users" (
        "id" serial PRIMARY KEY NOT NULL,
        "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
        "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
        "email" varchar NOT NULL,
        "reset_password_token" varchar,
        "reset_password_expiration" timestamp(3) with time zone,
        "salt" varchar,
        "hash" varchar,
        "login_attempts" numeric DEFAULT 0,
        "lock_until" timestamp(3) with time zone
      );

      -- Create media table
      CREATE TABLE IF NOT EXISTS "media" (
        "id" serial PRIMARY KEY NOT NULL,
        "alt" varchar NOT NULL,
        "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
        "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
        "url" varchar,
        "thumbnail_u_r_l" varchar,
        "filename" varchar,
        "mime_type" varchar,
        "filesize" numeric,
        "width" numeric,
        "height" numeric,
        "focal_x" numeric,
        "focal_y" numeric
      );

      -- Create homepage table
      CREATE TABLE IF NOT EXISTS "homepage" (
        "id" serial PRIMARY KEY NOT NULL,
        "title" varchar DEFAULT 'Homepage Content' NOT NULL,
        "hero_section_main_heading" varchar DEFAULT 'Your Trusted Cybersecurity Partner' NOT NULL,
        "hero_section_background_image_id" integer,
        "hero_section_call_to_action_description" varchar DEFAULT 'You don''t need another security provider sending you generic reports. You need cybersecurity experts who understand your business, give honest advice, and solve problems others can''t even see.' NOT NULL,
        "hero_section_call_to_action_cta_heading" varchar DEFAULT 'Get Free Consultation' NOT NULL,
        "hero_section_call_to_action_cta_link" varchar DEFAULT '/contact',
        "hero_section_call_to_action_background_color" varchar DEFAULT '#001D5C',
        "services_section_section_title" varchar DEFAULT 'Our Services' NOT NULL,
        "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
        "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
      );

      -- Create homepage_services_section_services table
      CREATE TABLE IF NOT EXISTS "homepage_services_section_services" (
        "_order" integer NOT NULL,
        "_parent_id" integer NOT NULL,
        "id" varchar PRIMARY KEY NOT NULL,
        "title" varchar NOT NULL,
        "description" varchar NOT NULL,
        "hero_image_id" integer,
        "hero_alt" varchar
      );

      -- Create homepage_services_section_services_service_cards table
      CREATE TABLE IF NOT EXISTS "homepage_services_section_services_service_cards" (
        "_order" integer NOT NULL,
        "_parent_id" varchar NOT NULL,
        "id" varchar PRIMARY KEY NOT NULL,
        "title" varchar NOT NULL,
        "description" varchar NOT NULL
      );

      -- Create payload system tables
      CREATE TABLE IF NOT EXISTS "payload_locked_documents" (
        "id" serial PRIMARY KEY NOT NULL,
        "global_slug" varchar,
        "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
        "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
      );

      CREATE TABLE IF NOT EXISTS "payload_locked_documents_rels" (
        "id" serial PRIMARY KEY NOT NULL,
        "order" integer,
        "parent_id" integer NOT NULL,
        "path" varchar NOT NULL,
        "users_id" integer,
        "media_id" integer,
        "homepage_id" integer
      );

      CREATE TABLE IF NOT EXISTS "payload_preferences" (
        "id" serial PRIMARY KEY NOT NULL,
        "key" varchar,
        "value" jsonb,
        "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
        "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
      );

      CREATE TABLE IF NOT EXISTS "payload_preferences_rels" (
        "id" serial PRIMARY KEY NOT NULL,
        "order" integer,
        "parent_id" integer NOT NULL,
        "path" varchar NOT NULL,
        "users_id" integer
      );

      CREATE TABLE IF NOT EXISTS "payload_migrations" (
        "id" serial PRIMARY KEY NOT NULL,
        "name" varchar,
        "batch" numeric,
        "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
        "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
      );

      -- Create foreign key constraints
      ALTER TABLE "users_sessions" ADD CONSTRAINT IF NOT EXISTS "users_sessions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
      ALTER TABLE "homepage_services_section_services_service_cards" ADD CONSTRAINT IF NOT EXISTS "homepage_services_section_services_service_cards_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."homepage_services_section_services"("id") ON DELETE cascade ON UPDATE no action;
      ALTER TABLE "homepage_services_section_services" ADD CONSTRAINT IF NOT EXISTS "homepage_services_section_services_hero_image_id_media_id_fk" FOREIGN KEY ("hero_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
      ALTER TABLE "homepage_services_section_services" ADD CONSTRAINT IF NOT EXISTS "homepage_services_section_services_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."homepage"("id") ON DELETE cascade ON UPDATE no action;
      ALTER TABLE "homepage" ADD CONSTRAINT IF NOT EXISTS "homepage_hero_section_background_image_id_media_id_fk" FOREIGN KEY ("hero_section_background_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
      ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT IF NOT EXISTS "payload_locked_documents_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_locked_documents"("id") ON DELETE cascade ON UPDATE no action;
      ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT IF NOT EXISTS "payload_locked_documents_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
      ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT IF NOT EXISTS "payload_locked_documents_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
      ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT IF NOT EXISTS "payload_locked_documents_rels_homepage_fk" FOREIGN KEY ("homepage_id") REFERENCES "public"."homepage"("id") ON DELETE cascade ON UPDATE no action;
      ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT IF NOT EXISTS "payload_preferences_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_preferences"("id") ON DELETE cascade ON UPDATE no action;
      ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT IF NOT EXISTS "payload_preferences_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;

      -- Create indexes
      CREATE INDEX IF NOT EXISTS "users_sessions_order_idx" ON "users_sessions" USING btree ("_order");
      CREATE INDEX IF NOT EXISTS "users_sessions_parent_id_idx" ON "users_sessions" USING btree ("_parent_id");
      CREATE INDEX IF NOT EXISTS "users_updated_at_idx" ON "users" USING btree ("updated_at");
      CREATE INDEX IF NOT EXISTS "users_created_at_idx" ON "users" USING btree ("created_at");
      CREATE UNIQUE INDEX IF NOT EXISTS "users_email_idx" ON "users" USING btree ("email");
      CREATE INDEX IF NOT EXISTS "media_updated_at_idx" ON "media" USING btree ("updated_at");
      CREATE INDEX IF NOT EXISTS "media_created_at_idx" ON "media" USING btree ("created_at");
      CREATE UNIQUE INDEX IF NOT EXISTS "media_filename_idx" ON "media" USING btree ("filename");
      CREATE INDEX IF NOT EXISTS "homepage_services_section_services_service_cards_order_idx" ON "homepage_services_section_services_service_cards" USING btree ("_order");
      CREATE INDEX IF NOT EXISTS "homepage_services_section_services_service_cards_parent_id_idx" ON "homepage_services_section_services_service_cards" USING btree ("_parent_id");
      CREATE INDEX IF NOT EXISTS "homepage_services_section_services_order_idx" ON "homepage_services_section_services" USING btree ("_order");
      CREATE INDEX IF NOT EXISTS "homepage_services_section_services_parent_id_idx" ON "homepage_services_section_services" USING btree ("_parent_id");
      CREATE INDEX IF NOT EXISTS "homepage_services_section_services_hero_image_idx" ON "homepage_services_section_services" USING btree ("hero_image_id");
      CREATE INDEX IF NOT EXISTS "homepage_hero_section_hero_section_background_image_idx" ON "homepage" USING btree ("hero_section_background_image_id");
      CREATE INDEX IF NOT EXISTS "homepage_updated_at_idx" ON "homepage" USING btree ("updated_at");
      CREATE INDEX IF NOT EXISTS "homepage_created_at_idx" ON "homepage" USING btree ("created_at");
      CREATE INDEX IF NOT EXISTS "payload_locked_documents_global_slug_idx" ON "payload_locked_documents" USING btree ("global_slug");
      CREATE INDEX IF NOT EXISTS "payload_locked_documents_updated_at_idx" ON "payload_locked_documents" USING btree ("updated_at");
      CREATE INDEX IF NOT EXISTS "payload_locked_documents_created_at_idx" ON "payload_locked_documents" USING btree ("created_at");
      CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_order_idx" ON "payload_locked_documents_rels" USING btree ("order");
      CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_parent_idx" ON "payload_locked_documents_rels" USING btree ("parent_id");
      CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_path_idx" ON "payload_locked_documents_rels" USING btree ("path");
      CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_users_id_idx" ON "payload_locked_documents_rels" USING btree ("users_id");
      CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_media_id_idx" ON "payload_locked_documents_rels" USING btree ("media_id");
      CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_homepage_id_idx" ON "payload_locked_documents_rels" USING btree ("homepage_id");
      CREATE INDEX IF NOT EXISTS "payload_preferences_key_idx" ON "payload_preferences" USING btree ("key");
      CREATE INDEX IF NOT EXISTS "payload_preferences_updated_at_idx" ON "payload_preferences" USING btree ("updated_at");
      CREATE INDEX IF NOT EXISTS "payload_preferences_created_at_idx" ON "payload_preferences" USING btree ("created_at");
      CREATE INDEX IF NOT EXISTS "payload_preferences_rels_order_idx" ON "payload_preferences_rels" USING btree ("order");
      CREATE INDEX IF NOT EXISTS "payload_preferences_rels_parent_idx" ON "payload_preferences_rels" USING btree ("parent_id");
      CREATE INDEX IF NOT EXISTS "payload_preferences_rels_path_idx" ON "payload_preferences_rels" USING btree ("path");
      CREATE INDEX IF NOT EXISTS "payload_preferences_rels_users_id_idx" ON "payload_preferences_rels" USING btree ("users_id");
      CREATE INDEX IF NOT EXISTS "payload_migrations_updated_at_idx" ON "payload_migrations" USING btree ("updated_at");
      CREATE INDEX IF NOT EXISTS "payload_migrations_created_at_idx" ON "payload_migrations" USING btree ("created_at");
    `

    // Execute migration
    await client.query(migrationSQL)

    console.log('✅ Schema created successfully!\n')

    // List created tables
    const tablesResult = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_type = 'BASE TABLE'
      ORDER BY table_name
    `)

    const tables = tablesResult.rows.map((r) => r.table_name)
    console.log('📊 Created tables:')
    tables.forEach((table) => {
      console.log(`   ✓ ${table}`)
    })
    console.log('')

    await client.end()
    console.log('✅ Schema initialization complete!')
    console.log('\n💡 Next steps:')
    console.log('   1. Restart your dev server: npm run dev')
    console.log('   2. Visit http://localhost:3000/admin')
    console.log('   3. Create your first admin user\n')

    process.exit(0)
  } catch (error) {
    console.error('\n❌ Error creating schema:')
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

createSchema()
