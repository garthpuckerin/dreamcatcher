/**
 * Analytics Service Tests
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { analyticsService } from '../analytics';

describe('AnalyticsService', () => {
  beforeEach(() => {
    analyticsService.events = [];
  });

  describe('Event Tracking', () => {
    it('should track events with properties', () => {
      analyticsService.track('dream:created', {
        dreamId: 'dream-123',
        userId: 'user-456'
      });

      expect(analyticsService.events).toHaveLength(1);
      expect(analyticsService.events[0].event).toBe('dream:created');
      expect(analyticsService.events[0].properties.dreamId).toBe('dream-123');
    });

    it('should add timestamp to events', () => {
      analyticsService.track('fragment:added', { fragmentId: 'frag-1' });

      expect(analyticsService.events[0].timestamp).toBeTruthy();
    });

    it('should track multiple events', () => {
      analyticsService.track('event1');
      analyticsService.track('event2');
      analyticsService.track('event3');

      expect(analyticsService.events).toHaveLength(3);
    });
  });

  describe('Dream Velocity Calculation', () => {
    it('should calculate average completion time', () => {
      const dreams = [
        {
          status: 'completed',
          created_at: '2024-01-01',
          completed_at: '2024-01-15' // 14 days
        },
        {
          status: 'completed',
          created_at: '2024-02-01',
          completed_at: '2024-02-08' // 7 days
        },
        {
          status: 'completed',
          created_at: '2024-03-01',
          completed_at: '2024-03-22' // 21 days
        }
      ];

      const velocity = analyticsService.calculateDreamVelocity(dreams);

      expect(velocity.average).toBe(14); // (14 + 7 + 21) / 3
      expect(velocity.fastest).toBe(7);
      expect(velocity.slowest).toBe(21);
    });

    it('should handle single completed dream', () => {
      const dreams = [
        {
          status: 'completed',
          created_at: '2024-01-01',
          completed_at: '2024-01-10'
        }
      ];

      const velocity = analyticsService.calculateDreamVelocity(dreams);

      expect(velocity.average).toBe(9);
      expect(velocity.count).toBe(1);
    });

    it('should ignore in-progress dreams', () => {
      const dreams = [
        {
          status: 'completed',
          created_at: '2024-01-01',
          completed_at: '2024-01-10'
        },
        {
          status: 'in-progress',
          created_at: '2024-02-01'
        }
      ];

      const velocity = analyticsService.calculateDreamVelocity(dreams);

      expect(velocity.count).toBe(1);
    });

    it('should return zero for no completed dreams', () => {
      const dreams = [
        { status: 'in-progress', created_at: '2024-01-01' },
        { status: 'idea', created_at: '2024-02-01' }
      ];

      const velocity = analyticsService.calculateDreamVelocity(dreams);

      expect(velocity.average).toBe(0);
      expect(velocity.count).toBe(0);
    });
  });

  describe('Fragment Frequency Analysis', () => {
    it('should calculate fragments per day', () => {
      const fragments = [
        { created_at: new Date(Date.now() - 0).toISOString() },
        { created_at: new Date(Date.now() - 86400000).toISOString() },
        { created_at: new Date(Date.now() - 172800000).toISOString() },
        { created_at: new Date(Date.now() - 259200000).toISOString() }
      ];

      const frequency = analyticsService.getFragmentFrequency(fragments);

      expect(frequency.perDay).toBeCloseTo(1, 0); // ~1 per day over 4 days
    });

    it('should calculate fragments per week', () => {
      const fragments = Array.from({ length: 14 }, (_, i) => ({
        created_at: new Date(Date.now() - i * 86400000).toISOString()
      }));

      const frequency = analyticsService.getFragmentFrequency(fragments);

      expect(frequency.perWeek).toBeCloseTo(7, 0); // 14 over 2 weeks
    });

    it('should handle empty fragment list', () => {
      const frequency = analyticsService.getFragmentFrequency([]);

      expect(frequency.perDay).toBe(0);
      expect(frequency.perWeek).toBe(0);
    });
  });

  describe('Productivity Trends', () => {
    it('should generate daily trend data', () => {
      const dreams = [
        {
          fragments: [
            { created_at: new Date().toISOString() },
            { created_at: new Date(Date.now() - 86400000).toISOString() }
          ],
          todos: [
            { completed: true, completed_at: new Date().toISOString() }
          ]
        }
      ];

      const trends = analyticsService.getProductivityTrends(dreams, 7);

      expect(trends).toHaveLength(7);
      expect(trends[0]).toHaveProperty('date');
      expect(trends[0]).toHaveProperty('fragments');
      expect(trends[0]).toHaveProperty('todosCompleted');
    });

    it('should count completed todos correctly', () => {
      const dreams = [
        {
          fragments: [],
          todos: [
            { completed: true, completed_at: new Date().toISOString() },
            { completed: true, completed_at: new Date().toISOString() },
            { completed: false }
          ]
        }
      ];

      const trends = analyticsService.getProductivityTrends(dreams, 1);

      expect(trends[0].todosCompleted).toBe(2);
    });
  });

  describe('Dashboard Metrics', () => {
    it('should aggregate all metrics', () => {
      const dreams = [
        {
          id: '1',
          status: 'completed',
          created_at: '2024-01-01',
          completed_at: '2024-01-10',
          fragments: [
            { created_at: new Date().toISOString() }
          ],
          todos: [
            { completed: true }
          ]
        },
        {
          id: '2',
          status: 'in-progress',
          created_at: '2024-02-01',
          fragments: [
            { created_at: new Date().toISOString() }
          ],
          todos: []
        }
      ];

      const fragments = dreams.flatMap(d => d.fragments);

      const metrics = analyticsService.getDashboardMetrics(dreams, fragments);

      expect(metrics.totalDreams).toBe(2);
      expect(metrics.activeDreams).toBe(1);
      expect(metrics.completionRate).toBe(0.5);
      expect(metrics.totalFragments).toBe(2);
      expect(metrics.velocity).toBeDefined();
      expect(metrics.fragmentFrequency).toBeDefined();
    });

    it('should calculate completion rate correctly', () => {
      const dreams = [
        { status: 'completed' },
        { status: 'completed' },
        { status: 'in-progress' },
        { status: 'in-progress' }
      ];

      const metrics = analyticsService.getDashboardMetrics(dreams, []);

      expect(metrics.completionRate).toBe(0.5); // 2/4
    });
  });

  describe('AI Usage Tracking', () => {
    it('should track AI interactions', () => {
      analyticsService.track('ai:question', {
        feature: 'task-prioritization',
        userId: 'user-123'
      });

      analyticsService.track('ai:question', {
        feature: 'progress-summary',
        userId: 'user-123'
      });

      const aiUsage = analyticsService.getAIUsage(analyticsService.events);

      expect(aiUsage.total).toBe(2);
    });

    it('should group AI usage by feature', () => {
      analyticsService.track('ai:question', { feature: 'task-prioritization' });
      analyticsService.track('ai:question', { feature: 'task-prioritization' });
      analyticsService.track('ai:question', { feature: 'progress-summary' });

      const aiUsage = analyticsService.getAIUsage(analyticsService.events);

      expect(aiUsage.byFeature['task-prioritization']).toBe(2);
      expect(aiUsage.byFeature['progress-summary']).toBe(1);
    });

    it('should track last used timestamp', () => {
      const now = new Date().toISOString();
      analyticsService.track('ai:question', { timestamp: now });

      const aiUsage = analyticsService.getAIUsage(analyticsService.events);

      expect(aiUsage.lastUsed).toBeTruthy();
    });
  });
});
