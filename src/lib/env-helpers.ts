/**
 * Environment variable helpers
 */

export function sanitizeEnv(value?: string | null): string {
  return value ? value.trim() : ''
}
