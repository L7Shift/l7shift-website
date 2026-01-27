'use client'

import React from 'react'

interface ButtonProps {
  variant: 'primary' | 'secondary'
  children: React.ReactNode
  href?: string
  type?: 'button' | 'submit'
  disabled?: boolean
  onClick?: () => void
  onMouseEnter?: () => void
  onMouseLeave?: () => void
  style?: React.CSSProperties
  className?: string
}

export function Button({
  variant,
  children,
  href,
  type = 'button',
  disabled = false,
  onClick,
  onMouseEnter,
  onMouseLeave,
  style,
  className = '',
}: ButtonProps) {
  const baseClass = variant === 'primary' ? 'btn-primary' : 'btn-secondary'

  if (href) {
    return (
      <a
        href={href}
        className={`${baseClass} ${className}`}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        style={style}
      >
        {children}
      </a>
    )
  }

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`${baseClass} ${className}`}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      style={style}
    >
      {children}
    </button>
  )
}
