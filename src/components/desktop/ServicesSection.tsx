'use client'

import React from 'react'

interface ServicesSectionProps {
  onHoverStart: () => void
  onHoverEnd: () => void
}

export function ServicesSection({ onHoverStart, onHoverEnd }: ServicesSectionProps) {
  return (
    <section
      id="services"
      style={{
        padding: '160px 60px',
        position: 'relative',
      }}
    >
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        <div style={{ marginBottom: '100px' }}>
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
            THE SOLUTION
          </span>

          <h2
            style={{
              fontSize: 'clamp(48px, 6vw, 80px)',
              lineHeight: 1.05,
              maxWidth: '800px',
            }}
          >
            One studio.{' '}
            <span style={{ fontStyle: 'italic', color: 'var(--acid-lime)' }}>Complete</span> delivery.
          </h2>
        </div>

        {/* Service Cards */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '32px',
          }}
        >
          {/* BUILD */}
          <div
            className="service-card"
            onMouseEnter={onHoverStart}
            onMouseLeave={onHoverEnd}
            style={{
              background: 'var(--void-black)',
              border: '1px solid var(--carbon-gray)',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                height: '6px',
                background: 'var(--electric-cyan)',
                boxShadow: '0 0 30px var(--electric-cyan)',
              }}
            />
            <div style={{ padding: '48px 40px' }}>
              <span
                style={{
                  fontSize: '80px',
                  fontWeight: 700,
                  color: 'var(--electric-cyan)',
                  opacity: 0.2,
                  position: 'absolute',
                  top: '20px',
                  right: '20px',
                  lineHeight: 1,
                }}
              >
                01
              </span>
              <h3
                style={{
                  fontSize: '48px',
                  fontWeight: 700,
                  marginBottom: '12px',
                  color: 'var(--electric-cyan)',
                }}
              >
                BUILD
              </h3>
              <p
                style={{
                  fontSize: '16px',
                  fontWeight: 500,
                  marginBottom: '32px',
                  color: 'var(--soft-gray)',
                }}
              >
                Apps, Platforms & SaaS
              </p>
              <p
                style={{
                  fontSize: '15px',
                  color: 'var(--soft-gray)',
                  lineHeight: 1.8,
                  marginBottom: '40px',
                }}
              >
                AI agent teams build complete applications in days, not months. Full-stack platforms,
                modern tools, production-ready.
              </p>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '12px',
                }}
              >
                {['Web Apps', 'Mobile', 'AI Integration', 'E-Commerce', 'SaaS', 'Automation'].map(
                  (item, i) => (
                    <span
                      key={i}
                      style={{
                        fontSize: '13px',
                        color: 'var(--clean-white)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                      }}
                    >
                      <span
                        style={{
                          width: '4px',
                          height: '4px',
                          background: 'var(--electric-cyan)',
                        }}
                      />
                      {item}
                    </span>
                  )
                )}
              </div>
            </div>
          </div>

          {/* BRAND */}
          <div
            className="service-card"
            onMouseEnter={onHoverStart}
            onMouseLeave={onHoverEnd}
            style={{
              background: 'var(--void-black)',
              border: '1px solid var(--carbon-gray)',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                height: '6px',
                background: 'var(--hot-magenta)',
                boxShadow: '0 0 30px var(--hot-magenta)',
              }}
            />
            <div style={{ padding: '48px 40px' }}>
              <span
                style={{
                  fontSize: '80px',
                  fontWeight: 700,
                  color: 'var(--hot-magenta)',
                  opacity: 0.2,
                  position: 'absolute',
                  top: '20px',
                  right: '20px',
                  lineHeight: 1,
                }}
              >
                02
              </span>
              <h3
                style={{
                  fontSize: '48px',
                  fontWeight: 700,
                  marginBottom: '12px',
                  color: 'var(--hot-magenta)',
                }}
              >
                BRAND
              </h3>
              <p
                style={{
                  fontSize: '16px',
                  fontWeight: 500,
                  marginBottom: '32px',
                  color: 'var(--soft-gray)',
                }}
              >
                Identity, Story & Market Position
              </p>
              <p
                style={{
                  fontSize: '15px',
                  color: 'var(--soft-gray)',
                  lineHeight: 1.8,
                  marginBottom: '40px',
                }}
              >
                Strategy-driven brand identity, positioning, and visual systems — crafted with intent, not templates. Your brand isn't decoration. It's the business.
              </p>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '12px',
                }}
              >
                {['Brand Strategy', 'Visual Identity', 'Market Positioning', 'Brand Voice', 'Marketing Assets', 'Style Guides'].map(
                  (item, i) => (
                    <span
                      key={i}
                      style={{
                        fontSize: '13px',
                        color: 'var(--clean-white)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                      }}
                    >
                      <span
                        style={{
                          width: '4px',
                          height: '4px',
                          background: 'var(--hot-magenta)',
                        }}
                      />
                      {item}
                    </span>
                  )
                )}
              </div>
            </div>
          </div>

          {/* SHIFT */}
          <div
            className="service-card"
            onMouseEnter={onHoverStart}
            onMouseLeave={onHoverEnd}
            style={{
              background: 'var(--void-black)',
              border: '1px solid var(--carbon-gray)',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                height: '6px',
                background: 'var(--acid-lime)',
                boxShadow: '0 0 30px var(--acid-lime)',
              }}
            />
            <div style={{ padding: '48px 40px' }}>
              <span
                style={{
                  fontSize: '80px',
                  fontWeight: 700,
                  color: 'var(--acid-lime)',
                  opacity: 0.2,
                  position: 'absolute',
                  top: '20px',
                  right: '20px',
                  lineHeight: 1,
                }}
              >
                03
              </span>
              <h3
                style={{
                  fontSize: '48px',
                  fontWeight: 700,
                  marginBottom: '12px',
                  color: 'var(--acid-lime)',
                }}
              >
                SHIFT
              </h3>
              <p
                style={{
                  fontSize: '16px',
                  fontWeight: 500,
                  marginBottom: '32px',
                  color: 'var(--soft-gray)',
                }}
              >
                Automation & Integration
              </p>
              <p
                style={{
                  fontSize: '15px',
                  color: 'var(--soft-gray)',
                  lineHeight: 1.8,
                  marginBottom: '40px',
                }}
              >
                Replace manual processes with automated systems. Payments, email, scheduling, and
                AI workflows — built in, not bolted on.
              </p>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '12px',
                }}
              >
                {['Payments', 'Automation', 'Scheduling', 'Email Systems', 'AI Workflows', 'Integrations'].map(
                  (item, i) => (
                    <span
                      key={i}
                      style={{
                        fontSize: '13px',
                        color: 'var(--clean-white)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                      }}
                    >
                      <span
                        style={{
                          width: '4px',
                          height: '4px',
                          background: 'var(--acid-lime)',
                        }}
                      />
                      {item}
                    </span>
                  )
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Partnership Model */}
        <div
          style={{
            marginTop: '80px',
            background: 'var(--carbon-gray)',
            padding: '48px',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
              marginBottom: '32px',
            }}
          >
            <span
              style={{
                color: 'var(--electric-cyan)',
                fontSize: '12px',
                fontWeight: 700,
                letterSpacing: '0.2em',
              }}
            >
              TWO WAYS TO WORK WITH US
            </span>
            <div
              style={{
                flex: 1,
                height: '1px',
                background: 'linear-gradient(90deg, var(--electric-cyan), transparent)',
                opacity: 0.3,
              }}
            />
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '32px',
            }}
          >
            {/* Revenue-Share Partner */}
            <div
              style={{
                padding: '40px',
                background: 'var(--void-black)',
                borderTop: '4px solid var(--acid-lime)',
              }}
            >
              <h4
                style={{
                  fontSize: '24px',
                  fontWeight: 700,
                  color: 'var(--acid-lime)',
                  marginBottom: '16px',
                }}
              >
                PARTNER
              </h4>
              <p
                style={{
                  fontSize: '16px',
                  fontWeight: 500,
                  color: 'var(--soft-gray)',
                  marginBottom: '24px',
                }}
              >
                Revenue-Sharing Ventures
              </p>
              <p
                style={{
                  fontSize: '15px',
                  color: 'var(--soft-gray)',
                  lineHeight: 1.8,
                  marginBottom: '24px',
                }}
              >
                You bring the domain expertise and customers. We build the technology. Revenue is shared — we win when you win.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {['You own the domain knowledge', 'We build & maintain the product', 'Shared revenue model', 'Long-term aligned partnership'].map((item, i) => (
                  <span key={i} style={{ fontSize: '13px', color: 'var(--clean-white)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ width: '4px', height: '4px', background: 'var(--acid-lime)' }} />
                    {item}
                  </span>
                ))}
              </div>
            </div>

            {/* Done-For-You Client */}
            <div
              style={{
                padding: '40px',
                background: 'var(--void-black)',
                borderTop: '4px solid var(--electric-cyan)',
              }}
            >
              <h4
                style={{
                  fontSize: '24px',
                  fontWeight: 700,
                  color: 'var(--electric-cyan)',
                  marginBottom: '16px',
                }}
              >
                CLIENT
              </h4>
              <p
                style={{
                  fontSize: '16px',
                  fontWeight: 500,
                  color: 'var(--soft-gray)',
                  marginBottom: '24px',
                }}
              >
                Done-For-You Builds
              </p>
              <p
                style={{
                  fontSize: '15px',
                  color: 'var(--soft-gray)',
                  lineHeight: 1.8,
                  marginBottom: '24px',
                }}
              >
                You need it built right and built fast. We deliver production-ready platforms in days — then stick around to keep it running.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {['Fixed-price project delivery', 'Production-ready in days', 'Optional managed services', 'Ongoing maintenance & iteration'].map((item, i) => (
                  <span key={i} style={{ fontSize: '13px', color: 'var(--clean-white)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ width: '4px', height: '4px', background: 'var(--electric-cyan)' }} />
                    {item}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <p
            style={{
              marginTop: '24px',
              fontSize: '14px',
              color: 'var(--soft-gray)',
              textAlign: 'center',
              fontStyle: 'italic',
            }}
          >
            Charlotte-based. Strategy-first. Built for domain experts who know their market better than anyone.
          </p>
        </div>
      </div>
    </section>
  )
}
