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

// Validate environment variables
if (!supabaseUrl) {
  console.error('Missing VITE_SUPABASE_URL environment variable')
  throw new Error('Supabase URL is required. Please check your .env.local file.')
}

if (!supabaseAnonKey) {
  console.error('Missing VITE_SUPABASE_ANON_KEY environment variable')
  throw new Error('Supabase Anon Key is required. Please check your .env.local file.')
}

// Create Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  },
  global: {
    headers: {
      'x-dreamcatcher-version': '2.2.0'
    }
  }
})

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

