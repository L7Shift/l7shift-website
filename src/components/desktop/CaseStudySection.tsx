'use client'

import React from 'react'

interface CaseStudySectionProps {
  onHoverStart: () => void
  onHoverEnd: () => void
}

export function CaseStudySection({ onHoverStart, onHoverEnd }: CaseStudySectionProps) {
  return (
    <section
      id="work"
      style={{
        padding: '160px 60px',
        background: 'var(--carbon-gray)',
        position: 'relative',
      }}
    >
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        <span
          style={{
            color: 'var(--electric-cyan)',
            fontSize: '12px',
            fontWeight: 700,
            letterSpacing: '0.3em',
            textTransform: 'uppercase',
            display: 'block',
            marginBottom: '24px',
          }}
        >
          CASE STUDY
        </span>

        <h2
          style={{
            fontSize: 'clamp(48px, 6vw, 80px)',
            lineHeight: 1.05,
            marginBottom: '80px',
          }}
        >
          Real Results
        </h2>

        {/* Scat Pack Case Study */}
        <div
          onMouseEnter={onHoverStart}
          onMouseLeave={onHoverEnd}
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '80px',
            alignItems: 'center',
            background: 'var(--void-black)',
            border: '1px solid rgba(255,255,255,0.1)',
            padding: '60px',
          }}
        >
          <div>
            <span
              style={{
                color: 'var(--acid-lime)',
                fontSize: '12px',
                fontWeight: 700,
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
                display: 'block',
                marginBottom: '16px',
              }}
            >
              COMPLETE BUSINESS LAUNCH
            </span>
            <h3
              style={{
                fontSize: '40px',
                fontWeight: 700,
                marginBottom: '24px',
              }}
            >
              Scat Pack CLT
            </h3>
            <p
              style={{
                fontSize: '18px',
                color: 'var(--soft-gray)',
                lineHeight: 1.8,
                marginBottom: '32px',
              }}
            >
              Full-stack SaaS + AI chatbot + Cloudflare CDN + marketing infrastructure + operations.
              We don't build to compete—we build to dominate. Customer portal, admin dashboard,
              mobile crew app, Stripe subscriptions, automated emails, Google Ads, Monday.com ops,
              and an AI assistant for 24/7 customer support.
            </p>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(4, 1fr)',
                gap: '24px',
                marginBottom: '40px',
              }}
            >
              <div>
                <span
                  style={{
                    fontSize: '32px',
                    fontWeight: 700,
                    color: 'var(--electric-cyan)',
                    display: 'block',
                  }}
                >
                  24hrs
                </span>
                <span
                  style={{
                    fontSize: '13px',
                    color: 'var(--soft-gray)',
                    letterSpacing: '0.1em',
                  }}
                >
                  CORE BUILD
                </span>
              </div>
              <div>
                <span
                  style={{
                    fontSize: '32px',
                    fontWeight: 700,
                    color: 'var(--hot-magenta)',
                    display: 'block',
                  }}
                >
                  18
                </span>
                <span
                  style={{
                    fontSize: '13px',
                    color: 'var(--soft-gray)',
                    letterSpacing: '0.1em',
                  }}
                >
                  DB TABLES
                </span>
              </div>
              <div>
                <span
                  style={{
                    fontSize: '32px',
                    fontWeight: 700,
                    color: 'var(--acid-lime)',
                    display: 'block',
                  }}
                >
                  23
                </span>
                <span
                  style={{
                    fontSize: '13px',
                    color: 'var(--soft-gray)',
                    letterSpacing: '0.1em',
                  }}
                >
                  API ROUTES
                </span>
              </div>
              <div>
                <span
                  style={{
                    fontSize: '32px',
                    fontWeight: 700,
                    color: 'var(--clean-white)',
                    display: 'block',
                  }}
                >
                  4
                </span>
                <span
                  style={{
                    fontSize: '13px',
                    color: 'var(--soft-gray)',
                    letterSpacing: '0.1em',
                  }}
                >
                  PORTALS
                </span>
              </div>
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
              {['Next.js', 'Supabase', 'Stripe', 'Vercel', 'Resend', 'Cloudflare', 'GA4', 'GTM', 'Twilio'].map((tech, i) => (
                <span
                  key={i}
                  style={{
                    padding: '8px 16px',
                    background: 'var(--carbon-gray)',
                    fontSize: '12px',
                    fontWeight: 600,
                    letterSpacing: '0.05em',
                  }}
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>

          <div
            style={{
              background: 'linear-gradient(135deg, var(--carbon-gray) 0%, var(--void-black) 100%)',
              padding: '40px',
              display: 'flex',
              flexDirection: 'column',
              gap: '24px',
              border: '1px solid rgba(255,255,255,0.05)',
            }}
          >
            <div
              style={{
                padding: '24px',
                background: 'rgba(0,240,255,0.05)',
                borderLeft: '3px solid var(--electric-cyan)',
              }}
            >
              <h4 style={{ fontSize: '16px', marginBottom: '8px', color: 'var(--electric-cyan)' }}>
                Traditional Quote
              </h4>
              <p style={{ fontSize: '14px', color: 'var(--soft-gray)', lineHeight: 1.7 }}>
                $50K+ and 4-8 weeks with a traditional agency. Multiple developers, endless
                meetings, slow iteration cycles.
              </p>
            </div>
            <div
              style={{
                padding: '24px',
                background: 'rgba(255,0,170,0.05)',
                borderLeft: '3px solid var(--hot-magenta)',
              }}
            >
              <h4 style={{ fontSize: '16px', marginBottom: '8px', color: 'var(--hot-magenta)' }}>
                What We Delivered
              </h4>
              <p style={{ fontSize: '14px', color: 'var(--soft-gray)', lineHeight: 1.7 }}>
                4 portals + AI chatbot + AI hero generator + Cloudflare CDN + Stripe billing + 8
                email automations + commission engine + Playwright E2E tests + self-service tools.
                Built to dominate, not compete.
              </p>
            </div>
            <div
              style={{
                padding: '24px',
                background: 'rgba(191,255,0,0.05)',
                borderLeft: '3px solid var(--acid-lime)',
              }}
            >
              <h4 style={{ fontSize: '16px', marginBottom: '8px', color: 'var(--acid-lime)' }}>
                The Shift
              </h4>
              <p style={{ fontSize: '14px', color: 'var(--soft-gray)', lineHeight: 1.7 }}>
                Strategy → Systems → Solutions → Shifted outcomes. Live business. Paying customers.
                Zero manual processes. They launched ready to dominate.
              </p>
            </div>
          </div>
        </div>

        {/* Future clients placeholder */}
        <div
          style={{
            marginTop: '40px',
            padding: '48px',
            border: '1px dashed var(--carbon-gray)',
            textAlign: 'center',
            background: 'rgba(0,0,0,0.3)',
          }}
        >
          <p
            style={{
              color: 'var(--soft-gray)',
              fontSize: '16px',
              marginBottom: '16px',
            }}
          >
            Your project could be here.
          </p>
          <a
            href="/start"
            onMouseEnter={onHoverStart}
            onMouseLeave={onHoverEnd}
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
      </div>
    </section>
  )
}
