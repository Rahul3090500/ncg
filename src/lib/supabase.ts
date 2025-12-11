/**
 * Supabase Database Helper
 * 
 * Utility functions for connecting to Supabase database using the serverless driver.
 * Use this for Server Actions and other serverless contexts where you need direct database access.
 * 
 * For Payload CMS operations, use the Payload client instead (which uses the standard pg driver).
 */

import { neon } from '@neondatabase/serverless'

/**
 * Get Supabase database connection
 * Uses DATABASE_URL by default, or DATABASE_URL_UNPOOLED for operations requiring direct connection
 */
export function getSupabaseConnection(unpooled = false) {
  const connectionString = unpooled 
    ? process.env.DATABASE_URL_UNPOOLED || process.env.DATABASE_URL
    : process.env.DATABASE_URL

  if (!connectionString) {
    throw new Error(
      'DATABASE_URL or DATABASE_URL_UNPOOLED must be set for Supabase database connection'
    )
  }

  // Verify it's a Supabase connection
  if (!connectionString.includes('supabase')) {
    throw new Error(
      'DATABASE_URL does not appear to be a Supabase connection string'
    )
  }

  return neon(connectionString)
}

/**
 * Execute a SQL query using Supabase serverless driver
 * 
 * @example
 * ```ts
 * 'use server'
 * export async function createComment(comment: string) {
 *   const sql = getSupabaseConnection()
 *   await sql('INSERT INTO comments (comment) VALUES ($1)', [comment])
 * }
 * ```
 */
export async function executeSupabaseQuery<T = any>(
  query: string,
  params?: any[],
  unpooled = false
): Promise<T[]> {
  const sql = getSupabaseConnection(unpooled)
  const result = await sql(query, params)
  return result as T[]
}

/**
 * Check if Supabase database is configured
 */
export function isSupabaseConfigured(): boolean {
  return !!process.env.DATABASE_URL && (
    process.env.DATABASE_URL.includes('supabase.com') || 
    process.env.DATABASE_URL.includes('supabase.co')
  )
}
