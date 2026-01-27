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
            We help you <span style={{ fontStyle: 'italic', color: 'var(--acid-lime)' }}>break</span>{' '}
            the box.
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
                Custom Apps & Websites
              </p>
              <p
                style={{
                  fontSize: '15px',
                  color: 'var(--soft-gray)',
                  lineHeight: 1.8,
                  marginBottom: '40px',
                }}
              >
                From MVPs to full platforms. AI-powered tools. Modern stacks. No bloated enterprise
                BS.
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
                Identity & Strategy
              </p>
              <p
                style={{
                  fontSize: '15px',
                  color: 'var(--soft-gray)',
                  lineHeight: 1.8,
                  marginBottom: '40px',
                }}
              >
                Logos that stick. Messaging that cuts through. Positioning that makes you
                unforgettable.
              </p>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '12px',
                }}
              >
                {['Strategy', 'Visual Identity', 'Guidelines', 'Naming', 'Pitch Decks', 'Collateral'].map(
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
                Business Transformation
              </p>
              <p
                style={{
                  fontSize: '15px',
                  color: 'var(--soft-gray)',
                  lineHeight: 1.8,
                  marginBottom: '40px',
                }}
              >
                Process automation. AI integration. New revenue streams. Futureproofing operations.
              </p>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '12px',
                }}
              >
                {['AI Strategy', 'Automation', 'Operations', 'Tech Strategy', 'Growth', 'Training'].map(
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

        {/* Tech Capabilities */}
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
              CAPABILITIES
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
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: '24px',
            }}
          >
            {/* Optimize & Scale */}
            <div
              style={{
                padding: '24px',
                background: 'var(--void-black)',
                borderTop: '3px solid var(--electric-cyan)',
              }}
            >
              <h4
                style={{
                  fontSize: '14px',
                  fontWeight: 700,
                  color: 'var(--electric-cyan)',
                  marginBottom: '16px',
                  letterSpacing: '0.1em',
                }}
              >
                OPTIMIZE & SCALE
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {['Docker', 'Kubernetes', 'AWS', 'GCP', 'Terraform', 'CI/CD'].map((tech, i) => (
                  <span key={i} style={{ fontSize: '13px', color: 'var(--soft-gray)' }}>
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            {/* Build Modern */}
            <div
              style={{
                padding: '24px',
                background: 'var(--void-black)',
                borderTop: '3px solid var(--hot-magenta)',
              }}
            >
              <h4
                style={{
                  fontSize: '14px',
                  fontWeight: 700,
                  color: 'var(--hot-magenta)',
                  marginBottom: '16px',
                  letterSpacing: '0.1em',
                }}
              >
                BUILD MODERN
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {['Next.js', 'TypeScript', 'Tailwind', 'Supabase', 'Vercel', 'Resend'].map(
                  (tech, i) => (
                    <span key={i} style={{ fontSize: '13px', color: 'var(--soft-gray)' }}>
                      {tech}
                    </span>
                  )
                )}
              </div>
            </div>

            {/* E-Commerce */}
            <div
              style={{
                padding: '24px',
                background: 'var(--void-black)',
                borderTop: '3px solid var(--acid-lime)',
              }}
            >
              <h4
                style={{
                  fontSize: '14px',
                  fontWeight: 700,
                  color: 'var(--acid-lime)',
                  marginBottom: '16px',
                  letterSpacing: '0.1em',
                }}
              >
                E-COMMERCE
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {[
                  'Shopify',
                  'WooCommerce',
                  'Stripe',
                  'Custom Storefronts',
                  'Inventory Systems',
                  'Payment Integration',
                ].map((tech, i) => (
                  <span key={i} style={{ fontSize: '13px', color: 'var(--soft-gray)' }}>
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            {/* Legacy & Migration */}
            <div
              style={{
                padding: '24px',
                background: 'var(--void-black)',
                borderTop: '3px solid var(--electric-cyan)',
              }}
            >
              <h4
                style={{
                  fontSize: '14px',
                  fontWeight: 700,
                  color: 'var(--electric-cyan)',
                  marginBottom: '16px',
                  letterSpacing: '0.1em',
                }}
              >
                LEGACY & MIGRATION
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {[
                  'WordPress',
                  'PHP',
                  'MySQL',
                  'PostgreSQL',
                  'API Integrations',
                  'Data Migration',
                ].map((tech, i) => (
                  <span key={i} style={{ fontSize: '13px', color: 'var(--soft-gray)' }}>
                    {tech}
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
            We meet you where you are — whether that's optimizing legacy systems or building from
            scratch.
          </p>
        </div>
      </div>
    </section>
  )
}
