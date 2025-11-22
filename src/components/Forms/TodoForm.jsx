import React, { useState } from 'react'
import { Save } from 'lucide-react'

/**
 * Form for creating or editing a todo task
 * @param {Object} todo - Existing todo data (null for new todo)
 * @param {Function} onSave - Callback when form is submitted
 * @param {Function} onCancel - Callback when form is cancelled
 * @param {Array} taskCategories - Available task category options
 */
const TodoForm = React.memo(function TodoForm({ todo, onSave, onCancel, taskCategories }) {
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
          htmlFor="todo-deadline"
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
          id="todo-deadline"
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
})

export default TodoForm
