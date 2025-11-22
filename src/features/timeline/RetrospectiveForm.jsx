/**
 * Retrospective Form Component
 *
 * Guided retrospective creation with AI assistance
 * Classic formats: Start-Stop-Continue, 4Ls, Sailboat
 */

import React, { useState, useEffect } from 'react'
import { aiAssistant } from '../../services/ai-assistant'
import { analyticsService } from '../../services/analytics'

const RETROSPECTIVE_FORMATS = {
  'start-stop-continue': {
    name: 'Start-Stop-Continue',
    description: 'What should we start, stop, and continue doing?',
    sections: ['Start', 'Stop', 'Continue'],
  },
  '4ls': {
    name: '4 Ls',
    description: 'Liked, Learned, Lacked, Longed For',
    sections: ['Liked', 'Learned', 'Lacked', 'Longed For'],
  },
  sailboat: {
    name: 'Sailboat',
    description: 'Wind (helping), Anchors (blocking), Rocks (risks), Island (goal)',
    sections: ['Wind ⛵', 'Anchors ⚓', 'Rocks 🪨', 'Island 🏝️'],
  },
  'mad-sad-glad': {
    name: 'Mad-Sad-Glad',
    description: 'Emotional retrospective',
    sections: ['Mad 😠', 'Sad 😢', 'Glad 😊'],
  },
}

const RetrospectiveForm = ({ dream, fragments, period, onClose, onSave }) => {
  const [format, setFormat] = useState('start-stop-continue')
  const [sections, setSections] = useState({})
  const [aiSuggestions, setAiSuggestions] = useState({})
  const [isGenerating, setIsGenerating] = useState(false)
  const [metrics, setMetrics] = useState(null)

  useEffect(() => {
    // Initialize sections
    const initialSections = {}
    RETROSPECTIVE_FORMATS[format].sections.forEach(section => {
      initialSections[section] = []
    })
    setSections(initialSections)

    // Generate metrics for the period
    calculateMetrics()
  }, [format, dream, fragments, period])

  /**
   * Calculate metrics for retrospective period
   */
  const calculateMetrics = () => {
    const velocity = analyticsService.calculateDreamVelocity([dream])
    const fragmentFrequency = analyticsService.getFragmentFrequency(fragments)
    const trends = analyticsService.getProductivityTrends([dream])

    setMetrics({
      velocity,
      fragmentFrequency,
      trends,
      totalFragments: fragments.length,
      periodDays: period === 'week' ? 7 : period === 'month' ? 30 : 90,
    })
  }

  /**
   * Generate AI suggestions for retrospective
   */
  const handleGenerateAI = async () => {
    setIsGenerating(true)

    try {
      const formatConfig = RETROSPECTIVE_FORMATS[format]
      const suggestions = {}

      // Get AI suggestions for each section
      for (const section of formatConfig.sections) {
        const prompt = generatePromptForSection(section, formatConfig.name)
        const response = await aiAssistant.ask(prompt, {
          dreams: [dream],
          recentFragments: fragments,
        })

        suggestions[section] = parseAIResponse(response)
      }

      setAiSuggestions(suggestions)
    } catch (error) {
      console.error('Failed to generate AI suggestions:', error)
      alert('Failed to generate suggestions. Please try again.')
    } finally {
      setIsGenerating(false)
    }
  }

  /**
   * Generate prompt for AI based on section
   */
  const generatePromptForSection = (section, formatName) => {
    const sectionPrompts = {
      Start: `Based on my dream "${dream.title}" and recent activity, what should I START doing? Suggest 3-5 actionable items.`,
      Stop: `What should I STOP doing that's not helping progress on "${dream.title}"? List 3-5 things.`,
      Continue: `What's working well that I should CONTINUE doing for "${dream.title}"? List 3-5 things.`,
      Liked: `What went well during this period working on "${dream.title}"?`,
      Learned: `What did I learn while working on "${dream.title}"? Extract key learnings.`,
      Lacked: `What resources, tools, or support was lacking for "${dream.title}"?`,
      'Longed For': `What would have made progress on "${dream.title}" easier or better?`,
      'Wind ⛵': `What factors are helping propel "${dream.title}" forward?`,
      'Anchors ⚓': `What's holding back progress on "${dream.title}"?`,
      'Rocks 🪨': `What risks or obstacles lie ahead for "${dream.title}"?`,
      'Island 🏝️': `What's the ultimate goal/destination for "${dream.title}"?`,
      'Mad 😠': `What was frustrating about working on "${dream.title}"?`,
      'Sad 😢': `What disappointments occurred with "${dream.title}"?`,
      'Glad 😊': `What were the wins and positive moments with "${dream.title}"?`,
    }

    return sectionPrompts[section] || `Analyze "${dream.title}" for the ${section} section.`
  }

  /**
   * Parse AI response into bullet points
   */
  const parseAIResponse = response => {
    // Split by newlines and filter out empty lines
    return response
      .split('\n')
      .map(line => line.trim())
      .filter(
        line => line && (line.startsWith('-') || line.startsWith('•') || line.match(/^\d+\./))
      )
      .map(line => line.replace(/^[-•]\s*/, '').replace(/^\d+\.\s*/, ''))
  }

  /**
   * Add item to section
   */
  const addItem = (section, item) => {
    if (!item.trim()) return

    setSections({
      ...sections,
      [section]: [...sections[section], { text: item, votes: 0 }],
    })
  }

  /**
   * Remove item from section
   */
  const removeItem = (section, index) => {
    setSections({
      ...sections,
      [section]: sections[section].filter((_, i) => i !== index),
    })
  }

  /**
   * Vote for item (useful for team retrospectives)
   */
  const voteItem = (section, index) => {
    const updated = { ...sections }
    updated[section][index].votes += 1
    setSections(updated)
  }

  /**
   * Use AI suggestion
   */
  const useSuggestion = (section, suggestion) => {
    addItem(section, suggestion)
  }

  /**
   * Save retrospective
   */
  const handleSave = () => {
    const retrospective = {
      id: `retro-${Date.now()}`,
      dreamId: dream.id,
      format,
      sections,
      metrics,
      period,
      createdAt: new Date().toISOString(),
    }

    onSave(retrospective)
  }

  return (
    <div className="retrospective-modal" onClick={onClose}>
      <div className="retrospective-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <h2>📊 Retrospective: {dream.title}</h2>
            <p>Reflect on progress and plan improvements</p>
          </div>
          <button onClick={onClose} className="close-btn">
            ×
          </button>
        </div>

        {/* Format Selection */}
        <div className="format-selection">
          <label>Format:</label>
          <div className="format-buttons">
            {Object.entries(RETROSPECTIVE_FORMATS).map(([key, fmt]) => (
              <button
                key={key}
                className={`format-btn ${format === key ? 'active' : ''}`}
                onClick={() => setFormat(key)}
                title={fmt.description}
              >
                {fmt.name}
              </button>
            ))}
          </div>
        </div>

        {/* AI Generation */}
        <div className="ai-generation">
          <button onClick={handleGenerateAI} disabled={isGenerating} className="btn btn-primary">
            {isGenerating ? '⏳ Generating...' : '🤖 Generate AI Suggestions'}
          </button>
        </div>

        {/* Metrics Summary */}
        {metrics && (
          <div className="metrics-summary">
            <h3>Period Metrics</h3>
            <div className="metrics-grid">
              <div className="metric-card">
                <div className="metric-value">{metrics.totalFragments}</div>
                <div className="metric-label">Fragments Captured</div>
              </div>
              <div className="metric-card">
                <div className="metric-value">{metrics.fragmentFrequency.perWeek.toFixed(1)}</div>
                <div className="metric-label">Fragments/Week</div>
              </div>
              <div className="metric-card">
                <div className="metric-value">{metrics.periodDays}</div>
                <div className="metric-label">Days in Period</div>
              </div>
            </div>
          </div>
        )}

        {/* Retrospective Sections */}
        <div className="retrospective-sections">
          {RETROSPECTIVE_FORMATS[format].sections.map(section => (
            <div key={section} className="retro-section">
              <h3>{section}</h3>

              {/* AI Suggestions */}
              {aiSuggestions[section] && aiSuggestions[section].length > 0 && (
                <div className="ai-suggestions">
                  <p className="suggestions-label">💡 AI Suggestions:</p>
                  {aiSuggestions[section].map((suggestion, i) => (
                    <div key={i} className="suggestion-item">
                      <span>{suggestion}</span>
                      <button onClick={() => useSuggestion(section, suggestion)} className="btn-sm">
                        + Add
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Items List */}
              <div className="items-list">
                {sections[section]?.map((item, index) => (
                  <div key={index} className="retro-item">
                    <div className="item-content">
                      <span>{item.text}</span>
                      {item.votes > 0 && <span className="votes">👍 {item.votes}</span>}
                    </div>
                    <div className="item-actions">
                      <button
                        onClick={() => voteItem(section, index)}
                        className="btn-sm"
                        title="Vote"
                      >
                        👍
                      </button>
                      <button
                        onClick={() => removeItem(section, index)}
                        className="btn-sm btn-danger"
                        title="Remove"
                      >
                        ×
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Add Item Input */}
              <div className="add-item">
                <input
                  type="text"
                  placeholder={`Add ${section.toLowerCase()} item...`}
                  onKeyPress={e => {
                    if (e.key === 'Enter') {
                      addItem(section, e.target.value)
                      e.target.value = ''
                    }
                  }}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Actions */}
        <div className="modal-footer">
          <button onClick={onClose} className="btn btn-secondary">
            Cancel
          </button>
          <button onClick={handleSave} className="btn btn-primary">
            💾 Save Retrospective
          </button>
        </div>
      </div>
    </div>
  )
}

export default RetrospectiveForm
