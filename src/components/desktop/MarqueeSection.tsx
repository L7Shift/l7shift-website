'use client'

import React from 'react'

export function MarqueeSection() {
  return (
    <section
      style={{
        padding: '40px 0',
        borderTop: '1px solid var(--carbon-gray)',
        borderBottom: '1px solid var(--carbon-gray)',
        overflow: 'hidden',
      }}
    >
      <div
        className="marquee-track"
        style={{
          display: 'flex',
          gap: '80px',
          whiteSpace: 'nowrap',
        }}
      >
        {[...Array(2)].map((_, i) => (
          <div key={i} style={{ display: 'flex', gap: '80px', alignItems: 'center' }}>
            {['BUILD', 'BRAND', 'SHIFT', 'INNOVATE', 'CREATE', 'TRANSFORM'].map((word, j) => (
              <span
                key={j}
                style={{
                  fontSize: '14px',
                  fontWeight: 600,
                  letterSpacing: '0.3em',
                  color: j % 2 === 0 ? 'var(--electric-cyan)' : 'var(--soft-gray)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '40px',
                }}
              >
                {word}
                <span
                  style={{
                    width: '8px',
                    height: '8px',
                    background:
                      j % 3 === 0
                        ? 'var(--hot-magenta)'
                        : j % 3 === 1
                          ? 'var(--acid-lime)'
                          : 'var(--electric-cyan)',
                    transform: 'rotate(45deg)',
                  }}
                />
              </span>
            ))}
          </div>
        ))}
      </div>
    </section>
  )
}
