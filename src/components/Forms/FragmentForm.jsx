import React, { useState } from 'react';
import { Save, X } from 'lucide-react';

/**
 * Form for creating a new fragment
 * @param {Function} onSave - Callback when form is submitted
 * @param {Function} onCancel - Callback when form is cancelled
 */
const FragmentForm = React.memo(function FragmentForm({ onSave, onCancel }) {
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
});

export default FragmentForm;
