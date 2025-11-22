import React, { useState } from 'react'
import { Save, X } from 'lucide-react'

/**
 * Form for creating or editing a dream
 * @param {Object} dream - Existing dream data (null for new dream)
 * @param {Function} onSave - Callback when form is submitted
 * @param {Function} onCancel - Callback when form is cancelled
 * @param {Array} statuses - Available status options
 */
const DreamForm = React.memo(function DreamForm({ dream, onSave, onCancel, statuses }) {
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
})

export default DreamForm
