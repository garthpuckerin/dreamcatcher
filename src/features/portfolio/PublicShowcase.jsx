/**
 * Public Showcase Component
 *
 * Public-facing portfolio page
 * Optimized for SEO and sharing
 */

import React from 'react';

const PublicShowcase = ({ portfolio, isPreview = false }) => {
  const { title, bio, dreams, theme, skills } = portfolio;

  // Theme colors
  const themeColors = {
    minimal: { primary: '#1a202c', secondary: '#718096', accent: '#667eea', bg: '#ffffff' },
    vibrant: { primary: '#9333ea', secondary: '#ec4899', accent: '#f59e0b', bg: '#faf5ff' },
    professional: { primary: '#1e40af', secondary: '#64748b', accent: '#0891b2', bg: '#f8fafc' },
    dark: { primary: '#f9fafb', secondary: '#9ca3af', accent: '#8b5cf6', bg: '#1a202c' }
  };

  const colors = themeColors[theme] || themeColors.minimal;
  const isDark = theme === 'dark';

  return (
    <div
      className="public-showcase"
      style={{
        '--color-primary': colors.primary,
        '--color-secondary': colors.secondary,
        '--color-accent': colors.accent,
        '--color-bg': colors.bg,
        backgroundColor: colors.bg,
        color: colors.primary
      }}
    >
      {isPreview && (
        <div className="preview-banner">
          👁️ Preview Mode - This is how your portfolio will look to visitors
        </div>
      )}

      {/* Hero Section */}
      <header className="showcase-hero">
        <div className="hero-content">
          <h1 className="hero-title">{title}</h1>
          {bio && <p className="hero-bio">{bio}</p>}

          {skills && skills.length > 0 && (
            <div className="hero-skills">
              {skills.map(skill => (
                <span key={skill} className="skill-tag">
                  {skill}
                </span>
              ))}
            </div>
          )}
        </div>
      </header>

      {/* Projects Grid */}
      <section className="showcase-projects">
        <div className="section-container">
          <h2 className="section-title">Featured Projects</h2>

          <div className="projects-grid">
            {dreams.map((dream, index) => (
              <article key={dream.id} className="project-card">
                {/* Project Image/Icon */}
                <div
                  className="project-image"
                  style={{
                    background: `linear-gradient(135deg, ${colors.accent} 0%, ${colors.primary} 100%)`
                  }}
                >
                  <span className="project-number">#{index + 1}</span>
                </div>

                {/* Project Content */}
                <div className="project-content">
                  <h3 className="project-title">{dream.title}</h3>
                  <p className="project-description">
                    {dream.description || 'A project I built'}
                  </p>

                  {dream.tags && (
                    <div className="project-tags">
                      {dream.tags.slice(0, 4).map(tag => (
                        <span key={tag} className="tag">
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Case Study Preview */}
                  {dream.caseStudy && (
                    <div className="case-study-preview">
                      <h4>📋 Overview</h4>
                      <p>{dream.caseStudy.overview?.substring(0, 200)}...</p>
                      <button className="read-more-btn">
                        Read Case Study →
                      </button>
                    </div>
                  )}

                  {/* Project Meta */}
                  <div className="project-meta">
                    <span>
                      {dream.fragments?.length || 0} fragments
                    </span>
                    <span>·</span>
                    <span>
                      {dream.todos?.filter(t => t.completed).length || 0} tasks completed
                    </span>
                    <span>·</span>
                    <span className="project-status">
                      {dream.status === 'launched' ? '🚀 Launched' : '✅ Completed'}
                    </span>
                  </div>
                </div>
              </article>
            ))}
          </div>

          {dreams.length === 0 && (
            <div className="empty-state">
              <p>No projects to showcase yet.</p>
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="showcase-footer">
        <p>
          Built with{' '}
          <a href="https://dreamcatcher.app" target="_blank" rel="noopener noreferrer">
            Dreamcatcher
          </a>
        </p>
      </footer>
    </div>
  );
};

export default PublicShowcase;
