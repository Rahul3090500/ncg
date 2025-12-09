/**
 * PM2 Ecosystem Configuration
 * 
 * High-availability configuration for 1000+ concurrent users
 * - Zero-downtime deployments
 * - Automatic restarts on crashes
 * - Load balancing across multiple instances
 * - Health monitoring
 */

module.exports = {
  apps: [
    {
      name: 'ncg-backend',
      script: 'node_modules/.bin/next',
      args: 'start',
      instances: process.env.PM2_INSTANCES || 2, // Default to 2 instances to prevent connection exhaustion (can override with PM2_INSTANCES env var)
      exec_mode: 'cluster', // Cluster mode for load balancing across regions
      autorestart: true, // Auto-restart on crash
      watch: false, // Don't watch files in production
      max_memory_restart: '4G', // Increased for 10,000+ concurrent users
      env: {
        NODE_ENV: 'production',
        PORT: 3000,
      },
      env_production: {
        NODE_ENV: 'production',
        PORT: 3000,
      },
      // Health check configuration
      health_check_grace_period: 3000, // 3 seconds grace period
      health_check_fatal_exceptions: true,
      
      // Logging
      error_file: './logs/pm2-error.log',
      out_file: './logs/pm2-out.log',
      log_file: './logs/pm2-combined.log',
      time: true,
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      merge_logs: true,
      
      // Advanced PM2 features
      min_uptime: '10s', // Minimum uptime before considering app stable
      max_restarts: 10, // Max restarts in 1 minute
      restart_delay: 4000, // Wait 4 seconds before restarting
      
      // Kill timeout
      kill_timeout: 5000, // Wait 5 seconds for graceful shutdown
      
      // Instance management
      wait_ready: true, // Wait for ready signal
      listen_timeout: 10000, // Wait 10 seconds for app to start listening
      
      // Auto-reload on file changes (development only)
      ignore_watch: [
        'node_modules',
        'logs',
        '.next',
        '.git',
        '*.log',
      ],
    },
  ],
}

