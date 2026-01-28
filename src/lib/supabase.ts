import { createClient, SupabaseClient } from '@supabase/supabase-js'
import type { Database } from './database.types'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

// Client-side Supabase client (uses anon key)
// Returns null if environment variables are not configured
export const supabase: SupabaseClient<Database> | null =
  supabaseUrl && supabaseAnonKey
    ? createClient<Database>(supabaseUrl, supabaseAnonKey)
    : null

// Server-side client with service role key (for admin operations)
export function createServerClient() {
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!serviceKey) {
    throw new Error('SUPABASE_SERVICE_ROLE_KEY is not set')
  }
  return createClient<Database>(supabaseUrl, serviceKey)
}

// Types for contact form submissions (legacy)
export interface ContactSubmission {
  id?: number
  created_at?: string
  name: string
  email: string
  message: string
}

// Helper to get a non-null client (throws if not configured)
export function getSupabaseClient(): SupabaseClient<Database> {
  if (!supabase) {
    throw new Error('Supabase client not initialized - check environment variables')
  }
  return supabase
}

// Re-export database types for convenience
export * from './database.types'
