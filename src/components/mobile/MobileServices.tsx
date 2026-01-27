'use client'

import React from 'react'

export function MobileServices() {
  const services = [
    {
      num: '01',
      title: 'BUILD',
      subtitle: 'Custom Apps & Websites',
      desc: 'From MVPs to full platforms. AI-powered tools. Modern stacks. No bloated enterprise BS.',
      features: ['Web Apps', 'Mobile', 'AI Integration', 'E-Commerce', 'SaaS', 'Automation'],
      color: 'var(--electric-cyan)',
    },
    {
      num: '02',
      title: 'BRAND',
      subtitle: 'Identity & Strategy',
      desc: 'Logos that stick. Messaging that cuts through. Positioning that makes you unforgettable.',
      features: ['Strategy', 'Visual Identity', 'Guidelines', 'Naming', 'Pitch Decks', 'Collateral'],
      color: 'var(--hot-magenta)',
    },
    {
      num: '03',
      title: 'SHIFT',
      subtitle: 'Business Transformation',
      desc: 'Process automation. AI integration. New revenue streams. Futureproofing operations.',
      features: ['AI Strategy', 'Automation', 'Operations', 'Tech Strategy', 'Growth', 'Training'],
      color: 'var(--acid-lime)',
    },
  ]

  return (
    <section
      id="services"
      style={{
        padding: '80px 24px',
        position: 'relative',
      }}
    >
      {/* Section Header */}
      <div style={{ marginBottom: '48px' }}>
        <span
          style={{
            color: 'var(--acid-lime)',
            fontSize: '11px',
            fontWeight: 700,
            letterSpacing: '0.25em',
            textTransform: 'uppercase',
            display: 'block',
            marginBottom: '16px',
          }}
        >
          THE SOLUTION
        </span>
        <h2
          style={{
            fontSize: 'clamp(32px, 8vw, 48px)',
            lineHeight: 1.1,
          }}
        >
          We help you{' '}
          <span style={{ fontStyle: 'italic', color: 'var(--acid-lime)' }}>break</span> the box.
        </h2>
      </div>

      {/* Service Cards - Vertical Stack */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        {services.map((service, i) => (
          <div
            key={i}
            style={{
              background: 'var(--carbon-gray)',
              border: '1px solid rgba(255,255,255,0.05)',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            {/* Color bar at top */}
            <div
              style={{
                height: '4px',
                background: service.color,
                boxShadow: `0 0 20px ${service.color}`,
              }}
            />

            <div style={{ padding: '32px 24px' }}>
              {/* Number */}
              <span
                style={{
                  fontSize: '48px',
                  fontWeight: 700,
                  color: service.color,
                  opacity: 0.2,
                  position: 'absolute',
                  top: '16px',
                  right: '16px',
                  lineHeight: 1,
                }}
              >
                {service.num}
              </span>

              {/* Title */}
              <h3
                style={{
                  fontSize: '32px',
                  fontWeight: 700,
                  marginBottom: '8px',
                  color: service.color,
                }}
              >
                {service.title}
              </h3>

              <p
                style={{
                  fontSize: '14px',
                  fontWeight: 500,
                  marginBottom: '16px',
                  color: 'var(--soft-gray)',
                }}
              >
                {service.subtitle}
              </p>

              <p
                style={{
                  fontSize: '14px',
                  color: 'var(--soft-gray)',
                  lineHeight: 1.7,
                  marginBottom: '24px',
                }}
              >
                {service.desc}
              </p>

              {/* Features */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '8px',
                }}
              >
                {service.features.map((feature, j) => (
                  <span
                    key={j}
                    style={{
                      fontSize: '12px',
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
                        background: service.color,
                      }}
                    />
                    {feature}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
