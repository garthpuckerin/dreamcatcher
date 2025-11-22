/**
 * Content Script for ChatGPT and Claude Pages
 *
 * This script runs on ChatGPT and Claude AI pages to:
 * - Detect conversations and extract content
 * - Add "Save to Dreamcatcher" buttons
 * - Monitor for new messages
 * - Auto-detect project context
 */

// Detect which AI platform we're on
const PLATFORM = (() => {
  if (window.location.hostname.includes('openai.com')) return 'chatgpt'
  if (
    window.location.hostname.includes('claude.ai') ||
    window.location.hostname.includes('anthropic.com')
  )
    return 'claude'
  return 'unknown'
})()

console.log('[Dreamcatcher] Extension loaded on', PLATFORM)

// Platform-specific selectors
const SELECTORS = {
  chatgpt: {
    messages: '[data-message-author-role]',
    userMessage: '[data-message-author-role="user"]',
    assistantMessage: '[data-message-author-role="assistant"]',
    conversationTitle: 'h1',
    messageText: '.markdown',
  },
  claude: {
    messages: '[data-test-render-count]',
    userMessage: '.font-user-message',
    assistantMessage: '.font-claude-message',
    conversationTitle: 'title',
    messageText: '.prose',
  },
}

/**
 * Extract conversation from current page
 */
function extractConversation() {
  const selectors = SELECTORS[PLATFORM]
  if (!selectors) return null

  const messages = []
  const messageElements = document.querySelectorAll(selectors.messages)

  messageElements.forEach((el, index) => {
    const isUser = el.matches(selectors.userMessage)
    const textElement = el.querySelector(selectors.messageText)

    if (textElement) {
      messages.push({
        role: isUser ? 'user' : 'assistant',
        content: textElement.innerText || textElement.textContent,
        timestamp: new Date().toISOString(),
        index,
      })
    }
  })

  // Get conversation title
  const titleElement = document.querySelector(selectors.conversationTitle)
  const title = titleElement
    ? titleElement.innerText
    : `${PLATFORM} Conversation ${new Date().toLocaleDateString()}`

  return {
    title,
    platform: PLATFORM,
    url: window.location.href,
    messages,
    capturedAt: new Date().toISOString(),
    messageCount: messages.length,
  }
}

/**
 * Detect project/topic from conversation
 */
function detectProjectContext(conversation) {
  if (!conversation || conversation.messages.length === 0) return null

  const firstUserMessage = conversation.messages.find(m => m.role === 'user')
  if (!firstUserMessage) return null

  const content = firstUserMessage.content.toLowerCase()

  // Common project indicators
  const indicators = {
    build: 'building',
    create: 'creating',
    develop: 'development',
    implement: 'implementation',
    design: 'design',
    feature: 'feature',
    project: 'project',
    app: 'application',
    website: 'website',
    api: 'api',
    startup: 'startup',
  }

  for (const [keyword, context] of Object.entries(indicators)) {
    if (content.includes(keyword)) {
      return {
        detected: true,
        context,
        keyword,
        confidence: 'medium',
      }
    }
  }

  return { detected: false }
}

/**
 * Format conversation as markdown
 */
function formatAsMarkdown(conversation) {
  let markdown = `# ${conversation.title}\n\n`
  markdown += `**Platform:** ${conversation.platform}\n`
  markdown += `**Date:** ${new Date(conversation.capturedAt).toLocaleString()}\n`
  markdown += `**URL:** ${conversation.url}\n\n`
  markdown += `---\n\n`

  conversation.messages.forEach(msg => {
    const role = msg.role === 'user' ? '👤 You' : '🤖 Assistant'
    markdown += `## ${role}\n\n${msg.content}\n\n`
  })

  return markdown
}

/**
 * Add "Save to Dreamcatcher" button to UI
 */
function addCaptureButton() {
  // Check if button already exists
  if (document.getElementById('dreamcatcher-capture-btn')) return

  const button = document.createElement('button')
  button.id = 'dreamcatcher-capture-btn'
  button.className = 'dreamcatcher-btn'
  button.innerHTML = `
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/>
      <polyline points="17 21 17 13 7 13 7 21"/>
      <polyline points="7 3 7 8 15 8"/>
    </svg>
    Save to Dreamcatcher
  `
  button.title = 'Save this conversation to Dreamcatcher'

  button.addEventListener('click', handleCaptureClick)

  // Platform-specific positioning
  if (PLATFORM === 'chatgpt') {
    // Add to ChatGPT's top nav area
    const nav = document.querySelector('nav') || document.querySelector('header')
    if (nav) {
      button.style.position = 'fixed'
      button.style.top = '10px'
      button.style.right = '10px'
      button.style.zIndex = '10000'
      document.body.appendChild(button)
    }
  } else if (PLATFORM === 'claude') {
    // Add to Claude's interface
    button.style.position = 'fixed'
    button.style.bottom = '20px'
    button.style.right = '20px'
    button.style.zIndex = '10000'
    document.body.appendChild(button)
  }
}

/**
 * Handle capture button click
 */
async function handleCaptureClick() {
  const button = document.getElementById('dreamcatcher-capture-btn')
  button.disabled = true
  button.innerHTML = '⏳ Capturing...'

  try {
    const conversation = extractConversation()

    if (!conversation || conversation.messages.length === 0) {
      showNotification('No conversation found to capture', 'error')
      return
    }

    const projectContext = detectProjectContext(conversation)
    const markdown = formatAsMarkdown(conversation)

    // Store in chrome.storage for popup to access
    await chrome.storage.local.set({
      pendingCapture: {
        conversation,
        markdown,
        projectContext,
        timestamp: Date.now(),
      },
    })

    // Open popup or show inline UI
    showCaptureUI(conversation, projectContext)

    showNotification(`Captured ${conversation.messages.length} messages`, 'success')
  } catch (error) {
    console.error('[Dreamcatcher] Capture error:', error)
    showNotification('Failed to capture conversation', 'error')
  } finally {
    button.disabled = false
    button.innerHTML = `
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/>
        <polyline points="17 21 17 13 7 13 7 21"/>
        <polyline points="7 3 7 8 15 8"/>
      </svg>
      Save to Dreamcatcher
    `
  }
}

/**
 * Show inline capture UI
 */
function showCaptureUI(conversation, projectContext) {
  // Remove existing UI if present
  const existing = document.getElementById('dreamcatcher-capture-ui')
  if (existing) existing.remove()

  const ui = document.createElement('div')
  ui.id = 'dreamcatcher-capture-ui'
  ui.className = 'dreamcatcher-capture-modal'
  ui.innerHTML = `
    <div class="dreamcatcher-modal-content">
      <div class="dreamcatcher-modal-header">
        <h3>💭 Save to Dreamcatcher</h3>
        <button class="dreamcatcher-close-btn" onclick="this.closest('.dreamcatcher-capture-modal').remove()">×</button>
      </div>

      <div class="dreamcatcher-modal-body">
        <div class="capture-summary">
          <p><strong>Captured:</strong> ${conversation.messages.length} messages from ${conversation.platform}</p>
          ${projectContext.detected ? `<p><strong>Detected:</strong> ${projectContext.context} project</p>` : ''}
        </div>

        <div class="form-group">
          <label for="dream-select">Add to Dream:</label>
          <select id="dream-select" class="dreamcatcher-select">
            <option value="new">+ Create New Dream</option>
            <!-- Dreams will be populated from storage -->
          </select>
        </div>

        <div id="new-dream-fields" style="display: none;">
          <div class="form-group">
            <label for="dream-title">Dream Title:</label>
            <input type="text" id="dream-title" class="dreamcatcher-input"
                   value="${conversation.title}" placeholder="My new dream...">
          </div>

          <div class="form-group">
            <label for="dream-tags">Tags (comma-separated):</label>
            <input type="text" id="dream-tags" class="dreamcatcher-input"
                   placeholder="ai, chatgpt, ${projectContext.context || 'project'}">
          </div>
        </div>

        <div class="form-group">
          <label for="fragment-title">Fragment Title:</label>
          <input type="text" id="fragment-title" class="dreamcatcher-input"
                 value="${conversation.platform} Conversation" placeholder="Fragment title...">
        </div>

        <div class="form-actions">
          <button id="save-online-btn" class="dreamcatcher-btn dreamcatcher-btn-primary">
            Save Online
          </button>
          <button id="save-offline-btn" class="dreamcatcher-btn dreamcatcher-btn-secondary">
            Save Offline
          </button>
          <button onclick="this.closest('.dreamcatcher-capture-modal').remove()"
                  class="dreamcatcher-btn dreamcatcher-btn-ghost">
            Cancel
          </button>
        </div>
      </div>
    </div>
  `

  document.body.appendChild(ui)

  // Setup event listeners
  document.getElementById('dream-select').addEventListener('change', e => {
    const newDreamFields = document.getElementById('new-dream-fields')
    newDreamFields.style.display = e.target.value === 'new' ? 'block' : 'none'
  })

  document
    .getElementById('save-online-btn')
    .addEventListener('click', () => handleSaveOnline(conversation))
  document
    .getElementById('save-offline-btn')
    .addEventListener('click', () => handleSaveOffline(conversation))

  // Load existing dreams
  loadDreamsToSelect()
}

/**
 * Load existing dreams into select dropdown
 */
async function loadDreamsToSelect() {
  try {
    const { dreams } = await chrome.storage.local.get(['dreams'])
    const select = document.getElementById('dream-select')

    if (dreams && dreams.length > 0) {
      dreams.forEach(dream => {
        const option = document.createElement('option')
        option.value = dream.id
        option.textContent = dream.title
        select.appendChild(option)
      })
    }
  } catch (error) {
    console.error('[Dreamcatcher] Failed to load dreams:', error)
  }
}

/**
 * Save conversation online (requires auth)
 */
async function handleSaveOnline(conversation) {
  const dreamSelect = document.getElementById('dream-select').value
  const dreamTitle = document.getElementById('dream-title').value
  const dreamTags = document.getElementById('dream-tags').value
  const fragmentTitle = document.getElementById('fragment-title').value

  // Get auth token from storage
  const { authToken } = await chrome.storage.local.get(['authToken'])

  if (!authToken) {
    showNotification('Please log in to Dreamcatcher first', 'error')
    return
  }

  try {
    const markdown = formatAsMarkdown(conversation)

    // Create new dream if needed
    let dreamId = dreamSelect
    if (dreamSelect === 'new') {
      const dreamResponse = await fetch('https://api.dreamcatcher.app/dreams', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${authToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: dreamTitle,
          tags: dreamTags.split(',').map(t => t.trim()),
          status: 'in-progress',
        }),
      })

      const dream = await dreamResponse.json()
      dreamId = dream.id
    }

    // Create fragment
    await fetch(`https://api.dreamcatcher.app/dreams/${dreamId}/fragments`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${authToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title: fragmentTitle,
        content: markdown,
        type: 'conversation',
        metadata: {
          platform: conversation.platform,
          messageCount: conversation.messages.length,
          sourceUrl: conversation.url,
        },
      }),
    })

    showNotification('✅ Saved to Dreamcatcher!', 'success')
    document.getElementById('dreamcatcher-capture-ui').remove()
  } catch (error) {
    console.error('[Dreamcatcher] Save error:', error)
    showNotification('Failed to save online. Try offline mode.', 'error')
  }
}

/**
 * Save conversation offline (for sync later)
 */
async function handleSaveOffline(conversation) {
  try {
    const { offlineQueue = [] } = await chrome.storage.local.get(['offlineQueue'])

    const dreamTitle = document.getElementById('dream-title').value
    const dreamTags = document.getElementById('dream-tags').value
    const fragmentTitle = document.getElementById('fragment-title').value
    const markdown = formatAsMarkdown(conversation)

    offlineQueue.push({
      id: `offline-${Date.now()}`,
      conversation,
      markdown,
      dreamTitle,
      dreamTags: dreamTags.split(',').map(t => t.trim()),
      fragmentTitle,
      timestamp: Date.now(),
    })

    await chrome.storage.local.set({ offlineQueue })

    showNotification(`✅ Saved offline (${offlineQueue.length} pending)`, 'success')
    document.getElementById('dreamcatcher-capture-ui').remove()
  } catch (error) {
    console.error('[Dreamcatcher] Offline save error:', error)
    showNotification('Failed to save offline', 'error')
  }
}

/**
 * Show notification
 */
function showNotification(message, type = 'info') {
  const notification = document.createElement('div')
  notification.className = `dreamcatcher-notification dreamcatcher-notification-${type}`
  notification.textContent = message
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    padding: 12px 20px;
    border-radius: 8px;
    background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6'};
    color: white;
    font-weight: 500;
    z-index: 10001;
    animation: slideIn 0.3s ease-out;
  `

  document.body.appendChild(notification)

  setTimeout(() => {
    notification.style.animation = 'slideOut 0.3s ease-out'
    setTimeout(() => notification.remove(), 300)
  }, 3000)
}

/**
 * Monitor for new messages and update capture button
 */
let lastMessageCount = 0

function monitorConversation() {
  const conversation = extractConversation()
  if (conversation && conversation.messages.length !== lastMessageCount) {
    lastMessageCount = conversation.messages.length

    const button = document.getElementById('dreamcatcher-capture-btn')
    if (button) {
      // Pulse animation to indicate new content
      button.style.animation = 'pulse 0.5s ease-out'
      setTimeout(() => (button.style.animation = ''), 500)
    }
  }
}

// Initialize
function init() {
  addCaptureButton()

  // Monitor for new messages
  setInterval(monitorConversation, 2000)

  // Listen for messages from popup
  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'extractConversation') {
      const conversation = extractConversation()
      sendResponse({ conversation })
    }
  })
}

// Wait for page to be fully loaded
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init)
} else {
  init()
}
