/**
 * Data Migration Utility
 * 
 * Migrates dreams and fragments from localStorage to Supabase
 * Run this once after setting up Supabase to import existing data
 */

import { supabase } from '../lib/supabase'

export async function migrateLocalStorageToSupabase() {
  try {
    console.log('🔄 Starting migration from localStorage to Supabase...')
    
    // Check if user is authenticated
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      throw new Error('User must be authenticated to migrate data')
    }

    // Get data from localStorage
    const stored = localStorage.getItem('dreamcatcher-dreams')
    if (!stored) {
      console.log('ℹ️ No data found in localStorage')
      return {
        success: true,
        message: 'No data to migrate',
        stats: { dreams: 0, fragments: 0, todos: 0 }
      }
    }

    const localDreams = JSON.parse(stored)
    console.log(`📊 Found ${localDreams.length} dreams in localStorage`)

    const stats = {
      dreams: 0,
      fragments: 0,
      todos: 0,
      errors: []
    }

    // Migrate each dream
    for (const localDream of localDreams) {
      try {
        // Create dream in Supabase
        const { data: newDream, error: dreamError } = await supabase
          .from('dreams')
          .insert([{
            user_id: user.id,
            title: localDream.title,
            description: localDream.description || '',
            brand: localDream.brand || 'Personal',
            status: localDream.status || 'idea',
            tags: localDream.tags || [],
            summary: localDream.summary || '',
            created_at: localDream.created || new Date().toISOString(),
            updated_at: localDream.updated || new Date().toISOString()
          }])
          .select()
          .single()

        if (dreamError) {
          console.error(`Error migrating dream "${localDream.title}":`, dreamError)
          stats.errors.push(`Dream "${localDream.title}": ${dreamError.message}`)
          continue
        }

        stats.dreams++
        console.log(`✅ Migrated dream: ${newDream.title}`)

        // Migrate fragments for this dream
        if (localDream.fragments && localDream.fragments.length > 0) {
          for (const fragment of localDream.fragments) {
            try {
              const { error: fragmentError } = await supabase
                .from('fragments')
                .insert([{
                  dream_id: newDream.id,
                  title: fragment.title || 'Untitled Fragment',
                  content: fragment.content || '',
                  source: fragment.source || '',
                  url: fragment.url || '',
                  date: fragment.date || new Date().toISOString(),
                  features: fragment.features || [],
                  code_snippets: fragment.codeSnippets || []
                }])

              if (fragmentError) {
                console.error(`Error migrating fragment:`, fragmentError)
                stats.errors.push(`Fragment in "${localDream.title}": ${fragmentError.message}`)
              } else {
                stats.fragments++
              }
            } catch (err) {
              console.error('Fragment migration error:', err)
              stats.errors.push(`Fragment error: ${err.message}`)
            }
          }
        }

        // Migrate todos for this dream
        if (localDream.todos && localDream.todos.length > 0) {
          for (const todo of localDream.todos) {
            try {
              const { error: todoError } = await supabase
                .from('todos')
                .insert([{
                  dream_id: newDream.id,
                  title: todo.title || 'Untitled Task',
                  description: todo.description || '',
                  category: todo.category || 'coding',
                  deadline: todo.deadline || null,
                  completed: todo.completed || false,
                  completed_at: todo.completedAt || null,
                  source: todo.source || 'manual',
                  priority: todo.priority || 0,
                  order_index: todo.orderIndex || 0,
                  notes: todo.notes || ''
                }])

              if (todoError) {
                console.error(`Error migrating todo:`, todoError)
                stats.errors.push(`Todo in "${localDream.title}": ${todoError.message}`)
              } else {
                stats.todos++
              }
            } catch (err) {
              console.error('Todo migration error:', err)
              stats.errors.push(`Todo error: ${err.message}`)
            }
          }
        }

        // Small delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 100))
      } catch (err) {
        console.error(`Error processing dream "${localDream.title}":`, err)
        stats.errors.push(`Dream "${localDream.title}": ${err.message}`)
      }
    }

    console.log('✨ Migration complete!')
    console.log('📊 Stats:', stats)

    return {
      success: true,
      message: `Successfully migrated ${stats.dreams} dreams, ${stats.fragments} fragments, and ${stats.todos} todos`,
      stats
    }
  } catch (err) {
    console.error('❌ Migration failed:', err)
    return {
      success: false,
      message: err.message,
      stats: null
    }
  }
}

// Helper function to backup localStorage data before migration
export function backupLocalStorage() {
  try {
    const stored = localStorage.getItem('dreamcatcher-dreams')
    if (!stored) {
      return null
    }

    const dreams = JSON.parse(stored)
    const backup = {
      date: new Date().toISOString(),
      dreams,
      version: '2.1.0'
    }

    // Create a downloadable backup file
    const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `dreamcatcher-backup-${Date.now()}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)

    console.log('✅ Backup created successfully')
    return backup
  } catch (err) {
    console.error('❌ Backup failed:', err)
    return null
  }
}

// Helper function to check if migration is needed
export function needsMigration() {
  const stored = localStorage.getItem('dreamcatcher-dreams')
  return !!stored && JSON.parse(stored).length > 0
}

export default {
  migrateLocalStorageToSupabase,
  backupLocalStorage,
  needsMigration
}

