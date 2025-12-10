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
const sslConfig: any = ca ? { ca, rejectUnauthorized: false } : process.env.NODE_ENV === 'production' ? true : { rejectUnauthorized: false }
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
      // DATABASE CONFIGURATION PRIORITY:
      // 1. LOCAL_DATABASE_URI (local development PostgreSQL)
      // 2. DATABASE_URL (Neon database - Vercel/development)
      // 3. DATABASE_URI (RDS database - AWS Amplify production)
      //
      // NEON DATABASE (Vercel):
      // - Uses DATABASE_URL with connection pooling
      // - Supports multiple connections (Neon handles pooling)
      // - Uses standard SSL (no custom CA certificate needed)
      //
      // RDS DATABASE (AWS Amplify):
      // - Uses DATABASE_URI
      // - MUST use exactly 1 connection (max: 1, min: 0)
      // - Requires custom SSL CA certificate
      //
      // LOCAL DEVELOPMENT:
      // - Uses LOCAL_DATABASE_URI if set
      // - Falls back to DATABASE_URL or DATABASE_URI
      // - Uses 2 connections for local PostgreSQL
      
      const isProduction = process.env.NODE_ENV === 'production'
      const localDbUri = process.env.LOCAL_DATABASE_URI?.trim()
      const neonDbUrl = process.env.DATABASE_URL?.trim()
      const rdsDbUri = process.env.DATABASE_URI?.trim()
      
      // Determine connection string priority
      let connectionString: string | undefined
      let isUsingNeon = false
      let isUsingRds = false
      
      if (localDbUri && !isProduction) {
        // Local development - use local database
        connectionString = stripSslParams(localDbUri)
      } else if (neonDbUrl) {
        // Neon database (Vercel/development)
        connectionString = neonDbUrl // Keep SSL params for Neon
        isUsingNeon = true
      } else if (rdsDbUri) {
        // RDS database (AWS Amplify production)
        connectionString = stripSslParams(rdsDbUri)
        isUsingRds = true
      }
      
      // Validate connection string
      if (!connectionString) {
        const envHint = isProduction 
          ? 'Set DATABASE_URL (for Neon/Vercel) or DATABASE_URI (for RDS/AWS Amplify)'
          : 'Set LOCAL_DATABASE_URI (for local dev), DATABASE_URL (for Neon), or DATABASE_URI (for RDS)'
        throw new Error(`Database connection string is required. ${envHint}`)
      }
      
      // Determine if using local database (only in non-production)
      const isUsingLocalDb = !isProduction && !!localDbUri && !isUsingNeon && !isUsingRds
      
      // Determine environment type
      const isDev = process.env.NODE_ENV === 'development' || process.env.VERCEL_ENV === 'development'
      const isPreview = process.env.VERCEL_ENV === 'preview'
      const isVercel = !!process.env.VERCEL
      
      // SSL configuration
      // Neon uses standard SSL (no custom CA needed)
      // RDS requires custom CA certificate
      // Local PostgreSQL doesn't use SSL
      let sslConfigForDb: any
      if (isUsingLocalDb) {
        sslConfigForDb = false // No SSL for local PostgreSQL
      } else if (isUsingNeon) {
        sslConfigForDb = { rejectUnauthorized: false } // Standard SSL for Neon
      } else {
        sslConfigForDb = sslConfig // Custom SSL for RDS
      }
      
      // Connection pool configuration
      // Neon: Supports multiple connections (uses pgbouncer pooling)
      // RDS: Must use exactly 1 connection in production
      // Local: Use 2 connections for development
      let maxConnections: number
      if (isUsingNeon) {
        // Neon supports connection pooling, use more connections
        maxConnections = isProduction && !isPreview && !isDev ? 5 : 10
      } else if (isUsingRds && isProduction && !isPreview && !isDev) {
        // RDS production: exactly 1 connection
        maxConnections = 1
      } else {
        // Local development or preview: 2 connections
        maxConnections = 2
      }
      
      return {
        connectionString,
        ssl: sslConfigForDb,
        max: maxConnections,
        min: 0, // Don't keep idle connections - let them close to free up slots
        idleTimeoutMillis: 30000, // 30 seconds - close idle connections quickly
        connectionTimeoutMillis: isUsingLocalDb 
          ? 10000  // Local DB: 10 seconds (fast fail)
          : isUsingNeon
          ? 15000  // Neon: 15 seconds (good balance)
          : 30000, // RDS: 30 seconds (longer timeout for network latency)
        allowExitOnIdle: true, // Allow pool to close when idle to free connections
        // Connection pool settings
        application_name: isUsingLocalDb
          ? `ncg-local-${process.pid}` // Local development
          : isUsingNeon
          ? `ncg-neon-${isVercel ? 'vercel' : 'dev'}-${process.pid}` // Neon
          : `ncg-rds-${process.env.AWS_REGION || 'default'}-${process.pid}`, // RDS production
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
