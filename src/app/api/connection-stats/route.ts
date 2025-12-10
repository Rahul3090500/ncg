import { NextResponse } from 'next/server'
import { getConnectionMonitor } from '@/lib/connection-monitor'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function GET() {
  try {
    const monitor = getConnectionMonitor()
    const stats = await monitor.getStats()
    const total = await monitor.getTotalConnections()
    const limitCheck = await monitor.checkConnectionLimit()

    return NextResponse.json({
      totalConnections: total,
      maxAllowed: monitor.getMaxTotalConnections(),
      utilization: (total / monitor.getMaxTotalConnections()) * 100,
      limitCheck,
      poolStats: stats,
      timestamp: new Date().toISOString(),
    })
  } catch (error: any) {
    return NextResponse.json(
      {
        error: 'Failed to fetch connection stats',
        message: error?.message,
      },
      { status: 500 }
    )
  }
}

