/**
 * useAuth Hook
 * 
 * Custom React hook for managing authentication with Supabase
 * Handles sign in, sign up, sign out, and session management
 */

import { useEffect, useState, useCallback } from 'react'
import { supabase } from '../lib/supabase'

export function useAuth() {
  const [user, setUser] = useState(null)
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Initialize auth state and listen for changes
  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setUser(session?.user ?? null)
      setLoading(false)
    })

    // Listen for auth changes
    const {
      data: { subscription }
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
      setUser(session?.user ?? null)
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  // ============================================
  // SIGN UP
  // ============================================
  const signUp = useCallback(async (email, password, metadata = {}) => {
    try {
      setLoading(true)
      setError(null)

      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: metadata,
          emailRedirectTo: window.location.origin
        }
      })

      if (signUpError) throw signUpError

      // Check if email confirmation is required
      if (data?.user && !data.session) {
        return {
          user: data.user,
          requiresConfirmation: true,
          message: 'Please check your email to confirm your account.'
        }
      }

      return {
        user: data.user,
        session: data.session,
        requiresConfirmation: false
      }
    } catch (err) {
      console.error('Sign up error:', err)
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  // ============================================
  // SIGN IN
  // ============================================
  const signIn = useCallback(async (email, password) => {
    try {
      setLoading(true)
      setError(null)

      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password
      })

      if (signInError) throw signInError

      return {
        user: data.user,
        session: data.session
      }
    } catch (err) {
      console.error('Sign in error:', err)
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  // ============================================
  // SIGN IN WITH PROVIDER (OAuth)
  // ============================================
  const signInWithProvider = useCallback(async (provider) => {
    try {
      setLoading(true)
      setError(null)

      const { data, error: providerError } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: window.location.origin
        }
      })

      if (providerError) throw providerError

      return data
    } catch (err) {
      console.error('Provider sign in error:', err)
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  // ============================================
  // SIGN OUT
  // ============================================
  const signOut = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      const { error: signOutError } = await supabase.auth.signOut()

      if (signOutError) throw signOutError

      setUser(null)
      setSession(null)
    } catch (err) {
      console.error('Sign out error:', err)
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  // ============================================
  // PASSWORD RESET
  // ============================================
  const resetPassword = useCallback(async (email) => {
    try {
      setLoading(true)
      setError(null)

      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`
      })

      if (resetError) throw resetError

      return {
        message: 'Password reset email sent. Please check your inbox.'
      }
    } catch (err) {
      console.error('Password reset error:', err)
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  // ============================================
  // UPDATE PASSWORD
  // ============================================
  const updatePassword = useCallback(async (newPassword) => {
    try {
      setLoading(true)
      setError(null)

      const { data, error: updateError } = await supabase.auth.updateUser({
        password: newPassword
      })

      if (updateError) throw updateError

      return {
        user: data.user,
        message: 'Password updated successfully!'
      }
    } catch (err) {
      console.error('Update password error:', err)
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  // ============================================
  // UPDATE USER METADATA
  // ============================================
  const updateUser = useCallback(async (updates) => {
    try {
      setLoading(true)
      setError(null)

      const { data, error: updateError } = await supabase.auth.updateUser({
        data: updates
      })

      if (updateError) throw updateError

      return {
        user: data.user,
        message: 'Profile updated successfully!'
      }
    } catch (err) {
      console.error('Update user error:', err)
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  // ============================================
  // UTILITY FUNCTIONS
  // ============================================

  // Check if user is authenticated
  const isAuthenticated = useCallback(() => {
    return !!user && !!session
  }, [user, session])

  // Get user email
  const getUserEmail = useCallback(() => {
    return user?.email || null
  }, [user])

  // Get user metadata
  const getUserMetadata = useCallback(() => {
    return user?.user_metadata || {}
  }, [user])

  // Refresh session
  const refreshSession = useCallback(async () => {
    try {
      const { data, error: refreshError } = await supabase.auth.refreshSession()
      if (refreshError) throw refreshError
      
      setSession(data.session)
      setUser(data.session?.user ?? null)
      
      return data.session
    } catch (err) {
      console.error('Refresh session error:', err)
      throw err
    }
  }, [])

  return {
    // State
    user,
    session,
    loading,
    error,
    
    // Authentication methods
    signUp,
    signIn,
    signInWithProvider,
    signOut,
    
    // Password management
    resetPassword,
    updatePassword,
    
    // User management
    updateUser,
    
    // Utility
    isAuthenticated,
    getUserEmail,
    getUserMetadata,
    refreshSession
  }
}

export default useAuth

