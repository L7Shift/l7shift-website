'use client'

import React from 'react'

interface WhyUsSectionProps {
  onHoverStart: () => void
  onHoverEnd: () => void
}

export function WhyUsSection({ onHoverStart, onHoverEnd }: WhyUsSectionProps) {
  const benefits = [
    { title: 'Your Expertise, Our Engine', desc: 'You know your market. We know how to build. AI agent teams build your product while a human architect ensures every detail is right.', color: 'var(--electric-cyan)' },
    { title: '10x Faster', desc: "What takes traditional firms months, our methodology delivers in days. AI agents work in parallel, around the clock. Your time-to-market collapses.", color: 'var(--hot-magenta)' },
    { title: 'Ship & Iterate', desc: 'Launch fast, learn from real users, improve continuously. Momentum over perfection — we stay in the loop as your technology partner.', color: 'var(--acid-lime)' },
    { title: '80% Lower Cost', desc: 'AI compute costs a fraction of developer salaries. Enterprise-quality products at small business prices. The math finally works.', color: 'var(--electric-cyan)' },
  ]

  return (
    <section
      style={{
        padding: '160px 60px',
        background: 'var(--void-black)',
        position: 'relative',
      }}
    >
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        <span
          style={{
            color: 'var(--acid-lime)',
            fontSize: '12px',
            fontWeight: 700,
            letterSpacing: '0.3em',
            textTransform: 'uppercase',
            display: 'block',
            marginBottom: '24px',
          }}
        >
          WHY US
        </span>

        <h2
          style={{
            fontSize: 'clamp(48px, 6vw, 80px)',
            lineHeight: 1.05,
            marginBottom: '100px',
          }}
        >
          Why L7 Shift?
        </h2>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '60px 100px',
          }}
        >
          {benefits.map((item, i) => (
            <div
              key={i}
              onMouseEnter={onHoverStart}
              onMouseLeave={onHoverEnd}
              style={{
                display: 'flex',
                gap: '24px',
                padding: '32px',
                background: 'var(--carbon-gray)',
                borderLeft: `4px solid ${item.color}`,
                transition: 'all 0.3s ease',
              }}
            >
              <div>
                <h3
                  style={{
                    fontSize: '28px',
                    fontWeight: 700,
                    marginBottom: '16px',
                  }}
                >
                  {item.title}
                </h3>
                <p
                  style={{
                    fontSize: '16px',
                    color: 'var(--soft-gray)',
                    lineHeight: 1.8,
                  }}
                >
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
