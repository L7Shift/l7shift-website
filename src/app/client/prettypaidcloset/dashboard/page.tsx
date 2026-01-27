'use client'

import React, { useState, useEffect, useCallback } from 'react'

export default function PrettyPaidClosetDashboard() {
  const [isMobile, setIsMobile] = useState(false)

  // Pretty Paid Closet Brand Colors
  const roseGold = '#B76E79'
  const hotPink = '#FF69B4'
  const gold = '#D4AF37'
  const softCream = '#FFF8F0'
  const charcoal = '#2D2D2D'
  const blushPink = '#FFB6C1'

  useEffect(() => {
    setIsMobile(window.innerWidth < 768)
    const handleResize = () => setIsMobile(window.innerWidth < 768)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Current business stats from Poshmark analysis
  const stats = {
    platform: 'Poshmark',
    handle: '@prettypaidclset',
    totalListings: 47,
    avgPrice: 28,
    topCategories: ['Dresses', 'Jeans', 'Tops', 'Jackets', 'Shoes'],
    topBrands: ['Fashion Nova', 'The North Face', 'Michael Kors', 'Steve Madden', 'SHEIN', "Levi's"],
    platformFee: '20%',
    potentialSavings: '10-15%',
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
          padding: '16px 40px',
          borderBottom: `1px solid rgba(183,110,121,0.1)`,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          background: 'rgba(255,255,255,0.9)',
          backdropFilter: 'blur(10px)',
          position: 'sticky',
          top: 0,
          zIndex: 100,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{
            fontFamily: "'Cormorant Garamond', Georgia, serif",
            fontSize: '20px',
            fontWeight: 300,
            color: charcoal,
            letterSpacing: '0.04em',
            textTransform: 'uppercase',
          }}>
            Pretty Paid
          </span>
          <span style={{
            fontFamily: "'Cormorant Garamond', Georgia, serif",
            fontSize: '14px',
            fontWeight: 400,
            fontStyle: 'italic',
            color: roseGold,
            letterSpacing: '0.08em',
          }}>
            closet
          </span>
          <div style={{ height: '20px', width: '1px', background: 'rgba(183,110,121,0.25)', margin: '0 4px' }} />
          <span style={{ fontSize: '9px', letterSpacing: '0.12em', color: '#999', textTransform: 'uppercase' }}>
            Dashboard
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <a
            href="/discovery/prettypaidcloset"
            style={{
              padding: '10px 20px',
              background: `linear-gradient(135deg, ${roseGold}, ${hotPink})`,
              color: 'white',
              textDecoration: 'none',
              fontSize: '11px',
              fontWeight: 600,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              borderRadius: '8px',
              boxShadow: `0 4px 16px rgba(183,110,121,0.25)`,
            }}
          >
            Complete Discovery
          </a>
          <div
            style={{
              width: '38px',
              height: '38px',
              borderRadius: '50%',
              background: `linear-gradient(135deg, ${hotPink}, ${roseGold})`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '15px',
              fontWeight: 500,
              color: 'white',
            }}
          >
            J
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div style={{ padding: '40px', maxWidth: '1400px', margin: '0 auto' }}>
        {/* Welcome Banner */}
        <div
          style={{
            background: 'white',
            border: `1px solid rgba(183,110,121,0.12)`,
            borderRadius: '16px',
            padding: '32px 40px',
            marginBottom: '32px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '24px',
            boxShadow: '0 4px 24px rgba(183,110,121,0.06)',
          }}
        >
          <div>
            <h1
              style={{
                fontSize: 'clamp(24px, 4vw, 34px)',
                fontWeight: 300,
                fontFamily: "'Cormorant Garamond', Georgia, serif",
                color: charcoal,
                marginBottom: '8px',
                fontStyle: 'italic',
              }}
            >
              Welcome, Jazz
            </h1>
            <p style={{ color: '#777', fontSize: '15px' }}>
              Your Pretty Paid Closet dashboard — let's build something amazing together.
            </p>
          </div>
          <a
            href="/discovery/prettypaidcloset"
            style={{
              padding: '14px 28px',
              background: `linear-gradient(135deg, ${roseGold}, ${hotPink})`,
              color: 'white',
              textDecoration: 'none',
              fontSize: '13px',
              fontWeight: 600,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              borderRadius: '10px',
              boxShadow: `0 8px 24px rgba(183,110,121,0.25)`,
              transition: 'transform 0.3s ease',
            }}
          >
            Complete Discovery Form →
          </a>
        </div>

        {/* Stats Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '16px',
            marginBottom: '32px',
          }}
        >
          {/* Current Platform */}
          <div
            style={{
              background: 'white',
              border: `1px solid rgba(183,110,121,0.1)`,
              borderRadius: '14px',
              padding: '24px',
              boxShadow: '0 2px 12px rgba(183,110,121,0.04)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '14px' }}>
              <span style={{ fontSize: '10px', color: '#888', letterSpacing: '0.12em', textTransform: 'uppercase', fontWeight: 500 }}>
                Current Platform
              </span>
              <span
                style={{
                  padding: '4px 10px',
                  background: 'rgba(183,110,121,0.1)',
                  color: roseGold,
                  fontSize: '9px',
                  fontWeight: 700,
                  borderRadius: '20px',
                  letterSpacing: '0.05em',
                }}
              >
                ACTIVE
              </span>
            </div>
            <div style={{ fontSize: '26px', fontWeight: 300, color: charcoal, marginBottom: '4px', fontFamily: "'Cormorant Garamond', Georgia, serif" }}>
              {stats.platform}
            </div>
            <div style={{ color: roseGold, fontSize: '13px', fontWeight: 500 }}>{stats.handle}</div>
          </div>

          {/* Total Listings */}
          <div
            style={{
              background: 'white',
              border: `1px solid rgba(255,105,180,0.12)`,
              borderRadius: '14px',
              padding: '24px',
              boxShadow: '0 2px 12px rgba(255,105,180,0.04)',
            }}
          >
            <span style={{ fontSize: '10px', color: '#888', letterSpacing: '0.12em', textTransform: 'uppercase', display: 'block', marginBottom: '14px', fontWeight: 500 }}>
              Active Listings
            </span>
            <div style={{ fontSize: '38px', fontWeight: 300, color: hotPink, marginBottom: '4px', fontFamily: "'Cormorant Garamond', Georgia, serif" }}>
              {stats.totalListings}
            </div>
            <div style={{ color: '#999', fontSize: '12px' }}>items in closet</div>
          </div>

          {/* Average Price */}
          <div
            style={{
              background: 'white',
              border: `1px solid rgba(212,175,55,0.12)`,
              borderRadius: '14px',
              padding: '24px',
              boxShadow: '0 2px 12px rgba(212,175,55,0.04)',
            }}
          >
            <span style={{ fontSize: '10px', color: '#888', letterSpacing: '0.12em', textTransform: 'uppercase', display: 'block', marginBottom: '14px', fontWeight: 500 }}>
              Average Price
            </span>
            <div style={{ fontSize: '38px', fontWeight: 300, color: gold, marginBottom: '4px', fontFamily: "'Cormorant Garamond', Georgia, serif" }}>
              ${stats.avgPrice}
            </div>
            <div style={{ color: '#999', fontSize: '12px' }}>per listing</div>
          </div>

          {/* Platform Fee */}
          <div
            style={{
              background: 'linear-gradient(135deg, rgba(255,182,193,0.15), rgba(183,110,121,0.08))',
              border: `1px solid rgba(183,110,121,0.15)`,
              borderRadius: '14px',
              padding: '24px',
            }}
          >
            <span style={{ fontSize: '10px', color: '#888', letterSpacing: '0.12em', textTransform: 'uppercase', display: 'block', marginBottom: '14px', fontWeight: 500 }}>
              Poshmark Takes
            </span>
            <div style={{ fontSize: '38px', fontWeight: 300, color: '#E57373', marginBottom: '4px', fontFamily: "'Cormorant Garamond', Georgia, serif" }}>
              {stats.platformFee}
            </div>
            <div style={{ color: roseGold, fontSize: '12px', fontWeight: 600 }}>
              We can save you {stats.potentialSavings}
            </div>
          </div>
        </div>

        {/* Deliverables Section */}
        <div
          style={{
            background: 'white',
            border: `1px solid rgba(212,175,55,0.15)`,
            borderRadius: '16px',
            padding: '28px',
            marginBottom: '32px',
            boxShadow: '0 4px 24px rgba(212,175,55,0.06)',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <div>
              <h3 style={{ fontSize: '11px', color: gold, letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '6px', fontWeight: 600 }}>
                Your Deliverables
              </h3>
              <h2
                style={{
                  fontSize: '22px',
                  fontWeight: 300,
                  fontFamily: "'Cormorant Garamond', Georgia, serif",
                  color: charcoal,
                  fontStyle: 'italic',
                }}
              >
                Brand Assets & Documents
              </h2>
            </div>
            <div
              style={{
                width: '48px',
                height: '48px',
                borderRadius: '50%',
                background: `linear-gradient(135deg, ${gold}, #E5C158)`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: `0 6px 20px rgba(212,175,55,0.25)`,
              }}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
                <line x1="16" y1="13" x2="8" y2="13" />
                <line x1="16" y1="17" x2="8" y2="17" />
              </svg>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '14px' }}>
            {/* Brand Style Guide */}
            <a
              href="/client-assets/prettypaidcloset/brand-guide.html"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
                padding: '18px 20px',
                background: softCream,
                borderRadius: '12px',
                textDecoration: 'none',
                transition: 'all 0.3s ease',
                border: `1px solid transparent`,
              }}
            >
              <div
                style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '10px',
                  background: `linear-gradient(135deg, ${roseGold}, ${hotPink})`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M12 16v-4M12 8h.01" />
                </svg>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ color: charcoal, fontSize: '15px', fontWeight: 500, marginBottom: '2px' }}>
                  Brand Style Guide
                </div>
                <div style={{ color: '#888', fontSize: '12px' }}>
                  Colors, typography, logo usage & visual guidelines
                </div>
              </div>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={roseGold} strokeWidth="2">
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                <polyline points="15 3 21 3 21 9" />
                <line x1="10" y1="14" x2="21" y2="3" />
              </svg>
            </a>

            {/* More deliverables can be added here */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
                padding: '18px 20px',
                background: 'rgba(183,110,121,0.04)',
                borderRadius: '12px',
                border: `1px dashed rgba(183,110,121,0.2)`,
              }}
            >
              <div
                style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '10px',
                  background: 'rgba(183,110,121,0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={roseGold} strokeWidth="2" strokeOpacity="0.5">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="16" />
                  <line x1="8" y1="12" x2="16" y2="12" />
                </svg>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ color: '#999', fontSize: '15px', fontWeight: 500, marginBottom: '2px' }}>
                  More Coming Soon
                </div>
                <div style={{ color: '#bbb', fontSize: '12px' }}>
                  Logo files, templates & additional assets
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Two Column Layout */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '16px', marginBottom: '32px' }}>
          {/* Top Categories */}
          <div
            style={{
              background: 'white',
              border: `1px solid rgba(183,110,121,0.1)`,
              borderRadius: '14px',
              padding: '24px',
              boxShadow: '0 2px 12px rgba(183,110,121,0.04)',
            }}
          >
            <h3 style={{ fontSize: '11px', color: roseGold, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '18px', fontWeight: 600 }}>
              Top Categories
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {stats.topCategories.map((cat, i) => (
                <div
                  key={cat}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '12px 14px',
                    background: softCream,
                    borderRadius: '10px',
                    transition: 'background 0.2s ease',
                  }}
                >
                  <span style={{ color: charcoal, fontSize: '14px' }}>{cat}</span>
                  <span style={{ color: roseGold, fontSize: '11px', fontWeight: 600 }}>#{i + 1}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Top Brands */}
          <div
            style={{
              background: 'white',
              border: `1px solid rgba(255,105,180,0.1)`,
              borderRadius: '14px',
              padding: '24px',
              boxShadow: '0 2px 12px rgba(255,105,180,0.04)',
            }}
          >
            <h3 style={{ fontSize: '11px', color: hotPink, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '18px', fontWeight: 600 }}>
              Brands in Closet
            </h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {stats.topBrands.map((brand) => (
                <span
                  key={brand}
                  style={{
                    padding: '8px 16px',
                    background: 'rgba(255,105,180,0.08)',
                    border: '1px solid rgba(255,105,180,0.15)',
                    borderRadius: '20px',
                    color: charcoal,
                    fontSize: '12px',
                    transition: 'all 0.2s ease',
                  }}
                >
                  {brand}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Roadmap Section */}
        <div
          style={{
            background: 'white',
            border: `1px solid rgba(183,110,121,0.1)`,
            borderRadius: '16px',
            padding: '32px',
            boxShadow: '0 4px 24px rgba(183,110,121,0.06)',
          }}
        >
          <h3 style={{ fontSize: '11px', color: roseGold, letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '8px', fontWeight: 600 }}>
            What We're Building Together
          </h3>
          <h2
            style={{
              fontSize: '24px',
              fontWeight: 300,
              fontFamily: "'Cormorant Garamond', Georgia, serif",
              color: charcoal,
              marginBottom: '28px',
              fontStyle: 'italic',
            }}
          >
            Your Complete Business Platform
          </h2>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
            {[
              { icon: '👗', title: 'Consignment Store', desc: 'Your own branded e-commerce — keep 90%+ of sales', status: 'planning' },
              { icon: '🏠', title: 'Closet Services', desc: 'Book organization sessions, manage clients', status: 'planning' },
              { icon: '🎁', title: 'Donation Program', desc: 'Accept donations, generate tax receipts', status: 'planning' },
              { icon: '📊', title: 'Inventory System', desc: 'Track items, costs, and profits automatically', status: 'planning' },
            ].map((item) => (
              <div
                key={item.title}
                style={{
                  background: softCream,
                  borderRadius: '12px',
                  padding: '22px',
                  transition: 'all 0.3s ease',
                }}
              >
                <div style={{ fontSize: '28px', marginBottom: '14px' }}>{item.icon}</div>
                <h4 style={{ color: charcoal, fontSize: '15px', marginBottom: '6px', fontWeight: 500 }}>
                  {item.title}
                </h4>
                <p style={{ color: '#888', fontSize: '12px', lineHeight: 1.6, marginBottom: '14px' }}>
                  {item.desc}
                </p>
                <span
                  style={{
                    padding: '5px 12px',
                    background: 'rgba(183,110,121,0.12)',
                    color: roseGold,
                    fontSize: '9px',
                    fontWeight: 700,
                    letterSpacing: '0.06em',
                    textTransform: 'uppercase',
                    borderRadius: '16px',
                  }}
                >
                  {item.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom CTA */}
        <div
          style={{
            marginTop: '32px',
            textAlign: 'center',
            padding: '36px',
            background: 'white',
            borderRadius: '16px',
            border: `1px solid rgba(183,110,121,0.1)`,
            boxShadow: '0 4px 24px rgba(183,110,121,0.06)',
          }}
        >
          <h3
            style={{
              fontSize: '22px',
              fontWeight: 300,
              fontFamily: "'Cormorant Garamond', Georgia, serif",
              color: charcoal,
              marginBottom: '10px',
              fontStyle: 'italic',
            }}
          >
            Ready to Move Forward?
          </h3>
          <p style={{ color: '#888', fontSize: '14px', marginBottom: '24px', maxWidth: '500px', margin: '0 auto 24px' }}>
            Complete the discovery form so we can finalize the partnership and start building your platform.
          </p>
          <a
            href="/discovery/prettypaidcloset"
            style={{
              display: 'inline-block',
              padding: '16px 40px',
              background: `linear-gradient(135deg, ${roseGold}, ${hotPink})`,
              color: 'white',
              textDecoration: 'none',
              fontSize: '13px',
              fontWeight: 600,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              borderRadius: '10px',
              boxShadow: `0 10px 32px rgba(183,110,121,0.3)`,
              transition: 'all 0.3s ease',
            }}
          >
            Complete Discovery Form
          </a>
        </div>
      </div>

      {/* Footer */}
      <footer
        style={{
          marginTop: '48px',
          padding: '20px 40px',
          borderTop: `1px solid rgba(183,110,121,0.08)`,
          textAlign: 'center',
          background: 'white',
        }}
      >
        <p style={{ color: '#999', fontSize: '10px', letterSpacing: '0.1em' }}>
          POWERED BY{' '}
          <a href="https://l7shift.com" style={{ color: roseGold, textDecoration: 'none' }}>
            L7 SHIFT
          </a>{' '}
          • STRATEGY. SYSTEMS. SOLUTIONS.
        </p>
      </footer>
    </main>
  )
}
