/**
 * Portfolio Builder Component
 *
 * Create public showcase pages for completed dreams
 * Features:
 * - Drag-and-drop project organization
 * - Custom themes and branding
 * - Skills tracking
 * - Case study generation
 * - SEO optimization
 * - Export options (PDF, HTML)
 */

import React, { useState, useEffect } from 'react'
import CaseStudyGenerator from './CaseStudyGenerator'
import PublicShowcase from './PublicShowcase'
import './portfolio.css'

const THEMES = {
  minimal: {
    name: 'Minimal',
    colors: { primary: '#1a202c', secondary: '#718096', accent: '#667eea' },
  },
  vibrant: {
    name: 'Vibrant',
    colors: { primary: '#9333ea', secondary: '#ec4899', accent: '#f59e0b' },
  },
  professional: {
    name: 'Professional',
    colors: { primary: '#1e40af', secondary: '#64748b', accent: '#0891b2' },
  },
  dark: {
    name: 'Dark Mode',
    colors: { primary: '#f9fafb', secondary: '#9ca3af', accent: '#8b5cf6' },
  },
}

const PortfolioBuilder = ({ user, dreams }) => {
  const [portfolio, setPortfolio] = useState(null)
  const [selectedDreams, setSelectedDreams] = useState([])
  const [theme, setTheme] = useState('minimal')
  const [showCaseStudyGenerator, setShowCaseStudyGenerator] = useState(false)
  const [selectedDreamForCase, setSelectedDreamForCase] = useState(null)
  const [showPreview, setShowPreview] = useState(false)

  useEffect(() => {
    loadPortfolio()
  }, [user])

  /**
   * Load existing portfolio or create new
   */
  const loadPortfolio = async () => {
    try {
      const response = await fetch(`/api/portfolio/${user.id}`)

      if (response.ok) {
        const data = await response.json()
        setPortfolio(data)
        setSelectedDreams(data.dreams || [])
        setTheme(data.theme || 'minimal')
      } else {
        // Create new portfolio
        setPortfolio({
          userId: user.id,
          title: `${user.name}'s Portfolio`,
          bio: '',
          skills: [],
          dreams: [],
          theme: 'minimal',
          customDomain: null,
          isPublic: false,
        })
      }
    } catch (error) {
      console.error('Failed to load portfolio:', error)
    }
  }

  /**
   * Save portfolio
   */
  const savePortfolio = async () => {
    try {
      const response = await fetch(`/api/portfolio/${user.id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...portfolio,
          dreams: selectedDreams,
          theme,
        }),
      })

      if (response.ok) {
        alert('Portfolio saved successfully!')
      }
    } catch (error) {
      console.error('Failed to save portfolio:', error)
      alert('Failed to save portfolio')
    }
  }

  /**
   * Toggle dream selection
   */
  const toggleDream = dream => {
    if (selectedDreams.find(d => d.id === dream.id)) {
      setSelectedDreams(selectedDreams.filter(d => d.id !== dream.id))
    } else {
      setSelectedDreams([...selectedDreams, dream])
    }
  }

  /**
   * Update dream display order
   */
  const reorderDreams = (fromIndex, toIndex) => {
    const updated = [...selectedDreams]
    const [moved] = updated.splice(fromIndex, 1)
    updated.splice(toIndex, 0, moved)
    setSelectedDreams(updated)
  }

  /**
   * Extract skills from dreams
   */
  const extractSkills = () => {
    const skillSet = new Set()

    selectedDreams.forEach(dream => {
      dream.tags?.forEach(tag => skillSet.add(tag))
      // Could also extract from fragments, todos, etc.
    })

    return Array.from(skillSet)
  }

  /**
   * Generate case study for dream
   */
  const handleGenerateCaseStudy = dream => {
    setSelectedDreamForCase(dream)
    setShowCaseStudyGenerator(true)
  }

  /**
   * Publish/Unpublish portfolio
   */
  const togglePublish = async () => {
    const updated = { ...portfolio, isPublic: !portfolio.isPublic }
    setPortfolio(updated)

    try {
      await fetch(`/api/portfolio/${user.id}/publish`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isPublic: updated.isPublic }),
      })

      alert(updated.isPublic ? 'Portfolio published!' : 'Portfolio unpublished')
    } catch (error) {
      console.error('Failed to update publish status:', error)
    }
  }

  /**
   * Copy portfolio URL
   */
  const copyPortfolioURL = () => {
    const url = portfolio.customDomain || `https://dreamcatcher.app/${user.username}`
    navigator.clipboard.writeText(url)
    alert('Portfolio URL copied to clipboard!')
  }

  /**
   * Export portfolio as PDF
   */
  const exportAsPDF = () => {
    // Would use jsPDF or similar
    alert('PDF export coming soon!')
  }

  if (!portfolio) {
    return <div className="loading">Loading portfolio...</div>
  }

  return (
    <div className="portfolio-builder">
      <div className="builder-header">
        <div>
          <h1>🎨 Portfolio Builder</h1>
          <p>Create a public showcase of your completed dreams</p>
        </div>

        <div className="header-actions">
          <button onClick={() => setShowPreview(true)} className="btn btn-secondary">
            👁️ Preview
          </button>
          <button onClick={savePortfolio} className="btn btn-primary">
            💾 Save
          </button>
          <button
            onClick={togglePublish}
            className={`btn ${portfolio.isPublic ? 'btn-success' : 'btn-secondary'}`}
          >
            {portfolio.isPublic ? '✅ Published' : '📤 Publish'}
          </button>
        </div>
      </div>

      <div className="builder-content">
        {/* Sidebar - Settings */}
        <div className="builder-sidebar">
          <div className="sidebar-section">
            <h3>⚙️ Settings</h3>

            <div className="form-group">
              <label>Portfolio Title</label>
              <input
                type="text"
                value={portfolio.title}
                onChange={e => setPortfolio({ ...portfolio, title: e.target.value })}
                placeholder="My Portfolio"
              />
            </div>

            <div className="form-group">
              <label>Bio</label>
              <textarea
                value={portfolio.bio}
                onChange={e => setPortfolio({ ...portfolio, bio: e.target.value })}
                placeholder="Tell visitors about yourself..."
                rows={4}
              />
            </div>

            <div className="form-group">
              <label>Custom Domain</label>
              <input
                type="text"
                value={portfolio.customDomain || ''}
                onChange={e => setPortfolio({ ...portfolio, customDomain: e.target.value })}
                placeholder="portfolio.yourdomain.com"
              />
              <small>Pro feature: Connect your own domain</small>
            </div>

            <div className="form-group">
              <label>Portfolio URL</label>
              <div className="url-display">
                <code>{portfolio.customDomain || `dreamcatcher.app/${user.username}`}</code>
                <button onClick={copyPortfolioURL} className="btn-sm">
                  📋 Copy
                </button>
              </div>
            </div>
          </div>

          <div className="sidebar-section">
            <h3>🎨 Theme</h3>
            <div className="theme-selector">
              {Object.entries(THEMES).map(([key, t]) => (
                <div
                  key={key}
                  className={`theme-option ${theme === key ? 'selected' : ''}`}
                  onClick={() => setTheme(key)}
                >
                  <div className="theme-preview">
                    <div style={{ background: t.colors.primary }} />
                    <div style={{ background: t.colors.secondary }} />
                    <div style={{ background: t.colors.accent }} />
                  </div>
                  <span>{t.name}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="sidebar-section">
            <h3>🛠️ Skills</h3>
            <div className="skills-list">
              {extractSkills().map(skill => (
                <span key={skill} className="skill-badge">
                  {skill}
                </span>
              ))}
            </div>
            <button
              className="btn btn-sm btn-secondary"
              style={{ width: '100%', marginTop: '8px' }}
            >
              + Add Custom Skill
            </button>
          </div>

          <div className="sidebar-section">
            <h3>📤 Export</h3>
            <button onClick={exportAsPDF} className="btn btn-secondary" style={{ width: '100%' }}>
              📄 Export as PDF
            </button>
          </div>
        </div>

        {/* Main Area - Dream Selection */}
        <div className="builder-main">
          <div className="section-header">
            <h3>Select Dreams to Showcase</h3>
            <p>Choose completed dreams to feature in your portfolio</p>
          </div>

          <div className="dreams-grid">
            {dreams
              .filter(d => d.status === 'completed' || d.status === 'launched')
              .map(dream => {
                const isSelected = selectedDreams.find(d => d.id === dream.id)

                return (
                  <div
                    key={dream.id}
                    className={`dream-card ${isSelected ? 'selected' : ''}`}
                    onClick={() => toggleDream(dream)}
                  >
                    <div className="dream-card-header">
                      <div className="selection-checkbox">{isSelected && '✓'}</div>
                      <h4>{dream.title}</h4>
                    </div>

                    <p className="dream-description">{dream.description || 'No description'}</p>

                    <div className="dream-meta">
                      <span>{dream.fragments?.length || 0} fragments</span>
                      <span>·</span>
                      <span>{dream.todos?.filter(t => t.completed).length || 0} tasks done</span>
                    </div>

                    {dream.tags && (
                      <div className="dream-tags">
                        {dream.tags.slice(0, 3).map(tag => (
                          <span key={tag} className="tag">
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}

                    {isSelected && (
                      <button
                        onClick={e => {
                          e.stopPropagation()
                          handleGenerateCaseStudy(dream)
                        }}
                        className="btn btn-sm btn-primary"
                        style={{ marginTop: '12px', width: '100%' }}
                      >
                        📝 Generate Case Study
                      </button>
                    )}
                  </div>
                )
              })}
          </div>

          {selectedDreams.length === 0 && (
            <div className="empty-state">
              <p>No dreams selected. Click on completed dreams to add them to your portfolio.</p>
            </div>
          )}

          {/* Selected Dreams Order */}
          {selectedDreams.length > 0 && (
            <div className="selected-dreams-section">
              <h3>Portfolio Order ({selectedDreams.length} selected)</h3>
              <p>Drag to reorder how dreams appear in your portfolio</p>

              <div className="selected-dreams-list">
                {selectedDreams.map((dream, index) => (
                  <div key={dream.id} className="selected-dream-item">
                    <div className="drag-handle">⋮⋮</div>
                    <div className="dream-info">
                      <strong>{dream.title}</strong>
                      <span>{dream.status}</span>
                    </div>
                    <div className="dream-actions">
                      <button onClick={() => handleGenerateCaseStudy(dream)} className="btn-sm">
                        📝 Case Study
                      </button>
                      <button onClick={() => toggleDream(dream)} className="btn-sm btn-danger">
                        ×
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Case Study Generator Modal */}
      {showCaseStudyGenerator && (
        <CaseStudyGenerator
          dream={selectedDreamForCase}
          onClose={() => setShowCaseStudyGenerator(false)}
          onSave={caseStudy => {
            // Update dream with case study
            const updated = selectedDreams.map(d =>
              d.id === selectedDreamForCase.id ? { ...d, caseStudy } : d
            )
            setSelectedDreams(updated)
            setShowCaseStudyGenerator(false)
          }}
        />
      )}

      {/* Preview Modal */}
      {showPreview && (
        <div className="preview-modal" onClick={() => setShowPreview(false)}>
          <div className="modal-content-large" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Portfolio Preview</h2>
              <button onClick={() => setShowPreview(false)}>×</button>
            </div>
            <div className="preview-container">
              <PublicShowcase
                portfolio={{ ...portfolio, dreams: selectedDreams, theme }}
                isPreview={true}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default PortfolioBuilder
