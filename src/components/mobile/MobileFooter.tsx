'use client'

import React from 'react'

export function MobileFooter() {
  return (
    <footer
      style={{
        padding: '32px 24px',
        borderTop: '1px solid var(--carbon-gray)',
        textAlign: 'center',
      }}
    >
      {/* Logo */}
      <div
        style={{
          display: 'flex',
          alignItems: 'baseline',
          justifyContent: 'center',
          gap: '4px',
          marginBottom: '16px',
        }}
      >
        <span
          style={{
            fontFamily: 'Helvetica Neue, sans-serif',
            fontSize: '24px',
            fontWeight: 500,
          }}
        >
          L7
        </span>
        <span
          style={{
            fontFamily: 'Helvetica Neue, sans-serif',
            fontSize: '16px',
            fontWeight: 300,
            color: 'var(--soft-gray)',
            marginLeft: '4px',
            letterSpacing: '0.1em',
          }}
        >
          SHIFT
        </span>
      </div>

      {/* Links */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '24px',
          marginBottom: '16px',
        }}
      >
        <a
          href="https://twitter.com/l7shift"
          style={{
            color: 'var(--soft-gray)',
            textDecoration: 'none',
            fontSize: '13px',
            letterSpacing: '0.1em',
          }}
        >
          @l7shift
        </a>
        <a
          href="/login"
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

      {/* Location + Copyright */}
      <p
        style={{
          fontSize: '13px',
          color: 'var(--foreground)',
          letterSpacing: '0.18em',
          textTransform: 'uppercase',
          fontWeight: 400,
          marginBottom: '4px',
        }}
      >
        <span style={{ color: 'var(--electric-cyan)' }}>Indian Trail</span>, North Carolina
      </p>
      <p
        style={{
          fontSize: '11px',
          color: 'var(--soft-gray)',
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
          marginBottom: '4px',
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

      {/* Bottom gradient bar */}
      <div
        className="gradient-bar"
        style={{
          marginTop: '32px',
          height: '3px',
        }}
      />
    </footer>
  )
}
