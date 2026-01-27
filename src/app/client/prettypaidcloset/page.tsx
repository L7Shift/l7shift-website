'use client'

import React, { useState, useEffect, useCallback, Suspense, useRef } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

type AuthState = 'checking' | 'pin-entry' | 'magic-link' | 'pin-setup' | 'magic-sent'

function LoginContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [authState, setAuthState] = useState<AuthState>('checking')
  const [email, setEmail] = useState('')
  const [pin, setPin] = useState(['', '', '', '', '', ''])
  const [confirmPin, setConfirmPin] = useState(['', '', '', '', '', ''])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [userEmail, setUserEmail] = useState('closetsbyjazz@gmail.com') // Would come from session
  const pinRefs = useRef<(HTMLInputElement | null)[]>([])
  const confirmPinRefs = useRef<(HTMLInputElement | null)[]>([])

  // Pretty Paid Closet Brand Colors
  const roseGold = '#B76E79'
  const hotPink = '#FF69B4'
  const softCream = '#FFF8F0'
  const charcoal = '#2D2D2D'

  // Check for magic link token or existing session
  useEffect(() => {
    const token = searchParams.get('token')
    const setup = searchParams.get('setup')

    if (token === 'jazz2024' && setup === 'pin') {
      // Coming from magic link to set up PIN
      setAuthState('pin-setup')
    } else if (token === 'jazz2024') {
      // Valid magic link, go to dashboard
      router.push('/client/prettypaidcloset/dashboard')
    } else {
      // Check if user has PIN set (simulated - would be API call)
      const hasPin = localStorage.getItem('ppc_has_pin') === 'true'
      setAuthState(hasPin ? 'pin-entry' : 'magic-link')
    }
  }, [searchParams, router])

  // Handle PIN input
  const handlePinChange = (index: number, value: string, isConfirm: boolean = false) => {
    if (!/^\d*$/.test(value)) return // Only allow digits

    const newPin = isConfirm ? [...confirmPin] : [...pin]
    newPin[index] = value.slice(-1) // Only keep last digit

    if (isConfirm) {
      setConfirmPin(newPin)
    } else {
      setPin(newPin)
    }

    // Auto-focus next input
    if (value && index < 5) {
      const refs = isConfirm ? confirmPinRefs : pinRefs
      refs.current[index + 1]?.focus()
    }
  }

  // Handle backspace
  const handleKeyDown = (index: number, e: React.KeyboardEvent, isConfirm: boolean = false) => {
    if (e.key === 'Backspace') {
      const currentPin = isConfirm ? confirmPin : pin
      if (!currentPin[index] && index > 0) {
        const refs = isConfirm ? confirmPinRefs : pinRefs
        refs.current[index - 1]?.focus()
      }
    }
  }

  // Send magic link
  const handleSendMagicLink = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500))

    // For demo: if correct email, show success
    if (email.toLowerCase() === 'closetsbyjazz@gmail.com') {
      setUserEmail(email)
      setAuthState('magic-sent')
    } else {
      setAuthState('magic-sent') // Still show sent (don't reveal if email exists)
    }
    setIsLoading(false)
  }

  // Verify PIN
  const handlePinSubmit = async () => {
    const enteredPin = pin.join('')
    if (enteredPin.length !== 6) return

    setIsLoading(true)
    setError('')

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 800))

    // For demo: check against stored PIN
    const storedPin = localStorage.getItem('ppc_pin')
    if (enteredPin === storedPin) {
      router.push('/client/prettypaidcloset/dashboard')
    } else {
      setError('Incorrect PIN. Please try again.')
      setPin(['', '', '', '', '', ''])
      pinRefs.current[0]?.focus()
    }
    setIsLoading(false)
  }

  // Set up new PIN
  const handlePinSetup = async () => {
    const newPin = pin.join('')
    const confirmPinStr = confirmPin.join('')

    if (newPin.length !== 6 || confirmPinStr.length !== 6) {
      setError('Please enter a 6-digit PIN')
      return
    }

    if (newPin !== confirmPinStr) {
      setError('PINs do not match')
      setConfirmPin(['', '', '', '', '', ''])
      confirmPinRefs.current[0]?.focus()
      return
    }

    setIsLoading(true)
    setError('')

    // Simulate API call to save PIN
    await new Promise(resolve => setTimeout(resolve, 1000))

    // For demo: store in localStorage (real app would hash and store in DB)
    localStorage.setItem('ppc_pin', newPin)
    localStorage.setItem('ppc_has_pin', 'true')

    router.push('/client/prettypaidcloset/dashboard')
  }

  // Auto-submit when PIN is complete
  useEffect(() => {
    if (authState === 'pin-entry' && pin.every(d => d !== '')) {
      handlePinSubmit()
    }
  }, [pin, authState])

  // PIN Input Component
  const PinInput = ({
    values,
    onChange,
    onKeyDown,
    refs,
    disabled = false
  }: {
    values: string[]
    onChange: (index: number, value: string) => void
    onKeyDown: (index: number, e: React.KeyboardEvent) => void
    refs: React.MutableRefObject<(HTMLInputElement | null)[]>
    disabled?: boolean
  }) => (
    <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
      {values.map((digit, index) => (
        <input
          key={index}
          ref={el => { refs.current[index] = el }}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={digit}
          onChange={(e) => onChange(index, e.target.value)}
          onKeyDown={(e) => onKeyDown(index, e)}
          disabled={disabled}
          style={{
            width: '52px',
            height: '64px',
            textAlign: 'center',
            fontSize: '28px',
            fontWeight: 500,
            fontFamily: "'Cormorant Garamond', Georgia, serif",
            background: 'white',
            border: `2px solid ${digit ? roseGold : 'rgba(183,110,121,0.2)'}`,
            borderRadius: '12px',
            color: charcoal,
            outline: 'none',
            transition: 'all 0.2s ease',
          }}
        />
      ))}
    </div>
  )

  // Loading state
  if (authState === 'checking') {
    return (
      <main className="ppc-portal" style={{
        minHeight: '100vh',
        background: softCream,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <div style={{ color: roseGold, fontSize: '14px', letterSpacing: '0.2em' }}>LOADING...</div>
      </main>
    )
  }

  // Magic Link Sent
  if (authState === 'magic-sent') {
    return (
      <main
        className="ppc-portal"
        style={{
          minHeight: '100vh',
          background: `linear-gradient(135deg, ${softCream} 0%, #FFF5F5 100%)`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '40px 24px',
          fontFamily: "'DM Sans', -apple-system, sans-serif",
        }}
      >
        <div style={{ textAlign: 'center', maxWidth: '440px' }}>
          <div
            style={{
              width: '80px',
              height: '80px',
              borderRadius: '50%',
              background: `linear-gradient(135deg, ${roseGold}, ${hotPink})`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 32px',
              boxShadow: `0 20px 60px rgba(183,110,121,0.3)`,
            }}
          >
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
              <path d="M22 6c0-1.1-.9-2-2-2H4c-1.1 0-2 .9-2 2" />
              <path d="M22 6l-10 7L2 6" />
              <path d="M2 6v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6" />
            </svg>
          </div>
          <h1
            style={{
              fontSize: '32px',
              fontWeight: 300,
              marginBottom: '16px',
              fontFamily: "'Cormorant Garamond', Georgia, serif",
              color: charcoal,
              fontStyle: 'italic',
            }}
          >
            Check Your Email
          </h1>
          <p style={{ color: '#666', fontSize: '16px', lineHeight: 1.8 }}>
            We sent a magic link to <span style={{ color: roseGold, fontWeight: 500 }}>{email || userEmail}</span>
          </p>
          <p style={{ color: '#999', fontSize: '14px', marginTop: '24px' }}>
            Click the link to sign in and set up your PIN.
          </p>
          <button
            onClick={() => {
              setAuthState('magic-link')
              setEmail('')
            }}
            style={{
              marginTop: '32px',
              padding: '12px 24px',
              background: 'transparent',
              border: `1px solid rgba(183,110,121,0.3)`,
              borderRadius: '8px',
              color: roseGold,
              fontSize: '13px',
              fontWeight: 500,
              cursor: 'pointer',
            }}
          >
            Use a different email
          </button>
        </div>
      </main>
    )
  }

  // PIN Setup (after magic link verification)
  if (authState === 'pin-setup') {
    return (
      <main
        className="ppc-portal"
        style={{
          minHeight: '100vh',
          background: `linear-gradient(135deg, ${softCream} 0%, #FFF5F5 50%, #FFF8F0 100%)`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '40px 24px',
          fontFamily: "'DM Sans', -apple-system, sans-serif",
        }}
      >
        <div
          style={{
            width: '100%',
            maxWidth: '440px',
            background: 'white',
            border: `1px solid rgba(183,110,121,0.15)`,
            borderRadius: '20px',
            padding: '48px 40px',
            boxShadow: '0 30px 60px rgba(183,110,121,0.12)',
          }}
        >
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <div
              style={{
                width: '72px',
                height: '72px',
                borderRadius: '50%',
                background: `linear-gradient(135deg, ${roseGold}, ${hotPink})`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 20px',
                boxShadow: `0 12px 40px rgba(183,110,121,0.35)`,
              }}
            >
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
            </div>
            <h1
              style={{
                fontFamily: "'Cormorant Garamond', Georgia, serif",
                fontSize: '28px',
                fontWeight: 400,
                color: charcoal,
                marginBottom: '8px',
                fontStyle: 'italic',
              }}
            >
              Set Up Your PIN
            </h1>
            <p style={{ color: '#888', fontSize: '14px' }}>
              Create a 6-digit PIN for quick access
            </p>
          </div>

          <div style={{ marginBottom: '32px' }}>
            <label
              style={{
                display: 'block',
                fontSize: '11px',
                fontWeight: 600,
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
                color: roseGold,
                marginBottom: '16px',
                textAlign: 'center',
              }}
            >
              Enter PIN
            </label>
            <PinInput
              values={pin}
              onChange={(i, v) => handlePinChange(i, v, false)}
              onKeyDown={(i, e) => handleKeyDown(i, e, false)}
              refs={pinRefs}
              disabled={isLoading}
            />
          </div>

          <div style={{ marginBottom: '32px' }}>
            <label
              style={{
                display: 'block',
                fontSize: '11px',
                fontWeight: 600,
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
                color: roseGold,
                marginBottom: '16px',
                textAlign: 'center',
              }}
            >
              Confirm PIN
            </label>
            <PinInput
              values={confirmPin}
              onChange={(i, v) => handlePinChange(i, v, true)}
              onKeyDown={(i, e) => handleKeyDown(i, e, true)}
              refs={confirmPinRefs}
              disabled={isLoading}
            />
          </div>

          {error && (
            <p style={{ color: '#E57373', textAlign: 'center', fontSize: '14px', marginBottom: '16px' }}>
              {error}
            </p>
          )}

          <button
            onClick={handlePinSetup}
            disabled={isLoading || pin.some(d => !d) || confirmPin.some(d => !d)}
            style={{
              width: '100%',
              padding: '18px',
              background: `linear-gradient(135deg, ${roseGold}, ${hotPink})`,
              border: 'none',
              borderRadius: '10px',
              color: 'white',
              fontSize: '14px',
              fontWeight: 600,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              cursor: isLoading ? 'wait' : 'pointer',
              opacity: isLoading || pin.some(d => !d) || confirmPin.some(d => !d) ? 0.6 : 1,
              transition: 'all 0.3s ease',
              boxShadow: `0 8px 32px rgba(183,110,121,0.3)`,
            }}
          >
            {isLoading ? 'Setting up...' : 'Set PIN & Continue'}
          </button>

          <div style={{ marginTop: '32px', textAlign: 'center' }}>
            <p style={{ color: '#999', fontSize: '11px', letterSpacing: '0.1em' }}>
              POWERED BY{' '}
              <a href="https://l7shift.com" style={{ color: roseGold, textDecoration: 'none' }}>
                L7 SHIFT
              </a>
            </p>
          </div>
        </div>
      </main>
    )
  }

  // PIN Entry (returning user)
  if (authState === 'pin-entry') {
    return (
      <main
        className="ppc-portal"
        style={{
          minHeight: '100vh',
          background: `linear-gradient(135deg, ${softCream} 0%, #FFF5F5 50%, #FFF8F0 100%)`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '40px 24px',
          fontFamily: "'DM Sans', -apple-system, sans-serif",
        }}
      >
        <div
          style={{
            width: '100%',
            maxWidth: '440px',
            background: 'white',
            border: `1px solid rgba(183,110,121,0.15)`,
            borderRadius: '20px',
            padding: '48px 40px',
            boxShadow: '0 30px 60px rgba(183,110,121,0.12)',
          }}
        >
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <div style={{ marginBottom: '20px' }}>
              <span style={{
                fontFamily: "'Cormorant Garamond', Georgia, serif",
                fontSize: '28px',
                fontWeight: 300,
                color: charcoal,
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
              }}>
                PPC
              </span>
            </div>
            <h1
              style={{
                fontFamily: "'Cormorant Garamond', Georgia, serif",
                fontSize: '28px',
                fontWeight: 400,
                color: charcoal,
                marginBottom: '8px',
                fontStyle: 'italic',
              }}
            >
              Welcome Back
            </h1>
            <p style={{ color: '#888', fontSize: '14px' }}>
              Enter your 6-digit PIN
            </p>
          </div>

          <div style={{ marginBottom: '24px' }}>
            <PinInput
              values={pin}
              onChange={(i, v) => handlePinChange(i, v, false)}
              onKeyDown={(i, e) => handleKeyDown(i, e, false)}
              refs={pinRefs}
              disabled={isLoading}
            />
          </div>

          {error && (
            <p style={{ color: '#E57373', textAlign: 'center', fontSize: '14px', marginBottom: '16px' }}>
              {error}
            </p>
          )}

          {isLoading && (
            <p style={{ color: roseGold, textAlign: 'center', fontSize: '14px', marginBottom: '16px' }}>
              Verifying...
            </p>
          )}

          <div style={{ textAlign: 'center', marginTop: '32px' }}>
            <button
              onClick={() => {
                setAuthState('magic-link')
                setPin(['', '', '', '', '', ''])
                setError('')
              }}
              style={{
                background: 'none',
                border: 'none',
                color: roseGold,
                fontSize: '13px',
                fontWeight: 500,
                cursor: 'pointer',
                textDecoration: 'underline',
              }}
            >
              Forgot PIN?
            </button>
          </div>

          <div style={{ marginTop: '40px', textAlign: 'center' }}>
            <p style={{ color: '#999', fontSize: '11px', letterSpacing: '0.1em' }}>
              POWERED BY{' '}
              <a href="https://l7shift.com" style={{ color: roseGold, textDecoration: 'none' }}>
                L7 SHIFT
              </a>
            </p>
          </div>
        </div>
      </main>
    )
  }

  // Magic Link Request (new user or forgot PIN)
  return (
    <main
      className="ppc-portal"
      style={{
        minHeight: '100vh',
        background: `linear-gradient(135deg, ${softCream} 0%, #FFF5F5 50%, #FFF8F0 100%)`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '40px 24px',
        position: 'relative',
        overflow: 'hidden',
        fontFamily: "'DM Sans', -apple-system, sans-serif",
      }}
    >
      {/* Background decoration */}
      <div
        style={{
          position: 'absolute',
          top: '-20%',
          right: '-10%',
          width: '600px',
          height: '600px',
          background: `radial-gradient(circle, rgba(183,110,121,0.1) 0%, transparent 70%)`,
          pointerEvents: 'none',
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: '-20%',
          left: '-10%',
          width: '500px',
          height: '500px',
          background: `radial-gradient(circle, rgba(255,105,180,0.08) 0%, transparent 70%)`,
          pointerEvents: 'none',
        }}
      />

      <div
        style={{
          width: '100%',
          maxWidth: '440px',
          background: 'white',
          border: `1px solid rgba(183,110,121,0.15)`,
          borderRadius: '20px',
          padding: '48px 40px',
          boxShadow: '0 30px 60px rgba(183,110,121,0.12)',
          position: 'relative',
          zIndex: 10,
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <div style={{ marginBottom: '8px' }}>
            <span style={{
              fontFamily: "'Cormorant Garamond', Georgia, serif",
              fontSize: '42px',
              fontWeight: 300,
              color: charcoal,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
            }}>
              Pretty Paid
            </span>
          </div>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '12px',
            marginBottom: '20px',
          }}>
            <div style={{ height: '1px', width: '40px', background: roseGold }} />
            <span style={{
              fontFamily: "'Cormorant Garamond', Georgia, serif",
              fontSize: '18px',
              fontWeight: 400,
              fontStyle: 'italic',
              color: roseGold,
              letterSpacing: '0.15em',
            }}>
              closet
            </span>
            <div style={{ height: '1px', width: '40px', background: roseGold }} />
          </div>
          <p style={{ color: '#999', fontSize: '10px', letterSpacing: '0.2em', fontWeight: 500 }}>
            CLIENT PORTAL
          </p>
        </div>

        <form onSubmit={handleSendMagicLink}>
          <div style={{ marginBottom: '24px' }}>
            <label
              style={{
                display: 'block',
                fontSize: '11px',
                fontWeight: 600,
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
                color: roseGold,
                marginBottom: '10px',
              }}
            >
              Email Address
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="closetsbyjazz@gmail.com"
              style={{
                width: '100%',
                padding: '16px 20px',
                background: softCream,
                border: `1px solid rgba(183,110,121,0.2)`,
                borderRadius: '10px',
                color: charcoal,
                fontSize: '16px',
                outline: 'none',
                transition: 'all 0.3s ease',
              }}
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            style={{
              width: '100%',
              padding: '18px',
              background: `linear-gradient(135deg, ${roseGold}, ${hotPink})`,
              border: 'none',
              borderRadius: '10px',
              color: 'white',
              fontSize: '14px',
              fontWeight: 600,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              cursor: isLoading ? 'wait' : 'pointer',
              opacity: isLoading ? 0.7 : 1,
              transition: 'all 0.3s ease',
              boxShadow: `0 8px 32px rgba(183,110,121,0.3)`,
            }}
          >
            {isLoading ? 'Sending...' : 'Send Magic Link'}
          </button>
        </form>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            margin: '32px 0',
            gap: '16px',
          }}
        >
          <div style={{ flex: 1, height: '1px', background: `rgba(183,110,121,0.15)` }} />
          <span style={{ color: '#999', fontSize: '12px', letterSpacing: '0.1em' }}>OR</span>
          <div style={{ flex: 1, height: '1px', background: `rgba(183,110,121,0.15)` }} />
        </div>

        <a
          href="/discovery/prettypaidcloset"
          style={{
            display: 'block',
            width: '100%',
            padding: '16px',
            background: 'transparent',
            border: `1px solid rgba(183,110,121,0.3)`,
            borderRadius: '10px',
            color: roseGold,
            fontSize: '13px',
            fontWeight: 600,
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            textAlign: 'center',
            textDecoration: 'none',
            transition: 'all 0.3s ease',
          }}
        >
          New Client? Start Discovery
        </a>

        <div style={{ marginTop: '40px', textAlign: 'center' }}>
          <p style={{ color: '#999', fontSize: '11px', letterSpacing: '0.1em' }}>
            POWERED BY{' '}
            <a href="https://l7shift.com" style={{ color: roseGold, textDecoration: 'none' }}>
              L7 SHIFT
            </a>
          </p>
        </div>
      </div>
    </main>
  )
}

export default function PrettyPaidClosetLogin() {
  return (
    <Suspense fallback={
      <div style={{
        minHeight: '100vh',
        background: '#FFF8F0',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <div style={{ color: '#B76E79', fontSize: '14px', letterSpacing: '0.2em' }}>LOADING...</div>
      </div>
    }>
      <LoginContent />
    </Suspense>
  )
}
