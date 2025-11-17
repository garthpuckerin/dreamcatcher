/**
 * Integration Service
 *
 * Handles third-party integrations:
 * - GitHub (commits, PRs, issues)
 * - Slack (threads, notifications)
 * - Jira/Linear (task sync)
 * - Google Calendar (deadlines)
 *
 * Architecture:
 * - OAuth 2.0 for authentication
 * - Webhooks for real-time updates
 * - Queue system for async processing
 * - Retry logic for failed operations
 */

class IntegrationService {
  constructor() {
    this.connections = new Map();
    this.webhookHandlers = new Map();
  }

  // ====================
  // GITHUB INTEGRATION
  // ====================

  /**
   * Connect GitHub account
   * @param {string} code - OAuth code from GitHub
   * @returns {Promise<Object>} Connection details
   */
  async connectGitHub(code) {
    try {
      // Exchange code for access token
      const tokenResponse = await fetch('/api/integrations/github/oauth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code })
      });

      const { access_token, scope } = await tokenResponse.json();

      // Get user info
      const userResponse = await fetch('https://api.github.com/user', {
        headers: {
          'Authorization': `Bearer ${access_token}`,
          'Accept': 'application/vnd.github.v3+json'
        }
      });

      const user = await userResponse.json();

      const connection = {
        provider: 'github',
        userId: user.id,
        username: user.login,
        accessToken: access_token,
        scope,
        connectedAt: new Date().toISOString()
      };

      this.connections.set('github', connection);

      return connection;
    } catch (error) {
      console.error('GitHub connection error:', error);
      throw new Error('Failed to connect GitHub account');
    }
  }

  /**
   * Link a GitHub repository to a dream
   * @param {string} dreamId - Dream ID
   * @param {string} repoFullName - Repository (owner/repo)
   * @returns {Promise<Object>} Link details
   */
  async linkGitHubRepo(dreamId, repoFullName) {
    const connection = this.connections.get('github');
    if (!connection) {
      throw new Error('GitHub not connected');
    }

    // Set up webhook for this repo
    const webhook = await this.createGitHubWebhook(repoFullName, connection.accessToken);

    return {
      dreamId,
      provider: 'github',
      resourceType: 'repository',
      resourceId: repoFullName,
      webhookId: webhook.id,
      linkedAt: new Date().toISOString()
    };
  }

  /**
   * Create GitHub webhook
   * @param {string} repoFullName - Repository name
   * @param {string} accessToken - GitHub access token
   * @returns {Promise<Object>} Webhook details
   */
  async createGitHubWebhook(repoFullName, accessToken) {
    const webhookUrl = `${window.location.origin}/api/webhooks/github`;

    const response = await fetch(`https://api.github.com/repos/${repoFullName}/hooks`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Accept': 'application/vnd.github.v3+json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: 'web',
        active: true,
        events: ['push', 'pull_request', 'issues'],
        config: {
          url: webhookUrl,
          content_type: 'json',
          insecure_ssl: '0'
        }
      })
    });

    return response.json();
  }

  /**
   * Handle GitHub webhook event
   * @param {Object} payload - Webhook payload
   * @returns {Promise<void>}
   */
  async handleGitHubWebhook(payload) {
    const { action, repository, commits, pull_request, issue } = payload;

    // Handle push events (commits)
    if (commits && commits.length > 0) {
      for (const commit of commits) {
        await this.createFragmentFromCommit(commit, repository);
      }
    }

    // Handle pull request events
    if (pull_request) {
      await this.createFragmentFromPR(pull_request, repository, action);
    }

    // Handle issue events
    if (issue) {
      await this.syncIssueToTodo(issue, repository, action);
    }
  }

  /**
   * Create fragment from commit
   * @param {Object} commit - Commit data
   * @param {Object} repository - Repository data
   */
  async createFragmentFromCommit(commit, repository) {
    const fragment = {
      title: commit.message.split('\n')[0],
      content: `Commit: ${commit.id.substring(0, 7)}\n\n${commit.message}\n\nFiles changed: ${commit.added.length + commit.modified.length + commit.removed.length}`,
      source: `GitHub: ${repository.full_name}`,
      url: commit.url,
      features: [],
      code_snippets: []
    };

    // Auto-detect dream based on repository link
    // This would be implemented with database lookup
    console.log('Creating fragment from commit:', fragment);

    return fragment;
  }

  /**
   * Create fragment from pull request
   * @param {Object} pr - Pull request data
   * @param {Object} repository - Repository data
   * @param {string} action - PR action (opened, closed, etc.)
   */
  async createFragmentFromPR(pr, repository, action) {
    const fragment = {
      title: `PR ${action}: ${pr.title}`,
      content: `${pr.body}\n\nChanges: +${pr.additions} -${pr.deletions}`,
      source: `GitHub PR #${pr.number}`,
      url: pr.html_url,
      features: pr.labels.map(l => l.name),
      code_snippets: []
    };

    console.log('Creating fragment from PR:', fragment);

    return fragment;
  }

  /**
   * Sync GitHub issue to todo
   * @param {Object} issue - Issue data
   * @param {Object} repository - Repository data
   * @param {string} action - Issue action
   */
  async syncIssueToTodo(issue, repository, action) {
    const todo = {
      title: issue.title,
      description: issue.body,
      category: 'coding',
      source: `github-issue-${issue.number}`,
      completed: issue.state === 'closed',
      notes: `GitHub Issue #${issue.number}\n${issue.html_url}`
    };

    console.log('Syncing issue to todo:', todo);

    return todo;
  }

  // ====================
  // SLACK INTEGRATION
  // ====================

  /**
   * Connect Slack workspace
   * @param {string} code - OAuth code from Slack
   * @returns {Promise<Object>} Connection details
   */
  async connectSlack(code) {
    try {
      const response = await fetch('/api/integrations/slack/oauth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code })
      });

      const data = await response.json();

      const connection = {
        provider: 'slack',
        teamId: data.team.id,
        teamName: data.team.name,
        accessToken: data.access_token,
        webhookUrl: data.incoming_webhook.url,
        channel: data.incoming_webhook.channel,
        connectedAt: new Date().toISOString()
      };

      this.connections.set('slack', connection);

      return connection;
    } catch (error) {
      console.error('Slack connection error:', error);
      throw new Error('Failed to connect Slack workspace');
    }
  }

  /**
   * Capture Slack thread as fragment
   * @param {string} channelId - Slack channel ID
   * @param {string} threadTs - Thread timestamp
   * @param {string} dreamId - Dream to attach to
   * @returns {Promise<Object>} Fragment data
   */
  async captureSlackThread(channelId, threadTs, dreamId) {
    const connection = this.connections.get('slack');
    if (!connection) {
      throw new Error('Slack not connected');
    }

    // Fetch thread messages
    const response = await fetch(`https://slack.com/api/conversations.replies`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${connection.accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        channel: channelId,
        ts: threadTs
      })
    });

    const { messages } = await response.json();

    const fragment = {
      title: `Slack Discussion: ${messages[0].text.substring(0, 50)}...`,
      content: messages.map(m => `${m.user}: ${m.text}`).join('\n\n'),
      source: `Slack: #${channelId}`,
      url: `slack://channel?id=${channelId}&message=${threadTs}`,
      features: [],
      code_snippets: []
    };

    return fragment;
  }

  /**
   * Send notification to Slack
   * @param {string} message - Message to send
   * @param {Object} options - Additional options (channel, attachments)
   * @returns {Promise<void>}
   */
  async sendSlackNotification(message, options = {}) {
    const connection = this.connections.get('slack');
    if (!connection) {
      throw new Error('Slack not connected');
    }

    await fetch(connection.webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        text: message,
        channel: options.channel || connection.channel,
        ...options
      })
    });
  }

  // ====================
  // CALENDAR INTEGRATION
  // ====================

  /**
   * Connect Google Calendar
   * @param {string} code - OAuth code from Google
   * @returns {Promise<Object>} Connection details
   */
  async connectGoogleCalendar(code) {
    try {
      const response = await fetch('/api/integrations/google/oauth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, scope: 'calendar' })
      });

      const data = await response.json();

      const connection = {
        provider: 'google-calendar',
        accessToken: data.access_token,
        refreshToken: data.refresh_token,
        expiresAt: Date.now() + (data.expires_in * 1000),
        connectedAt: new Date().toISOString()
      };

      this.connections.set('google-calendar', connection);

      return connection;
    } catch (error) {
      console.error('Google Calendar connection error:', error);
      throw new Error('Failed to connect Google Calendar');
    }
  }

  /**
   * Sync todo deadlines to calendar
   * @param {Object} todo - Todo with deadline
   * @param {string} dreamTitle - Dream title for event name
   * @returns {Promise<Object>} Calendar event
   */
  async syncTodoToCalendar(todo, dreamTitle) {
    const connection = this.connections.get('google-calendar');
    if (!connection) {
      throw new Error('Google Calendar not connected');
    }

    const event = {
      summary: `[Dreamcatcher] ${todo.title}`,
      description: `Dream: ${dreamTitle}\nCategory: ${todo.category}\n\n${todo.notes || ''}`,
      start: {
        date: todo.deadline
      },
      end: {
        date: todo.deadline
      },
      reminders: {
        useDefault: true
      }
    };

    const response = await fetch('https://www.googleapis.com/calendar/v3/calendars/primary/events', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${connection.accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(event)
    });

    return response.json();
  }

  // ====================
  // UTILITY METHODS
  // ====================

  /**
   * Get all connected integrations
   * @returns {Array} List of connections
   */
  getConnections() {
    return Array.from(this.connections.values());
  }

  /**
   * Disconnect an integration
   * @param {string} provider - Provider name
   */
  disconnect(provider) {
    this.connections.delete(provider);
  }

  /**
   * Check if integration is connected
   * @param {string} provider - Provider name
   * @returns {boolean}
   */
  isConnected(provider) {
    return this.connections.has(provider);
  }
}

// Singleton instance
export const integrationService = new IntegrationService();

export default integrationService;
