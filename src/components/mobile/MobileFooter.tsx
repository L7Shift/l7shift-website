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

      {/* Social */}
      <a
        href="https://twitter.com/l7shift"
        style={{
          color: 'var(--soft-gray)',
          textDecoration: 'none',
          fontSize: '13px',
          letterSpacing: '0.1em',
          display: 'block',
          marginBottom: '16px',
        }}
      >
        @l7shift
      </a>

      {/* Copyright */}
      <p
        style={{
          fontSize: '12px',
          color: 'var(--carbon-gray)',
          letterSpacing: '0.05em',
        }}
      >
        © 2026 L7 Shift. Break the square.
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
