/**
 * Template Service
 * Manages dream templates and marketplace
 */

class TemplateService {
  constructor() {
    this.templates = this.loadBuiltInTemplates();
  }

  loadBuiltInTemplates() {
    return [
      {
        id: 'mvp-launch',
        name: 'MVP Launch Checklist',
        description: 'Complete checklist for launching your MVP',
        category: 'product',
        author: 'Dreamcatcher',
        price: 0,
        rating: 4.8,
        uses: 1234,
        dream: {
          title: 'MVP Launch',
          description: 'Launch my minimum viable product',
          status: 'in-progress',
          tags: ['mvp', 'launch', 'product']
        },
        todos: [
          { title: 'Define core features', category: 'planning', notes: 'Focus on essential 20%' },
          { title: 'Create landing page', category: 'marketing' },
          { title: 'Set up analytics', category: 'admin' },
          { title: 'Beta user outreach', category: 'marketing' },
          { title: 'Collect feedback', category: 'admin' }
        ]
      },
      {
        id: 'side-project-starter',
        name: 'Side Project Starter',
        description: 'Organize and execute on side project ideas',
        category: 'project',
        author: 'Dreamcatcher',
        price: 0,
        rating: 4.6,
        uses: 892,
        dream: {
          title: 'New Side Project',
          description: 'A side project I want to build',
          status: 'idea',
          tags: ['side-project', 'indie']
        },
        todos: [
          { title: 'Validate idea with 10 people', category: 'research' },
          { title: 'Create tech stack decision doc', category: 'coding' },
          { title: 'Set up development environment', category: 'coding' },
          { title: 'Build MVP', category: 'coding' },
          { title: 'Launch on Product Hunt', category: 'marketing' }
        ]
      }
    ];
  }

  // Get all templates
  getTemplates(filters = {}) {
    let filtered = [...this.templates];

    if (filters.category) {
      filtered = filtered.filter(t => t.category === filters.category);
    }

    if (filters.search) {
      const query = filters.search.toLowerCase();
      filtered = filtered.filter(t =>
        t.name.toLowerCase().includes(query) ||
        t.description.toLowerCase().includes(query)
      );
    }

    return filtered.sort((a, b) => b.rating - a.rating);
  }

  // Apply template to create new dream
  applyTemplate(templateId) {
    const template = this.templates.find(t => t.id === templateId);
    if (!template) {
      throw new Error('Template not found');
    }

    return {
      dream: {
        ...template.dream,
        id: `dream-${Date.now()}`,
        created_at: new Date().toISOString()
      },
      todos: template.todos.map((todo, i) => ({
        ...todo,
        id: `todo-${Date.now()}-${i}`,
        completed: false,
        dream_id: `dream-${Date.now()}`
      }))
    };
  }

  // Create custom template
  createTemplate(dream, todos, metadata) {
    const template = {
      id: `template-${Date.now()}`,
      name: metadata.name,
      description: metadata.description,
      category: metadata.category,
      author: metadata.author,
      price: metadata.price || 0,
      rating: 0,
      uses: 0,
      dream: {
        title: dream.title,
        description: dream.description,
        status: dream.status,
        tags: dream.tags
      },
      todos: todos.map(t => ({
        title: t.title,
        category: t.category,
        notes: t.notes
      })),
      createdAt: new Date().toISOString()
    };

    this.templates.push(template);
    return template;
  }
}

export const templateService = new TemplateService();
export default templateService;
