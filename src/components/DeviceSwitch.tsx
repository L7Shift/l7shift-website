'use client'

import { useDeviceDetection } from '@/hooks/useDeviceDetection'
import { DesktopPage } from '@/components/desktop/DesktopPage'
import { MobilePage } from '@/components/mobile/MobilePage'

export function DeviceSwitch() {
  const { isMobile, isLoading } = useDeviceDetection()

  // During SSR and initial hydration, render desktop (SEO-friendly default)
  // CSS will handle mobile visibility via media queries as fallback
  if (isLoading) {
    return (
      <>
        {/* Desktop visible by default for SEO crawlers */}
        <div className="device-desktop">
          <DesktopPage />
        </div>
        {/* Mobile hidden initially, shown via CSS media query */}
        <div className="device-mobile" style={{ display: 'none' }}>
          <MobilePage />
        </div>
      </>
    )
  }

  // After hydration, show the correct version
  return isMobile ? <MobilePage /> : <DesktopPage />
}
