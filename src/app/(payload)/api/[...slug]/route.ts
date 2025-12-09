/* THIS FILE WAS GENERATED AUTOMATICALLY BY PAYLOAD. */
/* DO NOT MODIFY IT BECAUSE IT COULD BE REWRITTEN AT ANY TIME. */
import config from '@payload-config'
import '@payloadcms/next/css'
import {
  REST_DELETE,
  REST_GET,
  REST_OPTIONS,
  REST_PATCH,
  REST_POST,
  REST_PUT,
} from '@payloadcms/next/routes'
import { NextRequest, NextResponse } from 'next/server'
import { isDatabaseConnectionError } from '@/lib/build-time-helpers'

// Wrap Payload handlers with error handling for database connection errors
function wrapHandler(handler: (req: NextRequest, context: any) => Promise<Response>) {
  return async (req: NextRequest, context: any) => {
    try {
      // Add timeout for database operations (20 seconds)
      // This prevents requests from hanging indefinitely when the pool is exhausted
      let timeoutId: NodeJS.Timeout | null = null
      const timeoutPromise = new Promise<never>((_, reject) => {
        timeoutId = setTimeout(() => {
          reject(new Error('Database operation timeout - connection pool may be exhausted'))
        }, 20000) // 20 seconds timeout
      })
      
      try {
        const result = await Promise.race([
          handler(req, context),
          timeoutPromise,
        ])
        // Clear timeout if handler completes successfully
        if (timeoutId) clearTimeout(timeoutId)
        return result
      } catch (raceError) {
        // Clear timeout if error occurs
        if (timeoutId) clearTimeout(timeoutId)
        throw raceError
      }
    } catch (error: any) {
      // Check if it's a database connection error
      if (isDatabaseConnectionError(error)) {
        const isTimeout = error?.message?.toLowerCase().includes('timeout') || 
                         error?.cause?.message?.toLowerCase().includes('timeout') ||
                         error?.cause?.message?.toLowerCase().includes('terminated') ||
                         error?.message?.toLowerCase().includes('exhausted')
        
        console.error('Database connection error in Payload API route:', {
          path: req.nextUrl.pathname,
          error: error?.message,
          code: error?.code,
        })
        
        // Return proper error response
        return NextResponse.json(
          { 
            errors: [{
              message: isTimeout 
                ? 'The database query timed out. Please try again later.' 
                : 'The database connection pool is currently unavailable. Please try reloading the page.',
            }],
            errorType: 'DATABASE_CONNECTION_ERROR',
            code: error?.code || '53300'
          },
          { status: 503 } // Service Unavailable
        )
      }
      
      // Re-throw other errors to let Payload handle them
      throw error
    }
  }
}

const baseGET = REST_GET(config)
const basePOST = REST_POST(config)
const baseDELETE = REST_DELETE(config)
const basePATCH = REST_PATCH(config)
const basePUT = REST_PUT(config)
const baseOPTIONS = REST_OPTIONS(config)

export const GET = wrapHandler(baseGET)
export const POST = wrapHandler(basePOST)
export const DELETE = wrapHandler(baseDELETE)
export const PATCH = wrapHandler(basePATCH)
export const PUT = wrapHandler(basePUT)
export const OPTIONS = baseOPTIONS
