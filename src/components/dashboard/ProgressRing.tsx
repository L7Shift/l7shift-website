'use client'

import { useEffect, useState } from 'react'

interface ProgressRingProps {
  percentage: number
  size?: 'sm' | 'md' | 'lg' | 'xl'
  showLabel?: boolean
  label?: string
  color?: 'cyan' | 'magenta' | 'lime' | 'gradient'
  thickness?: number
  animated?: boolean
}

const sizes = {
  sm: { width: 64, fontSize: 14, labelSize: 10 },
  md: { width: 100, fontSize: 20, labelSize: 12 },
  lg: { width: 140, fontSize: 28, labelSize: 14 },
  xl: { width: 180, fontSize: 36, labelSize: 16 },
}

const colors = {
  cyan: '#00F0FF',
  magenta: '#FF00AA',
  lime: '#BFFF00',
  gradient: 'url(#progressGradient)',
}

export function ProgressRing({
  percentage,
  size = 'md',
  showLabel = true,
  label,
  color = 'cyan',
  thickness = 8,
  animated = true,
}: ProgressRingProps) {
  const [animatedPercentage, setAnimatedPercentage] = useState(0)
  const { width, fontSize, labelSize } = sizes[size]
  const radius = (width - thickness) / 2
  const circumference = radius * 2 * Math.PI
  const offset = circumference - (animatedPercentage / 100) * circumference

  useEffect(() => {
    if (animated) {
      const timer = setTimeout(() => setAnimatedPercentage(percentage), 100)
      return () => clearTimeout(timer)
    } else {
      setAnimatedPercentage(percentage)
    }
  }, [percentage, animated])

  return (
    <div
      style={{
        position: 'relative',
        width,
        height: width,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <svg
        width={width}
        height={width}
        style={{ transform: 'rotate(-90deg)' }}
      >
        <defs>
          <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#00F0FF" />
            <stop offset="50%" stopColor="#FF00AA" />
            <stop offset="100%" stopColor="#BFFF00" />
          </linearGradient>
        </defs>
        {/* Background ring */}
        <circle
          cx={width / 2}
          cy={width / 2}
          r={radius}
          fill="none"
          stroke="rgba(255,255,255,0.1)"
          strokeWidth={thickness}
        />
        {/* Progress ring */}
        <circle
          cx={width / 2}
          cy={width / 2}
          r={radius}
          fill="none"
          stroke={colors[color]}
          strokeWidth={thickness}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{
            transition: animated ? 'stroke-dashoffset 1s ease-out' : 'none',
            filter: `drop-shadow(0 0 8px ${color === 'gradient' ? '#00F0FF' : colors[color]})`,
          }}
        />
      </svg>
      {/* Center content */}
      <div
        style={{
          position: 'absolute',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <span
          style={{
            fontSize,
            fontWeight: 700,
            color: '#FAFAFA',
            fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
          }}
        >
          {Math.round(animatedPercentage)}%
        </span>
        {showLabel && label && (
          <span
            style={{
              fontSize: labelSize,
              color: '#888',
              marginTop: 2,
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
            }}
          >
            {label}
          </span>
        )}
      </div>
    </div>
  )
}
