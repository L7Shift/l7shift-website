'use client'

import React from 'react'

export function MobileProcess() {
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
        padding: '80px 24px',
        background: 'var(--carbon-gray)',
        position: 'relative',
      }}
    >
      {/* Section Header */}
      <div style={{ marginBottom: '48px' }}>
        <span
          style={{
            color: 'var(--hot-magenta)',
            fontSize: '11px',
            fontWeight: 700,
            letterSpacing: '0.25em',
            textTransform: 'uppercase',
            display: 'block',
            marginBottom: '16px',
          }}
        >
          PROCESS
        </span>
        <h2
          style={{
            fontSize: 'clamp(32px, 8vw, 48px)',
            lineHeight: 1.1,
          }}
        >
          How We Work
        </h2>
      </div>

      {/* Process Steps - Vertical Timeline */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
        {steps.map((step, i) => (
          <div
            key={i}
            style={{
              display: 'flex',
              gap: '20px',
              padding: '24px 0',
              borderLeft: `2px solid ${step.color}`,
              paddingLeft: '24px',
              position: 'relative',
            }}
          >
            {/* Dot on timeline */}
            <div
              style={{
                position: 'absolute',
                left: '-6px',
                top: '28px',
                width: '10px',
                height: '10px',
                background: step.color,
                borderRadius: '50%',
                boxShadow: `0 0 10px ${step.color}`,
              }}
            />

            <div style={{ flex: 1 }}>
              <span
                style={{
                  fontSize: '36px',
                  fontWeight: 700,
                  color: step.color,
                  lineHeight: 1,
                  display: 'block',
                  marginBottom: '8px',
                }}
              >
                {step.num}
              </span>
              <h3
                style={{
                  fontSize: '18px',
                  fontWeight: 700,
                  marginBottom: '8px',
                  letterSpacing: '0.05em',
                }}
              >
                {step.title}
              </h3>
              <p
                style={{
                  fontSize: '14px',
                  color: 'var(--soft-gray)',
                  lineHeight: 1.6,
                }}
              >
                {step.desc}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
