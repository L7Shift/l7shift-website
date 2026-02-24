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
          CASE STUDIES
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
              Complete SaaS platform delivered by The SymbAIotic Shift in under 3 weeks.
              Customer portal, admin dashboard, crew app, Stripe billing, email automation,
              scheduling engine, and AI assistant — all platform-produced, production-ready,
              with a paying customer on day one.
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
                Traditional Approach
              </h4>
              <p style={{ fontSize: '14px', color: 'var(--soft-gray)', lineHeight: 1.7 }}>
                $50K+ and 4-8 weeks through traditional methods. Multiple developers, endless
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
                What The Symb<span style={{ color: 'var(--hot-magenta)', fontWeight: 800, textShadow: '0 0 12px rgba(255,0,170,0.6)' }}>AI</span>otic Shift™ Delivered
              </h4>
              <p style={{ fontSize: '14px', color: 'var(--soft-gray)', lineHeight: 1.7 }}>
                4 portals + AI chatbot + AI hero generator + Stripe billing + 8
                email automations + commission engine + Playwright E2E tests + self-service tools.
                Platform-delivered. Production-ready.
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
                Zero manual processes. Platform-delivered in a fraction of the time and cost.
              </p>
            </div>
          </div>
        </div>

        {/* More Case Studies */}
        <div
          style={{
            marginTop: '40px',
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '32px',
          }}
        >
          {/* Stitchwichs */}
          <div
            onMouseEnter={onHoverStart}
            onMouseLeave={onHoverEnd}
            style={{
              background: 'var(--void-black)',
              border: '1px solid rgba(255,255,255,0.1)',
              padding: '48px',
            }}
          >
            <span
              style={{
                color: 'var(--hot-magenta)',
                fontSize: '12px',
                fontWeight: 700,
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
                display: 'block',
                marginBottom: '16px',
              }}
            >
              SHOPIFY OPTIMIZATION — CLIENT
            </span>
            <h3 style={{ fontSize: '32px', fontWeight: 700, marginBottom: '16px' }}>
              Stitchwichs
            </h3>
            <p style={{ fontSize: '15px', color: 'var(--soft-gray)', lineHeight: 1.8, marginBottom: '24px' }}>
              Custom apparel brand drowning in Shopify app fees. We replaced 6+ paid apps with custom code, built a unified order system, and delivered 208 custom files across a 3-layer architecture.
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '24px' }}>
              <div>
                <span style={{ fontSize: '28px', fontWeight: 700, color: 'var(--hot-magenta)', display: 'block' }}>208</span>
                <span style={{ fontSize: '12px', color: 'var(--soft-gray)', letterSpacing: '0.1em' }}>CUSTOM FILES</span>
              </div>
              <div>
                <span style={{ fontSize: '28px', fontWeight: 700, color: 'var(--electric-cyan)', display: 'block' }}>21K+</span>
                <span style={{ fontSize: '12px', color: 'var(--soft-gray)', letterSpacing: '0.1em' }}>LINES OF CODE</span>
              </div>
              <div>
                <span style={{ fontSize: '28px', fontWeight: 700, color: 'var(--acid-lime)', display: 'block' }}>224</span>
                <span style={{ fontSize: '12px', color: 'var(--soft-gray)', letterSpacing: '0.1em' }}>PRODUCTS</span>
              </div>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {['Shopify', 'Next.js', 'Vite', 'TypeScript', 'Custom Orders'].map((tech, i) => (
                <span key={i} style={{ padding: '6px 14px', background: 'var(--carbon-gray)', fontSize: '12px', fontWeight: 600, letterSpacing: '0.05em' }}>{tech}</span>
              ))}
            </div>
          </div>

          {/* StackPaper */}
          <div
            onMouseEnter={onHoverStart}
            onMouseLeave={onHoverEnd}
            style={{
              background: 'var(--void-black)',
              border: '1px solid rgba(255,255,255,0.1)',
              padding: '48px',
            }}
          >
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
              REVENUE-SHARE VENTURE — PARTNER
            </span>
            <h3 style={{ fontSize: '32px', fontWeight: 700, marginBottom: '16px' }}>
              StackPaper
            </h3>
            <p style={{ fontSize: '15px', color: 'var(--soft-gray)', lineHeight: 1.8, marginBottom: '24px' }}>
              Expense tracking for small businesses, built with a CPA partner. Dual experience — mobile app for business owners, white-label dashboard for accountants. Revenue-sharing model from day one.
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '24px' }}>
              <div>
                <span style={{ fontSize: '28px', fontWeight: 700, color: 'var(--acid-lime)', display: 'block' }}>2</span>
                <span style={{ fontSize: '12px', color: 'var(--soft-gray)', letterSpacing: '0.1em' }}>EXPERIENCES</span>
              </div>
              <div>
                <span style={{ fontSize: '28px', fontWeight: 700, color: 'var(--hot-magenta)', display: 'block' }}>12</span>
                <span style={{ fontSize: '12px', color: 'var(--soft-gray)', letterSpacing: '0.1em' }}>PAGE ROUTES</span>
              </div>
              <div>
                <span style={{ fontSize: '28px', fontWeight: 700, color: 'var(--electric-cyan)', display: 'block' }}>$9.99</span>
                <span style={{ fontSize: '12px', color: 'var(--soft-gray)', letterSpacing: '0.1em' }}>/MO TARGET</span>
              </div>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {['Next.js', 'Tailwind', 'Supabase', 'Stripe', 'White-Label'].map((tech, i) => (
                <span key={i} style={{ padding: '6px 14px', background: 'var(--carbon-gray)', fontSize: '12px', fontWeight: 600, letterSpacing: '0.05em' }}>{tech}</span>
              ))}
            </div>
          </div>
        </div>

        {/* CTA */}
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
            Your project could be next.
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
