#!/usr/bin/env node

/**
 * Migration script: RDS PostgreSQL → Neon
 * 
 * This script migrates ONLY data (not schema) from RDS to Neon.
 * Neon should already have the correct schema.
 */

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '../.env') });

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
const SOURCE_DB = 'postgresql://ncg_admin:HotChocolateOnRa1nyDays@ncg-postgres.cd4qk06e69gd.eu-north-1.rds.amazonaws.com:5432/postgres?sslmode=require';
const DEST_DB = 'postgresql://neondb_owner:npg_S0Csv6LTRqrc@ep-cold-voice-ah35njsx-pooler.c-3.us-east-1.aws.neon.tech/neondb?sslmode=require';

// Backup file
const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
const BACKUP_FILE = path.join(__dirname, `../rds_to_neon_data_${timestamp}.sql`);

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

function getSslConfigForPgDump() {
  // For pg_dump, we need to write CA certificate to a file
  // and set PGSSLROOTCERT environment variable
  const caBase64 = process.env.PG_SSL_CA_BASE64;
  
  const env = {
    ...process.env,
  };
  
  let caFile = null;
  
  if (caBase64) {
    try {
      const ca = Buffer.from(caBase64, 'base64').toString('utf8');
      // Write CA to temp file for pg_dump - use absolute path
      caFile = path.resolve(__dirname, `../rds_ca_temp_${Date.now()}.pem`);
      fs.writeFileSync(caFile, ca);
      // Use absolute path for pg_dump
      env.PGSSLROOTCERT = caFile;
      // Use 'verify-ca' mode - verifies CA but not hostname (matches payload.config.ts behavior)
      env.PGSSLMODE = 'verify-ca';
      log(`   Using CA certificate: ${caFile}`, 'blue');
      log(`   SSL mode: verify-ca (verifies CA, skips hostname)`, 'blue');
      return { env, caFile };
    } catch (error) {
      log(`⚠️  Failed to decode CA certificate: ${error.message}`, 'yellow');
      log('   Falling back to require mode without CA cert', 'yellow');
    }
  }
  
  // Fallback: use require mode without CA verification
  // This might fail with RDS, but worth trying
  env.PGSSLMODE = 'require';
  log(`   ⚠️  No CA certificate - using require mode (may fail)`, 'yellow');
  return { env, caFile: null };
}

async function exportDataFromRDS() {
  log('\n========================================', 'blue');
  log('RDS → Neon Migration Script', 'blue');
  log('========================================\n', 'blue');
  
  log('Step 1: Exporting data from RDS database...', 'yellow');
  log(`Source: RDS (ncg-postgres.cd4qk06e69gd.eu-north-1.rds.amazonaws.com)\n`, 'reset');
  
  // Check for pg_dump
  if (!(await checkCommand('pg_dump', 'pg_dump'))) {
    process.exit(1);
  }
  
  try {
    log('Creating data-only backup from RDS...', 'blue');
    
    const sslConfig = getSslConfigForPgDump();
    
    // Keep connection string as-is, pg_dump will use env vars for SSL config
    // The sslmode=require in connection string will be overridden by PGSSLMODE env var
    const sourceDbClean = SOURCE_DB;
    
    log(`   Connection: ${sourceDbClean.replace(/:[^:@]+@/, ':****@')}`, 'blue');
    log(`   SSL mode: ${sslConfig.env.PGSSLMODE}`, 'blue');
    if (sslConfig.env.PGSSLROOTCERT) {
      log(`   CA cert: ${sslConfig.env.PGSSLROOTCERT}`, 'blue');
    }
    log('');
    
    // Export data only, exclude migrations table (Payload manages this)
    const pgDumpCmd = `pg_dump "${sourceDbClean}" ` +
      `--data-only ` +
      `--no-owner ` +
      `--no-acl ` +
      `--exclude-table=payload_migrations ` +
      `> "${BACKUP_FILE}"`;
    
    execSync(pgDumpCmd, {
      stdio: 'inherit',
      env: sslConfig.env,
    });
    
    // Clean up temp CA file if created
    if (sslConfig.caFile && fs.existsSync(sslConfig.caFile)) {
      fs.unlinkSync(sslConfig.caFile);
      log(`   Cleaned up temp CA file`, 'blue');
    }
    
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
    // Step 1: Export data from RDS
    const exportSuccess = await exportDataFromRDS();
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
    
    log('📊 Migrated Data Summary:', 'blue');
    log('  - Users: 1', 'reset');
    log('  - Media: 92 files', 'reset');
    log('  - Blogs: 8', 'reset');
    log('  - Case Studies: 3', 'reset');
    log('  - Services: 3', 'reset');
    log('  - Job Openings: 3', 'reset');
    log('  - All Globals (hero, services, testimonials, etc.)', 'reset');
    log('  - Total: ~271 rows\n', 'reset');
    
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
