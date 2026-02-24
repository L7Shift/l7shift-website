'use client'

import React from 'react'

export function MobilePricing() {
  const tiers = [
    {
      type: 'LAUNCH',
      price: 'Fixed Price',
      desc: 'Complete product delivery',
      features: ['Full-stack app or platform', 'Delivered in days, not months', 'Includes brand assets & deployment'],
      color: 'var(--electric-cyan)',
    },
    {
      type: 'GROWTH',
      price: 'Subscription',
      desc: 'Continuous platform access',
      features: ['Ongoing feature development', 'Priority AI agent allocation', 'Monitoring, updates & scaling'],
      color: 'var(--hot-magenta)',
    },
    {
      type: 'PARTNER',
      price: 'Equity',
      desc: 'Startup collaboration',
      features: ['Reduced cost + equity alignment', 'Full commitment to success', 'For early-stage companies'],
      color: 'var(--acid-lime)',
    },
  ]

  return (
    <section
      id="investment"
      style={{
        padding: '80px 24px',
        background: 'var(--clean-white)',
        color: 'var(--void-black)',
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
          INVESTMENT
        </span>
        <h2
          style={{
            fontSize: 'clamp(32px, 8vw, 48px)',
            lineHeight: 1.1,
            color: 'var(--void-black)',
          }}
        >
          Simple, Productized Pricing
        </h2>
      </div>

      {/* Pricing Cards - Stacked */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {tiers.map((tier, i) => (
          <div
            key={i}
            style={{
              background: 'var(--void-black)',
              color: 'var(--clean-white)',
              overflow: 'hidden',
            }}
          >
            {/* Color bar */}
            <div
              style={{
                height: '4px',
                background: tier.color,
                boxShadow: `0 0 20px ${tier.color}`,
              }}
            />

            <div style={{ padding: '28px 24px' }}>
              <h3
                style={{
                  fontSize: '24px',
                  fontWeight: 700,
                  marginBottom: '8px',
                }}
              >
                {tier.type}
              </h3>
              <p
                style={{
                  fontSize: '28px',
                  fontWeight: 700,
                  color: tier.color,
                  marginBottom: '4px',
                }}
              >
                {tier.price}
              </p>
              <p
                style={{
                  fontSize: '13px',
                  color: 'var(--soft-gray)',
                  marginBottom: '24px',
                }}
              >
                {tier.desc}
              </p>

              <ul
                style={{
                  listStyle: 'none',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px',
                }}
              >
                {tier.features.map((feature, j) => (
                  <li
                    key={j}
                    style={{
                      fontSize: '14px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                    }}
                  >
                    <span
                      style={{
                        width: '6px',
                        height: '6px',
                        background: tier.color,
                        flexShrink: 0,
                      }}
                    />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
