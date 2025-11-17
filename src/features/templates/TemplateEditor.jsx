/**
 * Template Editor Component
 *
 * Create and edit custom templates
 * Users can monetize their templates on the marketplace
 */

import React, { useState } from 'react';

const TemplateEditor = ({ onClose, onSave, initialTemplate = null }) => {
  const [template, setTemplate] = useState(initialTemplate || {
    name: '',
    description: '',
    category: 'project',
    price: 0,
    dream: {
      title: '',
      description: '',
      tags: []
    },
    todos: []
  });

  const [newTag, setNewTag] = useState('');
  const [newTodo, setNewTodo] = useState({
    title: '',
    category: 'admin',
    notes: ''
  });

  const categories = ['product', 'project', 'personal', 'business', 'learning'];
  const todoCategories = ['admin', 'planning', 'coding', 'marketing', 'research'];

  /**
   * Add tag
   */
  const addTag = () => {
    if (newTag.trim() && !template.dream.tags.includes(newTag.trim())) {
      setTemplate({
        ...template,
        dream: {
          ...template.dream,
          tags: [...template.dream.tags, newTag.trim()]
        }
      });
      setNewTag('');
    }
  };

  /**
   * Remove tag
   */
  const removeTag = (tag) => {
    setTemplate({
      ...template,
      dream: {
        ...template.dream,
        tags: template.dream.tags.filter(t => t !== tag)
      }
    });
  };

  /**
   * Add todo
   */
  const addTodo = () => {
    if (newTodo.title.trim()) {
      setTemplate({
        ...template,
        todos: [...template.todos, { ...newTodo }]
      });
      setNewTodo({ title: '', category: 'admin', notes: '' });
    }
  };

  /**
   * Remove todo
   */
  const removeTodo = (index) => {
    setTemplate({
      ...template,
      todos: template.todos.filter((_, i) => i !== index)
    });
  };

  /**
   * Save template
   */
  const handleSave = () => {
    if (!template.name || !template.description || !template.dream.title) {
      alert('Please fill in all required fields');
      return;
    }

    if (template.todos.length === 0) {
      alert('Please add at least one task to the template');
      return;
    }

    onSave(template);
  };

  return (
    <div className="template-editor-modal" onClick={onClose}>
      <div className="editor-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <h2>✨ Create Template</h2>
            <p>Build a reusable template for the marketplace</p>
          </div>
          <button onClick={onClose} className="close-btn">×</button>
        </div>

        <div className="editor-body">
          {/* Template Info */}
          <section className="editor-section">
            <h3>📋 Template Info</h3>

            <div className="form-group">
              <label>Template Name *</label>
              <input
                type="text"
                value={template.name}
                onChange={(e) => setTemplate({ ...template, name: e.target.value })}
                placeholder="e.g., MVP Launch Checklist"
              />
            </div>

            <div className="form-group">
              <label>Description *</label>
              <textarea
                value={template.description}
                onChange={(e) => setTemplate({ ...template, description: e.target.value })}
                placeholder="Describe what this template helps with..."
                rows={3}
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Category *</label>
                <select
                  value={template.category}
                  onChange={(e) => setTemplate({ ...template, category: e.target.value })}
                >
                  {categories.map(cat => (
                    <option key={cat} value={cat}>
                      {cat.charAt(0).toUpperCase() + cat.slice(1)}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Price (USD)</label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={template.price}
                  onChange={(e) => setTemplate({ ...template, price: parseFloat(e.target.value) || 0 })}
                  placeholder="0"
                />
                <small>Leave at $0 for free template</small>
              </div>
            </div>
          </section>

          {/* Dream Template */}
          <section className="editor-section">
            <h3>💭 Dream Template</h3>

            <div className="form-group">
              <label>Dream Title *</label>
              <input
                type="text"
                value={template.dream.title}
                onChange={(e) => setTemplate({
                  ...template,
                  dream: { ...template.dream, title: e.target.value }
                })}
                placeholder="e.g., Launch my product"
              />
            </div>

            <div className="form-group">
              <label>Dream Description</label>
              <textarea
                value={template.dream.description}
                onChange={(e) => setTemplate({
                  ...template,
                  dream: { ...template.dream, description: e.target.value }
                })}
                placeholder="Default description for the dream..."
                rows={2}
              />
            </div>

            <div className="form-group">
              <label>Tags</label>
              <div className="tags-input-container">
                <div className="tags-display">
                  {template.dream.tags.map(tag => (
                    <span key={tag} className="tag-chip">
                      {tag}
                      <button onClick={() => removeTag(tag)}>×</button>
                    </span>
                  ))}
                </div>
                <div className="tag-input-row">
                  <input
                    type="text"
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                    placeholder="Add tag..."
                  />
                  <button onClick={addTag} className="btn btn-sm">+ Add</button>
                </div>
              </div>
            </div>
          </section>

          {/* Tasks */}
          <section className="editor-section">
            <h3>✅ Tasks ({template.todos.length})</h3>

            {/* Existing Todos */}
            {template.todos.length > 0 && (
              <div className="todos-list-editor">
                {template.todos.map((todo, index) => (
                  <div key={index} className="todo-edit-item">
                    <div className="todo-number">{index + 1}</div>
                    <div className="todo-details">
                      <div className="todo-title">{todo.title}</div>
                      <div className="todo-meta">
                        <span className="todo-cat-badge">{todo.category}</span>
                        {todo.notes && <span className="todo-note">{todo.notes}</span>}
                      </div>
                    </div>
                    <button
                      onClick={() => removeTodo(index)}
                      className="btn-icon btn-danger"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Add New Todo */}
            <div className="add-todo-form">
              <div className="form-group">
                <input
                  type="text"
                  value={newTodo.title}
                  onChange={(e) => setNewTodo({ ...newTodo, title: e.target.value })}
                  placeholder="Task title..."
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <select
                    value={newTodo.category}
                    onChange={(e) => setNewTodo({ ...newTodo, category: e.target.value })}
                  >
                    {todoCategories.map(cat => (
                      <option key={cat} value={cat}>
                        {cat.charAt(0).toUpperCase() + cat.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group" style={{ flex: 2 }}>
                  <input
                    type="text"
                    value={newTodo.notes}
                    onChange={(e) => setNewTodo({ ...newTodo, notes: e.target.value })}
                    placeholder="Optional notes..."
                  />
                </div>
              </div>

              <button onClick={addTodo} className="btn btn-secondary" style={{ width: '100%' }}>
                + Add Task
              </button>
            </div>
          </section>

          {/* Monetization Info */}
          {template.price > 0 && (
            <section className="editor-section monetization-info">
              <h4>💰 Monetization</h4>
              <p>Template price: <strong>${template.price}</strong></p>
              <p>Your earnings (70%): <strong>${(template.price * 0.7).toFixed(2)}</strong> per sale</p>
              <p className="marketplace-fee">Marketplace fee: 30%</p>
            </section>
          )}
        </div>

        <div className="modal-footer">
          <button onClick={onClose} className="btn btn-secondary">
            Cancel
          </button>
          <button onClick={handleSave} className="btn btn-primary">
            💾 Save Template
          </button>
        </div>
      </div>
    </div>
  );
};

export default TemplateEditor;
