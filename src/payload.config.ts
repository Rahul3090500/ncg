import { postgresAdapter } from '@payloadcms/db-postgres'
import { payloadCloudPlugin } from '@payloadcms/payload-cloud'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { s3Storage } from '@payloadcms/storage-s3'
import path from 'path'
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

// Filter out non-critical S3 abort errors from console.error
// These occur when clients disconnect before S3 requests complete (e.g., navigating away)
if (typeof console !== 'undefined' && console.error) {
  const originalError = console.error
  console.error = function (...args: any[]) {
    // Convert all arguments to a searchable string
    const errorText = JSON.stringify(args).toLowerCase()
    
    // Check if this is a non-critical S3 abort error
    const isAbortError = 
      (errorText.includes('aborterror') || errorText.includes('request aborted')) &&
      (errorText.includes('storage-s3') || 
       errorText.includes('@smithy') || 
       errorText.includes('staticHandler') ||
       errorText.includes('node-http-handler'))
    
    // Also check individual arguments for error objects
    const hasAbortErrorObject = args.some(arg => {
      if (arg && typeof arg === 'object') {
        // Check direct error object
        const name = (arg.name || '').toLowerCase()
        const message = (arg.message || '').toLowerCase()
        const stack = (arg.stack || '').toLowerCase()
        
        if (name === 'aborterror' || message.includes('request aborted')) {
          if (stack.includes('storage-s3') || stack.includes('@smithy') || stack.includes('staticHandler')) {
            return true
          }
        }
        
        // Check nested err object (Payload's format)
        if (arg.err && typeof arg.err === 'object') {
          const errName = (arg.err.name || '').toLowerCase()
          const errMessage = (arg.err.message || '').toLowerCase()
          const errStack = (arg.err.stack || '').toLowerCase()
          
          if (errName === 'aborterror' || errMessage.includes('request aborted')) {
            if (errStack.includes('storage-s3') || errStack.includes('@smithy') || errStack.includes('staticHandler')) {
              return true
            }
          }
        }
      }
      return false
    })
    
    // Only suppress if it's an abort error from S3 storage
    if (!isAbortError && !hasAbortErrorObject) {
      originalError.apply(console, args)
    }
    // Otherwise, silently suppress the error
  }
}

// Environment variable helpers
const sanitizeEnv = (value?: string | null) => (value ? value.trim() : '')

// Strip SSL parameters from connection string (we handle SSL in pool config)
function stripSslParams(uri?: string) {
  if (!uri) return uri
  try {
    const u = new URL(uri)
    // Remove SSL-related query parameters since we configure SSL in pool config
    ;['sslmode', 'sslcert', 'sslkey', 'sslrootcert'].forEach((p) => u.searchParams.delete(p))
    return u.toString()
  } catch {
    return uri
  }
}

// Database configuration - validate lazily to avoid webpack bundling issues
function getDbUri() {
  const uri = stripSslParams(sanitizeEnv(process.env.DATABASE_URI))
  if (!uri) {
    throw new Error('DATABASE_URI environment variable is required')
  }
  return uri
}

// SSL configuration for RDS
// Use CA certificate if available (PG_SSL_CA_BASE64), otherwise skip verification
function getSslConfig() {
  const caBase64 = sanitizeEnv(process.env.PG_SSL_CA_BASE64)
  if (caBase64) {
    try {
      const ca = Buffer.from(caBase64, 'base64').toString('utf8')
      // Use CA certificate but still skip hostname verification for RDS
      return {
        ca,
        rejectUnauthorized: false, // Set to false to avoid certificate chain issues
        checkServerIdentity: () => undefined, // Skip hostname verification for RDS
      }
    } catch (error) {
      // Fallback if base64 decode fails
      console.warn('[SSL] Failed to decode PG_SSL_CA_BASE64, using fallback SSL config')
    }
  }
  // Fallback: skip certificate verification if no CA certificate is provided
  return {
    rejectUnauthorized: false,
    checkServerIdentity: () => undefined, // Skip hostname verification for RDS
  }
}

// S3 configuration
const s3Bucket = sanitizeEnv(process.env.S3_BUCKET)
const s3Region = sanitizeEnv(process.env.S3_REGION)
const s3AccessKeyId = sanitizeEnv(process.env.S3_ACCESS_KEY_ID)
const s3SecretAccessKey = sanitizeEnv(process.env.S3_SECRET_ACCESS_KEY)

const s3Plugin =
  s3Bucket && s3Region && s3AccessKeyId && s3SecretAccessKey
    ? s3Storage({
        bucket: s3Bucket,
        config: {
          region: s3Region,
          credentials: {
            accessKeyId: s3AccessKeyId,
            secretAccessKey: s3SecretAccessKey,
          },
        },
        collections: {
          media: true,
        },
      })
    : null

// CORS origins
function resolveOrigins() {
  const raw = process.env.CORS_ORIGINS || process.env.NEXT_PUBLIC_SERVER_URL || ''
  const parts = raw.split(',').map((s) => s.trim()).filter(Boolean)
  const origins = Array.from(new Set([...parts, 'http://localhost:3000']))
  return origins
}

const config = buildConfig({
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
    pool: {
      connectionString: getDbUri(),
      ssl: getSslConfig(),
      // Production: Use exactly 1 connection for RDS (Vercel serverless)
      max: process.env.NODE_ENV === 'production' ? 1 : 2,
      min: 0,
      idleTimeoutMillis: 45000,
      connectionTimeoutMillis: 50000,
      allowExitOnIdle: true,
      application_name: process.env.VERCEL ? 'ncg-vercel' : 'ncg-local',
    },
    push: false,
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

export default config
