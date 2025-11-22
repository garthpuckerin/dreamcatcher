/**
 * Versioning Service Tests
 */

import { describe, it, expect, beforeEach } from 'vitest'
import { versioningService } from '../versioning'

describe('VersioningService', () => {
  let mockDream

  beforeEach(() => {
    versioningService.snapshots = new Map()
    mockDream = {
      id: 'dream-123',
      title: 'Test Dream',
      description: 'A test dream',
      status: 'in-progress',
      tags: ['test'],
      user_id: 'user-456',
    }
  })

  describe('Snapshot Creation', () => {
    it('should create snapshot of dream', () => {
      const snapshot = versioningService.createSnapshot(mockDream, 'Initial version')

      expect(snapshot).toBeDefined()
      expect(snapshot.id).toContain('snapshot-')
      expect(snapshot.dreamId).toBe('dream-123')
      expect(snapshot.message).toBe('Initial version')
      expect(snapshot.data).toEqual(mockDream)
    })

    it('should store snapshot in history', () => {
      versioningService.createSnapshot(mockDream, 'V1')

      const history = versioningService.getHistory('dream-123')

      expect(history.length).toBe(1)
      expect(history[0].message).toBe('V1')
    })

    it('should create multiple snapshots', () => {
      versioningService.createSnapshot(mockDream, 'V1')

      mockDream.title = 'Updated Dream'
      versioningService.createSnapshot(mockDream, 'V2')

      mockDream.status = 'completed'
      versioningService.createSnapshot(mockDream, 'V3')

      const history = versioningService.getHistory('dream-123')

      expect(history.length).toBe(3)
      expect(history[0].message).toBe('V1')
      expect(history[2].message).toBe('V3')
    })

    it('should include timestamp in snapshot', () => {
      const before = new Date()
      const snapshot = versioningService.createSnapshot(mockDream)
      const after = new Date()

      const timestamp = new Date(snapshot.timestamp)

      expect(timestamp.getTime()).toBeGreaterThanOrEqual(before.getTime())
      expect(timestamp.getTime()).toBeLessThanOrEqual(after.getTime())
    })
  })

  describe('Dream Restoration', () => {
    it('should restore dream from snapshot', () => {
      const snapshot1 = versioningService.createSnapshot(mockDream, 'Original')

      mockDream.title = 'Modified Dream'
      mockDream.status = 'completed'
      versioningService.createSnapshot(mockDream, 'Modified')

      const restored = versioningService.restoreDream(snapshot1.id)

      expect(restored.title).toBe('Test Dream')
      expect(restored.status).toBe('in-progress')
      expect(restored.restoredFrom).toBe(snapshot1.id)
    })

    it('should add restoration metadata', () => {
      const snapshot = versioningService.createSnapshot(mockDream)
      const restored = versioningService.restoreDream(snapshot.id)

      expect(restored.restoredFrom).toBe(snapshot.id)
      expect(restored.restoredAt).toBeTruthy()
    })

    it('should throw error for non-existent snapshot', () => {
      expect(() => {
        versioningService.restoreDream('non-existent-snapshot')
      }).toThrow()
    })
  })

  describe('Diff Calculation', () => {
    it('should calculate differences between snapshots', () => {
      const snapshot1 = versioningService.createSnapshot(mockDream, 'V1')

      mockDream.title = 'Updated Title'
      mockDream.status = 'completed'
      const snapshot2 = versioningService.createSnapshot(mockDream, 'V2')

      const diff = versioningService.diff(snapshot1.id, snapshot2.id)

      expect(diff.changes.length).toBeGreaterThan(0)
      expect(diff.changes.some(c => c.field === 'title')).toBe(true)
      expect(diff.changes.some(c => c.field === 'status')).toBe(true)
    })

    it('should show before and after values', () => {
      const snapshot1 = versioningService.createSnapshot(mockDream)

      mockDream.title = 'New Title'
      const snapshot2 = versioningService.createSnapshot(mockDream)

      const diff = versioningService.diff(snapshot1.id, snapshot2.id)
      const titleChange = diff.changes.find(c => c.field === 'title')

      expect(titleChange.before).toBe('Test Dream')
      expect(titleChange.after).toBe('New Title')
    })

    it('should return empty changes for identical snapshots', () => {
      const snapshot1 = versioningService.createSnapshot(mockDream)
      const snapshot2 = versioningService.createSnapshot(mockDream)

      const diff = versioningService.diff(snapshot1.id, snapshot2.id)

      expect(diff.changes.length).toBe(0)
    })

    it('should handle complex object changes', () => {
      const snapshot1 = versioningService.createSnapshot(mockDream)

      mockDream.tags = ['test', 'updated']
      const snapshot2 = versioningService.createSnapshot(mockDream)

      const diff = versioningService.diff(snapshot1.id, snapshot2.id)
      const tagsChange = diff.changes.find(c => c.field === 'tags')

      expect(tagsChange).toBeDefined()
      expect(tagsChange.before).toEqual(['test'])
      expect(tagsChange.after).toEqual(['test', 'updated'])
    })
  })

  describe('Dream Branching', () => {
    it('should create branch from dream', () => {
      versioningService.createSnapshot(mockDream, 'Main version')

      const branch = versioningService.branchDream('dream-123', 'experimental-feature')

      expect(branch).toBeDefined()
      expect(branch.id).toContain('dream-123-branch-')
      expect(branch.branchName).toBe('experimental-feature')
      expect(branch.title).toBe(mockDream.title)
    })

    it('should preserve dream content in branch', () => {
      versioningService.createSnapshot(mockDream)

      const branch = versioningService.branchDream('dream-123', 'feature-a')

      expect(branch.title).toBe(mockDream.title)
      expect(branch.description).toBe(mockDream.description)
      expect(branch.status).toBe(mockDream.status)
    })

    it('should track branch source', () => {
      const snapshot = versioningService.createSnapshot(mockDream)
      const branch = versioningService.branchDream('dream-123', 'experiment')

      expect(branch.branchedFrom).toBe(snapshot.id)
    })

    it('should allow multiple branches', () => {
      versioningService.createSnapshot(mockDream)

      const branch1 = versioningService.branchDream('dream-123', 'feature-1')
      const branch2 = versioningService.branchDream('dream-123', 'feature-2')

      expect(branch1.id).not.toBe(branch2.id)
      expect(branch1.branchName).toBe('feature-1')
      expect(branch2.branchName).toBe('feature-2')
    })
  })

  describe('History Management', () => {
    it('should get complete history for dream', () => {
      versioningService.createSnapshot(mockDream, 'V1')
      mockDream.title = 'Updated'
      versioningService.createSnapshot(mockDream, 'V2')
      mockDream.status = 'completed'
      versioningService.createSnapshot(mockDream, 'V3')

      const history = versioningService.getHistory('dream-123')

      expect(history.length).toBe(3)
    })

    it('should sort history chronologically', () => {
      versioningService.createSnapshot(mockDream, 'First')
      setTimeout(() => {
        versioningService.createSnapshot(mockDream, 'Second')
      }, 10)

      const history = versioningService.getHistory('dream-123')

      expect(history[0].message).toBe('First')
      expect(history[history.length - 1].message).toBe('Second')
    })

    it('should return empty array for dream with no snapshots', () => {
      const history = versioningService.getHistory('non-existent-dream')

      expect(history).toEqual([])
    })
  })

  describe('Snapshot Retrieval', () => {
    it('should get snapshot by ID', () => {
      const snapshot = versioningService.createSnapshot(mockDream, 'Test snapshot')
      const retrieved = versioningService.getSnapshot(snapshot.id)

      expect(retrieved).toEqual(snapshot)
    })

    it('should throw error for non-existent snapshot', () => {
      expect(() => {
        versioningService.getSnapshot('invalid-id')
      }).toThrow()
    })
  })

  describe('Snapshot Deletion', () => {
    it('should delete snapshot', () => {
      const snapshot = versioningService.createSnapshot(mockDream)

      versioningService.deleteSnapshot(snapshot.id)

      const history = versioningService.getHistory('dream-123')
      expect(history.length).toBe(0)
    })

    it('should handle deletion of non-existent snapshot', () => {
      expect(() => {
        versioningService.deleteSnapshot('non-existent')
      }).not.toThrow()
    })
  })
})
