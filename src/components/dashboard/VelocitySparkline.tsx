'use client'

import { useMemo } from 'react'

interface VelocitySparklineProps {
  data: number[]
  width?: number
  height?: number
  color?: 'cyan' | 'magenta' | 'lime'
  showArea?: boolean
  showDots?: boolean
  label?: string
  value?: number | string
}

const colors = {
  cyan: '#00F0FF',
  magenta: '#FF00AA',
  lime: '#BFFF00',
}

export function VelocitySparkline({
  data,
  width = 120,
  height = 40,
  color = 'cyan',
  showArea = true,
  showDots = false,
  label,
  value,
}: VelocitySparklineProps) {
  const lineColor = colors[color]

  const pathData = useMemo(() => {
    if (data.length < 2) return { line: '', area: '' }

    const max = Math.max(...data, 1) // Ensure max is at least 1
    const min = Math.min(...data, 0)
    const range = max - min || 1
    const padding = 4

    const points = data.map((val, i) => ({
      x: padding + (i / (data.length - 1)) * (width - padding * 2),
      y: height - padding - ((val - min) / range) * (height - padding * 2),
    }))

    // Create smooth curve using cardinal spline
    let line = `M ${points[0].x},${points[0].y}`
    for (let i = 1; i < points.length; i++) {
      const prev = points[i - 1]
      const curr = points[i]
      const cpx = (prev.x + curr.x) / 2
      line += ` C ${cpx},${prev.y} ${cpx},${curr.y} ${curr.x},${curr.y}`
    }

    // Create area path
    const area = `${line} L ${points[points.length - 1].x},${height - padding} L ${points[0].x},${height - padding} Z`

    return { line, area, points }
  }, [data, width, height])

  const trend = useMemo(() => {
    if (data.length < 2) return 0
    const recent = data.slice(-3)
    const earlier = data.slice(0, 3)
    const recentAvg = recent.reduce((a, b) => a + b, 0) / recent.length
    const earlierAvg = earlier.reduce((a, b) => a + b, 0) / earlier.length
    return recentAvg - earlierAvg
  }, [data])

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 4,
      }}
    >
      {/* Header with label and value */}
      {(label || value !== undefined) && (
        <div
          style={{
            display: 'flex',
            alignItems: 'baseline',
            justifyContent: 'space-between',
            gap: 8,
          }}
        >
          {label && (
            <span
              style={{
                fontSize: 11,
                color: '#888',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
              }}
            >
              {label}
            </span>
          )}
          {value !== undefined && (
            <span
              style={{
                fontSize: 16,
                fontWeight: 700,
                color: '#FAFAFA',
                fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
              }}
            >
              {value}
            </span>
          )}
        </div>
      )}

      {/* Sparkline */}
      <div style={{ position: 'relative' }}>
        <svg width={width} height={height} style={{ overflow: 'visible' }}>
          {/* Gradient definition */}
          <defs>
            <linearGradient id={`sparklineGradient-${color}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={lineColor} stopOpacity={0.3} />
              <stop offset="100%" stopColor={lineColor} stopOpacity={0} />
            </linearGradient>
          </defs>

          {/* Area fill */}
          {showArea && pathData.area && (
            <path
              d={pathData.area}
              fill={`url(#sparklineGradient-${color})`}
            />
          )}

          {/* Line */}
          {pathData.line && (
            <path
              d={pathData.line}
              fill="none"
              stroke={lineColor}
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{
                filter: `drop-shadow(0 0 4px ${lineColor}66)`,
              }}
            />
          )}

          {/* Dots */}
          {showDots && pathData.points && pathData.points.map((point, i) => (
            <circle
              key={i}
              cx={point.x}
              cy={point.y}
              r={3}
              fill={lineColor}
              style={{
                filter: `drop-shadow(0 0 4px ${lineColor})`,
              }}
            />
          ))}
        </svg>

        {/* Trend indicator */}
        <div
          style={{
            position: 'absolute',
            right: 0,
            top: '50%',
            transform: 'translateY(-50%)',
            fontSize: 10,
            fontWeight: 600,
            color: trend >= 0 ? '#BFFF00' : '#FF4444',
            display: 'flex',
            alignItems: 'center',
            gap: 2,
          }}
        >
          <span style={{ fontSize: 12 }}>
            {trend >= 0 ? '\u2191' : '\u2193'}
          </span>
        </div>
      </div>
    </div>
  )
}
