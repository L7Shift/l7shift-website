'use client'

import { useState, useEffect, useCallback } from 'react'

interface MousePosition {
  x: number
  y: number
}

interface MouseTracking {
  mousePos: MousePosition
  isHovering: boolean
  handleHoverStart: () => void
  handleHoverEnd: () => void
}

export function useMouseTracking(): MouseTracking {
  const [mousePos, setMousePos] = useState<MousePosition>({ x: 0, y: 0 })
  const [isHovering, setIsHovering] = useState(false)

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY })
    }

    window.addEventListener('mousemove', handleMouseMove)

    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  const handleHoverStart = useCallback(() => setIsHovering(true), [])
  const handleHoverEnd = useCallback(() => setIsHovering(false), [])

  return {
    mousePos,
    isHovering,
    handleHoverStart,
    handleHoverEnd,
  }
}
