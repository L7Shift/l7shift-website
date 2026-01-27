'use client'

import React from 'react'

interface CustomCursorProps {
  mousePos: { x: number; y: number }
  isHovering: boolean
}

export function CustomCursor({ mousePos, isHovering }: CustomCursorProps) {
  return (
    <>
      <div
        className={`cursor ${isHovering ? 'hovering' : ''}`}
        style={{
          left: mousePos.x - 10,
          top: mousePos.y - 10,
        }}
      />
      <div
        className="cursor-dot"
        style={{
          left: mousePos.x - 2,
          top: mousePos.y - 2,
        }}
      />
    </>
  )
}
