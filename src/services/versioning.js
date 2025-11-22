/**
 * Version Control Service
 * Git-inspired versioning for dreams and ideas
 */

class VersioningService {
  constructor() {
    this.snapshots = new Map()
  }

  // Create snapshot of dream
  createSnapshot(dream, message = '') {
    const snapshot = {
      id: `snapshot-${Date.now()}`,
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

  // Get specific snapshot
  getSnapshot(snapshotId) {
    for (const snapshots of this.snapshots.values()) {
      const snapshot = snapshots.find(s => s.id === snapshotId)
      if (snapshot) {
        return snapshot
      }
    }
    return null
  }

  // Restore dream from snapshot
  restoreDream(snapshotId) {
    const snapshot = this.getSnapshot(snapshotId)
    if (!snapshot) {
      throw new Error('Snapshot not found')
    }

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

    if (!s1 || !s2) {
      throw new Error('Snapshot not found')
    }

    const changes = []

    // Compare fields
    Object.keys(s2.data).forEach(key => {
      if (JSON.stringify(s1.data[key]) !== JSON.stringify(s2.data[key])) {
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

  // Branch dream (create A/B version)
  branchDream(dreamId, branchName) {
    const snapshots = this.getSnapshots(dreamId)
    if (snapshots.length === 0) {
      throw new Error('No snapshots to branch from')
    }

    const latest = snapshots[snapshots.length - 1]
    const branch = {
      ...latest.data,
      id: `${dreamId}-branch-${Date.now()}`,
      branchName,
      branchedFrom: latest.id,
      branchedAt: new Date().toISOString(),
    }

    return branch
  }
}

export const versioningService = new VersioningService()
export default versioningService
