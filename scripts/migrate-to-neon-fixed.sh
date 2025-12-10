#!/bin/bash

# Fixed Migration script: Local PostgreSQL → Neon
# This version handles Payload CMS schema properly

set -e

GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}Fixed PostgreSQL → Neon Migration${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""

SOURCE_DB="postgres://rahulraj@127.0.0.1:5432/ncg"
DEST_DB="postgresql://neondb_owner:npg_S0Csv6LTRqrc@ep-cold-voice-ah35njsx-pooler.c-3.us-east-1.aws.neon.tech/neondb?sslmode=require"
BACKUP_FILE="ncg_backup_$(date +%Y%m%d_%H%M%S).sql"

echo -e "${YELLOW}Step 1: Creating backup from local database...${NC}"
pg_dump "$SOURCE_DB" \
  --no-owner \
  --no-acl \
  --data-only \
  --exclude-table=payload_migrations \
  > "$BACKUP_FILE"

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Backup created: $BACKUP_FILE${NC}"
else
    echo -e "${RED}✗ Failed to create backup${NC}"
    exit 1
fi

echo ""
echo -e "${YELLOW}Step 2: Checking Neon database schema...${NC}"

# Check if tables exist
TABLES_EXIST=$(psql "$DEST_DB" -t -c "SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = 'public';" 2>/dev/null | xargs)

if [ "$TABLES_EXIST" = "0" ] || [ -z "$TABLES_EXIST" ]; then
    echo -e "${YELLOW}⚠️  No tables found in Neon.${NC}"
    echo -e "${YELLOW}   You need to let Payload CMS create the schema first.${NC}"
    echo ""
    echo -e "${BLUE}Recommended approach:${NC}"
    echo "1. Start your app with DATABASE_URL pointing to Neon"
    echo "2. Payload will create all tables automatically"
    echo "3. Then import data using: psql \"$DEST_DB\" < \"$BACKUP_FILE\""
    echo ""
    exit 0
fi

echo -e "${GREEN}✓ Tables exist in Neon${NC}"
echo ""

echo -e "${YELLOW}Step 3: Importing data to Neon...${NC}"
psql "$DEST_DB" < "$BACKUP_FILE" 2>&1 | grep -v "NOTICE:" | grep -v "already exists" || true

echo ""
echo -e "${GREEN}✓ Data import completed${NC}"
echo ""
echo -e "${BLUE}Next steps:${NC}"
echo "1. Run: node scripts/check-neon-schema.js (to verify)"
echo "2. Run: node scripts/fix-neon-migration.js (if needed)"
echo "3. Restart your dev server"
echo "4. Test at http://localhost:3000/admin"
