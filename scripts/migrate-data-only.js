#!/usr/bin/env node

/**
 * Data-only migration: Local PostgreSQL → Neon
 * 
 * This script migrates ONLY data (not schema) from local to Neon.
 * Use this when Neon already has the correct schema.
 */

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Colors for console output
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

// Database connections
const SOURCE_DB = 'postgres://rahulraj@127.0.0.1:5432/ncg';
const DEST_DB = 'postgresql://neondb_owner:npg_S0Csv6LTRqrc@ep-cold-voice-ah35njsx-pooler.c-3.us-east-1.aws.neon.tech/neondb?sslmode=require';

// Backup file
const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
const BACKUP_FILE = path.join(__dirname, `../ncg_data_only_${timestamp}.sql`);

async function checkCommand(command, name) {
  try {
    execSync(`which ${command}`, { stdio: 'ignore' });
    return true;
  } catch {
    log(`\n✗ ${name} not found. Please install PostgreSQL client tools.`, 'red');
    log('macOS: brew install postgresql', 'yellow');
    log('Ubuntu: sudo apt-get install postgresql-client\n', 'yellow');
    return false;
  }
}

async function exportDataOnly() {
  log('\n========================================', 'blue');
  log('Data-Only Migration: Local → Neon', 'blue');
  log('========================================\n', 'blue');
  
  log('Step 1: Exporting data from local database...', 'yellow');
  log(`Source: ${SOURCE_DB}\n`, 'reset');
  
  // Check for pg_dump
  if (!(await checkCommand('pg_dump', 'pg_dump'))) {
    process.exit(1);
  }
  
  try {
    log('Creating data-only backup (excluding schema)...', 'blue');
    
    // Export data only, exclude migrations table (Payload manages this)
    execSync(
      `pg_dump "${SOURCE_DB}" ` +
      `--data-only ` +
      `--no-owner ` +
      `--no-acl ` +
      `--exclude-table=payload_migrations ` +
      `> "${BACKUP_FILE}"`,
      { stdio: 'inherit' }
    );
    
    const stats = fs.statSync(BACKUP_FILE);
    const sizeMB = (stats.size / (1024 * 1024)).toFixed(2);
    
    log(`✓ Data backup created: ${BACKUP_FILE} (${sizeMB} MB)\n`, 'green');
    return true;
  } catch (error) {
    log(`✗ Failed to create backup: ${error.message}`, 'red');
    return false;
  }
}

async function importToNeon() {
  log('Step 2: Importing data to Neon database...', 'yellow');
  log('Destination: Neon (ep-cold-voice-ah35njsx-pooler.c-3.us-east-1.aws.neon.tech)\n', 'reset');
  
  // Check for psql
  if (!(await checkCommand('psql', 'psql'))) {
    process.exit(1);
  }
  
  try {
    log('⚠️  This will add/update data in Neon.', 'yellow');
    log('   Existing data with same IDs will be updated.\n', 'yellow');
    
    log('Importing data to Neon...', 'blue');
    
    // Use --single-transaction for atomic import
    execSync(
      `psql "${DEST_DB}" ` +
      `--single-transaction ` +
      `-f "${BACKUP_FILE}"`,
      { stdio: 'inherit' }
    );
    
    log('\n✓ Data import completed successfully!\n', 'green');
    return true;
  } catch (error) {
    log(`\n✗ Import failed: ${error.message}`, 'red');
    log('Check the error messages above for details.', 'yellow');
    log(`Backup file saved as: ${BACKUP_FILE}`, 'yellow');
    log('\nCommon issues:', 'yellow');
    log('- Foreign key violations: Data dependencies might be out of order', 'reset');
    log('- Duplicate keys: Use --on-conflict-do-nothing or clear Neon first', 'reset');
    log('- Missing tables: Schema mismatch - let Payload create schema first', 'reset');
    return false;
  }
}

async function main() {
  try {
    // Step 1: Export data
    const exportSuccess = await exportDataOnly();
    if (!exportSuccess) {
      process.exit(1);
    }
    
    // Step 2: Import to Neon
    const importSuccess = await importToNeon();
    if (!importSuccess) {
      process.exit(1);
    }
    
    // Success message
    log('========================================', 'blue');
    log('Migration Complete!', 'green');
    log('========================================\n', 'blue');
    
    log('Next steps:', 'blue');
    log('1. Verify data in Neon Console', 'reset');
    log('2. Restart your dev server: npm run dev', 'reset');
    log('3. Test Payload admin: http://localhost:3000/admin', 'reset');
    log('4. Verify your content is showing correctly\n', 'reset');
    
    log(`Backup file saved as: ${BACKUP_FILE}`, 'yellow');
    log('You can delete it after verifying the migration.\n', 'yellow');
    
  } catch (error) {
    log(`\n✗ Unexpected error: ${error.message}`, 'red');
    console.error(error);
    process.exit(1);
  }
}

main();
