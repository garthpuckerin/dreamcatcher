/**
 * Version Control Service
 * Git-inspired versioning for dreams and ideas
 */

// Counter for unique IDs
let snapshotCounter = 0

class VersioningService {
  constructor() {
    this.snapshots = new Map()
  }

  // Generate unique ID
  generateUniqueId(prefix) {
    snapshotCounter++
    return `${prefix}-${Date.now()}-${snapshotCounter}-${Math.random().toString(36).substr(2, 9)}`
  }

  // Create snapshot of dream
  createSnapshot(dream, message = '') {
    const snapshot = {
      id: this.generateUniqueId('snapshot'),
      dreamId: dream.id,
      message: message || `Snapshot at ${new Date().toLocaleString()}`,
      timestamp: new Date().toISOString(),
      data: JSON.parse(JSON.stringify(dream)), // Deep clone
      author: dream.user_id || 'unknown',
    }

    if (!this.snapshots.has(dream.id)) {
      this.snapshots.set(dream.id, [])
    }

    this.snapshots.get(dream.id).push(snapshot)

    return snapshot
  }

  // Get all snapshots for a dream
  getSnapshots(dreamId) {
    return this.snapshots.get(dreamId) || []
  }

  // Get specific snapshot - throws error if not found
  getSnapshot(snapshotId) {
    for (const snapshots of this.snapshots.values()) {
      const snapshot = snapshots.find(s => s.id === snapshotId)
      if (snapshot) {
        return snapshot
      }
    }
    throw new Error('Snapshot not found')
  }

  // Restore dream from snapshot
  restoreDream(snapshotId) {
    const snapshot = this.getSnapshot(snapshotId)

    return {
      ...snapshot.data,
      restoredFrom: snapshotId,
      restoredAt: new Date().toISOString(),
    }
  }

  // Compare two snapshots (diff)
  diff(snapshotId1, snapshotId2) {
    const s1 = this.getSnapshot(snapshotId1)
    const s2 = this.getSnapshot(snapshotId2)

    const changes = []

    // Get all keys from both snapshots
    const allKeys = new Set([...Object.keys(s1.data), ...Object.keys(s2.data)])

    // Compare fields
    allKeys.forEach(key => {
      const val1 = JSON.stringify(s1.data[key])
      const val2 = JSON.stringify(s2.data[key])
      if (val1 !== val2) {
        changes.push({
          field: key,
          before: s1.data[key],
          after: s2.data[key],
        })
      }
    })

    return {
      from: s1.id,
      to: s2.id,
      changes,
      summary: `${changes.length} changes`,
    }
  }

  // Delete snapshot
  deleteSnapshot(snapshotId) {
    for (const [dreamId, snapshots] of this.snapshots.entries()) {
      const index = snapshots.findIndex((s) => s.id === snapshotId)
      if (index !== -1) {
        snapshots.splice(index, 1)
        if (snapshots.length === 0) {
          this.snapshots.delete(dreamId)
        }
        return true
      }
    }
    return false
  }

  // Get history for a dream (alias for getSnapshots)
  getHistory(dreamId) {
    return this.getSnapshots(dreamId)
  }

  // Clear history for a dream
  clearHistory(dreamId) {
    this.snapshots.delete(dreamId)
  }

  // Branch dream (create A/B version)
  branchDream(dreamId, branchName) {
    const snapshots = this.getSnapshots(dreamId)
    if (snapshots.length === 0) {
      throw new Error('No snapshots to branch from')
    }

    const latest = snapshots[snapshots.length - 1]
    const branch = {
      ...latest.data,
      id: this.generateUniqueId(`${dreamId}-branch`),
      branchName,
      branchedFrom: latest.id,
      branchedAt: new Date().toISOString(),
    }

    return branch
  }
}

export const versioningService = new VersioningService()
export default versioningService
