/**
 * AI Assistant Service Tests
 */

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { aiAssistant } from '../ai-assistant'

// Mock OpenAI
vi.mock('openai', () => ({
  default: vi.fn(() => ({
    chat: {
      completions: {
        create: vi.fn(),
      },
    },
  })),
}))

describe('AIAssistantService', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    aiAssistant.conversationHistory = []
  })

  describe('Conversational AI', () => {
    it('should ask questions with context', async () => {
      const mockResponse = {
        choices: [{ message: { content: 'You should focus on the MVP features first.' } }],
      }

      vi.spyOn(aiAssistant.openai.chat.completions, 'create').mockResolvedValue(mockResponse)

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

      vi.spyOn(aiAssistant.openai.chat.completions, 'create').mockResolvedValue(mockResponse)

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

      vi.spyOn(aiAssistant.openai.chat.completions, 'create').mockResolvedValue(mockResponse)

      const result = await aiAssistant.prioritizeTasks(dreams)

      expect(result).toContain('Launch MVP')
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

      vi.spyOn(aiAssistant.openai.chat.completions, 'create').mockResolvedValue(mockResponse)

      const result = await aiAssistant.generateProgressSummary(dream, 'week')

      expect(result).toContain('This week')
    })
  })

  describe('Similar Projects', () => {
    it('should find similar projects', async () => {
      const currentDream = { title: 'E-commerce site', tags: ['web', 'react', 'shop'] }
      const allDreams = [
        { title: 'Blog platform', tags: ['web', 'react'] },
        { title: 'Mobile game', tags: ['mobile', 'unity'] },
        { title: 'Online store', tags: ['web', 'shop', 'vue'] },
      ]

      const mockResponse = {
        choices: [{ message: { content: 'Similar: Blog platform, Online store' } }],
      }

      vi.spyOn(aiAssistant.openai.chat.completions, 'create').mockResolvedValue(mockResponse)

      const result = await aiAssistant.findSimilarProjects(currentDream, allDreams)

      expect(result).toContain('Similar')
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

      vi.spyOn(aiAssistant.openai.chat.completions, 'create').mockResolvedValue(mockResponse)

      const result = await aiAssistant.breakdownTasks(dream)

      expect(result).toContain('Design mockup')
      expect(result).toContain('Deploy')
    })
  })

  describe('Risk Detection', () => {
    it('should detect scope creep', async () => {
      const dream = {
        title: 'Simple CRUD app',
        fragments: [
          { content: 'Adding real-time chat feature' },
          { content: 'Building AI recommendation engine' },
          { content: 'Implementing blockchain integration' },
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

      vi.spyOn(aiAssistant.openai.chat.completions, 'create').mockResolvedValue(mockResponse)

      const result = await aiAssistant.detectRisks(dream)

      expect(result).toContain('Scope creep')
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

      vi.spyOn(aiAssistant.openai.chat.completions, 'create').mockResolvedValue(mockResponse)

      const result = await aiAssistant.parseMeetingMinutes(content, 'dream-123')

      expect(result).toContain('John')
      expect(result).toContain('landing page')
    })
  })

  describe('Code Analysis', () => {
    it('should analyze code snippets for features', async () => {
      const fragments = [
        { content: '```javascript\nfunction authenticate(user) { ... }\n```' },
        { content: '```python\ndef send_email(to, subject): ...\n```' },
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

      vi.spyOn(aiAssistant.openai.chat.completions, 'create').mockResolvedValue(mockResponse)

      const result = await aiAssistant.analyzeCodeSnippets(fragments)

      expect(result).toContain('Authentication')
      expect(result).toContain('Email')
    })
  })

  describe('Error Handling', () => {
    it('should handle API errors gracefully', async () => {
      vi.spyOn(aiAssistant.openai.chat.completions, 'create').mockRejectedValue(
        new Error('API rate limit exceeded')
      )

      await expect(aiAssistant.ask('Test question')).rejects.toThrow('API rate limit exceeded')
    })

    it('should handle empty context', async () => {
      const mockResponse = {
        choices: [{ message: { content: 'Response without context' } }],
      }

      vi.spyOn(aiAssistant.openai.chat.completions, 'create').mockResolvedValue(mockResponse)

      const result = await aiAssistant.ask('Question', {})

      expect(result).toBeTruthy()
    })
  })
})
