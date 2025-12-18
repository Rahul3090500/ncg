#!/usr/bin/env node

/**
 * Add hero_section_mobile_tablet_background_images table to database
 * Run this script to add the missing table for mobile/tablet background images
 */

import pg from 'pg';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const { Client } = pg;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function addMobileTabletImagesTable() {
  const dbUrl = process.env.DATABASE_URL;

  if (!dbUrl) {
    console.error('❌ DATABASE_URL environment variable is not set');
    console.error('   Set it to your database connection string');
    process.exit(1);
  }

  let client = null;

  try {
    console.log('🚀 Adding hero_section_mobile_tablet_background_images table...\n');

    // Connect to database
    console.log('📡 Connecting to database...');
    client = new Client({
      connectionString: dbUrl,
      ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
    });

    await client.connect();
    console.log('✅ Connected to database\n');

    // Read SQL file
    const sqlPath = path.join(__dirname, 'add-mobile-tablet-images-table.sql');
    const sql = fs.readFileSync(sqlPath, 'utf8');

    // Execute SQL
    console.log('📋 Executing migration SQL...');
    await client.query(sql);
    console.log('✅ Migration executed successfully\n');

    // Verify table was created
    console.log('🔍 Verifying table creation...');
    const result = await client.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'hero_section_mobile_tablet_background_images'
      )
    `);

    if (result.rows[0]?.exists) {
      console.log('✅ Table "hero_section_mobile_tablet_background_images" exists\n');
    } else {
      console.error('❌ Table was not created');
      process.exit(1);
    }

    // Check indexes
    const indexesResult = await client.query(`
      SELECT indexname 
      FROM pg_indexes 
      WHERE tablename = 'hero_section_mobile_tablet_background_images'
    `);

    console.log('📊 Created indexes:');
    indexesResult.rows.forEach((row) => {
      console.log(`   ✓ ${row.indexname}`);
    });

    console.log('\n✅ Migration completed successfully!');
    console.log('   You can now use the mobile/tablet background images field in Payload CMS.\n');

  } catch (error) {
    console.error('❌ Error:', error.message);
    if (error.stack) {
      console.error(error.stack);
    }
    process.exit(1);
  } finally {
    if (client) {
      await client.end();
    }
  }
}

addMobileTabletImagesTable();



