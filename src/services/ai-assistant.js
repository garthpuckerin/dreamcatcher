/**
 * AI Assistant Service - Advanced AI Features
 *
 * Provides intelligent assistance for project management:
 * - What to work on next (prioritization)
 * - Progress summaries
 * - Similar project finding
 * - Automatic task breakdown
 * - Risk detection
 * - Meeting minutes analysis
 *
 * Uses GPT-4 for complex reasoning and embeddings for semantic search
 */

import { openai } from '../lib/ai'

class AIAssistantService {
  constructor() {
    this.conversationHistory = []
    // Expose openai instance for testing
    this.openai = openai
  }

  /**
   * Clear conversation history
   */
  clearHistory() {
    this.conversationHistory = []
  }

  /**
   * Ask the AI assistant a question about your projects
   * @param {string} question - User's question
   * @param {Object} context - Context about dreams, fragments, etc.
   * @returns {Promise<string>} AI response
   */
  async ask(question, context = {}) {
    if (!this.openai) {
      throw new Error('AI features are not enabled. Set VITE_OPENAI_API_KEY in .env')
    }

    const { dreams = [], currentDream = null, recentFragments = [] } = context

    const systemPrompt = `You are an intelligent project management assistant for Dreamcatcher,
a tool that helps users capture and organize project ideas from AI conversations.

Context about the user's projects:
${dreams.length > 0 ? `Active Dreams: ${JSON.stringify(dreams.map(d => ({ id: d.id, title: d.title, status: d.status, tags: d.tags })))}` : 'No active dreams yet.'}

${currentDream ? `Current Dream: ${JSON.stringify(currentDream)}` : ''}

${recentFragments.length > 0 ? `Recent Fragments: ${JSON.stringify(recentFragments.slice(0, 5))}` : ''}

Your role is to:
1. Help prioritize tasks
2. Identify patterns and insights
3. Suggest next steps
4. Detect risks or blockers
5. Find connections between projects

Be concise, actionable, and specific.`

    const messages = [
      { role: 'system', content: systemPrompt },
      ...this.conversationHistory,
      { role: 'user', content: question },
    ]

    try {
      const response = await this.openai.chat.completions.create({
        model: 'gpt-4',
        messages,
        temperature: 0.7,
        max_tokens: 500,
      })

      const answer = response.choices[0].message.content

      // Store in conversation history
      this.conversationHistory.push(
        { role: 'user', content: question },
        { role: 'assistant', content: answer }
      )

      // Keep only last 10 messages to manage token usage
      if (this.conversationHistory.length > 10) {
        this.conversationHistory = this.conversationHistory.slice(-10)
      }

      return answer
    } catch (error) {
      console.error('AI Assistant error:', error)
      throw error
    }
  }

  /**
   * Get prioritized task recommendations
   * @param {Array} dreams - User's dreams
   * @returns {Promise<Object>} Prioritization recommendations
   */
  async prioritizeTasks(dreams) {
    const activeDreams = dreams.filter(d => d.status !== 'completed' && d.status !== 'archived')

    if (activeDreams.length === 0) {
      return {
        recommendation: 'You have no active dreams. Create a new dream to get started!',
        tasks: [],
      }
    }

    const context = {
      dreams: activeDreams.map(d => ({
        id: d.id,
        title: d.title,
        status: d.status,
        todos: d.todos || [],
        fragments: (d.fragments || []).length,
        tags: d.tags,
        updated: d.updated_at,
      })),
    }

    const question = `Based on my active dreams, what should I work on next? Consider:
- Deadlines and urgency
- Dependencies between tasks
- Current momentum (recently updated)
- Strategic importance

Provide 3-5 specific task recommendations with reasoning.`

    const response = await this.ask(question, { dreams: activeDreams })

    return {
      recommendation: response,
      generatedAt: new Date().toISOString(),
    }
  }

  /**
   * Generate progress summary
   * @param {Object} dream - Dream to summarize
   * @param {string} period - Time period ('week', 'month', 'all')
   * @returns {Promise<string>} Progress summary
   */
  async generateProgressSummary(dream, period = 'week') {
    const periodMap = {
      week: 7,
      month: 30,
      all: 365 * 10,
    }

    const days = periodMap[period] || 7
    const cutoffDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000)

    const recentFragments = (dream.fragments || []).filter(
      f => new Date(f.date || f.created_at) > cutoffDate
    )

    const recentTodos = (dream.todos || []).filter(
      t => t.completed && new Date(t.completed_at) > cutoffDate
    )

    const prompt = `Summarize progress on "${dream.title}" over the past ${period}:

Fragments added: ${recentFragments.length}
${recentFragments.length > 0 ? `Recent fragments:\n${recentFragments.map(f => `- ${f.title}`).join('\n')}` : ''}

Todos completed: ${recentTodos.length}
${recentTodos.length > 0 ? `Completed:\n${recentTodos.map(t => `- ${t.title}`).join('\n')}` : ''}

Current status: ${dream.status}

Provide a concise 2-3 sentence summary of progress, highlighting key achievements and momentum.`

    return this.ask(prompt, { currentDream: dream, recentFragments })
  }

  /**
   * Find similar past projects
   * @param {Object} dream - Current dream
   * @param {Array} allDreams - All user's dreams
   * @returns {Promise<Array>} Similar dreams with reasoning
   */
  async findSimilarProjects(dream, allDreams) {
    const otherDreams = allDreams.filter(d => d.id !== dream.id)

    if (otherDreams.length === 0) {
      return []
    }

    const prompt = `Find projects similar to "${dream.title}":
Description: ${dream.description}
Tags: ${dream.tags.join(', ')}

Other projects:
${otherDreams.map((d, i) => `${i + 1}. ${d.title} (${d.status}) - ${d.description || 'No description'} [Tags: ${d.tags.join(', ')}]`).join('\n')}

Identify the 3 most similar projects and explain why they're similar. Include project number, title, and 1-sentence reasoning.`

    const response = await this.ask(prompt, { dreams: otherDreams, currentDream: dream })

    // Parse response to extract similar projects
    // This is a simplified version - production would use structured output
    return {
      similar: response,
      timestamp: new Date().toISOString(),
    }
  }

  /**
   * Break down dream into actionable tasks
   * @param {Object} dream - Dream to break down
   * @returns {Promise<Array>} Suggested tasks
   */
  async breakdownTasks(dream) {
    const prompt = `Break down this dream into concrete, actionable tasks:

Title: ${dream.title}
Description: ${dream.description}
Current Status: ${dream.status}
Existing Todos: ${(dream.todos || []).length}

Create 5-10 specific tasks following this format:
- Task title (category: coding/design/marketing/admin, estimated time)

Make tasks SMART (Specific, Measurable, Achievable, Relevant, Time-bound).`

    const response = await this.ask(prompt, { currentDream: dream })

    return {
      tasks: response,
      generatedAt: new Date().toISOString(),
      source: 'ai-breakdown',
    }
  }

  /**
   * Detect risks or concerns from fragments
   * @param {Object} dream - Dream to analyze
   * @returns {Promise<Object>} Risk analysis
   */
  async detectRisks(dream) {
    if (!dream.fragments || dream.fragments.length === 0) {
      return {
        risks: [],
        severity: 'none',
      }
    }

    const recentFragments = dream.fragments.slice(-10)

    const prompt = `Analyze these conversation fragments for potential risks or concerns:

${recentFragments.map((f, i) => `Fragment ${i + 1}: ${f.title}\n${f.content.substring(0, 200)}...`).join('\n\n')}

Identify:
1. Scope creep indicators
2. Technical blockers mentioned
3. Resource constraints
4. Timeline concerns
5. Unclear requirements

List any risks found with severity (low/medium/high) and mitigation suggestions.`

    const response = await this.ask(prompt, { currentDream: dream, recentFragments })

    return {
      analysis: response,
      fragmentsAnalyzed: recentFragments.length,
      timestamp: new Date().toISOString(),
    }
  }

  /**
   * Parse meeting minutes or notes
   * @param {string} content - Meeting notes or transcript
   * @param {string} dreamId - Associated dream ID
   * @returns {Promise<Object>} Extracted action items, decisions, participants
   */
  async parseMeetingMinutes(content, dreamId = null) {
    if (!this.openai) {
      throw new Error('AI features are not enabled. Set VITE_OPENAI_API_KEY in .env')
    }

    const prompt = `Parse these meeting notes and extract:

1. Action items (who, what, when)
2. Key decisions made
3. Topics discussed
4. Participants (if mentioned)
5. Follow-up needed

Meeting content:
${content}

Format as structured data.`

    const response = await this.openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content:
            'You are a meeting notes parser. Extract structured information from meeting transcripts.',
        },
        { role: 'user', content: prompt },
      ],
      temperature: 0.3,
      max_tokens: 800,
    })

    const parsed = response.choices[0].message.content

    return {
      parsed,
      dreamId,
      timestamp: new Date().toISOString(),
      source: 'meeting-minutes',
    }
  }

  /**
   * Analyze code snippets mentioned in fragments
   * @param {Array} fragments - Fragments containing code
   * @returns {Promise<Object>} Code analysis
   */
  async analyzeCodeSnippets(fragments) {
    const fragmentsWithCode = fragments.filter(f => f.code_snippets && f.code_snippets.length > 0)

    if (fragmentsWithCode.length === 0) {
      return {
        features: [],
        technologies: [],
        patterns: [],
      }
    }

    const codeExamples = fragmentsWithCode.flatMap(f => f.code_snippets).slice(0, 5)

    const prompt = `Analyze these code snippets and identify:

1. Features being implemented
2. Technologies/frameworks used
3. Design patterns
4. Potential improvements

Code snippets:
${codeExamples.map((code, i) => `\`\`\`\n${code}\n\`\`\``).join('\n\n')}

Provide concise analysis.`

    const response = await this.ask(prompt, { recentFragments: fragmentsWithCode })

    return {
      analysis: response,
      snippetsAnalyzed: codeExamples.length,
      timestamp: new Date().toISOString(),
    }
  }

  /**
   * Clear conversation history
   */
  reset() {
    this.conversationHistory = []
  }
}

// Singleton instance
export const aiAssistant = new AIAssistantService()

export default aiAssistant
