'use client'

import React from 'react'
import Link from 'next/link'

interface MobileContactProps {
  formData?: { name: string; email: string; message: string }
  formStatus?: 'idle' | 'loading' | 'success' | 'error'
  setFormData?: React.Dispatch<React.SetStateAction<{ name: string; email: string; message: string }>>
  handleSubmit?: (e: React.FormEvent) => Promise<void>
}

export function MobileContact({}: MobileContactProps) {
  return (
    <section
      id="contact"
      style={{
        padding: '80px 24px',
        background: 'var(--void-black)',
        position: 'relative',
        textAlign: 'center',
      }}
    >
      {/* Gradient glow */}
      <div
        style={{
          position: 'absolute',
          top: '10%',
          right: '-20%',
          width: '200px',
          height: '200px',
          background: 'radial-gradient(circle, rgba(0,240,255,0.15) 0%, transparent 70%)',
          filter: 'blur(60px)',
        }}
      />

      {/* Content */}
      <div style={{ position: 'relative', zIndex: 1 }}>
        <span
          style={{
            color: 'var(--electric-cyan)',
            fontSize: '11px',
            fontWeight: 700,
            letterSpacing: '0.25em',
            textTransform: 'uppercase',
            display: 'block',
            marginBottom: '16px',
          }}
        >
          START A PROJECT
        </span>
        <h2
          style={{
            fontSize: 'clamp(32px, 8vw, 48px)',
            lineHeight: 1.1,
            marginBottom: '16px',
          }}
        >
          Ready to shift?
        </h2>
        <p
          style={{
            fontSize: '15px',
            color: 'var(--soft-gray)',
            lineHeight: 1.7,
            marginBottom: '32px',
          }}
        >
          Describe your vision. Our platform scopes it in minutes, not meetings.
        </p>

        {/* CTA Buttons */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <Link
            href="/start"
            className="btn-primary"
            style={{
              width: '100%',
              justifyContent: 'center',
              padding: '18px',
            }}
          >
            START A PROJECT
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </Link>

          <a
            href="mailto:hello@l7shift.com"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '12px',
              padding: '16px',
              border: '1px solid rgba(255,255,255,0.2)',
              color: 'var(--soft-gray)',
              textDecoration: 'none',
              fontSize: '15px',
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
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
