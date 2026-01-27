'use client'

import { useState, useEffect } from 'react'

const MOBILE_BREAKPOINT = 768

interface DeviceDetection {
  isMobile: boolean
  isDesktop: boolean
  isLoading: boolean
}

export function useDeviceDetection(): DeviceDetection {
  const [isLoading, setIsLoading] = useState(true)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkDevice = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
      setIsLoading(false)
    }

    // Initial check
    checkDevice()

    // Listen for resize
    window.addEventListener('resize', checkDevice)

    return () => window.removeEventListener('resize', checkDevice)
  }, [])

  return {
    isMobile,
    isDesktop: !isMobile,
    isLoading,
  }
}
