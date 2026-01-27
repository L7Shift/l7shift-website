'use client'

type Status = 'backlog' | 'active' | 'review' | 'shipped' | 'pending' | 'approved' | 'rejected' | 'draft' | 'implemented'

interface StatusPillProps {
  status: Status
  size?: 'sm' | 'md' | 'lg'
  showDot?: boolean
  customLabel?: string
}

const statusConfig: Record<Status, { label: string; bg: string; text: string; glow: string }> = {
  backlog: {
    label: 'Backlog',
    bg: 'rgba(136, 136, 136, 0.2)',
    text: '#888',
    glow: 'none',
  },
  active: {
    label: 'Active',
    bg: 'rgba(0, 240, 255, 0.15)',
    text: '#00F0FF',
    glow: '0 0 8px rgba(0, 240, 255, 0.4)',
  },
  review: {
    label: 'In Review',
    bg: 'rgba(255, 0, 170, 0.15)',
    text: '#FF00AA',
    glow: '0 0 8px rgba(255, 0, 170, 0.4)',
  },
  shipped: {
    label: 'Shipped',
    bg: 'rgba(191, 255, 0, 0.15)',
    text: '#BFFF00',
    glow: '0 0 8px rgba(191, 255, 0, 0.4)',
  },
  pending: {
    label: 'Pending',
    bg: 'rgba(255, 170, 0, 0.15)',
    text: '#FFAA00',
    glow: '0 0 8px rgba(255, 170, 0, 0.4)',
  },
  approved: {
    label: 'Approved',
    bg: 'rgba(191, 255, 0, 0.15)',
    text: '#BFFF00',
    glow: '0 0 8px rgba(191, 255, 0, 0.4)',
  },
  rejected: {
    label: 'Rejected',
    bg: 'rgba(255, 68, 68, 0.15)',
    text: '#FF4444',
    glow: '0 0 8px rgba(255, 68, 68, 0.4)',
  },
  draft: {
    label: 'Draft',
    bg: 'rgba(136, 136, 136, 0.2)',
    text: '#888',
    glow: 'none',
  },
  implemented: {
    label: 'Implemented',
    bg: 'rgba(0, 240, 255, 0.15)',
    text: '#00F0FF',
    glow: '0 0 8px rgba(0, 240, 255, 0.4)',
  },
}

const sizes = {
  sm: { padding: '2px 8px', fontSize: 10, dotSize: 6 },
  md: { padding: '4px 12px', fontSize: 12, dotSize: 8 },
  lg: { padding: '6px 16px', fontSize: 14, dotSize: 10 },
}

export function StatusPill({
  status,
  size = 'md',
  showDot = true,
  customLabel,
}: StatusPillProps) {
  const config = statusConfig[status]
  const sizeConfig = sizes[size]

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
        padding: sizeConfig.padding,
        borderRadius: 100,
        background: config.bg,
        boxShadow: config.glow,
        fontFamily: "'Inter', -apple-system, sans-serif",
        fontSize: sizeConfig.fontSize,
        fontWeight: 600,
        letterSpacing: '0.02em',
        textTransform: 'uppercase',
        color: config.text,
        border: `1px solid ${config.text}33`,
        transition: 'all 0.2s ease',
      }}
    >
      {showDot && (
        <span
          style={{
            width: sizeConfig.dotSize,
            height: sizeConfig.dotSize,
            borderRadius: '50%',
            background: config.text,
            animation: status === 'active' ? 'pulse 2s infinite' : 'none',
          }}
        />
      )}
      {customLabel || config.label}
      <style jsx>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(0.9); }
        }
      `}</style>
    </span>
  )
}
