'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'

// Card holder data
const cardHolders: Record<string, CardHolder> = {
  ken: {
    name: 'Ken Leftwich',
    title: 'Founder & Chief Architect',
    company: 'L7 Shift',
    tagline: 'Digital transformation for the non-conformist.',
    email: 'ken@l7shift.com',
    phone: '(704) 839-9448',
    website: 'https://l7shift.com',
    socials: {
      linkedin: 'https://linkedin.com/in/kenleftwich',
      twitter: 'https://x.com/CharlotteAgency',
      github: 'https://github.com/ScatPackCLT',
    },
  },
}

interface CardHolder {
  name: string
  title: string
  company: string
  tagline: string
  email: string
  phone: string
  website: string
  socials: {
    linkedin?: string
    twitter?: string
    github?: string
  }
}

// Generate vCard for download
function downloadVCard(holder: CardHolder) {
  const vcard = `BEGIN:VCARD
VERSION:3.0
FN:${holder.name}
ORG:${holder.company}
TITLE:${holder.title}
EMAIL:${holder.email}
TEL:${holder.phone}
URL:${holder.website}
END:VCARD`
  const blob = new Blob([vcard], { type: 'text/vcard' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `${holder.name.replace(/\s+/g, '_')}.vcf`
  a.click()
  URL.revokeObjectURL(url)
}

// Icons
const LinkedInIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
  </svg>
)

const XIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
  </svg>
)

const GitHubIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
  </svg>
)

const EmailIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="2" y="4" width="20" height="16" rx="2"/>
    <path d="M22 6L12 13L2 6"/>
  </svg>
)

const PhoneIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z"/>
  </svg>
)

const WebIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="10"/>
    <line x1="2" y1="12" x2="22" y2="12"/>
    <path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"/>
  </svg>
)

export default function DigitalCard() {
  const params = useParams()
  const slug = params.slug as string
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const holder = cardHolders[slug]

  if (!mounted) {
    return (
      <div style={{
        minHeight: '100dvh',
        background: '#FFFFFF',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'system-ui, sans-serif',
      }}>
        <div style={{ color: '#888' }}>Loading...</div>
      </div>
    )
  }

  if (!holder) {
    return (
      <div style={{
        minHeight: '100dvh',
        background: '#FFFFFF',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 16,
        fontFamily: 'system-ui, sans-serif',
      }}>
        <h1 style={{ fontSize: 24, fontWeight: 700, color: '#111' }}>Card not found</h1>
        <p style={{ color: '#666' }}>The requested digital card does not exist.</p>
      </div>
    )
  }

  return (
    <div style={{
      minHeight: '100dvh',
      background: '#FFFFFF',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 20,
      fontFamily: "'Inter', system-ui, sans-serif",
    }}>
      {/* Card */}
      <div style={{
        width: '100%',
        maxWidth: 400,
        background: '#0A0A0A',
        borderRadius: 20,
        padding: '40px 32px',
        position: 'relative',
        overflow: 'hidden',
        boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)',
      }}>
        {/* Top gradient bar */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: 4,
          background: 'linear-gradient(90deg, #00F0FF, #FF00AA, #BFFF00)',
        }} />

        {/* Corner accents */}
        <div style={{ position: 'absolute', top: 16, left: 16, width: 24, height: 24, borderTop: '2px solid #00F0FF', borderLeft: '2px solid #00F0FF', opacity: 0.5 }} />
        <div style={{ position: 'absolute', top: 16, right: 16, width: 24, height: 24, borderTop: '2px solid #00F0FF', borderRight: '2px solid #00F0FF', opacity: 0.5 }} />
        <div style={{ position: 'absolute', bottom: 16, left: 16, width: 24, height: 24, borderBottom: '2px solid #00F0FF', borderLeft: '2px solid #00F0FF', opacity: 0.5 }} />
        <div style={{ position: 'absolute', bottom: 16, right: 16, width: 24, height: 24, borderBottom: '2px solid #00F0FF', borderRight: '2px solid #00F0FF', opacity: 0.5 }} />

        {/* L7 Logo */}
        <div style={{
          textAlign: 'center',
          marginBottom: 28,
          fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
          fontSize: 12,
          fontWeight: 700,
          letterSpacing: 4,
          color: '#666',
        }}>
          L7 <span style={{ fontWeight: 300 }}>SHIFT</span>
        </div>

        {/* Avatar */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 24 }}>
          <div style={{
            width: 100,
            height: 100,
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #00F0FF, #FF00AA)',
            padding: 3,
            boxShadow: '0 0 40px rgba(0, 240, 255, 0.3)',
          }}>
            <div style={{
              width: '100%',
              height: '100%',
              borderRadius: '50%',
              background: '#1A1A1A',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 32,
              fontWeight: 700,
              color: '#FAFAFA',
              fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
            }}>
              {holder.name.split(' ').map(n => n[0]).join('')}
            </div>
          </div>
        </div>

        {/* Name */}
        <h1 style={{
          margin: 0,
          fontSize: 28,
          fontWeight: 700,
          color: '#FAFAFA',
          textAlign: 'center',
          fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
          letterSpacing: -0.5,
        }}>
          {holder.name}
        </h1>

        {/* Title */}
        <p style={{
          margin: '10px 0 4px',
          fontSize: 11,
          fontWeight: 700,
          color: '#00F0FF',
          textAlign: 'center',
          letterSpacing: 2,
          textTransform: 'uppercase',
        }}>
          {holder.title}
        </p>

        {/* Company */}
        <p style={{
          margin: 0,
          fontSize: 13,
          color: '#888',
          textAlign: 'center',
        }}>
          {holder.company}
        </p>

        {/* Tagline */}
        <p style={{
          margin: '16px 0 0',
          fontSize: 13,
          color: 'rgba(255,255,255,0.4)',
          textAlign: 'center',
          fontStyle: 'italic',
        }}>
          "{holder.tagline}"
        </p>

        {/* Divider */}
        <div style={{
          margin: '28px auto',
          width: '50%',
          height: 1,
          background: 'linear-gradient(90deg, transparent, rgba(0,240,255,0.3), rgba(255,0,170,0.3), transparent)',
        }} />

        {/* Social Icons */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: 14, marginBottom: 28 }}>
          {holder.socials.linkedin && (
            <a
              href={holder.socials.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                width: 48,
                height: 48,
                borderRadius: '50%',
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#FAFAFA',
                textDecoration: 'none',
              }}
            >
              <LinkedInIcon />
            </a>
          )}
          {holder.socials.twitter && (
            <a
              href={holder.socials.twitter}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                width: 48,
                height: 48,
                borderRadius: '50%',
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#FAFAFA',
                textDecoration: 'none',
              }}
            >
              <XIcon />
            </a>
          )}
          {holder.socials.github && (
            <a
              href={holder.socials.github}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                width: 48,
                height: 48,
                borderRadius: '50%',
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#FAFAFA',
                textDecoration: 'none',
              }}
            >
              <GitHubIcon />
            </a>
          )}
        </div>

        {/* Contact Links */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 28 }}>
          <a
            href={`mailto:${holder.email}`}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 14,
              padding: '14px 18px',
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: 12,
              color: '#FAFAFA',
              textDecoration: 'none',
              fontSize: 14,
            }}
          >
            <span style={{ color: '#00F0FF' }}><EmailIcon /></span>
            <span>{holder.email}</span>
          </a>
          <a
            href={`tel:${holder.phone}`}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 14,
              padding: '14px 18px',
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: 12,
              color: '#FAFAFA',
              textDecoration: 'none',
              fontSize: 14,
            }}
          >
            <span style={{ color: '#FF00AA' }}><PhoneIcon /></span>
            <span>{holder.phone}</span>
          </a>
          <a
            href={holder.website}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 14,
              padding: '14px 18px',
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: 12,
              color: '#FAFAFA',
              textDecoration: 'none',
              fontSize: 14,
            }}
          >
            <span style={{ color: '#BFFF00' }}><WebIcon /></span>
            <span>{holder.website.replace('https://', '')}</span>
          </a>
        </div>

        {/* Save Contact Button */}
        <button
          onClick={() => downloadVCard(holder)}
          style={{
            width: '100%',
            padding: '18px 24px',
            background: 'linear-gradient(135deg, #00F0FF, #FF00AA)',
            border: 'none',
            borderRadius: 12,
            color: '#0A0A0A',
            fontSize: 15,
            fontWeight: 700,
            fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
            cursor: 'pointer',
          }}
        >
          Save Contact
        </button>

        {/* Footer */}
        <div style={{
          marginTop: 24,
          textAlign: 'center',
          fontSize: 11,
          color: 'rgba(255,255,255,0.25)',
        }}>
          Powered by{' '}
          <span style={{
            background: 'linear-gradient(90deg, #00F0FF, #FF00AA)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            fontWeight: 600,
          }}>
            ShiftCards™
          </span>
        </div>
      </div>
    </div>
  )
}
