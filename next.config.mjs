import { withPayload } from '@payloadcms/next/withPayload'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Performance optimizations
  compress: true, // Enable gzip compression
  poweredByHeader: false, // Remove X-Powered-By header
  reactStrictMode: true, // Enable React strict mode
  // swcMinify removed - SWC minification is now default in Next.js 15
  
  // Build optimizations for faster builds
  typescript: {
    ignoreBuildErrors: true, // Skip type checking during build (faster)
    tsconfigPath: './tsconfig.json', // Explicit path
  },
  eslint: {
    ignoreDuringBuilds: true, // Skip ESLint during build (faster)
  },
  
  // Additional build speed optimizations
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production' ? {
      exclude: ['error', 'warn'], // Keep error and warn logs
    } : false,
  },
  
  // Enable standalone output for Docker and PM2
  output: 'standalone',
  
  // Image optimization
  images: {
    formats: ['image/avif', 'image/webp'], // Modern formats
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60 * 60 * 24 * 7, // 7 days
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '3000',
        pathname: '/api/media/**',
      },
      {
        protocol: 'https',
        hostname: '**',
        pathname: '/api/media/**',
      },
    ],
    unoptimized: false,
  },
  
  // External packages for server components
  serverExternalPackages: ['@payloadcms/db-postgres', 'sharp'],
  
  // Experimental features for performance
  experimental: {
    // nodeMiddleware: true, // Disabled - requires Next.js canary version (not stable)
    // optimizeCss: true, // Disabled - requires critters package
    optimizePackageImports: [
      'framer-motion',
      '@payloadcms/next',
      'lucide-react',
      'swiper',
      'gsap',
    ],
    // Note: turbo config moved to turbopack (now stable in Next.js 15)
    // SVG handling is now handled by webpack config below
  },
  
  // Optimize build performance
  // swcMinify removed - SWC minification is now default in Next.js 15
  productionBrowserSourceMaps: false, // Disable source maps in production for faster builds
  
  webpack: (webpackConfig) => {
    webpackConfig.resolve.extensionAlias = {
      '.cjs': ['.cts', '.cjs'],
      '.js': ['.ts', '.tsx', '.js', '.jsx'],
      '.mjs': ['.mts', '.mjs'],
    }
    
    // Add aliases for path resolution (matches tsconfig.json paths)
    webpackConfig.resolve.alias = {
      ...webpackConfig.resolve.alias,
      '@': path.resolve(__dirname, 'src'),
      '@admin': path.resolve(__dirname, 'src/app/(payload)/admin'),
      '@payload-config': path.resolve(__dirname, 'src/payload.config.ts'),
    }

    return webpackConfig
  },
  
  // Headers for multi-region support and performance
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY'
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block'
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin'
          },
        ],
      },
      {
        source: '/api/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, s-maxage=60, stale-while-revalidate=300',
          },
        ],
      },
      {
        source: '/_next/static/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ]
  },
}

export default withPayload(nextConfig, { devBundleServerPackages: false })
