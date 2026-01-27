'use client'

interface InsightCardProps {
  type: 'info' | 'warning' | 'success' | 'action'
  icon?: string
  title: string
  message: string
  actionLabel?: string
  onAction?: () => void
}

const typeConfig = {
  info: {
    bg: 'rgba(0, 240, 255, 0.08)',
    border: 'rgba(0, 240, 255, 0.3)',
    iconColor: '#00F0FF',
    defaultIcon: '\uD83D\uDCA1', // lightbulb
  },
  warning: {
    bg: 'rgba(255, 170, 0, 0.08)',
    border: 'rgba(255, 170, 0, 0.3)',
    iconColor: '#FFAA00',
    defaultIcon: '\u26A0\uFE0F', // warning
  },
  success: {
    bg: 'rgba(191, 255, 0, 0.08)',
    border: 'rgba(191, 255, 0, 0.3)',
    iconColor: '#BFFF00',
    defaultIcon: '\u2705', // check
  },
  action: {
    bg: 'rgba(255, 0, 170, 0.08)',
    border: 'rgba(255, 0, 170, 0.3)',
    iconColor: '#FF00AA',
    defaultIcon: '\uD83D\uDC49', // pointing right
  },
}

export function InsightCard({
  type,
  icon,
  title,
  message,
  actionLabel,
  onAction,
}: InsightCardProps) {
  const config = typeConfig[type]

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: 16,
        padding: 16,
        background: config.bg,
        border: `1px solid ${config.border}`,
        borderRadius: 12,
        transition: 'all 0.2s ease',
      }}
    >
      {/* Icon */}
      <div
        style={{
          fontSize: 24,
          lineHeight: 1,
          flexShrink: 0,
        }}
      >
        {icon || config.defaultIcon}
      </div>

      {/* Content */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <h4
          style={{
            margin: 0,
            fontSize: 14,
            fontWeight: 600,
            color: '#FAFAFA',
            fontFamily: "'Inter', -apple-system, sans-serif",
          }}
        >
          {title}
        </h4>
        <p
          style={{
            margin: '4px 0 0',
            fontSize: 13,
            color: '#AAA',
            lineHeight: 1.5,
          }}
        >
          {message}
        </p>

        {/* Action button */}
        {actionLabel && onAction && (
          <button
            onClick={onAction}
            style={{
              marginTop: 12,
              padding: '8px 16px',
              background: config.iconColor,
              color: type === 'success' || type === 'warning' ? '#0A0A0A' : '#FAFAFA',
              border: 'none',
              borderRadius: 6,
              fontSize: 12,
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              fontFamily: "'Inter', -apple-system, sans-serif",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'scale(1.02)'
              e.currentTarget.style.boxShadow = `0 0 16px ${config.iconColor}66`
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1)'
              e.currentTarget.style.boxShadow = 'none'
            }}
          >
            {actionLabel}
          </button>
        )}
      </div>
    </div>
  )
}
