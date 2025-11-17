/**
 * Analytics Dashboard Component
 *
 * Comprehensive metrics and insights dashboard
 * Features:
 * - Dream velocity tracking
 * - Fragment capture frequency
 * - Productivity trends
 * - AI usage statistics
 * - Export functionality
 */

import React, { useState, useEffect } from 'react';
import { analyticsService } from '../../services/analytics';
import VelocityChart from './VelocityChart';
import TrendsChart from './TrendsChart';
import './analytics.css';

const DashboardView = ({ user, dreams, fragments }) => {
  const [metrics, setMetrics] = useState(null);
  const [timeRange, setTimeRange] = useState('30'); // days
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMetrics();
  }, [dreams, fragments, timeRange]);

  /**
   * Load dashboard metrics
   */
  const loadMetrics = () => {
    setLoading(true);

    try {
      const dashboardData = analyticsService.getDashboardMetrics(dreams, fragments);
      setMetrics(dashboardData);
    } catch (error) {
      console.error('Failed to load metrics:', error);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Export metrics as CSV
   */
  const exportMetrics = () => {
    if (!metrics) return;

    const csv = [
      ['Metric', 'Value'],
      ['Active Dreams', metrics.activeDreams],
      ['Total Dreams', metrics.totalDreams],
      ['Total Fragments', metrics.totalFragments],
      ['Completion Rate', `${(metrics.completionRate * 100).toFixed(1)}%`],
      ['Avg Dream Velocity (days)', metrics.velocity.average.toFixed(1)],
      ['Fastest Dream (days)', metrics.velocity.fastest],
      ['Slowest Dream (days)', metrics.velocity.slowest],
      ['Fragments Per Week', metrics.fragmentFrequency.perWeek.toFixed(1)],
      ['Fragments Per Day', metrics.fragmentFrequency.perDay.toFixed(1)],
      ['Total AI Usage', metrics.aiUsage.total]
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `dreamcatcher-analytics-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return <div className="dashboard-loading">Loading analytics...</div>;
  }

  if (!metrics) {
    return <div className="dashboard-error">Failed to load metrics</div>;
  }

  return (
    <div className="analytics-dashboard">
      <div className="dashboard-header">
        <div>
          <h1>📊 Analytics Dashboard</h1>
          <p>Insights into your productivity and progress</p>
        </div>

        <div className="header-controls">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="time-range-select"
          >
            <option value="7">Last 7 days</option>
            <option value="30">Last 30 days</option>
            <option value="90">Last 90 days</option>
            <option value="365">Last year</option>
          </select>

          <button onClick={exportMetrics} className="btn btn-secondary">
            📥 Export CSV
          </button>
        </div>
      </div>

      {/* Key Metrics Grid */}
      <div className="metrics-grid">
        <div className="metric-card">
          <div className="metric-icon">🎯</div>
          <div className="metric-content">
            <div className="metric-value">{metrics.activeDreams}</div>
            <div className="metric-label">Active Dreams</div>
            <div className="metric-change positive">
              {metrics.totalDreams > 0 && `${((metrics.activeDreams / metrics.totalDreams) * 100).toFixed(0)}% of total`}
            </div>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon">💭</div>
          <div className="metric-content">
            <div className="metric-value">{metrics.totalFragments}</div>
            <div className="metric-label">Total Fragments</div>
            <div className="metric-change">
              {metrics.fragmentFrequency.perWeek.toFixed(1)} per week
            </div>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon">⚡</div>
          <div className="metric-content">
            <div className="metric-value">
              {metrics.velocity.average > 0 ? metrics.velocity.average.toFixed(0) : 'N/A'}
            </div>
            <div className="metric-label">Avg Days to Complete</div>
            <div className="metric-change">
              Fastest: {metrics.velocity.fastest || 'N/A'} days
            </div>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon">✅</div>
          <div className="metric-content">
            <div className="metric-value">
              {(metrics.completionRate * 100).toFixed(0)}%
            </div>
            <div className="metric-label">Completion Rate</div>
            <div className="metric-change">
              {dreams.filter(d => d.status === 'completed').length} of {metrics.totalDreams} dreams
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="charts-section">
        <div className="chart-card">
          <div className="chart-header">
            <h3>📈 Productivity Trends</h3>
            <p>Fragments captured and tasks completed over time</p>
          </div>
          <TrendsChart data={metrics.trends} />
        </div>

        <div className="chart-card">
          <div className="chart-header">
            <h3>⚡ Dream Velocity Distribution</h3>
            <p>Time to complete dreams (in days)</p>
          </div>
          <VelocityChart
            data={{
              average: metrics.velocity.average,
              fastest: metrics.velocity.fastest,
              slowest: metrics.velocity.slowest,
              count: metrics.velocity.count
            }}
          />
        </div>
      </div>

      {/* AI Usage Stats */}
      <div className="ai-usage-section">
        <h3>🤖 AI Assistant Usage</h3>
        <div className="ai-stats-grid">
          <div className="ai-stat-card">
            <div className="stat-value">{metrics.aiUsage.total}</div>
            <div className="stat-label">Total AI Interactions</div>
          </div>

          {Object.entries(metrics.aiUsage.byFeature || {}).map(([feature, count]) => (
            <div key={feature} className="ai-stat-card">
              <div className="stat-value">{count}</div>
              <div className="stat-label">{feature}</div>
            </div>
          ))}

          {metrics.aiUsage.lastUsed && (
            <div className="ai-stat-card">
              <div className="stat-value">
                {new Date(metrics.aiUsage.lastUsed).toLocaleDateString()}
              </div>
              <div className="stat-label">Last Used</div>
            </div>
          )}
        </div>
      </div>

      {/* Dreams Breakdown */}
      <div className="dreams-breakdown">
        <h3>📊 Dreams by Status</h3>
        <div className="status-grid">
          {['idea', 'in-progress', 'completed', 'launched', 'archived'].map(status => {
            const count = dreams.filter(d => d.status === status).length;
            const percentage = metrics.totalDreams > 0
              ? ((count / metrics.totalDreams) * 100).toFixed(1)
              : 0;

            return (
              <div key={status} className="status-card">
                <div className="status-bar">
                  <div
                    className={`status-fill status-${status}`}
                    style={{ width: `${percentage}%` }}
                  />
                </div>
                <div className="status-info">
                  <span className="status-name">{status}</span>
                  <span className="status-count">
                    {count} ({percentage}%)
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Insights Section */}
      <div className="insights-section">
        <h3>💡 Insights</h3>
        <div className="insights-grid">
          {metrics.fragmentFrequency.perDay > 2 && (
            <div className="insight-card positive">
              <div className="insight-icon">🔥</div>
              <div className="insight-content">
                <strong>High Activity!</strong>
                <p>You're capturing {metrics.fragmentFrequency.perDay.toFixed(1)} fragments per day. Keep it up!</p>
              </div>
            </div>
          )}

          {metrics.velocity.average > 0 && metrics.velocity.average < 30 && (
            <div className="insight-card positive">
              <div className="insight-icon">⚡</div>
              <div className="insight-content">
                <strong>Fast Execution</strong>
                <p>Your average dream completion time is {metrics.velocity.average.toFixed(0)} days. You're moving quickly!</p>
              </div>
            </div>
          )}

          {metrics.activeDreams > 10 && (
            <div className="insight-card warning">
              <div className="insight-icon">⚠️</div>
              <div className="insight-content">
                <strong>Too Many Active Dreams</strong>
                <p>You have {metrics.activeDreams} active dreams. Consider focusing on fewer projects for better results.</p>
              </div>
            </div>
          )}

          {metrics.completionRate < 0.2 && metrics.totalDreams > 5 && (
            <div className="insight-card warning">
              <div className="insight-icon">🎯</div>
              <div className="insight-content">
                <strong>Low Completion Rate</strong>
                <p>Only {(metrics.completionRate * 100).toFixed(0)}% of dreams are completed. Focus on finishing existing dreams.</p>
              </div>
            </div>
          )}

          {metrics.fragmentFrequency.perDay < 0.5 && (
            <div className="insight-card info">
              <div className="insight-icon">📝</div>
              <div className="insight-content">
                <strong>Capture More Frequently</strong>
                <p>Try capturing fragments daily to maintain momentum and track progress better.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardView;
