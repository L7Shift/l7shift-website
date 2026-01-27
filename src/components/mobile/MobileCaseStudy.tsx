'use client'

import React from 'react'

export function MobileCaseStudy() {
  return (
    <section
      id="work"
      style={{
        padding: '80px 24px',
        background: 'var(--void-black)',
      }}
    >
      {/* Section Header */}
      <div style={{ marginBottom: '32px' }}>
        <span
          style={{
            color: 'var(--electric-cyan)',
            fontSize: '11px',
            fontWeight: 700,
            letterSpacing: '0.25em',
            textTransform: 'uppercase',
            display: 'block',
            marginBottom: '16px',
          }}
        >
          CASE STUDY
        </span>
        <h2
          style={{
            fontSize: 'clamp(32px, 8vw, 48px)',
            lineHeight: 1.1,
          }}
        >
          Real Results
        </h2>
      </div>

      {/* Case Study Card */}
      <div
        style={{
          background: 'var(--carbon-gray)',
          border: '1px solid rgba(255,255,255,0.1)',
          overflow: 'hidden',
        }}
      >
        {/* Header */}
        <div style={{ padding: '24px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
          <span
            style={{
              color: 'var(--acid-lime)',
              fontSize: '10px',
              fontWeight: 700,
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              display: 'block',
              marginBottom: '8px',
            }}
          >
            COMPLETE BUSINESS LAUNCH
          </span>
          <h3
            style={{
              fontSize: '28px',
              fontWeight: 700,
            }}
          >
            Scat Pack CLT
          </h3>
        </div>

        {/* Stats */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '1px',
            background: 'rgba(255,255,255,0.05)',
          }}
        >
          {[
            { value: '24hrs', label: 'CORE BUILD', color: 'var(--electric-cyan)' },
            { value: '18', label: 'DB TABLES', color: 'var(--hot-magenta)' },
            { value: '23', label: 'API ROUTES', color: 'var(--acid-lime)' },
            { value: '4', label: 'PORTALS', color: 'var(--clean-white)' },
          ].map((stat, i) => (
            <div
              key={i}
              style={{
                background: 'var(--carbon-gray)',
                padding: '20px',
                textAlign: 'center',
              }}
            >
              <span
                style={{
                  fontSize: '24px',
                  fontWeight: 700,
                  color: stat.color,
                  display: 'block',
                }}
              >
                {stat.value}
              </span>
              <span
                style={{
                  fontSize: '10px',
                  color: 'var(--soft-gray)',
                  letterSpacing: '0.1em',
                }}
              >
                {stat.label}
              </span>
            </div>
          ))}
        </div>

        {/* Description */}
        <div style={{ padding: '24px' }}>
          <p
            style={{
              fontSize: '14px',
              color: 'var(--soft-gray)',
              lineHeight: 1.7,
              marginBottom: '20px',
            }}
          >
            Full-stack SaaS + AI chatbot + Cloudflare CDN + marketing infrastructure. We don't
            build to compete—we build to dominate.
          </p>

          {/* Tech tags */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '24px' }}>
            {['Next.js', 'Supabase', 'Stripe', 'Vercel', 'Resend', 'Cloudflare', 'GA4', 'GTM', 'Twilio'].map((tech, i) => (
              <span
                key={i}
                style={{
                  padding: '6px 12px',
                  background: 'var(--void-black)',
                  fontSize: '11px',
                  fontWeight: 600,
                  letterSpacing: '0.05em',
                }}
              >
                {tech}
              </span>
            ))}
          </div>

          {/* The Shift */}
          <div
            style={{
              padding: '16px',
              background: 'rgba(191,255,0,0.05)',
              borderLeft: '3px solid var(--acid-lime)',
            }}
          >
            <h4 style={{ fontSize: '14px', marginBottom: '8px', color: 'var(--acid-lime)' }}>
              The Shift
            </h4>
            <p style={{ fontSize: '13px', color: 'var(--soft-gray)', lineHeight: 1.6 }}>
              Strategy → Systems → Solutions → Shifted outcomes. Live business. Paying customers.
              Zero manual processes.
            </p>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div
        style={{
          marginTop: '24px',
          textAlign: 'center',
        }}
      >
        <p
          style={{
            color: 'var(--soft-gray)',
            fontSize: '14px',
            marginBottom: '12px',
          }}
        >
          Your project could be here.
        </p>
        <a
          href="/start"
          style={{
            color: 'var(--electric-cyan)',
            textDecoration: 'none',
            fontSize: '14px',
            fontWeight: 600,
            letterSpacing: '0.1em',
          }}
        >
          LET'S TALK →
        </a>
      </div>
    </section>
  )
}
