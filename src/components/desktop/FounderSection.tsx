'use client'

import React from 'react'

interface FounderSectionProps {
  onHoverStart: () => void
  onHoverEnd: () => void
}

export function FounderSection({ onHoverStart, onHoverEnd }: FounderSectionProps) {
  return (
    <section
      id="founder"
      style={{
        padding: '160px 60px',
        position: 'relative',
      }}
    >
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
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
          THE STRATEGIST
        </span>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '80px',
            alignItems: 'start',
          }}
        >
          {/* Left - Bio */}
          <div>
            <h2
              style={{
                fontSize: 'clamp(48px, 5vw, 64px)',
                lineHeight: 1.1,
                marginBottom: '32px',
              }}
            >
              Ken Leftwich
            </h2>
            <p
              style={{
                fontSize: '13px',
                fontWeight: 600,
                letterSpacing: '0.15em',
                color: 'var(--electric-cyan)',
                textTransform: 'uppercase',
                marginBottom: '32px',
              }}
            >
              Founder & Chief Symb<span style={{ color: 'var(--electric-cyan)', fontWeight: 800, textShadow: '0 0 12px rgba(0,240,255,0.6)' }}>AI</span>ote · Indian Trail, NC
            </p>
            <p
              style={{
                fontSize: '18px',
                color: 'var(--soft-gray)',
                lineHeight: 1.8,
                marginBottom: '24px',
              }}
            >
              20+ years building from the ground up — from wireless retail floors to the executive suite. Served as SVP of Strategy & Execution within a $5B+ enterprise, leading digital product strategy across multiple brands. Before that: supply chain and project management consulting, technology advisory, and enterprise digital transformation. Self-described modern-day MacGyver of problem solving — give him a challenge and a set of constraints, and he'll find a way.
            </p>
            <p
              style={{
                fontSize: '16px',
                color: 'var(--soft-gray)',
                lineHeight: 1.8,
                marginBottom: '40px',
              }}
            >
              L7 Shift exists because barbers, accountants, apparel makers, and service pros deserve more than templates and overpriced vendors. AI changed what's possible. The Symb<span style={{ color: 'var(--electric-cyan)', fontWeight: 800, textShadow: '0 0 12px rgba(0,240,255,0.6)' }}>AI</span>otic Shift™ is how we deliver it.
            </p>

            {/* CTA */}
            <a
              href="/start"
              className="btn-primary"
              onMouseEnter={onHoverStart}
              onMouseLeave={onHoverEnd}
              style={{ display: 'inline-flex' }}
            >
              LET'S BUILD SOMETHING
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </a>
          </div>

          {/* Right - Credentials */}
          <div>
            {/* Enterprise Background */}
            <div
              onMouseEnter={onHoverStart}
              onMouseLeave={onHoverEnd}
              style={{
                padding: '40px',
                background: 'var(--carbon-gray)',
                borderLeft: '4px solid var(--electric-cyan)',
                marginBottom: '24px',
              }}
            >
              <h3
                style={{
                  fontSize: '14px',
                  fontWeight: 700,
                  letterSpacing: '0.2em',
                  color: 'var(--electric-cyan)',
                  marginBottom: '24px',
                }}
              >
                BACKGROUND
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {[
                  { area: 'SVP, Strategy & Execution', detail: 'Digital product strategy · $5B+ enterprise' },
                  { area: 'Wireless Sales & Retail Management', detail: 'National carriers · Customer-first operations' },
                  { area: 'Supply Chain & PM Consulting', detail: 'Enterprise strategy & implementation' },
                  { area: 'Technology Advisory', detail: 'Digital transformation & systems architecture' },
                ].map((item, i) => (
                  <div key={i}>
                    <span style={{ fontSize: '15px', fontWeight: 600, color: 'var(--clean-white)', display: 'block' }}>
                      {item.area}
                    </span>
                    <span style={{ fontSize: '13px', color: 'var(--soft-gray)' }}>
                      {item.detail}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Education */}
            <div
              onMouseEnter={onHoverStart}
              onMouseLeave={onHoverEnd}
              style={{
                padding: '40px',
                background: 'var(--carbon-gray)',
                borderLeft: '4px solid var(--hot-magenta)',
                marginBottom: '24px',
              }}
            >
              <h3
                style={{
                  fontSize: '14px',
                  fontWeight: 700,
                  letterSpacing: '0.2em',
                  color: 'var(--hot-magenta)',
                  marginBottom: '24px',
                }}
              >
                EDUCATION
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <span style={{ fontSize: '15px', fontWeight: 600, color: 'var(--clean-white)', display: 'block' }}>
                    Michigan State University
                  </span>
                  <span style={{ fontSize: '13px', color: 'var(--soft-gray)' }}>
                    East Lansing, MI
                  </span>
                </div>
                <div>
                  <span style={{ fontSize: '15px', fontWeight: 600, color: 'var(--clean-white)', display: 'block' }}>
                    Jack Welch Management Institute
                  </span>
                  <span style={{ fontSize: '13px', color: 'var(--soft-gray)' }}>
                    Strayer University
                  </span>
                </div>
                <div>
                  <span style={{ fontSize: '15px', fontWeight: 600, color: 'var(--clean-white)', display: 'block' }}>
                    Johnson C. Smith University
                  </span>
                  <span style={{ fontSize: '13px', color: 'var(--soft-gray)' }}>
                    Charlotte, NC · HBCU
                  </span>
                </div>
              </div>
            </div>

            {/* Proof Points */}
            <div
              onMouseEnter={onHoverStart}
              onMouseLeave={onHoverEnd}
              style={{
                padding: '40px',
                background: 'var(--carbon-gray)',
                borderLeft: '4px solid var(--acid-lime)',
              }}
            >
              <h3
                style={{
                  fontSize: '14px',
                  fontWeight: 700,
                  letterSpacing: '0.2em',
                  color: 'var(--acid-lime)',
                  marginBottom: '24px',
                }}
              >
                L7 SHIFT BY THE NUMBERS
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                {[
                  { value: '6', label: 'Active Properties' },
                  { value: '76+', label: 'API Endpoints' },
                  { value: '100+', label: 'Components' },
                  { value: '25+', label: 'Database Tables' },
                ].map((stat, i) => (
                  <div key={i}>
                    <span style={{ fontSize: '28px', fontWeight: 700, color: 'var(--clean-white)', display: 'block' }}>
                      {stat.value}
                    </span>
                    <span style={{ fontSize: '12px', color: 'var(--soft-gray)', letterSpacing: '0.1em' }}>
                      {stat.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
