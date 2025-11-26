/**
 * Template Browser Component
 *
 * Browse and discover dream templates from the marketplace
 * Features:
 * - Search and filter templates
 * - Category filtering
 * - Sort by popularity, rating, recent
 * - Template preview
 * - Purchase flow for premium templates
 */

import React, { useState, useEffect } from 'react'
import { templateService } from '../../services/templates'
import TemplateCard from './TemplateCard'
import TemplateEditor from './TemplateEditor'
import './templates.css'

const TemplateBrowser = ({ onApplyTemplate }) => {
  const [templates, setTemplates] = useState([])
  const [filteredTemplates, setFilteredTemplates] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [sortBy, setSortBy] = useState('rating') // rating, uses, recent
  const [showEditor, setShowEditor] = useState(false)
  const [selectedTemplate, setSelectedTemplate] = useState(null)

  const categories = ['all', 'product', 'project', 'personal', 'business', 'learning']

  useEffect(() => {
    loadTemplates()
  }, [])

  useEffect(() => {
    filterAndSortTemplates()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [templates, searchQuery, selectedCategory, sortBy])

  /**
   * Load all templates
   */
  const loadTemplates = () => {
    const allTemplates = templateService.getTemplates()
    setTemplates(allTemplates)
  }

  /**
   * Filter and sort templates
   */
  const filterAndSortTemplates = () => {
    let filtered = [...templates]

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        t => t.name.toLowerCase().includes(query) || t.description.toLowerCase().includes(query)
      )
    }

    // Apply category filter
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(t => t.category === selectedCategory)
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'rating':
          return b.rating - a.rating
        case 'uses':
          return b.uses - a.uses
        case 'recent':
          return new Date(b.createdAt || 0) - new Date(a.createdAt || 0)
        default:
          return 0
      }
    })

    setFilteredTemplates(filtered)
  }

  /**
   * Handle template application
   */
  const handleApplyTemplate = template => {
    const result = templateService.applyTemplate(template.id)
    onApplyTemplate(result)
  }

  /**
   * Handle template preview
   */
  const handlePreview = template => {
    setSelectedTemplate(template)
  }

  /**
   * Create custom template
   */
  const handleCreateTemplate = () => {
    setShowEditor(true)
  }

  /**
   * Save custom template
   */
  const handleSaveTemplate = templateData => {
    // This would typically call an API
    console.log('Saving template:', templateData)
    setShowEditor(false)
    loadTemplates() // Reload to show new template
  }

  return (
    <div className="template-browser">
      <div className="browser-header">
        <div>
          <h1>📚 Template Marketplace</h1>
          <p>Kickstart your dreams with proven templates</p>
        </div>

        <button onClick={handleCreateTemplate} className="btn btn-primary">
          ✨ Create Template
        </button>
      </div>

      {/* Search and Filters */}
      <div className="browser-controls">
        <div className="search-bar">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            placeholder="Search templates..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="filter-controls">
          <div className="category-filter">
            {categories.map(cat => (
              <button
                key={cat}
                className={`category-btn ${selectedCategory === cat ? 'active' : ''}`}
                onClick={() => setSelectedCategory(cat)}
              >
                {cat === 'all' ? 'All' : cat.charAt(0).toUpperCase() + cat.slice(1)}
              </button>
            ))}
          </div>

          <select value={sortBy} onChange={e => setSortBy(e.target.value)} className="sort-select">
            <option value="rating">Highest Rated</option>
            <option value="uses">Most Used</option>
            <option value="recent">Recently Added</option>
          </select>
        </div>
      </div>

      {/* Results Count */}
      <div className="results-info">
        <p>
          {filteredTemplates.length} template{filteredTemplates.length !== 1 ? 's' : ''} found
        </p>
      </div>

      {/* Templates Grid */}
      <div className="templates-grid">
        {filteredTemplates.map(template => (
          <TemplateCard
            key={template.id}
            template={template}
            onApply={handleApplyTemplate}
            onPreview={handlePreview}
          />
        ))}
      </div>

      {filteredTemplates.length === 0 && (
        <div className="empty-state">
          <div className="empty-icon">📭</div>
          <h3>No templates found</h3>
          <p>Try adjusting your search or filters</p>
          <button
            onClick={() => {
              setSearchQuery('')
              setSelectedCategory('all')
            }}
            className="btn btn-secondary"
          >
            Clear Filters
          </button>
        </div>
      )}

      {/* Template Preview Modal */}
      {selectedTemplate && (
        <div className="template-preview-modal" onClick={() => setSelectedTemplate(null)}>
          <div className="modal-content-preview" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <div>
                <h2>{selectedTemplate.name}</h2>
                <p>{selectedTemplate.description}</p>
              </div>
              <button onClick={() => setSelectedTemplate(null)} className="close-btn">
                ×
              </button>
            </div>

            <div className="preview-body">
              {/* Template Info */}
              <div className="template-info-section">
                <div className="info-grid">
                  <div className="info-item">
                    <span className="info-label">Category</span>
                    <span className="info-value">{selectedTemplate.category}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Author</span>
                    <span className="info-value">{selectedTemplate.author}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Rating</span>
                    <span className="info-value">⭐ {selectedTemplate.rating}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Uses</span>
                    <span className="info-value">{selectedTemplate.uses.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* Dream Preview */}
              <div className="dream-preview-section">
                <h3>📋 Dream Template</h3>
                <div className="dream-preview-card">
                  <h4>{selectedTemplate.dream.title}</h4>
                  <p>{selectedTemplate.dream.description}</p>
                  <div className="tags-preview">
                    {selectedTemplate.dream.tags.map(tag => (
                      <span key={tag} className="tag">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Todos Preview */}
              <div className="todos-preview-section">
                <h3>✅ Included Tasks ({selectedTemplate.todos.length})</h3>
                <div className="todos-list-preview">
                  {selectedTemplate.todos.map((todo, index) => (
                    <div key={index} className="todo-preview-item">
                      <span className="todo-number">{index + 1}</span>
                      <div className="todo-content">
                        <div className="todo-title">{todo.title}</div>
                        <div className="todo-meta">
                          <span className="todo-category">{todo.category}</span>
                          {todo.notes && <span className="todo-notes">{todo.notes}</span>}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button onClick={() => setSelectedTemplate(null)} className="btn btn-secondary">
                Close
              </button>
              <button
                onClick={() => {
                  handleApplyTemplate(selectedTemplate)
                  setSelectedTemplate(null)
                }}
                className="btn btn-primary"
              >
                {selectedTemplate.price > 0
                  ? `Purchase for $${selectedTemplate.price}`
                  : 'Use Template'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Template Editor Modal */}
      {showEditor && (
        <TemplateEditor onClose={() => setShowEditor(false)} onSave={handleSaveTemplate} />
      )}
    </div>
  )
}

export default TemplateBrowser
