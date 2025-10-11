import React, { useState, useEffect } from 'react';
import { Search, Plus, Edit2, Trash2, Save, X, Upload, Download, Calendar, Layers, ChevronRight, ChevronDown } from 'lucide-react';

export default function Dreamcatcher() {
  const [dreams, setDreams] = useState([]);
  const [selectedDream, setSelectedDream] = useState(null);
  const [selectedFragment, setSelectedFragment] = useState(null);
  const [view, setView] = useState('consolidated'); // consolidated, timeline, fragments
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showNewDream, setShowNewDream] = useState(false);
  const [showNewFragment, setShowNewFragment] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [expandedDreams, setExpandedDreams] = useState({});

  useEffect(() => {
    // Load from localStorage or browser extension storage
    loadDreams();
  }, []);

  const loadDreams = () => {
    // Try to load from localStorage first
    const stored = localStorage.getItem('dreamcatcher-dreams');
    
    if (stored) {
      const loadedDreams = JSON.parse(stored);
      setDreams(loadedDreams);
      if (loadedDreams.length > 0) {
        setSelectedDream(loadedDreams[0]);
        setExpandedDreams({ [loadedDreams[0].id]: true });
      }
    } else {
      // Load sample data if nothing stored
      loadSampleData();
    }
  };

  const loadSampleData = () => {
    const sampleDreams = [
      {
        id: 1,
        title: 'Dreamcatcher',
        description: 'Consolidate scattered project ideas from multiple AI chat sessions into organized dreams',
        status: 'in-progress',
        tags: ['productivity', 'ai', 'web-app'],
        created: new Date('2025-01-08').toISOString(),
        updated: new Date().toISOString(),
        fragments: [
          {
            id: 101,
            title: 'Initial Concept',
            content: 'A way to capture ideas from chat sessions into a central, organized, searchable place. Problem: ideas scattered across threads, hard to find.',
            source: 'Claude conversation',
            date: new Date('2025-01-08').toISOString(),
            features: ['search', 'tagging', 'import/export'],
            codeSnippets: []
          },
          {
            id: 102,
            title: 'Dreams vs Ideas Insight',
            content: 'Not about linking separate ideas - about consolidating FRAGMENTS of the same idea across threads. Need Dreams (projects) containing Fragments (conversation pieces).',
            source: 'Claude conversation',
            date: new Date().toISOString(),
            features: ['consolidation', 'fragments', 'context aggregation', 'timeline view'],
            codeSnippets: []
          }
        ]
      },
      {
        id: 2,
        title: 'Resume Generator',
        description: 'Multi-style resume generator with PDF download capability',
        status: 'completed',
        tags: ['web-app', 'productivity', 'print-css'],
        created: new Date('2025-01-05').toISOString(),
        updated: new Date('2025-01-06').toISOString(),
        fragments: [
          {
            id: 201,
            title: 'Initial Build',
            content: 'Built resume generator with three styles: Classic, Modern, Minimal. Uses @media print for PDF generation.',
            source: 'Claude conversation',
            date: new Date('2025-01-05').toISOString(),
            features: ['multiple styles', 'PDF export', 'print CSS'],
            codeSnippets: ['@media print setup']
          },
          {
            id: 202,
            title: 'Modal Integration',
            content: 'Added modal interface for portfolio site. Users can preview and download different resume styles from thumbnail view.',
            source: 'Claude conversation',
            date: new Date('2025-01-06').toISOString(),
            features: ['modal UI', 'thumbnail previews', 'portfolio integration'],
            codeSnippets: ['modal component', 'resume data structure']
          }
        ]
      }
    ];
    setDreams(sampleDreams);
    setSelectedDream(sampleDreams[0]);
    setExpandedDreams({ 1: true });
    saveDreams(sampleDreams);
  };

  const saveDreams = (dreamsToSave) => {
    localStorage.setItem('dreamcatcher-dreams', JSON.stringify(dreamsToSave));
  };

  const statuses = [
    { value: 'idea', label: 'Idea', color: '#8b5cf6' },
    { value: 'planning', label: 'Planning', color: '#3b82f6' },
    { value: 'in-progress', label: 'In Progress', color: '#f59e0b' },
    { value: 'paused', label: 'Paused', color: '#6b7280' },
    { value: 'completed', label: 'Completed', color: '#10b981' },
    { value: 'abandoned', label: 'Abandoned', color: '#ef4444' }
  ];

  const allTags = [...new Set(dreams.flatMap(dream => dream.tags))];

  const filteredDreams = dreams.filter(dream => {
    const matchesSearch = dream.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dream.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dream.fragments.some(f => f.content.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesStatus = filterStatus === 'all' || dream.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const toggleDream = (dreamId) => {
    setExpandedDreams(prev => ({
      ...prev,
      [dreamId]: !prev[dreamId]
    }));
  };

  const addDream = (newDream) => {
    const dream = {
      ...newDream,
      id: Date.now(),
      fragments: [],
      created: new Date().toISOString(),
      updated: new Date().toISOString()
    };
    const updatedDreams = [dream, ...dreams];
    setDreams(updatedDreams);
    setSelectedDream(dream);
    setShowNewDream(false);
    saveDreams(updatedDreams);
  };

  const addFragment = (dreamId, newFragment) => {
    const fragment = {
      ...newFragment,
      id: Date.now(),
      date: new Date().toISOString()
    };
    const updatedDreams = dreams.map(dream => 
      dream.id === dreamId 
        ? { ...dream, fragments: [...dream.fragments, fragment], updated: new Date().toISOString() }
        : dream
    );
    setDreams(updatedDreams);
    setShowNewFragment(false);
    saveDreams(updatedDreams);
  };

  const updateDream = (updatedDream) => {
    const updatedDreams = dreams.map(dream => 
      dream.id === updatedDream.id 
        ? { ...updatedDream, updated: new Date().toISOString() }
        : dream
    );
    setDreams(updatedDreams);
    setSelectedDream(updatedDream);
    setIsEditing(false);
    saveDreams(updatedDreams);
  };

  const deleteDream = (id) => {
    if (window.confirm('Delete this dream and all its fragments?')) {
      const updatedDreams = dreams.filter(dream => dream.id !== id);
      setDreams(updatedDreams);
      setSelectedDream(updatedDreams[0] || null);
      saveDreams(updatedDreams);
    }
  };

  const deleteFragment = (dreamId, fragmentId) => {
    if (window.confirm('Delete this fragment?')) {
      const updatedDreams = dreams.map(dream => 
        dream.id === dreamId 
          ? { ...dream, fragments: dream.fragments.filter(f => f.id !== fragmentId) }
          : dream
      );
      setDreams(updatedDreams);
      saveDreams(updatedDreams);
    }
  };

  const exportData = () => {
    const dataStr = JSON.stringify(dreams, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `dreamcatcher-export-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
  };

  const importData = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const imported = JSON.parse(e.target.result);
          setDreams(imported);
          saveDreams(imported);
          if (imported.length > 0) {
            setSelectedDream(imported[0]);
          }
          alert('Data imported successfully!');
        } catch (error) {
          alert('Error importing data. Please check the file format.');
        }
      };
      reader.readAsText(file);
    }
  };

  const getAllFeatures = (dream) => {
    const features = new Set();
    dream.fragments.forEach(f => {
      if (f.features) f.features.forEach(feat => features.add(feat));
    });
    return Array.from(features);
  };

  const getConsolidatedNotes = (dream) => {
    return dream.fragments.map(f => f.content).join('\n\n---\n\n');
  };

  return (
    <div style={{ display: 'flex', height: '100vh', background: '#0f172a', color: '#e2e8f0', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      {/* Sidebar */}
      <div style={{ width: '340px', background: '#1e293b', borderRight: '1px solid #334155', display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '1.5rem', borderBottom: '1px solid #334155' }}>
          <h1 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '0.5rem', color: '#fff' }}>✨ Dreamcatcher</h1>
          <p style={{ fontSize: '0.875rem', color: '#94a3b8' }}>Dreams & Fragments</p>
        </div>

        <div style={{ padding: '1rem', borderBottom: '1px solid #334155' }}>
          <div style={{ position: 'relative', marginBottom: '0.75rem' }}>
            <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} />
            <input
              type="text"
              placeholder="Search dreams..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ width: '100%', padding: '0.625rem 0.625rem 0.625rem 2.5rem', background: '#0f172a', border: '1px solid #334155', borderRadius: '8px', color: '#e2e8f0', fontSize: '0.875rem' }}
            />
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            style={{ width: '100%', padding: '0.5rem', background: '#0f172a', border: '1px solid #334155', borderRadius: '6px', color: '#e2e8f0', fontSize: '0.8rem' }}
          >
            <option value="all">All Status</option>
            {statuses.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
          </select>
        </div>

        <div style={{ padding: '1rem', display: 'flex', gap: '0.5rem', borderBottom: '1px solid #334155' }}>
          <button onClick={() => setShowNewDream(true)} style={{ flex: 1, padding: '0.625rem', background: '#3b82f6', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', fontSize: '0.875rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
            <Plus size={16} /> New Dream
          </button>
          <input
            type="file"
            accept=".json"
            onChange={importData}
            style={{ display: 'none' }}
            id="import-file"
          />
          <label htmlFor="import-file" style={{ padding: '0.625rem', background: '#1e293b', color: '#94a3b8', border: '1px solid #334155', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
            <Upload size={16} />
          </label>
          <button onClick={exportData} style={{ padding: '0.625rem', background: '#1e293b', color: '#94a3b8', border: '1px solid #334155', borderRadius: '8px', cursor: 'pointer' }}>
            <Download size={16} />
          </button>
        </div>

        {/* Dreams Tree */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '0.5rem' }}>
          {filteredDreams.length === 0 ? (
            <div style={{ padding: '2rem 1rem', textAlign: 'center', color: '#64748b' }}>
              <p>No dreams found</p>
            </div>
          ) : (
            filteredDreams.map(dream => (
              <div key={dream.id} style={{ marginBottom: '0.5rem' }}>
                <div
                  style={{
                    padding: '1rem',
                    background: selectedDream?.id === dream.id && !selectedFragment ? '#334155' : '#1e293b',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    border: '1px solid',
                    borderColor: selectedDream?.id === dream.id && !selectedFragment ? '#3b82f6' : '#334155',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                    <button 
                      onClick={(e) => { e.stopPropagation(); toggleDream(dream.id); }}
                      style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: 0 }}
                    >
                      {expandedDreams[dream.id] ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                    </button>
                    <div onClick={() => { setSelectedDream(dream); setSelectedFragment(null); }} style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <h3 style={{ fontSize: '0.95rem', fontWeight: '600', color: '#fff' }}>{dream.title}</h3>
                        <span style={{ 
                          padding: '0.25rem 0.5rem', 
                          borderRadius: '4px', 
                          fontSize: '0.7rem', 
                          fontWeight: '600',
                          background: statuses.find(s => s.value === dream.status)?.color + '20',
                          color: statuses.find(s => s.value === dream.status)?.color
                        }}>
                          {statuses.find(s => s.value === dream.status)?.label}
                        </span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.25rem', fontSize: '0.75rem', color: '#64748b' }}>
                        <Layers size={12} />
                        <span>{dream.fragments.length} fragments</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Fragments */}
                {expandedDreams[dream.id] && (
                  <div style={{ marginLeft: '1.5rem', marginTop: '0.25rem' }}>
                    {dream.fragments.map(fragment => (
                      <div
                        key={fragment.id}
                        onClick={() => { setSelectedDream(dream); setSelectedFragment(fragment); }}
                        style={{
                          padding: '0.75rem',
                          marginBottom: '0.25rem',
                          background: selectedFragment?.id === fragment.id ? '#334155' : '#0f172a',
                          borderRadius: '6px',
                          cursor: 'pointer',
                          border: '1px solid',
                          borderColor: selectedFragment?.id === fragment.id ? '#3b82f6' : '#1e293b',
                          fontSize: '0.85rem'
                        }}
                      >
                        <div style={{ fontWeight: '500', color: '#cbd5e1', marginBottom: '0.25rem' }}>{fragment.title}</div>
                        <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                          {new Date(fragment.date).toLocaleDateString()} • {fragment.source}
                        </div>
                      </div>
                    ))}
                    <button 
                      onClick={() => { setSelectedDream(dream); setShowNewFragment(true); }}
                      style={{ 
                        width: '100%',
                        padding: '0.5rem',
                        background: '#0f172a',
                        border: '1px dashed #334155',
                        borderRadius: '6px',
                        color: '#64748b',
                        cursor: 'pointer',
                        fontSize: '0.8rem',
                        marginTop: '0.25rem'
                      }}
                    >
                      + Add Fragment
                    </button>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      {/* Main Content */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {selectedDream ? (
          <>
            <div style={{ padding: '1.5rem 2rem', borderBottom: '1px solid #334155' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                <div style={{ flex: 1 }}>
                  <h2 style={{ fontSize: '2rem', fontWeight: '700', marginBottom: '0.5rem', color: '#fff' }}>{selectedDream.title}</h2>
                  <p style={{ color: '#94a3b8', marginBottom: '0.75rem' }}>{selectedDream.description}</p>
                  <div style={{ display: 'flex', gap: '1rem', fontSize: '0.875rem', color: '#64748b' }}>
                    <span>Created: {new Date(selectedDream.created).toLocaleDateString()}</span>
                    <span>Updated: {new Date(selectedDream.updated).toLocaleDateString()}</span>
                    <span>{selectedDream.fragments.length} fragments</span>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button onClick={() => setIsEditing(!isEditing)} style={{ padding: '0.5rem 1rem', background: '#1e293b', color: '#94a3b8', border: '1px solid #334155', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Edit2 size={16} /> Edit
                  </button>
                  <button onClick={() => deleteDream(selectedDream.id)} style={{ padding: '0.5rem 1rem', background: '#1e293b', color: '#ef4444', border: '1px solid #334155', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>

              {/* View Tabs */}
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button 
                  onClick={() => { setView('consolidated'); setSelectedFragment(null); }}
                  style={{ 
                    padding: '0.5rem 1rem',
                    background: view === 'consolidated' ? '#3b82f6' : '#1e293b',
                    color: view === 'consolidated' ? 'white' : '#94a3b8',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '0.875rem',
                    fontWeight: '600'
                  }}
                >
                  Consolidated
                </button>
                <button 
                  onClick={() => { setView('timeline'); setSelectedFragment(null); }}
                  style={{ 
                    padding: '0.5rem 1rem',
                    background: view === 'timeline' ? '#3b82f6' : '#1e293b',
                    color: view === 'timeline' ? 'white' : '#94a3b8',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '0.875rem',
                    fontWeight: '600'
                  }}
                >
                  Timeline
                </button>
                <button 
                  onClick={() => { setView('fragments'); setSelectedFragment(null); }}
                  style={{ 
                    padding: '0.5rem 1rem',
                    background: view === 'fragments' ? '#3b82f6' : '#1e293b',
                    color: view === 'fragments' ? 'white' : '#94a3b8',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '0.875rem',
                    fontWeight: '600'
                  }}
                >
                  Fragments ({selectedDream.fragments.length})
                </button>
              </div>
            </div>

            <div style={{ flex: 1, overflowY: 'auto', padding: '2rem' }}>
              {isEditing ? (
                <DreamForm 
                  dream={selectedDream} 
                  onSave={updateDream}
                  onCancel={() => setIsEditing(false)}
                  statuses={statuses}
                />
              ) : selectedFragment ? (
                <FragmentView 
                  fragment={selectedFragment}
                  onDelete={() => deleteFragment(selectedDream.id, selectedFragment.id)}
                  onClose={() => setSelectedFragment(null)}
                />
              ) : view === 'consolidated' ? (
                <ConsolidatedView dream={selectedDream} statuses={statuses} getAllFeatures={getAllFeatures} />
              ) : view === 'timeline' ? (
                <TimelineView dream={selectedDream} onSelectFragment={setSelectedFragment} />
              ) : (
                <FragmentsView dream={selectedDream} onSelectFragment={setSelectedFragment} onAddFragment={() => setShowNewFragment(true)} />
              )}
            </div>
          </>
        ) : (
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b' }}>
            <div style={{ textAlign: 'center' }}>
              <h2 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>No dream selected</h2>
              <p>Select a dream from the sidebar or create a new one</p>
            </div>
          </div>
        )}
      </div>

      {/* Modals */}
      {showNewDream && (
        <Modal onClose={() => setShowNewDream(false)}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '1.5rem', color: '#fff' }}>New Dream</h2>
          <DreamForm 
            onSave={addDream}
            onCancel={() => setShowNewDream(false)}
            statuses={statuses}
          />
        </Modal>
      )}

      {showNewFragment && selectedDream && (
        <Modal onClose={() => setShowNewFragment(false)}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '1.5rem', color: '#fff' }}>New Fragment</h2>
          <FragmentForm 
            onSave={(fragment) => addFragment(selectedDream.id, fragment)}
            onCancel={() => setShowNewFragment(false)}
          />
        </Modal>
      )}
    </div>
  );
}

// View Components
function ConsolidatedView({ dream, statuses, getAllFeatures }) {
  const allFeatures = getAllFeatures(dream);
  
  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <h3 style={{ fontSize: '0.875rem', fontWeight: '600', color: '#64748b', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Status</h3>
        <span style={{ 
          display: 'inline-block',
          padding: '0.5rem 1rem', 
          borderRadius: '6px', 
          fontSize: '0.875rem', 
          fontWeight: '600',
          background: statuses.find(s => s.value === dream.status)?.color + '20',
          color: statuses.find(s => s.value === dream.status)?.color
        }}>
          {statuses.find(s => s.value === dream.status)?.label}
        </span>
      </div>

      <div style={{ marginBottom: '2rem' }}>
        <h3 style={{ fontSize: '0.875rem', fontWeight: '600', color: '#64748b', marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Tags</h3>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          {dream.tags.map(tag => (
            <span key={tag} style={{ padding: '0.5rem 1rem', background: '#1e293b', borderRadius: '6px', fontSize: '0.875rem', color: '#94a3b8', border: '1px solid #334155' }}>
              {tag}
            </span>
          ))}
        </div>
      </div>

      {allFeatures.length > 0 && (
        <div style={{ marginBottom: '2rem' }}>
          <h3 style={{ fontSize: '0.875rem', fontWeight: '600', color: '#64748b', marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>All Features Mentioned</h3>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            {allFeatures.map(feature => (
              <span key={feature} style={{ padding: '0.4rem 0.8rem', background: '#3b82f620', borderRadius: '6px', fontSize: '0.8rem', color: '#3b82f6', border: '1px solid #3b82f640' }}>
                {feature}
              </span>
            ))}
          </div>
        </div>
      )}

      <div>
        <h3 style={{ fontSize: '0.875rem', fontWeight: '600', color: '#64748b', marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Consolidated Content</h3>
        <div style={{ 
          padding: '1.5rem', 
          background: '#1e293b', 
          borderRadius: '8px', 
          fontSize: '0.95rem', 
          lineHeight: '1.7', 
          color: '#cbd5e1',
          whiteSpace: 'pre-wrap',
          border: '1px solid #334155'
        }}>
          {dream.fragments.map((f, i) => (
            <div key={f.id} style={{ marginBottom: i < dream.fragments.length - 1 ? '2rem' : 0 }}>
              <div style={{ color: '#64748b', fontSize: '0.85rem', marginBottom: '0.5rem' }}>
                {f.title} • {new Date(f.date).toLocaleDateString()}
              </div>
              {f.content}
              {i < dream.fragments.length - 1 && <div style={{ margin: '1.5rem 0', borderBottom: '1px solid #334155' }} />}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function TimelineView({ dream, onSelectFragment }) {
  const sortedFragments = [...dream.fragments].sort((a, b) => new Date(a.date) - new Date(b.date));

  return (
    <div style={{ position: 'relative', paddingLeft: '2rem' }}>
      <div style={{ position: 'absolute', left: '0.75rem', top: 0, bottom: 0, width: '2px', background: '#334155' }} />
      {sortedFragments.map((fragment, i) => (
        <div key={fragment.id} style={{ marginBottom: '2rem', position: 'relative' }}>
          <div style={{ position: 'absolute', left: '-1.5rem', top: '0.5rem', width: '12px', height: '12px', borderRadius: '50%', background: '#3b82f6', border: '3px solid #0f172a' }} />
          <div 
            onClick={() => onSelectFragment(fragment)}
            style={{ 
              padding: '1.5rem', 
              background: '#1e293b', 
              borderRadius: '8px', 
              border: '1px solid #334155',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => e.currentTarget.style.borderColor = '#3b82f6'}
            onMouseLeave={(e) => e.currentTarget.style.borderColor = '#334155'}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <h4 style={{ fontSize: '1.1rem', fontWeight: '600', color: '#fff' }}>{fragment.title}</h4>
              <span style={{ fontSize: '0.85rem', color: '#64748b' }}>{new Date(fragment.date).toLocaleDateString()}</span>
            </div>
            <p style={{ fontSize: '0.9rem', color: '#94a3b8', marginBottom: '0.75rem' }}>{fragment.content}</p>
            <div style={{ fontSize: '0.8rem', color: '#64748b' }}>Source: {fragment.source}</div>
            {fragment.features && fragment.features.length > 0 && (
              <div style={{ marginTop: '0.75rem', display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                {fragment.features.map(f => (
                  <span key={f} style={{ padding: '0.25rem 0.6rem', background: '#0f172a', borderRadius: '4px', fontSize: '0.75rem', color: '#64748b' }}>
                    {f}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

function FragmentsView({ dream, onSelectFragment, onAddFragment }) {
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h3 style={{ fontSize: '1.2rem', fontWeight: '600', color: '#fff' }}>{dream.fragments.length} Fragments</h3>
        <button onClick={onAddFragment} style={{ padding: '0.5rem 1rem', background: '#3b82f6', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '0.875rem', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Plus size={16} /> Add Fragment
        </button>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1rem' }}>
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
              transition: 'all 0.2s'
            }}
          >
            <h4 style={{ fontSize: '1rem', fontWeight: '600', color: '#fff', marginBottom: '0.5rem' }}>{fragment.title}</h4>
            <p style={{ fontSize: '0.85rem', color: '#94a3b8', marginBottom: '0.75rem', lineHeight: '1.6' }}>
              {fragment.content.substring(0, 150)}...
            </p>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#64748b' }}>
              <span>{new Date(fragment.date).toLocaleDateString()}</span>
              <span>{fragment.source}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function FragmentView({ fragment, onDelete, onClose }) {
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem' }}>
        <div>
          <h3 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#fff', marginBottom: '0.5rem' }}>{fragment.title}</h3>
          <div style={{ fontSize: '0.875rem', color: '#64748b' }}>
            {new Date(fragment.date).toLocaleDateString()} • {fragment.source}
          </div>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button onClick={onClose} style={{ padding: '0.5rem 1rem', background: '#1e293b', color: '#94a3b8', border: '1px solid #334155', borderRadius: '6px', cursor: 'pointer' }}>
            <X size={16} />
          </button>
          <button onClick={onDelete} style={{ padding: '0.5rem 1rem', background: '#1e293b', color: '#ef4444', border: '1px solid #334155', borderRadius: '6px', cursor: 'pointer' }}>
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      <div style={{ marginBottom: '2rem' }}>
        <h4 style={{ fontSize: '0.875rem', fontWeight: '600', color: '#64748b', marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Content</h4>
        <div style={{ 
          padding: '1.5rem', 
          background: '#1e293b', 
          borderRadius: '8px', 
          fontSize: '0.95rem', 
          lineHeight: '1.7', 
          color: '#cbd5e1',
          whiteSpace: 'pre-wrap',
          border: '1px solid #334155'
        }}>
          {fragment.content}
        </div>
      </div>

      {fragment.features && fragment.features.length > 0 && (
        <div style={{ marginBottom: '2rem' }}>
          <h4 style={{ fontSize: '0.875rem', fontWeight: '600', color: '#64748b', marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Features Mentioned</h4>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            {fragment.features.map(feature => (
              <span key={feature} style={{ padding: '0.5rem 1rem', background: '#3b82f620', borderRadius: '6px', fontSize: '0.875rem', color: '#3b82f6', border: '1px solid #3b82f640' }}>
                {feature}
              </span>
            ))}
          </div>
        </div>
      )}

      {fragment.codeSnippets && fragment.codeSnippets.length > 0 && (
        <div>
          <h4 style={{ fontSize: '0.875rem', fontWeight: '600', color: '#64748b', marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Code Snippets</h4>
          {fragment.codeSnippets.map((snippet, i) => (
            <div key={i} style={{ 
              padding: '1rem', 
              background: '#0f172a', 
              borderRadius: '6px', 
              fontSize: '0.85rem', 
              color: '#e2e8f0',
              fontFamily: 'monospace',
              marginBottom: '0.5rem',
              border: '1px solid #334155'
            }}>
              {snippet}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// Form Components
function DreamForm({ dream, onSave, onCancel, statuses }) {
  const [formData, setFormData] = useState(dream || {
    title: '',
    description: '',
    status: 'idea',
    tags: []
  });
  const [tagInput, setTagInput] = useState('');

  const addTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData({ ...formData, tags: [...formData.tags, tagInput.trim()] });
      setTagInput('');
    }
  };

  const removeTag = (tag) => {
    setFormData({ ...formData, tags: formData.tags.filter(t => t !== tag) });
  };

  const handleSubmit = () => {
    if (formData.title.trim()) {
      onSave(formData);
    }
  };

  return (
    <div>
      <div style={{ marginBottom: '1.5rem' }}>
        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '600', color: '#94a3b8' }}>Dream Title *</label>
        <input
          type="text"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          placeholder="My amazing project..."
          style={{ width: '100%', padding: '0.75rem', background: '#0f172a', border: '1px solid #334155', borderRadius: '8px', color: '#e2e8f0', fontSize: '1rem' }}
        />
      </div>

      <div style={{ marginBottom: '1.5rem' }}>
        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '600', color: '#94a3b8' }}>Description</label>
        <textarea
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="What's this dream about?"
          rows={3}
          style={{ width: '100%', padding: '0.75rem', background: '#0f172a', border: '1px solid #334155', borderRadius: '8px', color: '#e2e8f0', fontSize: '0.95rem', resize: 'vertical' }}
        />
      </div>

      <div style={{ marginBottom: '1.5rem' }}>
        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '600', color: '#94a3b8' }}>Status</label>
        <select
          value={formData.status}
          onChange={(e) => setFormData({ ...formData, status: e.target.value })}
          style={{ width: '100%', padding: '0.75rem', background: '#0f172a', border: '1px solid #334155', borderRadius: '8px', color: '#e2e8f0', fontSize: '0.95rem' }}
        >
          {statuses.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
        </select>
      </div>

      <div style={{ marginBottom: '1.5rem' }}>
        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '600', color: '#94a3b8' }}>Tags</label>
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.75rem' }}>
          <input
            type="text"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
            placeholder="Add a tag..."
            style={{ flex: 1, padding: '0.625rem', background: '#0f172a', border: '1px solid #334155', borderRadius: '6px', color: '#e2e8f0', fontSize: '0.875rem' }}
          />
          <button type="button" onClick={addTag} style={{ padding: '0.625rem 1rem', background: '#1e293b', color: '#94a3b8', border: '1px solid #334155', borderRadius: '6px', cursor: 'pointer' }}>
            Add
          </button>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          {formData.tags.map(tag => (
            <span key={tag} style={{ padding: '0.375rem 0.75rem', background: '#1e293b', borderRadius: '6px', fontSize: '0.8rem', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '0.5rem', border: '1px solid #334155' }}>
              {tag}
              <X size={14} onClick={() => removeTag(tag)} style={{ cursor: 'pointer', color: '#64748b' }} />
            </span>
          ))}
        </div>
      </div>

      <div style={{ display: 'flex', gap: '0.75rem' }}>
        <button onClick={handleSubmit} style={{ flex: 1, padding: '0.875rem', background: '#3b82f6', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', fontSize: '1rem' }}>
          <Save size={18} style={{ verticalAlign: 'middle', marginRight: '0.5rem' }} />
          Save Dream
        </button>
        <button onClick={onCancel} style={{ padding: '0.875rem 1.5rem', background: '#1e293b', color: '#94a3b8', border: '1px solid #334155', borderRadius: '8px', cursor: 'pointer', fontWeight: '600' }}>
          Cancel
        </button>
      </div>
    </div>
  );
}

function FragmentForm({ onSave, onCancel }) {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    source: '',
    features: [],
    codeSnippets: []
  });
  const [featureInput, setFeatureInput] = useState('');

  const addFeature = () => {
    if (featureInput.trim() && !formData.features.includes(featureInput.trim())) {
      setFormData({ ...formData, features: [...formData.features, featureInput.trim()] });
      setFeatureInput('');
    }
  };

  const removeFeature = (feature) => {
    setFormData({ ...formData, features: formData.features.filter(f => f !== feature) });
  };

  const handleSubmit = () => {
    if (formData.title.trim() && formData.content.trim()) {
      onSave(formData);
    }
  };

  return (
    <div>
      <div style={{ marginBottom: '1.5rem' }}>
        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '600', color: '#94a3b8' }}>Fragment Title *</label>
        <input
          type="text"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          placeholder="e.g., Initial concept, Feature discussion..."
          style={{ width: '100%', padding: '0.75rem', background: '#0f172a', border: '1px solid #334155', borderRadius: '8px', color: '#e2e8f0', fontSize: '1rem' }}
        />
      </div>

      <div style={{ marginBottom: '1.5rem' }}>
        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '600', color: '#94a3b8' }}>Content *</label>
        <textarea
          value={formData.content}
          onChange={(e) => setFormData({ ...formData, content: e.target.value })}
          placeholder="Paste conversation excerpt, notes, ideas..."
          rows={8}
          style={{ width: '100%', padding: '0.75rem', background: '#0f172a', border: '1px solid #334155', borderRadius: '8px', color: '#e2e8f0', fontSize: '0.95rem', resize: 'vertical', fontFamily: 'monospace' }}
        />
      </div>

      <div style={{ marginBottom: '1.5rem' }}>
        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '600', color: '#94a3b8' }}>Source</label>
        <input
          type="text"
          value={formData.source}
          onChange={(e) => setFormData({ ...formData, source: e.target.value })}
          placeholder="e.g., ChatGPT thread, Claude conversation..."
          style={{ width: '100%', padding: '0.75rem', background: '#0f172a', border: '1px solid #334155', borderRadius: '8px', color: '#e2e8f0', fontSize: '0.95rem' }}
        />
      </div>

      <div style={{ marginBottom: '1.5rem' }}>
        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '600', color: '#94a3b8' }}>Features Mentioned (optional)</label>
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.75rem' }}>
          <input
            type="text"
            value={featureInput}
            onChange={(e) => setFeatureInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addFeature())}
            placeholder="Add a feature..."
            style={{ flex: 1, padding: '0.625rem', background: '#0f172a', border: '1px solid #334155', borderRadius: '6px', color: '#e2e8f0', fontSize: '0.875rem' }}
          />
          <button type="button" onClick={addFeature} style={{ padding: '0.625rem 1rem', background: '#1e293b', color: '#94a3b8', border: '1px solid #334155', borderRadius: '6px', cursor: 'pointer' }}>
            Add
          </button>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          {formData.features.map(feature => (
            <span key={feature} style={{ padding: '0.375rem 0.75rem', background: '#3b82f620', borderRadius: '6px', fontSize: '0.8rem', color: '#3b82f6', display: 'flex', alignItems: 'center', gap: '0.5rem', border: '1px solid #3b82f640' }}>
              {feature}
              <X size={14} onClick={() => removeFeature(feature)} style={{ cursor: 'pointer' }} />
            </span>
          ))}
        </div>
      </div>

      <div style={{ display: 'flex', gap: '0.75rem' }}>
        <button onClick={handleSubmit} style={{ flex: 1, padding: '0.875rem', background: '#3b82f6', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', fontSize: '1rem' }}>
          <Save size={18} style={{ verticalAlign: 'middle', marginRight: '0.5rem' }} />
          Save Fragment
        </button>
        <button onClick={onCancel} style={{ padding: '0.875rem 1.5rem', background: '#1e293b', color: '#94a3b8', border: '1px solid #334155', borderRadius: '8px', cursor: 'pointer', fontWeight: '600' }}>
          Cancel
        </button>
      </div>
    </div>
  );
}

function Modal({ children, onClose }) {
  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '2rem' }} onClick={onClose}>
      <div style={{ background: '#1e293b', borderRadius: '16px', padding: '2rem', maxWidth: '700px', width: '100%', maxHeight: '90vh', overflowY: 'auto', border: '1px solid #334155' }} onClick={(e) => e.stopPropagation()}>
        {children}
      </div>
    </div>
  );
}


