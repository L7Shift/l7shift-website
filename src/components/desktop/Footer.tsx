'use client'

import React from 'react'

interface FooterProps {
  onHoverStart: () => void
  onHoverEnd: () => void
}

export function Footer({ onHoverStart, onHoverEnd }: FooterProps) {
  return (
    <footer
      style={{
        padding: '48px 60px',
        borderTop: '1px solid var(--carbon-gray)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px' }}>
        <span
          style={{
            fontFamily: 'Helvetica Neue, sans-serif',
            fontSize: '28px',
            fontWeight: 300,
          }}
        >
          L7
        </span>
        <span
          style={{
            fontFamily: 'Helvetica Neue, sans-serif',
            fontSize: '18px',
            fontWeight: 300,
            color: 'var(--soft-gray)',
            marginLeft: '4px',
            letterSpacing: '0.1em',
          }}
        >
          SHIFT
        </span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
        <p
          style={{
            fontSize: '14px',
            color: 'var(--foreground)',
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            fontWeight: 400,
          }}
        >
          <span style={{ color: 'var(--electric-cyan)' }}>Indian Trail</span>, North Carolina
        </p>
        <p
          style={{
            fontSize: '12px',
            color: 'var(--soft-gray)',
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
          }}
        >
          Born in <span style={{ color: 'var(--electric-cyan)', fontWeight: 500 }}>IT</span>. Breaking squares everywhere.
        </p>
        <p
          style={{
            fontSize: '11px',
            color: 'var(--carbon-gray)',
            letterSpacing: '0.05em',
          }}
        >
          © 2026 L7 Shift
        </p>
      </div>

      <div style={{ display: 'flex', gap: '32px', alignItems: 'center' }}>
        <a
          href="https://twitter.com/l7shift"
          onMouseEnter={onHoverStart}
          onMouseLeave={onHoverEnd}
          style={{
            color: 'var(--soft-gray)',
            textDecoration: 'none',
            fontSize: '13px',
            letterSpacing: '0.1em',
          }}
        >
          @l7shift
        </a>
        <span style={{ color: 'var(--carbon-gray)' }}>|</span>
        <a
          href="/login"
          onMouseEnter={onHoverStart}
          onMouseLeave={onHoverEnd}
          style={{
            color: 'var(--soft-gray)',
            textDecoration: 'none',
            fontSize: '13px',
            letterSpacing: '0.1em',
          }}
        >
          Client Portal
        </a>
      </div>
    </footer>
  )
}
