/**
 * AI Assistant Service Tests
 */

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { aiAssistant } from '../ai-assistant'

// Create mock OpenAI instance
const mockCreate = vi.fn()
const mockOpenAI = {
  chat: {
    completions: {
      create: mockCreate,
    },
  },
}

describe('AIAssistantService', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    aiAssistant.conversationHistory = []
    // Inject mock openai for testing
    aiAssistant.openai = mockOpenAI
  })

  describe('Conversational AI', () => {
    it('should ask questions with context', async () => {
      const mockResponse = {
        choices: [{ message: { content: 'You should focus on the MVP features first.' } }],
      }

      mockCreate.mockResolvedValue(mockResponse)

      const result = await aiAssistant.ask('What should I work on next?', {
        dreams: [{ title: 'Build MVP', status: 'in-progress' }],
      })

      expect(result).toBe('You should focus on the MVP features first.')
      expect(aiAssistant.conversationHistory).toHaveLength(2) // User + assistant
    })

    it('should maintain conversation history', async () => {
      const mockResponse = {
        choices: [{ message: { content: 'Response' } }],
      }

      mockCreate.mockResolvedValue(mockResponse)

      await aiAssistant.ask('First question')
      await aiAssistant.ask('Follow up')

      expect(aiAssistant.conversationHistory.length).toBeGreaterThan(2)
    })

    it('should clear conversation history', () => {
      aiAssistant.conversationHistory = [
        { role: 'user', content: 'Test' },
        { role: 'assistant', content: 'Response' },
      ]

      aiAssistant.clearHistory()

      expect(aiAssistant.conversationHistory).toHaveLength(0)
    })
  })

  describe('Task Prioritization', () => {
    it('should prioritize tasks based on urgency', async () => {
      const dreams = [
        { title: 'Launch MVP', deadline: new Date(Date.now() + 86400000), status: 'in-progress' },
        { title: 'Research', deadline: new Date(Date.now() + 604800000), status: 'idea' },
      ]

      const mockResponse = {
        choices: [{ message: { content: 'Focus on Launch MVP - it has an upcoming deadline.' } }],
      }

      mockCreate.mockResolvedValue(mockResponse)

      const result = await aiAssistant.prioritizeTasks(dreams)

      expect(result.recommendation).toContain('Launch MVP')
    })
  })

  describe('Progress Summarization', () => {
    it('should generate weekly progress summary', async () => {
      const dream = {
        title: 'Build App',
        fragments: [
          { title: 'Designed UI', created_at: new Date(Date.now() - 86400000) },
          { title: 'Implemented auth', created_at: new Date() },
        ],
      }

      const mockResponse = {
        choices: [
          { message: { content: 'This week: Designed UI and implemented authentication.' } },
        ],
      }

      mockCreate.mockResolvedValue(mockResponse)

      const result = await aiAssistant.generateProgressSummary(dream, 'week')

      expect(result).toContain('This week')
    })
  })

  describe('Similar Projects', () => {
    it('should find similar projects', async () => {
      const currentDream = { id: 'dream-1', title: 'E-commerce site', tags: ['web', 'react', 'shop'] }
      const allDreams = [
        { id: 'dream-2', title: 'Blog platform', tags: ['web', 'react'] },
        { id: 'dream-3', title: 'Mobile game', tags: ['mobile', 'unity'] },
        { id: 'dream-4', title: 'Online store', tags: ['web', 'shop', 'vue'] },
      ]

      const mockResponse = {
        choices: [{ message: { content: 'Similar: Blog platform, Online store' } }],
      }

      mockCreate.mockResolvedValue(mockResponse)

      const result = await aiAssistant.findSimilarProjects(currentDream, allDreams)

      expect(result.similar).toContain('Similar')
    })
  })

  describe('Task Breakdown', () => {
    it('should break down dream into tasks', async () => {
      const dream = {
        title: 'Build Landing Page',
        description: 'Create a marketing landing page',
      }

      const mockResponse = {
        choices: [
          {
            message: {
              content: '1. Design mockup\n2. Implement HTML/CSS\n3. Add contact form\n4. Deploy',
            },
          },
        ],
      }

      mockCreate.mockResolvedValue(mockResponse)

      const result = await aiAssistant.breakdownTasks(dream)

      expect(result.tasks).toContain('Design mockup')
      expect(result.tasks).toContain('Deploy')
    })
  })

  describe('Risk Detection', () => {
    it('should detect scope creep', async () => {
      const dream = {
        title: 'Simple CRUD app',
        fragments: [
          { title: 'Chat feature', content: 'Adding real-time chat feature' },
          { title: 'AI engine', content: 'Building AI recommendation engine' },
          { title: 'Blockchain', content: 'Implementing blockchain integration' },
        ],
      }

      const mockResponse = {
        choices: [
          {
            message: {
              content:
                'WARNING: Scope creep detected. Original goal was simple CRUD, but adding complex features.',
            },
          },
        ],
      }

      mockCreate.mockResolvedValue(mockResponse)

      const result = await aiAssistant.detectRisks(dream)

      expect(result.analysis).toContain('Scope creep')
    })
  })

  describe('Meeting Minutes Parsing', () => {
    it('should extract action items from meeting notes', async () => {
      const content = `
        Meeting with team about product launch.
        - John will design the landing page
        - Sarah needs to set up analytics
        - Mike to prepare demo for Friday
      `

      const mockResponse = {
        choices: [
          {
            message: {
              content: JSON.stringify([
                { assignee: 'John', task: 'Design landing page' },
                { assignee: 'Sarah', task: 'Set up analytics' },
                { assignee: 'Mike', task: 'Prepare demo for Friday' },
              ]),
            },
          },
        ],
      }

      mockCreate.mockResolvedValue(mockResponse)

      const result = await aiAssistant.parseMeetingMinutes(content, 'dream-123')

      expect(result.parsed).toContain('John')
      expect(result.parsed).toContain('landing page')
    })
  })

  describe('Code Analysis', () => {
    it('should analyze code snippets for features', async () => {
      const fragments = [
        { code_snippets: ['function authenticate(user) { ... }'] },
        { code_snippets: ['def send_email(to, subject): ...'] },
      ]

      const mockResponse = {
        choices: [
          {
            message: {
              content:
                'Features detected: Authentication system (JavaScript), Email functionality (Python)',
            },
          },
        ],
      }

      mockCreate.mockResolvedValue(mockResponse)

      const result = await aiAssistant.analyzeCodeSnippets(fragments)

      expect(result.analysis).toContain('Authentication')
      expect(result.analysis).toContain('Email')
    })
  })

  describe('Error Handling', () => {
    it('should handle API errors gracefully', async () => {
      mockCreate.mockRejectedValue(new Error('API rate limit exceeded'))

      await expect(aiAssistant.ask('Test question')).rejects.toThrow('API rate limit exceeded')
    })

    it('should handle empty context', async () => {
      const mockResponse = {
        choices: [{ message: { content: 'Response without context' } }],
      }

      mockCreate.mockResolvedValue(mockResponse)

      const result = await aiAssistant.ask('Question', {})

      expect(result).toBeTruthy()
    })
  })
})
