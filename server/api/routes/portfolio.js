/**
 * Portfolio API Routes
 *
 * Handles portfolio CRUD operations
 */

const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth');
const { validatePortfolio } = require('../middleware/validation');

/**
 * GET /api/portfolio/:userId
 * Get user's portfolio
 */
router.get('/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    const portfolio = await req.db.portfolios.findOne({
      where: { userId },
      include: [
        { model: req.db.dreams, as: 'dreams', where: { status: ['completed', 'launched'] } }
      ]
    });

    if (!portfolio) {
      return res.status(404).json({ error: 'Portfolio not found' });
    }

    res.json(portfolio);
  } catch (error) {
    console.error('[API] Error fetching portfolio:', error);
    res.status(500).json({ error: 'Failed to fetch portfolio' });
  }
});

/**
 * GET /api/portfolio/public/:username
 * Get public portfolio by username
 */
router.get('/public/:username', async (req, res) => {
  try {
    const { username } = req.params;

    const user = await req.db.users.findOne({ where: { username } });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const portfolio = await req.db.portfolios.findOne({
      where: { userId: user.id, isPublic: true },
      include: [
        {
          model: req.db.dreams,
          as: 'dreams',
          where: { status: ['completed', 'launched'] },
          include: [
            { model: req.db.fragments, as: 'fragments' },
            { model: req.db.todos, as: 'todos' }
          ]
        }
      ]
    });

    if (!portfolio) {
      return res.status(404).json({ error: 'Portfolio not found or not public' });
    }

    res.json(portfolio);
  } catch (error) {
    console.error('[API] Error fetching public portfolio:', error);
    res.status(500).json({ error: 'Failed to fetch portfolio' });
  }
});

/**
 * POST /api/portfolio/:userId
 * Create or update portfolio
 */
router.post('/:userId', authenticate, validatePortfolio, async (req, res) => {
  try {
    const { userId } = req.params;

    // Ensure user can only update their own portfolio
    if (req.user.id !== userId) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    const { title, bio, skills, dreams, theme, customDomain } = req.body;

    const [portfolio, created] = await req.db.portfolios.findOrCreate({
      where: { userId },
      defaults: {
        title,
        bio,
        skills,
        theme,
        customDomain
      }
    });

    if (!created) {
      await portfolio.update({
        title,
        bio,
        skills,
        theme,
        customDomain,
        updatedAt: new Date()
      });
    }

    // Update dream associations
    if (dreams && Array.isArray(dreams)) {
      await req.db.portfolioDreams.destroy({ where: { portfolioId: portfolio.id } });

      for (let i = 0; i < dreams.length; i++) {
        await req.db.portfolioDreams.create({
          portfolioId: portfolio.id,
          dreamId: dreams[i].id,
          displayOrder: i
        });
      }
    }

    res.json(portfolio);
  } catch (error) {
    console.error('[API] Error saving portfolio:', error);
    res.status(500).json({ error: 'Failed to save portfolio' });
  }
});

/**
 * POST /api/portfolio/:userId/publish
 * Toggle portfolio publish status
 */
router.post('/:userId/publish', authenticate, async (req, res) => {
  try {
    const { userId } = req.params;

    if (req.user.id !== userId) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    const { isPublic } = req.body;

    const portfolio = await req.db.portfolios.findOne({ where: { userId } });

    if (!portfolio) {
      return res.status(404).json({ error: 'Portfolio not found' });
    }

    await portfolio.update({ isPublic });

    res.json({ success: true, isPublic });
  } catch (error) {
    console.error('[API] Error updating publish status:', error);
    res.status(500).json({ error: 'Failed to update publish status' });
  }
});

/**
 * GET /api/portfolio/:userId/case-study/:dreamId
 * Get case study for a dream
 */
router.get('/:userId/case-study/:dreamId', async (req, res) => {
  try {
    const { userId, dreamId } = req.params;

    const caseStudy = await req.db.caseStudies.findOne({
      where: { userId, dreamId }
    });

    if (!caseStudy) {
      return res.status(404).json({ error: 'Case study not found' });
    }

    res.json(caseStudy);
  } catch (error) {
    console.error('[API] Error fetching case study:', error);
    res.status(500).json({ error: 'Failed to fetch case study' });
  }
});

/**
 * POST /api/portfolio/:userId/case-study
 * Save case study for a dream
 */
router.post('/:userId/case-study', authenticate, async (req, res) => {
  try {
    const { userId } = req.params;

    if (req.user.id !== userId) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    const { dreamId, sections, format } = req.body;

    const [caseStudy, created] = await req.db.caseStudies.findOrCreate({
      where: { userId, dreamId },
      defaults: {
        sections,
        format,
        generatedAt: new Date()
      }
    });

    if (!created) {
      await caseStudy.update({ sections, format, updatedAt: new Date() });
    }

    res.json(caseStudy);
  } catch (error) {
    console.error('[API] Error saving case study:', error);
    res.status(500).json({ error: 'Failed to save case study' });
  }
});

module.exports = router;
