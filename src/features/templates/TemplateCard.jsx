/**
 * Template Card Component
 *
 * Individual template card for the marketplace
 */

import React from 'react';

const TemplateCard = ({ template, onApply, onPreview }) => {
  const { name, description, category, author, price, rating, uses, dream, todos } = template;

  return (
    <div className="template-card">
      <div className="template-card-header">
        <div className="template-category">{category}</div>
        {price > 0 && (
          <div className="template-price">${price}</div>
        )}
        {price === 0 && (
          <div className="template-badge">Free</div>
        )}
      </div>

      <div className="template-card-body">
        <h3 className="template-name">{name}</h3>
        <p className="template-description">{description}</p>

        <div className="template-stats">
          <div className="stat">
            <span className="stat-icon">⭐</span>
            <span>{rating}</span>
          </div>
          <div className="stat">
            <span className="stat-icon">👥</span>
            <span>{uses.toLocaleString()}</span>
          </div>
          <div className="stat">
            <span className="stat-icon">✅</span>
            <span>{todos.length} tasks</span>
          </div>
        </div>

        <div className="template-preview-tags">
          {dream.tags.slice(0, 3).map(tag => (
            <span key={tag} className="preview-tag">{tag}</span>
          ))}
        </div>

        <div className="template-author">
          By {author}
        </div>
      </div>

      <div className="template-card-footer">
        <button
          onClick={() => onPreview(template)}
          className="btn btn-secondary btn-sm"
        >
          👁️ Preview
        </button>
        <button
          onClick={() => onApply(template)}
          className="btn btn-primary btn-sm"
        >
          {price > 0 ? `Buy $${price}` : 'Use Template'}
        </button>
      </div>
    </div>
  );
};

export default TemplateCard;
