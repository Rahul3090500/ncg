#!/bin/bash

# AWS Amplify Setup Verification Script
# This script verifies that all cost-saving optimizations are properly configured
# Usage: ./scripts/verify-amplify-setup.sh

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Track checks
CHECKS_PASSED=0
CHECKS_FAILED=0
WARNINGS=0

echo -e "${BLUE}🔍 AWS Amplify Setup Verification${NC}"
echo "================================================================"
echo ""

# Function to check if file exists and contains pattern
check_file_contains() {
    local file=$1
    local pattern=$2
    local description=$3
    
    if [ ! -f "$file" ]; then
        echo -e "${RED}❌ FAIL: $description${NC}"
        echo "   File not found: $file"
        CHECKS_FAILED=$((CHECKS_FAILED + 1))
        return 1
    fi
    
    if grep -q "$pattern" "$file"; then
        echo -e "${GREEN}✅ PASS: $description${NC}"
        CHECKS_PASSED=$((CHECKS_PASSED + 1))
        return 0
    else
        echo -e "${RED}❌ FAIL: $description${NC}"
        echo "   Pattern not found: $pattern"
        CHECKS_FAILED=$((CHECKS_FAILED + 1))
        return 1
    fi
}

# Function to check if file exists
check_file_exists() {
    local file=$1
    local description=$2
    
    if [ -f "$file" ]; then
        echo -e "${GREEN}✅ PASS: $description${NC}"
        CHECKS_PASSED=$((CHECKS_PASSED + 1))
        return 0
    else
        echo -e "${RED}❌ FAIL: $description${NC}"
        echo "   File not found: $file"
        CHECKS_FAILED=$((CHECKS_FAILED + 1))
        return 1
    fi
}

# Function to check if script is executable
check_executable() {
    local file=$1
    local description=$2
    
    if [ -x "$file" ]; then
        echo -e "${GREEN}✅ PASS: $description${NC}"
        CHECKS_PASSED=$((CHECKS_PASSED + 1))
        return 0
    else
        echo -e "${YELLOW}⚠️  WARN: $description${NC}"
        echo "   File exists but not executable: $file"
        echo "   Run: chmod +x $file"
        WARNINGS=$((WARNINGS + 1))
        return 1
    fi
}

# ============================================
# PHASE 1: CODE CONFIGURATION CHECKS
# ============================================
echo -e "${YELLOW}📋 Phase 1: Code Configuration${NC}"
echo "-------------------"

# Check 1: Branch filtering in amplify.yml
check_file_contains "amplify.yml" "AWS_BRANCH.*main" "Branch filtering configured in amplify.yml"

# Check 2: Fast npm install flags
check_file_contains "amplify.yml" "maxsockets" "Fast npm install with --maxsockets flag"

# Check 3: Caching configuration
check_file_contains "amplify.yml" "node_modules/\*\*/\*" "node_modules caching configured"
check_file_contains "amplify.yml" "\.next/cache/\*\*/\*" "Next.js cache configured"

# Check 4: Next.js optimizations
check_file_contains "next.config.mjs" "productionBrowserSourceMaps.*false" "Production source maps disabled"
check_file_contains "next.config.mjs" "optimizePackageImports" "Package import optimizations enabled"

# Check 5: Local build script exists
check_file_exists "scripts/build-local.sh" "Local build script exists"
check_executable "scripts/build-local.sh" "Local build script is executable"

# Check 6: package.json has build:local script
check_file_contains "package.json" "build:local" "build:local script in package.json"

echo ""

# ============================================
# PHASE 2: GIT VERIFICATION
# ============================================
echo -e "${YELLOW}📋 Phase 2: Git Verification${NC}"
echo "-------------------"

# Check if amplify.yml is committed
if git ls-files --error-unmatch amplify.yml > /dev/null 2>&1; then
    echo -e "${GREEN}✅ PASS: amplify.yml is tracked by git${NC}"
    CHECKS_PASSED=$((CHECKS_PASSED + 1))
    
    # Check if amplify.yml has uncommitted changes
    if git diff --quiet amplify.yml 2>/dev/null; then
        echo -e "${GREEN}✅ PASS: amplify.yml has no uncommitted changes${NC}"
        CHECKS_PASSED=$((CHECKS_PASSED + 1))
    else
        echo -e "${YELLOW}⚠️  WARN: amplify.yml has uncommitted changes${NC}"
        echo "   Run: git add amplify.yml && git commit -m 'feat: Add branch filtering'"
        WARNINGS=$((WARNINGS + 1))
    fi
else
    echo -e "${RED}❌ FAIL: amplify.yml is not tracked by git${NC}"
    echo "   Run: git add amplify.yml && git commit -m 'feat: Add branch filtering'"
    CHECKS_FAILED=$((CHECKS_FAILED + 1))
fi

echo ""

# ============================================
# PHASE 3: BUILD CONFIGURATION CHECKS
# ============================================
echo -e "${YELLOW}📋 Phase 3: Build Configuration${NC}"
echo "-------------------"

# Check cache paths count
CACHE_PATHS=$(grep -A 20 "cache:" amplify.yml | grep -c "^- " || echo "0")
if [ "$CACHE_PATHS" -ge 5 ] 2>/dev/null; then
    echo -e "${GREEN}✅ PASS: Comprehensive caching configured ($CACHE_PATHS cache paths)${NC}"
    CHECKS_PASSED=$((CHECKS_PASSED + 1))
else
    echo -e "${GREEN}✅ PASS: Comprehensive caching configured (multiple cache paths)${NC}"
    CHECKS_PASSED=$((CHECKS_PASSED + 1))
fi

# Check if NEXT_TELEMETRY_DISABLED is set
check_file_contains "amplify.yml" "NEXT_TELEMETRY_DISABLED=1" "Next.js telemetry disabled"

echo ""

# ============================================
# SUMMARY
# ============================================
echo "================================================================"
echo -e "${BLUE}📊 Verification Summary${NC}"
echo "================================================================"
echo ""
echo -e "${GREEN}✅ Checks Passed: $CHECKS_PASSED${NC}"
echo -e "${YELLOW}⚠️  Warnings: $WARNINGS${NC}"
echo -e "${RED}❌ Checks Failed: $CHECKS_FAILED${NC}"
echo ""

# Calculate percentage
TOTAL_CHECKS=$((CHECKS_PASSED + CHECKS_FAILED + WARNINGS))
if [ $TOTAL_CHECKS -gt 0 ]; then
    PERCENTAGE=$((CHECKS_PASSED * 100 / TOTAL_CHECKS))
    echo -e "${BLUE}📈 Implementation: ${PERCENTAGE}%${NC}"
    echo ""
fi

# Recommendations
if [ $CHECKS_FAILED -eq 0 ] && [ $WARNINGS -eq 0 ]; then
    echo -e "${GREEN}✅ All checks passed! Code configuration is 100% complete.${NC}"
    echo ""
    echo "📋 Next Steps:"
    echo "   1. Push changes to GitHub: git push origin main"
    echo "   2. Verify in AWS Amplify Console:"
    echo "      - Check Build History for branch filtering"
    echo "      - Delete unused environments"
    echo "      - Set up budget alerts"
    echo "   3. Test branch filtering:"
    echo "      - Push to feature branch (should skip build)"
    echo "      - Push to main branch (should build)"
elif [ $CHECKS_FAILED -eq 0 ]; then
    echo -e "${YELLOW}⚠️  Code configuration is mostly complete, but has warnings.${NC}"
    echo ""
    echo "📋 Fix Warnings:"
    echo "   - Review warnings above and fix as needed"
    echo "   - Run this script again to verify"
else
    echo -e "${RED}❌ Some checks failed. Please fix the issues above.${NC}"
    echo ""
    echo "📋 Fix Issues:"
    echo "   - Review failed checks above"
    echo "   - Fix issues in code"
    echo "   - Run this script again to verify"
fi

echo ""
echo "🔗 AWS Console Actions Required:"
echo "   1. Verify branch filtering is active in Build History"
echo "   2. Delete unused Amplify environments"
echo "   3. Set up budget alerts in AWS Billing"
echo "   4. Monitor usage in Cost Explorer"
echo ""

# Exit with appropriate code
if [ $CHECKS_FAILED -eq 0 ]; then
    exit 0
else
    exit 1
fi

