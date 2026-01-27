'use client'

import React from 'react'

interface SectionHeaderProps {
  label: string
  labelColor: string
  title: React.ReactNode
  maxWidth?: string
  marginBottom?: string
}

export function SectionHeader({
  label,
  labelColor,
  title,
  maxWidth,
  marginBottom = '100px',
}: SectionHeaderProps) {
  return (
    <div style={{ marginBottom }}>
      <span
        style={{
          color: labelColor,
          fontSize: '12px',
          fontWeight: 700,
          letterSpacing: '0.3em',
          textTransform: 'uppercase',
          display: 'block',
          marginBottom: '24px',
        }}
      >
        {label}
      </span>

      <h2
        style={{
          fontSize: 'clamp(48px, 6vw, 80px)',
          lineHeight: 1.05,
          maxWidth: maxWidth,
        }}
      >
        {title}
      </h2>
    </div>
  )
}
