'use client'

import React from 'react'

interface MobileHeaderProps {
  onMenuToggle: () => void
}

export function MobileHeader({ onMenuToggle }: MobileHeaderProps) {
  return (
    <header
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        padding: '16px 20px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        background: 'linear-gradient(180deg, rgba(10,10,10,0.98) 0%, rgba(10,10,10,0) 100%)',
        backdropFilter: 'blur(10px)',
      }}
    >
      {/* Gradient bar at very top */}
      <div
        className="gradient-bar"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '3px',
        }}
      />

      {/* Full Logo - Matching Desktop */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0px' }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px' }}>
          <span
            className="glitch"
            data-text="L7"
            style={{
              fontFamily: 'Helvetica Neue, sans-serif',
              fontSize: '28px',
              fontWeight: 500,
              letterSpacing: '-0.02em',
            }}
          >
            L7
          </span>
          <span
            style={{
              fontFamily: 'Helvetica Neue, sans-serif',
              fontSize: '18px',
              fontWeight: 300,
              letterSpacing: '0.15em',
              color: 'var(--soft-gray)',
              marginLeft: '6px',
            }}
          >
            SHIFT
          </span>
        </div>
        {/* Animated gradient bar */}
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
        {/* Tagline */}
        <span
          style={{
            fontSize: '8px',
            fontWeight: 600,
            letterSpacing: '0.2em',
            color: 'var(--soft-gray)',
            textTransform: 'uppercase',
            marginTop: '2px',
          }}
        >
          Break the Square
        </span>
      </div>

      {/* Menu Button */}
      <button
        onClick={onMenuToggle}
        style={{
          background: 'none',
          border: 'none',
          color: 'var(--clean-white)',
          fontSize: '12px',
          fontWeight: 600,
          letterSpacing: '0.15em',
          padding: '12px 0',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
        }}
      >
        MENU
        <span
          style={{
            width: '20px',
            height: '2px',
            background: 'var(--electric-cyan)',
            display: 'block',
          }}
        />
      </button>
    </header>
  )
}
