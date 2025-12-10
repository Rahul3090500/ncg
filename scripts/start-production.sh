#!/bin/bash

# Production Start Script
# Ensures zero-downtime deployment and high availability

set -e

echo "🚀 Starting NCG Backend in Production Mode..."

# Create logs directory if it doesn't exist
mkdir -p logs

# Check if PM2 is installed
if ! command -v pm2 &> /dev/null; then
    echo "❌ PM2 is not installed. Installing..."
    npm install -g pm2
fi

# Stop existing instances gracefully
echo "🛑 Stopping existing instances..."
pm2 stop ncg-backend 2>/dev/null || true
pm2 delete ncg-backend 2>/dev/null || true

# Wait for graceful shutdown
sleep 2

# Start with PM2
echo "✅ Starting with PM2 cluster mode..."
pm2 start ecosystem.config.js --env production

# Save PM2 configuration
pm2 save

# Setup PM2 startup script (survives server restarts)
pm2 startup

# Show status
pm2 status

echo "✅ Production server started successfully!"
echo "📊 Monitor with: pm2 monit"
echo "📝 View logs with: pm2 logs ncg-backend"
echo "🔄 Restart with: pm2 restart ncg-backend"
echo "🛑 Stop with: pm2 stop ncg-backend"

