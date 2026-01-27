'use client'

import React from 'react'

interface GradientBarProps {
  position?: 'fixed' | 'static' | 'absolute' | 'relative'
  top?: number | string
  bottom?: number | string
  left?: number | string
  right?: number | string
  zIndex?: number
  height?: string
}

export function GradientBar({
  position = 'static',
  top,
  bottom,
  left,
  right,
  zIndex,
  height = '4px',
}: GradientBarProps) {
  return (
    <div
      className="gradient-bar"
      style={{
        position,
        top,
        bottom,
        left,
        right,
        zIndex,
        height,
      }}
    />
  )
}
