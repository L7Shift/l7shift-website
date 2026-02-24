'use client'

import React from 'react'

interface ProblemSectionProps {
  onHoverStart: () => void
  onHoverEnd: () => void
}

export function ProblemSection({ onHoverStart, onHoverEnd }: ProblemSectionProps) {
  const problems = [
    { title: 'Outdated tech', desc: 'Legacy systems that slow everything down' },
    { title: 'Cookie-cutter brands', desc: 'Looking like everyone else in the market' },
    { title: 'Fear of change', desc: 'Knowing they need to evolve but not how' },
    { title: 'Wasted budgets', desc: 'Paying vendors for mediocre results' },
  ]

  return (
    <section
      id="problem"
      style={{
        padding: '160px 60px',
        position: 'relative',
        background: `linear-gradient(180deg, var(--void-black) 0%, var(--carbon-gray) 50%, var(--void-black) 100%)`,
      }}
    >
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        <div
          style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '120px', alignItems: 'center' }}
        >
          {/* Left - Content */}
          <div>
            <span
              style={{
                color: 'var(--hot-magenta)',
                fontSize: '12px',
                fontWeight: 700,
                letterSpacing: '0.3em',
                textTransform: 'uppercase',
                display: 'block',
                marginBottom: '24px',
              }}
            >
              THE PROBLEM
            </span>

            <h2
              style={{
                fontSize: 'clamp(40px, 5vw, 72px)',
                lineHeight: 1.05,
                marginBottom: '48px',
              }}
            >
              Most businesses are stuck in{' '}
              <span style={{ color: 'var(--hot-magenta)' }}>square thinking.</span>
            </h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              {problems.map((item, i) => (
                <div
                  key={i}
                  onMouseEnter={onHoverStart}
                  onMouseLeave={onHoverEnd}
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '20px',
                    padding: '24px',
                    background: 'rgba(10,10,10,0.6)',
                    borderLeft: '3px solid var(--hot-magenta)',
                    transition: 'all 0.3s ease',
                  }}
                >
                  <span
                    style={{
                      color: 'var(--hot-magenta)',
                      fontSize: '24px',
                      fontWeight: 700,
                    }}
                  >
                    0{i + 1}
                  </span>
                  <div>
                    <h3 style={{ fontSize: '18px', marginBottom: '8px', fontWeight: 600 }}>
                      {item.title}
                    </h3>
                    <p style={{ color: 'var(--soft-gray)', fontSize: '15px' }}>{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right - Big Stat */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative',
            }}
          >
            <div
              style={{
                position: 'absolute',
                width: '400px',
                height: '400px',
                border: '1px solid var(--carbon-gray)',
                transform: 'rotate(45deg)',
                opacity: 0.3,
              }}
            />
            <span
              style={{
                fontSize: 'clamp(100px, 15vw, 200px)',
                fontWeight: 700,
                background: 'linear-gradient(135deg, var(--electric-cyan), var(--hot-magenta))',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                lineHeight: 1,
                position: 'relative',
              }}
            >
              73%
            </span>
            <div style={{ textAlign: 'center', marginTop: '24px' }}>
              <p style={{ fontSize: '24px', color: 'var(--clean-white)', marginBottom: '8px' }}>
                of digital transformations fail
              </p>
              <p style={{ fontSize: '14px', color: 'var(--soft-gray)' }}>— McKinsey</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
