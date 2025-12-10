#!/bin/bash

# Vercel Logs Viewer Script
# Easily view Vercel deployment logs

set -e

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

log() {
  echo -e "$1"
}

logSection() {
  log "\n${BLUE}═══════════════════════════════════════════════════════════${NC}"
  log "${BLUE}$1${NC}"
  log "${BLUE}═══════════════════════════════════════════════════════════${NC}\n"
}

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
  log "${RED}❌ Vercel CLI not found!${NC}"
  log "\nInstalling Vercel CLI..."
  npm install -g vercel@latest || {
    log "${YELLOW}Global install failed, trying local...${NC}"
    npm install --save-dev vercel@latest
    log "${GREEN}✅ Vercel CLI installed locally${NC}"
    log "${YELLOW}Note: Use 'npx vercel' instead of 'vercel'${NC}"
    exit 1
  }
  log "${GREEN}✅ Vercel CLI installed${NC}"
fi

# Check if logged in
if ! vercel whoami &> /dev/null; then
  logSection "Vercel Login Required"
  log "You need to login to Vercel first."
  log "Run: ${GREEN}vercel login${NC}"
  exit 1
fi

# Parse command line arguments
MODE="${1:-recent}"
FOLLOW="${2:-false}"

logSection "Vercel Logs Viewer"

case "$MODE" in
  recent|latest|last)
    log "${GREEN}📋 Fetching latest deployment logs...${NC}\n"
    if [ "$FOLLOW" = "follow" ] || [ "$FOLLOW" = "-f" ]; then
      vercel logs --follow
    else
      vercel logs --limit 100
    fi
    ;;
  
  deployments|deploys|list)
    log "${GREEN}📋 Listing recent deployments...${NC}\n"
    vercel ls
    ;;
  
  status|inspect)
    log "${GREEN}📋 Inspecting latest deployment...${NC}\n"
    vercel inspect
    ;;
  
  open)
    log "${GREEN}🌐 Opening Vercel dashboard...${NC}\n"
    vercel open
    ;;
  
  env|environment)
    log "${GREEN}🔐 Listing environment variables...${NC}\n"
    vercel env ls
    ;;
  
  help|--help|-h)
    log "${GREEN}Usage:${NC}"
    log "  ./scripts/vercel-logs.sh [command] [options]"
    log ""
    log "${GREEN}Commands:${NC}"
    log "  recent, latest, last    - View latest deployment logs (default)"
    log "  follow, -f              - Follow logs in real-time"
    log "  deployments, deploys    - List recent deployments"
    log "  status, inspect         - Inspect latest deployment"
    log "  open                    - Open Vercel dashboard"
    log "  env, environment        - List environment variables"
    log "  help                    - Show this help"
    log ""
    log "${GREEN}Examples:${NC}"
    log "  ./scripts/vercel-logs.sh                    # View recent logs"
    log "  ./scripts/vercel-logs.sh recent follow      # Follow logs"
    log "  ./scripts/vercel-logs.sh deployments        # List deployments"
    log "  ./scripts/vercel-logs.sh status             # Check status"
    log ""
    log "${GREEN}Or use npm scripts:${NC}"
    log "  npm run vercel:logs              # View logs"
    log "  npm run vercel:logs:follow       # Follow logs"
    log "  npm run vercel:deployments       # List deployments"
    log "  npm run vercel:status            # Check status"
    log "  npm run vercel:open               # Open dashboard"
    log "  npm run vercel:env                # List env vars"
    ;;
  
  *)
    log "${RED}❌ Unknown command: $MODE${NC}"
    log "Run: ${GREEN}./scripts/vercel-logs.sh help${NC}"
    exit 1
    ;;
esac

