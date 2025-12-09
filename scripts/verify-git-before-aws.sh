#!/bin/bash

# Git Verification Script - Verify Everything Before AWS Console Actions
# This script verifies all code optimizations are committed and ready for AWS
# Usage: ./scripts/verify-git-before-aws.sh

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

echo -e "${BLUE}🔍 Git Verification - Pre-AWS Console Check${NC}"
echo "================================================================"
echo ""

# ============================================
# PHASE 1: GIT STATUS CHECK
# ============================================
echo -e "${YELLOW}📋 Phase 1: Git Status Check${NC}"
echo "-------------------"

# Check if we're on main branch
CURRENT_BRANCH=$(git branch --show-current)
if [ "$CURRENT_BRANCH" = "main" ] || [ "$CURRENT_BRANCH" = "master" ]; then
    echo -e "${GREEN}✅ PASS: On main branch ($CURRENT_BRANCH)${NC}"
    CHECKS_PASSED=$((CHECKS_PASSED + 1))
else
    echo -e "${RED}❌ FAIL: Not on main branch (current: $CURRENT_BRANCH)${NC}"
    echo "   Switch to main: git checkout main"
    CHECKS_FAILED=$((CHECKS_FAILED + 1))
fi

# Check if working directory is clean
if git diff --quiet && git diff --cached --quiet; then
    echo -e "${GREEN}✅ PASS: Working directory is clean${NC}"
    CHECKS_PASSED=$((CHECKS_PASSED + 1))
else
    echo -e "${YELLOW}⚠️  WARN: Working directory has uncommitted changes${NC}"
    echo ""
    echo "   Uncommitted files:"
    git status --short | sed 's/^/     /'
    echo ""
    echo "   Run: git status (to see details)"
    WARNINGS=$((WARNINGS + 1))
fi

# Check if branch is up to date with remote
if git diff --quiet HEAD origin/main 2>/dev/null || git diff --quiet HEAD origin/master 2>/dev/null; then
    echo -e "${GREEN}✅ PASS: Branch is up to date with remote${NC}"
    CHECKS_PASSED=$((CHECKS_PASSED + 1))
else
    echo -e "${YELLOW}⚠️  WARN: Branch is not up to date with remote${NC}"
    echo "   Run: git push origin $CURRENT_BRANCH"
    WARNINGS=$((WARNINGS + 1))
fi

echo ""

# ============================================
# PHASE 2: AMPLIFY.YML VERIFICATION
# ============================================
echo -e "${YELLOW}📋 Phase 2: amplify.yml Verification${NC}"
echo "-------------------"

# Check if amplify.yml exists
if [ -f "amplify.yml" ]; then
    echo -e "${GREEN}✅ PASS: amplify.yml exists${NC}"
    CHECKS_PASSED=$((CHECKS_PASSED + 1))
else
    echo -e "${RED}❌ FAIL: amplify.yml not found${NC}"
    CHECKS_FAILED=$((CHECKS_FAILED + 1))
    echo ""
fi

# Check if branch filtering is in amplify.yml
if grep -q "AWS_BRANCH.*main" amplify.yml; then
    echo -e "${GREEN}✅ PASS: Branch filtering configured in amplify.yml${NC}"
    CHECKS_PASSED=$((CHECKS_PASSED + 1))
else
    echo -e "${RED}❌ FAIL: Branch filtering not found in amplify.yml${NC}"
    CHECKS_FAILED=$((CHECKS_FAILED + 1))
fi

# Check if fast npm install flags are present
if grep -q "maxsockets" amplify.yml; then
    echo -e "${GREEN}✅ PASS: Fast npm install flags configured${NC}"
    CHECKS_PASSED=$((CHECKS_PASSED + 1))
else
    echo -e "${RED}❌ FAIL: Fast npm install flags not found${NC}"
    CHECKS_FAILED=$((CHECKS_FAILED + 1))
fi

# Check if caching is configured
if grep -q "node_modules/\*\*/\*" amplify.yml; then
    echo -e "${GREEN}✅ PASS: Caching configured in amplify.yml${NC}"
    CHECKS_PASSED=$((CHECKS_PASSED + 1))
else
    echo -e "${RED}❌ FAIL: Caching not configured${NC}"
    CHECKS_FAILED=$((CHECKS_FAILED + 1))
fi

# Check if amplify.yml is tracked by git
if git ls-files --error-unmatch amplify.yml > /dev/null 2>&1; then
    echo -e "${GREEN}✅ PASS: amplify.yml is tracked by git${NC}"
    CHECKS_PASSED=$((CHECKS_PASSED + 1))
    
    # Check if amplify.yml has uncommitted changes
    if git diff --quiet amplify.yml 2>/dev/null; then
        echo -e "${GREEN}✅ PASS: amplify.yml is committed${NC}"
        CHECKS_PASSED=$((CHECKS_PASSED + 1))
    else
        echo -e "${YELLOW}⚠️  WARN: amplify.yml has uncommitted changes${NC}"
        echo "   Run: git add amplify.yml && git commit -m 'feat: Add branch filtering and optimizations'"
        WARNINGS=$((WARNINGS + 1))
    fi
else
    echo -e "${RED}❌ FAIL: amplify.yml is not tracked by git${NC}"
    CHECKS_FAILED=$((CHECKS_FAILED + 1))
fi

echo ""

# ============================================
# PHASE 3: REMOTE VERIFICATION
# ============================================
echo -e "${YELLOW}📋 Phase 3: Remote Repository Check${NC}"
echo "-------------------"

# Check if remote is configured
if git remote | grep -q "origin"; then
    REMOTE_URL=$(git remote get-url origin)
    echo -e "${GREEN}✅ PASS: Remote 'origin' configured${NC}"
    echo "   URL: $REMOTE_URL"
    CHECKS_PASSED=$((CHECKS_PASSED + 1))
else
    echo -e "${RED}❌ FAIL: No remote 'origin' configured${NC}"
    CHECKS_FAILED=$((CHECKS_FAILED + 1))
fi

# Check if we can reach remote
if git ls-remote --heads origin main > /dev/null 2>&1 || git ls-remote --heads origin master > /dev/null 2>&1; then
    echo -e "${GREEN}✅ PASS: Can reach remote repository${NC}"
    CHECKS_PASSED=$((CHECKS_PASSED + 1))
else
    echo -e "${YELLOW}⚠️  WARN: Cannot reach remote repository${NC}"
    echo "   Check your internet connection and Git credentials"
    WARNINGS=$((WARNINGS + 1))
fi

echo ""

# ============================================
# PHASE 4: RECENT COMMITS CHECK
# ============================================
echo -e "${YELLOW}📋 Phase 4: Recent Commits Check${NC}"
echo "-------------------"

# Check recent commits
RECENT_COMMITS=$(git log --oneline -5)
echo "Recent commits:"
echo "$RECENT_COMMITS" | sed 's/^/   /'

# Check if amplify.yml was recently modified
if git log --oneline --all -10 | grep -i "amplify\|branch\|filter\|optimize" > /dev/null; then
    echo -e "${GREEN}✅ PASS: Found recent optimization-related commits${NC}"
    CHECKS_PASSED=$((CHECKS_PASSED + 1))
else
    echo -e "${YELLOW}⚠️  WARN: No recent optimization-related commits found${NC}"
    WARNINGS=$((WARNINGS + 1))
fi

echo ""

# ============================================
# PHASE 5: FILE VERIFICATION
# ============================================
echo -e "${YELLOW}📋 Phase 5: Required Files Check${NC}"
echo "-------------------"

# Check required files
REQUIRED_FILES=("amplify.yml" "next.config.mjs" "package.json" "scripts/build-local.sh")
for file in "${REQUIRED_FILES[@]}"; do
    if [ -f "$file" ]; then
        echo -e "${GREEN}✅ PASS: $file exists${NC}"
        CHECKS_PASSED=$((CHECKS_PASSED + 1))
    else
        echo -e "${RED}❌ FAIL: $file not found${NC}"
        CHECKS_FAILED=$((CHECKS_FAILED + 1))
    fi
done

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
    echo -e "${BLUE}📈 Git Readiness: ${PERCENTAGE}%${NC}"
    echo ""
fi

# Recommendations
if [ $CHECKS_FAILED -eq 0 ] && [ $WARNINGS -eq 0 ]; then
    echo -e "${GREEN}✅ All checks passed! Ready for AWS Console actions.${NC}"
    echo ""
    echo "📋 Next Steps:"
    echo "   1. ✅ Code is committed and pushed"
    echo "   2. ✅ Ready for AWS Console configuration"
    echo "   3. Follow: AWS_CONSOLE_ACTION_GUIDE.md"
elif [ $CHECKS_FAILED -eq 0 ]; then
    echo -e "${YELLOW}⚠️  Almost ready, but has warnings.${NC}"
    echo ""
    echo "📋 Fix Warnings:"
    if git diff --quiet amplify.yml 2>/dev/null; then
        echo "   ✅ amplify.yml is committed"
    else
        echo "   ⚠️  Commit amplify.yml:"
        echo "      git add amplify.yml"
        echo "      git commit -m 'feat: Add branch filtering and optimizations'"
    fi
    
    if git diff --quiet scripts/build-local.sh 2>/dev/null; then
        echo "   ✅ build-local.sh is committed"
    else
        echo "   ⚠️  Commit build-local.sh:"
        echo "      git add scripts/build-local.sh"
        echo "      git commit -m 'chore: Update build-local.sh'"
    fi
    
    if [ -f "scripts/verify-amplify-setup.sh" ] && git ls-files --error-unmatch scripts/verify-amplify-setup.sh > /dev/null 2>&1; then
        echo "   ✅ verify-amplify-setup.sh is tracked"
    else
        echo "   ⚠️  Add verify-amplify-setup.sh:"
        echo "      git add scripts/verify-amplify-setup.sh"
        echo "      git commit -m 'chore: Add verification script'"
    fi
    
    echo ""
    echo "   Then push: git push origin main"
    echo ""
    echo "   After pushing, you're ready for AWS Console actions!"
else
    echo -e "${RED}❌ Some checks failed. Please fix the issues above.${NC}"
    echo ""
    echo "📋 Fix Issues:"
    echo "   - Review failed checks above"
    echo "   - Fix issues in code"
    echo "   - Run this script again to verify"
fi

echo ""
echo "🔗 After Git is Ready:"
echo "   1. Follow: AWS_CONSOLE_ACTION_GUIDE.md"
echo "   2. Verify branch filtering in AWS Amplify Console"
echo "   3. Delete unused Amplify environments"
echo "   4. Set up budget alerts"
echo ""

# Show uncommitted changes summary
if ! git diff --quiet || ! git diff --cached --quiet; then
    echo "📝 Uncommitted Changes Summary:"
    echo "-------------------"
    git status --short | sed 's/^/   /'
    echo ""
fi

# Exit with appropriate code
if [ $CHECKS_FAILED -eq 0 ]; then
    exit 0
else
    exit 1
fi

