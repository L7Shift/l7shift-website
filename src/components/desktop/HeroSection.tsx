'use client'

import React from 'react'

interface HeroSectionProps {
  scrollY: number
  onHoverStart: () => void
  onHoverEnd: () => void
}

export function HeroSection({ scrollY, onHoverStart, onHoverEnd }: HeroSectionProps) {
  return (
    <section
      id="hero"
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        padding: '140px 60px 60px',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Gradient Glow */}
      <div
        style={{
          position: 'absolute',
          top: '30%',
          right: '10%',
          width: '600px',
          height: '600px',
          background: 'radial-gradient(circle, rgba(0,240,255,0.15) 0%, transparent 70%)',
          filter: 'blur(60px)',
          transform: `translate(${scrollY * 0.1}px, ${scrollY * 0.05}px)`,
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: '10%',
          left: '20%',
          width: '400px',
          height: '400px',
          background: 'radial-gradient(circle, rgba(255,0,170,0.1) 0%, transparent 70%)',
          filter: 'blur(60px)',
        }}
      />

      {/* Hero Grid - Left Content + Right Visual */}
      <div
        style={{
          maxWidth: '1400px',
          width: '100%',
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '60px',
          alignItems: 'center',
          position: 'relative',
          zIndex: 1,
        }}
      >
        {/* Left - Content */}
        <div>
          <div
            className="reveal-up visible delay-1"
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
                fontSize: '12px',
                fontWeight: 600,
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
              }}
            >
              Strategy • Systems • Solutions
            </span>
          </div>

          <h1
            className="reveal-up visible delay-2"
            style={{
              fontSize: 'clamp(48px, 8vw, 100px)',
              lineHeight: 0.95,
              marginBottom: '40px',
              fontWeight: 700,
            }}
          >
            <span style={{ display: 'block' }}>Stop being</span>
            <span
              className="glitch"
              data-text="square."
              onMouseEnter={onHoverStart}
              onMouseLeave={onHoverEnd}
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

          <div
            className="reveal-up visible delay-3"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '24px',
              marginBottom: '48px',
            }}
          >
            <div
              style={{
                width: '80px',
                height: '2px',
                background: 'linear-gradient(90deg, var(--electric-cyan), var(--hot-magenta))',
              }}
            />
            <p
              style={{
                fontSize: '20px',
                color: 'var(--soft-gray)',
                maxWidth: '500px',
                lineHeight: 1.7,
              }}
            >
              The AI-native venture studio that partners with domain experts to build revenue-sharing software products. Strategy to systems to solutions — from Charlotte to everywhere.
            </p>
          </div>

          <div
            className="reveal-up visible delay-4"
            style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}
          >
            <a
              href="/start"
              className="btn-primary"
              onMouseEnter={onHoverStart}
              onMouseLeave={onHoverEnd}
            >
              LET'S TALK
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
              >
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </a>
            <a
              href="/#process"
              className="btn-secondary"
              onMouseEnter={onHoverStart}
              onMouseLeave={onHoverEnd}
            >
              HOW IT WORKS
            </a>
          </div>
        </div>

        {/* Right - Breaking Square Visual */}
        <div
          style={{
            position: 'relative',
            height: '500px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {/* Animated Breaking Square */}
          <div
            className="breaking-square-container"
            onMouseEnter={onHoverStart}
            onMouseLeave={onHoverEnd}
            style={{
              position: 'relative',
              width: '320px',
              height: '320px',
            }}
          >
            {/* Central square that "breaks" */}
            <div
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                width: '160px',
                height: '160px',
                border: '2px solid var(--electric-cyan)',
                transform: 'translate(-50%, -50%) rotate(45deg)',
                animation: 'pulse 4s ease-in-out infinite',
              }}
            />

            {/* Fragment 1 - top */}
            <div
              style={{
                position: 'absolute',
                top: '10%',
                left: '50%',
                width: '60px',
                height: '60px',
                borderTop: '2px solid var(--hot-magenta)',
                borderRight: '2px solid var(--hot-magenta)',
                transform: 'translateX(-50%) rotate(45deg)',
                animation: 'float 5s ease-in-out infinite',
              }}
            />

            {/* Fragment 2 - right */}
            <div
              style={{
                position: 'absolute',
                top: '50%',
                right: '5%',
                width: '50px',
                height: '50px',
                borderBottom: '2px solid var(--acid-lime)',
                borderRight: '2px solid var(--acid-lime)',
                transform: 'translateY(-50%) rotate(-15deg)',
                animation: 'float 6s ease-in-out infinite',
                animationDelay: '1s',
              }}
            />

            {/* Fragment 3 - bottom */}
            <div
              style={{
                position: 'absolute',
                bottom: '8%',
                left: '40%',
                width: '70px',
                height: '70px',
                borderBottom: '2px solid var(--electric-cyan)',
                borderLeft: '2px solid var(--electric-cyan)',
                transform: 'rotate(30deg)',
                animation: 'float 4s ease-in-out infinite',
                animationDelay: '2s',
              }}
            />

            {/* Fragment 4 - left */}
            <div
              style={{
                position: 'absolute',
                top: '30%',
                left: '8%',
                width: '40px',
                height: '40px',
                border: '2px solid var(--hot-magenta)',
                transform: 'rotate(60deg)',
                animation: 'float 7s ease-in-out infinite',
                animationDelay: '0.5s',
              }}
            />

            {/* Glow in center */}
            <div
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                width: '200px',
                height: '200px',
                background: 'radial-gradient(circle, rgba(0,240,255,0.2) 0%, transparent 70%)',
                transform: 'translate(-50%, -50%)',
                filter: 'blur(40px)',
                animation: 'pulse 3s ease-in-out infinite',
              }}
            />

            {/* Orbiting dot 1 */}
            <div
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                width: '8px',
                height: '8px',
                background: 'var(--electric-cyan)',
                borderRadius: '50%',
                boxShadow: '0 0 20px var(--electric-cyan)',
                animation: 'orbit 8s linear infinite',
                transformOrigin: '-60px 0',
              }}
            />

            {/* Orbiting dot 2 */}
            <div
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                width: '6px',
                height: '6px',
                background: 'var(--hot-magenta)',
                borderRadius: '50%',
                boxShadow: '0 0 15px var(--hot-magenta)',
                animation: 'orbit 12s linear infinite reverse',
                transformOrigin: '-100px 0',
              }}
            />
          </div>

          {/* Quick Stats */}
          <div
            style={{
              position: 'absolute',
              bottom: '20px',
              right: '0',
              display: 'flex',
              gap: '40px',
            }}
          >
            <div style={{ textAlign: 'right' }}>
              <span
                style={{
                  fontSize: '36px',
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
                  fontSize: '11px',
                  color: 'var(--soft-gray)',
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                }}
              >
                Delivery
              </span>
            </div>
            <div style={{ textAlign: 'right' }}>
              <span
                style={{
                  fontSize: '36px',
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
                  fontSize: '11px',
                  color: 'var(--soft-gray)',
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                }}
              >
                Results
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div
        style={{
          position: 'absolute',
          bottom: '60px',
          left: '60px',
          display: 'flex',
          alignItems: 'center',
          gap: '16px',
        }}
      >
        <div
          style={{
            width: '1px',
            height: '60px',
            background: 'linear-gradient(180deg, var(--electric-cyan), transparent)',
          }}
        />
        <span
          style={{
            fontSize: '11px',
            letterSpacing: '0.2em',
            color: 'var(--carbon-gray)',
            writingMode: 'vertical-rl',
            textOrientation: 'mixed',
          }}
        >
          SCROLL TO EXPLORE
        </span>
      </div>
    </section>
  )
}
