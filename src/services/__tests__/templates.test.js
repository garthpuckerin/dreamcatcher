/**
 * Templates Service Tests
 */

import { describe, it, expect, beforeEach } from 'vitest'
import { templateService } from '../templates'

describe('TemplateService', () => {
  beforeEach(() => {
    templateService.templates = []
    templateService.loadBuiltInTemplates()
  })

  describe('Built-in Templates', () => {
    it('should load built-in templates', () => {
      const templates = templateService.getTemplates()

      expect(templates.length).toBeGreaterThan(0)
      expect(templates.some(t => t.id === 'mvp-launch')).toBe(true)
      expect(templates.some(t => t.id === 'side-project-starter')).toBe(true)
    })

    it('should have complete template structure', () => {
      const templates = templateService.getTemplates()
      const mvp = templates.find(t => t.id === 'mvp-launch')

      expect(mvp).toBeDefined()
      expect(mvp.name).toBeTruthy()
      expect(mvp.description).toBeTruthy()
      expect(mvp.category).toBeTruthy()
      expect(mvp.dream).toBeDefined()
      expect(mvp.todos).toBeDefined()
      expect(Array.isArray(mvp.todos)).toBe(true)
    })
  })

  describe('Template Application', () => {
    it('should apply template and create new dream', () => {
      const result = templateService.applyTemplate('mvp-launch')

      expect(result).toBeDefined()
      expect(result.dream).toBeDefined()
      expect(result.todos).toBeDefined()
      expect(result.dream.id).toContain('dream-')
      expect(result.dream.title).toBeTruthy()
    })

    it('should generate unique IDs for todos', () => {
      const result = templateService.applyTemplate('mvp-launch')

      const ids = result.todos.map(t => t.id)
      const uniqueIds = new Set(ids)

      expect(ids.length).toBe(uniqueIds.size) // All unique
    })

    it('should preserve template structure', () => {
      const templates = templateService.getTemplates()
      const original = templates.find(t => t.id === 'mvp-launch')
      const result = templateService.applyTemplate('mvp-launch')

      expect(result.dream.title).toBe(original.dream.title)
      expect(result.dream.tags).toEqual(original.dream.tags)
      expect(result.todos.length).toBe(original.todos.length)
    })

    it('should throw error for non-existent template', () => {
      expect(() => {
        templateService.applyTemplate('non-existent-template')
      }).toThrow()
    })
  })

  describe('Custom Template Creation', () => {
    it('should create custom template', () => {
      const dream = {
        title: 'Custom Dream',
        description: 'Test description',
        tags: ['test', 'custom'],
      }

      const todos = [
        { title: 'Task 1', category: 'admin' },
        { title: 'Task 2', category: 'coding' },
      ]

      const metadata = {
        name: 'My Custom Template',
        description: 'Template description',
        category: 'project',
        author: 'user-123',
        price: 0,
      }

      const template = templateService.createTemplate(dream, todos, metadata)

      expect(template).toBeDefined()
      expect(template.id).toContain('template-')
      expect(template.name).toBe('My Custom Template')
      expect(template.dream.title).toBe('Custom Dream')
      expect(template.todos.length).toBe(2)
    })

    it('should add custom template to collection', () => {
      const dream = { title: 'Test', tags: [] }
      const todos = [{ title: 'Task', category: 'admin' }]
      const metadata = {
        name: 'Test Template',
        description: 'Test',
        category: 'project',
        author: 'user-123',
        price: 0,
      }

      const initialCount = templateService.getTemplates().length
      templateService.createTemplate(dream, todos, metadata)
      const afterCount = templateService.getTemplates().length

      expect(afterCount).toBe(initialCount + 1)
    })

    it('should validate required fields', () => {
      expect(() => {
        templateService.createTemplate(null, [], {
          name: 'Test',
          category: 'project',
          author: 'user',
        })
      }).toThrow()

      expect(() => {
        templateService.createTemplate({ title: 'Test', tags: [] }, [], {
          description: 'Test',
          category: 'project',
          author: 'user',
        })
      }).toThrow()
    })
  })

  describe('Template Filtering', () => {
    beforeEach(() => {
      // Add some custom templates
      templateService.createTemplate(
        { title: 'Blog', tags: ['web'] },
        [{ title: 'Task', category: 'admin' }],
        {
          name: 'Blog Template',
          description: 'For blogs',
          category: 'personal',
          author: 'user-1',
          price: 0,
        }
      )

      templateService.createTemplate(
        { title: 'E-commerce', tags: ['shop'] },
        [{ title: 'Task', category: 'admin' }],
        {
          name: 'Shop Template',
          description: 'For shops',
          category: 'business',
          author: 'user-2',
          price: 9.99,
        }
      )
    })

    it('should filter by category', () => {
      const productTemplates = templateService.getTemplates().filter(t => t.category === 'product')
      const personalTemplates = templateService
        .getTemplates()
        .filter(t => t.category === 'personal')

      expect(productTemplates.length).toBeGreaterThan(0)
      expect(personalTemplates.length).toBeGreaterThan(0)
    })

    it('should filter by price', () => {
      const freeTemplates = templateService.getTemplates().filter(t => t.price === 0)
      const paidTemplates = templateService.getTemplates().filter(t => t.price > 0)

      expect(freeTemplates.length).toBeGreaterThan(0)
      expect(paidTemplates.length).toBeGreaterThan(0)
    })

    it('should sort by rating', () => {
      const templates = templateService.getTemplates().sort((a, b) => b.rating - a.rating)

      for (let i = 1; i < templates.length; i++) {
        expect(templates[i - 1].rating).toBeGreaterThanOrEqual(templates[i].rating)
      }
    })

    it('should sort by usage', () => {
      const templates = templateService.getTemplates().sort((a, b) => b.uses - a.uses)

      for (let i = 1; i < templates.length; i++) {
        expect(templates[i - 1].uses).toBeGreaterThanOrEqual(templates[i].uses)
      }
    })
  })

  describe('Template Metadata', () => {
    it('should track template usage', () => {
      const template = templateService.getTemplates().find(t => t.id === 'mvp-launch')
      const initialUses = template.uses

      templateService.applyTemplate('mvp-launch')

      const updated = templateService.getTemplates().find(t => t.id === 'mvp-launch')
      expect(updated.uses).toBe(initialUses + 1)
    })

    it('should have rating between 0 and 5', () => {
      const templates = templateService.getTemplates()

      templates.forEach(template => {
        expect(template.rating).toBeGreaterThanOrEqual(0)
        expect(template.rating).toBeLessThanOrEqual(5)
      })
    })

    it('should have valid categories', () => {
      const validCategories = ['product', 'project', 'personal', 'business', 'learning']
      const templates = templateService.getTemplates()

      templates.forEach(template => {
        expect(validCategories).toContain(template.category)
      })
    })
  })
})
