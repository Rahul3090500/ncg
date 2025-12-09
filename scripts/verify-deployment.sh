#!/bin/bash

# Deployment Verification Script
# Verifies that deployment is successful and production is working correctly

set -e

echo "🔍 Starting Deployment Verification..."
echo ""

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration
PRODUCTION_URL="${PRODUCTION_URL:-https://main.d1b4y595gzn5fd.amplifyapp.com}"
ADMIN_ENDPOINT="${PRODUCTION_URL}/admin"

# Function to print success
success() {
    echo -e "${GREEN}✅ $1${NC}"
}

# Function to print error
error() {
    echo -e "${RED}❌ $1${NC}"
}

# Function to print warning
warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

# Check if URL is accessible
check_url() {
    local url=$1
    local name=$2
    
    echo "Checking $name..."
    if curl -f -s -o /dev/null -w "%{http_code}" "$url" | grep -q "200\|301\|302"; then
        success "$name is accessible"
        return 0
    else
        error "$name is not accessible"
        return 1
    fi
}

# Check response time
check_response_time() {
    local url=$1
    local name=$2
    local max_time=${3:-5000} # Default 5 seconds
    
    echo "Checking $name response time..."
    local start_time=$(date +%s%N)
    curl -f -s -o /dev/null "$url" > /dev/null 2>&1
    local end_time=$(date +%s%N)
    local duration=$(( (end_time - start_time) / 1000000 )) # Convert to milliseconds
    
    if [ $duration -lt $max_time ]; then
        success "$name response time: ${duration}ms (target: <${max_time}ms)"
        return 0
    else
        warning "$name response time: ${duration}ms (target: <${max_time}ms)"
        return 1
    fi
}

# Check environment variables
check_env_vars() {
    echo ""
    echo "📋 Checking Environment Variables..."
    
    if [ -z "$DATABASE_URI" ]; then
        error "DATABASE_URI is not set"
    else
        success "DATABASE_URI is set"
    fi
    
    if [ -z "$PAYLOAD_SECRET" ]; then
        error "PAYLOAD_SECRET is not set"
    else
        success "PAYLOAD_SECRET is set"
    fi
    
    if [ "$NODE_ENV" != "production" ]; then
        warning "NODE_ENV is not set to 'production' (current: ${NODE_ENV:-not set})"
    else
        success "NODE_ENV is set to 'production'"
    fi
}

# Main verification
main() {
    echo "🚀 Deployment Verification for: $PRODUCTION_URL"
    echo ""
    
    # Check environment variables
    check_env_vars
    
    # Check homepage
    echo ""
    echo "🌐 Checking Website Accessibility..."
    if check_url "$PRODUCTION_URL" "Homepage"; then
        check_response_time "$PRODUCTION_URL" "Homepage" 3000
    fi
    
    # Check admin panel
    echo ""
    echo "🔐 Checking Admin Panel..."
    if check_url "$ADMIN_ENDPOINT" "Admin Panel"; then
        check_response_time "$ADMIN_ENDPOINT" "Admin Panel" 5000
    fi
    
    # Summary
    echo ""
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo "📊 Verification Summary"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo ""
    echo "Production URL: $PRODUCTION_URL"
    echo "Admin Panel: $ADMIN_ENDPOINT"
    echo ""
    echo "✅ Verification completed!"
    echo ""
    echo "Next steps:"
    echo "1. Check AWS Amplify build logs for any warnings"
    echo "2. Monitor RDS connections: npm run check:connections"
    echo "3. Test critical user flows on production site"
    echo ""
}

# Run verification
main

