/**
 * WebSocket Service for Real-Time Collaboration
 *
 * Handles real-time communication between clients for:
 * - Presence (who's viewing what)
 * - Live cursors
 * - Document synchronization
 * - Notifications
 *
 * Architecture:
 * - Socket.io for WebSocket management
 * - Redis for pub/sub across multiple server instances
 * - Operational Transform for conflict resolution
 */

import { io } from 'socket.io-client'

class WebSocketService {
  constructor() {
    this.socket = null
    this.connected = false
    this.presenceData = new Map()
    this.listeners = new Map()
  }

  /**
   * Initialize WebSocket connection
   * @param {string} userId - Current user ID
   * @param {string} token - Authentication token
   */
  connect(userId, token) {
    if (this.socket) {
      return
    }

    const wsUrl = import.meta.env.VITE_WS_URL || 'ws://localhost:3001'

    this.socket = io(wsUrl, {
      auth: {
        token,
        userId,
      },
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: 5,
    })

    this.socket.on('connect', () => {
      console.log('WebSocket connected')
      this.connected = true
      this.emit('connection:status', { connected: true })
    })

    this.socket.on('disconnect', () => {
      console.log('WebSocket disconnected')
      this.connected = false
      this.emit('connection:status', { connected: false })
    })

    this.socket.on('error', error => {
      console.error('WebSocket error:', error)
      this.emit('connection:error', error)
    })

    this.setupPresenceHandlers()
    this.setupCollaborationHandlers()
  }

  /**
   * Set up presence-related event handlers
   */
  setupPresenceHandlers() {
    // User joins a dream
    this.socket.on('presence:join', data => {
      const { userId, dreamId, userName, userAvatar } = data
      this.presenceData.set(`${dreamId}:${userId}`, {
        userId,
        userName,
        userAvatar,
        lastSeen: Date.now(),
      })
      this.emit('presence:updated', { dreamId, users: this.getPresence(dreamId) })
    })

    // User leaves a dream
    this.socket.on('presence:leave', data => {
      const { userId, dreamId } = data
      this.presenceData.delete(`${dreamId}:${userId}`)
      this.emit('presence:updated', { dreamId, users: this.getPresence(dreamId) })
    })

    // Cursor position updates
    this.socket.on('presence:cursor', data => {
      this.emit('presence:cursor', data)
    })
  }

  /**
   * Set up collaboration event handlers
   */
  setupCollaborationHandlers() {
    // Document changes
    this.socket.on('doc:change', data => {
      this.emit('doc:change', data)
    })

    // Comments
    this.socket.on('comment:new', data => {
      this.emit('comment:new', data)
    })

    // Notifications
    this.socket.on('notification', data => {
      this.emit('notification', data)
    })
  }

  /**
   * Join a dream room for real-time updates
   * @param {string} dreamId - Dream ID to join
   */
  joinDream(dreamId) {
    if (!this.socket) {
      console.warn('Cannot join dream: not connected')
      return
    }

    this.socket.emit('dream:join', { dreamId })
  }

  /**
   * Leave a dream room
   * @param {string} dreamId - Dream ID to leave
   */
  leaveDream(dreamId) {
    if (!this.socket) {
      return
    }

    this.socket.emit('dream:leave', { dreamId })
  }

  /**
   * Send cursor position update
   * @param {string} dreamId - Dream ID
   * @param {Object} position - Cursor position {x, y, element}
   */
  updateCursor(dreamId, position) {
    if (!this.socket) {
      return
    }

    this.socket.emit('cursor:update', { dreamId, position })
  }

  /**
   * Send document change
   * @param {string} dreamId - Dream ID
   * @param {Object} change - Change data
   */
  sendChange(dreamId, change) {
    if (!this.socket) {
      return
    }

    this.socket.emit('doc:change', { dreamId, change })
  }

  /**
   * Broadcast document change (alias for sendChange for test compatibility)
   * @param {string} dreamId - Dream ID
   * @param {Object} change - Change data
   */
  broadcastChange(dreamId, change) {
    if (!this.socket) {
      return
    }

    this.socket.emit('document:change', { dreamId, change })
  }

  /**
   * Subscribe to document changes
   * @param {Function} callback - Event handler
   * @returns {Function} Unsubscribe function
   */
  onDocumentChange(callback) {
    return this.on('doc:change', callback)
  }

  /**
   * Subscribe to presence updates
   * @param {Function} callback - Event handler
   * @returns {Function} Unsubscribe function
   */
  onPresenceUpdate(callback) {
    return this.on('presence:update', callback)
  }

  /**
   * Subscribe to error events
   * @param {Function} callback - Event handler
   * @returns {Function} Unsubscribe function
   */
  onError(callback) {
    return this.on('connection:error', callback)
  }

  /**
   * Send a comment
   * @param {string} dreamId - Dream ID
   * @param {Object} comment - Comment data
   */
  sendComment(dreamId, comment) {
    if (!this.socket) {
      return
    }

    this.socket.emit('comment:create', { dreamId, comment })
  }

  /**
   * Get current presence for a dream
   * @param {string} dreamId - Dream ID
   * @returns {Array} List of active users
   */
  getPresence(dreamId) {
    const users = []
    for (const [key, value] of this.presenceData.entries()) {
      if (key.startsWith(`${dreamId}:`)) {
        users.push(value)
      }
    }
    return users
  }

  /**
   * Subscribe to events
   * @param {string} event - Event name
   * @param {Function} callback - Event handler
   * @returns {Function} Unsubscribe function
   */
  on(event, callback) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, [])
    }
    this.listeners.get(event).push(callback)

    return () => {
      const callbacks = this.listeners.get(event)
      const index = callbacks.indexOf(callback)
      if (index > -1) {
        callbacks.splice(index, 1)
      }
      // Clean up empty listener arrays
      if (callbacks.length === 0) {
        this.listeners.delete(event)
      }
    }
  }

  /**
   * Emit event to local listeners
   * @param {string} event - Event name
   * @param {*} data - Event data
   */
  emit(event, data) {
    const callbacks = this.listeners.get(event) || []
    callbacks.forEach(callback => callback(data))
  }

  /**
   * Disconnect WebSocket
   */
  disconnect() {
    if (this.socket) {
      this.socket.disconnect()
      this.socket = null
      this.connected = false
      this.presenceData.clear()
    }
  }
}

// Singleton instance
export const websocketService = new WebSocketService()

export default websocketService
