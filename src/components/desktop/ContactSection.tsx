'use client'

import React from 'react'
import Link from 'next/link'

interface ContactSectionProps {
  formData?: { name: string; email: string; message: string }
  formStatus?: 'idle' | 'loading' | 'success' | 'error'
  setFormData?: React.Dispatch<React.SetStateAction<{ name: string; email: string; message: string }>>
  handleSubmit?: (e: React.FormEvent) => Promise<void>
  onHoverStart: () => void
  onHoverEnd: () => void
}

export function ContactSection({
  onHoverStart,
  onHoverEnd,
}: ContactSectionProps) {
  return (
    <section
      id="contact"
      style={{
        padding: '160px 60px',
        background: 'var(--void-black)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Animated gradient background */}
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '150%',
          height: '150%',
          background:
            'radial-gradient(ellipse at center, rgba(0,240,255,0.1) 0%, transparent 50%), radial-gradient(ellipse at 70% 30%, rgba(255,0,170,0.1) 0%, transparent 50%)',
          filter: 'blur(80px)',
          animation: 'pulse 8s ease-in-out infinite',
        }}
      />

      {/* Geometric shapes */}
      <div
        style={{
          position: 'absolute',
          top: '20%',
          left: '10%',
          width: '200px',
          height: '200px',
          border: '1px solid var(--electric-cyan)',
          transform: 'rotate(45deg)',
          opacity: 0.1,
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: '20%',
          right: '10%',
          width: '300px',
          height: '300px',
          border: '1px solid var(--hot-magenta)',
          transform: 'rotate(45deg)',
          opacity: 0.1,
        }}
      />

      <div style={{ maxWidth: '900px', margin: '0 auto', position: 'relative', zIndex: 1, textAlign: 'center' }}>
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
          START A PROJECT
        </span>

        <h2
          className="glitch"
          data-text="Ready to shift?"
          style={{
            fontSize: 'clamp(48px, 6vw, 80px)',
            lineHeight: 1.05,
            marginBottom: '32px',
          }}
        >
          Ready to shift?
        </h2>

        <p
          style={{
            fontSize: '20px',
            color: 'var(--soft-gray)',
            marginBottom: '48px',
            lineHeight: 1.8,
            maxWidth: '600px',
            margin: '0 auto 48px',
          }}
        >
          Describe your vision. Our platform will scope it, price it, and show you what's possible — in minutes, not meetings.
        </p>

        <div style={{ display: 'flex', justifyContent: 'center', gap: '24px', flexWrap: 'wrap' }}>
          <Link
            href="/start"
            className="btn-primary"
            onMouseEnter={onHoverStart}
            onMouseLeave={onHoverEnd}
            style={{
              padding: '20px 48px',
              fontSize: '15px',
            }}
          >
            START A PROJECT
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
          </Link>

          <a
            href="mailto:hello@l7shift.com"
            onMouseEnter={onHoverStart}
            onMouseLeave={onHoverEnd}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '20px 32px',
              border: '1px solid rgba(255,255,255,0.2)',
              color: 'var(--soft-gray)',
              textDecoration: 'none',
              fontSize: '15px',
              fontWeight: 500,
              transition: 'all 0.3s ease',
            }}
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
              <polyline points="22,6 12,13 2,6" />
            </svg>
            hello@l7shift.com
          </a>
        </div>
      </div>
    </section>
  )
}
