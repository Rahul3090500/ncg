/**
 * Bundle Analyzer Configuration
 * 
 * Helps identify large dependencies and optimize bundle size
 */

export const bundleAnalyzerConfig = {
  enabled: process.env.ANALYZE === 'true',
  openAnalyzer: false,
}

