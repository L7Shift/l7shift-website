'use client'

import { ReactNode, useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname, useParams, useRouter } from 'next/navigation'
import { CursorWrapper } from '@/components/shared/CursorWrapper'
import { getClientConfig } from '@/lib/client-portal-config'

interface PortalLayoutProps {
  children: ReactNode
}

function getCookie(name: string): string | null {
  if (typeof document === 'undefined') return null
  const value = `; ${document.cookie}`
  const parts = value.split(`; ${name}=`)
  if (parts.length === 2) return parts.pop()?.split(';').shift() || null
  return null
}

export default function PortalLayout({ children }: PortalLayoutProps) {
  const pathname = usePathname()
  const params = useParams()
  const router = useRouter()
  const clientSlug = params.clientSlug as string
  const config = getClientConfig(clientSlug)

  const [userName, setUserName] = useState('User')
  const [showDropdown, setShowDropdown] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [badgeCounts, setBadgeCounts] = useState<Record<string, number>>({})

  useEffect(() => {
    const name = getCookie('l7_user_name')
    if (name) setUserName(decodeURIComponent(name))
  }, [])

  // Fetch badge counts
  useEffect(() => {
    async function fetchBadgeCounts() {
      try {
        const res = await fetch(`/api/client/project?slug=${clientSlug}`)
        if (!res.ok) return
        const data = await res.json()
        setBadgeCounts({
          deliverables: data.pendingDeliverables || 0,
          bugs: data.openBugs || 0,
          requests: data.openRequests || 0,
          requirements: data.pendingApprovals || 0,
        })
      } catch {
        // Silently fail — badges are non-critical
      }
    }
    fetchBadgeCounts()
  }, [clientSlug])

  // Close mobile menu on navigation
  useEffect(() => {
    setMobileMenuOpen(false)
  }, [pathname])

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' })
    router.push('/login')
  }

  const navItems = [
    { href: `/portal/${clientSlug}`, icon: '📊', label: 'Dashboard' },
    { href: `/portal/${clientSlug}/plan`, icon: '📄', label: 'Build Plan' },
    { href: `/portal/${clientSlug}/deliverables`, icon: '📁', label: 'Deliverables', badgeKey: 'deliverables' },
    { href: `/portal/${clientSlug}/requirements`, icon: '📝', label: 'Requirements', badgeKey: 'requirements' },
    { href: `/portal/${clientSlug}/bugs`, icon: '🐛', label: 'Bugs', badgeKey: 'bugs' },
    { href: `/portal/${clientSlug}/requests`, icon: '✨', label: 'Requests', badgeKey: 'requests' },
    { href: `/portal/${clientSlug}/activity`, icon: '🕐', label: 'Activity' },
    { href: `/portal/${clientSlug}/assets`, icon: '📤', label: 'Upload Assets' },
  ]

  return (
    <CursorWrapper>
    <div
      className="client-portal"
      style={{
        minHeight: '100vh',
        background: '#060608',
        color: '#FAFAFA',
        fontFamily: "'Inter', -apple-system, sans-serif",
        position: 'relative',
      }}
    >
      {/* Ambient gradient mesh */}
      <div style={{
        position: 'fixed',
        inset: 0,
        pointerEvents: 'none',
        zIndex: 0,
        background: `
          radial-gradient(ellipse 80% 50% at 20% 0%, ${config.primaryColor}08 0%, transparent 50%),
          radial-gradient(ellipse 60% 40% at 80% 100%, ${config.accentColor}06 0%, transparent 50%)
        `,
      }} />

      {/* Top Header */}
      <header
        style={{
          padding: '14px 20px',
          borderBottom: `1px solid ${config.primaryColor}18`,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          background: 'rgba(6, 6, 8, 0.85)',
          backdropFilter: 'blur(20px) saturate(180%)',
          position: 'sticky',
          top: 0,
          zIndex: 100,
        }}
      >
        {/* Logo & Client Name */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 5 }}>
            <span style={{ fontSize: 20, fontWeight: 600, color: '#FAFAFA', letterSpacing: '-0.02em' }}>L7</span>
            <span style={{ fontSize: 11, fontWeight: 400, color: '#666', letterSpacing: '0.2em', textTransform: 'uppercase' }}>Shift</span>
          </Link>
          <div style={{ width: 1, height: 22, background: `linear-gradient(180deg, transparent, ${config.primaryColor}40, transparent)` }} />
          <span
            style={{
              fontSize: 13,
              fontWeight: 600,
              color: config.primaryColor,
              letterSpacing: '0.01em',
            }}
          >
            {config.name}
          </span>
        </div>

        {/* Desktop Nav */}
        <nav className="portal-desktop-nav" style={{ display: 'flex', gap: 2 }}>
          {navItems.map((item) => {
            const isActive = pathname === item.href
            const count = item.badgeKey ? (badgeCounts[item.badgeKey] || 0) : 0
            return (
              <Link
                key={item.href}
                href={item.href}
                className="portal-nav-link"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  padding: '7px 14px',
                  borderRadius: 8,
                  textDecoration: 'none',
                  color: isActive ? config.primaryColor : '#777',
                  background: isActive ? `${config.primaryColor}12` : 'transparent',
                  border: isActive ? `1px solid ${config.primaryColor}25` : '1px solid transparent',
                  fontSize: 13,
                  fontWeight: isActive ? 600 : 450,
                  transition: 'all 0.2s ease',
                  whiteSpace: 'nowrap',
                  letterSpacing: '0.01em',
                }}
              >
                <span style={{ fontSize: 14 }}>{item.icon}</span>
                <span>{item.label}</span>
                {count > 0 && (
                  <span
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: 16,
                      height: 16,
                      borderRadius: '50%',
                      background: config.primaryColor,
                      color: '#060608',
                      fontSize: 10,
                      fontWeight: 700,
                      lineHeight: 1,
                      flexShrink: 0,
                    }}
                  >
                    {count}
                  </span>
                )}
              </Link>
            )
          })}
        </nav>

        {/* Right side: user avatar + mobile hamburger */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {/* User Avatar & Dropdown */}
          <div style={{ position: 'relative' }}>
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              style={{
                width: 36,
                height: 36,
                borderRadius: '50%',
                background: `linear-gradient(135deg, ${config.primaryColor}, ${config.accentColor})`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 14,
                fontWeight: 700,
                color: '#060608',
                border: 'none',
                cursor: 'pointer',
                boxShadow: `0 0 20px ${config.primaryColor}30`,
                transition: 'box-shadow 0.3s ease',
              }}
              onMouseEnter={e => e.currentTarget.style.boxShadow = `0 0 28px ${config.primaryColor}50`}
              onMouseLeave={e => e.currentTarget.style.boxShadow = `0 0 20px ${config.primaryColor}30`}
            >
              {userName.charAt(0).toUpperCase()}
            </button>
            {showDropdown && (
              <div
                style={{
                  position: 'absolute',
                  top: 42,
                  right: 0,
                  background: '#1A1A1A',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: 8,
                  padding: 8,
                  minWidth: 160,
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
                  zIndex: 200,
                }}
              >
                <div style={{ padding: '8px 12px', borderBottom: '1px solid rgba(255, 255, 255, 0.1)', marginBottom: 8 }}>
                  <div style={{ fontSize: 13, fontWeight: 500, color: '#FAFAFA' }}>{userName}</div>
                  <div style={{ fontSize: 11, color: '#666' }}>{config.name}</div>
                </div>
                <button
                  onClick={handleLogout}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    background: 'transparent',
                    border: 'none',
                    borderRadius: 6,
                    color: '#888',
                    fontSize: 13,
                    textAlign: 'left',
                    cursor: 'pointer',
                  }}
                >
                  Sign Out
                </button>
              </div>
            )}
          </div>

          {/* Mobile Hamburger */}
          <button
            className="portal-mobile-menu-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            style={{
              display: 'none',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: 4,
              color: '#FAFAFA',
              fontSize: 22,
            }}
          >
            {mobileMenuOpen ? '✕' : '☰'}
          </button>
        </div>
      </header>

      {/* Mobile Nav Overlay */}
      {mobileMenuOpen && (
        <div
          className="portal-mobile-nav"
          style={{
            position: 'fixed',
            top: 58,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(10, 10, 10, 0.98)',
            backdropFilter: 'blur(20px)',
            zIndex: 99,
            padding: '24px 16px',
            display: 'flex',
            flexDirection: 'column',
            gap: 8,
          }}
        >
          {navItems.map((item) => {
            const isActive = pathname === item.href
            const count = item.badgeKey ? (badgeCounts[item.badgeKey] || 0) : 0
            return (
              <Link
                key={item.href}
                href={item.href}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  padding: '16px 20px',
                  borderRadius: 12,
                  textDecoration: 'none',
                  color: isActive ? config.primaryColor : '#CCC',
                  background: isActive ? `${config.primaryColor}15` : 'rgba(255,255,255,0.03)',
                  border: `1px solid ${isActive ? config.primaryColor + '33' : 'rgba(255,255,255,0.06)'}`,
                  fontSize: 16,
                  fontWeight: isActive ? 600 : 400,
                }}
              >
                <span style={{ fontSize: 20 }}>{item.icon}</span>
                <span style={{ flex: 1 }}>{item.label}</span>
                {count > 0 && (
                  <span
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: 16,
                      height: 16,
                      borderRadius: '50%',
                      background: config.primaryColor,
                      color: '#060608',
                      fontSize: 10,
                      fontWeight: 700,
                      lineHeight: 1,
                      flexShrink: 0,
                    }}
                  >
                    {count}
                  </span>
                )}
              </Link>
            )
          })}
          <button
            onClick={handleLogout}
            style={{
              marginTop: 'auto',
              padding: '16px 20px',
              background: 'rgba(255,0,0,0.1)',
              border: '1px solid rgba(255,0,0,0.2)',
              borderRadius: 12,
              color: '#FF6B6B',
              fontSize: 16,
              cursor: 'pointer',
              textAlign: 'left',
            }}
          >
            Sign Out
          </button>
        </div>
      )}

      {/* Main Content */}
      <main style={{ padding: '32px 24px', maxWidth: 1200, margin: '0 auto', position: 'relative', zIndex: 1 }}>
        {children}
      </main>

      {/* Footer */}
      <footer
        style={{
          padding: '24px 24px',
          borderTop: `1px solid ${config.primaryColor}10`,
          textAlign: 'center',
          position: 'relative',
          zIndex: 1,
        }}
      >
        <p style={{ color: '#444', fontSize: 11, letterSpacing: '0.12em', margin: 0, fontWeight: 400 }}>
          POWERED BY{' '}
          <a href="https://l7shift.com" style={{ color: config.primaryColor, textDecoration: 'none', fontWeight: 600 }}>
            L7 SHIFT
          </a>{' '}
          <span style={{ opacity: 0.4 }}>|</span>{' '}
          THE SYMB<span style={{ fontWeight: 700, color: config.primaryColor }}>AI</span>OTIC SHIFT&#8482;
        </p>
      </footer>

      {/* Responsive CSS + Premium Styles */}
      <style jsx global>{`
        .portal-desktop-nav { display: flex !important; }
        .portal-mobile-menu-btn { display: none !important; }

        .portal-nav-link:hover {
          color: ${config.primaryColor} !important;
          background: ${config.primaryColor}0A !important;
        }

        /* Smooth scrollbar */
        .client-portal::-webkit-scrollbar { width: 6px; }
        .client-portal::-webkit-scrollbar-track { background: transparent; }
        .client-portal::-webkit-scrollbar-thumb { background: ${config.primaryColor}30; border-radius: 3px; }

        @media (max-width: 768px) {
          .portal-desktop-nav { display: none !important; }
          .portal-mobile-menu-btn { display: flex !important; }
        }
      `}</style>
    </div>
    </CursorWrapper>
  )
}
