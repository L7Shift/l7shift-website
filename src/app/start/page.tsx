'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useMouseTracking } from '@/hooks/useMouseTracking'
import { CustomCursor } from '@/components/desktop/CustomCursor'
import { GradientBar } from '@/components/shared/GradientBar'

type FormData = {
  name: string
  email: string
  phone: string
  message: string
}

export default function StartPage() {
  const { mousePos, isHovering, handleHoverStart, handleHoverEnd } = useMouseTracking()
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    phone: '',
    message: '',
  })
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle')

  const voidBlack = '#0A0A0A'
  const cyan = '#00F0FF'
  const magenta = '#FF00AA'

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('submitting')

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          message: `
NEW INQUIRY - Let's Talk

Name: ${formData.name}
Email: ${formData.email}
Phone: ${formData.phone || 'Not provided'}

${formData.message ? `Message:\n${formData.message}` : 'No message provided - quick intro requested'}
          `.trim(),
        }),
      })

      if (response.ok) {
        setStatus('success')
      } else {
        setStatus('error')
      }
    } catch {
      setStatus('error')
    }
  }

  const inputStyle = {
    width: '100%',
    padding: '16px 20px',
    background: 'rgba(255,255,255,0.03)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '0',
    color: '#FAFAFA',
    fontSize: '15px',
    fontFamily: 'Inter, -apple-system, sans-serif',
    outline: 'none',
    transition: 'border-color 0.2s, background 0.2s',
  }

  const labelStyle = {
    display: 'block',
    fontSize: '11px',
    fontWeight: 600 as const,
    letterSpacing: '2px',
    textTransform: 'uppercase' as const,
    color: cyan,
    marginBottom: '8px',
    fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
  }

  if (status === 'success') {
    return (
      <div style={{
        minHeight: '100vh',
        background: voidBlack,
        display: 'flex',
        flexDirection: 'column',
      }}>
        <CustomCursor mousePos={mousePos} isHovering={isHovering} />
        <GradientBar />

        {/* Header */}
        <header style={{
          padding: '20px 40px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
          <Link
            href="/"
            style={{
              fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
              fontSize: '18px',
              fontWeight: 700,
              color: '#FAFAFA',
              textDecoration: 'none',
            }}
            onMouseEnter={handleHoverStart}
            onMouseLeave={handleHoverEnd}
          >
            L7 <span style={{ fontWeight: 300 }}>SHIFT</span>
          </Link>
        </header>

        {/* Success Message */}
        <main style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '40px 20px',
          textAlign: 'center',
        }}>
          <div style={{
            width: 80,
            height: 80,
            borderRadius: '50%',
            background: `linear-gradient(135deg, ${cyan}, ${magenta})`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 32,
            fontSize: 36,
          }}>
            ✓
          </div>

          <h1 style={{
            fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
            fontSize: '36px',
            fontWeight: 700,
            color: '#FAFAFA',
            marginBottom: 16,
          }}>
            Got it!
          </h1>

          <p style={{
            fontSize: '16px',
            color: '#888',
            maxWidth: 400,
            lineHeight: 1.6,
            marginBottom: 32,
          }}>
            We review every submission personally. Expect to hear from us within 24 hours.
          </p>

          <Link
            href="/"
            style={{
              padding: '14px 28px',
              border: `1px solid rgba(255,255,255,0.2)`,
              borderRadius: 0,
              color: '#FAFAFA',
              textDecoration: 'none',
              fontSize: '14px',
              fontWeight: 600,
              transition: 'all 0.2s',
            }}
            onMouseEnter={handleHoverStart}
            onMouseLeave={handleHoverEnd}
          >
            Back to Home
          </Link>
        </main>
      </div>
    )
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: voidBlack,
      display: 'flex',
      flexDirection: 'column',
    }}>
      <CustomCursor mousePos={mousePos} isHovering={isHovering} />
      <GradientBar />

      {/* Header */}
      <header style={{
        padding: '20px 40px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
        <Link
          href="/"
          style={{
            fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
            fontSize: '18px',
            fontWeight: 700,
            color: '#FAFAFA',
            textDecoration: 'none',
          }}
          onMouseEnter={handleHoverStart}
          onMouseLeave={handleHoverEnd}
        >
          L7 <span style={{ fontWeight: 300 }}>SHIFT</span>
        </Link>
      </header>

      {/* Main Content */}
      <main style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '40px 20px',
      }}>
        <div style={{
          width: '100%',
          maxWidth: 480,
        }}>
          {/* Title */}
          <div style={{ marginBottom: 40, textAlign: 'center' }}>
            <h1 style={{
              fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
              fontSize: '42px',
              fontWeight: 700,
              color: '#FAFAFA',
              marginBottom: 12,
              letterSpacing: '-1px',
            }}>
              Let's Talk
            </h1>
            <p style={{
              fontSize: '16px',
              color: '#888',
              lineHeight: 1.6,
            }}>
              Tell us who you are. We'll be in touch within 24 hours.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            {/* Name */}
            <div>
              <label style={labelStyle}>Name *</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Your name"
                style={inputStyle}
                onFocus={(e) => {
                  e.target.style.borderColor = cyan
                  e.target.style.background = 'rgba(0, 240, 255, 0.03)'
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = 'rgba(255,255,255,0.1)'
                  e.target.style.background = 'rgba(255,255,255,0.03)'
                }}
              />
            </div>

            {/* Email */}
            <div>
              <label style={labelStyle}>Email *</label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="you@company.com"
                style={inputStyle}
                onFocus={(e) => {
                  e.target.style.borderColor = cyan
                  e.target.style.background = 'rgba(0, 240, 255, 0.03)'
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = 'rgba(255,255,255,0.1)'
                  e.target.style.background = 'rgba(255,255,255,0.03)'
                }}
              />
            </div>

            {/* Phone */}
            <div>
              <label style={labelStyle}>Phone <span style={{ opacity: 0.5, fontWeight: 400 }}>(optional)</span></label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="(555) 123-4567"
                style={inputStyle}
                onFocus={(e) => {
                  e.target.style.borderColor = cyan
                  e.target.style.background = 'rgba(0, 240, 255, 0.03)'
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = 'rgba(255,255,255,0.1)'
                  e.target.style.background = 'rgba(255,255,255,0.03)'
                }}
              />
            </div>

            {/* Message */}
            <div>
              <label style={labelStyle}>What's on your mind? <span style={{ opacity: 0.5, fontWeight: 400 }}>(optional)</span></label>
              <textarea
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                placeholder="Brief overview of what you're looking for..."
                rows={3}
                style={{
                  ...inputStyle,
                  resize: 'vertical',
                  minHeight: '80px',
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = cyan
                  e.target.style.background = 'rgba(0, 240, 255, 0.03)'
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = 'rgba(255,255,255,0.1)'
                  e.target.style.background = 'rgba(255,255,255,0.03)'
                }}
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={status === 'submitting'}
              style={{
                width: '100%',
                padding: '18px 24px',
                background: `linear-gradient(135deg, ${cyan}, ${magenta})`,
                border: 'none',
                borderRadius: 0,
                color: voidBlack,
                fontSize: '16px',
                fontWeight: 700,
                fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
                cursor: status === 'submitting' ? 'wait' : 'pointer',
                opacity: status === 'submitting' ? 0.7 : 1,
                transition: 'all 0.2s',
              }}
              onMouseEnter={handleHoverStart}
              onMouseLeave={handleHoverEnd}
            >
              {status === 'submitting' ? 'Sending...' : "Let's Connect"}
            </button>

            {status === 'error' && (
              <p style={{ color: '#ff4444', fontSize: '14px', textAlign: 'center' }}>
                Something went wrong. Please try again or email us directly.
              </p>
            )}
          </form>

          {/* Footer note */}
          <p style={{
            marginTop: 32,
            fontSize: '13px',
            color: '#666',
            textAlign: 'center',
          }}>
            Prefer email? Reach us at{' '}
            <a
              href="mailto:ken@l7shift.com"
              style={{ color: cyan, textDecoration: 'none' }}
              onMouseEnter={handleHoverStart}
              onMouseLeave={handleHoverEnd}
            >
              ken@l7shift.com
            </a>
          </p>
        </div>
      </main>
    </div>
  )
}
