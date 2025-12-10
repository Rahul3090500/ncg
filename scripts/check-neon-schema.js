#!/usr/bin/env node

/**
 * Diagnostic script to check Neon database schema and data integrity
 */

import pg from 'pg';
const { Client } = pg;

const DEST_DB = 'postgresql://neondb_owner:npg_S0Csv6LTRqrc@ep-cold-voice-ah35njsx-pooler.c-3.us-east-1.aws.neon.tech/neondb?sslmode=require';

async function checkDatabase() {
  const client = new Client({
    connectionString: DEST_DB,
    ssl: {
      rejectUnauthorized: false,
    },
  });

  try {
    await client.connect();
    console.log('✅ Connected to Neon database\n');

    // Check current schema search path
    const searchPath = await client.query('SHOW search_path');
    console.log(`📋 Current search_path: ${searchPath.rows[0].search_path}\n`);

    // Check if users table exists
    console.log('📊 Checking tables...');
    const tablesResult = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name;
    `);
    
    const tables = tablesResult.rows.map(r => r.table_name);
    console.log(`Found ${tables.length} tables:`, tables.join(', '));
    console.log('');

    // Check users table structure
    if (tables.includes('users')) {
      console.log('👤 Checking users table...');
      const usersColumns = await client.query(`
        SELECT column_name, data_type, is_nullable
        FROM information_schema.columns
        WHERE table_name = 'users'
        ORDER BY ordinal_position;
      `);
      console.log('Users table columns:');
      usersColumns.rows.forEach(col => {
        console.log(`  - ${col.column_name} (${col.data_type}, nullable: ${col.is_nullable})`);
      });
      console.log('');

      // Check users count - try with schema qualification
      try {
        const usersCount = await client.query('SELECT COUNT(*) FROM public."users"');
        console.log(`Users count: ${usersCount.rows[0].count}`);
      } catch (error) {
        console.log(`⚠️  Error counting users: ${error.message}`);
        // Try without quotes
        try {
          const usersCount = await client.query('SELECT COUNT(*) FROM public.users');
          console.log(`Users count (unquoted): ${usersCount.rows[0].count}`);
        } catch (error2) {
          console.log(`❌ Both queries failed: ${error2.message}`);
        }
      }
      console.log('');

      // Check users_sessions table
      if (tables.includes('users_sessions')) {
        console.log('🔐 Checking users_sessions table...');
        const sessionsColumns = await client.query(`
          SELECT column_name, data_type, is_nullable
          FROM information_schema.columns
          WHERE table_schema = 'public' AND table_name = 'users_sessions'
          ORDER BY ordinal_position;
        `);
        console.log('Users_sessions table columns:');
        sessionsColumns.rows.forEach(col => {
          console.log(`  - ${col.column_name} (${col.data_type}, nullable: ${col.is_nullable})`);
        });
        console.log('');

        // Check foreign key
        const foreignKeys = await client.query(`
          SELECT
            tc.constraint_name,
            kcu.column_name,
            ccu.table_name AS foreign_table_name,
            ccu.column_name AS foreign_column_name
          FROM information_schema.table_constraints AS tc
          JOIN information_schema.key_column_usage AS kcu
            ON tc.constraint_name = kcu.constraint_name
            AND tc.table_schema = kcu.table_schema
          JOIN information_schema.constraint_column_usage AS ccu
            ON ccu.constraint_name = tc.constraint_name
            AND ccu.table_schema = tc.table_schema
          WHERE tc.table_schema = 'public'
            AND tc.table_name = 'users_sessions'
            AND tc.constraint_type = 'FOREIGN KEY';
        `);
        
        if (foreignKeys.rows.length > 0) {
          console.log('Foreign keys:');
          foreignKeys.rows.forEach(fk => {
            console.log(`  - ${fk.column_name} → ${fk.foreign_table_name}.${fk.foreign_column_name}`);
          });
        } else {
          console.log('⚠️  No foreign keys found on users_sessions');
        }
        console.log('');

        // Check sessions count - try with schema qualification
        try {
          const sessionsCount = await client.query('SELECT COUNT(*) FROM public."users_sessions"');
          console.log(`Sessions count: ${sessionsCount.rows[0].count}`);
        } catch (error) {
          console.log(`⚠️  Error counting sessions: ${error.message}`);
        }
        console.log('');

        // Try the problematic query (the exact query from the error)
        console.log('🔍 Testing problematic query (exact Payload query)...');
        try {
          const testQuery = await client.query(`
            SELECT 
              "users"."id", 
              "users"."updated_at", 
              "users"."created_at", 
              "users"."email", 
              "users"."reset_password_token", 
              "users"."reset_password_expiration", 
              "users"."salt", 
              "users"."hash", 
              "users"."login_attempts", 
              "users"."lock_until", 
              "users_sessions"."data" as "sessions" 
            FROM public."users" "users" 
            LEFT JOIN LATERAL (
              SELECT COALESCE(
                json_agg(
                  json_build_array(
                    "users_sessions"."_order", 
                    "users_sessions"."id", 
                    "users_sessions"."created_at", 
                    "users_sessions"."expires_at"
                  ) ORDER BY "users_sessions"."_order" ASC
                ), 
                '[]'::json
              ) as "data" 
              FROM (
                SELECT * 
                FROM public."users_sessions" "users_sessions" 
                WHERE "users_sessions"."_parent_id" = "users"."id" 
                ORDER BY "users_sessions"."_order" ASC
              ) "users_sessions"
            ) "users_sessions" ON true 
            ORDER BY "users"."created_at" DESC 
            LIMIT $1
          `, [1]);
          console.log('✅ Payload query works!');
          console.log('Sample user:', JSON.stringify(testQuery.rows[0], null, 2));
        } catch (error) {
          console.log('❌ Payload query failed:', error.message);
          console.log('Error details:', error);
        }
        console.log('');

      } else {
        console.log('⚠️  users_sessions table does NOT exist!');
        console.log('This might be the issue - Payload needs this table.');
        console.log('');
      }
    } else {
      console.log('❌ users table does NOT exist!');
    }

    // Check for Payload-specific tables
    console.log('📦 Checking Payload CMS tables...');
    const payloadTables = [
      'payload_preferences',
      'payload_migrations',
      'payload_locked_documents',
    ];
    
    for (const table of payloadTables) {
      if (tables.includes(table)) {
        try {
          const count = await client.query(`SELECT COUNT(*) FROM public."${table}"`);
          console.log(`  ✅ ${table}: ${count.rows[0].count} rows`);
        } catch (error) {
          console.log(`  ⚠️  ${table}: Query failed - ${error.message}`);
        }
      } else {
        console.log(`  ⚠️  ${table}: NOT FOUND`);
      }
    }
    console.log('');

  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error(error.stack);
  } finally {
    await client.end();
  }
}

checkDatabase();
