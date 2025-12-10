/**
 * Circuit Breaker Pattern
 * 
 * Prevents cascading failures and protects RDS from overload
 * - Opens circuit after too many failures
 * - Prevents excessive retries
 * - Graceful degradation
 * - Automatic recovery
 */

interface CircuitBreakerOptions {
  failureThreshold?: number // Open circuit after N failures
  resetTimeout?: number // Time before attempting to close circuit (ms)
  monitoringWindow?: number // Time window for monitoring failures (ms)
  halfOpenMaxCalls?: number // Max calls in half-open state
}

const DEFAULT_OPTIONS: Required<CircuitBreakerOptions> = {
  failureThreshold: 10, // Open after 10 failures
  resetTimeout: 30000, // 30 seconds before retry
  monitoringWindow: 60000, // 1 minute window
  halfOpenMaxCalls: 3, // Allow 3 calls in half-open state
}

enum CircuitState {
  CLOSED = 'CLOSED', // Normal operation
  OPEN = 'OPEN', // Circuit is open, reject requests
  HALF_OPEN = 'HALF_OPEN', // Testing if service recovered
}

class CircuitBreaker {
  private state: CircuitState = CircuitState.CLOSED
  private failures: number = 0
  private successes: number = 0
  private lastFailureTime: number = 0
  private lastStateChange: number = Date.now()
  private options: Required<CircuitBreakerOptions>

  constructor(options: CircuitBreakerOptions = {}) {
    this.options = { ...DEFAULT_OPTIONS, ...options }
  }

  async execute<T>(operation: () => Promise<T>): Promise<T> {
    // Check if circuit should transition
    this.checkState()

    // If circuit is open, reject immediately
    if (this.state === CircuitState.OPEN) {
      throw new Error('Circuit breaker is OPEN - too many failures detected')
    }

    try {
      // Execute operation
      const result = await operation()
      
      // On success, reset failures
      this.onSuccess()
      return result
    } catch (error) {
      // On failure, record it
      this.onFailure()
      throw error
    }
  }

  private checkState(): void {
    const now = Date.now()
    const timeSinceStateChange = now - this.lastStateChange

    // If circuit is open and reset timeout has passed, try half-open
    if (this.state === CircuitState.OPEN && timeSinceStateChange >= this.options.resetTimeout) {
      this.state = CircuitState.HALF_OPEN
      this.lastStateChange = now
      this.successes = 0
      console.log('Circuit breaker: Transitioning to HALF_OPEN state')
    }

    // If circuit is half-open and we've had enough successes, close it
    if (
      this.state === CircuitState.HALF_OPEN &&
      this.successes >= this.options.halfOpenMaxCalls
    ) {
      this.state = CircuitState.CLOSED
      this.lastStateChange = now
      this.failures = 0
      console.log('Circuit breaker: Circuit CLOSED - service recovered')
    }

    // Reset failure count if monitoring window has passed
    if (now - this.lastFailureTime > this.options.monitoringWindow) {
      this.failures = 0
    }
  }

  private onSuccess(): void {
    if (this.state === CircuitState.HALF_OPEN) {
      this.successes++
    } else if (this.state === CircuitState.CLOSED) {
      // Reset failures on success
      this.failures = Math.max(0, this.failures - 1)
    }
  }

  private onFailure(): void {
    this.failures++
    this.lastFailureTime = Date.now()

    // If failures exceed threshold, open circuit
    if (this.failures >= this.options.failureThreshold && this.state !== CircuitState.OPEN) {
      this.state = CircuitState.OPEN
      this.lastStateChange = Date.now()
      console.error(
        `Circuit breaker: Circuit OPENED after ${this.failures} failures. Will retry after ${this.options.resetTimeout}ms`
      )
    }

    // If in half-open state and we get a failure, go back to open
    if (this.state === CircuitState.HALF_OPEN) {
      this.state = CircuitState.OPEN
      this.lastStateChange = Date.now()
      this.successes = 0
      console.error('Circuit breaker: Failed in HALF_OPEN state, reopening circuit')
    }
  }

  getState(): CircuitState {
    this.checkState()
    return this.state
  }

  getStats(): {
    state: CircuitState
    failures: number
    successes: number
    timeSinceStateChange: number
  } {
    this.checkState()
    return {
      state: this.state,
      failures: this.failures,
      successes: this.successes,
      timeSinceStateChange: Date.now() - this.lastStateChange,
    }
  }

  reset(): void {
    this.state = CircuitState.CLOSED
    this.failures = 0
    this.successes = 0
    this.lastFailureTime = 0
    this.lastStateChange = Date.now()
    console.log('Circuit breaker: Manually reset')
  }
}

// Singleton instances for different services
const circuitBreakers = new Map<string, CircuitBreaker>()

export function getCircuitBreaker(name: string, options?: CircuitBreakerOptions): CircuitBreaker {
  if (!circuitBreakers.has(name)) {
    circuitBreakers.set(name, new CircuitBreaker(options))
  }
  return circuitBreakers.get(name)!
}

export async function withCircuitBreaker<T>(
  name: string,
  operation: () => Promise<T>,
  options?: CircuitBreakerOptions
): Promise<T> {
  const breaker = getCircuitBreaker(name, options)
  return breaker.execute(operation)
}

