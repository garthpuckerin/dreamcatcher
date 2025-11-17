/**
 * Velocity Chart Component
 *
 * Visualizes dream completion velocity
 * Simple bar chart showing average, fastest, slowest
 */

import React from 'react';

const VelocityChart = ({ data }) => {
  const { average, fastest, slowest, count } = data;

  if (count === 0) {
    return (
      <div className="chart-empty">
        <p>No completed dreams yet. Complete a dream to see velocity metrics!</p>
      </div>
    );
  }

  const maxValue = Math.max(average, fastest, slowest) * 1.2;

  const bars = [
    { label: 'Fastest', value: fastest, color: '#10b981' },
    { label: 'Average', value: average, color: '#3b82f6' },
    { label: 'Slowest', value: slowest, color: '#f59e0b' }
  ];

  return (
    <div className="velocity-chart">
      <div className="chart-bars">
        {bars.map(bar => (
          <div key={bar.label} className="bar-container">
            <div className="bar-label">{bar.label}</div>
            <div className="bar-wrapper">
              <div
                className="bar"
                style={{
                  width: `${(bar.value / maxValue) * 100}%`,
                  backgroundColor: bar.color
                }}
              >
                <span className="bar-value">{bar.value.toFixed(0)} days</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="chart-footer">
        <p>Based on {count} completed dream{count !== 1 ? 's' : ''}</p>
      </div>
    </div>
  );
};

export default VelocityChart;
