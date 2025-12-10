#!/bin/bash

# Manual test script for build-time fallback
# Tests API routes with build environment variables set

set -e

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

echo -e "${CYAN}============================================================${NC}"
echo -e "${CYAN}Build-Time Fallback Manual Test${NC}"
echo -e "${CYAN}============================================================${NC}"
echo ""

# Check if dev server is running
echo -e "${BLUE}Checking if dev server is running...${NC}"
if curl -s http://localhost:3000 > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Dev server is running${NC}"
else
    echo -e "${RED}❌ Dev server is not running${NC}"
    echo -e "${YELLOW}Please start it first: npm run dev${NC}"
    exit 1
fi

echo ""
echo -e "${CYAN}Test 1: Normal Request (without build env)${NC}"
echo "------------------------------------------------------------"
echo -e "${BLUE}Calling: GET http://localhost:3000/api/services-read${NC}"
echo ""

RESPONSE=$(curl -s -w "\nHTTP_STATUS:%{http_code}" http://localhost:3000/api/services-read)
HTTP_STATUS=$(echo "$RESPONSE" | grep "HTTP_STATUS" | cut -d: -f2)
BODY=$(echo "$RESPONSE" | sed '/HTTP_STATUS/d')

echo -e "${BLUE}Status Code: ${HTTP_STATUS}${NC}"
echo -e "${BLUE}Response:${NC}"
echo "$BODY" | jq '.' 2>/dev/null || echo "$BODY"
echo ""

if echo "$BODY" | grep -q "_buildTimeFallback"; then
    echo -e "${YELLOW}⚠️  Build-time fallback detected (unexpected in normal mode)${NC}"
else
    echo -e "${GREEN}✅ Normal response (no build-time fallback)${NC}"
fi

echo ""
echo -e "${CYAN}Test 2: Build-Time Request (with build env)${NC}"
echo "------------------------------------------------------------"
echo -e "${BLUE}Setting build environment variables...${NC}"
echo -e "${BLUE}Calling: GET http://localhost:3000/api/services-read${NC}"
echo ""

# Set build environment and test
RESPONSE_BUILD=$(NEXT_PHASE=phase-production-build NODE_ENV=production \
    curl -s -w "\nHTTP_STATUS:%{http_code}" http://localhost:3000/api/services-read)
HTTP_STATUS_BUILD=$(echo "$RESPONSE_BUILD" | grep "HTTP_STATUS" | cut -d: -f2)
BODY_BUILD=$(echo "$RESPONSE_BUILD" | sed '/HTTP_STATUS/d')

echo -e "${BLUE}Status Code: ${HTTP_STATUS_BUILD}${NC}"
echo -e "${BLUE}Response:${NC}"
echo "$BODY_BUILD" | jq '.' 2>/dev/null || echo "$BODY_BUILD"
echo ""

if echo "$BODY_BUILD" | grep -q "_buildTimeFallback"; then
    echo -e "${GREEN}✅ Build-time fallback detected!${NC}"
    
    # Check if it's empty collection
    if echo "$BODY_BUILD" | jq -e '.docs != null' > /dev/null 2>&1; then
        DOCS_COUNT=$(echo "$BODY_BUILD" | jq '.docs | length')
        if [ "$DOCS_COUNT" -eq 0 ]; then
            echo -e "${GREEN}✅ Empty collection returned (expected)${NC}"
        else
            echo -e "${YELLOW}⚠️  Collection has ${DOCS_COUNT} items (unexpected)${NC}"
        fi
    fi
else
    echo -e "${YELLOW}⚠️  No build-time fallback detected${NC}"
    echo -e "${YELLOW}   This might mean database connection succeeded${NC}"
fi

echo ""
echo -e "${CYAN}Test 3: Homepage API${NC}"
echo "------------------------------------------------------------"
echo -e "${BLUE}Calling: GET http://localhost:3000/api/homepage-read${NC}"
echo ""

RESPONSE_HOME=$(NEXT_PHASE=phase-production-build NODE_ENV=production \
    curl -s -w "\nHTTP_STATUS:%{http_code}" http://localhost:3000/api/homepage-read)
HTTP_STATUS_HOME=$(echo "$RESPONSE_HOME" | grep "HTTP_STATUS" | cut -d: -f2)
BODY_HOME=$(echo "$RESPONSE_HOME" | sed '/HTTP_STATUS/d')

echo -e "${BLUE}Status Code: ${HTTP_STATUS_HOME}${NC}"

if echo "$BODY_HOME" | grep -q "_buildTimeFallback"; then
    echo -e "${GREEN}✅ Build-time fallback detected in homepage API!${NC}"
else
    echo -e "${YELLOW}⚠️  No build-time fallback in homepage API${NC}"
fi

echo ""
echo -e "${CYAN}============================================================${NC}"
echo -e "${CYAN}Test Summary${NC}"
echo -e "${CYAN}============================================================${NC}"
echo ""
echo -e "${BLUE}Expected behavior:${NC}"
echo "  - Normal request: Real data (or error if DB unavailable)"
echo "  - Build-time request: Empty data with _buildTimeFallback flag"
echo ""
echo -e "${BLUE}To test with actual build:${NC}"
echo "  NEXT_PHASE=phase-production-build npm run build"
echo ""

