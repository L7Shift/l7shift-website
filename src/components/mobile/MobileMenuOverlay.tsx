'use client'

import React from 'react'

interface MobileMenuOverlayProps {
  isOpen: boolean
  onClose: () => void
}

export function MobileMenuOverlay({ isOpen, onClose }: MobileMenuOverlayProps) {
  if (!isOpen) return null

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 200,
        background: 'var(--void-black)',
        display: 'flex',
        flexDirection: 'column',
        animation: 'fadeIn 0.3s ease-out',
      }}
    >
      {/* Animated gradient bar at top */}
      <div
        className="gradient-bar"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '4px',
        }}
      />

      {/* Close button */}
      <div
        style={{
          padding: '20px 24px',
          display: 'flex',
          justifyContent: 'flex-end',
        }}
      >
        <button
          onClick={onClose}
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--clean-white)',
            fontSize: '14px',
            fontWeight: 600,
            letterSpacing: '0.15em',
            padding: '12px 0',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          CLOSE
          <span
            style={{
              width: '20px',
              height: '20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--hot-magenta)" strokeWidth="2.5">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </span>
        </button>
      </div>

      {/* Navigation Links */}
      <nav
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '0 40px',
          gap: '8px',
        }}
      >
        {[
          { label: 'Services', href: '#services', color: 'var(--electric-cyan)' },
          { label: 'Process', href: '#process', color: 'var(--hot-magenta)' },
          { label: 'Work', href: '#work', color: 'var(--acid-lime)' },
          { label: 'Investment', href: '#investment', color: 'var(--electric-cyan)' },
          { label: 'Insights', href: '/insights', color: 'var(--hot-magenta)' },
        ].map((item, i) => (
          <a
            key={i}
            href={item.href}
            onClick={onClose}
            style={{
              fontSize: 'clamp(36px, 10vw, 56px)',
              fontFamily: 'Helvetica Neue, sans-serif',
              fontWeight: 700,
              color: 'var(--clean-white)',
              textDecoration: 'none',
              padding: '16px 0',
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
              transition: 'color 0.2s ease',
            }}
          >
            <span
              style={{
                width: '8px',
                height: '8px',
                background: item.color,
                opacity: 0.6,
              }}
            />
            {item.label}
          </a>
        ))}
      </nav>

      {/* CTA at bottom */}
      <div
        style={{
          padding: '40px 24px',
          borderTop: '1px solid var(--carbon-gray)',
        }}
      >
        <a
          href="/start"
          onClick={onClose}
          className="btn-primary"
          style={{
            width: '100%',
            justifyContent: 'center',
            padding: '20px',
            fontSize: '16px',
          }}
        >
          START A PROJECT
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </a>

        {/* Tagline */}
        <p
          style={{
            textAlign: 'center',
            marginTop: '24px',
            fontSize: '12px',
            letterSpacing: '0.2em',
            color: 'var(--soft-gray)',
          }}
        >
          BREAK THE SQUARE
        </p>
      </div>
    </div>
  )
}
