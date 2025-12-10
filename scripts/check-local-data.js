#!/usr/bin/env node

/**
 * Check data in local PostgreSQL database
 * Shows what data exists before migration
 */

import pg from 'pg';
const { Client } = pg;

const LOCAL_DB = 'postgres://rahulraj@127.0.0.1:5432/ncg';

async function checkLocalData() {
  const client = new Client({
    connectionString: LOCAL_DB,
  });

  try {
    await client.connect();
    console.log('✅ Connected to local database\n');

    // Get all tables
    const tablesResult = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_type = 'BASE TABLE'
      ORDER BY table_name;
    `);

    const tables = tablesResult.rows.map(r => r.table_name);
    console.log(`📊 Found ${tables.length} tables\n`);

    // Payload CMS collections (main content tables)
    const collections = [
      'users',
      'media',
      'blogs',
      'case_studies',
      'services',
      'sub_services',
      'job_openings',
      'job_applications',
      'icons',
    ];

    console.log('📦 Payload CMS Collections:');
    console.log('─'.repeat(50));
    
    for (const collection of collections) {
      if (tables.includes(collection)) {
        try {
          const count = await client.query(`SELECT COUNT(*) FROM "${collection}"`);
          const countNum = parseInt(count.rows[0].count);
          
          if (countNum > 0) {
            // Get sample data
            let sample = '';
            if (collection === 'users') {
              const userSample = await client.query(`SELECT id, email, created_at FROM "${collection}" LIMIT 1`);
              if (userSample.rows.length > 0) {
                sample = ` (e.g., ${userSample.rows[0].email})`;
              }
            } else if (collection === 'blogs') {
              const blogSample = await client.query(`SELECT id, title FROM "${collection}" LIMIT 1`);
              if (blogSample.rows.length > 0) {
                sample = ` (e.g., "${blogSample.rows[0].title?.substring(0, 40)}...")`;
              }
            } else if (collection === 'services') {
              const serviceSample = await client.query(`SELECT id, title FROM "${collection}" LIMIT 1`);
              if (serviceSample.rows.length > 0) {
                sample = ` (e.g., "${serviceSample.rows[0].title?.substring(0, 40)}...")`;
              }
            }
            
            console.log(`  ✅ ${collection.padEnd(20)} ${countNum.toString().padStart(5)} rows${sample}`);
          } else {
            console.log(`  ⚪ ${collection.padEnd(20)} ${countNum.toString().padStart(5)} rows (empty)`);
          }
        } catch (error) {
          console.log(`  ❌ ${collection.padEnd(20)} Error: ${error.message}`);
        }
      } else {
        console.log(`  ⚠️  ${collection.padEnd(20)} Table not found`);
      }
    }

    console.log('\n🌐 Payload CMS Globals:');
    console.log('─'.repeat(50));
    
    const globals = [
      'hero_section',
      'services_section',
      'testimonials_section',
      'trusted_by_section',
      'case_studies_hero',
      'case_studies_grid',
      'about_hero',
      'about_us_section',
      'footer_section',
      'contact_section',
    ];

    for (const global of globals) {
      if (tables.includes(global)) {
        try {
          const count = await client.query(`SELECT COUNT(*) FROM "${global}"`);
          const countNum = parseInt(count.rows[0].count);
          
          if (countNum > 0) {
            console.log(`  ✅ ${global.padEnd(30)} ${countNum} record(s)`);
          } else {
            console.log(`  ⚪ ${global.padEnd(30)} Empty`);
          }
        } catch (error) {
          console.log(`  ❌ ${global.padEnd(30)} Error`);
        }
      }
    }

    console.log('\n📁 Media Files:');
    console.log('─'.repeat(50));
    
    if (tables.includes('media')) {
      try {
        const mediaCount = await client.query('SELECT COUNT(*) FROM "media"');
        const totalMedia = parseInt(mediaCount.rows[0].count);
        
        if (totalMedia > 0) {
          // Get media types
          const mediaTypes = await client.query(`
            SELECT 
              CASE 
                WHEN mime_type LIKE 'image/%' THEN 'Images'
                WHEN mime_type LIKE 'video/%' THEN 'Videos'
                WHEN mime_type LIKE 'application/pdf' THEN 'PDFs'
                ELSE 'Other'
              END as type,
              COUNT(*) as count
            FROM "media"
            GROUP BY type
            ORDER BY count DESC
          `);
          
          console.log(`  Total: ${totalMedia} files`);
          mediaTypes.rows.forEach(row => {
            console.log(`    - ${row.type}: ${row.count}`);
          });
        } else {
          console.log('  ⚪ No media files');
        }
      } catch (error) {
        console.log(`  ❌ Error checking media: ${error.message}`);
      }
    }

    console.log('\n📈 Summary:');
    console.log('─'.repeat(50));
    
    // Count total rows across all tables
    let totalRows = 0;
    let tablesWithData = 0;
    
    for (const table of tables) {
      if (!table.includes('_rels') && !table.includes('_section')) {
        try {
          const count = await client.query(`SELECT COUNT(*) FROM "${table}"`);
          const countNum = parseInt(count.rows[0].count);
          totalRows += countNum;
          if (countNum > 0) tablesWithData++;
        } catch (error) {
          // Skip if error
        }
      }
    }
    
    console.log(`  Tables with data: ${tablesWithData}`);
    console.log(`  Total rows: ${totalRows.toLocaleString()}`);
    console.log(`  Total tables: ${tables.length}`);
    
    console.log('\n✅ Local database check complete!\n');
    console.log('Ready to migrate? Run: npm run migrate:data-only\n');

  } catch (error) {
    console.error('❌ Error:', error.message);
    
    if (error.message.includes('ECONNREFUSED') || error.message.includes('does not exist')) {
      console.error('\n💡 Troubleshooting:');
      console.error('  1. Make sure PostgreSQL is running locally');
      console.error('  2. Check connection string: postgres://rahulraj@127.0.0.1:5432/ncg');
      console.error('  3. Verify database "ncg" exists');
      console.error('  4. Check user "rahulraj" has access\n');
    }
    
    console.error(error.stack);
  } finally {
    await client.end();
  }
}

checkLocalData();
