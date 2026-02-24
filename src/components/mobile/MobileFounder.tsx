'use client'

import React from 'react'

export function MobileFounder() {
  return (
    <section
      id="founder"
      style={{
        padding: '80px 24px',
        position: 'relative',
      }}
    >
      {/* Section Header */}
      <div style={{ marginBottom: '32px' }}>
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
          THE STRATEGIST
        </span>
        <h2
          style={{
            fontSize: 'clamp(28px, 7vw, 40px)',
            lineHeight: 1.1,
            marginBottom: '8px',
          }}
        >
          Ken Leftwich
        </h2>
        <p
          style={{
            fontSize: '12px',
            fontWeight: 600,
            letterSpacing: '0.12em',
            color: 'var(--electric-cyan)',
            textTransform: 'uppercase',
          }}
        >
          Founder & Chief Symb<span style={{ color: 'var(--electric-cyan)', fontWeight: 800, textShadow: '0 0 12px rgba(0,240,255,0.6)' }}>AI</span>ote · Indian Trail, NC
        </p>
      </div>

      {/* Bio */}
      <p
        style={{
          fontSize: '15px',
          color: 'var(--soft-gray)',
          lineHeight: 1.7,
          marginBottom: '16px',
        }}
      >
        20+ years from wireless retail floors to the executive suite. SVP of Strategy & Execution within a $5B+ enterprise. A modern-day MacGyver of problem solving.
      </p>
      <p
        style={{
          fontSize: '14px',
          color: 'var(--soft-gray)',
          lineHeight: 1.7,
          marginBottom: '32px',
        }}
      >
        L7 Shift exists because barbers, accountants, apparel makers, and service pros deserve more than templates and overpriced vendors.
      </p>

      {/* Background */}
      <div
        style={{
          background: 'var(--carbon-gray)',
          borderLeft: '3px solid var(--electric-cyan)',
          padding: '24px',
          marginBottom: '16px',
        }}
      >
        <h3
          style={{
            fontSize: '12px',
            fontWeight: 700,
            letterSpacing: '0.2em',
            color: 'var(--electric-cyan)',
            marginBottom: '16px',
          }}
        >
          BACKGROUND
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {[
            { area: 'SVP, Strategy & Execution', detail: 'Digital product strategy · $5B+ enterprise' },
            { area: 'Wireless Sales & Retail Management', detail: 'National carriers · Customer-first operations' },
            { area: 'Supply Chain & PM Consulting', detail: 'Enterprise strategy & implementation' },
            { area: 'Technology Advisory', detail: 'Digital transformation & architecture' },
          ].map((item, i) => (
            <div key={i}>
              <span style={{ fontSize: '14px', fontWeight: 600, color: 'var(--clean-white)', display: 'block' }}>
                {item.area}
              </span>
              <span style={{ fontSize: '12px', color: 'var(--soft-gray)' }}>
                {item.detail}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Education */}
      <div
        style={{
          background: 'var(--carbon-gray)',
          borderLeft: '3px solid var(--hot-magenta)',
          padding: '24px',
          marginBottom: '16px',
        }}
      >
        <h3
          style={{
            fontSize: '12px',
            fontWeight: 700,
            letterSpacing: '0.2em',
            color: 'var(--hot-magenta)',
            marginBottom: '16px',
          }}
        >
          EDUCATION
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div>
            <span style={{ fontSize: '14px', fontWeight: 600, color: 'var(--clean-white)', display: 'block' }}>
              Michigan State University
            </span>
            <span style={{ fontSize: '12px', color: 'var(--soft-gray)' }}>
              East Lansing, MI
            </span>
          </div>
          <div>
            <span style={{ fontSize: '14px', fontWeight: 600, color: 'var(--clean-white)', display: 'block' }}>
              Jack Welch Management Institute
            </span>
            <span style={{ fontSize: '12px', color: 'var(--soft-gray)' }}>
              Strayer University
            </span>
          </div>
          <div>
            <span style={{ fontSize: '14px', fontWeight: 600, color: 'var(--clean-white)', display: 'block' }}>
              Johnson C. Smith University
            </span>
            <span style={{ fontSize: '12px', color: 'var(--soft-gray)' }}>
              Charlotte, NC · HBCU
            </span>
          </div>
        </div>
      </div>

      {/* Proof Points */}
      <div
        style={{
          background: 'var(--carbon-gray)',
          borderLeft: '3px solid var(--acid-lime)',
          padding: '24px',
          marginBottom: '32px',
        }}
      >
        <h3
          style={{
            fontSize: '12px',
            fontWeight: 700,
            letterSpacing: '0.2em',
            color: 'var(--acid-lime)',
            marginBottom: '16px',
          }}
        >
          L7 SHIFT BY THE NUMBERS
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          {[
            { value: '6', label: 'Active Properties' },
            { value: '76+', label: 'API Endpoints' },
            { value: '100+', label: 'Components' },
            { value: '25+', label: 'Database Tables' },
          ].map((stat, i) => (
            <div key={i}>
              <span style={{ fontSize: '24px', fontWeight: 700, color: 'var(--clean-white)', display: 'block' }}>
                {stat.value}
              </span>
              <span style={{ fontSize: '10px', color: 'var(--soft-gray)', letterSpacing: '0.1em' }}>
                {stat.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <a
        href="/start"
        className="btn-primary"
        style={{
          display: 'flex',
          justifyContent: 'center',
          padding: '18px 32px',
        }}
      >
        LET'S BUILD SOMETHING
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <path d="M5 12h14M12 5l7 7-7 7" />
        </svg>
      </a>
    </section>
  )
}
