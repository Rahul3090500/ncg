import { postgresAdapter } from '@payloadcms/db-postgres'
import { payloadCloudPlugin } from '@payloadcms/payload-cloud'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { s3Storage } from '@payloadcms/storage-s3'
import path from 'path'
import fs from 'fs'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

import { Users } from './collections/Users'
import { Media } from './collections/Media'
import { CaseStudies } from './collections/CaseStudies'
import { Blogs } from './collections/Blogs'
import { Icons } from './collections/Icons'
import { JobOpenings } from './collections/JobOpenings'
import { JobApplications } from './collections/JobApplications'
import { Services } from './collections/Services'
import { SubServices } from './collections/SubServices'
import { HeroSection } from './globals/HeroSection'
import { ServicesSection } from './globals/ServicesSection'
import { TrustedBySection } from './globals/TrustedBySection'
import { CaseStudiesHeroSection } from './globals/CaseStudiesHeroSection'
import { CaseStudiesGridSection } from './globals/CaseStudiesGridSection'
import { CaseStudiesPageSection } from './globals/CaseStudiesPageSection'
import { TestimonialsSection } from './globals/TestimonialsSection'
import { ApproachSection } from './globals/ApproachSection'
import { ContactSection } from './globals/ContactSection'
import { FooterSection } from './globals/FooterSection'
import { AboutHeroSection } from './globals/AboutHeroSection'
import { AboutUsSection } from './globals/AboutUsSection'
import { AboutStatsSection } from './globals/AboutStatsSection'
import { AboutMissionSection } from './globals/AboutMissionSection'
import { AboutCoreValuesSection } from './globals/AboutCoreValuesSection'
import { AboutTeamSection } from './globals/AboutTeamSection'
import { AboutCTASection } from './globals/AboutCTASection'
import { BlogsPageHeroSection } from './globals/BlogsPageHeroSection'
import { CareerHeroSection } from './globals/CareerHeroSection'
import { CareerStatsSection } from './globals/CareerStatsSection'
import { CareerFindPlaceSection } from './globals/CareerFindPlaceSection'
import { CareerWorkHereSection } from './globals/CareerWorkHereSection'
import { CareerTestimonialsSection } from './globals/CareerTestimonialsSection'
import { CareerLifeAtNCGSection } from './globals/CareerLifeAtNCGSection'
import { CareerSpotifySection } from './globals/CareerSpotifySection'
import { CareerJobSection } from './globals/CareerJobSection'
import { JobsSection } from './globals/JobsSection'
import { PrivacyPolicySection } from './globals/PrivacyPolicySection'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)
function stripSslParams(uri?: string) {
  if (!uri) return uri
  try {
    const u = new URL(uri)
    ;['sslmode', 'sslcert', 'sslkey', 'sslrootcert'].forEach((p) => u.searchParams.delete(p))
    return u.toString()
  } catch {
    return uri
  }
}
function resolveCa() {
  const caPlain = process.env.PG_SSL_CA || ''
  if (caPlain.trim()) return caPlain
  const caBase64 = process.env.PG_SSL_CA_BASE64 || ''
  if (caBase64.trim()) return Buffer.from(caBase64.trim(), 'base64').toString('utf8')
  const caFile = process.env.PG_SSL_CA_BASE64_FILE || ''
  if (caFile.trim()) {
    const content = fs.readFileSync(path.resolve(process.cwd(), caFile.trim()), 'utf8').trim()
    return Buffer.from(content, 'base64').toString('utf8')
  }
  try {
    const fallback = fs.readFileSync(path.resolve(process.cwd(), 'infra/aws/rds-global-bundle.base64.txt'), 'utf8').trim()
    return Buffer.from(fallback, 'base64').toString('utf8')
  } catch {}
  return ''
}

const ca = resolveCa()
// Optimize SSL configuration for faster handshake
// Use CA certificate if available, otherwise use standard SSL
// rejectUnauthorized: false allows self-signed certs but still encrypts connection
const sslConfig: any = ca 
  ? { 
      ca, 
      rejectUnauthorized: false,
      // Optimize SSL handshake for faster connection
      checkServerIdentity: () => undefined, // Skip hostname verification for RDS
    } 
  : process.env.NODE_ENV === 'production' 
    ? { 
        rejectUnauthorized: false,
        checkServerIdentity: () => undefined,
      } 
    : { rejectUnauthorized: false }
const sanitizeEnv = (value?: string | null) => (value ? value.trim() : '')
const s3Bucket = sanitizeEnv(process.env.S3_BUCKET) || sanitizeEnv(process.env.AWS_S3_BUCKET) || 'ncg-storage-bucket'
const s3Region = sanitizeEnv(process.env.S3_REGION) || sanitizeEnv(process.env.AWS_REGION)
const s3AccessKeyId = sanitizeEnv(process.env.S3_ACCESS_KEY_ID) || sanitizeEnv(process.env.AWS_ACCESS_KEY_ID)
const s3SecretAccessKey = sanitizeEnv(process.env.S3_SECRET_ACCESS_KEY) || sanitizeEnv(process.env.AWS_SECRET_ACCESS_KEY)
const s3Endpoint = process.env.S3_ENDPOINT
const s3ForcePathStyle = sanitizeEnv(process.env.S3_FORCE_PATH_STYLE) === 'true'
const s3Config =
  s3Bucket && s3Region && s3AccessKeyId && s3SecretAccessKey
    ? {
        region: s3Region,
        credentials: {
          accessKeyId: s3AccessKeyId,
          secretAccessKey: s3SecretAccessKey,
        },
        ...(s3Endpoint ? { endpoint: s3Endpoint } : {}),
        ...(s3ForcePathStyle ? { forcePathStyle: true } : {}),
      }
    : null
const s3Plugin =
  s3Bucket && s3Config
    ? s3Storage({
        bucket: s3Bucket,
        config: s3Config,
        collections: {
          media: sanitizeEnv(process.env.S3_PREFIX) ? { prefix: sanitizeEnv(process.env.S3_PREFIX) } : true,
        },
      })
    : null
function resolveOrigins() {
  const raw = process.env.CORS_ORIGINS || process.env.NEXT_PUBLIC_SERVER_URL || ''
  const parts = raw.split(',').map((s) => s.trim()).filter(Boolean)
  const origins = Array.from(new Set([...parts, 'http://localhost:3000']))
  return origins
}

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
    suppressHydrationWarning: true,
    meta: {
      titleSuffix: '- NCG Admin',
      openGraph: {
        title: 'NCG Admin',
        description: 'NCG Content Management System',
        images: [
          {
            url: '/ncg-icon.svg',
          },
        ],
      },
    },
    components: {
      graphics: {
        Logo: '@/app/(payload)/admin/components/Logo#Logo',
      },
    },
  },
  collections: [Users, Media, CaseStudies, Blogs, Icons, JobOpenings, JobApplications, Services, SubServices],
  globals: [
    HeroSection,
    ServicesSection,
    TrustedBySection,
    CaseStudiesHeroSection,
    CaseStudiesGridSection,
    CaseStudiesPageSection,
    TestimonialsSection,
    ApproachSection,
    ContactSection,
    FooterSection,
    AboutHeroSection,
    AboutUsSection,
    AboutStatsSection,
    AboutMissionSection,
    AboutCoreValuesSection,
    AboutTeamSection,
    AboutCTASection,
    BlogsPageHeroSection,
    CareerHeroSection,
    CareerStatsSection,
    CareerFindPlaceSection,
    CareerWorkHereSection,
    CareerTestimonialsSection,
    CareerLifeAtNCGSection,
    CareerSpotifySection,
    CareerJobSection,
    JobsSection,
    PrivacyPolicySection,
  ],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: postgresAdapter({
    pool: (() => {
      // PRODUCTION SERVER (https://ncg-beta.vercel.app/):
      // - MUST use DATABASE_URI (RDS) ONLY
      // - MUST use exactly 1 connection (max: 1, min: 0)
      // - LOCAL_DATABASE_URI should NOT be set in production
      //
      // LOCAL DEVELOPMENT & DEV/PREVIEW ENVIRONMENTS:
      // - Uses LOCAL_DATABASE_URI if set and not empty
      // - Falls back to DATABASE_URI if LOCAL_DATABASE_URI is not set
      // - Uses 2 connections for local PostgreSQL and dev/preview environments
      
      const isProduction = process.env.NODE_ENV === 'production'
      const localDbUri = process.env.LOCAL_DATABASE_URI?.trim()
      const dbUri = process.env.DATABASE_URI?.trim()
      
      // In production, FORCE use of DATABASE_URI only (ignore LOCAL_DATABASE_URI)
      const connectionString = stripSslParams(
        isProduction ? (dbUri || '') : (localDbUri || dbUri || '')
      )
      
      // Validate connection string
      if (!connectionString) {
        const envHint = isProduction 
          ? 'DATABASE_URI must be set in production'
          : 'Set either LOCAL_DATABASE_URI (for local dev) or DATABASE_URI (for production)'
        throw new Error(`Database connection string is required. ${envHint}`)
      }
      
      // Determine if using local database (only in non-production)
      const isUsingLocalDb = !isProduction && !!localDbUri
      
      // Determine environment type
      const isDev = process.env.NODE_ENV === 'development' || process.env.VERCEL_ENV === 'development'
      const isPreview = process.env.VERCEL_ENV === 'preview'
      
      // Detect serverless environment (Vercel, AWS Lambda, etc.)
      const isServerless = 
        process.env.VERCEL || 
        process.env.AWS_LAMBDA_FUNCTION_NAME || 
        process.env.AWS_EXECUTION_ENV ||
        process.env.AMPLIFY_ENV ||
        process.env.NEXT_RUNTIME === 'nodejs'
      
      // Detect build time (Next.js static generation)
      const isBuildTime = 
        process.env.NEXT_PHASE === 'phase-production-build' ||
        process.env.NEXT_PHASE === 'phase-production-compile' ||
        (process.env.VERCEL && process.env.CI) || // Vercel build
        (process.env.VERCEL_ENV === 'production' && process.env.VERCEL && !process.env.VERCEL_URL)
      
      return {
        connectionString,
        // SSL only for RDS (production), not for local PostgreSQL
        ssl: isUsingLocalDb ? false : sslConfig,
        // CRITICAL: Production RDS connection limit
        // Production server MUST use exactly 1 connection (no more, no less)
        // Local development and dev/preview environments use 2 connections
        max: isProduction && !isPreview && !isDev
          ? 1  // PRODUCTION: Exactly 1 connection for RDS
          : 2, // Local/Dev/Preview: 2 connections
        // In serverless, keep min: 0 to allow connections to close when idle
        // This prevents connection leaks but may cause cold starts
        // For production RDS with cross-continental latency, consider keeping 1 connection alive
        min: isServerless && isProduction && !isPreview && !isDev
          ? 0  // Serverless: Allow connections to close (prevents leaks)
          : 0, // Default: Don't keep idle connections
        idleTimeoutMillis: isServerless && isProduction && !isPreview && !isDev
          ? 60000  // Serverless production: 60 seconds (keep connection alive longer to reduce cold starts)
          : 30000, // Default: 30 seconds - close idle connections quickly
        // Increase timeout for build-time operations to allow more time for connection
        // Also increase timeout for serverless runtime to handle RDS connection latency
        // Cross-continental latency (Vercel US ↔ RDS eu-north-1) + SSL handshake requires longer timeout
        connectionTimeoutMillis: isBuildTime
          ? 60000  // Build time: 60 seconds (longer timeout for build operations)
          : isUsingLocalDb 
          ? 10000  // Local DB: 10 seconds (fast fail)
          : isServerless
          ? 60000  // Serverless runtime: 60 seconds (increased for extreme cross-continental latency - Mumbai/India ↔ Stockholm/Sweden)
          : 30000, // RDS: 30 seconds (longer timeout for network latency)
        allowExitOnIdle: true, // Allow pool to close when idle to free connections
        // In serverless, add a queue timeout to fail fast when pool is exhausted
        // This prevents requests from waiting indefinitely when the single connection is busy
        ...(isServerless && isProduction && !isPreview && !isDev
          ? {
              // Queue timeout: if all connections are busy, fail after 5 seconds
              // This prevents requests from queuing indefinitely
              // Note: pg-pool doesn't have a direct queueTimeout, but we handle this in error handling
            }
          : {}),
        // Connection pool settings for multi-region high availability
        application_name: isUsingLocalDb
          ? `ncg-local-${process.pid}` // Local development
          : `ncg-payload-cms-${process.env.AWS_REGION || 'default'}-${process.pid}`, // RDS production
      }
    })(),
    // Disable automatic schema push/pull to prevent continuous retries
    // Schema changes should be managed via migrations instead
    // Set to false to stop "Pulling schema from database" retry loop
    // Can be overridden with PAYLOAD_DISABLE_AUTO_PUSH env var
    push: process.env.PAYLOAD_DISABLE_AUTO_PUSH !== 'false' ? false : true,
    // Migration directory for manual schema management
    migrationDir: path.resolve(dirname, 'migrations'),
  }),
  sharp,
  upload: {
    limits: {
      fileSize: 5000000,
    },
  },
  plugins: [
    // Only include Payload Cloud plugin if PAYLOAD_CLOUD environment variable is set
    // This prevents errors in self-hosted deployments (e.g., AWS Amplify)
    ...(process.env.PAYLOAD_CLOUD === 'true' || process.env.PAYLOAD_CLOUD_ENABLED === 'true'
      ? [payloadCloudPlugin()]
      : []),
    ...(s3Plugin
      ? [
          s3Plugin,
        ]
      : []),
  ],
  cors: resolveOrigins(),
  csrf: resolveOrigins(),
})
