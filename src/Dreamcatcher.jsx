/**
 * Dreamcatcher.jsx - Main Application Component
 *
 * Supabase-powered version using hooks for data management
 * Version: 2.3.0
 */

import React, { useState, useEffect } from 'react'
import { LogOut, User, Loader2 } from 'lucide-react'

// Import the full UI from App_new (we'll integrate it progressively)
import DreamcatcherUI from './App_new'

export default function Dreamcatcher({ auth, dreamsData }) {
  const [showUserMenu, setShowUserMenu] = useState(false)

  // Handle sign out
  const handleSignOut = async () => {
    try {
      await auth.signOut()
    } catch (err) {
      console.error('Error signing out:', err)
    }
  }

  // Show loading while dreams are loading
  if (dreamsData.loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-blue-500 animate-spin mx-auto mb-4" />
          <p className="text-gray-400">Loading your dreams...</p>
        </div>
      </div>
    )
  }

  // Show error if there's a problem
  if (dreamsData.error) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-gray-800 rounded-xl p-8 border border-red-500/20">
          <h2 className="text-xl font-bold text-red-400 mb-4">Error Loading Dreams</h2>
          <p className="text-gray-300 mb-6">{dreamsData.error}</p>
          <button
            onClick={() => dreamsData.reload()}
            className="w-full py-2 px-4 bg-blue-500 hover:bg-blue-600 text-white rounded-lg"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="relative">
      {/* User Menu Overlay */}
      <div className="absolute top-4 right-4 z-50">
        <div className="relative">
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg border border-gray-700 transition-colors"
          >
            <User className="w-4 h-4" />
            <span className="text-sm">{auth.getUserEmail()}</span>
          </button>

          {showUserMenu && (
            <>
              {/* Backdrop */}
              <div className="fixed inset-0" onClick={() => setShowUserMenu(false)} />

              {/* Menu */}
              <div className="absolute right-0 mt-2 w-64 bg-gray-800 rounded-lg border border-gray-700 shadow-xl overflow-hidden">
                <div className="p-4 border-b border-gray-700">
                  <p className="text-sm text-gray-400">Signed in as</p>
                  <p className="text-sm font-medium text-white truncate">{auth.getUserEmail()}</p>
                </div>

                <div className="p-2">
                  <button
                    onClick={handleSignOut}
                    className="w-full flex items-center gap-3 px-4 py-2 text-left text-gray-300 hover:bg-gray-700 rounded-lg transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Main App - Pass Supabase data to the UI */}
      <DreamcatcherUI
        initialDreams={dreamsData.dreams}
        supabaseOperations={{
          createDream: dreamsData.createDream,
          updateDream: dreamsData.updateDream,
          deleteDream: dreamsData.deleteDream,
          createFragment: dreamsData.createFragment,
          updateFragment: dreamsData.updateFragment,
          deleteFragment: dreamsData.deleteFragment,
          createTodo: dreamsData.createTodo,
          updateTodo: dreamsData.updateTodo,
          deleteTodo: dreamsData.deleteTodo,
          toggleTodo: dreamsData.toggleTodo,
          trackDreamAccess: dreamsData.trackDreamAccess,
          getRecentDreams: dreamsData.getRecentDreams,
        }}
      />
    </div>
  )
}
