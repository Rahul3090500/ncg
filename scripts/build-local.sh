#!/bin/bash

# Local Build Script - Exact AWS Amplify Build Process Simulation
# This mimics the EXACT amplify.yml build process locally
# Usage: ./scripts/build-local.sh

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Start timing
START_TIME=$(date +%s)

echo -e "${BLUE}🚀 Starting Local Build (Exact Amplify.yml Simulation)${NC}"
echo "================================================================"
echo ""

# Track time for each phase
PHASE_START=$(date +%s)

# ============================================
# PREBUILD PHASE (matches amplify.yml)
# ============================================
echo -e "${YELLOW}📦 PREBUILD PHASE${NC}"
echo "-------------------"

# Step 1: Ultra-fast npm install (EXACT amplify.yml command)
echo -e "${BLUE}Step 1: Installing dependencies (npm ci)...${NC}"
echo "   Command: npm ci --legacy-peer-deps --prefer-offline --no-audit --no-fund --loglevel=error --maxsockets=15 --prefer-dedupe"
echo ""

INSTALL_START=$(date +%s)
if npm ci --legacy-peer-deps --prefer-offline --no-audit --no-fund --loglevel=error --maxsockets=15 --prefer-dedupe; then
    INSTALL_END=$(date +%s)
    INSTALL_TIME=$((INSTALL_END - INSTALL_START))
    echo -e "${GREEN}✅ Dependencies installed successfully (${INSTALL_TIME}s)${NC}"
else
    echo -e "${RED}❌ Dependency installation failed${NC}"
    exit 1
fi
echo ""

# Step 2: Setup environment variables (EXACT amplify.yml command)
echo -e "${BLUE}Step 2: Setting up environment variables...${NC}"
echo "   Command: env | grep -E '^(PAYLOAD_SECRET|DATABASE_URI|...)' >> .env.production"
echo ""

# Create .env.production from existing .env files
if [ -f .env.production.local ]; then
    echo "   Using .env.production.local"
    cp .env.production.local .env.production 2>/dev/null || true
elif [ -f .env.local ]; then
    echo "   Using .env.local"
    cp .env.local .env.production 2>/dev/null || true
elif [ -f .env ]; then
    echo "   Using .env"
    cp .env .env.production 2>/dev/null || true
else
    echo "   ⚠️  No .env files found - using environment variables from shell"
fi

# Add environment variables to .env.production (mimics Amplify)
env | grep -E '^(PAYLOAD_SECRET|DATABASE_URI|CORS_ORIGINS|PG_SSL_CA_BASE64|S3_BUCKET|S3_REGION|S3_ACCESS_KEY_ID|S3_SECRET_ACCESS_KEY|S3_ACL|S3_ENDPOINT|S3_FORCE_PATH_STYLE|S3_PREFIX|NODE_ENV|AWS_REGION)=' >> .env.production 2>/dev/null || true
env | grep '^NEXT_PUBLIC_' >> .env.production 2>/dev/null || true

echo -e "${GREEN}✅ Environment variables set${NC}"
echo ""

# Step 3: Pre-generate Payload types (EXACT amplify.yml command)
echo -e "${BLUE}Step 3: Pre-generating Payload types...${NC}"
echo "   Command: npm run generate:types || true"
echo ""

TYPES_START=$(date +%s)
TYPES_TIME=""
if npm run generate:types 2>/dev/null; then
    TYPES_END=$(date +%s)
    TYPES_TIME=$((TYPES_END - TYPES_START))
    echo -e "${GREEN}✅ Payload types generated (${TYPES_TIME}s)${NC}"
else
    echo -e "${YELLOW}⚠️  Payload types generation skipped (not critical)${NC}"
fi
echo ""

PHASE_END=$(date +%s)
PREBUILD_TIME=$((PHASE_END - PHASE_START))
echo -e "${GREEN}✅ PREBUILD PHASE COMPLETE (${PREBUILD_TIME}s)${NC}"
echo ""

# ============================================
# BUILD PHASE (matches amplify.yml)
# ============================================
echo -e "${YELLOW}🏗️  BUILD PHASE${NC}"
echo "-------------------"

BUILD_START=$(date +%s)
echo -e "${BLUE}Building Next.js application...${NC}"
echo "   Command: NEXT_TELEMETRY_DISABLED=1 npm run build"
echo ""

if NEXT_TELEMETRY_DISABLED=1 npm run build; then
    BUILD_END=$(date +%s)
    BUILD_TIME=$((BUILD_END - BUILD_START))
    echo ""
    echo -e "${GREEN}✅ BUILD PHASE COMPLETE (${BUILD_TIME}s)${NC}"
else
    echo ""
    echo -e "${RED}❌ Build failed!${NC}"
    exit 1
fi
echo ""

# ============================================
# SUMMARY
# ============================================
END_TIME=$(date +%s)
TOTAL_TIME=$((END_TIME - START_TIME))

echo "================================================================"
echo -e "${GREEN}✅ BUILD COMPLETED SUCCESSFULLY!${NC}"
echo "================================================================"
echo ""
echo "📊 Build Timing Summary:"
echo "   - PreBuild Phase: ${PREBUILD_TIME}s"
echo "     • Dependency Installation: ${INSTALL_TIME}s"
echo "     • Environment Setup: <1s"
if [ -n "${TYPES_TIME}" ]; then
    echo "     • Payload Types: ${TYPES_TIME}s"
fi
echo "   - Build Phase: ${BUILD_TIME}s"
TOTAL_MINUTES=$((TOTAL_TIME / 60))
TOTAL_SECONDS=$((TOTAL_TIME % 60))
echo "   - Total Time: ${TOTAL_TIME}s (${TOTAL_MINUTES}m ${TOTAL_SECONDS}s)"
echo ""
echo "📁 Build Output: .next/"
echo ""
echo "🎯 Expected Amplify Build Time:"
if [ $TOTAL_TIME -lt 180 ]; then
    echo -e "   ${GREEN}✅ ${TOTAL_TIME}s - Excellent! (Target: 2-3 minutes)${NC}"
elif [ $TOTAL_TIME -lt 240 ]; then
    echo -e "   ${GREEN}✅ ${TOTAL_TIME}s - Good! (Target: 2-3 minutes)${NC}"
else
    echo -e "   ${YELLOW}⚠️  ${TOTAL_TIME}s - May take longer on Amplify${NC}"
fi
echo ""
echo "💡 Next Steps:"
echo "   1. Review the build output above"
echo "   2. Test locally: npm run start"
echo "   3. If everything looks good, push to GitHub"
echo "   4. Monitor Amplify build (should be similar timing)"
echo ""

