'use client'

import { ReactNode } from 'react'

interface ActionCardProps {
  icon: ReactNode
  title: string
  subtitle?: string
  badge?: number
  badgeColor?: 'cyan' | 'magenta' | 'lime' | 'orange'
  onClick?: () => void
  href?: string
  variant?: 'default' | 'urgent' | 'success'
}

const badgeColors = {
  cyan: { bg: '#00F0FF', text: '#0A0A0A' },
  magenta: { bg: '#FF00AA', text: '#FAFAFA' },
  lime: { bg: '#BFFF00', text: '#0A0A0A' },
  orange: { bg: '#FFAA00', text: '#0A0A0A' },
}

const variants = {
  default: {
    border: 'rgba(255, 255, 255, 0.1)',
    hoverBorder: 'rgba(0, 240, 255, 0.5)',
    glow: 'rgba(0, 240, 255, 0.2)',
  },
  urgent: {
    border: 'rgba(255, 0, 170, 0.3)',
    hoverBorder: 'rgba(255, 0, 170, 0.7)',
    glow: 'rgba(255, 0, 170, 0.3)',
  },
  success: {
    border: 'rgba(191, 255, 0, 0.3)',
    hoverBorder: 'rgba(191, 255, 0, 0.7)',
    glow: 'rgba(191, 255, 0, 0.3)',
  },
}

export function ActionCard({
  icon,
  title,
  subtitle,
  badge,
  badgeColor = 'cyan',
  onClick,
  href,
  variant = 'default',
}: ActionCardProps) {
  const variantStyle = variants[variant]

  const content = (
    <div
      className="action-card"
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px 20px',
        background: 'rgba(255, 255, 255, 0.03)',
        border: `1px solid ${variantStyle.border}`,
        borderRadius: 12,
        cursor: onClick || href ? 'pointer' : 'default',
        position: 'relative',
        overflow: 'hidden',
        minHeight: 120,
        transition: 'all 0.3s ease',
      }}
      onClick={onClick}
    >
      {/* Icon */}
      <div
        style={{
          fontSize: 32,
          marginBottom: 12,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {icon}
      </div>

      {/* Title */}
      <h4
        style={{
          margin: 0,
          fontSize: 14,
          fontWeight: 600,
          color: '#FAFAFA',
          textAlign: 'center',
          fontFamily: "'Inter', -apple-system, sans-serif",
        }}
      >
        {title}
      </h4>

      {/* Subtitle */}
      {subtitle && (
        <p
          style={{
            margin: '4px 0 0',
            fontSize: 12,
            color: '#888',
            textAlign: 'center',
          }}
        >
          {subtitle}
        </p>
      )}

      {/* Badge */}
      {badge !== undefined && badge > 0 && (
        <span
          style={{
            position: 'absolute',
            top: 8,
            right: 8,
            minWidth: 24,
            height: 24,
            padding: '0 8px',
            borderRadius: 12,
            background: badgeColors[badgeColor].bg,
            color: badgeColors[badgeColor].text,
            fontSize: 12,
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: `0 0 12px ${badgeColors[badgeColor].bg}66`,
          }}
        >
          {badge}
        </span>
      )}

      <style jsx>{`
        .action-card:hover {
          border-color: ${variantStyle.hoverBorder} !important;
          box-shadow: 0 0 20px ${variantStyle.glow};
          transform: translateY(-2px);
        }

        .action-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 2px;
          background: linear-gradient(90deg, #00F0FF, #FF00AA, #BFFF00);
          opacity: 0;
          transition: opacity 0.3s ease;
        }

        .action-card:hover::before {
          opacity: 1;
        }
      `}</style>
    </div>
  )

  if (href) {
    return (
      <a href={href} style={{ textDecoration: 'none' }}>
        {content}
      </a>
    )
  }

  return content
}
