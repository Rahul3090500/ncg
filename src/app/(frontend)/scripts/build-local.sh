#!/bin/bash

# Local Build Script - Mimics AWS Amplify Build Process
# This allows you to test builds locally before pushing to production
# Usage: ./scripts/build-local.sh

set -e  # Exit on any error

echo "🚀 Starting Local Build (Amplify Simulation)"
echo "=============================================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Step 1: Check Node/npm versions
echo "📋 Step 1: Checking Node.js and npm versions..."
node --version
npm --version
echo ""

# Step 2: Clean install (mimics npm ci)
echo "📦 Step 2: Installing dependencies (npm ci)..."
if npm ci --legacy-peer-deps --prefer-offline --no-audit --no-fund --loglevel=error; then
    echo -e "${GREEN}✅ Dependencies installed successfully${NC}"
else
    echo -e "${RED}❌ Dependency installation failed${NC}"
    exit 1
fi
echo ""

# Step 3: Setup environment variables (optional - for testing)
echo "🔧 Step 3: Setting up environment..."
if [ -f .env.production.local ]; then
    echo "   Using .env.production.local"
elif [ -f .env.local ]; then
    echo "   Using .env.local"
else
    echo "   ⚠️  No .env.production.local or .env.local found"
    echo "   Build will use default environment variables"
fi
echo ""

# Step 4: Build (mimics Amplify build command)
echo "🏗️  Step 4: Building Next.js application..."
echo "   Command: NEXT_TELEMETRY_DISABLED=1 npm run build"
echo ""

if NEXT_TELEMETRY_DISABLED=1 npm run build; then
    echo ""
    echo -e "${GREEN}✅ Build completed successfully!${NC}"
    echo ""
    echo "📊 Build Summary:"
    echo "   - Dependencies: ✅ Installed"
    echo "   - Build: ✅ Successful"
    echo "   - Output: .next/"
    echo ""
    echo "🎉 Your code is ready to push to production!"
    echo ""
    echo "💡 Next steps:"
    echo "   1. Review the build output above"
    echo "   2. Test locally: npm run start"
    echo "   3. If everything looks good, push to GitHub"
    echo ""
    exit 0
else
    echo ""
    echo -e "${RED}❌ Build failed!${NC}"
    echo ""
    echo "🔍 Troubleshooting:"
    echo "   1. Check the error messages above"
    echo "   2. Fix any TypeScript errors"
    echo "   3. Fix any missing dependencies"
    echo "   4. Run this script again"
    echo ""
    exit 1
fi
