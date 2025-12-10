#!/usr/bin/env node

/**
 * Migration script: RDS PostgreSQL → Neon (Node.js approach)
 * 
 * Uses Node.js pg client instead of pg_dump to avoid SSL certificate issues.
 * Migrates ONLY data (not schema) from RDS to Neon.
 */

import pg from 'pg';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
dotenv.config({ path: resolve(__dirname, '../.env') });

const { Client } = pg;

// Database connections
const SOURCE_DB = 'postgresql://ncg_admin:HotChocolateOnRa1nyDays@ncg-postgres.cd4qk06e69gd.eu-north-1.rds.amazonaws.com:5432/postgres?sslmode=require';
const DEST_DB = 'postgresql://neondb_owner:npg_S0Csv6LTRqrc@ep-cold-voice-ah35njsx-pooler.c-3.us-east-1.aws.neon.tech/neondb?sslmode=require';

// Colors
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  blue: '\x1b[34m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function stripSslParams(connectionString) {
  return connectionString
    .replace(/[?&]sslmode=[^&]*/gi, '')
    .replace(/[?&]sslrootcert=[^&]*/gi, '')
    .replace(/[?&]sslkey=[^&]*/gi, '')
    .replace(/[?&]sslcert=[^&]*/gi, '');
}

function getSslConfig() {
  const caBase64 = process.env.PG_SSL_CA_BASE64;
  
  if (caBase64) {
    try {
      const ca = Buffer.from(caBase64, 'base64').toString('utf8');
      return {
        ca,
        rejectUnauthorized: false,
        checkServerIdentity: () => undefined,
      };
    } catch (error) {
      log(`⚠️  Failed to decode CA certificate: ${error.message}`, 'yellow');
    }
  }
  
  return {
    rejectUnauthorized: false,
    checkServerIdentity: () => undefined,
  };
}

async function getTables(client) {
  const result = await client.query(`
    SELECT table_name 
    FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_type = 'BASE TABLE'
    AND table_name NOT IN ('payload_migrations')
    ORDER BY table_name;
  `);
  return result.rows.map(r => r.table_name);
}

async function getTableColumns(client, tableName) {
  const result = await client.query(`
    SELECT column_name, data_type, is_nullable, column_default
    FROM information_schema.columns
    WHERE table_schema = 'public' 
    AND table_name = $1
    ORDER BY ordinal_position;
  `, [tableName]);
  return result.rows;
}

async function getTableData(client, tableName, columns) {
  const columnNames = columns.map(c => `"${c.column_name}"`).join(', ');
  const query = `SELECT ${columnNames} FROM "${tableName}"`;
  const result = await client.query(query);
  return result.rows;
}

async function insertData(destClient, tableName, columns, rows) {
  if (rows.length === 0) return 0;
  
  const columnNames = columns.map(c => `"${c.column_name}"`).join(', ');
  const placeholders = columns.map((_, i) => `$${i + 1}`).join(', ');
  const insertQuery = `INSERT INTO "${tableName}" (${columnNames}) VALUES (${placeholders}) ON CONFLICT DO NOTHING`;
  
  let inserted = 0;
  for (const row of rows) {
    const values = columns.map(col => {
      const value = row[col.column_name];
      // Handle null, undefined, and default values
      if (value === null || value === undefined) {
        return null;
      }
      return value;
    });
    
    try {
      await destClient.query(insertQuery, values);
      inserted++;
    } catch (error) {
      // Skip if conflict or other non-critical errors
      if (!error.message.includes('duplicate key') && !error.message.includes('violates unique constraint')) {
        log(`   ⚠️  Error inserting row: ${error.message}`, 'yellow');
      }
    }
  }
  
  return inserted;
}

async function migrateTable(sourceClient, destClient, tableName) {
  try {
    // Get columns
    const columns = await getTableColumns(sourceClient, tableName);
    if (columns.length === 0) {
      return { tableName, rows: 0, inserted: 0 };
    }
    
    // Get data
    const rows = await getTableData(sourceClient, tableName, columns);
    if (rows.length === 0) {
      return { tableName, rows: 0, inserted: 0 };
    }
    
    // Insert data
    const inserted = await insertData(destClient, tableName, columns, rows);
    
    return { tableName, rows: rows.length, inserted };
  } catch (error) {
    log(`   ❌ Error migrating ${tableName}: ${error.message}`, 'red');
    return { tableName, rows: 0, inserted: 0, error: error.message };
  }
}

async function main() {
  log('\n========================================', 'blue');
  log('RDS → Neon Migration (Node.js)', 'blue');
  log('========================================\n', 'blue');
  
  const sourceClient = new Client({
    connectionString: stripSslParams(SOURCE_DB),
    ssl: getSslConfig(),
  });
  
  const destClient = new Client({
    connectionString: stripSslParams(DEST_DB),
    ssl: {
      rejectUnauthorized: false,
    },
  });
  
  try {
    // Connect to both databases
    log('Connecting to RDS...', 'blue');
    await sourceClient.connect();
    log('✅ Connected to RDS\n', 'green');
    
    log('Connecting to Neon...', 'blue');
    await destClient.connect();
    log('✅ Connected to Neon\n', 'green');
    
    // Get list of tables
    log('Getting list of tables...', 'blue');
    const tables = await getTables(sourceClient);
    log(`Found ${tables.length} tables to migrate\n`, 'green');
    
    // Migrate each table
    log('Starting migration...\n', 'yellow');
    const results = [];
    let totalRows = 0;
    let totalInserted = 0;
    
    for (const table of tables) {
      log(`Migrating ${table}...`, 'blue');
      const result = await migrateTable(sourceClient, destClient, table);
      results.push(result);
      totalRows += result.rows;
      totalInserted += result.inserted;
      
      if (result.rows > 0) {
        log(`   ✓ ${result.inserted}/${result.rows} rows migrated`, 'green');
      } else {
        log(`   ⚪ Empty table`, 'reset');
      }
    }
    
    // Summary
    log('\n========================================', 'blue');
    log('Migration Complete!', 'green');
    log('========================================\n', 'blue');
    
    log('Summary:', 'blue');
    log(`  Tables migrated: ${results.filter(r => r.inserted > 0).length}`, 'reset');
    log(`  Total rows: ${totalRows}`, 'reset');
    log(`  Rows inserted: ${totalInserted}`, 'reset');
    
    // Show tables with data
    const tablesWithData = results.filter(r => r.inserted > 0);
    if (tablesWithData.length > 0) {
      log('\nTables with data:', 'blue');
      tablesWithData.forEach(r => {
        log(`  ${r.tableName.padEnd(30)} ${r.inserted} rows`, 'reset');
      });
    }
    
    log('\nNext steps:', 'blue');
    log('1. Verify data in Neon Console', 'reset');
    log('2. Restart your dev server: npm run dev', 'reset');
    log('3. Test Payload admin: http://localhost:3000/admin\n', 'reset');
    
  } catch (error) {
    log(`\n❌ Error: ${error.message}`, 'red');
    console.error(error);
    process.exit(1);
  } finally {
    await sourceClient.end();
    await destClient.end();
  }
}

main();
