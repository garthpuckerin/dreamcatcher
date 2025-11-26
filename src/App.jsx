/**
 * App.jsx - Main Application Entry Point
 *
 * Handles authentication and routing between Auth and Dreamcatcher components
 * Version: 2.3.0 with Supabase integration
 */

import React from 'react'
import { supabase } from './lib/supabase'
import { useAuth } from './hooks/useAuth'
import { useDreams } from './hooks/useDreams'
import Auth from './components/Auth'
import Dreamcatcher from './Dreamcatcher'
import DreamcatcherUI from './App_new'
import { Loader2 } from 'lucide-react'

// Wrapper component for Supabase mode
function SupabaseApp() {
  const auth = useAuth()
  const dreamsData = useDreams()

  // Show loading spinner while checking auth
  if (auth.loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-blue-500 animate-spin mx-auto mb-4" />
          <p className="text-gray-400">Loading Dreamcatcher...</p>
        </div>
      </div>
    )
  }

  // If not authenticated, show auth screen
  if (!auth.user) {
    return <Auth />
  }

  // Authenticated - show main app
  return <Dreamcatcher user={auth.user} signOut={auth.signOut} {...dreamsData} />
}

export default function App() {
  // Check if Supabase is configured
  const isSupabaseConfigured = supabase !== null

  // If Supabase is not configured, run in LocalStorage mode
  if (!isSupabaseConfigured) {
    console.log('🔵 Running in LocalStorage mode (no authentication)')
    return <DreamcatcherUI />
  }

  // Supabase mode - use dedicated component
  return <SupabaseApp />
}
