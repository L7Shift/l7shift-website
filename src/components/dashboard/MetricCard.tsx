'use client'

interface MetricCardProps {
  label: string
  value: string | number
  subValue?: string
  trend?: 'up' | 'down' | 'neutral'
  trendValue?: string
  color?: 'cyan' | 'magenta' | 'lime' | 'white'
  size?: 'sm' | 'md' | 'lg'
}

const colors = {
  cyan: '#00F0FF',
  magenta: '#FF00AA',
  lime: '#BFFF00',
  white: '#FAFAFA',
}

const sizes = {
  sm: { value: 24, label: 10, padding: 12 },
  md: { value: 32, label: 11, padding: 16 },
  lg: { value: 48, label: 12, padding: 20 },
}

const trendConfig = {
  up: { icon: '\u2191', color: '#BFFF00' },
  down: { icon: '\u2193', color: '#FF4444' },
  neutral: { icon: '\u2192', color: '#888' },
}

export function MetricCard({
  label,
  value,
  subValue,
  trend,
  trendValue,
  color = 'white',
  size = 'md',
}: MetricCardProps) {
  const colorValue = colors[color]
  const sizeConfig = sizes[size]

  return (
    <div
      style={{
        padding: sizeConfig.padding,
        background: 'rgba(255, 255, 255, 0.03)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        borderRadius: 12,
        display: 'flex',
        flexDirection: 'column',
        gap: 4,
      }}
    >
      {/* Label */}
      <span
        style={{
          fontSize: sizeConfig.label,
          color: '#888',
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
          fontWeight: 500,
        }}
      >
        {label}
      </span>

      {/* Value row */}
      <div
        style={{
          display: 'flex',
          alignItems: 'baseline',
          gap: 8,
        }}
      >
        <span
          style={{
            fontSize: sizeConfig.value,
            fontWeight: 700,
            color: colorValue,
            fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
            lineHeight: 1,
            textShadow: color !== 'white' ? `0 0 20px ${colorValue}44` : 'none',
          }}
        >
          {value}
        </span>

        {/* Trend indicator */}
        {trend && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 2,
              fontSize: 12,
              color: trendConfig[trend].color,
            }}
          >
            <span>{trendConfig[trend].icon}</span>
            {trendValue && <span>{trendValue}</span>}
          </div>
        )}
      </div>

      {/* Sub value */}
      {subValue && (
        <span
          style={{
            fontSize: sizeConfig.label,
            color: '#666',
          }}
        >
          {subValue}
        </span>
      )}
    </div>
  )
}
