/**
 * Supabase Client Configuration
 * 
 * This file initializes the Supabase client for use throughout the application.
 * Environment variables are loaded from .env.local
 */

import { createClient } from '@supabase/supabase-js'

// Get environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY
const debugMode = import.meta.env.VITE_DEBUG_MODE === 'true'

// Create Supabase client (optional - null if not configured)
export const supabase = supabaseUrl && supabaseAnonKey 
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true
      },
      global: {
        headers: {
          'x-dreamcatcher-version': '2.3.0'
        }
      }
    })
  : null

// Log configuration status
if (!supabase) {
  console.warn('⚠️ Supabase not configured - running in LocalStorage mode')
  console.warn('💡 To enable cloud storage, set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in .env.local')
}

// Debug logging (only in development)
if (debugMode && import.meta.env.DEV) {
  console.log('🔌 Supabase client initialized')
  console.log('📍 URL:', supabaseUrl)
  console.log('🔑 Anon Key:', supabaseAnonKey.substring(0, 20) + '...')
  
  // Log auth state changes
  supabase.auth.onAuthStateChange((event, session) => {
    console.log('🔐 Auth event:', event)
    console.log('👤 User:', session?.user?.email || 'Not signed in')
  })
}

// Export helper to check if Supabase is configured
export const isSupabaseConfigured = () => {
  return !!supabaseUrl && !!supabaseAnonKey
}

// Export helper to get current user
export const getCurrentUser = async () => {
  const { data: { user } } = await supabase.auth.getUser()
  return user
}

// Export helper to sign out
export const signOut = async () => {
  const { error } = await supabase.auth.signOut()
  if (error) throw error
}

export default supabase

