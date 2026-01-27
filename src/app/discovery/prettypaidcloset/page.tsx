'use client'

import React, { useState, useEffect, useCallback } from 'react'

interface FormData {
  businessName: string
  contactName: string
  email: string
  phone: string
  website: string
  socialHandles: string
  currentChallenges: string
  goals: string
  services: string
  inventorySize: string
  hoursPerWeek: string
  currentTools: string
  mustHaveFeatures: string
  targetCustomer: string
  timeline: string
  additionalInfo: string
}

export default function PrettyPaidClosetDiscovery() {
  const [formData, setFormData] = useState<FormData>({
    businessName: 'Pretty Paid Closet',
    contactName: '',
    email: '',
    phone: '',
    website: '',
    socialHandles: '',
    currentChallenges: '',
    goals: '',
    services: '',
    inventorySize: '',
    hoursPerWeek: '',
    currentTools: '',
    mustHaveFeatures: '',
    targetCustomer: '',
    timeline: '',
    additionalInfo: '',
  })
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle')
  const [focusedField, setFocusedField] = useState<string | null>(null)

  // Pretty Paid Closet Brand Colors
  const roseGold = '#B76E79'
  const hotPink = '#FF69B4'
  const gold = '#D4AF37'
  const softCream = '#FFF8F0'
  const charcoal = '#2D2D2D'
  const blushPink = '#FFB6C1'

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('submitting')

    try {
      const response = await fetch('/api/discovery', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
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

  const inputStyle = (field: string) => ({
    width: '100%',
    padding: '16px 20px',
    background: 'white',
    border: `1px solid ${focusedField === field ? roseGold : 'rgba(183,110,121,0.2)'}`,
    color: charcoal,
    fontSize: '15px',
    outline: 'none',
    transition: 'border-color 0.3s ease, box-shadow 0.3s ease',
    borderRadius: '10px',
    boxShadow: focusedField === field ? `0 0 0 3px rgba(183,110,121,0.1)` : 'none',
  })

  const labelStyle = {
    display: 'block',
    fontSize: '11px',
    fontWeight: 600,
    letterSpacing: '0.12em',
    textTransform: 'uppercase' as const,
    color: roseGold,
    marginBottom: '8px',
  }

  if (status === 'success') {
    return (
      <main
        className="ppc-portal"
        style={{
          minHeight: '100vh',
          background: `linear-gradient(135deg, ${softCream} 0%, #FFF5F5 100%)`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '40px 24px',
          fontFamily: "'DM Sans', -apple-system, sans-serif",
        }}
      >
        <div style={{ textAlign: 'center', maxWidth: '500px' }}>
          <div
            style={{
              width: '100px',
              height: '100px',
              borderRadius: '50%',
              background: `linear-gradient(135deg, ${roseGold}, ${hotPink})`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 32px',
              boxShadow: `0 20px 60px rgba(183,110,121,0.3)`,
            }}
          >
            <svg width="50" height="50" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
              <path d="M20 6L9 17l-5-5" />
            </svg>
          </div>
          <h1
            style={{
              fontSize: '34px',
              fontWeight: 300,
              marginBottom: '16px',
              fontFamily: "'Cormorant Garamond', Georgia, serif",
              color: charcoal,
              letterSpacing: '0.02em',
              fontStyle: 'italic',
            }}
          >
            Discovery Submitted
          </h1>
          <p style={{ color: '#777', fontSize: '17px', lineHeight: 1.8 }}>
            Thank you, Jazz! We've received your discovery form and will be in touch within 24 hours.
          </p>
          <a
            href="/client/prettypaidcloset"
            style={{
              display: 'inline-block',
              marginTop: '32px',
              padding: '16px 40px',
              background: `linear-gradient(135deg, ${roseGold}, ${hotPink})`,
              color: 'white',
              textDecoration: 'none',
              fontSize: '13px',
              fontWeight: 600,
              letterSpacing: '0.1em',
              borderRadius: '10px',
              transition: 'transform 0.3s ease, box-shadow 0.3s ease',
              boxShadow: `0 10px 32px rgba(183,110,121,0.3)`,
            }}
          >
            VIEW YOUR DASHBOARD →
          </a>
        </div>
      </main>
    )
  }

  return (
    <main
      className="ppc-portal"
      style={{
        minHeight: '100vh',
        background: `linear-gradient(135deg, ${softCream} 0%, #FFF5F5 50%, #FFFAF5 100%)`,
        color: charcoal,
        fontFamily: "'DM Sans', -apple-system, sans-serif",
      }}
    >
      {/* Header */}
      <header
        style={{
          padding: '20px 40px',
          borderBottom: `1px solid rgba(183,110,121,0.1)`,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          background: 'rgba(255,255,255,0.9)',
          backdropFilter: 'blur(10px)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{
            fontFamily: "'Cormorant Garamond', Georgia, serif",
            fontSize: '18px',
            fontWeight: 300,
            color: charcoal,
            letterSpacing: '0.04em',
            textTransform: 'uppercase',
          }}>
            Pretty Paid
          </span>
          <span style={{
            fontFamily: "'Cormorant Garamond', Georgia, serif",
            fontSize: '12px',
            fontWeight: 400,
            fontStyle: 'italic',
            color: roseGold,
            letterSpacing: '0.08em',
          }}>
            closet
          </span>
        </div>
        <a
          href="/client/prettypaidcloset/dashboard"
          style={{
            fontSize: '11px',
            fontWeight: 600,
            letterSpacing: '0.12em',
            color: roseGold,
            textTransform: 'uppercase',
            textDecoration: 'none',
            padding: '10px 18px',
            border: `1px solid rgba(183,110,121,0.3)`,
            borderRadius: '8px',
            transition: 'all 0.3s ease',
          }}
        >
          Dashboard
        </a>
      </header>

      {/* Form Container */}
      <div
        style={{
          maxWidth: '800px',
          margin: '0 auto',
          padding: '50px 40px',
        }}
      >
        {/* Title */}
        <div style={{ marginBottom: '44px', textAlign: 'center' }}>
          <span
            style={{
              color: roseGold,
              fontSize: '11px',
              fontWeight: 600,
              letterSpacing: '0.25em',
              textTransform: 'uppercase',
              display: 'block',
              marginBottom: '14px',
            }}
          >
            L7 SHIFT × PRETTY PAID CLOSET
          </span>
          <h1
            style={{
              fontSize: 'clamp(30px, 5vw, 44px)',
              fontWeight: 300,
              lineHeight: 1.2,
              marginBottom: '14px',
              fontFamily: "'Cormorant Garamond', Georgia, serif",
              color: charcoal,
              letterSpacing: '0.02em',
              fontStyle: 'italic',
            }}
          >
            Project Discovery
          </h1>
          <p style={{ color: '#888', fontSize: '15px', lineHeight: 1.8, maxWidth: '480px', margin: '0 auto' }}>
            Let's understand your vision for Pretty Paid Closet and build something extraordinary together.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          {/* Contact Info Section */}
          <div
            style={{
              marginBottom: '40px',
              background: 'white',
              borderRadius: '16px',
              padding: '28px',
              border: '1px solid rgba(183,110,121,0.1)',
              boxShadow: '0 4px 24px rgba(183,110,121,0.04)',
            }}
          >
            <h2
              style={{
                fontSize: '12px',
                fontWeight: 600,
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
                color: roseGold,
                marginBottom: '22px',
                paddingBottom: '12px',
                borderBottom: `1px solid rgba(183,110,121,0.1)`,
              }}
            >
              Contact Information
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px' }}>
              <div>
                <label style={labelStyle}>Your Name *</label>
                <input
                  type="text"
                  required
                  value={formData.contactName}
                  onChange={(e) => setFormData({ ...formData, contactName: e.target.value })}
                  onFocus={() => setFocusedField('contactName')}
                  onBlur={() => setFocusedField(null)}
                  style={inputStyle('contactName')}
                  placeholder="Jazz"
                />
              </div>
              <div>
                <label style={labelStyle}>Email *</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  onFocus={() => setFocusedField('email')}
                  onBlur={() => setFocusedField(null)}
                  style={inputStyle('email')}
                  placeholder="closetsbyjazz@gmail.com"
                />
              </div>
              <div>
                <label style={labelStyle}>Phone</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  onFocus={() => setFocusedField('phone')}
                  onBlur={() => setFocusedField(null)}
                  style={inputStyle('phone')}
                  placeholder="(704) 555-0123"
                />
              </div>
              <div>
                <label style={labelStyle}>Poshmark Handle</label>
                <input
                  type="text"
                  value={formData.socialHandles}
                  onChange={(e) => setFormData({ ...formData, socialHandles: e.target.value })}
                  onFocus={() => setFocusedField('socialHandles')}
                  onBlur={() => setFocusedField(null)}
                  style={inputStyle('socialHandles')}
                  placeholder="@prettypaidclset"
                />
              </div>
            </div>
          </div>

          {/* Business Goals Section */}
          <div
            style={{
              marginBottom: '40px',
              background: 'white',
              borderRadius: '16px',
              padding: '28px',
              border: '1px solid rgba(255,105,180,0.1)',
              boxShadow: '0 4px 24px rgba(255,105,180,0.04)',
            }}
          >
            <h2
              style={{
                fontSize: '12px',
                fontWeight: 600,
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
                color: hotPink,
                marginBottom: '22px',
                paddingBottom: '12px',
                borderBottom: `1px solid rgba(255,105,180,0.1)`,
              }}
            >
              Your Vision
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div>
                <label style={{ ...labelStyle, color: hotPink }}>Current Challenges *</label>
                <textarea
                  required
                  value={formData.currentChallenges}
                  onChange={(e) => setFormData({ ...formData, currentChallenges: e.target.value })}
                  onFocus={() => setFocusedField('currentChallenges')}
                  onBlur={() => setFocusedField(null)}
                  style={{ ...inputStyle('currentChallenges'), minHeight: '110px', resize: 'vertical' }}
                  placeholder="What's holding you back? What frustrates you about your current setup?"
                />
              </div>
              <div>
                <label style={{ ...labelStyle, color: hotPink }}>Goals & Vision *</label>
                <textarea
                  required
                  value={formData.goals}
                  onChange={(e) => setFormData({ ...formData, goals: e.target.value })}
                  onFocus={() => setFocusedField('goals')}
                  onBlur={() => setFocusedField(null)}
                  style={{ ...inputStyle('goals'), minHeight: '110px', resize: 'vertical' }}
                  placeholder="Where do you see Pretty Paid Closet in 6-12 months? What does success look like?"
                />
              </div>
            </div>
          </div>

          {/* Services & Operations Section */}
          <div
            style={{
              marginBottom: '40px',
              background: 'white',
              borderRadius: '16px',
              padding: '28px',
              border: '1px solid rgba(212,175,55,0.1)',
              boxShadow: '0 4px 24px rgba(212,175,55,0.04)',
            }}
          >
            <h2
              style={{
                fontSize: '12px',
                fontWeight: 600,
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
                color: gold,
                marginBottom: '22px',
                paddingBottom: '12px',
                borderBottom: `1px solid rgba(212,175,55,0.1)`,
              }}
            >
              Your Business
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div>
                <label style={{ ...labelStyle, color: gold }}>Which services do you want to offer? *</label>
                <textarea
                  required
                  value={formData.services}
                  onChange={(e) => setFormData({ ...formData, services: e.target.value })}
                  onFocus={() => setFocusedField('services')}
                  onBlur={() => setFocusedField(null)}
                  style={{ ...inputStyle('services'), minHeight: '90px', resize: 'vertical' }}
                  placeholder="e.g., Consignment sales, Closet organization appointments, Donation pickups with tax receipts..."
                />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px' }}>
                <div>
                  <label style={{ ...labelStyle, color: gold }}>Current inventory size</label>
                  <select
                    value={formData.inventorySize}
                    onChange={(e) => setFormData({ ...formData, inventorySize: e.target.value })}
                    onFocus={() => setFocusedField('inventorySize')}
                    onBlur={() => setFocusedField(null)}
                    style={{ ...inputStyle('inventorySize'), cursor: 'pointer' }}
                  >
                    <option value="">Select range</option>
                    <option value="< 50">Under 50 items</option>
                    <option value="50-150">50-150 items</option>
                    <option value="150-500">150-500 items</option>
                    <option value="500+">500+ items</option>
                  </select>
                </div>
                <div>
                  <label style={{ ...labelStyle, color: gold }}>Hours per week on business</label>
                  <select
                    value={formData.hoursPerWeek}
                    onChange={(e) => setFormData({ ...formData, hoursPerWeek: e.target.value })}
                    onFocus={() => setFocusedField('hoursPerWeek')}
                    onBlur={() => setFocusedField(null)}
                    style={{ ...inputStyle('hoursPerWeek'), cursor: 'pointer' }}
                  >
                    <option value="">Select range</option>
                    <option value="< 5">Under 5 hours</option>
                    <option value="5-15">5-15 hours</option>
                    <option value="15-30">15-30 hours</option>
                    <option value="30+">30+ hours (full-time)</option>
                  </select>
                </div>
              </div>
              <div>
                <label style={{ ...labelStyle, color: gold }}>How do you currently manage inventory & sales?</label>
                <textarea
                  value={formData.currentTools}
                  onChange={(e) => setFormData({ ...formData, currentTools: e.target.value })}
                  onFocus={() => setFocusedField('currentTools')}
                  onBlur={() => setFocusedField(null)}
                  style={{ ...inputStyle('currentTools'), minHeight: '80px', resize: 'vertical' }}
                  placeholder="e.g., Spreadsheets, Poshmark app only, notes on phone, nothing formal..."
                />
              </div>
            </div>
          </div>

          {/* Features & Timeline Section */}
          <div
            style={{
              marginBottom: '40px',
              background: 'white',
              borderRadius: '16px',
              padding: '28px',
              border: '1px solid rgba(183,110,121,0.1)',
              boxShadow: '0 4px 24px rgba(183,110,121,0.04)',
            }}
          >
            <h2
              style={{
                fontSize: '12px',
                fontWeight: 600,
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
                color: roseGold,
                marginBottom: '22px',
                paddingBottom: '12px',
                borderBottom: `1px solid rgba(183,110,121,0.1)`,
              }}
            >
              Platform Needs
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div>
                <label style={{ ...labelStyle, color: roseGold }}>What features matter most to you? *</label>
                <textarea
                  required
                  value={formData.mustHaveFeatures}
                  onChange={(e) => setFormData({ ...formData, mustHaveFeatures: e.target.value })}
                  onFocus={() => setFocusedField('mustHaveFeatures')}
                  onBlur={() => setFocusedField(null)}
                  style={{ ...inputStyle('mustHaveFeatures'), minHeight: '100px', resize: 'vertical' }}
                  placeholder="e.g., Online store without Poshmark fees, booking system for closet org appointments, donation tracking with tax receipts, inventory management..."
                />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px' }}>
                <div>
                  <label style={{ ...labelStyle, color: roseGold }}>When do you want to launch?</label>
                  <select
                    value={formData.timeline}
                    onChange={(e) => setFormData({ ...formData, timeline: e.target.value })}
                    onFocus={() => setFocusedField('timeline')}
                    onBlur={() => setFocusedField(null)}
                    style={{ ...inputStyle('timeline'), cursor: 'pointer' }}
                  >
                    <option value="">Select timeline</option>
                    <option value="asap">As soon as possible</option>
                    <option value="1-2 weeks">1-2 weeks</option>
                    <option value="1 month">Within a month</option>
                    <option value="flexible">Flexible / No rush</option>
                  </select>
                </div>
                <div>
                  <label style={{ ...labelStyle, color: roseGold }}>Who are your ideal customers?</label>
                  <input
                    type="text"
                    value={formData.targetCustomer}
                    onChange={(e) => setFormData({ ...formData, targetCustomer: e.target.value })}
                    onFocus={() => setFocusedField('targetCustomer')}
                    onBlur={() => setFocusedField(null)}
                    style={inputStyle('targetCustomer')}
                    placeholder="e.g., Women 25-40, trend-conscious, budget-savvy"
                  />
                </div>
              </div>
              <div>
                <label style={{ ...labelStyle, color: roseGold }}>Anything else we should know?</label>
                <textarea
                  value={formData.additionalInfo}
                  onChange={(e) => setFormData({ ...formData, additionalInfo: e.target.value })}
                  onFocus={() => setFocusedField('additionalInfo')}
                  onBlur={() => setFocusedField(null)}
                  style={{ ...inputStyle('additionalInfo'), minHeight: '90px', resize: 'vertical' }}
                  placeholder="Links to sites you love, specific features, questions, concerns..."
                />
              </div>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={status === 'submitting'}
            style={{
              width: '100%',
              padding: '20px 40px',
              background: `linear-gradient(135deg, ${roseGold}, ${hotPink})`,
              color: 'white',
              fontSize: '14px',
              fontWeight: 600,
              letterSpacing: '0.12em',
              border: 'none',
              borderRadius: '12px',
              cursor: status === 'submitting' ? 'wait' : 'pointer',
              opacity: status === 'submitting' ? 0.7 : 1,
              transition: 'all 0.3s ease',
              boxShadow: `0 10px 40px rgba(183,110,121,0.3)`,
              textTransform: 'uppercase',
            }}
          >
            {status === 'submitting' ? 'SUBMITTING...' : 'SUBMIT DISCOVERY'}
          </button>

          {status === 'error' && (
            <p style={{ color: '#E57373', marginTop: '16px', textAlign: 'center', fontSize: '14px' }}>
              Something went wrong. Please try again or email us directly at hello@l7shift.com
            </p>
          )}
        </form>

        {/* Footer */}
        <div
          style={{
            marginTop: '50px',
            paddingTop: '30px',
            borderTop: `1px solid rgba(183,110,121,0.1)`,
            textAlign: 'center',
          }}
        >
          <p style={{ color: '#999', fontSize: '11px', letterSpacing: '0.1em' }}>
            POWERED BY{' '}
            <a href="https://l7shift.com" style={{ color: roseGold, textDecoration: 'none' }}>
              L7 SHIFT
            </a>
          </p>
        </div>
      </div>
    </main>
  )
}
