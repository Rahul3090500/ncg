import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@/payload.config'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function GET() {
  try {
    const payload = await getPayload({ config })
    
    // Get database connection info
    const isProduction = process.env.NODE_ENV === 'production'
    const localDbUri = process.env.LOCAL_DATABASE_URI?.trim()
    const dbUri = process.env.DATABASE_URI?.trim()
    const usingLocalDb = !isProduction && !!localDbUri
    
    // Count records in each collection
    const collections = [
      'users',
      'media',
      'case-studies',
      'blogs',
      'icons',
      'job-openings',
      'job-applications',
      'services',
      'sub-services',
    ]
    
    const counts: Record<string, number> = {}
    
    for (const collection of collections) {
      try {
        const result = await payload.find({
          collection: collection as any,
          limit: 0, // Just get count
        })
        counts[collection] = result.totalDocs || 0
      } catch (err: any) {
        counts[collection] = -1 // Error
      }
    }
    
    // Count globals
    const globals = [
      'hero-section',
      'services-section',
      'trusted-by-section',
      'case-studies-hero',
      'case-studies-grid',
      'testimonials-section',
      'approach-section',
      'contact-section',
    ]
    
    const globalStatus: Record<string, boolean> = {}
    
    for (const globalSlug of globals) {
      try {
        const result = await payload.findGlobal({ slug: globalSlug })
        globalStatus[globalSlug] = !!result
      } catch {
        globalStatus[globalSlug] = false
      }
    }
    
    const totalRecords = Object.values(counts).reduce((sum, count) => sum + (count > 0 ? count : 0), 0)
    const globalsWithData = Object.values(globalStatus).filter(Boolean).length
    
    return NextResponse.json({
      database: {
        type: usingLocalDb ? 'LOCAL' : 'PRODUCTION',
        uri: usingLocalDb 
          ? (localDbUri?.replace(/:[^:@]+@/, ':****@') || 'Not set')
          : (dbUri?.replace(/:[^:@]+@/, ':****@') || 'Not set'),
      },
      collections: counts,
      globals: globalStatus,
      summary: {
        totalRecords,
        collectionsWithData: Object.values(counts).filter(c => c > 0).length,
        globalsWithData,
        totalGlobals: globals.length,
      },
      timestamp: new Date().toISOString(),
    })
  } catch (error: any) {
    return NextResponse.json({
      error: error?.message || 'Failed to fetch database stats',
      timestamp: new Date().toISOString(),
    }, { status: 500 })
  }
}
