'use client'

import React from 'react'

interface ProcessSectionProps {
  onHoverStart: () => void
  onHoverEnd: () => void
}

export function ProcessSection({ onHoverStart, onHoverEnd }: ProcessSectionProps) {
  const steps = [
    { num: '01', title: 'DISCOVER', desc: 'Deep dive into your business, goals, and constraints', color: 'var(--electric-cyan)' },
    { num: '02', title: 'DESIGN', desc: 'Strategy, concepts, and prototypes before building', color: 'var(--hot-magenta)' },
    { num: '03', title: 'BUILD', desc: 'Rapid development with weekly check-ins', color: 'var(--acid-lime)' },
    { num: '04', title: 'LAUNCH', desc: 'Deploy, test, iterate, and scale', color: 'var(--electric-cyan)' },
  ]

  return (
    <section
      id="process"
      style={{
        padding: '160px 60px',
        background: 'var(--carbon-gray)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Background Numbers */}
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          fontSize: '400px',
          fontWeight: 700,
          color: 'var(--void-black)',
          opacity: 0.3,
          pointerEvents: 'none',
        }}
      >
        04
      </div>

      <div style={{ maxWidth: '1400px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
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
          PROCESS
        </span>

        <h2
          style={{
            fontSize: 'clamp(48px, 6vw, 80px)',
            lineHeight: 1.05,
            marginBottom: '100px',
          }}
        >
          How We Work
        </h2>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '0',
          }}
        >
          {steps.map((step, i) => (
            <div
              key={i}
              onMouseEnter={onHoverStart}
              onMouseLeave={onHoverEnd}
              style={{
                padding: '48px 40px',
                borderRight: i < 3 ? '1px solid rgba(255,255,255,0.1)' : 'none',
                position: 'relative',
                transition: 'all 0.3s ease',
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '4px',
                  background: step.color,
                  opacity: 0.5,
                }}
              />
              <span
                style={{
                  fontSize: '72px',
                  fontWeight: 700,
                  color: step.color,
                  lineHeight: 1,
                  display: 'block',
                  marginBottom: '24px',
                }}
              >
                {step.num}
              </span>
              <h3
                style={{
                  fontSize: '20px',
                  fontWeight: 700,
                  marginBottom: '16px',
                  letterSpacing: '0.1em',
                }}
              >
                {step.title}
              </h3>
              <p
                style={{
                  fontSize: '15px',
                  color: 'var(--soft-gray)',
                  lineHeight: 1.7,
                }}
              >
                {step.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
