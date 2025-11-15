/**
 * useDreams Hook
 * 
 * Custom React hook for managing dreams, fragments, and todos with Supabase
 * Provides real-time subscriptions and CRUD operations
 */

import { useEffect, useState, useCallback } from 'react'
import { supabase } from '../lib/supabase'

export function useDreams() {
  const [dreams, setDreams] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Load all dreams with related data
  const loadDreams = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      const { data, error: fetchError } = await supabase
        .from('dreams')
        .select(`
          *,
          fragments (*),
          todos (*)
        `)
        .order('updated_at', { ascending: false })

      if (fetchError) throw fetchError

      // Transform data to match our app's format
      const transformedDreams = data.map(dream => ({
        ...dream,
        fragments: dream.fragments || [],
        todos: (dream.todos || []).map(todo => ({
          ...todo,
          deadline: todo.deadline ? new Date(todo.deadline).toISOString().split('T')[0] : null
        }))
      }))

      setDreams(transformedDreams)
    } catch (err) {
      console.error('Error loading dreams:', err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [])

  // Set up real-time subscriptions
  useEffect(() => {
    loadDreams()

    // Subscribe to dreams table changes
    const dreamsSubscription = supabase
      .channel('dreams-channel')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'dreams'
      }, () => {
        loadDreams() // Reload when dreams change
      })
      .subscribe()

    // Subscribe to fragments table changes
    const fragmentsSubscription = supabase
      .channel('fragments-channel')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'fragments'
      }, () => {
        loadDreams() // Reload when fragments change
      })
      .subscribe()

    // Subscribe to todos table changes
    const todosSubscription = supabase
      .channel('todos-channel')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'todos'
      }, () => {
        loadDreams() // Reload when todos change
      })
      .subscribe()

    // Cleanup subscriptions on unmount
    return () => {
      dreamsSubscription.unsubscribe()
      fragmentsSubscription.unsubscribe()
      todosSubscription.unsubscribe()
    }
  }, [loadDreams])

  // ============================================
  // DREAM OPERATIONS
  // ============================================

  const createDream = useCallback(async (dream) => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')

      const { data, error } = await supabase
        .from('dreams')
        .insert([{
          user_id: user.id,
          title: dream.title,
          description: dream.description || '',
          brand: dream.brand || 'Personal',
          status: dream.status || 'idea',
          tags: dream.tags || [],
          summary: dream.summary || ''
        }])
        .select()
        .single()

      if (error) throw error
      return data
    } catch (err) {
      console.error('Error creating dream:', err)
      throw err
    }
  }, [])

  const updateDream = useCallback(async (id, updates) => {
    try {
      const { error } = await supabase
        .from('dreams')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)

      if (error) throw error
    } catch (err) {
      console.error('Error updating dream:', err)
      throw err
    }
  }, [])

  const deleteDream = useCallback(async (id) => {
    try {
      const { error } = await supabase
        .from('dreams')
        .delete()
        .eq('id', id)

      if (error) throw error
    } catch (err) {
      console.error('Error deleting dream:', err)
      throw err
    }
  }, [])

  // ============================================
  // FRAGMENT OPERATIONS
  // ============================================

  const createFragment = useCallback(async (fragment) => {
    try {
      const { data, error } = await supabase
        .from('fragments')
        .insert([{
          dream_id: fragment.dream_id,
          title: fragment.title,
          content: fragment.content,
          source: fragment.source || '',
          url: fragment.url || '',
          date: fragment.date || new Date().toISOString(),
          features: fragment.features || [],
          code_snippets: fragment.code_snippets || []
        }])
        .select()
        .single()

      if (error) throw error

      // Update dream's updated_at timestamp
      await updateDream(fragment.dream_id, {})
      
      return data
    } catch (err) {
      console.error('Error creating fragment:', err)
      throw err
    }
  }, [updateDream])

  const updateFragment = useCallback(async (id, updates) => {
    try {
      const { error } = await supabase
        .from('fragments')
        .update(updates)
        .eq('id', id)

      if (error) throw error

      // Find the dream_id to update its timestamp
      const fragment = dreams
        .flatMap(d => d.fragments)
        .find(f => f.id === id)
      
      if (fragment) {
        await updateDream(fragment.dream_id, {})
      }
    } catch (err) {
      console.error('Error updating fragment:', err)
      throw err
    }
  }, [dreams, updateDream])

  const deleteFragment = useCallback(async (id) => {
    try {
      // Find the dream_id before deleting
      const fragment = dreams
        .flatMap(d => d.fragments)
        .find(f => f.id === id)

      const { error } = await supabase
        .from('fragments')
        .delete()
        .eq('id', id)

      if (error) throw error

      // Update dream's updated_at timestamp
      if (fragment) {
        await updateDream(fragment.dream_id, {})
      }
    } catch (err) {
      console.error('Error deleting fragment:', err)
      throw err
    }
  }, [dreams, updateDream])

  // ============================================
  // TODO OPERATIONS
  // ============================================

  const createTodo = useCallback(async (todo) => {
    try {
      const { data, error } = await supabase
        .from('todos')
        .insert([{
          dream_id: todo.dream_id,
          title: todo.title,
          description: todo.description || '',
          category: todo.category || 'coding',
          deadline: todo.deadline || null,
          completed: todo.completed || false,
          source: todo.source || 'manual',
          priority: todo.priority || 0,
          order_index: todo.order_index || 0,
          notes: todo.notes || ''
        }])
        .select()
        .single()

      if (error) throw error

      // Update dream's updated_at timestamp
      await updateDream(todo.dream_id, {})
      
      return data
    } catch (err) {
      console.error('Error creating todo:', err)
      throw err
    }
  }, [updateDream])

  const updateTodo = useCallback(async (id, updates) => {
    try {
      const { error } = await supabase
        .from('todos')
        .update(updates)
        .eq('id', id)

      if (error) throw error

      // Find the dream_id to update its timestamp
      const todo = dreams
        .flatMap(d => d.todos)
        .find(t => t.id === id)
      
      if (todo) {
        await updateDream(todo.dream_id, {})
      }
    } catch (err) {
      console.error('Error updating todo:', err)
      throw err
    }
  }, [dreams, updateDream])

  const deleteTodo = useCallback(async (id) => {
    try {
      // Find the dream_id before deleting
      const todo = dreams
        .flatMap(d => d.todos)
        .find(t => t.id === id)

      const { error } = await supabase
        .from('todos')
        .delete()
        .eq('id', id)

      if (error) throw error

      // Update dream's updated_at timestamp
      if (todo) {
        await updateDream(todo.dream_id, {})
      }
    } catch (err) {
      console.error('Error deleting todo:', err)
      throw err
    }
  }, [dreams, updateDream])

  // Toggle todo completion status
  const toggleTodo = useCallback(async (id) => {
    try {
      const todo = dreams
        .flatMap(d => d.todos)
        .find(t => t.id === id)

      if (todo) {
        await updateTodo(id, { 
          completed: !todo.completed,
          completed_at: !todo.completed ? new Date().toISOString() : null
        })
      }
    } catch (err) {
      console.error('Error toggling todo:', err)
      throw err
    }
  }, [dreams, updateTodo])

  // ============================================
  // UTILITY FUNCTIONS
  // ============================================

  // Track dream access (for recent dreams)
  const trackDreamAccess = useCallback(async (dreamId) => {
    try {
      const { error } = await supabase
        .rpc('track_dream_access', { p_dream_id: dreamId })

      if (error) throw error
    } catch (err) {
      console.error('Error tracking dream access:', err)
      // Don't throw - this is not critical
    }
  }, [])

  // Get recent dreams (last 5-10 accessed)
  const getRecentDreams = useCallback(async (limit = 10) => {
    try {
      const { data, error } = await supabase
        .from('recent_dreams')
        .select(`
          dream_id,
          accessed_at,
          dreams (*)
        `)
        .order('accessed_at', { ascending: false })
        .limit(limit)

      if (error) throw error
      return data.map(rd => rd.dreams).filter(Boolean)
    } catch (err) {
      console.error('Error getting recent dreams:', err)
      return []
    }
  }, [])

  return {
    // State
    dreams,
    loading,
    error,
    
    // Dream operations
    createDream,
    updateDream,
    deleteDream,
    
    // Fragment operations
    createFragment,
    updateFragment,
    deleteFragment,
    
    // Todo operations
    createTodo,
    updateTodo,
    deleteTodo,
    toggleTodo,
    
    // Utility
    reload: loadDreams,
    trackDreamAccess,
    getRecentDreams
  }
}

export default useDreams

