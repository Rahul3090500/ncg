#!/usr/bin/env node

/**
 * Clear all data from Neon database (keeps schema)
 * Use this before migrating data if you want a fresh start
 */

import pg from 'pg';
const { Client } = pg;

const DEST_DB = 'postgresql://neondb_owner:npg_S0Csv6LTRqrc@ep-cold-voice-ah35njsx-pooler.c-3.us-east-1.aws.neon.tech/neondb?sslmode=require';

async function clearData() {
  const client = new Client({
    connectionString: DEST_DB,
    ssl: {
      rejectUnauthorized: false,
    },
  });

  try {
    await client.connect();
    console.log('✅ Connected to Neon database\n');

    // Get all tables
    const tablesResult = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_type = 'BASE TABLE'
      ORDER BY table_name;
    `);

    const tables = tablesResult.rows.map(r => r.table_name);
    console.log(`Found ${tables.length} tables\n`);

    // Exclude Payload system tables
    const excludeTables = ['payload_migrations'];
    const tablesToClear = tables.filter(t => !excludeTables.includes(t));

    console.log('⚠️  WARNING: This will delete ALL data from the following tables:');
    console.log(`   ${tablesToClear.length} tables will be cleared\n`);

    // Disable foreign key checks temporarily
    await client.query('SET session_replication_role = replica;');

    let clearedCount = 0;
    for (const table of tablesToClear) {
      try {
        const result = await client.query(`TRUNCATE TABLE "${table}" CASCADE;`);
        clearedCount++;
        console.log(`✓ Cleared: ${table}`);
      } catch (error) {
        console.log(`⚠️  Failed to clear ${table}: ${error.message}`);
      }
    }

    // Re-enable foreign key checks
    await client.query('SET session_replication_role = DEFAULT;');

    console.log(`\n✅ Cleared data from ${clearedCount} tables`);
    console.log('   Schema preserved - ready for data migration\n');

  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error(error.stack);
  } finally {
    await client.end();
  }
}

clearData();
