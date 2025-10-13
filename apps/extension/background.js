// background.js - PipelineOS Integration Version
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'capture') {
    captureFragment(request.data).then(() => {
      sendResponse({ success: true });
    }).catch((error) => {
      console.error('Capture error:', error);
      sendResponse({ success: false, error: error.message });
    });
    return true;
  }

  if (request.action === 'syncWithPipelineOS') {
    syncWithPipelineOS().then(() => {
      sendResponse({ success: true });
    }).catch((error) => {
      console.error('Sync error:', error);
      sendResponse({ success: false, error: error.message });
    });
    return true;
  }

  if (request.action === 'showNotification') {
    showNotification(request.message, request.type);
    sendResponse({ success: true });
    return true;
  }
});

// Capture fragment and store locally
async function captureFragment(fragmentData) {
  try {
    const result = await chrome.storage.local.get(['dreams']);
    const dreams = result.dreams || [];
    
    // Find existing dream or create new one
    let dream = dreams.find(d => d.title === fragmentData.dreamName);
    
    if (!dream) {
      dream = {
        id: generateId(),
        title: fragmentData.dreamName,
        description: `Captured from ${fragmentData.source}`,
        status: 'idea',
        tags: ['browser-capture', fragmentData.source],
        created: new Date().toISOString(),
        updated: new Date().toISOString(),
        fragments: [],
        syncedWithPipelineOS: false
      };
      dreams.push(dream);
    }
    
    // Add fragment
    const fragment = {
      id: generateId(),
      title: fragmentData.fragmentTitle,
      content: fragmentData.content,
      source: fragmentData.source,
      url: fragmentData.url,
      date: new Date().toISOString(),
      features: fragmentData.features || [],
      codeSnippets: fragmentData.codeSnippets || []
    };
    
    dream.fragments.push(fragment);
    dream.updated = new Date().toISOString();
    
    // Update storage
    await chrome.storage.local.set({ dreams });
    
    // Update badge
    updateBadge(dreams.length);
    
    console.log('Fragment captured:', fragment);
    
  } catch (error) {
    console.error('Failed to capture fragment:', error);
    throw error;
  }
}

// Sync local dreams with PipelineOS
async function syncWithPipelineOS() {
  const result = await chrome.storage.local.get(['dreams', 'pipelineOSConfig']);
  const dreams = result.dreams || [];
  const config = result.pipelineOSConfig;

  if (!config || !config.enabled) {
    throw new Error('PipelineOS not configured');
  }

  for (const dream of dreams) {
    if (!dream.syncedWithPipelineOS) {
      try {
        await sendDreamToPipelineOS(dream, config);
        dream.syncedWithPipelineOS = true;
        dream.syncedAt = new Date().toISOString();
      } catch (error) {
        console.error(`Failed to sync dream ${dream.id}:`, error);
      }
    }
  }

  // Update storage
  await chrome.storage.local.set({ dreams });
}

// Send individual dream to PipelineOS
async function sendDreamToPipelineOS(dream, config) {
  const payload = {
    dream: {
      id: dream.id,
      title: dream.title,
      description: dream.description,
      status: dream.status,
      tags: dream.tags,
      created: dream.created,
      updated: dream.updated,
      fragments: dream.fragments
    }
  };

  const response = await fetch(`${config.apiUrl}/api/v1/dreamcatcher/import`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${config.apiKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    throw new Error(`PipelineOS API error: ${response.status}`);
  }

  return await response.json();
}

// Update extension badge
function updateBadge(count) {
  chrome.action.setBadgeText({ text: count.toString() });
  chrome.action.setBadgeBackgroundColor({ color: '#3B82F6' });
}

// Generate unique ID
function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

// Show notification
function showNotification(message, type) {
  chrome.notifications.create({
    type: 'basic',
    iconUrl: 'icons/icon48.png',
    title: 'Dreamcatcher',
    message: message
  });
}

// Initialize extension
chrome.runtime.onInstalled.addListener(() => {
  console.log('Dreamcatcher extension installed');
  
  // Set default configuration
  chrome.storage.local.set({
    dreams: [],
    pipelineOSConfig: {
      enabled: false,
      apiUrl: '',
      apiKey: ''
    }
  });
});

// Handle extension startup
chrome.runtime.onStartup.addListener(() => {
  console.log('Dreamcatcher extension started');
});

// Handle tab updates
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && tab.url) {
    // Check if tab is on supported platform
    if (tab.url.includes('chat.openai.com') || tab.url.includes('claude.ai')) {
      chrome.action.enable(tabId);
    } else {
      chrome.action.disable(tabId);
    }
  }
});

// Handle storage changes
chrome.storage.onChanged.addListener((changes, namespace) => {
  if (namespace === 'local' && changes.dreams) {
    const dreams = changes.dreams.newValue || [];
    updateBadge(dreams.length);
  }
});

// Handle extension icon click
chrome.action.onClicked.addListener((tab) => {
  // This will be handled by the popup if it exists
  // Otherwise, we can inject content script
  if (tab.url.includes('chat.openai.com') || tab.url.includes('claude.ai')) {
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      function: () => {
        // Trigger capture modal
        const event = new CustomEvent('dreamcatcher:openModal');
        document.dispatchEvent(event);
      }
    });
  }
});

// Handle context menu
chrome.contextMenus.create({
  id: 'captureConversation',
  title: 'Capture Conversation',
  contexts: ['page'],
  documentUrlPatterns: [
    'https://chat.openai.com/*',
    'https://claude.ai/*'
  ]
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === 'captureConversation') {
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      function: () => {
        // Trigger capture modal
        const event = new CustomEvent('dreamcatcher:openModal');
        document.dispatchEvent(event);
      }
    });
  }
});

// Handle alarms for periodic sync
chrome.alarms.create('syncWithPipelineOS', { periodInMinutes: 30 });

chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === 'syncWithPipelineOS') {
    syncWithPipelineOS().catch(error => {
      console.error('Periodic sync failed:', error);
    });
  }
});

// Export functions for testing
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    captureFragment,
    syncWithPipelineOS,
    sendDreamToPipelineOS,
    generateId
  };
}
