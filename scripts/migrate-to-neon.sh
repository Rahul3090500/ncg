#!/bin/bash

# Migration script: Local PostgreSQL → Neon
# This script migrates all data from your local PostgreSQL database to Neon

set -e  # Exit on error

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}PostgreSQL → Neon Migration Script${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""

# Source database (local)
SOURCE_DB="postgres://rahulraj@127.0.0.1:5432/ncg"

# Destination database (Neon)
DEST_DB="postgresql://neondb_owner:npg_S0Csv6LTRqrc@ep-cold-voice-ah35njsx-pooler.c-3.us-east-1.aws.neon.tech/neondb?sslmode=require"

# Backup file
BACKUP_FILE="ncg_backup_$(date +%Y%m%d_%H%M%S).sql"

echo -e "${YELLOW}Step 1: Creating backup from local database...${NC}"
echo "Source: $SOURCE_DB"
echo ""

# Check if pg_dump is available
if ! command -v pg_dump &> /dev/null; then
    echo -e "${RED}Error: pg_dump not found. Please install PostgreSQL client tools.${NC}"
    echo "macOS: brew install postgresql"
    echo "Ubuntu: sudo apt-get install postgresql-client"
    exit 1
fi

# Create backup
pg_dump "$SOURCE_DB" --no-owner --no-acl --clean --if-exists > "$BACKUP_FILE"

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Backup created: $BACKUP_FILE${NC}"
    echo ""
else
    echo -e "${RED}✗ Failed to create backup${NC}"
    exit 1
fi

echo -e "${YELLOW}Step 2: Restoring backup to Neon database...${NC}"
echo "Destination: Neon (ep-cold-voice-ah35njsx-pooler.c-3.us-east-1.aws.neon.tech)"
echo ""

# Check if psql is available
if ! command -v psql &> /dev/null; then
    echo -e "${RED}Error: psql not found. Please install PostgreSQL client tools.${NC}"
    exit 1
fi

# Restore to Neon
psql "$DEST_DB" < "$BACKUP_FILE"

if [ $? -eq 0 ]; then
    echo ""
    echo -e "${GREEN}✓ Migration completed successfully!${NC}"
    echo ""
    echo -e "${BLUE}Next steps:${NC}"
    echo "1. Update your .env.local with DATABASE_URL"
    echo "2. Restart your dev server"
    echo "3. Test your app at http://localhost:3000"
    echo "4. Check Payload admin at http://localhost:3000/admin"
    echo ""
    echo -e "${YELLOW}Backup file saved as: $BACKUP_FILE${NC}"
    echo "You can delete it after verifying the migration."
else
    echo ""
    echo -e "${RED}✗ Migration failed${NC}"
    echo "Check the error messages above for details."
    echo "Backup file saved as: $BACKUP_FILE"
    exit 1
fi
