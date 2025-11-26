import React, { useState, useEffect } from 'react'
import {
  Search,
  Plus,
  Edit2,
  Trash2,
  Save,
  X,
  Upload,
  Download,
  Calendar,
  Layers,
  Grid3x3,
  Home,
  Clock,
  CheckSquare,
  ListTodo,
  FileText,
  AlertCircle,
} from 'lucide-react'
import { useAI } from './hooks/useAI'

export default function Dreamcatcher({ initialDreams = null, supabaseOperations = null }) {
  const [dreams, setDreams] = useState(initialDreams || [])
  const [selectedDream, setSelectedDream] = useState(null)
  const [selectedFragment, setSelectedFragment] = useState(null)
  const [mainView, setMainView] = useState('all-dreams') // all-dreams, dream-detail, fragment-detail
  const [dreamView, setDreamView] = useState('consolidated') // consolidated, timeline, fragments (for dream detail)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [filterTags, setFilterTags] = useState([])
  const [filterBrand, setFilterBrand] = useState('all')
  const [sortBy, setSortBy] = useState('updated') // updated, created, name, status, fragments
  const [showNewDream, setShowNewDream] = useState(false)
  const [showNewFragment, setShowNewFragment] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [recentDreams, setRecentDreams] = useState([])

  // Use Supabase if available, otherwise fallback to localStorage
  const useSupabase = supabaseOperations !== null

  // Initialize AI features hook
  const { aiAvailable: _aiAvailable, performSemanticSearch: _performSemanticSearch } = useAI()

  // Update dreams when initialDreams changes (Supabase real-time updates)
  useEffect(() => {
    if (initialDreams) {
      setDreams(initialDreams)
    }
  }, [initialDreams])

  useEffect(() => {
    if (!useSupabase) {
      loadDreams()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [useSupabase])

  const loadDreams = () => {
    const stored = localStorage.getItem('dreamcatcher-dreams')
    const storedRecent = localStorage.getItem('dreamcatcher-recent')

    if (stored) {
      const loadedDreams = JSON.parse(stored)
      setDreams(loadedDreams)
    } else {
      loadSampleData()
    }

    if (storedRecent) {
      setRecentDreams(JSON.parse(storedRecent))
    }
  }

  const loadSampleData = () => {
    const sampleDreams = [
      {
        id: 1,
        title: 'Dreamcatcher Launch Strategy',
        description:
          'Complete launch strategy for Dreamcatcher v2.0, developed through AI conversation on Oct 11, 2025. Includes brand architecture, marketing strategy, roadmap, and PM feature expansion.',
        status: 'in-progress',
        brand: 'bc-innovations',
        tags: ['launch', 'strategy', 'bc-innovations', 'meta', 'oct-2025'],
        created: new Date('2025-10-11T14:00:00').toISOString(),
        updated: new Date().toISOString(),
        summary:
          'Strategic planning session that defined Dreamcatcher v2.0 launch, brand architecture (BC Innovations + BC Studio), and evolution from capture tool to full project management platform. Includes marketing strategy using 15+ real projects as proof, dog-fooding approach, and Supabase backend migration plan.',
        todos: [
          {
            id: 1001,
            title: 'Deploy teaser site to production',
            category: 'devops',
            deadline: new Date('2025-10-14').toISOString(),
            completed: false,
            source: 'manual',
            notes: 'Upload teaser-site folder to hosting, configure domain',
          },
          {
            id: 1002,
            title: 'Create social media accounts for BC Innovations',
            category: 'marketing',
            deadline: new Date('2025-10-15').toISOString(),
            completed: false,
            source: 'manual',
            notes: 'Twitter/X, LinkedIn, Product Hunt profiles',
          },
          {
            id: 1003,
            title: 'Write Product Hunt launch post',
            category: 'marketing',
            deadline: new Date('2025-10-16').toISOString(),
            completed: false,
            source: 'manual',
            notes: 'Highlight origin story, 15 projects proof, meta narrative',
          },
          {
            id: 1004,
            title: 'Build v2.1 PM features (todos, brand grouping)',
            category: 'coding',
            deadline: new Date('2025-10-20').toISOString(),
            completed: false,
            source: 'manual',
            notes: 'Add todos UI, brand filtering, progress tracking',
          },
          {
            id: 1005,
            title: 'Set up Supabase project and schema',
            category: 'devops',
            deadline: new Date('2025-10-24').toISOString(),
            completed: false,
            source: 'manual',
            notes: 'PostgreSQL tables for dreams, fragments, todos, documents',
          },
          {
            id: 1006,
            title: 'Document brand architecture in BRAND_STRUCTURE.md',
            category: 'admin',
            deadline: new Date('2025-10-12').toISOString(),
            completed: true,
            source: 'manual',
            notes: 'Complete - file created with full brand hierarchy',
          },
        ],
        documents: [],
        fragments: [
          {
            id: 101,
            title: 'Initial Launch Request',
            content:
              'Started with: "Help me finally launch Dreamcatcher". This began a 6-hour conversation that evolved into a complete strategic planning session.',
            source: 'Claude conversation - Oct 11, 2025',
            date: new Date('2025-10-11T14:00:00').toISOString(),
            features: ['initial-concept'],
            codeSnippets: [],
          },
          {
            id: 102,
            title: 'Brand Structure Discovery',
            content:
              'Discovered the complete brand architecture: Blurred Concepts (parent) → BC Innovations (enterprise B2B: PipelineOS, Dreamcatcher, Connex, IPDE) + BC Studio (consumer B2C: MediaOS, ShadowSurf, ShadowStream - launching 2026).',
            source: 'Claude conversation - Oct 11, 2025',
            date: new Date('2025-10-11T15:00:00').toISOString(),
            features: ['brand-architecture', 'bc-innovations', 'bc-studio', 'positioning'],
            codeSnippets: [],
          },
          {
            id: 103,
            title: '15 Projects Portfolio Reveal',
            content:
              'Revealed all projects from AI conversations: 3 in production (PipelineOS, Dreamcatcher, Builder Assistant), 5 in development (FortKnox, Connex, IPDE, Enterprise Suite, BC site), 7 in ideation (ShadowSurf, ShadowStream, MediaOS, etc.). This became the core marketing story.',
            source: 'Claude conversation - Oct 11, 2025',
            date: new Date('2025-10-11T16:00:00').toISOString(),
            features: ['portfolio', '15-projects', 'proof-of-execution'],
            codeSnippets: [],
          },
          {
            id: 104,
            title: 'Origin Story - PipelineOS Full Circle',
            content:
              'The origin story emerged: Started as "pipeline AI → notes" → Became PipelineOS (feature drift) → Full circle back to Dreamcatcher → Now they integrate. This narrative is gold.',
            source: 'Claude conversation - Oct 11, 2025',
            date: new Date('2025-10-11T16:30:00').toISOString(),
            features: ['origin-story', 'full-circle', 'narrative'],
            codeSnippets: [],
          },
          {
            id: 105,
            title: 'Strategic Transparency Approach',
            content:
              'Defined what to reveal vs keep stealth: PUBLIC - BC Innovations products, PipelineOS, Dreamcatcher; TEASED - BC Studio (2026), more tools coming; STEALTH - Specific consumer products, Accordingto. Strategic transparency wins.',
            source: 'Claude conversation - Oct 11, 2025',
            date: new Date('2025-10-11T17:00:00').toISOString(),
            features: ['strategy', 'transparency', 'stealth-products'],
            codeSnippets: [],
          },
          {
            id: 106,
            title: 'PM Feature Evolution',
            content:
              'Dreamcatcher evolved from capture tool to PROJECT MANAGEMENT: todos with deadlines, document attachments with AI parsing, task categorization (coding/admin/design/marketing), brand grouping, auto-completion via PipelineOS. This is the real vision.',
            source: 'Claude conversation - Oct 11, 2025',
            date: new Date('2025-10-11T18:00:00').toISOString(),
            features: [
              'project-management',
              'todos',
              'deadlines',
              'document-parsing',
              'brand-grouping',
            ],
            codeSnippets: [],
          },
          {
            id: 107,
            title: 'The Meta Moment',
            content:
              '"This entire chat is the perfect example of why I needed dreamcatcher in the first place." The conversation itself proves why Dreamcatcher exists. 6 hours, 15k+ lines, 9 strategic documents. Without Dreamcatcher: lost. With Dreamcatcher: organized forever.',
            source: 'Claude conversation - Oct 11, 2025',
            date: new Date('2025-10-11T19:00:00').toISOString(),
            features: ['meta', 'proof-of-concept', 'marketing-gold'],
            codeSnippets: [],
          },
          {
            id: 108,
            title: 'Dog-fooding Our Products',
            content:
              '"Shouldn\'t we be using our products to build our products?" YES! Use Dreamcatcher to manage this launch. Use PipelineOS agents to build v2.1-2.5 features. Use Builder Assistant to improve code. This is the complete loop in action.',
            source: 'Claude conversation - Oct 11, 2025',
            date: new Date('2025-10-11T19:30:00').toISOString(),
            features: ['dog-fooding', 'self-referential', 'complete-loop'],
            codeSnippets: [],
          },
          {
            id: 109,
            title: 'Supabase Backend Decision',
            content:
              "LocalStorage isn't enough for PM features. Decision: Supabase for backend (PostgreSQL, storage, auth, realtime). Launch v2.0 with LocalStorage Oct 17, add Supabase backend Oct 24. Stay the course, iterate fast.",
            source: 'Claude conversation - Oct 11, 2025',
            date: new Date('2025-10-11T20:00:00').toISOString(),
            features: ['supabase', 'backend', 'storage', 'launch-timeline'],
            codeSnippets: [],
          },
        ],
      },
      {
        id: 2,
        title: 'Dreamcatcher Product',
        description:
          'The Dreamcatcher product itself - consolidate scattered project ideas from multiple AI chat sessions into organized dreams',
        status: 'in-progress',
        brand: 'bc-innovations',
        tags: ['productivity', 'ai', 'web-app'],
        created: new Date('2025-01-08').toISOString(),
        updated: new Date().toISOString(),
        summary:
          'Core product for capturing and organizing AI conversation fragments into consolidated project dreams.',
        todos: [],
        documents: [],
        fragments: [
          {
            id: 201,
            title: 'Initial Concept',
            content:
              'A way to capture ideas from chat sessions into a central, organized, searchable place. Problem: ideas scattered across threads, hard to find.',
            source: 'Claude conversation',
            date: new Date('2025-01-08').toISOString(),
            features: ['search', 'tagging', 'import/export'],
            codeSnippets: [],
          },
          {
            id: 202,
            title: 'Dreams vs Ideas Insight',
            content:
              'Not about linking separate ideas - about consolidating FRAGMENTS of the same idea across threads. Need Dreams (projects) containing Fragments (conversation pieces).',
            source: 'Claude conversation',
            date: new Date().toISOString(),
            features: ['consolidation', 'fragments', 'context aggregation', 'timeline view'],
            codeSnippets: [],
          },
        ],
      },
      {
        id: 3,
        title: 'Resume Generator',
        description: 'Multi-style resume generator with PDF download capability',
        status: 'completed',
        brand: 'personal',
        tags: ['web-app', 'productivity', 'print-css'],
        created: new Date('2025-01-05').toISOString(),
        updated: new Date('2025-01-06').toISOString(),
        summary:
          'Completed resume generator with multiple styles (Classic, Modern, Minimal) and PDF export functionality.',
        todos: [],
        documents: [],
        fragments: [
          {
            id: 301,
            title: 'Initial Build',
            content:
              'Built resume generator with three styles: Classic, Modern, Minimal. Uses @media print for PDF generation.',
            source: 'Claude conversation',
            date: new Date('2025-01-05').toISOString(),
            features: ['multiple styles', 'PDF export', 'print CSS'],
            codeSnippets: ['@media print setup'],
          },
          {
            id: 302,
            title: 'Modal Integration',
            content:
              'Added modal interface for portfolio site. Users can preview and download different resume styles from thumbnail view.',
            source: 'Claude conversation',
            date: new Date('2025-01-06').toISOString(),
            features: ['modal UI', 'thumbnail previews', 'portfolio integration'],
            codeSnippets: ['modal component', 'resume data structure'],
          },
        ],
      },
    ]
    setDreams(sampleDreams)
    saveDreams(sampleDreams)
  }

  const saveDreams = dreamsToSave => {
    localStorage.setItem('dreamcatcher-dreams', JSON.stringify(dreamsToSave))
  }

  const saveRecentDreams = recent => {
    localStorage.setItem('dreamcatcher-recent', JSON.stringify(recent))
  }

  const accessDream = dream => {
    const updated = [dream.id, ...recentDreams.filter(id => id !== dream.id)].slice(0, 10)
    setRecentDreams(updated)
    saveRecentDreams(updated)
    setSelectedDream(dream)
    setMainView('dream-detail')
  }

  const statuses = [
    { value: 'idea', label: 'Idea', color: '#8b5cf6' },
    { value: 'planning', label: 'Planning', color: '#3b82f6' },
    { value: 'in-progress', label: 'In Progress', color: '#f59e0b' },
    { value: 'paused', label: 'Paused', color: '#6b7280' },
    { value: 'completed', label: 'Completed', color: '#10b981' },
    { value: 'abandoned', label: 'Abandoned', color: '#ef4444' },
  ]

  const brands = [
    { value: 'bc-innovations', label: 'BC Innovations', color: '#3b82f6', icon: '🚀' },
    { value: 'bc-studio', label: 'BC Studio', color: '#8b5cf6', icon: '🎨' },
    { value: 'mpgworldwide', label: 'MPGWorldwide', color: '#10b981', icon: '🌍' },
    { value: 'accordingto', label: 'Accordingto', color: '#f59e0b', icon: '📰' },
    { value: 'personal', label: 'Personal', color: '#64748b', icon: '👤' },
  ]

  const _taskCategories = [
    { value: 'coding', label: 'Coding', color: '#3b82f6', icon: '💻' },
    { value: 'admin', label: 'Admin', color: '#64748b', icon: '📋' },
    { value: 'design', label: 'Design', color: '#8b5cf6', icon: '🎨' },
    { value: 'marketing', label: 'Marketing', color: '#10b981', icon: '📣' },
    { value: 'devops', label: 'DevOps', color: '#f59e0b', icon: '⚙️' },
    { value: 'strategy', label: 'Strategy', color: '#ec4899', icon: '🎯' },
  ]

  const allTags = [...new Set(dreams.flatMap(dream => dream.tags))]

  const filteredAndSortedDreams = () => {
    let filtered = dreams.filter(dream => {
      const matchesSearch =
        searchQuery === '' ||
        dream.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        dream.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        dream.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())) ||
        dream.fragments.some(f => f.content.toLowerCase().includes(searchQuery.toLowerCase()))

      const matchesStatus = filterStatus === 'all' || dream.status === filterStatus

      const matchesTags =
        filterTags.length === 0 || filterTags.some(tag => dream.tags.includes(tag))

      const matchesBrand = filterBrand === 'all' || dream.brand === filterBrand

      return matchesSearch && matchesStatus && matchesTags && matchesBrand
    })

    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'updated':
          return new Date(b.updated) - new Date(a.updated)
        case 'created':
          return new Date(b.created) - new Date(a.created)
        case 'name':
          return a.title.localeCompare(b.title)
        case 'name-desc':
          return b.title.localeCompare(a.title)
        case 'status':
          return a.status.localeCompare(b.status)
        case 'fragments':
          return b.fragments.length - a.fragments.length
        default:
          return 0
      }
    })

    return filtered
  }

  const getRecentDreamsList = () => {
    return recentDreams
      .map(id => dreams.find(d => d.id === id))
      .filter(d => d !== undefined)
      .slice(0, 10)
  }

  const addDream = newDream => {
    const dream = {
      ...newDream,
      id: Date.now(),
      fragments: [],
      created: new Date().toISOString(),
      updated: new Date().toISOString(),
    }
    const updatedDreams = [dream, ...dreams]
    setDreams(updatedDreams)
    accessDream(dream)
    setShowNewDream(false)
    saveDreams(updatedDreams)
  }

  const addFragment = (dreamId, newFragment) => {
    const fragment = {
      ...newFragment,
      id: Date.now(),
      date: new Date().toISOString(),
    }
    const updatedDreams = dreams.map(dream =>
      dream.id === dreamId
        ? { ...dream, fragments: [...dream.fragments, fragment], updated: new Date().toISOString() }
        : dream
    )
    setDreams(updatedDreams)
    setSelectedDream(updatedDreams.find(d => d.id === dreamId))
    setShowNewFragment(false)
    saveDreams(updatedDreams)
  }

  const updateDream = updatedDream => {
    const updatedDreams = dreams.map(dream =>
      dream.id === updatedDream.id ? { ...updatedDream, updated: new Date().toISOString() } : dream
    )
    setDreams(updatedDreams)
    setSelectedDream(updatedDream)
    setIsEditing(false)
    saveDreams(updatedDreams)
  }

  const deleteDream = id => {
    if (window.confirm('Delete this dream and all its fragments?')) {
      const updatedDreams = dreams.filter(dream => dream.id !== id)
      setDreams(updatedDreams)
      setMainView('all-dreams')
      setSelectedDream(null)
      saveDreams(updatedDreams)
    }
  }

  const deleteFragment = (dreamId, fragmentId) => {
    if (window.confirm('Delete this fragment?')) {
      const updatedDreams = dreams.map(dream =>
        dream.id === dreamId
          ? { ...dream, fragments: dream.fragments.filter(f => f.id !== fragmentId) }
          : dream
      )
      setDreams(updatedDreams)
      setSelectedDream(updatedDreams.find(d => d.id === dreamId))
      setSelectedFragment(null)
      setMainView('dream-detail')
      saveDreams(updatedDreams)
    }
  }

  const exportData = () => {
    const dataStr = JSON.stringify(dreams, null, 2)
    const dataBlob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement('a')
    link.href = url
    link.download = `dreamcatcher-export-${new Date().toISOString().split('T')[0]}.json`
    link.click()
  }

  const importData = event => {
    const file = event.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = e => {
        try {
          const imported = JSON.parse(e.target.result)
          setDreams(imported)
          saveDreams(imported)
          setMainView('all-dreams')
          alert('Data imported successfully!')
        } catch (error) {
          alert('Error importing data. Please check the file format.')
        }
      }
      reader.readAsText(file)
    }
  }

  const getAllFeatures = dream => {
    const features = new Set()
    dream.fragments.forEach(f => {
      if (f.features) f.features.forEach(feat => features.add(feat))
    })
    return Array.from(features)
  }

  const toggleTagFilter = tag => {
    if (filterTags.includes(tag)) {
      setFilterTags(filterTags.filter(t => t !== tag))
    } else {
      setFilterTags([...filterTags, tag])
    }
  }

  return (
    <div
      style={{
        display: 'flex',
        height: '100vh',
        background: '#0f172a',
        color: '#e2e8f0',
        fontFamily: 'system-ui, -apple-system, sans-serif',
      }}
    >
      {/* Sidebar */}
      <div
        style={{
          width: '280px',
          background: '#1e293b',
          borderRight: '1px solid #334155',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <div style={{ padding: '1.5rem', borderBottom: '1px solid #334155' }}>
          <h1
            style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '0.5rem', color: '#fff' }}
          >
            ✨ Dreamcatcher
          </h1>
          <p style={{ fontSize: '0.875rem', color: '#94a3b8' }}>{dreams.length} dreams</p>
        </div>

        {/* All Dreams Button */}
        <div style={{ padding: '1rem', borderBottom: '1px solid #334155' }}>
          <button
            onClick={() => {
              setMainView('all-dreams')
              setSelectedDream(null)
              setSelectedFragment(null)
            }}
            style={{
              width: '100%',
              padding: '0.75rem',
              background: mainView === 'all-dreams' ? '#3b82f6' : '#0f172a',
              color: mainView === 'all-dreams' ? 'white' : '#94a3b8',
              border: '1px solid #334155',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: '600',
              fontSize: '0.9rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
            }}
          >
            <Home size={18} /> All Dreams
          </button>
        </div>

        {/* Action Buttons */}
        <div
          style={{
            padding: '1rem',
            display: 'flex',
            gap: '0.5rem',
            borderBottom: '1px solid #334155',
          }}
        >
          <button
            onClick={() => setShowNewDream(true)}
            style={{
              flex: 1,
              padding: '0.625rem',
              background: '#10b981',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: '600',
              fontSize: '0.875rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
            }}
          >
            <Plus size={16} /> New
          </button>
          <input
            type="file"
            accept=".json"
            onChange={importData}
            style={{ display: 'none' }}
            id="import-file"
          />
          <label
            htmlFor="import-file"
            style={{
              padding: '0.625rem',
              background: '#1e293b',
              color: '#94a3b8',
              border: '1px solid #334155',
              borderRadius: '8px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <Upload size={16} />
          </label>
          <button
            onClick={exportData}
            style={{
              padding: '0.625rem',
              background: '#1e293b',
              color: '#94a3b8',
              border: '1px solid #334155',
              borderRadius: '8px',
              cursor: 'pointer',
            }}
          >
            <Download size={16} />
          </button>
        </div>

        {/* Recent Dreams */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '0.5rem' }}>
          <div
            style={{
              padding: '0.75rem 0.5rem 0.5rem',
              fontSize: '0.75rem',
              fontWeight: '600',
              color: '#64748b',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
            }}
          >
            <Clock size={14} /> Recent Dreams
          </div>
          {getRecentDreamsList().length === 0 ? (
            <div
              style={{
                padding: '1rem',
                textAlign: 'center',
                color: '#64748b',
                fontSize: '0.85rem',
              }}
            >
              No recent dreams
            </div>
          ) : (
            getRecentDreamsList().map(dream => (
              <div
                key={dream.id}
                onClick={() => accessDream(dream)}
                style={{
                  padding: '0.75rem',
                  marginBottom: '0.25rem',
                  background: selectedDream?.id === dream.id ? '#334155' : '#0f172a',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  border: '1px solid',
                  borderColor: selectedDream?.id === dream.id ? '#3b82f6' : '#1e293b',
                  transition: 'all 0.2s',
                }}
                onMouseEnter={e => (e.currentTarget.style.borderColor = '#3b82f6')}
                onMouseLeave={e =>
                  (e.currentTarget.style.borderColor =
                    selectedDream?.id === dream.id ? '#3b82f6' : '#1e293b')
                }
              >
                <div
                  style={{
                    fontWeight: '600',
                    color: '#fff',
                    marginBottom: '0.25rem',
                    fontSize: '0.9rem',
                  }}
                >
                  {dream.title}
                </div>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    fontSize: '0.75rem',
                    color: '#64748b',
                  }}
                >
                  <span
                    style={{
                      padding: '0.125rem 0.375rem',
                      borderRadius: '3px',
                      fontSize: '0.65rem',
                      fontWeight: '600',
                      background: statuses.find(s => s.value === dream.status)?.color + '20',
                      color: statuses.find(s => s.value === dream.status)?.color,
                    }}
                  >
                    {statuses.find(s => s.value === dream.status)?.label}
                  </span>
                  <span>{dream.fragments.length} fragments</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Main Content */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {mainView === 'all-dreams' ? (
          <AllDreamsView
            dreams={filteredAndSortedDreams()}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            filterStatus={filterStatus}
            setFilterStatus={setFilterStatus}
            filterBrand={filterBrand}
            setFilterBrand={setFilterBrand}
            filterTags={filterTags}
            toggleTagFilter={toggleTagFilter}
            allTags={allTags}
            sortBy={sortBy}
            setSortBy={setSortBy}
            statuses={statuses}
            brands={brands}
            onSelectDream={accessDream}
          />
        ) : mainView === 'dream-detail' && selectedDream ? (
          <DreamDetailView
            dream={selectedDream}
            dreamView={dreamView}
            setDreamView={setDreamView}
            isEditing={isEditing}
            setIsEditing={setIsEditing}
            onUpdateDream={updateDream}
            onDeleteDream={deleteDream}
            onSelectFragment={frag => {
              setSelectedFragment(frag)
              setMainView('fragment-detail')
            }}
            onAddFragment={() => setShowNewFragment(true)}
            statuses={statuses}
            getAllFeatures={getAllFeatures}
            setMainView={setMainView}
          />
        ) : mainView === 'fragment-detail' && selectedFragment ? (
          <FragmentView
            fragment={selectedFragment}
            onDelete={() => deleteFragment(selectedDream.id, selectedFragment.id)}
            onClose={() => setMainView('dream-detail')}
          />
        ) : null}
      </div>

      {/* Modals */}
      {showNewDream && (
        <Modal onClose={() => setShowNewDream(false)}>
          <h2
            style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '1.5rem', color: '#fff' }}
          >
            New Dream
          </h2>
          <DreamForm
            onSave={addDream}
            onCancel={() => setShowNewDream(false)}
            statuses={statuses}
          />
        </Modal>
      )}

      {showNewFragment && selectedDream && (
        <Modal onClose={() => setShowNewFragment(false)}>
          <h2
            style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '1.5rem', color: '#fff' }}
          >
            New Fragment
          </h2>
          <FragmentForm
            onSave={fragment => addFragment(selectedDream.id, fragment)}
            onCancel={() => setShowNewFragment(false)}
          />
        </Modal>
      )}
    </div>
  )
}

// All Dreams Grid View Component
function AllDreamsView({
  dreams,
  searchQuery,
  setSearchQuery,
  filterStatus,
  setFilterStatus,
  filterBrand,
  setFilterBrand,
  filterTags,
  toggleTagFilter,
  allTags,
  sortBy,
  setSortBy,
  statuses,
  brands,
  onSelectDream,
}) {
  return (
    <>
      <div style={{ padding: '1.5rem 2rem', borderBottom: '1px solid #334155' }}>
        <h2 style={{ fontSize: '2rem', fontWeight: '700', marginBottom: '1rem', color: '#fff' }}>
          All Dreams
          <span
            style={{ fontSize: '1.25rem', fontWeight: '400', color: '#64748b', marginLeft: '1rem' }}
          >
            {dreams.length} {dreams.length === 1 ? 'dream' : 'dreams'}
          </span>
        </h2>

        {/* Search and Filters */}
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start', flexWrap: 'wrap' }}>
          {/* Dynamic Search */}
          <div style={{ flex: '1 1 300px', position: 'relative' }}>
            <Search
              size={18}
              style={{
                position: 'absolute',
                left: '12px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: '#64748b',
              }}
            />
            <input
              type="text"
              placeholder="Search dreams (real-time)..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '0.75rem 0.75rem 0.75rem 2.75rem',
                background: '#1e293b',
                border: '1px solid #334155',
                borderRadius: '8px',
                color: '#e2e8f0',
                fontSize: '0.95rem',
              }}
            />
          </div>

          {/* Status Filter */}
          <select
            value={filterStatus}
            onChange={e => setFilterStatus(e.target.value)}
            style={{
              padding: '0.75rem',
              background: '#1e293b',
              border: '1px solid #334155',
              borderRadius: '8px',
              color: '#e2e8f0',
              fontSize: '0.9rem',
              cursor: 'pointer',
            }}
          >
            <option value="all">All Status</option>
            {statuses.map(s => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>

          {/* Brand Filter */}
          <select
            value={filterBrand}
            onChange={e => setFilterBrand(e.target.value)}
            style={{
              padding: '0.75rem',
              background: '#1e293b',
              border: '1px solid #334155',
              borderRadius: '8px',
              color: '#e2e8f0',
              fontSize: '0.9rem',
              cursor: 'pointer',
            }}
          >
            <option value="all">All Brands</option>
            {brands.map(b => (
              <option key={b.value} value={b.value}>
                {b.icon} {b.label}
              </option>
            ))}
          </select>

          {/* Sort By */}
          <select
            value={sortBy}
            onChange={e => setSortBy(e.target.value)}
            style={{
              padding: '0.75rem',
              background: '#1e293b',
              border: '1px solid #334155',
              borderRadius: '8px',
              color: '#e2e8f0',
              fontSize: '0.9rem',
              cursor: 'pointer',
            }}
          >
            <option value="updated">Recently Updated</option>
            <option value="created">Recently Created</option>
            <option value="name">Name (A-Z)</option>
            <option value="name-desc">Name (Z-A)</option>
            <option value="status">Status</option>
            <option value="fragments">Fragment Count</option>
          </select>
        </div>

        {/* Tag Filters */}
        {allTags.length > 0 && (
          <div style={{ marginTop: '1rem' }}>
            <div
              style={{
                fontSize: '0.8rem',
                fontWeight: '600',
                color: '#64748b',
                marginBottom: '0.5rem',
              }}
            >
              Filter by tags:
            </div>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              {allTags.map(tag => (
                <button
                  key={tag}
                  onClick={() => toggleTagFilter(tag)}
                  style={{
                    padding: '0.375rem 0.75rem',
                    background: filterTags.includes(tag) ? '#3b82f6' : '#1e293b',
                    color: filterTags.includes(tag) ? 'white' : '#94a3b8',
                    border: '1px solid',
                    borderColor: filterTags.includes(tag) ? '#3b82f6' : '#334155',
                    borderRadius: '6px',
                    fontSize: '0.8rem',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                  }}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Dreams Grid */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '2rem' }}>
        {dreams.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '4rem 2rem', color: '#64748b' }}>
            <Grid3x3 size={48} style={{ margin: '0 auto 1rem' }} />
            <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>No dreams found</h3>
            <p>Try adjusting your search or filters</p>
          </div>
        ) : (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
              gap: '1.5rem',
            }}
          >
            {dreams.map(dream => (
              <div
                key={dream.id}
                onClick={() => onSelectDream(dream)}
                style={{
                  padding: '1.5rem',
                  background: '#1e293b',
                  borderRadius: '12px',
                  border: '1px solid #334155',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  display: 'flex',
                  flexDirection: 'column',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.borderColor = '#3b82f6'
                  e.currentTarget.style.transform = 'translateY(-2px)'
                  e.currentTarget.style.boxShadow = '0 8px 16px rgba(59, 130, 246, 0.2)'
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.borderColor = '#334155'
                  e.currentTarget.style.transform = 'translateY(0)'
                  e.currentTarget.style.boxShadow = 'none'
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    marginBottom: '0.75rem',
                  }}
                >
                  <div style={{ flex: 1 }}>
                    <h3
                      style={{
                        fontSize: '1.1rem',
                        fontWeight: '600',
                        color: '#fff',
                        marginBottom: '0.25rem',
                      }}
                    >
                      {dream.title}
                    </h3>
                    {dream.brand && (
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.25rem',
                          fontSize: '0.75rem',
                          color: brands.find(b => b.value === dream.brand)?.color,
                        }}
                      >
                        <span>{brands.find(b => b.value === dream.brand)?.icon}</span>
                        <span>{brands.find(b => b.value === dream.brand)?.label}</span>
                      </div>
                    )}
                  </div>
                  <span
                    style={{
                      padding: '0.25rem 0.625rem',
                      borderRadius: '4px',
                      fontSize: '0.7rem',
                      fontWeight: '600',
                      background: statuses.find(s => s.value === dream.status)?.color + '20',
                      color: statuses.find(s => s.value === dream.status)?.color,
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {statuses.find(s => s.value === dream.status)?.label}
                  </span>
                </div>

                <p
                  style={{
                    fontSize: '0.9rem',
                    color: '#94a3b8',
                    marginBottom: '1rem',
                    lineHeight: '1.5',
                    flex: 1,
                  }}
                >
                  {dream.description}
                </p>

                {dream.tags.length > 0 && (
                  <div
                    style={{
                      display: 'flex',
                      gap: '0.375rem',
                      flexWrap: 'wrap',
                      marginBottom: '1rem',
                    }}
                  >
                    {dream.tags.map(tag => (
                      <span
                        key={tag}
                        style={{
                          padding: '0.25rem 0.5rem',
                          background: '#0f172a',
                          borderRadius: '4px',
                          fontSize: '0.75rem',
                          color: '#64748b',
                        }}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}

                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    fontSize: '0.8rem',
                    color: '#64748b',
                    paddingTop: '0.75rem',
                    borderTop: '1px solid #334155',
                    flexWrap: 'wrap',
                    gap: '0.5rem',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                    <Layers size={14} />
                    <span>{dream.fragments.length} fragments</span>
                  </div>
                  {dream.todos && dream.todos.length > 0 && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                      <CheckSquare size={14} />
                      <span>
                        {dream.todos.filter(t => t.completed).length}/{dream.todos.length} todos
                      </span>
                    </div>
                  )}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                    <Calendar size={14} />
                    <span>{new Date(dream.updated).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  )
}

// Dream Detail View Component (existing design with tabs)
function DreamDetailView({
  dream,
  dreamView,
  setDreamView,
  isEditing,
  setIsEditing,
  onUpdateDream,
  onDeleteDream,
  onSelectFragment,
  onAddFragment,
  statuses,
  getAllFeatures,
  setMainView,
}) {
  return (
    <>
      <div style={{ padding: '1.5rem 2rem', borderBottom: '1px solid #334155' }}>
        {/* Breadcrumb */}
        <div
          style={{
            fontSize: '0.85rem',
            color: '#64748b',
            marginBottom: '1rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
          }}
        >
          <button
            onClick={() => setMainView('all-dreams')}
            style={{
              background: 'none',
              border: 'none',
              color: '#3b82f6',
              cursor: 'pointer',
              padding: 0,
              fontSize: '0.85rem',
            }}
          >
            All Dreams
          </button>
          <span>/</span>
          <span>{dream.title}</span>
        </div>

        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            marginBottom: '1rem',
          }}
        >
          <div style={{ flex: 1 }}>
            <h2
              style={{ fontSize: '2rem', fontWeight: '700', marginBottom: '0.5rem', color: '#fff' }}
            >
              {dream.title}
            </h2>
            <p style={{ color: '#94a3b8', marginBottom: '0.75rem' }}>{dream.description}</p>
            <div style={{ display: 'flex', gap: '1rem', fontSize: '0.875rem', color: '#64748b' }}>
              <span>Created: {new Date(dream.created).toLocaleDateString()}</span>
              <span>Updated: {new Date(dream.updated).toLocaleDateString()}</span>
              <span>{dream.fragments.length} fragments</span>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button
              onClick={() => setIsEditing(!isEditing)}
              style={{
                padding: '0.5rem 1rem',
                background: '#1e293b',
                color: '#94a3b8',
                border: '1px solid #334155',
                borderRadius: '6px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
              }}
            >
              <Edit2 size={16} /> Edit
            </button>
            <button
              onClick={() => onDeleteDream(dream.id)}
              style={{
                padding: '0.5rem 1rem',
                background: '#1e293b',
                color: '#ef4444',
                border: '1px solid #334155',
                borderRadius: '6px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
              }}
            >
              <Trash2 size={16} />
            </button>
          </div>
        </div>

        {/* View Tabs */}
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          <button
            onClick={() => setDreamView('summary')}
            style={{
              padding: '0.5rem 1rem',
              background: dreamView === 'summary' ? '#3b82f6' : '#1e293b',
              color: dreamView === 'summary' ? 'white' : '#94a3b8',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '0.875rem',
              fontWeight: '600',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
            }}
          >
            <FileText size={16} /> Summary
          </button>
          <button
            onClick={() => setDreamView('todos')}
            style={{
              padding: '0.5rem 1rem',
              background: dreamView === 'todos' ? '#3b82f6' : '#1e293b',
              color: dreamView === 'todos' ? 'white' : '#94a3b8',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '0.875rem',
              fontWeight: '600',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
            }}
          >
            <ListTodo size={16} /> Todos{' '}
            {dream.todos &&
              dream.todos.length > 0 &&
              `(${dream.todos.filter(t => t.completed).length}/${dream.todos.length})`}
          </button>
          <button
            onClick={() => setDreamView('consolidated')}
            style={{
              padding: '0.5rem 1rem',
              background: dreamView === 'consolidated' ? '#3b82f6' : '#1e293b',
              color: dreamView === 'consolidated' ? 'white' : '#94a3b8',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '0.875rem',
              fontWeight: '600',
            }}
          >
            Consolidated
          </button>
          <button
            onClick={() => setDreamView('timeline')}
            style={{
              padding: '0.5rem 1rem',
              background: dreamView === 'timeline' ? '#3b82f6' : '#1e293b',
              color: dreamView === 'timeline' ? 'white' : '#94a3b8',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '0.875rem',
              fontWeight: '600',
            }}
          >
            Timeline
          </button>
          <button
            onClick={() => setDreamView('fragments')}
            style={{
              padding: '0.5rem 1rem',
              background: dreamView === 'fragments' ? '#3b82f6' : '#1e293b',
              color: dreamView === 'fragments' ? 'white' : '#94a3b8',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '0.875rem',
              fontWeight: '600',
            }}
          >
            Fragments ({dream.fragments.length})
          </button>
        </div>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '2rem' }}>
        {isEditing ? (
          <DreamForm
            dream={dream}
            onSave={onUpdateDream}
            onCancel={() => setIsEditing(false)}
            statuses={statuses}
          />
        ) : dreamView === 'summary' ? (
          <SummaryView dream={dream} statuses={statuses} />
        ) : dreamView === 'todos' ? (
          <TodosView dream={dream} onUpdateDream={onUpdateDream} />
        ) : dreamView === 'consolidated' ? (
          <ConsolidatedView dream={dream} statuses={statuses} getAllFeatures={getAllFeatures} />
        ) : dreamView === 'timeline' ? (
          <TimelineView dream={dream} onSelectFragment={onSelectFragment} />
        ) : (
          <FragmentsView
            dream={dream}
            onSelectFragment={onSelectFragment}
            onAddFragment={onAddFragment}
          />
        )}
      </div>
    </>
  )
}

// View Components

function SummaryView({ dream, statuses }) {
  const brands = [
    { value: 'bc-innovations', label: 'BC Innovations', color: '#3b82f6', icon: '🚀' },
    { value: 'bc-studio', label: 'BC Studio', color: '#8b5cf6', icon: '🎨' },
    { value: 'mpgworldwide', label: 'MPGWorldwide', color: '#10b981', icon: '🌍' },
    { value: 'accordingto', label: 'Accordingto', color: '#f59e0b', icon: '📰' },
    { value: 'personal', label: 'Personal', color: '#64748b', icon: '👤' },
  ]

  const _taskCategories2 = [
    { value: 'coding', label: 'Coding', color: '#3b82f6', icon: '💻' },
    { value: 'admin', label: 'Admin', color: '#64748b', icon: '📋' },
    { value: 'design', label: 'Design', color: '#8b5cf6', icon: '🎨' },
    { value: 'marketing', label: 'Marketing', color: '#10b981', icon: '📣' },
    { value: 'devops', label: 'DevOps', color: '#f59e0b', icon: '⚙️' },
    { value: 'strategy', label: 'Strategy', color: '#ec4899', icon: '🎯' },
  ]

  const completedTodos = dream.todos ? dream.todos.filter(t => t.completed).length : 0
  const totalTodos = dream.todos ? dream.todos.length : 0
  const progressPercent = totalTodos > 0 ? Math.round((completedTodos / totalTodos) * 100) : 0

  const overdueTodos = dream.todos
    ? dream.todos.filter(t => !t.completed && new Date(t.deadline) < new Date()).length
    : 0
  const upcomingTodos = dream.todos
    ? dream.todos.filter(
        t =>
          !t.completed &&
          new Date(t.deadline) >= new Date() &&
          new Date(t.deadline) <= new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
      ).length
    : 0

  return (
    <div>
      {/* Summary Text */}
      {dream.summary && (
        <div style={{ marginBottom: '2rem' }}>
          <h3
            style={{
              fontSize: '1.25rem',
              fontWeight: '600',
              color: '#fff',
              marginBottom: '1rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
            }}
          >
            <FileText size={20} /> Dream Summary
          </h3>
          <div
            style={{
              padding: '1.5rem',
              background: '#1e293b',
              borderRadius: '8px',
              border: '1px solid #334155',
              fontSize: '0.95rem',
              lineHeight: '1.7',
              color: '#cbd5e1',
            }}
          >
            {dream.summary}
          </div>
        </div>
      )}

      {/* Key Metrics */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1rem',
          marginBottom: '2rem',
        }}
      >
        {/* Status */}
        <div
          style={{
            padding: '1.5rem',
            background: '#1e293b',
            borderRadius: '8px',
            border: '1px solid #334155',
          }}
        >
          <div
            style={{
              fontSize: '0.8rem',
              fontWeight: '600',
              color: '#64748b',
              marginBottom: '0.5rem',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
            }}
          >
            Status
          </div>
          <div
            style={{
              display: 'inline-block',
              padding: '0.5rem 1rem',
              borderRadius: '6px',
              fontSize: '0.875rem',
              fontWeight: '600',
              background: statuses.find(s => s.value === dream.status)?.color + '20',
              color: statuses.find(s => s.value === dream.status)?.color,
            }}
          >
            {statuses.find(s => s.value === dream.status)?.label}
          </div>
        </div>

        {/* Brand */}
        {dream.brand && (
          <div
            style={{
              padding: '1.5rem',
              background: '#1e293b',
              borderRadius: '8px',
              border: '1px solid #334155',
            }}
          >
            <div
              style={{
                fontSize: '0.8rem',
                fontWeight: '600',
                color: '#64748b',
                marginBottom: '0.5rem',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
              }}
            >
              Brand
            </div>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                fontSize: '0.95rem',
                color: brands.find(b => b.value === dream.brand)?.color,
                fontWeight: '600',
              }}
            >
              <span style={{ fontSize: '1.5rem' }}>
                {brands.find(b => b.value === dream.brand)?.icon}
              </span>
              <span>{brands.find(b => b.value === dream.brand)?.label}</span>
            </div>
          </div>
        )}

        {/* Fragments */}
        <div
          style={{
            padding: '1.5rem',
            background: '#1e293b',
            borderRadius: '8px',
            border: '1px solid #334155',
          }}
        >
          <div
            style={{
              fontSize: '0.8rem',
              fontWeight: '600',
              color: '#64748b',
              marginBottom: '0.5rem',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
            }}
          >
            Fragments
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Layers size={24} color="#3b82f6" />
            <span style={{ fontSize: '1.5rem', fontWeight: '700', color: '#fff' }}>
              {dream.fragments.length}
            </span>
          </div>
        </div>

        {/* Todos Progress */}
        {totalTodos > 0 && (
          <div
            style={{
              padding: '1.5rem',
              background: '#1e293b',
              borderRadius: '8px',
              border: '1px solid #334155',
            }}
          >
            <div
              style={{
                fontSize: '0.8rem',
                fontWeight: '600',
                color: '#64748b',
                marginBottom: '0.5rem',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
              }}
            >
              Todo Progress
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{ flex: 1 }}>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    marginBottom: '0.25rem',
                    fontSize: '0.85rem',
                    color: '#94a3b8',
                  }}
                >
                  <span>
                    {completedTodos}/{totalTodos}
                  </span>
                  <span>{progressPercent}%</span>
                </div>
                <div
                  style={{
                    height: '8px',
                    background: '#0f172a',
                    borderRadius: '4px',
                    overflow: 'hidden',
                  }}
                >
                  <div
                    style={{
                      height: '100%',
                      background: progressPercent === 100 ? '#10b981' : '#3b82f6',
                      width: `${progressPercent}%`,
                      transition: 'width 0.3s',
                    }}
                  />
                </div>
              </div>
              <CheckSquare size={24} color={progressPercent === 100 ? '#10b981' : '#3b82f6'} />
            </div>
          </div>
        )}
      </div>

      {/* Alerts */}
      {(overdueTodos > 0 || upcomingTodos > 0) && (
        <div style={{ marginBottom: '2rem' }}>
          <h3
            style={{
              fontSize: '1rem',
              fontWeight: '600',
              color: '#fff',
              marginBottom: '0.75rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
            }}
          >
            <AlertCircle size={18} /> Alerts
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {overdueTodos > 0 && (
              <div
                style={{
                  padding: '1rem',
                  background: '#7f1d1d20',
                  border: '1px solid #ef4444',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                }}
              >
                <AlertCircle size={20} color="#ef4444" />
                <div>
                  <div style={{ fontWeight: '600', color: '#ef4444', marginBottom: '0.25rem' }}>
                    Overdue Tasks
                  </div>
                  <div style={{ fontSize: '0.85rem', color: '#fca5a5' }}>
                    {overdueTodos} todo{overdueTodos !== 1 ? 's' : ''} past deadline
                  </div>
                </div>
              </div>
            )}
            {upcomingTodos > 0 && (
              <div
                style={{
                  padding: '1rem',
                  background: '#78350f20',
                  border: '1px solid #f59e0b',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                }}
              >
                <Calendar size={20} color="#f59e0b" />
                <div>
                  <div style={{ fontWeight: '600', color: '#f59e0b', marginBottom: '0.25rem' }}>
                    Upcoming Deadlines
                  </div>
                  <div style={{ fontSize: '0.85rem', color: '#fbbf24' }}>
                    {upcomingTodos} todo{upcomingTodos !== 1 ? 's' : ''} due within 7 days
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tags */}
      {dream.tags && dream.tags.length > 0 && (
        <div style={{ marginBottom: '2rem' }}>
          <h3
            style={{
              fontSize: '0.875rem',
              fontWeight: '600',
              color: '#64748b',
              marginBottom: '0.75rem',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
            }}
          >
            Tags
          </h3>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            {dream.tags.map(tag => (
              <span
                key={tag}
                style={{
                  padding: '0.5rem 1rem',
                  background: '#1e293b',
                  borderRadius: '6px',
                  fontSize: '0.875rem',
                  color: '#94a3b8',
                  border: '1px solid #334155',
                }}
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Timeline */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1rem',
        }}
      >
        <div
          style={{
            padding: '1rem',
            background: '#1e293b',
            borderRadius: '8px',
            border: '1px solid #334155',
          }}
        >
          <div style={{ fontSize: '0.75rem', color: '#64748b', marginBottom: '0.25rem' }}>
            Created
          </div>
          <div style={{ fontSize: '0.9rem', color: '#e2e8f0' }}>
            {new Date(dream.created).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
            })}
          </div>
        </div>
        <div
          style={{
            padding: '1rem',
            background: '#1e293b',
            borderRadius: '8px',
            border: '1px solid #334155',
          }}
        >
          <div style={{ fontSize: '0.75rem', color: '#64748b', marginBottom: '0.25rem' }}>
            Last Updated
          </div>
          <div style={{ fontSize: '0.9rem', color: '#e2e8f0' }}>
            {new Date(dream.updated).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
            })}
          </div>
        </div>
      </div>
    </div>
  )
}

function TodosView({ dream, onUpdateDream }) {
  const [showNewTodo, setShowNewTodo] = useState(false)
  const [editingTodo, setEditingTodo] = useState(null)

  const taskCategories = [
    { value: 'coding', label: 'Coding', color: '#3b82f6', icon: '💻' },
    { value: 'admin', label: 'Admin', color: '#64748b', icon: '📋' },
    { value: 'design', label: 'Design', color: '#8b5cf6', icon: '🎨' },
    { value: 'marketing', label: 'Marketing', color: '#10b981', icon: '📣' },
    { value: 'devops', label: 'DevOps', color: '#f59e0b', icon: '⚙️' },
    { value: 'strategy', label: 'Strategy', color: '#ec4899', icon: '🎯' },
  ]

  const todos = dream.todos || []
  const completedTodos = todos.filter(t => t.completed)
  const activeTodos = todos.filter(t => !t.completed)

  const toggleTodoComplete = todoId => {
    const updatedTodos = todos.map(t => (t.id === todoId ? { ...t, completed: !t.completed } : t))
    onUpdateDream({ ...dream, todos: updatedTodos })
  }

  const addTodo = newTodo => {
    const todo = {
      ...newTodo,
      id: Date.now(),
      completed: false,
      source: 'manual',
    }
    onUpdateDream({ ...dream, todos: [...todos, todo] })
    setShowNewTodo(false)
  }

  const updateTodo = updatedTodo => {
    const updatedTodos = todos.map(t => (t.id === updatedTodo.id ? updatedTodo : t))
    onUpdateDream({ ...dream, todos: updatedTodos })
    setEditingTodo(null)
  }

  const deleteTodo = todoId => {
    if (window.confirm('Delete this todo?')) {
      const updatedTodos = todos.filter(t => t.id !== todoId)
      onUpdateDream({ ...dream, todos: updatedTodos })
    }
  }

  const isOverdue = deadline => new Date(deadline) < new Date()
  const isUpcoming = deadline => {
    const deadlineDate = new Date(deadline)
    const now = new Date()
    const sevenDaysFromNow = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    return deadlineDate >= now && deadlineDate <= sevenDaysFromNow
  }

  return (
    <div>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '1.5rem',
        }}
      >
        <h3
          style={{
            fontSize: '1.2rem',
            fontWeight: '600',
            color: '#fff',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
          }}
        >
          <ListTodo size={24} /> Todos{' '}
          {todos.length > 0 && `(${completedTodos.length}/${todos.length})`}
        </h3>
        <button
          onClick={() => setShowNewTodo(true)}
          style={{
            padding: '0.625rem 1.25rem',
            background: '#3b82f6',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '0.875rem',
            fontWeight: '600',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
          }}
        >
          <Plus size={16} /> Add Todo
        </button>
      </div>

      {/* Active Todos */}
      {activeTodos.length > 0 && (
        <div style={{ marginBottom: '2rem' }}>
          <h4
            style={{
              fontSize: '0.875rem',
              fontWeight: '600',
              color: '#64748b',
              marginBottom: '0.75rem',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
            }}
          >
            Active ({activeTodos.length})
          </h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {activeTodos.map(todo => (
              <div
                key={todo.id}
                style={{
                  padding: '1.25rem',
                  background: '#1e293b',
                  borderRadius: '8px',
                  border: '1px solid',
                  borderColor: isOverdue(todo.deadline)
                    ? '#ef4444'
                    : isUpcoming(todo.deadline)
                      ? '#f59e0b'
                      : '#334155',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                  <button
                    onClick={() => toggleTodoComplete(todo.id)}
                    style={{
                      width: '24px',
                      height: '24px',
                      borderRadius: '4px',
                      border: '2px solid #3b82f6',
                      background: 'transparent',
                      cursor: 'pointer',
                      flexShrink: 0,
                      marginTop: '0.125rem',
                    }}
                  />
                  <div style={{ flex: 1 }}>
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        marginBottom: '0.5rem',
                        flexWrap: 'wrap',
                      }}
                    >
                      <h5 style={{ fontSize: '1rem', fontWeight: '600', color: '#fff', margin: 0 }}>
                        {todo.title}
                      </h5>
                      <span
                        style={{
                          padding: '0.25rem 0.625rem',
                          borderRadius: '4px',
                          fontSize: '0.75rem',
                          fontWeight: '600',
                          background:
                            taskCategories.find(c => c.value === todo.category)?.color + '20',
                          color: taskCategories.find(c => c.value === todo.category)?.color,
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.25rem',
                        }}
                      >
                        <span>{taskCategories.find(c => c.value === todo.category)?.icon}</span>
                        {taskCategories.find(c => c.value === todo.category)?.label}
                      </span>
                    </div>
                    {todo.notes && (
                      <p
                        style={{
                          fontSize: '0.875rem',
                          color: '#94a3b8',
                          marginBottom: '0.5rem',
                          lineHeight: '1.5',
                        }}
                      >
                        {todo.notes}
                      </p>
                    )}
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '1rem',
                        fontSize: '0.8rem',
                      }}
                    >
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.375rem',
                          color: isOverdue(todo.deadline)
                            ? '#ef4444'
                            : isUpcoming(todo.deadline)
                              ? '#f59e0b'
                              : '#64748b',
                        }}
                      >
                        <Calendar size={14} />
                        <span>{new Date(todo.deadline).toLocaleDateString()}</span>
                        {isOverdue(todo.deadline) && (
                          <span style={{ fontWeight: '600' }}>(Overdue)</span>
                        )}
                        {isUpcoming(todo.deadline) && (
                          <span style={{ fontWeight: '600' }}>(Upcoming)</span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button
                      onClick={() => setEditingTodo(todo)}
                      style={{
                        padding: '0.375rem',
                        background: '#0f172a',
                        border: '1px solid #334155',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        color: '#94a3b8',
                      }}
                    >
                      <Edit2 size={14} />
                    </button>
                    <button
                      onClick={() => deleteTodo(todo.id)}
                      style={{
                        padding: '0.375rem',
                        background: '#0f172a',
                        border: '1px solid #334155',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        color: '#ef4444',
                      }}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Completed Todos */}
      {completedTodos.length > 0 && (
        <div>
          <h4
            style={{
              fontSize: '0.875rem',
              fontWeight: '600',
              color: '#64748b',
              marginBottom: '0.75rem',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
            }}
          >
            Completed ({completedTodos.length})
          </h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {completedTodos.map(todo => (
              <div
                key={todo.id}
                style={{
                  padding: '1.25rem',
                  background: '#0f172a',
                  borderRadius: '8px',
                  border: '1px solid #1e293b',
                  opacity: 0.7,
                }}
              >
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                  <button
                    onClick={() => toggleTodoComplete(todo.id)}
                    style={{
                      width: '24px',
                      height: '24px',
                      borderRadius: '4px',
                      border: '2px solid #10b981',
                      background: '#10b981',
                      cursor: 'pointer',
                      flexShrink: 0,
                      marginTop: '0.125rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                      fontSize: '0.875rem',
                      fontWeight: '700',
                    }}
                  >
                    ✓
                  </button>
                  <div style={{ flex: 1 }}>
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        marginBottom: '0.5rem',
                        flexWrap: 'wrap',
                      }}
                    >
                      <h5
                        style={{
                          fontSize: '1rem',
                          fontWeight: '600',
                          color: '#64748b',
                          margin: 0,
                          textDecoration: 'line-through',
                        }}
                      >
                        {todo.title}
                      </h5>
                      <span
                        style={{
                          padding: '0.25rem 0.625rem',
                          borderRadius: '4px',
                          fontSize: '0.75rem',
                          fontWeight: '600',
                          background:
                            taskCategories.find(c => c.value === todo.category)?.color + '20',
                          color: taskCategories.find(c => c.value === todo.category)?.color,
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.25rem',
                        }}
                      >
                        <span>{taskCategories.find(c => c.value === todo.category)?.icon}</span>
                        {taskCategories.find(c => c.value === todo.category)?.label}
                      </span>
                    </div>
                    {todo.notes && (
                      <p
                        style={{
                          fontSize: '0.875rem',
                          color: '#64748b',
                          marginBottom: '0.5rem',
                          lineHeight: '1.5',
                          textDecoration: 'line-through',
                        }}
                      >
                        {todo.notes}
                      </p>
                    )}
                  </div>
                  <button
                    onClick={() => deleteTodo(todo.id)}
                    style={{
                      padding: '0.375rem',
                      background: 'transparent',
                      border: '1px solid #334155',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      color: '#64748b',
                    }}
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {todos.length === 0 && (
        <div style={{ textAlign: 'center', padding: '4rem 2rem', color: '#64748b' }}>
          <ListTodo size={48} style={{ margin: '0 auto 1rem' }} />
          <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>No todos yet</h3>
          <p>Add your first todo to start tracking tasks</p>
        </div>
      )}

      {/* New/Edit Todo Form Modal */}
      {(showNewTodo || editingTodo) && (
        <Modal
          onClose={() => {
            setShowNewTodo(false)
            setEditingTodo(null)
          }}
        >
          <h2
            style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '1.5rem', color: '#fff' }}
          >
            {editingTodo ? 'Edit Todo' : 'New Todo'}
          </h2>
          <TodoForm
            todo={editingTodo}
            onSave={editingTodo ? updateTodo : addTodo}
            onCancel={() => {
              setShowNewTodo(false)
              setEditingTodo(null)
            }}
            taskCategories={taskCategories}
          />
        </Modal>
      )}
    </div>
  )
}

function ConsolidatedView({ dream, statuses, getAllFeatures }) {
  const allFeatures = getAllFeatures(dream)

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <h3
          style={{
            fontSize: '0.875rem',
            fontWeight: '600',
            color: '#64748b',
            marginBottom: '0.5rem',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
          }}
        >
          Status
        </h3>
        <span
          style={{
            display: 'inline-block',
            padding: '0.5rem 1rem',
            borderRadius: '6px',
            fontSize: '0.875rem',
            fontWeight: '600',
            background: statuses.find(s => s.value === dream.status)?.color + '20',
            color: statuses.find(s => s.value === dream.status)?.color,
          }}
        >
          {statuses.find(s => s.value === dream.status)?.label}
        </span>
      </div>

      <div style={{ marginBottom: '2rem' }}>
        <h3
          style={{
            fontSize: '0.875rem',
            fontWeight: '600',
            color: '#64748b',
            marginBottom: '0.75rem',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
          }}
        >
          Tags
        </h3>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          {dream.tags.map(tag => (
            <span
              key={tag}
              style={{
                padding: '0.5rem 1rem',
                background: '#1e293b',
                borderRadius: '6px',
                fontSize: '0.875rem',
                color: '#94a3b8',
                border: '1px solid #334155',
              }}
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      {allFeatures.length > 0 && (
        <div style={{ marginBottom: '2rem' }}>
          <h3
            style={{
              fontSize: '0.875rem',
              fontWeight: '600',
              color: '#64748b',
              marginBottom: '0.75rem',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
            }}
          >
            All Features Mentioned
          </h3>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            {allFeatures.map(feature => (
              <span
                key={feature}
                style={{
                  padding: '0.4rem 0.8rem',
                  background: '#3b82f620',
                  borderRadius: '6px',
                  fontSize: '0.8rem',
                  color: '#3b82f6',
                  border: '1px solid #3b82f640',
                }}
              >
                {feature}
              </span>
            ))}
          </div>
        </div>
      )}

      <div>
        <h3
          style={{
            fontSize: '0.875rem',
            fontWeight: '600',
            color: '#64748b',
            marginBottom: '0.75rem',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
          }}
        >
          Consolidated Content
        </h3>
        <div
          style={{
            padding: '1.5rem',
            background: '#1e293b',
            borderRadius: '8px',
            fontSize: '0.95rem',
            lineHeight: '1.7',
            color: '#cbd5e1',
            whiteSpace: 'pre-wrap',
            border: '1px solid #334155',
          }}
        >
          {dream.fragments.map((f, i) => (
            <div key={f.id} style={{ marginBottom: i < dream.fragments.length - 1 ? '2rem' : 0 }}>
              <div style={{ color: '#64748b', fontSize: '0.85rem', marginBottom: '0.5rem' }}>
                {f.title} • {new Date(f.date).toLocaleDateString()}
              </div>
              {f.content}
              {i < dream.fragments.length - 1 && (
                <div style={{ margin: '1.5rem 0', borderBottom: '1px solid #334155' }} />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function TimelineView({ dream, onSelectFragment }) {
  const sortedFragments = [...dream.fragments].sort((a, b) => new Date(a.date) - new Date(b.date))

  return (
    <div style={{ position: 'relative', paddingLeft: '2rem' }}>
      <div
        style={{
          position: 'absolute',
          left: '0.75rem',
          top: 0,
          bottom: 0,
          width: '2px',
          background: '#334155',
        }}
      />
      {sortedFragments.map((fragment, _i) => (
        <div key={fragment.id} style={{ marginBottom: '2rem', position: 'relative' }}>
          <div
            style={{
              position: 'absolute',
              left: '-1.5rem',
              top: '0.5rem',
              width: '12px',
              height: '12px',
              borderRadius: '50%',
              background: '#3b82f6',
              border: '3px solid #0f172a',
            }}
          />
          <div
            onClick={() => onSelectFragment(fragment)}
            style={{
              padding: '1.5rem',
              background: '#1e293b',
              borderRadius: '8px',
              border: '1px solid #334155',
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
            onMouseEnter={e => (e.currentTarget.style.borderColor = '#3b82f6')}
            onMouseLeave={e => (e.currentTarget.style.borderColor = '#334155')}
          >
            <div
              style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}
            >
              <h4 style={{ fontSize: '1.1rem', fontWeight: '600', color: '#fff' }}>
                {fragment.title}
              </h4>
              <span style={{ fontSize: '0.85rem', color: '#64748b' }}>
                {new Date(fragment.date).toLocaleDateString()}
              </span>
            </div>
            <p style={{ fontSize: '0.9rem', color: '#94a3b8', marginBottom: '0.75rem' }}>
              {fragment.content}
            </p>
            <div style={{ fontSize: '0.8rem', color: '#64748b' }}>Source: {fragment.source}</div>
            {fragment.features && fragment.features.length > 0 && (
              <div
                style={{ marginTop: '0.75rem', display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}
              >
                {fragment.features.map(f => (
                  <span
                    key={f}
                    style={{
                      padding: '0.25rem 0.6rem',
                      background: '#0f172a',
                      borderRadius: '4px',
                      fontSize: '0.75rem',
                      color: '#64748b',
                    }}
                  >
                    {f}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}

function FragmentsView({ dream, onSelectFragment, onAddFragment }) {
  return (
    <div>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '1.5rem',
        }}
      >
        <h3 style={{ fontSize: '1.2rem', fontWeight: '600', color: '#fff' }}>
          {dream.fragments.length} Fragments
        </h3>
        <button
          onClick={onAddFragment}
          style={{
            padding: '0.5rem 1rem',
            background: '#3b82f6',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '0.875rem',
            fontWeight: '600',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
          }}
        >
          <Plus size={16} /> Add Fragment
        </button>
      </div>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
          gap: '1rem',
        }}
      >
        {dream.fragments.map(fragment => (
          <div
            key={fragment.id}
            onClick={() => onSelectFragment(fragment)}
            style={{
              padding: '1.5rem',
              background: '#1e293b',
              borderRadius: '8px',
              border: '1px solid #334155',
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
          >
            <h4
              style={{ fontSize: '1rem', fontWeight: '600', color: '#fff', marginBottom: '0.5rem' }}
            >
              {fragment.title}
            </h4>
            <p
              style={{
                fontSize: '0.85rem',
                color: '#94a3b8',
                marginBottom: '0.75rem',
                lineHeight: '1.6',
              }}
            >
              {fragment.content.substring(0, 150)}...
            </p>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                fontSize: '0.75rem',
                color: '#64748b',
              }}
            >
              <span>{new Date(fragment.date).toLocaleDateString()}</span>
              <span>{fragment.source}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function FragmentView({ fragment, onDelete, onClose }) {
  return (
    <>
      <div style={{ padding: '1.5rem 2rem', borderBottom: '1px solid #334155' }}>
        {/* Breadcrumb */}
        <div
          style={{
            fontSize: '0.85rem',
            color: '#64748b',
            marginBottom: '1rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
          }}
        >
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              color: '#3b82f6',
              cursor: 'pointer',
              padding: 0,
              fontSize: '0.85rem',
            }}
          >
            ← Back to Dream
          </button>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <h3
              style={{
                fontSize: '1.5rem',
                fontWeight: '700',
                color: '#fff',
                marginBottom: '0.5rem',
              }}
            >
              {fragment.title}
            </h3>
            <div style={{ fontSize: '0.875rem', color: '#64748b' }}>
              {new Date(fragment.date).toLocaleDateString()} • {fragment.source}
            </div>
          </div>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button
              onClick={onDelete}
              style={{
                padding: '0.5rem 1rem',
                background: '#1e293b',
                color: '#ef4444',
                border: '1px solid #334155',
                borderRadius: '6px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
              }}
            >
              <Trash2 size={16} /> Delete
            </button>
          </div>
        </div>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '2rem' }}>
        <div style={{ marginBottom: '2rem' }}>
          <h4
            style={{
              fontSize: '0.875rem',
              fontWeight: '600',
              color: '#64748b',
              marginBottom: '0.75rem',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
            }}
          >
            Content
          </h4>
          <div
            style={{
              padding: '1.5rem',
              background: '#1e293b',
              borderRadius: '8px',
              fontSize: '0.95rem',
              lineHeight: '1.7',
              color: '#cbd5e1',
              whiteSpace: 'pre-wrap',
              border: '1px solid #334155',
            }}
          >
            {fragment.content}
          </div>
        </div>

        {fragment.features && fragment.features.length > 0 && (
          <div style={{ marginBottom: '2rem' }}>
            <h4
              style={{
                fontSize: '0.875rem',
                fontWeight: '600',
                color: '#64748b',
                marginBottom: '0.75rem',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
              }}
            >
              Features Mentioned
            </h4>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              {fragment.features.map(feature => (
                <span
                  key={feature}
                  style={{
                    padding: '0.5rem 1rem',
                    background: '#3b82f620',
                    borderRadius: '6px',
                    fontSize: '0.875rem',
                    color: '#3b82f6',
                    border: '1px solid #3b82f640',
                  }}
                >
                  {feature}
                </span>
              ))}
            </div>
          </div>
        )}

        {fragment.codeSnippets && fragment.codeSnippets.length > 0 && (
          <div>
            <h4
              style={{
                fontSize: '0.875rem',
                fontWeight: '600',
                color: '#64748b',
                marginBottom: '0.75rem',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
              }}
            >
              Code Snippets
            </h4>
            {fragment.codeSnippets.map((snippet, i) => (
              <div
                key={i}
                style={{
                  padding: '1rem',
                  background: '#0f172a',
                  borderRadius: '6px',
                  fontSize: '0.85rem',
                  color: '#e2e8f0',
                  fontFamily: 'monospace',
                  marginBottom: '0.5rem',
                  border: '1px solid #334155',
                }}
              >
                {snippet}
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  )
}

// Form Components
function DreamForm({ dream, onSave, onCancel, statuses }) {
  const [formData, setFormData] = useState(
    dream || {
      title: '',
      description: '',
      status: 'idea',
      tags: [],
    }
  )
  const [tagInput, setTagInput] = useState('')

  const addTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData({ ...formData, tags: [...formData.tags, tagInput.trim()] })
      setTagInput('')
    }
  }

  const removeTag = tag => {
    setFormData({ ...formData, tags: formData.tags.filter(t => t !== tag) })
  }

  const handleSubmit = () => {
    if (formData.title.trim()) {
      onSave(formData)
    }
  }

  return (
    <div>
      <div style={{ marginBottom: '1.5rem' }}>
        <label
          style={{
            display: 'block',
            marginBottom: '0.5rem',
            fontSize: '0.875rem',
            fontWeight: '600',
            color: '#94a3b8',
          }}
        >
          Dream Title *
        </label>
        <input
          type="text"
          value={formData.title}
          onChange={e => setFormData({ ...formData, title: e.target.value })}
          placeholder="My amazing project..."
          style={{
            width: '100%',
            padding: '0.75rem',
            background: '#0f172a',
            border: '1px solid #334155',
            borderRadius: '8px',
            color: '#e2e8f0',
            fontSize: '1rem',
          }}
        />
      </div>

      <div style={{ marginBottom: '1.5rem' }}>
        <label
          style={{
            display: 'block',
            marginBottom: '0.5rem',
            fontSize: '0.875rem',
            fontWeight: '600',
            color: '#94a3b8',
          }}
        >
          Description
        </label>
        <textarea
          value={formData.description}
          onChange={e => setFormData({ ...formData, description: e.target.value })}
          placeholder="What's this dream about?"
          rows={3}
          style={{
            width: '100%',
            padding: '0.75rem',
            background: '#0f172a',
            border: '1px solid #334155',
            borderRadius: '8px',
            color: '#e2e8f0',
            fontSize: '0.95rem',
            resize: 'vertical',
          }}
        />
      </div>

      <div style={{ marginBottom: '1.5rem' }}>
        <label
          style={{
            display: 'block',
            marginBottom: '0.5rem',
            fontSize: '0.875rem',
            fontWeight: '600',
            color: '#94a3b8',
          }}
        >
          Status
        </label>
        <select
          value={formData.status}
          onChange={e => setFormData({ ...formData, status: e.target.value })}
          style={{
            width: '100%',
            padding: '0.75rem',
            background: '#0f172a',
            border: '1px solid #334155',
            borderRadius: '8px',
            color: '#e2e8f0',
            fontSize: '0.95rem',
          }}
        >
          {statuses.map(s => (
            <option key={s.value} value={s.value}>
              {s.label}
            </option>
          ))}
        </select>
      </div>

      <div style={{ marginBottom: '1.5rem' }}>
        <label
          style={{
            display: 'block',
            marginBottom: '0.5rem',
            fontSize: '0.875rem',
            fontWeight: '600',
            color: '#94a3b8',
          }}
        >
          Tags
        </label>
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.75rem' }}>
          <input
            type="text"
            value={tagInput}
            onChange={e => setTagInput(e.target.value)}
            onKeyPress={e => e.key === 'Enter' && (e.preventDefault(), addTag())}
            placeholder="Add a tag..."
            style={{
              flex: 1,
              padding: '0.625rem',
              background: '#0f172a',
              border: '1px solid #334155',
              borderRadius: '6px',
              color: '#e2e8f0',
              fontSize: '0.875rem',
            }}
          />
          <button
            type="button"
            onClick={addTag}
            style={{
              padding: '0.625rem 1rem',
              background: '#1e293b',
              color: '#94a3b8',
              border: '1px solid #334155',
              borderRadius: '6px',
              cursor: 'pointer',
            }}
          >
            Add
          </button>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          {formData.tags.map(tag => (
            <span
              key={tag}
              style={{
                padding: '0.375rem 0.75rem',
                background: '#1e293b',
                borderRadius: '6px',
                fontSize: '0.8rem',
                color: '#94a3b8',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                border: '1px solid #334155',
              }}
            >
              {tag}
              <X
                size={14}
                onClick={() => removeTag(tag)}
                style={{ cursor: 'pointer', color: '#64748b' }}
              />
            </span>
          ))}
        </div>
      </div>

      <div style={{ display: 'flex', gap: '0.75rem' }}>
        <button
          onClick={handleSubmit}
          style={{
            flex: 1,
            padding: '0.875rem',
            background: '#3b82f6',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontWeight: '600',
            fontSize: '1rem',
          }}
        >
          <Save size={18} style={{ verticalAlign: 'middle', marginRight: '0.5rem' }} />
          Save Dream
        </button>
        <button
          onClick={onCancel}
          style={{
            padding: '0.875rem 1.5rem',
            background: '#1e293b',
            color: '#94a3b8',
            border: '1px solid #334155',
            borderRadius: '8px',
            cursor: 'pointer',
            fontWeight: '600',
          }}
        >
          Cancel
        </button>
      </div>
    </div>
  )
}

function FragmentForm({ onSave, onCancel }) {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    source: '',
    features: [],
    codeSnippets: [],
  })
  const [featureInput, setFeatureInput] = useState('')

  const addFeature = () => {
    if (featureInput.trim() && !formData.features.includes(featureInput.trim())) {
      setFormData({ ...formData, features: [...formData.features, featureInput.trim()] })
      setFeatureInput('')
    }
  }

  const removeFeature = feature => {
    setFormData({ ...formData, features: formData.features.filter(f => f !== feature) })
  }

  const handleSubmit = () => {
    if (formData.title.trim() && formData.content.trim()) {
      onSave(formData)
    }
  }

  return (
    <div>
      <div style={{ marginBottom: '1.5rem' }}>
        <label
          style={{
            display: 'block',
            marginBottom: '0.5rem',
            fontSize: '0.875rem',
            fontWeight: '600',
            color: '#94a3b8',
          }}
        >
          Fragment Title *
        </label>
        <input
          type="text"
          value={formData.title}
          onChange={e => setFormData({ ...formData, title: e.target.value })}
          placeholder="e.g., Initial concept, Feature discussion..."
          style={{
            width: '100%',
            padding: '0.75rem',
            background: '#0f172a',
            border: '1px solid #334155',
            borderRadius: '8px',
            color: '#e2e8f0',
            fontSize: '1rem',
          }}
        />
      </div>

      <div style={{ marginBottom: '1.5rem' }}>
        <label
          style={{
            display: 'block',
            marginBottom: '0.5rem',
            fontSize: '0.875rem',
            fontWeight: '600',
            color: '#94a3b8',
          }}
        >
          Content *
        </label>
        <textarea
          value={formData.content}
          onChange={e => setFormData({ ...formData, content: e.target.value })}
          placeholder="Paste conversation excerpt, notes, ideas..."
          rows={8}
          style={{
            width: '100%',
            padding: '0.75rem',
            background: '#0f172a',
            border: '1px solid #334155',
            borderRadius: '8px',
            color: '#e2e8f0',
            fontSize: '0.95rem',
            resize: 'vertical',
            fontFamily: 'monospace',
          }}
        />
      </div>

      <div style={{ marginBottom: '1.5rem' }}>
        <label
          style={{
            display: 'block',
            marginBottom: '0.5rem',
            fontSize: '0.875rem',
            fontWeight: '600',
            color: '#94a3b8',
          }}
        >
          Source
        </label>
        <input
          type="text"
          value={formData.source}
          onChange={e => setFormData({ ...formData, source: e.target.value })}
          placeholder="e.g., ChatGPT thread, Claude conversation..."
          style={{
            width: '100%',
            padding: '0.75rem',
            background: '#0f172a',
            border: '1px solid #334155',
            borderRadius: '8px',
            color: '#e2e8f0',
            fontSize: '0.95rem',
          }}
        />
      </div>

      <div style={{ marginBottom: '1.5rem' }}>
        <label
          style={{
            display: 'block',
            marginBottom: '0.5rem',
            fontSize: '0.875rem',
            fontWeight: '600',
            color: '#94a3b8',
          }}
        >
          Features Mentioned (optional)
        </label>
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.75rem' }}>
          <input
            type="text"
            value={featureInput}
            onChange={e => setFeatureInput(e.target.value)}
            onKeyPress={e => e.key === 'Enter' && (e.preventDefault(), addFeature())}
            placeholder="Add a feature..."
            style={{
              flex: 1,
              padding: '0.625rem',
              background: '#0f172a',
              border: '1px solid #334155',
              borderRadius: '6px',
              color: '#e2e8f0',
              fontSize: '0.875rem',
            }}
          />
          <button
            type="button"
            onClick={addFeature}
            style={{
              padding: '0.625rem 1rem',
              background: '#1e293b',
              color: '#94a3b8',
              border: '1px solid #334155',
              borderRadius: '6px',
              cursor: 'pointer',
            }}
          >
            Add
          </button>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          {formData.features.map(feature => (
            <span
              key={feature}
              style={{
                padding: '0.375rem 0.75rem',
                background: '#3b82f620',
                borderRadius: '6px',
                fontSize: '0.8rem',
                color: '#3b82f6',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                border: '1px solid #3b82f640',
              }}
            >
              {feature}
              <X size={14} onClick={() => removeFeature(feature)} style={{ cursor: 'pointer' }} />
            </span>
          ))}
        </div>
      </div>

      <div style={{ display: 'flex', gap: '0.75rem' }}>
        <button
          onClick={handleSubmit}
          style={{
            flex: 1,
            padding: '0.875rem',
            background: '#3b82f6',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontWeight: '600',
            fontSize: '1rem',
          }}
        >
          <Save size={18} style={{ verticalAlign: 'middle', marginRight: '0.5rem' }} />
          Save Fragment
        </button>
        <button
          onClick={onCancel}
          style={{
            padding: '0.875rem 1.5rem',
            background: '#1e293b',
            color: '#94a3b8',
            border: '1px solid #334155',
            borderRadius: '8px',
            cursor: 'pointer',
            fontWeight: '600',
          }}
        >
          Cancel
        </button>
      </div>
    </div>
  )
}

function TodoForm({ todo, onSave, onCancel, taskCategories }) {
  const [formData, setFormData] = useState(
    todo || {
      title: '',
      category: 'coding',
      deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      notes: '',
    }
  )

  const handleSubmit = () => {
    if (formData.title.trim() && formData.category && formData.deadline) {
      onSave(formData)
    }
  }

  return (
    <div>
      <div style={{ marginBottom: '1.5rem' }}>
        <label
          style={{
            display: 'block',
            marginBottom: '0.5rem',
            fontSize: '0.875rem',
            fontWeight: '600',
            color: '#94a3b8',
          }}
        >
          Todo Title *
        </label>
        <input
          type="text"
          value={formData.title}
          onChange={e => setFormData({ ...formData, title: e.target.value })}
          placeholder="What needs to be done?"
          style={{
            width: '100%',
            padding: '0.75rem',
            background: '#0f172a',
            border: '1px solid #334155',
            borderRadius: '8px',
            color: '#e2e8f0',
            fontSize: '1rem',
          }}
        />
      </div>

      <div style={{ marginBottom: '1.5rem' }}>
        <label
          style={{
            display: 'block',
            marginBottom: '0.5rem',
            fontSize: '0.875rem',
            fontWeight: '600',
            color: '#94a3b8',
          }}
        >
          Category *
        </label>
        <select
          value={formData.category}
          onChange={e => setFormData({ ...formData, category: e.target.value })}
          style={{
            width: '100%',
            padding: '0.75rem',
            background: '#0f172a',
            border: '1px solid #334155',
            borderRadius: '8px',
            color: '#e2e8f0',
            fontSize: '0.95rem',
            cursor: 'pointer',
          }}
        >
          {taskCategories.map(cat => (
            <option key={cat.value} value={cat.value}>
              {cat.icon} {cat.label}
            </option>
          ))}
        </select>
      </div>

      <div style={{ marginBottom: '1.5rem' }}>
        <label
          style={{
            display: 'block',
            marginBottom: '0.5rem',
            fontSize: '0.875rem',
            fontWeight: '600',
            color: '#94a3b8',
          }}
        >
          Deadline *
        </label>
        <input
          type="date"
          value={formData.deadline}
          onChange={e => setFormData({ ...formData, deadline: e.target.value })}
          style={{
            width: '100%',
            padding: '0.75rem',
            background: '#0f172a',
            border: '1px solid #334155',
            borderRadius: '8px',
            color: '#e2e8f0',
            fontSize: '0.95rem',
          }}
        />
      </div>

      <div style={{ marginBottom: '1.5rem' }}>
        <label
          style={{
            display: 'block',
            marginBottom: '0.5rem',
            fontSize: '0.875rem',
            fontWeight: '600',
            color: '#94a3b8',
          }}
        >
          Notes (optional)
        </label>
        <textarea
          value={formData.notes}
          onChange={e => setFormData({ ...formData, notes: e.target.value })}
          placeholder="Additional details, context, or requirements..."
          rows={4}
          style={{
            width: '100%',
            padding: '0.75rem',
            background: '#0f172a',
            border: '1px solid #334155',
            borderRadius: '8px',
            color: '#e2e8f0',
            fontSize: '0.95rem',
            resize: 'vertical',
          }}
        />
      </div>

      <div style={{ display: 'flex', gap: '0.75rem' }}>
        <button
          onClick={handleSubmit}
          style={{
            flex: 1,
            padding: '0.875rem',
            background: '#3b82f6',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontWeight: '600',
            fontSize: '1rem',
          }}
        >
          <Save size={18} style={{ verticalAlign: 'middle', marginRight: '0.5rem' }} />
          Save Todo
        </button>
        <button
          onClick={onCancel}
          style={{
            padding: '0.875rem 1.5rem',
            background: '#1e293b',
            color: '#94a3b8',
            border: '1px solid #334155',
            borderRadius: '8px',
            cursor: 'pointer',
            fontWeight: '600',
          }}
        >
          Cancel
        </button>
      </div>
    </div>
  )
}

function Modal({ children, onClose }) {
  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.8)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        padding: '2rem',
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: '#1e293b',
          borderRadius: '16px',
          padding: '2rem',
          maxWidth: '700px',
          width: '100%',
          maxHeight: '90vh',
          overflowY: 'auto',
          border: '1px solid #334155',
        }}
        onClick={e => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  )
}
