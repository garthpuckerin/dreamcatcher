/**
 * Milestone Marker Component
 *
 * Individual milestone indicator on timeline
 * Supports edit, delete, and detail view
 */

import React, { useState } from 'react'

const MilestoneMarker = ({ milestone, position, index, onEdit, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false)
  const [editData, setEditData] = useState(milestone)
  const [showTooltip, setShowTooltip] = useState(false)

  const handleSave = () => {
    onEdit(editData)
    setIsEditing(false)
  }

  const handleCancel = () => {
    setEditData(milestone)
    setIsEditing(false)
  }

  // Milestone type styles
  const getTypeStyle = type => {
    const styles = {
      started: {
        background: '#3b82f6',
        color: '#fff',
      },
      launched: {
        background: '#10b981',
        color: '#fff',
      },
      pivoted: {
        background: '#f59e0b',
        color: '#fff',
      },
      milestone: {
        background: '#8b5cf6',
        color: '#fff',
      },
      blocker: {
        background: '#ef4444',
        color: '#fff',
      },
      completed: {
        background: '#14b8a6',
        color: '#fff',
      },
    }

    return styles[type] || styles.milestone
  }

  return (
    <>
      <div
        className="milestone-marker"
        style={{
          left: `${position}%`,
          ...getTypeStyle(milestone.type),
        }}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        onClick={() => setIsEditing(true)}
      >
        <div className="milestone-marker-icon">{milestone.icon}</div>
        <div className="milestone-marker-line" />

        {/* Tooltip */}
        {showTooltip && !isEditing && (
          <div className="milestone-tooltip">
            <div className="tooltip-header">
              <span className="tooltip-icon">{milestone.icon}</span>
              <strong>{milestone.title}</strong>
            </div>
            <p>{milestone.description}</p>
            <div className="tooltip-meta">
              {new Date(milestone.date).toLocaleDateString('en-US', {
                month: 'long',
                day: 'numeric',
                year: 'numeric',
              })}
            </div>
            <div className="tooltip-actions">
              <button
                onClick={e => {
                  e.stopPropagation()
                  setIsEditing(true)
                }}
              >
                ✏️ Edit
              </button>
              <button
                onClick={e => {
                  e.stopPropagation()
                  if (confirm('Delete this milestone?')) {
                    onDelete()
                  }
                }}
                className="btn-danger"
              >
                🗑️ Delete
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Edit Modal */}
      {isEditing && (
        <div className="milestone-edit-modal" onClick={() => setIsEditing(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Edit Milestone</h3>
              <button onClick={() => setIsEditing(false)}>×</button>
            </div>

            <div className="modal-body">
              <div className="form-group">
                <label>Type</label>
                <select
                  value={editData.type}
                  onChange={e => setEditData({ ...editData, type: e.target.value })}
                >
                  <option value="started">Started</option>
                  <option value="launched">Launched</option>
                  <option value="pivoted">Pivoted</option>
                  <option value="milestone">Milestone</option>
                  <option value="blocker">Blocker</option>
                  <option value="completed">Completed</option>
                </select>
              </div>

              <div className="form-group">
                <label>Icon</label>
                <input
                  type="text"
                  value={editData.icon}
                  onChange={e => setEditData({ ...editData, icon: e.target.value })}
                  placeholder="🎯"
                />
              </div>

              <div className="form-group">
                <label>Title</label>
                <input
                  type="text"
                  value={editData.title}
                  onChange={e => setEditData({ ...editData, title: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label>Description</label>
                <textarea
                  value={editData.description}
                  onChange={e => setEditData({ ...editData, description: e.target.value })}
                  rows={3}
                />
              </div>

              <div className="form-group">
                <label>Date</label>
                <input
                  type="date"
                  value={editData.date.split('T')[0]}
                  onChange={e => setEditData({ ...editData, date: e.target.value })}
                />
              </div>
            </div>

            <div className="modal-footer">
              <button onClick={handleCancel} className="btn btn-secondary">
                Cancel
              </button>
              <button onClick={handleSave} className="btn btn-primary">
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default MilestoneMarker
