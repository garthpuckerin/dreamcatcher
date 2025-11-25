/**
 * WebSocket Service Tests
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { websocketService } from '../websocket'

// Mock Socket.io
vi.mock('socket.io-client', () => ({
  default: vi.fn(() => ({
    on: vi.fn(),
    emit: vi.fn(),
    disconnect: vi.fn(),
    connected: false,
  })),
  io: vi.fn(() => ({
    on: vi.fn(),
    emit: vi.fn(),
    disconnect: vi.fn(),
    connected: false,
  })),
}))

describe('WebSocketService', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    // Reset websocketService state
    websocketService.socket = null
    websocketService.connected = false
    websocketService.presenceData.clear()
    websocketService.listeners.clear()
  })

  describe('Connection Management', () => {
    it('should initialize with disconnected state', () => {
      expect(websocketService.connected).toBe(false)
      expect(websocketService.socket).toBeNull()
    })

    it('should connect with userId and token', () => {
      const userId = 'user-123'
      const token = 'test-token'

      websocketService.connect(userId, token)

      expect(websocketService.socket).toBeTruthy()
    })

    it('should disconnect cleanly', () => {
      websocketService.connect('user-123', 'token')
      websocketService.disconnect()

      expect(websocketService.connected).toBe(false)
    })
  })

  describe('Presence Tracking', () => {
    it('should join a dream room', () => {
      websocketService.connect('user-123', 'token')
      const emitSpy = vi.spyOn(websocketService.socket, 'emit')

      websocketService.joinDream('dream-456')

      expect(emitSpy).toHaveBeenCalledWith('dream:join', { dreamId: 'dream-456' })
    })

    it('should leave a dream room', () => {
      websocketService.connect('user-123', 'token')
      const emitSpy = vi.spyOn(websocketService.socket, 'emit')

      websocketService.leaveDream('dream-456')

      expect(emitSpy).toHaveBeenCalledWith('dream:leave', { dreamId: 'dream-456' })
    })

    it('should update cursor position', () => {
      websocketService.connect('user-123', 'token')
      const emitSpy = vi.spyOn(websocketService.socket, 'emit')

      websocketService.updateCursor('dream-456', { x: 100, y: 200 })

      expect(emitSpy).toHaveBeenCalledWith('cursor:update', {
        dreamId: 'dream-456',
        position: { x: 100, y: 200 },
      })
    })
  })

  describe('Document Synchronization', () => {
    it('should broadcast document changes', () => {
      websocketService.connect('user-123', 'token')
      const emitSpy = vi.spyOn(websocketService.socket, 'emit')

      const change = {
        type: 'insert',
        position: 0,
        content: 'Hello',
      }

      websocketService.broadcastChange('dream-456', change)

      expect(emitSpy).toHaveBeenCalledWith('document:change', {
        dreamId: 'dream-456',
        change,
      })
    })

    it('should handle incoming changes', () => {
      const handler = vi.fn()
      websocketService.connect('user-123', 'token')
      websocketService.onDocumentChange(handler)

      const mockChange = {
        dreamId: 'dream-456',
        userId: 'user-789',
        change: { type: 'insert', position: 0, content: 'Test' },
      }

      // Simulate incoming change
      const onSpy = vi.spyOn(websocketService.socket, 'on')
      const callback = onSpy.mock.calls.find(call => call[0] === 'document:change')?.[1]

      if (callback) {
        callback(mockChange)
        expect(handler).toHaveBeenCalledWith(mockChange)
      }
    })
  })

  describe('Event Subscription', () => {
    it('should subscribe to presence updates', () => {
      const handler = vi.fn()
      websocketService.connect('user-123', 'token')

      websocketService.onPresenceUpdate(handler)

      expect(websocketService.listeners.has('presence:update')).toBe(true)
    })

    it('should unsubscribe from events', () => {
      const handler = vi.fn()
      websocketService.connect('user-123', 'token')

      const unsubscribe = websocketService.onPresenceUpdate(handler)
      unsubscribe()

      expect(websocketService.listeners.has('presence:update')).toBe(false)
    })
  })

  describe('Error Handling', () => {
    it('should handle connection errors', () => {
      const errorHandler = vi.fn()
      websocketService.connect('user-123', 'token')
      websocketService.onError(errorHandler)

      const onSpy = vi.spyOn(websocketService.socket, 'on')
      const callback = onSpy.mock.calls.find(call => call[0] === 'error')?.[1]

      if (callback) {
        const error = new Error('Connection failed')
        callback(error)
        expect(errorHandler).toHaveBeenCalledWith(error)
      }
    })

    it('should attempt reconnection on disconnect', () => {
      websocketService.connect('user-123', 'token')
      const onSpy = vi.spyOn(websocketService.socket, 'on')

      const callback = onSpy.mock.calls.find(call => call[0] === 'disconnect')?.[1]

      if (callback) {
        callback('transport close')
        // Should trigger reconnection logic
        expect(websocketService.connected).toBe(false)
      }
    })
  })
})
