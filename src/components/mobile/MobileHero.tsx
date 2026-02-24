'use client'

import React from 'react'

export function MobileHero() {
  return (
    <section
      id="hero"
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: '100px 24px 60px',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Gradient Glow */}
      <div
        style={{
          position: 'absolute',
          top: '20%',
          right: '-20%',
          width: '300px',
          height: '300px',
          background: 'radial-gradient(circle, rgba(0,240,255,0.2) 0%, transparent 70%)',
          filter: 'blur(60px)',
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: '20%',
          left: '-10%',
          width: '250px',
          height: '250px',
          background: 'radial-gradient(circle, rgba(255,0,170,0.15) 0%, transparent 70%)',
          filter: 'blur(60px)',
        }}
      />

      {/* Breaking Square Visual - Mobile Version */}
      <div
        style={{
          position: 'absolute',
          top: '15%',
          right: '5%',
          width: '120px',
          height: '120px',
          pointerEvents: 'none',
        }}
      >
        {/* Central square */}
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            width: '60px',
            height: '60px',
            border: '1.5px solid var(--electric-cyan)',
            transform: 'translate(-50%, -50%) rotate(45deg)',
            animation: 'pulse 4s ease-in-out infinite',
            opacity: 0.6,
          }}
        />
        {/* Fragment 1 */}
        <div
          style={{
            position: 'absolute',
            top: '10%',
            left: '60%',
            width: '25px',
            height: '25px',
            borderTop: '1.5px solid var(--hot-magenta)',
            borderRight: '1.5px solid var(--hot-magenta)',
            transform: 'rotate(45deg)',
            animation: 'float 5s ease-in-out infinite',
            opacity: 0.5,
          }}
        />
        {/* Fragment 2 */}
        <div
          style={{
            position: 'absolute',
            bottom: '15%',
            left: '20%',
            width: '30px',
            height: '30px',
            borderBottom: '1.5px solid var(--acid-lime)',
            borderLeft: '1.5px solid var(--acid-lime)',
            transform: 'rotate(30deg)',
            animation: 'float 6s ease-in-out infinite',
            animationDelay: '1s',
            opacity: 0.5,
          }}
        />
        {/* Orbiting dot */}
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            width: '5px',
            height: '5px',
            background: 'var(--electric-cyan)',
            borderRadius: '50%',
            boxShadow: '0 0 10px var(--electric-cyan)',
            animation: 'orbit 10s linear infinite',
            transformOrigin: '-30px 0',
          }}
        />
        {/* Glow */}
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            width: '80px',
            height: '80px',
            background: 'radial-gradient(circle, rgba(0,240,255,0.15) 0%, transparent 70%)',
            transform: 'translate(-50%, -50%)',
            filter: 'blur(20px)',
            animation: 'pulse 3s ease-in-out infinite',
          }}
        />
      </div>

      {/* Content */}
      <div style={{ position: 'relative', zIndex: 1 }}>
        {/* Badge */}
        <div
          style={{
            display: 'inline-block',
            padding: '8px 16px',
            border: '1px solid var(--electric-cyan)',
            marginBottom: '32px',
          }}
        >
          <span
            style={{
              color: 'var(--electric-cyan)',
              fontSize: '10px',
              fontWeight: 600,
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
            }}
          >
            Strategy • Systems • Solutions
          </span>
        </div>

        {/* Headline */}
        <h1
          style={{
            fontSize: 'clamp(42px, 12vw, 72px)',
            lineHeight: 0.95,
            marginBottom: '32px',
            fontWeight: 700,
          }}
        >
          <span style={{ display: 'block' }}>Stop being</span>
          <span
            className="glitch"
            data-text="square."
            style={{
              display: 'inline-block',
              background: 'linear-gradient(135deg, var(--electric-cyan), var(--hot-magenta))',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            square.
          </span>
        </h1>

        {/* Subhead */}
        <p
          style={{
            fontSize: '16px',
            color: 'var(--soft-gray)',
            lineHeight: 1.7,
            marginBottom: '40px',
            maxWidth: '400px',
          }}
        >
          The AI-native venture studio that partners with domain experts to build
          revenue-sharing software products. Charlotte-based. Methodology-driven.
        </p>

        {/* CTA Buttons */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <a
            href="/start"
            className="btn-primary"
            style={{
              justifyContent: 'center',
              padding: '18px 32px',
            }}
          >
            LET'S TALK
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </a>
          <a
            href="/#process"
            className="btn-secondary"
            style={{
              justifyContent: 'center',
              padding: '18px 32px',
            }}
          >
            HOW IT WORKS
          </a>
        </div>
      </div>

      {/* Quick Stats */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '48px',
          marginTop: '60px',
        }}
      >
        <div style={{ textAlign: 'center' }}>
          <span
            style={{
              fontSize: '28px',
              fontWeight: 700,
              color: 'var(--electric-cyan)',
              display: 'block',
              lineHeight: 1,
            }}
          >
            Fast
          </span>
          <span
            style={{
              fontSize: '10px',
              color: 'var(--soft-gray)',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
            }}
          >
            Delivery
          </span>
        </div>
        <div style={{ textAlign: 'center' }}>
          <span
            style={{
              fontSize: '28px',
              fontWeight: 700,
              color: 'var(--hot-magenta)',
              display: 'block',
              lineHeight: 1,
            }}
          >
            Real
          </span>
          <span
            style={{
              fontSize: '10px',
              color: 'var(--soft-gray)',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
            }}
          >
            Results
          </span>
        </div>
      </div>
    </section>
  )
}
