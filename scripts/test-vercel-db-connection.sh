#!/bin/bash

# Test Database Connection on Vercel Deployment
# Usage: ./scripts/test-vercel-db-connection.sh

VERCEL_URL="${1:-https://ncg-beta.vercel.app}"

echo "=========================================="
echo "Testing Database Connection"
echo "=========================================="
echo "Vercel URL: $VERCEL_URL"
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Test 1: Database Health Endpoint
echo "🔍 Test 1: Database Health Check"
echo "-----------------------------------"
HEALTH_RESPONSE=$(curl -s -w "\n%{http_code}" "$VERCEL_URL/api/database-health")
HTTP_CODE=$(echo "$HEALTH_RESPONSE" | tail -n1)
HEALTH_BODY=$(echo "$HEALTH_RESPONSE" | sed '$d')

if [ "$HTTP_CODE" = "200" ]; then
    echo -e "${GREEN}✅ Status: OK (HTTP $HTTP_CODE)${NC}"
else
    echo -e "${RED}❌ Status: Error (HTTP $HTTP_CODE)${NC}"
fi

echo ""
echo "Response:"
echo "$HEALTH_BODY" | jq '.' 2>/dev/null || echo "$HEALTH_BODY"
echo ""

# Extract key information
DB_TYPE=$(echo "$HEALTH_BODY" | jq -r '.database.databaseType' 2>/dev/null || echo "unknown")
DB_STATUS=$(echo "$HEALTH_BODY" | jq -r '.status' 2>/dev/null || echo "unknown")
DB_CONNECTED=$(echo "$HEALTH_BODY" | jq -r '.database.connectionTest.connected' 2>/dev/null || echo "false")

echo "📊 Summary:"
echo "  Database Type: $DB_TYPE"
echo "  Status: $DB_STATUS"
echo "  Connected: $DB_CONNECTED"
echo ""

# Test 2: Connection Check Endpoint (Optional)
echo "🔍 Test 2: Connection Check (Optional)"
echo "-----------------------------------"
CONN_RESPONSE=$(curl -s -w "\n%{http_code}" "$VERCEL_URL/api/connection-check" 2>/dev/null)
CONN_HTTP_CODE=$(echo "$CONN_RESPONSE" | tail -n1)
CONN_BODY=$(echo "$CONN_RESPONSE" | sed '$d')

if [ "$CONN_HTTP_CODE" = "200" ]; then
    echo -e "${GREEN}✅ Status: OK (HTTP $CONN_HTTP_CODE)${NC}"
    echo ""
    echo "Response:"
    echo "$CONN_BODY" | jq '.' 2>/dev/null || echo "$CONN_BODY"
else
    echo -e "${YELLOW}⚠️  Connection check endpoint not available (HTTP $CONN_HTTP_CODE)${NC}"
    echo -e "${YELLOW}   This is OK - database-health endpoint provides all needed info${NC}"
fi
echo ""

# Test 3: Check if admin panel is accessible
echo "🔍 Test 3: Admin Panel Accessibility"
echo "-----------------------------------"
ADMIN_RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" "$VERCEL_URL/admin")
if [ "$ADMIN_RESPONSE" = "200" ] || [ "$ADMIN_RESPONSE" = "302" ] || [ "$ADMIN_RESPONSE" = "307" ]; then
    echo -e "${GREEN}✅ Admin panel is accessible (HTTP $ADMIN_RESPONSE)${NC}"
else
    echo -e "${RED}❌ Admin panel returned HTTP $ADMIN_RESPONSE${NC}"
fi
echo ""

# Final Summary
echo "=========================================="
echo "Final Summary"
echo "=========================================="

if [ "$DB_STATUS" = "healthy" ] && [ "$DB_CONNECTED" = "true" ]; then
    echo -e "${GREEN}✅ Database connection is working!${NC}"
    exit 0
elif [ "$DB_STATUS" = "error" ]; then
    echo -e "${RED}❌ Database connection failed!${NC}"
    echo ""
    echo "Errors found:"
    echo "$HEALTH_BODY" | jq -r '.errors[]?' 2>/dev/null || echo "Check the response above"
    exit 1
else
    echo -e "${YELLOW}⚠️  Database connection status unclear${NC}"
    echo "Check the responses above for details"
    exit 2
fi
