/**
 * Integrations API Routes
 *
 * Handles third-party integrations (GitHub, Slack, Calendar)
 */

const express = require('express')
const router = express.Router()
const axios = require('axios')
const { authenticate } = require('../middleware/auth')

/**
 * POST /api/integrations/github/oauth
 * Exchange GitHub OAuth code for access token
 */
router.post('/github/oauth', authenticate, async (req, res) => {
  try {
    const { code } = req.body

    // Exchange code for access token
    const tokenResponse = await axios.post(
      'https://github.com/login/oauth/access_token',
      {
        client_id: process.env.GITHUB_CLIENT_ID,
        client_secret: process.env.GITHUB_CLIENT_SECRET,
        code,
      },
      {
        headers: { Accept: 'application/json' },
      }
    )

    const { access_token } = tokenResponse.data

    // Get user info
    const userResponse = await axios.get('https://api.github.com/user', {
      headers: { Authorization: `token ${access_token}` },
    })

    // Store integration
    await req.db.integrations.create({
      userId: req.user.id,
      provider: 'github',
      accessToken: access_token,
      providerUserId: userResponse.data.id,
      providerUsername: userResponse.data.login,
      metadata: {
        name: userResponse.data.name,
        avatar: userResponse.data.avatar_url,
      },
    })

    res.json({ success: true, username: userResponse.data.login })
  } catch (error) {
    console.error('[API] GitHub OAuth error:', error)
    res.status(500).json({ error: 'Failed to connect GitHub' })
  }
})

/**
 * POST /api/integrations/github/webhook
 * Handle GitHub webhook events
 */
router.post('/github/webhook', async (req, res) => {
  try {
    const event = req.headers['x-github-event']
    const payload = req.body

    console.log(`[Webhook] GitHub ${event} event received`)

    // Find user integration
    const integration = await req.db.integrations.findOne({
      where: {
        provider: 'github',
        providerUsername: payload.repository.owner.login,
      },
    })

    if (!integration) {
      return res.status(404).json({ error: 'Integration not found' })
    }

    // Handle different event types
    switch (event) {
      case 'push':
        await handleGitHubPush(integration.userId, payload)
        break

      case 'pull_request':
        await handleGitHubPR(integration.userId, payload)
        break

      case 'issues':
        await handleGitHubIssue(integration.userId, payload)
        break

      default:
        console.log(`[Webhook] Unhandled GitHub event: ${event}`)
    }

    res.json({ success: true })
  } catch (error) {
    console.error('[Webhook] GitHub error:', error)
    res.status(500).json({ error: 'Webhook processing failed' })
  }
})

/**
 * POST /api/integrations/slack/oauth
 * Exchange Slack OAuth code for access token
 */
router.post('/slack/oauth', authenticate, async (req, res) => {
  try {
    const { code } = req.body

    // Exchange code for access token
    const tokenResponse = await axios.post('https://slack.com/api/oauth.v2.access', {
      client_id: process.env.SLACK_CLIENT_ID,
      client_secret: process.env.SLACK_CLIENT_SECRET,
      code,
    })

    const { access_token, team, authed_user } = tokenResponse.data

    // Store integration
    await req.db.integrations.create({
      userId: req.user.id,
      provider: 'slack',
      accessToken: access_token,
      providerUserId: authed_user.id,
      metadata: {
        teamId: team.id,
        teamName: team.name,
      },
    })

    res.json({ success: true, team: team.name })
  } catch (error) {
    console.error('[API] Slack OAuth error:', error)
    res.status(500).json({ error: 'Failed to connect Slack' })
  }
})

/**
 * POST /api/integrations/slack/capture
 * Capture Slack thread as fragment
 */
router.post('/slack/capture', authenticate, async (req, res) => {
  try {
    const { channelId, threadTs, dreamId } = req.body

    // Get Slack integration
    const integration = await req.db.integrations.findOne({
      where: { userId: req.user.id, provider: 'slack' },
    })

    if (!integration) {
      return res.status(404).json({ error: 'Slack not connected' })
    }

    // Fetch thread messages
    const messagesResponse = await axios.get('https://slack.com/api/conversations.replies', {
      headers: { Authorization: `Bearer ${integration.accessToken}` },
      params: { channel: channelId, ts: threadTs },
    })

    const { messages } = messagesResponse.data

    // Format as fragment
    const content = messages.map(m => `${m.user}: ${m.text}`).join('\n\n')

    // Create fragment
    const fragment = await req.db.fragments.create({
      dreamId,
      userId: req.user.id,
      title: `Slack Discussion: ${messages[0].text.substring(0, 50)}...`,
      content,
      type: 'conversation',
      source: `Slack: #${channelId}`,
      metadata: {
        slackChannel: channelId,
        slackThread: threadTs,
        messageCount: messages.length,
      },
    })

    res.json(fragment)
  } catch (error) {
    console.error('[API] Slack capture error:', error)
    res.status(500).json({ error: 'Failed to capture Slack thread' })
  }
})

/**
 * POST /api/integrations/calendar/oauth
 * Exchange Google Calendar OAuth code for access token
 */
router.post('/calendar/oauth', authenticate, async (req, res) => {
  try {
    const { code } = req.body

    // Exchange code for access token
    const tokenResponse = await axios.post('https://oauth2.googleapis.com/token', {
      client_id: process.env.GOOGLE_CLIENT_ID,
      client_secret: process.env.GOOGLE_CLIENT_SECRET,
      code,
      redirect_uri: process.env.GOOGLE_REDIRECT_URI,
      grant_type: 'authorization_code',
    })

    const { access_token, refresh_token } = tokenResponse.data

    // Store integration
    await req.db.integrations.create({
      userId: req.user.id,
      provider: 'google_calendar',
      accessToken: access_token,
      refreshToken: refresh_token,
    })

    res.json({ success: true })
  } catch (error) {
    console.error('[API] Calendar OAuth error:', error)
    res.status(500).json({ error: 'Failed to connect Google Calendar' })
  }
})

/**
 * POST /api/integrations/calendar/sync
 * Sync todo deadline to Google Calendar
 */
router.post('/calendar/sync', authenticate, async (req, res) => {
  try {
    const { todoId, dreamTitle } = req.body

    // Get calendar integration
    const integration = await req.db.integrations.findOne({
      where: { userId: req.user.id, provider: 'google_calendar' },
    })

    if (!integration) {
      return res.status(404).json({ error: 'Google Calendar not connected' })
    }

    // Get todo
    const todo = await req.db.todos.findByPk(todoId)

    if (!todo || !todo.deadline) {
      return res.status(400).json({ error: 'Todo not found or no deadline' })
    }

    // Create calendar event
    const event = {
      summary: `[Dreamcatcher] ${todo.title}`,
      description: `Dream: ${dreamTitle}\nCategory: ${todo.category}`,
      start: { date: todo.deadline },
      end: { date: todo.deadline },
    }

    const calendarResponse = await axios.post(
      'https://www.googleapis.com/calendar/v3/calendars/primary/events',
      event,
      {
        headers: { Authorization: `Bearer ${integration.accessToken}` },
      }
    )

    // Store event ID
    await todo.update({
      metadata: {
        ...todo.metadata,
        calendarEventId: calendarResponse.data.id,
      },
    })

    res.json({ success: true, eventId: calendarResponse.data.id })
  } catch (error) {
    console.error('[API] Calendar sync error:', error)
    res.status(500).json({ error: 'Failed to sync to calendar' })
  }
})

/**
 * GET /api/integrations
 * Get user's connected integrations
 */
router.get('/', authenticate, async (req, res) => {
  try {
    const integrations = await req.db.integrations.findAll({
      where: { userId: req.user.id },
      attributes: ['id', 'provider', 'providerUsername', 'metadata', 'createdAt'],
    })

    res.json(integrations)
  } catch (error) {
    console.error('[API] Error fetching integrations:', error)
    res.status(500).json({ error: 'Failed to fetch integrations' })
  }
})

/**
 * DELETE /api/integrations/:id
 * Disconnect integration
 */
router.delete('/:id', authenticate, async (req, res) => {
  try {
    const { id } = req.params

    const integration = await req.db.integrations.findOne({
      where: { id, userId: req.user.id },
    })

    if (!integration) {
      return res.status(404).json({ error: 'Integration not found' })
    }

    await integration.destroy()

    res.json({ success: true })
  } catch (error) {
    console.error('[API] Error deleting integration:', error)
    res.status(500).json({ error: 'Failed to disconnect integration' })
  }
})

/**
 * Helper: Handle GitHub push event
 */
async function handleGitHubPush(userId, payload) {
  const { commits, repository, db } = payload

  for (const commit of commits) {
    // Find or create dream for this repo
    const dream = await findOrCreateDreamForRepo(userId, repository, db)

    // Create fragment from commit
    await db.fragments.create({
      dreamId: dream.id,
      userId,
      title: commit.message.split('\n')[0],
      content: `**Commit:** ${commit.id.substring(0, 7)}\n**Author:** ${commit.author.name}\n**Date:** ${commit.timestamp}\n\n${commit.message}\n\n**Files changed:**\n${commit.added
        .concat(commit.modified)
        .map(f => `- ${f}`)
        .join('\n')}`,
      type: 'commit',
      source: `GitHub: ${repository.full_name}`,
      metadata: {
        commitSha: commit.id,
        commitUrl: commit.url,
      },
    })
  }
}

/**
 * Helper: Handle GitHub PR event
 */
async function handleGitHubPR(userId, payload) {
  const { pull_request, repository, action, db } = payload

  if (action === 'opened' || action === 'closed') {
    const dream = await findOrCreateDreamForRepo(userId, repository, db)

    await db.fragments.create({
      dreamId: dream.id,
      userId,
      title: `PR #${pull_request.number}: ${pull_request.title}`,
      content: `**Status:** ${pull_request.state}\n**Author:** ${pull_request.user.login}\n\n${pull_request.body || 'No description'}`,
      type: 'pull_request',
      source: `GitHub: ${repository.full_name}`,
      metadata: {
        prNumber: pull_request.number,
        prUrl: pull_request.html_url,
        prState: pull_request.state,
      },
    })
  }
}

/**
 * Helper: Handle GitHub issue event
 */
async function handleGitHubIssue(userId, payload) {
  const { issue, repository, action, db } = payload

  if (action === 'opened') {
    const dream = await findOrCreateDreamForRepo(userId, repository, db)

    // Create todo from issue
    await db.todos.create({
      dreamId: dream.id,
      userId,
      title: issue.title,
      category: 'admin',
      notes: issue.body,
      metadata: {
        githubIssue: issue.number,
        issueUrl: issue.html_url,
      },
    })
  }
}

/**
 * Helper: Find or create dream for repository
 */
async function findOrCreateDreamForRepo(userId, repository, db) {
  const [dream] = await db.dreams.findOrCreate({
    where: {
      userId,
      externalId: `github:${repository.id}`,
    },
    defaults: {
      title: repository.name,
      description: repository.description,
      status: 'in-progress',
      tags: ['github', repository.language].filter(Boolean),
    },
  })

  return dream
}

module.exports = router
