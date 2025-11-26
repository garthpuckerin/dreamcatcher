/**
 * Timeline View Component
 *
 * Visual timeline showing dream evolution over time
 * Features:
 * - Horizontal timeline with milestones
 * - Fragment clustering by date
 * - Milestone markers (started, launched, pivoted)
 * - Retrospective triggers
 * - Export to PDF
 */

import React, { useState, useEffect, useRef } from 'react'
import MilestoneMarker from './MilestoneMarker'
import RetrospectiveForm from './RetrospectiveForm'
import './timeline.css'

const TimelineView = ({ dream, fragments = [], onUpdate: _onUpdate }) => {
  const [milestones, setMilestones] = useState([])
  const [showRetrospective, setShowRetrospective] = useState(false)
  const [selectedPeriod, setSelectedPeriod] = useState(null)
  const [timelineData, setTimelineData] = useState([])
  const timelineRef = useRef(null)

  useEffect(() => {
    if (dream && fragments.length > 0) {
      generateTimelineData()
      detectMilestones()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dream, fragments])

  /**
   * Generate timeline data grouped by date
   */
  const generateTimelineData = () => {
    const grouped = {}

    // Group fragments by date
    fragments.forEach(fragment => {
      const date = new Date(fragment.date || fragment.created_at).toISOString().split('T')[0]

      if (!grouped[date]) {
        grouped[date] = {
          date,
          fragments: [],
          activity: 0,
        }
      }

      grouped[date].fragments.push(fragment)
      grouped[date].activity += fragment.content.length
    })

    // Convert to array and sort
    const timeline = Object.values(grouped).sort((a, b) => new Date(a.date) - new Date(b.date))

    setTimelineData(timeline)
  }

  /**
   * Auto-detect milestones from fragments and dream status
   */
  const detectMilestones = () => {
    const detected = []

    // Dream created milestone
    if (dream.created_at) {
      detected.push({
        id: 'created',
        type: 'started',
        date: dream.created_at,
        title: 'Dream Started',
        description: `Started working on "${dream.title}"`,
        icon: '🎯',
      })
    }

    // Analyze fragments for milestone keywords
    fragments.forEach(fragment => {
      const content = fragment.content.toLowerCase()
      const date = fragment.date || fragment.created_at

      // Launched
      if (
        content.includes('launch') ||
        content.includes('deployed') ||
        content.includes('released')
      ) {
        detected.push({
          id: `launch-${fragment.id}`,
          type: 'launched',
          date,
          title: 'Launched',
          description: fragment.title,
          icon: '🚀',
          fragmentId: fragment.id,
        })
      }

      // Pivot
      if (
        content.includes('pivot') ||
        content.includes('changed direction') ||
        content.includes('new approach')
      ) {
        detected.push({
          id: `pivot-${fragment.id}`,
          type: 'pivoted',
          date,
          title: 'Pivoted',
          description: fragment.title,
          icon: '🔄',
          fragmentId: fragment.id,
        })
      }

      // Milestone
      if (
        content.includes('milestone') ||
        content.includes('achieved') ||
        content.includes('completed')
      ) {
        detected.push({
          id: `milestone-${fragment.id}`,
          type: 'milestone',
          date,
          title: 'Milestone Reached',
          description: fragment.title,
          icon: '🎉',
          fragmentId: fragment.id,
        })
      }

      // Problem/Blocker
      if (content.includes('blocker') || content.includes('stuck') || content.includes('problem')) {
        detected.push({
          id: `blocker-${fragment.id}`,
          type: 'blocker',
          date,
          title: 'Blocker Encountered',
          description: fragment.title,
          icon: '⚠️',
          fragmentId: fragment.id,
        })
      }
    })

    // Dream completed milestone
    if (dream.status === 'completed' || dream.status === 'launched') {
      detected.push({
        id: 'completed',
        type: 'completed',
        date: dream.updated_at,
        title: 'Dream Completed',
        description: `Finished "${dream.title}"`,
        icon: '✅',
      })
    }

    // Sort by date
    detected.sort((a, b) => new Date(a.date) - new Date(b.date))

    setMilestones(detected)
  }

  /**
   * Calculate timeline position percentage
   */
  const getTimelinePosition = date => {
    if (timelineData.length === 0) return 0

    const firstDate = new Date(timelineData[0].date)
    const lastDate = new Date(timelineData[timelineData.length - 1].date)
    const currentDate = new Date(date)

    const totalDuration = lastDate - firstDate
    const currentPosition = currentDate - firstDate

    return totalDuration > 0 ? (currentPosition / totalDuration) * 100 : 0
  }

  /**
   * Export timeline as PDF
   */
  const handleExport = async () => {
    // This would use a library like jsPDF or html2canvas
    // For now, we'll just download the data as JSON
    const data = {
      dream: {
        id: dream.id,
        title: dream.title,
        status: dream.status,
        created_at: dream.created_at,
      },
      milestones,
      timelineData,
      generatedAt: new Date().toISOString(),
    }

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${dream.title.replace(/\s+/g, '-')}-timeline.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  /**
   * Trigger retrospective for a period
   */
  const handleCreateRetrospective = period => {
    setSelectedPeriod(period)
    setShowRetrospective(true)
  }

  /**
   * Get activity intensity color
   */
  const getActivityColor = activity => {
    const max = Math.max(...timelineData.map(d => d.activity))
    const intensity = activity / max

    if (intensity > 0.8) return '#10b981' // High activity
    if (intensity > 0.5) return '#3b82f6' // Medium activity
    if (intensity > 0.2) return '#8b5cf6' // Low activity
    return '#e5e7eb' // Minimal activity
  }

  /**
   * Get days since start
   */
  const getDaysSinceStart = () => {
    if (!dream.created_at) return 0
    const start = new Date(dream.created_at)
    const now = new Date()
    return Math.floor((now - start) / (1000 * 60 * 60 * 24))
  }

  return (
    <div className="timeline-view">
      <div className="timeline-header">
        <div>
          <h2>📅 Timeline: {dream.title}</h2>
          <p className="timeline-meta">
            {getDaysSinceStart()} days · {milestones.length} milestones · {fragments.length}{' '}
            fragments
          </p>
        </div>

        <div className="timeline-actions">
          <button onClick={() => handleCreateRetrospective('month')} className="btn btn-secondary">
            📊 Retrospective
          </button>
          <button onClick={handleExport} className="btn btn-secondary">
            📄 Export
          </button>
        </div>
      </div>

      {/* Activity Heatmap */}
      <div className="activity-heatmap">
        <h3>Activity Heatmap</h3>
        <div className="heatmap-grid">
          {timelineData.map((day, _index) => (
            <div
              key={day.date}
              className="heatmap-cell"
              style={{ backgroundColor: getActivityColor(day.activity) }}
              title={`${day.date}: ${day.fragments.length} fragments`}
            />
          ))}
        </div>
        <div className="heatmap-legend">
          <span>Less</span>
          <div className="legend-boxes">
            <div style={{ backgroundColor: '#e5e7eb' }} />
            <div style={{ backgroundColor: '#8b5cf6' }} />
            <div style={{ backgroundColor: '#3b82f6' }} />
            <div style={{ backgroundColor: '#10b981' }} />
          </div>
          <span>More</span>
        </div>
      </div>

      {/* Main Timeline */}
      <div className="timeline-container" ref={timelineRef}>
        <div className="timeline-line" />

        {/* Milestones */}
        {milestones.map((milestone, index) => (
          <MilestoneMarker
            key={milestone.id}
            milestone={milestone}
            position={getTimelinePosition(milestone.date)}
            index={index}
            onEdit={updated => {
              const newMilestones = [...milestones]
              newMilestones[index] = updated
              setMilestones(newMilestones)
            }}
            onDelete={() => {
              setMilestones(milestones.filter(m => m.id !== milestone.id))
            }}
          />
        ))}

        {/* Timeline Points (fragments grouped by date) */}
        {timelineData.map(day => (
          <div
            key={day.date}
            className="timeline-point"
            style={{ left: `${getTimelinePosition(day.date)}%` }}
            title={`${day.date}: ${day.fragments.length} fragments`}
          >
            <div className="timeline-point-dot" />
            <div className="timeline-point-label">
              {new Date(day.date).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
              })}
            </div>
            <div className="timeline-point-details">
              <strong>{day.fragments.length} fragments</strong>
              {day.fragments.slice(0, 3).map(f => (
                <div key={f.id} className="fragment-preview">
                  {f.title}
                </div>
              ))}
              {day.fragments.length > 3 && (
                <div className="fragment-preview">+{day.fragments.length - 3} more</div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Milestones List */}
      <div className="milestones-list">
        <h3>Key Milestones</h3>
        {milestones.length === 0 ? (
          <div className="empty-state">
            <p>No milestones detected yet.</p>
            <p>Milestones are automatically detected from your fragments.</p>
          </div>
        ) : (
          <div className="milestones-grid">
            {milestones.map(milestone => (
              <div key={milestone.id} className={`milestone-card milestone-${milestone.type}`}>
                <div className="milestone-icon">{milestone.icon}</div>
                <div className="milestone-content">
                  <h4>{milestone.title}</h4>
                  <p>{milestone.description}</p>
                  <span className="milestone-date">
                    {new Date(milestone.date).toLocaleDateString('en-US', {
                      month: 'long',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Retrospective Modal */}
      {showRetrospective && (
        <RetrospectiveForm
          dream={dream}
          fragments={fragments}
          period={selectedPeriod}
          onClose={() => setShowRetrospective(false)}
          onSave={retrospective => {
            console.log('Retrospective saved:', retrospective)
            setShowRetrospective(false)
            // You would save this to the backend
          }}
        />
      )}
    </div>
  )
}

export default TimelineView
