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
  company: string
  website: string
  projectType: string
  description: string
  timeline: string
  budget: string
  referral: string
}

export default function StartPage() {
  const { mousePos, isHovering, handleHoverStart, handleHoverEnd } = useMouseTracking()
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    phone: '',
    company: '',
    website: '',
    projectType: '',
    description: '',
    timeline: '',
    budget: '',
    referral: '',
  })
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle')

  const voidBlack = '#0A0A0A'
  const cyan = '#00F0FF'
  const magenta = '#FF00AA'
  const lime = '#BFFF00'

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
NEW PROJECT INQUIRY

Contact: ${formData.name}
Email: ${formData.email}
Phone: ${formData.phone || 'Not provided'}
Company: ${formData.company || 'Not provided'}
Website: ${formData.website || 'Not provided'}

Project Type: ${formData.projectType}
Timeline: ${formData.timeline}
Budget: ${formData.budget}

Description:
${formData.description}

How they found us: ${formData.referral || 'Not specified'}
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
    fontWeight: 600,
    letterSpacing: '0.15em',
    color: '#888',
    marginBottom: '8px',
    textTransform: 'uppercase' as const,
  }

  const selectStyle = {
    ...inputStyle,
    cursor: 'pointer',
    appearance: 'none' as const,
    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23888' d='M6 8L1 3h10z'/%3E%3C/svg%3E")`,
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'right 16px center',
  }

  if (status === 'success') {
    return (
      <div
        style={{
          minHeight: '100vh',
          background: voidBlack,
          color: '#FAFAFA',
          fontFamily: "'Inter', -apple-system, sans-serif",
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '40px',
        }}
      >
        <CustomCursor mousePos={mousePos} isHovering={isHovering} />
        <GradientBar position="fixed" top={0} left={0} right={0} zIndex={100} />

        <div style={{ textAlign: 'center', maxWidth: '600px' }}>
          <div
            style={{
              width: '80px',
              height: '80px',
              borderRadius: '50%',
              background: `linear-gradient(135deg, ${cyan}, ${lime})`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 32px',
              fontSize: '40px',
            }}
          >
            ✓
          </div>
          <h1
            style={{
              fontSize: 'clamp(32px, 5vw, 48px)',
              fontWeight: 800,
              marginBottom: '16px',
              fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
            }}
          >
            We got it.
          </h1>
          <p style={{ fontSize: '18px', color: '#888', marginBottom: '40px', lineHeight: 1.7 }}>
            Expect a response within 24 hours. We'll review your project details and reach out to schedule a discovery call.
          </p>
          <Link
            href="/"
            onMouseEnter={handleHoverStart}
            onMouseLeave={handleHoverEnd}
            style={{
              display: 'inline-block',
              padding: '16px 32px',
              background: `linear-gradient(135deg, ${cyan}, ${magenta})`,
              color: voidBlack,
              textDecoration: 'none',
              fontSize: '13px',
              fontWeight: 700,
              letterSpacing: '0.1em',
            }}
          >
            BACK TO HOME
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        background: voidBlack,
        color: '#FAFAFA',
        fontFamily: "'Inter', -apple-system, sans-serif",
      }}
    >
      <CustomCursor mousePos={mousePos} isHovering={isHovering} />
      <GradientBar position="fixed" top={0} left={0} right={0} zIndex={100} />

      {/* Navigation */}
      <nav
        style={{
          position: 'fixed',
          top: 4,
          left: 0,
          right: 0,
          zIndex: 99,
          padding: '24px 60px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          background: 'linear-gradient(180deg, rgba(10,10,10,0.98) 0%, rgba(10,10,10,0) 100%)',
          backdropFilter: 'blur(10px)',
        }}
      >
        <Link
          href="/"
          style={{ display: 'flex', flexDirection: 'column', gap: '0px', textDecoration: 'none' }}
          onMouseEnter={handleHoverStart}
          onMouseLeave={handleHoverEnd}
        >
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px' }}>
            <span
              className="glitch"
              data-text="L7"
              style={{
                fontFamily: 'Helvetica Neue, sans-serif',
                fontSize: '36px',
                fontWeight: 500,
                letterSpacing: '-0.02em',
                color: '#FAFAFA',
              }}
            >
              L7
            </span>
            <span
              style={{
                fontFamily: 'Helvetica Neue, sans-serif',
                fontSize: '24px',
                fontWeight: 300,
                letterSpacing: '0.15em',
                color: 'var(--soft-gray)',
                marginLeft: '8px',
              }}
            >
              SHIFT
            </span>
          </div>
          <div
            style={{
              width: '100%',
              height: '2px',
              background:
                'linear-gradient(90deg, var(--electric-cyan), var(--hot-magenta), var(--acid-lime), var(--electric-cyan))',
              backgroundSize: '200% 100%',
              animation: 'gradientFlow 4s ease-in-out infinite',
              marginTop: '1px',
            }}
          />
          <span
            style={{
              fontSize: '9px',
              fontWeight: 600,
              letterSpacing: '0.25em',
              color: 'var(--soft-gray)',
              textTransform: 'uppercase',
              marginTop: '2px',
            }}
          >
            Break the Square
          </span>
        </Link>
      </nav>

      {/* Form Content */}
      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '140px 40px 80px' }}>
        <div style={{ marginBottom: '60px' }}>
          <span
            style={{
              fontSize: '11px',
              fontWeight: 600,
              letterSpacing: '0.25em',
              color: cyan,
              display: 'block',
              marginBottom: '16px',
            }}
          >
            START A PROJECT
          </span>
          <h1
            style={{
              fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
              fontSize: 'clamp(32px, 5vw, 56px)',
              fontWeight: 800,
              lineHeight: 1.1,
              marginBottom: '20px',
              letterSpacing: '-0.02em',
            }}
          >
            Tell us about your <span style={{ color: cyan }}>vision.</span>
          </h1>
          <p style={{ fontSize: '17px', color: '#888', lineHeight: 1.7, maxWidth: '600px' }}>
            No pitch decks. No BS. Just a quick conversation starter so we can understand what you're building and how we might help.
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Contact Section */}
          <div style={{ marginBottom: '48px' }}>
            <h2
              style={{
                fontSize: '13px',
                fontWeight: 700,
                letterSpacing: '0.15em',
                color: lime,
                marginBottom: '24px',
                textTransform: 'uppercase',
              }}
            >
              Contact Info
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
              <div>
                <label style={labelStyle}>Name *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  style={inputStyle}
                  onFocus={(e) => {
                    e.target.style.borderColor = cyan
                    e.target.style.background = 'rgba(0,240,255,0.03)'
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = 'rgba(255,255,255,0.1)'
                    e.target.style.background = 'rgba(255,255,255,0.03)'
                  }}
                />
              </div>
              <div>
                <label style={labelStyle}>Email *</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  style={inputStyle}
                  onFocus={(e) => {
                    e.target.style.borderColor = cyan
                    e.target.style.background = 'rgba(0,240,255,0.03)'
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = 'rgba(255,255,255,0.1)'
                    e.target.style.background = 'rgba(255,255,255,0.03)'
                  }}
                />
              </div>
              <div>
                <label style={labelStyle}>Phone</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  style={inputStyle}
                  onFocus={(e) => {
                    e.target.style.borderColor = cyan
                    e.target.style.background = 'rgba(0,240,255,0.03)'
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = 'rgba(255,255,255,0.1)'
                    e.target.style.background = 'rgba(255,255,255,0.03)'
                  }}
                />
              </div>
              <div>
                <label style={labelStyle}>Company</label>
                <input
                  type="text"
                  value={formData.company}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  style={inputStyle}
                  onFocus={(e) => {
                    e.target.style.borderColor = cyan
                    e.target.style.background = 'rgba(0,240,255,0.03)'
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = 'rgba(255,255,255,0.1)'
                    e.target.style.background = 'rgba(255,255,255,0.03)'
                  }}
                />
              </div>
            </div>
            <div style={{ marginTop: '20px' }}>
              <label style={labelStyle}>Current Website (if any)</label>
              <input
                type="url"
                placeholder="https://"
                value={formData.website}
                onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                style={inputStyle}
                onFocus={(e) => {
                  e.target.style.borderColor = cyan
                  e.target.style.background = 'rgba(0,240,255,0.03)'
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = 'rgba(255,255,255,0.1)'
                  e.target.style.background = 'rgba(255,255,255,0.03)'
                }}
              />
            </div>
          </div>

          {/* Project Section */}
          <div style={{ marginBottom: '48px' }}>
            <h2
              style={{
                fontSize: '13px',
                fontWeight: 700,
                letterSpacing: '0.15em',
                color: magenta,
                marginBottom: '24px',
                textTransform: 'uppercase',
              }}
            >
              Project Details
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', marginBottom: '20px' }}>
              <div>
                <label style={labelStyle}>What do you need? *</label>
                <select
                  required
                  value={formData.projectType}
                  onChange={(e) => setFormData({ ...formData, projectType: e.target.value })}
                  style={selectStyle}
                  onFocus={(e) => {
                    e.target.style.borderColor = cyan
                    e.target.style.background = 'rgba(0,240,255,0.03)'
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = 'rgba(255,255,255,0.1)'
                    e.target.style.background = 'rgba(255,255,255,0.03)'
                  }}
                >
                  <option value="">Select...</option>
                  <option value="website">Website / Landing Page</option>
                  <option value="webapp">Web Application / SaaS</option>
                  <option value="ecommerce">E-commerce / Online Store</option>
                  <option value="mobile">Mobile App</option>
                  <option value="redesign">Redesign / Rebrand</option>
                  <option value="optimization">Optimization / Performance</option>
                  <option value="consulting">Strategy / Consulting</option>
                  <option value="other">Something Else</option>
                </select>
              </div>
              <div>
                <label style={labelStyle}>Timeline *</label>
                <select
                  required
                  value={formData.timeline}
                  onChange={(e) => setFormData({ ...formData, timeline: e.target.value })}
                  style={selectStyle}
                  onFocus={(e) => {
                    e.target.style.borderColor = cyan
                    e.target.style.background = 'rgba(0,240,255,0.03)'
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = 'rgba(255,255,255,0.1)'
                    e.target.style.background = 'rgba(255,255,255,0.03)'
                  }}
                >
                  <option value="">Select...</option>
                  <option value="asap">ASAP (Rush)</option>
                  <option value="1-2weeks">1-2 Weeks</option>
                  <option value="1month">About a Month</option>
                  <option value="2-3months">2-3 Months</option>
                  <option value="flexible">Flexible / No Rush</option>
                </select>
              </div>
            </div>
            <div style={{ marginBottom: '20px' }}>
              <label style={labelStyle}>Budget Range *</label>
              <select
                required
                value={formData.budget}
                onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                style={selectStyle}
                onFocus={(e) => {
                  e.target.style.borderColor = cyan
                  e.target.style.background = 'rgba(0,240,255,0.03)'
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = 'rgba(255,255,255,0.1)'
                  e.target.style.background = 'rgba(255,255,255,0.03)'
                }}
              >
                <option value="">Select...</option>
                <option value="under5k">Under $5,000</option>
                <option value="5k-15k">$5,000 - $15,000</option>
                <option value="15k-30k">$15,000 - $30,000</option>
                <option value="30k-50k">$30,000 - $50,000</option>
                <option value="50k+">$50,000+</option>
                <option value="unsure">Not sure yet</option>
              </select>
            </div>
            <div>
              <label style={labelStyle}>Tell us about your project *</label>
              <textarea
                required
                rows={5}
                placeholder="What are you building? What problem does it solve? What does success look like?"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                style={{ ...inputStyle, resize: 'vertical', minHeight: '140px' }}
                onFocus={(e) => {
                  e.target.style.borderColor = cyan
                  e.target.style.background = 'rgba(0,240,255,0.03)'
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = 'rgba(255,255,255,0.1)'
                  e.target.style.background = 'rgba(255,255,255,0.03)'
                }}
              />
            </div>
          </div>

          {/* Referral Section */}
          <div style={{ marginBottom: '48px' }}>
            <label style={labelStyle}>How did you find us?</label>
            <select
              value={formData.referral}
              onChange={(e) => setFormData({ ...formData, referral: e.target.value })}
              style={selectStyle}
              onFocus={(e) => {
                e.target.style.borderColor = cyan
                e.target.style.background = 'rgba(0,240,255,0.03)'
              }}
              onBlur={(e) => {
                e.target.style.borderColor = 'rgba(255,255,255,0.1)'
                e.target.style.background = 'rgba(255,255,255,0.03)'
              }}
            >
              <option value="">Select...</option>
              <option value="referral">Referral / Word of Mouth</option>
              <option value="google">Google Search</option>
              <option value="social">Social Media</option>
              <option value="linkedin">LinkedIn</option>
              <option value="existing">Existing Client</option>
              <option value="other">Other</option>
            </select>
          </div>

          {/* Submit */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '24px', flexWrap: 'wrap' }}>
            <button
              type="submit"
              disabled={status === 'submitting'}
              onMouseEnter={handleHoverStart}
              onMouseLeave={handleHoverEnd}
              style={{
                padding: '18px 40px',
                background: status === 'submitting' ? '#333' : `linear-gradient(135deg, ${cyan}, ${magenta})`,
                color: status === 'submitting' ? '#888' : voidBlack,
                border: 'none',
                fontSize: '14px',
                fontWeight: 700,
                letterSpacing: '0.1em',
                cursor: status === 'submitting' ? 'wait' : 'pointer',
                transition: 'all 0.2s',
              }}
            >
              {status === 'submitting' ? 'SENDING...' : 'SEND IT'}
            </button>
            {status === 'error' && (
              <span style={{ color: magenta, fontSize: '14px' }}>
                Something went wrong. Please try again or email us directly.
              </span>
            )}
          </div>
        </form>

        {/* Footer note */}
        <div style={{ marginTop: '80px', paddingTop: '40px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
          <p style={{ fontSize: '13px', color: '#666', lineHeight: 1.7 }}>
            Prefer to talk first? Email us at{' '}
            <a
              href="mailto:hello@l7shift.com"
              style={{ color: cyan, textDecoration: 'none' }}
              onMouseEnter={handleHoverStart}
              onMouseLeave={handleHoverEnd}
            >
              hello@l7shift.com
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}
