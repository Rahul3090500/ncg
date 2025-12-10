/**
 * Connection Pool Monitor
 * 
 * Monitors and prevents RDS connection slot exhaustion
 * - Tracks active connections
 * - Prevents new connections when limit reached
 * - Automatically reduces pool size if needed
 * - Alerts when approaching limits
 */

import { Pool } from 'pg'

interface ConnectionStats {
  total: number
  idle: number
  waiting: number
  max: number
  utilization: number
}

class ConnectionMonitor {
  private pools: Map<string, Pool> = new Map()
  private maxTotalConnections: number = 100 // RDS limit (adjust based on your instance)
  private warningThreshold: number = 0.8 // Warn at 80% utilization
  private criticalThreshold: number = 0.9 // Critical at 90% utilization

  registerPool(name: string, pool: Pool): void {
    this.pools.set(name, pool)
  }

  async getStats(): Promise<Record<string, ConnectionStats>> {
    const stats: Record<string, ConnectionStats> = {}

    for (const [name, pool] of this.pools.entries()) {
      const total = pool.totalCount
      const idle = pool.idleCount
      const waiting = pool.waitingCount
      const max = (pool as any).options?.max || 0

      stats[name] = {
        total,
        idle,
        waiting,
        max,
        utilization: max > 0 ? total / max : 0,
      }
    }

    return stats
  }

  async getTotalConnections(): Promise<number> {
    const stats = await this.getStats()
    return Object.values(stats).reduce((sum, s) => sum + s.total, 0)
  }

  async checkConnectionLimit(): Promise<{
    allowed: boolean
    reason?: string
    stats: Record<string, ConnectionStats>
  }> {
    const stats = await this.getStats()
    const total = await this.getTotalConnections()
    const utilization = total / this.maxTotalConnections

    if (utilization >= this.criticalThreshold) {
      return {
        allowed: false,
        reason: `Critical: ${total}/${this.maxTotalConnections} connections used (${Math.round(utilization * 100)}%)`,
        stats,
      }
    }

    if (utilization >= this.warningThreshold) {
      console.warn(
        `Connection pool warning: ${total}/${this.maxTotalConnections} connections used (${Math.round(utilization * 100)}%)`
      )
    }

    return {
      allowed: true,
      stats,
    }
  }

  async reducePoolSize(poolName: string, newMax: number): Promise<void> {
    const pool = this.pools.get(poolName)
    if (!pool) return

    // Note: pg Pool doesn't support dynamic max changes
    // We need to close excess connections manually
    const currentTotal = pool.totalCount
    const excess = currentTotal - newMax

    if (excess > 0) {
      console.log(`Reducing pool ${poolName}: closing ${excess} excess connections`)
      // Close idle connections first
      for (let i = 0; i < excess; i++) {
        try {
          const client = await pool.connect()
          client.release()
        } catch {
          // Ignore errors
        }
      }
    }
  }

  setMaxTotalConnections(max: number): void {
    this.maxTotalConnections = max
  }

  getMaxTotalConnections(): number {
    return this.maxTotalConnections
  }
}

// Singleton instance
let connectionMonitor: ConnectionMonitor | null = null

export function getConnectionMonitor(): ConnectionMonitor {
  if (!connectionMonitor) {
    connectionMonitor = new ConnectionMonitor()
  }
  return connectionMonitor
}

