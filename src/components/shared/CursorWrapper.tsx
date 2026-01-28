'use client'

import { ReactNode, useEffect, useState } from 'react'
import { useMouseTracking } from '@/hooks/useMouseTracking'
import { CustomCursor } from '@/components/desktop/CustomCursor'

interface CursorWrapperProps {
  children: ReactNode
}

export function CursorWrapper({ children }: CursorWrapperProps) {
  const { mousePos, isHovering, handleHoverStart, handleHoverEnd } = useMouseTracking()
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768 || 'ontouchstart' in window)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  useEffect(() => {
    // Add hover detection to interactive elements
    const interactiveElements = document.querySelectorAll('a, button, input, [role="button"]')

    interactiveElements.forEach((el) => {
      el.addEventListener('mouseenter', handleHoverStart)
      el.addEventListener('mouseleave', handleHoverEnd)
    })

    return () => {
      interactiveElements.forEach((el) => {
        el.removeEventListener('mouseenter', handleHoverStart)
        el.removeEventListener('mouseleave', handleHoverEnd)
      })
    }
  }, [handleHoverStart, handleHoverEnd])

  return (
    <>
      {!isMobile && <CustomCursor mousePos={mousePos} isHovering={isHovering} />}
      <div style={{ cursor: isMobile ? 'auto' : 'none' }}>
        {children}
      </div>
      {!isMobile && (
        <style jsx global>{`
          * {
            cursor: none !important;
          }
          a, button, input, textarea, select, [role="button"] {
            cursor: none !important;
          }
        `}</style>
      )}
    </>
  )
}
