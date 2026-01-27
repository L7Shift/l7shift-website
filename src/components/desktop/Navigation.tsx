'use client'

import React from 'react'

interface NavigationProps {
  onHoverStart: () => void
  onHoverEnd: () => void
}

export function Navigation({ onHoverStart, onHoverEnd }: NavigationProps) {
  return (
    <nav
      style={{
        position: 'fixed',
        top: 4,
        left: 0,
        right: 0,
        zIndex: 99,
        padding: '24px 60px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        background: 'linear-gradient(180deg, rgba(10,10,10,0.98) 0%, rgba(10,10,10,0) 100%)',
        backdropFilter: 'blur(10px)',
      }}
    >
      <div
        style={{ display: 'flex', flexDirection: 'column', gap: '0px' }}
        onMouseEnter={onHoverStart}
        onMouseLeave={onHoverEnd}
      >
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px' }}>
          <span
            className="glitch"
            data-text="L7"
            style={{
              fontFamily: 'Helvetica Neue, sans-serif',
              fontSize: '36px',
              fontWeight: 500,
              letterSpacing: '-0.02em',
            }}
          >
            L7
          </span>
          <span
            style={{
              fontFamily: 'Helvetica Neue, sans-serif',
              fontSize: '24px',
              fontWeight: 300,
              letterSpacing: '0.15em',
              color: 'var(--soft-gray)',
              marginLeft: '8px',
            }}
          >
            SHIFT
          </span>
        </div>
        <div
          style={{
            width: '100%',
            height: '2px',
            background:
              'linear-gradient(90deg, var(--electric-cyan), var(--hot-magenta), var(--acid-lime), var(--electric-cyan))',
            backgroundSize: '200% 100%',
            animation: 'gradientFlow 4s ease-in-out infinite',
            marginTop: '1px',
          }}
        />
        <span
          style={{
            fontSize: '9px',
            fontWeight: 600,
            letterSpacing: '0.25em',
            color: 'var(--soft-gray)',
            textTransform: 'uppercase',
            marginTop: '2px',
          }}
        >
          Break the Square
        </span>
      </div>
      <div style={{ display: 'flex', gap: '48px', alignItems: 'center' }}>
        {['Services', 'Process', 'Investment'].map((item, i) => (
          <a
            key={i}
            href={`#${item.toLowerCase()}`}
            onMouseEnter={onHoverStart}
            onMouseLeave={onHoverEnd}
            style={{
              color: 'var(--soft-gray)',
              textDecoration: 'none',
              fontSize: '13px',
              fontWeight: 500,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              position: 'relative',
              padding: '8px 0',
            }}
          >
            {item}
          </a>
        ))}
        <a
          href="/insights"
          onMouseEnter={onHoverStart}
          onMouseLeave={onHoverEnd}
          style={{
            color: 'var(--soft-gray)',
            textDecoration: 'none',
            fontSize: '13px',
            fontWeight: 500,
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            position: 'relative',
            padding: '8px 0',
          }}
        >
          Insights
        </a>
        <a
          href="/start"
          className="btn-primary"
          onMouseEnter={onHoverStart}
          onMouseLeave={onHoverEnd}
          style={{ padding: '14px 28px', fontSize: '13px', letterSpacing: '0.05em' }}
        >
          START A PROJECT
        </a>
      </div>
    </nav>
  )
}
