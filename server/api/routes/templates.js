/**
 * Templates API Routes
 *
 * Handles template marketplace operations
 */

const express = require('express')
const router = express.Router()
const { Op } = require('sequelize')
const { authenticate } = require('../middleware/auth')

/**
 * GET /api/templates
 * Get all templates (marketplace)
 */
router.get('/', async (req, res) => {
  try {
    const { category, search, sortBy = 'rating', page = 1, limit = 20 } = req.query

    const where = { isPublic: true }

    if (category && category !== 'all') {
      where.category = category
    }

    if (search) {
      where[Op.or] = [
        { name: { [Op.iLike]: `%${search}%` } },
        { description: { [Op.iLike]: `%${search}%` } },
      ]
    }

    const order = []
    switch (sortBy) {
      case 'rating':
        order.push(['rating', 'DESC'])
        break
      case 'uses':
        order.push(['uses', 'DESC'])
        break
      case 'recent':
        order.push(['createdAt', 'DESC'])
        break
      default:
        order.push(['rating', 'DESC'])
    }

    const offset = (page - 1) * limit

    const { rows: templates, count } = await req.db.templates.findAndCountAll({
      where,
      order,
      limit: parseInt(limit),
      offset,
      include: [
        {
          model: req.db.users,
          as: 'author',
          attributes: ['id', 'username', 'name'],
        },
      ],
    })

    res.json({
      templates,
      pagination: {
        total: count,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(count / limit),
      },
    })
  } catch (error) {
    console.error('[API] Error fetching templates:', error)
    res.status(500).json({ error: 'Failed to fetch templates' })
  }
})

/**
 * GET /api/templates/:id
 * Get template by ID
 */
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params

    const template = await req.db.templates.findByPk(id, {
      include: [
        {
          model: req.db.users,
          as: 'author',
          attributes: ['id', 'username', 'name', 'avatar'],
        },
      ],
    })

    if (!template) {
      return res.status(404).json({ error: 'Template not found' })
    }

    if (!template.isPublic && template.authorId !== req.user?.id) {
      return res.status(403).json({ error: 'Template not accessible' })
    }

    res.json(template)
  } catch (error) {
    console.error('[API] Error fetching template:', error)
    res.status(500).json({ error: 'Failed to fetch template' })
  }
})

/**
 * POST /api/templates
 * Create custom template
 */
router.post('/', authenticate, async (req, res) => {
  try {
    const { name, description, category, price, dream, todos, isPublic = false } = req.body

    // Validate required fields
    if (!name || !description || !category || !dream || !todos) {
      return res.status(400).json({ error: 'Missing required fields' })
    }

    // Create template
    const template = await req.db.templates.create({
      authorId: req.user.id,
      name,
      description,
      category,
      price: parseFloat(price) || 0,
      dream,
      todos,
      isPublic,
      rating: 0,
      uses: 0,
    })

    res.status(201).json(template)
  } catch (error) {
    console.error('[API] Error creating template:', error)
    res.status(500).json({ error: 'Failed to create template' })
  }
})

/**
 * PUT /api/templates/:id
 * Update template
 */
router.put('/:id', authenticate, async (req, res) => {
  try {
    const { id } = req.params

    const template = await req.db.templates.findByPk(id)

    if (!template) {
      return res.status(404).json({ error: 'Template not found' })
    }

    if (template.authorId !== req.user.id) {
      return res.status(403).json({ error: 'Unauthorized' })
    }

    const { name, description, category, price, dream, todos, isPublic } = req.body

    await template.update({
      name,
      description,
      category,
      price: parseFloat(price) || 0,
      dream,
      todos,
      isPublic,
    })

    res.json(template)
  } catch (error) {
    console.error('[API] Error updating template:', error)
    res.status(500).json({ error: 'Failed to update template' })
  }
})

/**
 * DELETE /api/templates/:id
 * Delete template
 */
router.delete('/:id', authenticate, async (req, res) => {
  try {
    const { id } = req.params

    const template = await req.db.templates.findByPk(id)

    if (!template) {
      return res.status(404).json({ error: 'Template not found' })
    }

    if (template.authorId !== req.user.id) {
      return res.status(403).json({ error: 'Unauthorized' })
    }

    await template.destroy()

    res.json({ success: true })
  } catch (error) {
    console.error('[API] Error deleting template:', error)
    res.status(500).json({ error: 'Failed to delete template' })
  }
})

/**
 * POST /api/templates/:id/apply
 * Apply template (create dream from template)
 */
router.post('/:id/apply', authenticate, async (req, res) => {
  try {
    const { id } = req.params

    const template = await req.db.templates.findByPk(id)

    if (!template) {
      return res.status(404).json({ error: 'Template not found' })
    }

    // Check if paid template and user has purchased
    if (template.price > 0) {
      const purchase = await req.db.templatePurchases.findOne({
        where: { userId: req.user.id, templateId: id },
      })

      if (!purchase && template.authorId !== req.user.id) {
        return res.status(402).json({ error: 'Payment required' })
      }
    }

    // Create dream from template
    const dream = await req.db.dreams.create({
      userId: req.user.id,
      title: template.dream.title,
      description: template.dream.description,
      tags: template.dream.tags,
      status: 'in-progress',
      metadata: {
        fromTemplate: id,
        templateName: template.name,
      },
    })

    // Create todos
    const todos = await Promise.all(
      template.todos.map((todo, index) =>
        req.db.todos.create({
          dreamId: dream.id,
          userId: req.user.id,
          title: todo.title,
          category: todo.category,
          notes: todo.notes,
          displayOrder: index,
        })
      )
    )

    // Increment usage count
    await template.increment('uses')

    res.json({ dream, todos })
  } catch (error) {
    console.error('[API] Error applying template:', error)
    res.status(500).json({ error: 'Failed to apply template' })
  }
})

/**
 * POST /api/templates/:id/purchase
 * Purchase paid template
 */
router.post('/:id/purchase', authenticate, async (req, res) => {
  try {
    const { id } = req.params
    const { paymentMethodId } = req.body

    const template = await req.db.templates.findByPk(id)

    if (!template) {
      return res.status(404).json({ error: 'Template not found' })
    }

    if (template.price === 0) {
      return res.status(400).json({ error: 'Template is free' })
    }

    // Check if already purchased
    const existing = await req.db.templatePurchases.findOne({
      where: { userId: req.user.id, templateId: id },
    })

    if (existing) {
      return res.status(400).json({ error: 'Already purchased' })
    }

    // Process payment with Stripe
    const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(template.price * 100), // Convert to cents
      currency: 'usd',
      payment_method: paymentMethodId,
      confirm: true,
      metadata: {
        templateId: id,
        userId: req.user.id,
        authorId: template.authorId,
      },
    })

    if (paymentIntent.status === 'succeeded') {
      // Record purchase
      await req.db.templatePurchases.create({
        userId: req.user.id,
        templateId: id,
        amount: template.price,
        stripePaymentId: paymentIntent.id,
      })

      // Calculate author earnings (70%)
      const authorEarnings = template.price * 0.7

      // Record transaction
      await req.db.transactions.create({
        userId: template.authorId,
        type: 'template_sale',
        amount: authorEarnings,
        templateId: id,
        buyerId: req.user.id,
      })

      res.json({ success: true, paymentIntent })
    } else {
      res.status(400).json({ error: 'Payment failed' })
    }
  } catch (error) {
    console.error('[API] Error purchasing template:', error)
    res.status(500).json({ error: 'Failed to purchase template' })
  }
})

/**
 * POST /api/templates/:id/rate
 * Rate template
 */
router.post('/:id/rate', authenticate, async (req, res) => {
  try {
    const { id } = req.params
    const { rating } = req.body

    if (rating < 1 || rating > 5) {
      return res.status(400).json({ error: 'Rating must be between 1 and 5' })
    }

    const template = await req.db.templates.findByPk(id)

    if (!template) {
      return res.status(404).json({ error: 'Template not found' })
    }

    // Create or update rating
    const [templateRating, created] = await req.db.templateRatings.findOrCreate({
      where: { userId: req.user.id, templateId: id },
      defaults: { rating },
    })

    if (!created) {
      await templateRating.update({ rating })
    }

    // Recalculate template average rating
    const ratings = await req.db.templateRatings.findAll({
      where: { templateId: id },
    })

    const avgRating = ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length

    await template.update({ rating: avgRating })

    res.json({ success: true, rating: avgRating })
  } catch (error) {
    console.error('[API] Error rating template:', error)
    res.status(500).json({ error: 'Failed to rate template' })
  }
})

/**
 * GET /api/templates/user/:userId
 * Get user's created templates
 */
router.get('/user/:userId', async (req, res) => {
  try {
    const { userId } = req.params

    const templates = await req.db.templates.findAll({
      where: {
        authorId: userId,
        isPublic: true,
      },
      order: [['createdAt', 'DESC']],
    })

    res.json(templates)
  } catch (error) {
    console.error('[API] Error fetching user templates:', error)
    res.status(500).json({ error: 'Failed to fetch templates' })
  }
})

module.exports = router
