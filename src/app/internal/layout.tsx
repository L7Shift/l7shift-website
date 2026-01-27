'use client'

import { ReactNode, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

interface InternalLayoutProps {
  children: ReactNode
}

const navItems = [
  { href: '/internal', icon: '\uD83D\uDCCA', label: 'Dashboard' },
  { href: '/internal/projects', icon: '\uD83D\uDCC1', label: 'Projects' },
  { href: '/internal/clients', icon: '\uD83D\uDC65', label: 'Clients' },
  { href: '/internal/requirements', icon: '\uD83D\uDCDD', label: 'Requirements' },
  { href: '/internal/metrics', icon: '\uD83D\uDCC8', label: 'Metrics' },
]

export default function InternalLayout({ children }: InternalLayoutProps) {
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState(false)

  return (
    <div
      className="internal-portal"
      style={{
        minHeight: '100vh',
        background: '#0A0A0A',
        display: 'flex',
      }}
    >
      {/* Sidebar */}
      <aside
        style={{
          width: collapsed ? 60 : 220,
          background: 'rgba(255, 255, 255, 0.02)',
          borderRight: '1px solid rgba(255, 255, 255, 0.1)',
          display: 'flex',
          flexDirection: 'column',
          transition: 'width 0.2s ease',
          position: 'sticky',
          top: 0,
          height: '100vh',
          overflowY: 'auto',
        }}
      >
        {/* Logo */}
        <div
          style={{
            padding: collapsed ? '20px 12px' : '20px 16px',
            borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: collapsed ? 'center' : 'space-between',
          }}
        >
          {!collapsed && (
            <Link href="/" style={{ textDecoration: 'none' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <span style={{ fontSize: 24, fontWeight: 500, color: '#FAFAFA' }}>L7</span>
                <span style={{ fontSize: 16, fontWeight: 300, color: '#888', letterSpacing: '0.15em' }}>SHIFT</span>
              </div>
            </Link>
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            style={{
              background: 'none',
              border: 'none',
              color: '#888',
              cursor: 'pointer',
              fontSize: 16,
              padding: 4,
            }}
          >
            {collapsed ? '\u2192' : '\u2190'}
          </button>
        </div>

        {/* Nav items */}
        <nav style={{ padding: '16px 8px', flex: 1 }}>
          {navItems.map((item) => {
            const isActive = pathname === item.href ||
              (item.href !== '/internal' && pathname.startsWith(item.href))

            return (
              <Link
                key={item.href}
                href={item.href}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  padding: collapsed ? '12px 8px' : '12px 16px',
                  marginBottom: 4,
                  borderRadius: 8,
                  textDecoration: 'none',
                  color: isActive ? '#00F0FF' : '#888',
                  background: isActive ? 'rgba(0, 240, 255, 0.1)' : 'transparent',
                  transition: 'all 0.2s ease',
                  justifyContent: collapsed ? 'center' : 'flex-start',
                }}
              >
                <span style={{ fontSize: 18 }}>{item.icon}</span>
                {!collapsed && (
                  <span style={{ fontSize: 14, fontWeight: isActive ? 600 : 400 }}>
                    {item.label}
                  </span>
                )}
              </Link>
            )
          })}
        </nav>

        {/* User section */}
        <div
          style={{
            padding: collapsed ? '16px 8px' : '16px',
            borderTop: '1px solid rgba(255, 255, 255, 0.1)',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              justifyContent: collapsed ? 'center' : 'flex-start',
            }}
          >
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #00F0FF, #FF00AA)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 14,
                fontWeight: 700,
                color: '#0A0A0A',
              }}
            >
              KL
            </div>
            {!collapsed && (
              <div>
                <div style={{ fontSize: 13, fontWeight: 500, color: '#FAFAFA' }}>Ken Leftwich</div>
                <div style={{ fontSize: 11, color: '#666' }}>Admin</div>
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main
        style={{
          flex: 1,
          padding: 24,
          overflowY: 'auto',
        }}
      >
        {children}
      </main>
    </div>
  )
}
