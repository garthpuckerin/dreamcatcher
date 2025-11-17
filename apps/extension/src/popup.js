/**
 * Popup Script
 * Handles the extension popup UI and interactions
 */

// State
let authToken = null;
let currentUser = null;
let offlineQueue = [];

/**
 * Initialize popup
 */
async function init() {
  // Load auth state
  const storage = await chrome.storage.local.get(['authToken', 'currentUser', 'offlineQueue']);
  authToken = storage.authToken;
  currentUser = storage.currentUser;
  offlineQueue = storage.offlineQueue || [];

  // Show appropriate section
  if (authToken) {
    document.getElementById('auth-section').style.display = 'none';
    document.getElementById('main-section').style.display = 'block';
    await loadMainSection();
  } else {
    document.getElementById('auth-section').style.display = 'block';
    document.getElementById('main-section').style.display = 'none';
  }

  // Setup event listeners
  setupEventListeners();

  // Check connection status
  updateConnectionStatus();
}

/**
 * Setup event listeners
 */
function setupEventListeners() {
  // Auth
  document.getElementById('login-btn')?.addEventListener('click', handleLogin);
  document.getElementById('logout-link')?.addEventListener('click', handleLogout);

  // Actions
  document.getElementById('capture-btn')?.addEventListener('click', handleCapture);
  document.getElementById('quick-save-btn')?.addEventListener('click', handleQuickSave);
  document.getElementById('sync-btn')?.addEventListener('click', handleSync);

  // Enter key for login
  document.getElementById('password-input')?.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') handleLogin();
  });
}

/**
 * Handle login
 */
async function handleLogin() {
  const email = document.getElementById('email-input').value;
  const password = document.getElementById('password-input').value;

  if (!email || !password) {
    alert('Please enter email and password');
    return;
  }

  const loginBtn = document.getElementById('login-btn');
  loginBtn.disabled = true;
  loginBtn.innerHTML = '<span class="loading"></span>';

  try {
    const response = await fetch('https://api.dreamcatcher.app/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    if (!response.ok) {
      throw new Error('Login failed');
    }

    const data = await response.json();
    authToken = data.token;
    currentUser = data.user;

    // Save to storage
    await chrome.storage.local.set({
      authToken,
      currentUser
    });

    // Reload popup
    window.location.reload();

  } catch (error) {
    console.error('Login error:', error);
    alert('Login failed. Please check your credentials.');
  } finally {
    loginBtn.disabled = false;
    loginBtn.innerHTML = 'Login';
  }
}

/**
 * Handle logout
 */
async function handleLogout() {
  await chrome.storage.local.remove(['authToken', 'currentUser']);
  window.location.reload();
}

/**
 * Load main section data
 */
async function loadMainSection() {
  // Update queue status
  updateQueueStatus();

  // Load recent captures
  await loadRecentCaptures();
}

/**
 * Update connection status
 */
async function updateConnectionStatus() {
  const statusEl = document.getElementById('connection-status');
  if (!statusEl) return;

  const isOnline = navigator.onLine;
  const dot = statusEl.querySelector('.status-dot');
  const text = statusEl.querySelector('.status-text');

  if (isOnline && authToken) {
    dot.classList.remove('offline');
    text.textContent = 'Connected to Dreamcatcher';
  } else if (isOnline && !authToken) {
    dot.classList.add('offline');
    text.textContent = 'Not logged in';
  } else {
    dot.classList.add('offline');
    text.textContent = 'Offline mode';
  }
}

/**
 * Update offline queue status
 */
function updateQueueStatus() {
  const queueStatusEl = document.getElementById('queue-status');
  const syncBtn = document.getElementById('sync-btn');

  if (!queueStatusEl) return;

  const count = offlineQueue.length;

  if (count === 0) {
    queueStatusEl.className = 'queue-status empty';
    queueStatusEl.querySelector('.queue-count').textContent = '✓ All synced';
    syncBtn.disabled = true;
  } else {
    queueStatusEl.className = 'queue-status';
    queueStatusEl.querySelector('.queue-count').textContent = `${count} item${count !== 1 ? 's' : ''} pending`;
    syncBtn.disabled = !navigator.onLine;
  }
}

/**
 * Load recent captures
 */
async function loadRecentCaptures() {
  const container = document.getElementById('recent-captures');
  if (!container) return;

  try {
    // Try to fetch from server
    if (authToken && navigator.onLine) {
      const response = await fetch('https://api.dreamcatcher.app/fragments?limit=5', {
        headers: { 'Authorization': `Bearer ${authToken}` }
      });

      if (response.ok) {
        const fragments = await response.json();

        if (fragments.length === 0) {
          container.innerHTML = `
            <div class="empty-state">
              <div class="empty-state-icon">💭</div>
              <div class="empty-state-text">
                No captures yet.<br>
                Visit ChatGPT or Claude to start capturing!
              </div>
            </div>
          `;
        } else {
          container.innerHTML = fragments.map(fragment => `
            <div class="capture-item" data-id="${fragment.id}">
              <div class="capture-title">${escapeHtml(fragment.title)}</div>
              <div class="capture-meta">
                ${formatDate(fragment.created_at)} ·
                ${fragment.metadata?.platform || 'Unknown source'}
              </div>
            </div>
          `).join('');

          // Add click listeners
          container.querySelectorAll('.capture-item').forEach(item => {
            item.addEventListener('click', () => {
              const fragmentId = item.dataset.id;
              chrome.tabs.create({
                url: `https://dreamcatcher.app/fragments/${fragmentId}`
              });
            });
          });
        }
      }
    } else {
      // Show offline queue items
      if (offlineQueue.length > 0) {
        container.innerHTML = offlineQueue.slice(-5).reverse().map(item => `
          <div class="capture-item">
            <div class="capture-title">
              ${escapeHtml(item.fragmentTitle || item.conversation?.title || 'Untitled')}
            </div>
            <div class="capture-meta">
              ${formatDate(new Date(item.timestamp))} ·
              ${item.conversation?.platform || 'Selection'} ·
              ⏳ Pending sync
            </div>
          </div>
        `).join('');
      }
    }

  } catch (error) {
    console.error('Failed to load recent captures:', error);
  }
}

/**
 * Handle capture current conversation
 */
async function handleCapture() {
  const captureBtn = document.getElementById('capture-btn');
  captureBtn.disabled = true;
  captureBtn.innerHTML = '<span class="loading"></span> Capturing...';

  try {
    // Get current tab
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

    // Check if it's a supported platform
    if (!tab.url.includes('chat.openai.com') &&
        !tab.url.includes('claude.ai') &&
        !tab.url.includes('chat.anthropic.com')) {
      alert('Please navigate to ChatGPT or Claude to capture conversations');
      return;
    }

    // Send message to content script
    const response = await chrome.tabs.sendMessage(tab.id, {
      action: 'extractConversation'
    });

    if (response && response.conversation) {
      // Store for popup access
      await chrome.storage.local.set({
        pendingCapture: {
          conversation: response.conversation,
          timestamp: Date.now()
        }
      });

      alert(`Captured ${response.conversation.messages.length} messages!\nClick the button on the page to save.`);
    } else {
      alert('No conversation found on this page');
    }

  } catch (error) {
    console.error('Capture error:', error);
    alert('Failed to capture. Make sure you\'re on a ChatGPT or Claude page.');
  } finally {
    captureBtn.disabled = false;
    captureBtn.innerHTML = '📸 Capture Current Conversation';
  }
}

/**
 * Handle quick save selection
 */
async function handleQuickSave() {
  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

    // Execute script to get selected text
    const [result] = await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      function: () => window.getSelection().toString()
    });

    if (!result.result) {
      alert('Please select some text first');
      return;
    }

    // Add to offline queue
    const { offlineQueue = [] } = await chrome.storage.local.get(['offlineQueue']);

    offlineQueue.push({
      id: `selection-${Date.now()}`,
      type: 'selection',
      content: result.result,
      sourceUrl: tab.url,
      sourceTitle: tab.title,
      timestamp: Date.now()
    });

    await chrome.storage.local.set({ offlineQueue });

    alert('Selection saved! Sync to add to a dream.');
    await loadMainSection();

  } catch (error) {
    console.error('Quick save error:', error);
    alert('Failed to save selection');
  }
}

/**
 * Handle sync offline queue
 */
async function handleSync() {
  const syncBtn = document.getElementById('sync-btn');
  syncBtn.disabled = true;
  syncBtn.innerHTML = '<span class="loading"></span> Syncing...';

  try {
    const response = await chrome.runtime.sendMessage({ action: 'syncNow' });

    if (response.success) {
      // Reload data
      const storage = await chrome.storage.local.get(['offlineQueue']);
      offlineQueue = storage.offlineQueue || [];

      updateQueueStatus();
      await loadRecentCaptures();

      if (offlineQueue.length === 0) {
        alert('All items synced successfully!');
      } else {
        alert(`Some items synced. ${offlineQueue.length} remaining.`);
      }
    } else {
      alert('Sync failed: ' + response.error);
    }

  } catch (error) {
    console.error('Sync error:', error);
    alert('Sync failed. Please try again.');
  } finally {
    syncBtn.disabled = false;
    syncBtn.innerHTML = 'Sync Now';
  }
}

/**
 * Utility: Escape HTML
 */
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

/**
 * Utility: Format date
 */
function formatDate(date) {
  const d = new Date(date);
  const now = new Date();
  const diff = now - d;
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;
  return d.toLocaleDateString();
}

// Initialize when popup opens
document.addEventListener('DOMContentLoaded', init);

// Update connection status periodically
setInterval(updateConnectionStatus, 5000);
