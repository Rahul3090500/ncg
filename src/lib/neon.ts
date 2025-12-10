/**
 * Neon Database Helper
 * 
 * Utility functions for connecting to Neon database using the serverless driver.
 * Use this for Server Actions and other serverless contexts where you need direct database access.
 * 
 * For Payload CMS operations, use the Payload client instead (which uses the standard pg driver).
 */

import { neon } from '@neondatabase/serverless'

/**
 * Get Neon database connection
 * Uses DATABASE_URL by default, or DATABASE_URL_UNPOOLED for operations requiring direct connection
 */
export function getNeonConnection(unpooled = false) {
  const connectionString = unpooled 
    ? process.env.DATABASE_URL_UNPOOLED || process.env.DATABASE_URL
    : process.env.DATABASE_URL

  if (!connectionString) {
    throw new Error(
      'DATABASE_URL or DATABASE_URL_UNPOOLED must be set for Neon database connection'
    )
  }

  return neon(connectionString)
}

/**
 * Execute a SQL query using Neon serverless driver
 * 
 * @example
 * ```ts
 * 'use server'
 * export async function createComment(comment: string) {
 *   const sql = getNeonConnection()
 *   await sql('INSERT INTO comments (comment) VALUES ($1)', [comment])
 * }
 * ```
 */
export async function executeNeonQuery<T = any>(
  query: string,
  params?: any[],
  unpooled = false
): Promise<T[]> {
  const sql = getNeonConnection(unpooled)
  const result = await sql(query, params)
  return result as T[]
}

/**
 * Check if Neon database is configured
 */
export function isNeonConfigured(): boolean {
  return !!process.env.DATABASE_URL && process.env.DATABASE_URL.includes('neon.tech')
}
