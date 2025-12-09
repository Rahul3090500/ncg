#!/bin/bash

# Zero-Downtime Deployment Script
# Ensures continuous availability during deployments

set -e

echo "🚀 Starting Zero-Downtime Deployment..."

# Build the application
echo "📦 Building application..."
npm run build

# Check if PM2 is installed
if ! command -v pm2 &> /dev/null; then
    echo "❌ PM2 is not installed. Installing..."
    npm install -g pm2
fi

# Reload PM2 instances (zero-downtime reload)
echo "🔄 Reloading PM2 instances (zero-downtime)..."
pm2 reload ecosystem.config.js --update-env

# Wait for instances to be ready
echo "⏳ Waiting for instances to be ready..."
sleep 5

# Health check
echo "🏥 Performing health check..."
MAX_RETRIES=10
RETRY_COUNT=0

while [ $RETRY_COUNT -lt $MAX_RETRIES ]; do
    if curl -f http://localhost:3000 > /dev/null 2>&1; then
        echo "✅ Application is responding!"
        break
    fi
    
    RETRY_COUNT=$((RETRY_COUNT + 1))
    echo "⏳ Health check failed. Retrying... ($RETRY_COUNT/$MAX_RETRIES)"
    sleep 2
done

if [ $RETRY_COUNT -eq $MAX_RETRIES ]; then
    echo "❌ Health check failed after $MAX_RETRIES attempts"
    echo "🔄 Rolling back..."
    pm2 reload ecosystem.config.js --update-env
    exit 1
fi

# Save PM2 configuration
pm2 save

echo "✅ Zero-downtime deployment completed successfully!"
pm2 status

