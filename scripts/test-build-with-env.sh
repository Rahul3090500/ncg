#!/bin/bash

# Test build with build environment variables
# This simulates what happens during Vercel build

set -e

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

echo -e "${CYAN}============================================================${NC}"
echo -e "${CYAN}Build-Time Fallback Test (Actual Build)${NC}"
echo -e "${CYAN}============================================================${NC}"
echo ""

echo -e "${BLUE}This test runs an actual Next.js build with build environment${NC}"
echo -e "${BLUE}variables set. This simulates what happens on Vercel.${NC}"
echo ""

# Check if .env files exist
if [ ! -f .env.local ] && [ ! -f .env.production ] && [ ! -f .env ]; then
    echo -e "${YELLOW}⚠️  Warning: No .env files found${NC}"
    echo -e "${YELLOW}   Database connection will likely fail${NC}"
    echo -e "${YELLOW}   This is GOOD for testing fallback behavior!${NC}"
    echo ""
fi

echo -e "${CYAN}Starting build with build environment...${NC}"
echo ""

# Set build environment variables and run build
NEXT_PHASE=phase-production-build \
NODE_ENV=production \
npm run build 2>&1 | tee /tmp/build-test.log

echo ""
echo -e "${CYAN}============================================================${NC}"
echo -e "${CYAN}Build Log Analysis${NC}"
echo -e "${CYAN}============================================================${NC}"
echo ""

# Check for timeout errors
if grep -q "timeout exceeded\|connection timeout\|timeout exceeded when trying to connect" /tmp/build-test.log; then
    echo -e "${YELLOW}⚠️  Database timeout errors found in build log${NC}"
    echo -e "${BLUE}Checking if fallback handled them gracefully...${NC}"
    echo ""
    
    # Check if build succeeded despite errors
    if grep -q "Build Completed\|Build Completed in" /tmp/build-test.log; then
        echo -e "${GREEN}✅ Build succeeded despite timeout errors!${NC}"
        echo -e "${GREEN}   This means fallback is working correctly.${NC}"
    else
        echo -e "${RED}❌ Build failed${NC}"
        echo -e "${RED}   Fallback may not be working correctly.${NC}"
    fi
else
    echo -e "${GREEN}✅ No timeout errors in build log${NC}"
    echo -e "${BLUE}   Database connection succeeded during build${NC}"
fi

# Check for build success
if grep -q "Build Completed\|Build Completed in" /tmp/build-test.log; then
    echo ""
    echo -e "${GREEN}✅ BUILD SUCCEEDED${NC}"
    echo ""
    echo -e "${BLUE}Summary:${NC}"
    echo "  - Build completed successfully"
    echo "  - Pages generated"
    echo "  - Fallback handled any database errors gracefully"
else
    echo ""
    echo -e "${RED}❌ BUILD FAILED${NC}"
    echo ""
    echo -e "${YELLOW}Check the build log above for errors${NC}"
fi

echo ""
echo -e "${CYAN}============================================================${NC}"
echo -e "${CYAN}What to Look For${NC}"
echo -e "${CYAN}============================================================${NC}"
echo ""
echo -e "${BLUE}✅ Good Signs:${NC}"
echo "  - Build completes successfully"
echo "  - 'Generating static pages' completes"
echo "  - No fatal errors"
echo ""
echo -e "${BLUE}⚠️  Expected Warnings (OK):${NC}"
echo "  - Database timeout errors (if DB unavailable)"
echo "  - These should NOT cause build to fail"
echo ""
echo -e "${BLUE}❌ Bad Signs:${NC}"
echo "  - Build exits with code 1"
echo "  - 'Build worker exited with code: 1'"
echo "  - Fatal errors that stop the build"
echo ""

