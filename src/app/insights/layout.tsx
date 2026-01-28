'use client'

import React, { useState } from 'react'
import { useMouseTracking } from '@/hooks/useMouseTracking'
import { useDeviceDetection } from '@/hooks/useDeviceDetection'
import { GradientBar } from '@/components/shared/GradientBar'
import { CustomCursor } from '@/components/desktop/CustomCursor'
import { Navigation } from '@/components/desktop/Navigation'
import { Footer } from '@/components/desktop/Footer'
import { MobileHeader } from '@/components/mobile/MobileHeader'
import { MobileMenuOverlay } from '@/components/mobile/MobileMenuOverlay'
import { MobileFooter } from '@/components/mobile/MobileFooter'

export default function InsightsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { mousePos, isHovering, handleHoverStart, handleHoverEnd } = useMouseTracking()
  const { isMobile, isLoading } = useDeviceDetection()
  const [menuOpen, setMenuOpen] = useState(false)

  // During loading, render desktop by default (better for SEO)
  const showMobile = !isLoading && isMobile

  return (
    <main>
      {/* Custom Cursor - Desktop only */}
      {!showMobile && <CustomCursor mousePos={mousePos} isHovering={isHovering} />}

      {/* Noise Overlay */}
      <div className="noise" />

      {/* Scanline Effect */}
      <div className="scanline" />

      {/* Gradient Bar - Desktop only (mobile has it in header) */}
      {!showMobile && <GradientBar position="fixed" top={0} left={0} right={0} zIndex={100} />}

      {/* Navigation - Device specific */}
      {showMobile ? (
        <>
          <MobileHeader onMenuToggle={() => setMenuOpen(true)} />
          <MobileMenuOverlay isOpen={menuOpen} onClose={() => setMenuOpen(false)} />
        </>
      ) : (
        <Navigation onHoverStart={handleHoverStart} onHoverEnd={handleHoverEnd} />
      )}

      {/* Page Content */}
      <div style={{ paddingTop: showMobile ? '80px' : '120px' }}>
        {children}
      </div>

      {/* Footer - Device specific */}
      {showMobile ? (
        <MobileFooter />
      ) : (
        <Footer onHoverStart={handleHoverStart} onHoverEnd={handleHoverEnd} />
      )}

      {/* Bottom gradient bar */}
      <GradientBar />
    </main>
  )
}
