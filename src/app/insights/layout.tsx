'use client'

import React from 'react'
import { useMouseTracking } from '@/hooks/useMouseTracking'
import { GradientBar } from '@/components/shared/GradientBar'
import { CustomCursor } from '@/components/desktop/CustomCursor'
import { Navigation } from '@/components/desktop/Navigation'
import { Footer } from '@/components/desktop/Footer'

export default function InsightsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { mousePos, isHovering, handleHoverStart, handleHoverEnd } = useMouseTracking()

  return (
    <main>
      {/* Custom Cursor */}
      <CustomCursor mousePos={mousePos} isHovering={isHovering} />

      {/* Noise Overlay */}
      <div className="noise" />

      {/* Scanline Effect */}
      <div className="scanline" />

      {/* Gradient Bar */}
      <GradientBar position="fixed" top={0} left={0} right={0} zIndex={100} />

      {/* Navigation */}
      <Navigation onHoverStart={handleHoverStart} onHoverEnd={handleHoverEnd} />

      {/* Page Content */}
      <div style={{ paddingTop: '120px' }}>
        {children}
      </div>

      {/* Footer */}
      <Footer onHoverStart={handleHoverStart} onHoverEnd={handleHoverEnd} />

      {/* Bottom gradient bar */}
      <GradientBar />
    </main>
  )
}
