// content.js - PipelineOS Integration Version
;(function () {
  'use strict'

  let captureButton = null
  let selectedText = ''
  let isCapturing = false
  let currentModal = null
  let pipelineOSConfig = null

  // Initialize PipelineOS connection
  async function initializePipelineOS() {
    try {
      const result = await chrome.storage.local.get(['pipelineOSConfig'])
      pipelineOSConfig = result.pipelineOSConfig

      if (pipelineOSConfig && pipelineOSConfig.enabled) {
        console.log('🔗 PipelineOS integration enabled')
        updateUIForPipelineOS()
      } else {
        console.log('📝 Standalone Dreamcatcher mode')
        updateUIForStandalone()
      }
    } catch (error) {
      console.error('Failed to initialize PipelineOS:', error)
    }
  }

  // Update UI based on mode
  function updateUIForPipelineOS() {
    if (captureButton) {
      captureButton.innerHTML = `
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>
        </svg>
        <span>PipelineOS</span>
      `
    }
  }

  function updateUIForStandalone() {
    if (captureButton) {
      captureButton.innerHTML = `
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>
        </svg>
        <span>Dreamcatcher</span>
      `
    }
  }

  // Enhanced capture modal for PipelineOS
  function openCaptureModal() {
    if (currentModal) return

    const modal = document.createElement('div')
    modal.className = 'dreamcatcher-modal-overlay'
    modal.innerHTML = `
      <div class="dreamcatcher-modal">
        <div class="dreamcatcher-modal-header">
          <h3>${pipelineOSConfig ? 'PipelineOS Capture' : 'Dreamcatcher Capture'}</h3>
          <button class="dreamcatcher-modal-close">&times;</button>
        </div>
        <div class="dreamcatcher-modal-body">
          <div class="dreamcatcher-capture-options">
            <label>
              <input type="radio" name="captureMode" value="all" checked>
              <span>Full Conversation</span>
            </label>
            <label>
              <input type="radio" name="captureMode" value="last5">
              <span>Last 5 Messages</span>
            </label>
            <label>
              <input type="radio" name="captureMode" value="selected">
              <span>Selected Text</span>
            </label>
          </div>
          
          <div class="dreamcatcher-project-section">
            <label for="projectName">Project Name:</label>
            <input type="text" id="projectName" placeholder="Auto-detected project name">
          </div>

          ${
            pipelineOSConfig
              ? `
            <div class="dreamcatcher-pipelineos-section">
              <label>
                <input type="checkbox" id="sendToPipelineOS" checked>
                <span>Send to PipelineOS for implementation</span>
              </label>
              <div class="dreamcatcher-pipelineos-options">
                <label>
                  <input type="checkbox" id="createProject" checked>
                  <span>Create new project</span>
                </label>
                <label>
                  <input type="checkbox" id="createTickets" checked>
                  <span>Create tickets from conversation</span>
                </label>
                <label>
                  <input type="checkbox" id="assignAgents" checked>
                  <span>Assign AI agents</span>
                </label>
              </div>
            </div>
          `
              : ''
          }

          <div class="dreamcatcher-actions">
            <button class="dreamcatcher-btn dreamcatcher-btn-cancel">Cancel</button>
            <button class="dreamcatcher-btn dreamcatcher-btn-capture">
              ${pipelineOSConfig ? 'Capture & Send to PipelineOS' : 'Capture Dream'}
            </button>
          </div>
        </div>
      </div>
    `

    // Event listeners
    modal.querySelector('.dreamcatcher-modal-close').addEventListener('click', closeModal)
    modal.querySelector('.dreamcatcher-btn-cancel').addEventListener('click', closeModal)
    modal.querySelector('.dreamcatcher-btn-capture').addEventListener('click', handleCapture)

    document.body.appendChild(modal)
    currentModal = modal

    // Auto-detect project name
    autoDetectProjectName()
  }

  // Auto-detect project name from conversation
  function autoDetectProjectName() {
    const projectNameInput = document.getElementById('projectName')
    if (!projectNameInput) return

    const conversation = extractConversation('all')
    const projectName = detectProjectName(conversation)

    if (projectName) {
      projectNameInput.value = projectName
    }
  }

  // Enhanced capture handler
  async function handleCapture() {
    const captureMode = document.querySelector('input[name="captureMode"]:checked').value
    const projectName = document.getElementById('projectName').value

    if (!projectName.trim()) {
      alert('Please enter a project name')
      return
    }

    const conversation = extractConversation(captureMode)
    const fragmentData = {
      dreamName: projectName,
      fragmentTitle: generateFragmentTitle(conversation),
      content: conversation,
      source: platform,
      url: window.location.href,
      mode: captureMode,
    }

    try {
      if (pipelineOSConfig && document.getElementById('sendToPipelineOS').checked) {
        // Send to PipelineOS
        await sendToPipelineOS(fragmentData)
        showNotification('✅ Captured and sent to PipelineOS!', 'success')
      } else {
        // Local capture (standalone mode)
        await chrome.runtime.sendMessage({
          action: 'capture',
          data: fragmentData,
        })
        showNotification('✅ Dream captured!', 'success')
      }

      closeModal()
    } catch (error) {
      console.error('Capture error:', error)
      showNotification('❌ Capture failed: ' + error.message, 'error')
    }
  }

  // Send to PipelineOS
  async function sendToPipelineOS(data) {
    const pipelineOSOptions = {
      createProject: document.getElementById('createProject').checked,
      createTickets: document.getElementById('createTickets').checked,
      assignAgents: document.getElementById('assignAgents').checked,
    }

    const payload = {
      dream: {
        title: data.dreamName,
        description: 'Captured from ' + data.source,
        status: 'idea',
        tags: ['browser-capture', data.source],
        fragments: [
          {
            title: data.fragmentTitle,
            content: data.content,
            source: data.source,
            url: data.url,
            features: extractFeatures(data.content),
            codeSnippets: extractCodeSnippets(data.content),
          },
        ],
        pipelineOSOptions: pipelineOSOptions,
      },
    }

    const response = await fetch(`${pipelineOSConfig.apiUrl}/api/v1/dreamcatcher/import`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${pipelineOSConfig.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })

    if (!response.ok) {
      throw new Error(`PipelineOS API error: ${response.status}`)
    }

    return await response.json()
  }

  // Create floating capture button
  function createCaptureButton() {
    if (captureButton) return

    captureButton = document.createElement('div')
    captureButton.className = 'dreamcatcher-capture-button'
    captureButton.innerHTML = `
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>
      </svg>
      <span>Dreamcatcher</span>
    `

    captureButton.addEventListener('click', openCaptureModal)
    document.body.appendChild(captureButton)
  }

  // Close modal
  function closeModal() {
    if (currentModal) {
      currentModal.remove()
      currentModal = null
    }
  }

  // Extract conversation content
  function extractConversation(mode) {
    let content = ''

    if (mode === 'selected' && selectedText) {
      content = selectedText
    } else if (mode === 'last5') {
      content = extractLastMessages(5)
    } else {
      content = extractFullConversation()
    }

    return content
  }

  // Extract full conversation
  function extractFullConversation() {
    const messages = document.querySelectorAll('[data-message-id], .message, .conversation-turn')
    let conversation = ''

    messages.forEach(message => {
      const text = message.textContent.trim()
      if (text) {
        conversation += text + '\n\n'
      }
    })

    return conversation.trim()
  }

  // Extract last N messages
  function extractLastMessages(count) {
    const messages = document.querySelectorAll('[data-message-id], .message, .conversation-turn')
    const lastMessages = Array.from(messages).slice(-count)
    let conversation = ''

    lastMessages.forEach(message => {
      const text = message.textContent.trim()
      if (text) {
        conversation += text + '\n\n'
      }
    })

    return conversation.trim()
  }

  // Detect project name from conversation
  function detectProjectName(conversation) {
    // Simple project name detection
    const patterns = [
      /(?:create|build|develop|make)\s+(?:a\s+)?([a-zA-Z0-9\s-]+?)(?:\s+(?:app|website|tool|system|platform))/i,
      /(?:project|app|website|tool|system|platform)\s+(?:called|named|is)\s+([a-zA-Z0-9\s-]+)/i,
      /^([a-zA-Z0-9\s-]+?)(?:\s+(?:app|website|tool|system|platform))/i,
    ]

    for (const pattern of patterns) {
      const match = conversation.match(pattern)
      if (match && match[1]) {
        return match[1].trim()
      }
    }

    return ''
  }

  // Generate fragment title
  function generateFragmentTitle(conversation) {
    const lines = conversation.split('\n').filter(line => line.trim())
    if (lines.length > 0) {
      const firstLine = lines[0].trim()
      return firstLine.length > 50 ? firstLine.substring(0, 50) + '...' : firstLine
    }
    return 'Captured Conversation'
  }

  // Extract features from content
  function extractFeatures(content) {
    const features = []
    const featurePatterns = [
      /(?:feature|function|capability):\s*([^\n]+)/gi,
      /(?:should|needs? to|must)\s+([^\n]+)/gi,
      /(?:implement|add|create)\s+([^\n]+)/gi,
    ]

    featurePatterns.forEach(pattern => {
      const matches = content.matchAll(pattern)
      for (const match of matches) {
        if (match[1]) {
          features.push(match[1].trim())
        }
      }
    })

    return [...new Set(features)] // Remove duplicates
  }

  // Extract code snippets
  function extractCodeSnippets(content) {
    const codeSnippets = []
    const codePatterns = [/```[\s\S]*?```/g, /`[^`]+`/g, /<code>[\s\S]*?<\/code>/g]

    codePatterns.forEach(pattern => {
      const matches = content.matchAll(pattern)
      for (const match of matches) {
        if (match[0]) {
          codeSnippets.push(match[0].trim())
        }
      }
    })

    return [...new Set(codeSnippets)] // Remove duplicates
  }

  // Show notification
  function showNotification(message, type) {
    const notification = document.createElement('div')
    notification.className = `dreamcatcher-notification dreamcatcher-notification-${type}`
    notification.textContent = message

    document.body.appendChild(notification)

    setTimeout(() => {
      notification.remove()
    }, 3000)
  }

  // Detect platform
  const platform = window.location.hostname.includes('openai.com') ? 'chatgpt' : 'claude'

  // Initialize
  initializePipelineOS()
  createCaptureButton()

  // Handle text selection
  document.addEventListener('mouseup', () => {
    const selection = window.getSelection()
    selectedText = selection.toString().trim()
  })

  // Handle keyboard shortcuts
  document.addEventListener('keydown', e => {
    if (e.ctrlKey && e.shiftKey && e.key === 'C') {
      e.preventDefault()
      openCaptureModal()
    }
  })
})()
