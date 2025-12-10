#!/usr/bin/env node

/**
 * Fix migration issues - recreate Payload CMS schema if needed
 */

import pg from 'pg';
const { Client } = pg;

const DEST_DB = 'postgresql://neondb_owner:npg_S0Csv6LTRqrc@ep-cold-voice-ah35njsx-pooler.c-3.us-east-1.aws.neon.tech/neondb?sslmode=require';

async function fixMigration() {
  const client = new Client({
    connectionString: DEST_DB,
    ssl: {
      rejectUnauthorized: false,
    },
  });

  try {
    await client.connect();
    console.log('✅ Connected to Neon database\n');

    // Check if users_sessions exists
    const tablesCheck = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name = 'users_sessions';
    `);

    if (tablesCheck.rows.length === 0) {
      console.log('⚠️  users_sessions table missing. Creating...');
      
      // Create users_sessions table (Payload CMS structure)
      await client.query(`
        CREATE TABLE IF NOT EXISTS "users_sessions" (
          "id" serial PRIMARY KEY,
          "_parent_id" integer NOT NULL,
          "_order" integer,
          "created_at" timestamp(3) DEFAULT CURRENT_TIMESTAMP,
          "expires_at" timestamp(3),
          CONSTRAINT "users_sessions__parent_id_fkey" 
            FOREIGN KEY ("_parent_id") 
            REFERENCES "users"("id") 
            ON DELETE CASCADE
        );
      `);
      
      // Create index
      await client.query(`
        CREATE INDEX IF NOT EXISTS "users_sessions__parent_id_idx" 
        ON "users_sessions"("_parent_id");
      `);
      
      console.log('✅ Created users_sessions table\n');
    } else {
      console.log('✅ users_sessions table exists\n');
    }

    // Check for missing columns in users_sessions
    const columnsCheck = await client.query(`
      SELECT column_name
      FROM information_schema.columns
      WHERE table_name = 'users_sessions';
    `);
    
    const existingColumns = columnsCheck.rows.map(r => r.column_name);
    const requiredColumns = ['id', '_parent_id', '_order', 'created_at', 'expires_at'];
    const missingColumns = requiredColumns.filter(col => !existingColumns.includes(col));
    
    if (missingColumns.length > 0) {
      console.log(`⚠️  Missing columns: ${missingColumns.join(', ')}`);
      console.log('You may need to recreate the table. Run Payload migrations instead.\n');
    } else {
      console.log('✅ All required columns exist\n');
    }

    // Check foreign key constraint
    const fkCheck = await client.query(`
      SELECT constraint_name
      FROM information_schema.table_constraints
      WHERE table_name = 'users_sessions'
      AND constraint_type = 'FOREIGN KEY';
    `);
    
    if (fkCheck.rows.length === 0) {
      console.log('⚠️  Foreign key constraint missing. Adding...');
      try {
        await client.query(`
          ALTER TABLE "users_sessions"
          ADD CONSTRAINT "users_sessions__parent_id_fkey" 
          FOREIGN KEY ("_parent_id") 
          REFERENCES "users"("id") 
          ON DELETE CASCADE;
        `);
        console.log('✅ Added foreign key constraint\n');
      } catch (error) {
        console.log(`⚠️  Could not add foreign key: ${error.message}\n`);
      }
    } else {
      console.log('✅ Foreign key constraint exists\n');
    }

    // Verify the problematic query works now
    console.log('🔍 Testing query...');
    try {
      const testResult = await client.query(`
        SELECT 
          "users"."id", 
          "users"."email",
          "users"."created_at"
        FROM "users" 
        ORDER BY "users"."created_at" DESC 
        LIMIT 1
      `);
      console.log('✅ Query works!');
      if (testResult.rows.length > 0) {
        console.log('Sample user:', testResult.rows[0]);
      }
    } catch (error) {
      console.log('❌ Query still fails:', error.message);
      console.log('\n💡 Recommendation: Let Payload CMS recreate the schema');
      console.log('   Delete all tables and let Payload initialize fresh');
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error(error.stack);
  } finally {
    await client.end();
  }
}

fixMigration();
