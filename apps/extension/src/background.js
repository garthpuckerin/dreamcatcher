/**
 * Background Service Worker
 *
 * Handles:
 * - Extension installation
 * - Periodic offline queue sync
 * - Context menu actions
 * - Keyboard shortcuts
 */

// Installation handler
chrome.runtime.onInstalled.addListener(details => {
  console.log('[Dreamcatcher] Extension installed/updated', details.reason)

  if (details.reason === 'install') {
    // First-time installation
    chrome.storage.local.set({
      settings: {
        autoCapture: false,
        syncInterval: 30, // minutes
        defaultDreamId: null,
      },
      offlineQueue: [],
      dreams: [],
    })

    // Open welcome page
    chrome.tabs.create({
      url: 'https://dreamcatcher.app/extension/welcome',
    })
  }

  // Create context menu
  createContextMenu()
})

/**
 * Create right-click context menu
 */
function createContextMenu() {
  chrome.contextMenus.removeAll(() => {
    chrome.contextMenus.create({
      id: 'save-selection',
      title: 'Save to Dreamcatcher',
      contexts: ['selection'],
    })

    chrome.contextMenus.create({
      id: 'capture-conversation',
      title: 'Capture Conversation',
      contexts: ['page'],
      documentUrlPatterns: [
        'https://chat.openai.com/*',
        'https://claude.ai/*',
        'https://chat.anthropic.com/*',
      ],
    })
  })
}

/**
 * Handle context menu clicks
 */
chrome.contextMenus.onClicked.addListener(async (info, tab) => {
  if (info.menuItemId === 'save-selection') {
    await handleSaveSelection(info.selectionText, tab)
  } else if (info.menuItemId === 'capture-conversation') {
    await handleCaptureConversation(tab)
  }
})

/**
 * Save selected text as fragment
 */
async function handleSaveSelection(text, tab) {
  try {
    const { offlineQueue = [] } = await chrome.storage.local.get(['offlineQueue'])

    offlineQueue.push({
      id: `selection-${Date.now()}`,
      type: 'selection',
      content: text,
      sourceUrl: tab.url,
      sourceTitle: tab.title,
      timestamp: Date.now(),
    })

    await chrome.storage.local.set({ offlineQueue })

    // Show notification
    chrome.notifications.create({
      type: 'basic',
      iconUrl: 'icons/icon48.png',
      title: 'Dreamcatcher',
      message: 'Selection saved! Open extension to organize.',
    })
  } catch (error) {
    console.error('[Dreamcatcher] Failed to save selection:', error)
  }
}

/**
 * Trigger conversation capture
 */
async function handleCaptureConversation(tab) {
  try {
    const response = await chrome.tabs.sendMessage(tab.id, {
      action: 'extractConversation',
    })

    if (response && response.conversation) {
      await chrome.storage.local.set({
        pendingCapture: {
          conversation: response.conversation,
          timestamp: Date.now(),
        },
      })

      // Open popup
      chrome.action.openPopup()
    }
  } catch (error) {
    console.error('[Dreamcatcher] Failed to capture conversation:', error)
  }
}

/**
 * Keyboard shortcuts
 */
chrome.commands.onCommand.addListener(async command => {
  if (command === 'quick-capture') {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true })
    await handleCaptureConversation(tab)
  }
})

/**
 * Periodic offline queue sync
 */
async function syncOfflineQueue() {
  try {
    const { authToken, offlineQueue = [] } = await chrome.storage.local.get([
      'authToken',
      'offlineQueue',
    ])

    if (!authToken || offlineQueue.length === 0) {
      return
    }

    console.log(`[Dreamcatcher] Syncing ${offlineQueue.length} offline items...`)

    const syncedIds = []

    for (const item of offlineQueue) {
      try {
        // Attempt to sync item
        if (item.type === 'selection') {
          await syncSelection(item, authToken)
        } else {
          await syncConversation(item, authToken)
        }

        syncedIds.push(item.id)
      } catch (error) {
        console.error('[Dreamcatcher] Failed to sync item:', item.id, error)
        // Keep in queue for next sync attempt
      }
    }

    // Remove synced items from queue
    if (syncedIds.length > 0) {
      const remainingQueue = offlineQueue.filter(item => !syncedIds.includes(item.id))
      await chrome.storage.local.set({ offlineQueue: remainingQueue })

      chrome.notifications.create({
        type: 'basic',
        iconUrl: 'icons/icon48.png',
        title: 'Dreamcatcher Sync',
        message: `Synced ${syncedIds.length} items. ${remainingQueue.length} remaining.`,
      })
    }
  } catch (error) {
    console.error('[Dreamcatcher] Sync error:', error)
  }
}

/**
 * Sync selection to server
 */
async function syncSelection(item, authToken) {
  const response = await fetch('https://api.dreamcatcher.app/fragments', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${authToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      type: 'snippet',
      content: item.content,
      metadata: {
        sourceUrl: item.sourceUrl,
        sourceTitle: item.sourceTitle,
      },
    }),
  })

  if (!response.ok) {
    throw new Error(`Sync failed: ${response.status}`)
  }

  return response.json()
}

/**
 * Sync conversation to server
 */
async function syncConversation(item, authToken) {
  // Create dream if needed
  let dreamId = item.dreamId

  if (!dreamId) {
    const dreamResponse = await fetch('https://api.dreamcatcher.app/dreams', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${authToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title: item.dreamTitle,
        tags: item.dreamTags,
        status: 'in-progress',
      }),
    })

    if (!dreamResponse.ok) {
      throw new Error(`Dream creation failed: ${dreamResponse.status}`)
    }

    const dream = await dreamResponse.json()
    dreamId = dream.id
  }

  // Create fragment
  const fragmentResponse = await fetch(`https://api.dreamcatcher.app/dreams/${dreamId}/fragments`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${authToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      title: item.fragmentTitle,
      content: item.markdown,
      type: 'conversation',
      metadata: {
        platform: item.conversation.platform,
        messageCount: item.conversation.messages.length,
        sourceUrl: item.conversation.url,
      },
    }),
  })

  if (!fragmentResponse.ok) {
    throw new Error(`Fragment creation failed: ${fragmentResponse.status}`)
  }

  return fragmentResponse.json()
}

/**
 * Set up periodic sync alarm
 */
chrome.alarms.create('syncOfflineQueue', {
  periodInMinutes: 30,
})

chrome.alarms.onAlarm.addListener(alarm => {
  if (alarm.name === 'syncOfflineQueue') {
    syncOfflineQueue()
  }
})

/**
 * Listen for network status changes
 */
chrome.runtime.onConnect.addListener(() => {
  // When popup opens, trigger sync if online
  if (navigator.onLine) {
    syncOfflineQueue()
  }
})

/**
 * Message handler
 */
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'syncNow') {
    syncOfflineQueue()
      .then(() => {
        sendResponse({ success: true })
      })
      .catch(error => {
        sendResponse({ success: false, error: error.message })
      })
    return true // Keep channel open for async response
  }

  if (message.action === 'getQueueStatus') {
    chrome.storage.local.get(['offlineQueue'], ({ offlineQueue = [] }) => {
      sendResponse({ count: offlineQueue.length })
    })
    return true
  }
})

console.log('[Dreamcatcher] Background service worker ready')
