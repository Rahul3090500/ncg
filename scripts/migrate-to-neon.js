#!/usr/bin/env node

/**
 * Migration script: Local PostgreSQL → Neon
 * 
 * This script migrates all data from your local PostgreSQL database to Neon.
 * It handles Payload CMS schema and data migration.
 * 
 * Usage:
 *   node scripts/migrate-to-neon.js
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
const BACKUP_FILE = path.join(__dirname, `../ncg_backup_${timestamp}.sql`);

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

async function createBackup() {
  log('\n========================================', 'blue');
  log('PostgreSQL → Neon Migration Script', 'blue');
  log('========================================\n', 'blue');
  
  log('Step 1: Creating backup from local database...', 'yellow');
  log(`Source: ${SOURCE_DB}\n`, 'reset');
  
  // Check for pg_dump
  if (!(await checkCommand('pg_dump', 'pg_dump'))) {
    process.exit(1);
  }
  
  try {
    log('Creating backup...', 'blue');
    execSync(`pg_dump "${SOURCE_DB}" --no-owner --no-acl --clean --if-exists > "${BACKUP_FILE}"`, {
      stdio: 'inherit',
    });
    
    const stats = fs.statSync(BACKUP_FILE);
    const sizeMB = (stats.size / (1024 * 1024)).toFixed(2);
    
    log(`✓ Backup created: ${BACKUP_FILE} (${sizeMB} MB)\n`, 'green');
    return true;
  } catch (error) {
    log(`✗ Failed to create backup: ${error.message}`, 'red');
    return false;
  }
}

async function restoreToNeon() {
  log('Step 2: Restoring backup to Neon database...', 'yellow');
  log('Destination: Neon (ep-cold-voice-ah35njsx-pooler.c-3.us-east-1.aws.neon.tech)\n', 'reset');
  
  // Check for psql
  if (!(await checkCommand('psql', 'psql'))) {
    process.exit(1);
  }
  
  try {
    log('Restoring to Neon...', 'blue');
    execSync(`psql "${DEST_DB}" < "${BACKUP_FILE}"`, {
      stdio: 'inherit',
    });
    
    log('\n✓ Migration completed successfully!\n', 'green');
    return true;
  } catch (error) {
    log(`\n✗ Migration failed: ${error.message}`, 'red');
    log('Check the error messages above for details.', 'yellow');
    log(`Backup file saved as: ${BACKUP_FILE}`, 'yellow');
    return false;
  }
}

async function main() {
  try {
    // Step 1: Create backup
    const backupSuccess = await createBackup();
    if (!backupSuccess) {
      process.exit(1);
    }
    
    // Step 2: Restore to Neon
    const restoreSuccess = await restoreToNeon();
    if (!restoreSuccess) {
      process.exit(1);
    }
    
    // Success message
    log('========================================', 'blue');
    log('Migration Complete!', 'green');
    log('========================================\n', 'blue');
    
    log('Next steps:', 'blue');
    log('1. Update your .env.local with DATABASE_URL', 'reset');
    log('2. Restart your dev server: npm run dev', 'reset');
    log('3. Test your app at http://localhost:3000', 'reset');
    log('4. Check Payload admin at http://localhost:3000/admin\n', 'reset');
    
    log(`Backup file saved as: ${BACKUP_FILE}`, 'yellow');
    log('You can delete it after verifying the migration.\n', 'yellow');
    
  } catch (error) {
    log(`\n✗ Unexpected error: ${error.message}`, 'red');
    process.exit(1);
  }
}

main();
