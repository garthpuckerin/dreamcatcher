/**
 * Case Study Generator Component
 *
 * Auto-generate professional case studies from dreams
 * Uses AI to analyze dream journey and create narrative
 */

import React, { useState, useEffect } from 'react'
import { aiAssistant } from '../../services/ai-assistant'

const CASE_STUDY_TEMPLATE = {
  overview: {
    title: 'Overview',
    prompt: 'Provide a brief overview of this project',
    icon: '📋',
  },
  problem: {
    title: 'Problem Statement',
    prompt: 'What problem were you solving?',
    icon: '❓',
  },
  solution: {
    title: 'Solution',
    prompt: 'How did you solve it?',
    icon: '💡',
  },
  process: {
    title: 'Process & Timeline',
    prompt: 'Describe the development process',
    icon: '⚙️',
  },
  challenges: {
    title: 'Challenges',
    prompt: 'What challenges did you face?',
    icon: '🚧',
  },
  results: {
    title: 'Results & Impact',
    prompt: 'What were the outcomes?',
    icon: '🎯',
  },
  learnings: {
    title: 'Key Learnings',
    prompt: 'What did you learn?',
    icon: '📚',
  },
}

const CaseStudyGenerator = ({ dream, onClose, onSave }) => {
  const [caseStudy, setCaseStudy] = useState({})
  const [isGenerating, setIsGenerating] = useState(false)
  const [generationProgress, setGenerationProgress] = useState(0)
  const [currentSection, setCurrentSection] = useState(null)

  useEffect(() => {
    // Initialize with empty sections
    const initial = {}
    Object.keys(CASE_STUDY_TEMPLATE).forEach(key => {
      initial[key] = ''
    })
    setCaseStudy(initial)
  }, [])

  /**
   * Generate case study with AI
   */
  const handleGenerateAI = async () => {
    setIsGenerating(true)
    setGenerationProgress(0)

    const sections = Object.keys(CASE_STUDY_TEMPLATE)
    const generated = {}

    try {
      for (let i = 0; i < sections.length; i++) {
        const sectionKey = sections[i]
        const section = CASE_STUDY_TEMPLATE[sectionKey]

        setCurrentSection(section.title)
        setGenerationProgress(((i + 1) / sections.length) * 100)

        // Generate content for this section
        const content = await generateSection(sectionKey, section)
        generated[sectionKey] = content

        // Update state incrementally
        setCaseStudy({ ...generated })
      }

      setCurrentSection(null)
    } catch (error) {
      console.error('Failed to generate case study:', error)
      alert('Failed to generate case study. Please try again.')
    } finally {
      setIsGenerating(false)
      setGenerationProgress(0)
    }
  }

  /**
   * Generate content for a specific section
   */
  const generateSection = async (sectionKey, section) => {
    const context = buildContext()

    let prompt = ''

    switch (sectionKey) {
      case 'overview':
        prompt = `Based on the dream "${dream.title}", write a compelling 2-3 sentence overview for a portfolio case study. Focus on what was built and why it matters.

Context:
- Description: ${dream.description}
- Status: ${dream.status}
- Tags: ${dream.tags?.join(', ')}
- Fragments: ${context.fragmentCount}
- Duration: ${context.duration} days`
        break

      case 'problem':
        prompt = `Analyze the dream and fragments to identify the core problem being solved. Write 2-3 paragraphs explaining:
1. The problem/opportunity identified
2. Who it affects
3. Why it needed solving

Dream: "${dream.title}"
Description: ${dream.description}

Recent fragments:
${context.recentFragments
  .slice(0, 5)
  .map(f => `- ${f.title}: ${f.content.substring(0, 200)}`)
  .join('\n')}`
        break

      case 'solution':
        prompt = `Describe the solution that was built for "${dream.title}". Write 2-3 paragraphs covering:
1. What was built (features, architecture)
2. Key technologies/approaches used
3. What makes it unique

Context from fragments:
${context.recentFragments
  .slice(0, 5)
  .map(f => `- ${f.content.substring(0, 200)}`)
  .join('\n')}`
        break

      case 'process':
        prompt = `Create a timeline narrative of how "${dream.title}" was developed. Include:
1. Initial ideation and planning
2. Key development phases
3. Major milestones
4. Timeline (started ${new Date(dream.created_at).toLocaleDateString()}, took ${context.duration} days)

Use these fragments as reference:
${context.recentFragments.map(f => `${new Date(f.created_at).toLocaleDateString()}: ${f.title}`).join('\n')}`
        break

      case 'challenges':
        prompt = `Based on the fragments and conversation history, identify 3-5 key challenges faced during "${dream.title}" and how they were overcome.

Look for challenges in these fragments:
${context.recentFragments
  .slice(0, 10)
  .map(f => f.content.substring(0, 300))
  .join('\n\n')}`
        break

      case 'results':
        prompt = `Summarize the results and impact of "${dream.title}". Include:
1. What was accomplished
2. Metrics/outcomes (if available)
3. Impact on users/business
4. Current status

Status: ${dream.status}
Completion: ${context.todoCompletion}% of tasks completed
${dream.status === 'launched' ? 'Successfully launched!' : ''}`
        break

      case 'learnings':
        prompt = `Extract 3-5 key learnings from the "${dream.title}" journey. Focus on:
1. Technical learnings
2. Process improvements
3. Personal growth
4. Insights gained

Analyze these fragments for learnings:
${context.recentFragments
  .slice(0, 10)
  .map(f => f.content.substring(0, 300))
  .join('\n\n')}`
        break

      default:
        prompt = `${section.prompt} for the dream "${dream.title}". Write 2-3 paragraphs.`
    }

    const response = await aiAssistant.ask(prompt, {
      dreams: [dream],
      currentDream: dream,
      recentFragments: dream.fragments,
    })

    return response
  }

  /**
   * Build context from dream data
   */
  const buildContext = () => {
    const fragments = dream.fragments || []
    const todos = dream.todos || []

    const duration = dream.created_at
      ? Math.floor((Date.now() - new Date(dream.created_at)) / (1000 * 60 * 60 * 24))
      : 0

    const todoCompletion =
      todos.length > 0
        ? Math.round((todos.filter(t => t.completed).length / todos.length) * 100)
        : 0

    return {
      fragmentCount: fragments.length,
      recentFragments: fragments.slice(-20), // Last 20 fragments
      duration,
      todoCompletion,
      tags: dream.tags || [],
    }
  }

  /**
   * Handle manual edit
   */
  const handleEdit = (sectionKey, content) => {
    setCaseStudy({
      ...caseStudy,
      [sectionKey]: content,
    })
  }

  /**
   * Save case study
   */
  const handleSave = () => {
    onSave({
      ...caseStudy,
      generatedAt: new Date().toISOString(),
      dreamId: dream.id,
    })
  }

  return (
    <div className="case-study-modal" onClick={onClose}>
      <div className="case-study-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <h2>📝 Case Study: {dream.title}</h2>
            <p>AI-powered case study generation</p>
          </div>
          <button onClick={onClose} className="close-btn">
            ×
          </button>
        </div>

        <div className="modal-body">
          {/* Generate Button */}
          <div className="generate-section">
            <button
              onClick={handleGenerateAI}
              disabled={isGenerating}
              className="btn btn-primary btn-large"
            >
              {isGenerating ? '⏳ Generating...' : '🤖 Generate with AI'}
            </button>

            {isGenerating && (
              <div className="generation-progress">
                <div className="progress-bar">
                  <div className="progress-fill" style={{ width: `${generationProgress}%` }} />
                </div>
                <p>Generating: {currentSection}...</p>
              </div>
            )}
          </div>

          {/* Case Study Sections */}
          <div className="case-study-sections">
            {Object.entries(CASE_STUDY_TEMPLATE).map(([key, section]) => (
              <div key={key} className="case-section">
                <div className="section-header">
                  <span className="section-icon">{section.icon}</span>
                  <h3>{section.title}</h3>
                </div>

                <textarea
                  value={caseStudy[key] || ''}
                  onChange={e => handleEdit(key, e.target.value)}
                  placeholder={`${section.prompt}...`}
                  rows={6}
                  className="case-textarea"
                />
              </div>
            ))}
          </div>
        </div>

        <div className="modal-footer">
          <button onClick={onClose} className="btn btn-secondary">
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="btn btn-primary"
            disabled={!Object.values(caseStudy).some(v => v)}
          >
            💾 Save Case Study
          </button>
        </div>
      </div>
    </div>
  )
}

export default CaseStudyGenerator
