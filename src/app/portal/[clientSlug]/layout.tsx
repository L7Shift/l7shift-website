'use client'

import { ReactNode } from 'react'
import Link from 'next/link'
import { usePathname, useParams } from 'next/navigation'

interface PortalLayoutProps {
  children: ReactNode
}

// Client configurations - will come from database
const clientConfigs: Record<string, {
  name: string
  logo?: string
  primaryColor: string
  accentColor: string
}> = {
  'scat-pack-clt': {
    name: 'Scat Pack CLT',
    primaryColor: '#00F0FF',
    accentColor: '#BFFF00',
  },
  'prettypaidcloset': {
    name: 'Pretty Paid Closet',
    primaryColor: '#B76E79',
    accentColor: '#FF69B4',
  },
  'stitchwichs': {
    name: 'Stitchwichs',
    primaryColor: '#8B5CF6',
    accentColor: '#F59E0B',
  },
}

export default function PortalLayout({ children }: PortalLayoutProps) {
  const pathname = usePathname()
  const params = useParams()
  const clientSlug = params.clientSlug as string
  const config = clientConfigs[clientSlug] || {
    name: 'Client Portal',
    primaryColor: '#00F0FF',
    accentColor: '#BFFF00',
  }

  const navItems = [
    { href: `/portal/${clientSlug}`, icon: '📊', label: 'Dashboard' },
    { href: `/portal/${clientSlug}/deliverables`, icon: '📁', label: 'Deliverables' },
    { href: `/portal/${clientSlug}/requirements`, icon: '📝', label: 'Requirements' },
    { href: `/portal/${clientSlug}/activity`, icon: '🕐', label: 'Activity' },
  ]

  return (
    <div
      className="client-portal"
      style={{
        minHeight: '100vh',
        background: '#0A0A0A',
        color: '#FAFAFA',
        fontFamily: "'Inter', -apple-system, sans-serif",
      }}
    >
      {/* Top Header */}
      <header
        style={{
          padding: '16px 32px',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          background: 'rgba(10, 10, 10, 0.95)',
          backdropFilter: 'blur(10px)',
          position: 'sticky',
          top: 0,
          zIndex: 100,
        }}
      >
        {/* Logo & Client Name */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ fontSize: 20, fontWeight: 500, color: '#FAFAFA' }}>L7</span>
            <span style={{ fontSize: 14, fontWeight: 300, color: '#888', letterSpacing: '0.15em' }}>SHIFT</span>
          </Link>
          <div style={{ width: 1, height: 24, background: 'rgba(255,255,255,0.2)' }} />
          <span
            style={{
              fontSize: 14,
              fontWeight: 600,
              color: config.primaryColor,
            }}
          >
            {config.name}
          </span>
        </div>

        {/* Nav */}
        <nav style={{ display: 'flex', gap: 8 }}>
          {navItems.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  padding: '8px 16px',
                  borderRadius: 8,
                  textDecoration: 'none',
                  color: isActive ? config.primaryColor : '#888',
                  background: isActive ? `${config.primaryColor}15` : 'transparent',
                  fontSize: 13,
                  fontWeight: isActive ? 600 : 400,
                  transition: 'all 0.2s ease',
                }}
              >
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            )
          })}
        </nav>

        {/* User Avatar */}
        <div
          style={{
            width: 36,
            height: 36,
            borderRadius: '50%',
            background: `linear-gradient(135deg, ${config.primaryColor}, ${config.accentColor})`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 14,
            fontWeight: 600,
            color: '#0A0A0A',
          }}
        >
          C
        </div>
      </header>

      {/* Main Content */}
      <main style={{ padding: 32, maxWidth: 1400, margin: '0 auto' }}>
        {children}
      </main>

      {/* Footer */}
      <footer
        style={{
          padding: '24px 32px',
          borderTop: '1px solid rgba(255, 255, 255, 0.1)',
          textAlign: 'center',
        }}
      >
        <p style={{ color: '#555', fontSize: 11, letterSpacing: '0.1em' }}>
          POWERED BY{' '}
          <a href="https://l7shift.com" style={{ color: config.primaryColor, textDecoration: 'none' }}>
            L7 SHIFT
          </a>{' '}
          • THE SYMB<span style={{ fontWeight: 700 }}>AI</span>OTIC METHOD™
        </p>
      </footer>

      <style jsx global>{`
        .client-portal * {
          cursor: auto !important;
        }
        .client-portal a, .client-portal button {
          cursor: pointer !important;
        }
      `}</style>
    </div>
  )
}
