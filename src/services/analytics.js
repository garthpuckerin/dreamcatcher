/**
 * Analytics Service
 * Tracks user engagement and productivity metrics
 */

class AnalyticsService {
  constructor() {
    this.events = []
    this.metrics = new Map()
  }

  // Track event
  track(event, properties = {}) {
    const tracked = {
      event,
      properties,
      timestamp: new Date().toISOString(),
      userId: properties.userId || 'anonymous',
    }

    this.events.push(tracked)

    // Send to backend analytics service
    if (window.navigator.onLine) {
      this.sendToBackend(tracked)
    }

    return tracked
  }

  // Calculate dream velocity (idea → launch time)
  calculateDreamVelocity(dreams) {
    const completedDreams = dreams.filter(d => d.status === 'completed' || d.status === 'launched')

    if (completedDreams.length === 0) {
      return { average: 0, fastest: 0, slowest: 0 }
    }

    const velocities = completedDreams.map(d => {
      const created = new Date(d.created_at)
      const completed = new Date(d.completed_at || d.updated_at)
      return Math.floor((completed - created) / (1000 * 60 * 60 * 24)) // days
    })

    return {
      average: velocities.reduce((a, b) => a + b, 0) / velocities.length,
      fastest: Math.min(...velocities),
      slowest: Math.max(...velocities),
      count: velocities.length,
    }
  }

  // Get fragment capture frequency
  getFragmentFrequency(fragments, days = 30) {
    const cutoff = new Date(Date.now() - days * 24 * 60 * 60 * 1000)
    const recentFragments = fragments.filter(f => new Date(f.date || f.created_at) > cutoff)

    return {
      total: recentFragments.length,
      perWeek: (recentFragments.length / days) * 7,
      perDay: recentFragments.length / days,
    }
  }

  // Get productivity trends
  getProductivityTrends(dreams, period = 30) {
    const trends = []
    for (let i = 0; i < period; i++) {
      const date = new Date(Date.now() - i * 24 * 60 * 60 * 1000)
      const dayStart = new Date(date.setHours(0, 0, 0, 0))
      const dayEnd = new Date(date.setHours(23, 59, 59, 999))

      const fragmentsCreated = dreams
        .flatMap(d => d.fragments || [])
        .filter(f => {
          const fDate = new Date(f.date || f.created_at)
          return fDate >= dayStart && fDate <= dayEnd
        }).length

      const todosCompleted = dreams
        .flatMap(d => d.todos || [])
        .filter(t => {
          const tDate = t.completed_at ? new Date(t.completed_at) : null
          return tDate && tDate >= dayStart && tDate <= dayEnd
        }).length

      trends.unshift({
        date: dayStart.toISOString().split('T')[0],
        fragments: fragmentsCreated,
        todosCompleted,
      })
    }

    return trends
  }

  // Get AI usage stats
  getAIUsage(events) {
    const aiEvents = events.filter(e => e.event.startsWith('ai:'))
    const byFeature = {}

    aiEvents.forEach(e => {
      const feature = e.event.split(':')[1]
      byFeature[feature] = (byFeature[feature] || 0) + 1
    })

    return {
      total: aiEvents.length,
      byFeature,
      lastUsed: aiEvents.length > 0 ? aiEvents[aiEvents.length - 1].timestamp : null,
    }
  }

  // Send to backend
  async sendToBackend(event) {
    try {
      await fetch('/api/analytics/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(event),
      })
    } catch (error) {
      console.error('Analytics error:', error)
    }
  }

  // Get comprehensive dashboard data
  getDashboardMetrics(dreams, fragments) {
    return {
      velocity: this.calculateDreamVelocity(dreams),
      fragmentFrequency: this.getFragmentFrequency(fragments),
      trends: this.getProductivityTrends(dreams),
      aiUsage: this.getAIUsage(this.events),
      activeDreams: dreams.filter(d => d.status !== 'completed' && d.status !== 'archived').length,
      totalDreams: dreams.length,
      totalFragments: fragments.length,
      completionRate: dreams.filter(d => d.status === 'completed').length / dreams.length,
    }
  }
}

export const analyticsService = new AnalyticsService()
export default analyticsService
