/**
 * Payload Connection Guard
 * 
 * Prevents RDS connection exhaustion during Payload initialization
 * - Limits concurrent schema pulls
 * - Queues connection requests
 * - Prevents connection leaks
 */

import { getConnectionMonitor } from './connection-monitor'

let schemaPullInProgress = false
let schemaPullQueue: Array<() => void> = []

export async function guardPayloadInit<T>(operation: () => Promise<T>): Promise<T> {
  const monitor = getConnectionMonitor()

  // Check connection limit before allowing operation
  const limitCheck = await monitor.checkConnectionLimit()
  if (!limitCheck.allowed) {
    throw new Error(`Cannot initialize Payload: ${limitCheck.reason}`)
  }

  // If schema pull is in progress, wait for it to complete
  if (schemaPullInProgress) {
    return new Promise<T>((resolve, reject) => {
      schemaPullQueue.push(async () => {
        try {
          const result = await operation()
          resolve(result)
        } catch (error) {
          reject(error)
        }
      })
    })
  }

  // Mark schema pull as in progress
  schemaPullInProgress = true

  try {
    const result = await operation()
    return result
  } finally {
    schemaPullInProgress = false

    // Process queued operations
    const next = schemaPullQueue.shift()
    if (next) {
      next()
    }
  }
}

export function resetConnectionGuard(): void {
  schemaPullInProgress = false
  schemaPullQueue = []
}

