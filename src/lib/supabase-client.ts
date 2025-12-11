/**
 * Supabase Client Helper
 * 
 * Creates a Supabase client instance for direct database access.
 * Use this if you need to use Supabase SDK features beyond Payload CMS.
 * 
 * For Payload CMS operations, use the Payload client instead.
 */

import { createClient } from '@supabase/supabase-js'

/**
 * Get Supabase client instance
 * 
 * @example
 * ```ts
 * import { getSupabaseClient } from '@/lib/supabase-client'
 * 
 * const supabase = getSupabaseClient()
 * const { data, error } = await supabase.from('todos').select()
 * ```
 */
export function getSupabaseClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error(
      'NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY must be set'
    )
  }

  return createClient(supabaseUrl, supabaseAnonKey)
}

/**
 * Get Supabase client with service role (admin access)
 * Use this for server-side operations that need elevated permissions
 */
export function getSupabaseAdminClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error(
      'NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set'
    )
  }

  return createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  })
}
