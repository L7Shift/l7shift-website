'use client'

import React from 'react'

interface InvestmentSectionProps {
  onHoverStart: () => void
  onHoverEnd: () => void
}

export function InvestmentSection({ onHoverStart, onHoverEnd }: InvestmentSectionProps) {
  const tiers = [
    {
      type: 'PROJECT',
      price: 'Fixed Scope',
      desc: 'One-time builds',
      features: ['Defined scope & deliverables', 'Clear timeline & milestones', 'Perfect for MVPs, brands, sites'],
      color: 'var(--electric-cyan)',
    },
    {
      type: 'RETAINER',
      price: 'Ongoing',
      desc: 'Monthly partnership',
      features: ['Dedicated capacity monthly', 'Priority support & iterations', 'Continuous improvement'],
      color: 'var(--hot-magenta)',
    },
    {
      type: 'PARTNER',
      price: 'Equity',
      desc: 'Startup collaboration',
      features: ['Reduced cash + equity stake', 'Full commitment to success', 'For early-stage companies'],
      color: 'var(--acid-lime)',
    },
  ]

  return (
    <section
      id="investment"
      style={{
        padding: '160px 60px',
        background: 'var(--clean-white)',
        color: 'var(--void-black)',
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
          INVESTMENT
        </span>

        <h2
          style={{
            fontSize: 'clamp(48px, 6vw, 80px)',
            lineHeight: 1.05,
            marginBottom: '100px',
            color: 'var(--void-black)',
          }}
        >
          Flexible Engagement Models
        </h2>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '32px',
          }}
        >
          {tiers.map((tier, i) => (
            <div
              key={i}
              onMouseEnter={onHoverStart}
              onMouseLeave={onHoverEnd}
              style={{
                background: 'var(--void-black)',
                color: 'var(--clean-white)',
                position: 'relative',
                overflow: 'hidden',
                transition: 'all 0.4s ease',
              }}
            >
              <div
                style={{
                  height: '6px',
                  background: tier.color,
                  boxShadow: `0 0 40px ${tier.color}`,
                }}
              />
              <div style={{ padding: '48px 40px' }}>
                <h3
                  style={{
                    fontSize: '32px',
                    fontWeight: 700,
                    marginBottom: '12px',
                  }}
                >
                  {tier.type}
                </h3>
                <p
                  style={{
                    fontSize: '40px',
                    fontWeight: 700,
                    color: tier.color,
                    marginBottom: '8px',
                  }}
                >
                  {tier.price}
                </p>
                <p
                  style={{
                    fontSize: '14px',
                    color: 'var(--soft-gray)',
                    marginBottom: '40px',
                  }}
                >
                  {tier.desc}
                </p>
                <ul
                  style={{
                    listStyle: 'none',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '16px',
                  }}
                >
                  {tier.features.map((feature, j) => (
                    <li
                      key={j}
                      style={{
                        fontSize: '15px',
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
      </div>
    </section>
  )
}
