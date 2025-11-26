/**
 * Trends Chart Component
 *
 * Line chart showing fragments and todos over time
 * Simple SVG-based chart (could be replaced with D3.js or Chart.js)
 */

import React from 'react'

const TrendsChart = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <div className="chart-empty">
        <p>No trend data available yet. Start capturing fragments to see trends!</p>
      </div>
    )
  }

  const width = 800
  const height = 300
  const padding = 40

  const maxFragments = Math.max(...data.map(d => d.fragments), 1)
  const maxTodos = Math.max(...data.map(d => d.todosCompleted), 1)
  const maxY = Math.max(maxFragments, maxTodos)

  const xScale = index => {
    return padding + (index / (data.length - 1)) * (width - 2 * padding)
  }

  const yScale = value => {
    return height - padding - (value / maxY) * (height - 2 * padding)
  }

  // Generate path for fragments line
  const fragmentsPath = data
    .map((d, i) => {
      const x = xScale(i)
      const y = yScale(d.fragments)
      return i === 0 ? `M ${x} ${y}` : `L ${x} ${y}`
    })
    .join(' ')

  // Generate path for todos line
  const todosPath = data
    .map((d, i) => {
      const x = xScale(i)
      const y = yScale(d.todosCompleted)
      return i === 0 ? `M ${x} ${y}` : `L ${x} ${y}`
    })
    .join(' ')

  return (
    <div className="trends-chart">
      <svg width="100%" height={height} viewBox={`0 0 ${width} ${height}`}>
        {/* Grid lines */}
        {[0, 1, 2, 3, 4].map(i => {
          const y = height - padding - (i * (height - 2 * padding)) / 4
          return (
            <g key={i}>
              <line
                x1={padding}
                y1={y}
                x2={width - padding}
                y2={y}
                stroke="#e5e7eb"
                strokeWidth="1"
              />
              <text x={padding - 10} y={y + 5} textAnchor="end" fontSize="12" fill="#9ca3af">
                {Math.round((maxY * i) / 4)}
              </text>
            </g>
          )
        })}

        {/* X-axis labels (dates) */}
        {data
          .filter((_, i) => i % Math.ceil(data.length / 6) === 0)
          .map((d, i, _arr) => {
            const index = data.indexOf(d)
            const x = xScale(index)
            const date = new Date(d.date)
            const label = `${date.getMonth() + 1}/${date.getDate()}`

            return (
              <text
                key={i}
                x={x}
                y={height - padding + 20}
                textAnchor="middle"
                fontSize="11"
                fill="#9ca3af"
              >
                {label}
              </text>
            )
          })}

        {/* Fragments line */}
        <path
          d={fragmentsPath}
          fill="none"
          stroke="#3b82f6"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Fragments points */}
        {data.map((d, i) => (
          <circle key={`f-${i}`} cx={xScale(i)} cy={yScale(d.fragments)} r="4" fill="#3b82f6">
            <title>
              {d.date}: {d.fragments} fragments
            </title>
          </circle>
        ))}

        {/* Todos line */}
        <path
          d={todosPath}
          fill="none"
          stroke="#10b981"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Todos points */}
        {data.map((d, i) => (
          <circle key={`t-${i}`} cx={xScale(i)} cy={yScale(d.todosCompleted)} r="4" fill="#10b981">
            <title>
              {d.date}: {d.todosCompleted} todos completed
            </title>
          </circle>
        ))}
      </svg>

      {/* Legend */}
      <div className="chart-legend">
        <div className="legend-item">
          <div className="legend-color" style={{ background: '#3b82f6' }} />
          <span>Fragments Captured</span>
        </div>
        <div className="legend-item">
          <div className="legend-color" style={{ background: '#10b981' }} />
          <span>Tasks Completed</span>
        </div>
      </div>
    </div>
  )
}

export default TrendsChart
