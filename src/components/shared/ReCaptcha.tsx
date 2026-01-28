'use client'

import { useEffect, useCallback } from 'react'

declare global {
  interface Window {
    grecaptcha: {
      ready: (callback: () => void) => void
      execute: (siteKey: string, options: { action: string }) => Promise<string>
    }
  }
}

interface ReCaptchaProps {
  siteKey?: string
  action?: string
  onVerify: (token: string) => void
  onError?: (error: Error) => void
}

export function useReCaptcha(siteKey?: string) {
  const key = siteKey || process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY

  useEffect(() => {
    if (!key) return

    // Load reCAPTCHA script if not already loaded
    if (!document.querySelector('#recaptcha-script')) {
      const script = document.createElement('script')
      script.id = 'recaptcha-script'
      script.src = `https://www.google.com/recaptcha/api.js?render=${key}`
      script.async = true
      document.head.appendChild(script)
    }
  }, [key])

  const execute = useCallback(async (action: string): Promise<string | null> => {
    if (!key) {
      console.warn('[ReCAPTCHA] No site key configured')
      return null
    }

    return new Promise((resolve) => {
      if (typeof window.grecaptcha === 'undefined') {
        console.warn('[ReCAPTCHA] grecaptcha not loaded')
        resolve(null)
        return
      }

      window.grecaptcha.ready(async () => {
        try {
          const token = await window.grecaptcha.execute(key, { action })
          resolve(token)
        } catch (error) {
          console.error('[ReCAPTCHA] Execute error:', error)
          resolve(null)
        }
      })
    })
  }, [key])

  return { execute, isConfigured: !!key }
}

// Component version for declarative usage
export function ReCaptcha({ siteKey, action = 'submit', onVerify, onError }: ReCaptchaProps) {
  const { execute, isConfigured } = useReCaptcha(siteKey)

  useEffect(() => {
    if (!isConfigured) return

    const verify = async () => {
      const token = await execute(action)
      if (token) {
        onVerify(token)
      } else if (onError) {
        onError(new Error('Failed to get reCAPTCHA token'))
      }
    }

    // Re-verify every 2 minutes (tokens expire)
    verify()
    const interval = setInterval(verify, 2 * 60 * 1000)

    return () => clearInterval(interval)
  }, [execute, isConfigured, action, onVerify, onError])

  // reCAPTCHA v3 is invisible, no UI needed
  return null
}
