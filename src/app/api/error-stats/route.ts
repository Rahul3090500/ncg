import { NextResponse } from 'next/server'
import { getErrorHandler } from '@/lib/error-handler'
import { getCircuitBreaker } from '@/lib/circuit-breaker'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function GET() {
  try {
    const errorHandler = getErrorHandler()
    const errorStats = errorHandler.getErrorStats()
    
    // Get circuit breaker stats
    const apiBreaker = getCircuitBreaker('api-requests')
    const dbBreaker = getCircuitBreaker('payload-database')
    
    return NextResponse.json({
      errors: errorStats,
      circuitBreakers: {
        api: apiBreaker.getStats(),
        database: dbBreaker.getStats(),
      },
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch error stats' },
      { status: 500 }
    )
  }
}

