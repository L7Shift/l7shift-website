'use client'

import React from 'react'

export function MobileProcess() {
  const steps = [
    { num: '01', title: 'DISCOVER', desc: 'You bring the domain expertise. We map the opportunity — classifying scope, identifying revenue models, and charting the fastest path to market.', color: 'var(--electric-cyan)' },
    { num: '02', title: 'ARCHITECT', desc: 'AI agent teams generate architecture, brand systems, and prototypes — reviewed and refined by a human architect who owns the outcome.', color: 'var(--hot-magenta)' },
    { num: '03', title: 'DEPLOY', desc: 'Specialized AI agents build in parallel — frontend, backend, payments, automation — production-ready and live in days, not months.', color: 'var(--acid-lime)' },
    { num: '04', title: 'SHIFT', desc: 'Your business is live. Revenue flows. We stay in the loop — iterating, optimizing, and growing alongside you as a true partner.', color: 'var(--electric-cyan)' },
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
          The Symb<span style={{ color: 'var(--electric-cyan)', fontWeight: 800, textShadow: '0 0 12px rgba(0,240,255,0.6)' }}>AI</span>otic Shift™
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
