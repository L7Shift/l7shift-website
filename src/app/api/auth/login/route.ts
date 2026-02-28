import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import {
  getUserByEmail,
  verifyPassword,
  createSession,
  generateSecureToken,
  isAccountLocked,
  recordFailedLogin,
  clearFailedLogins,
  logSecurityEvent,
} from '@/lib/auth'
import { checkRateLimit, clearRateLimit, detectSuspiciousActivity } from '@/lib/rateLimit'
import { verifyCaptchaToken } from '@/lib/captcha'

export async function POST(request: NextRequest) {
  const startTime = Date.now()

  // Get client IP for rate limiting and logging
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
             request.headers.get('x-real-ip') ||
             'unknown'
  const userAgent = request.headers.get('user-agent') || 'unknown'

  try {
    const body = await request.json()
    const { email, password, captchaToken, captchaType = 'recaptcha' } = body

    // Input validation
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      )
    }

    // Validate input lengths to prevent DoS
    if (email.length > 255 || password.length > 128) {
      return NextResponse.json(
        { error: 'Invalid input' },
        { status: 400 }
      )
    }

    const normalizedEmail = email.toLowerCase().trim()

    // Check IP-based rate limit
    const rateLimit = await checkRateLimit(ip)
    if (!rateLimit.success) {
      const resetMinutes = Math.ceil((rateLimit.reset - Date.now()) / 60000)
      await logSecurityEvent('rate_limit_exceeded', normalizedEmail, ip, userAgent, false, {
        resetMinutes,
        remaining: rateLimit.remaining,
      })
      return NextResponse.json(
        { error: `Too many login attempts. Please try again in ${resetMinutes} minutes.` },
        { status: 429, headers: { 'Retry-After': String(resetMinutes * 60) } }
      )
    }

    // Check email-based rate limit
    const emailRateLimit = await checkRateLimit(`email_${normalizedEmail}`)
    if (!emailRateLimit.success) {
      await logSecurityEvent('email_rate_limit', normalizedEmail, ip, userAgent, false)
      return NextResponse.json(
        { error: 'Too many login attempts for this account. Please try again later.' },
        { status: 429 }
      )
    }

    // Verify CAPTCHA if token provided
    if (captchaToken) {
      const captchaResult = await verifyCaptchaToken(captchaToken, captchaType, {
        action: 'login',
        ip,
      })
      if (!captchaResult.success) {
        await logSecurityEvent('captcha_failed', normalizedEmail, ip, userAgent, false, {
          errorCodes: captchaResult.errorCodes,
          score: captchaResult.score,
        })
        // Log but don't block — Turnstile can fail on mobile browsers
        console.warn('[LOGIN] CAPTCHA failed for', normalizedEmail, captchaResult.errorCodes)
      }
    }

    // Check for suspicious activity
    const suspicious = await detectSuspiciousActivity(ip, normalizedEmail, userAgent)
    if (suspicious && suspicious.confidence >= 0.8) {
      await logSecurityEvent('suspicious_activity_blocked', normalizedEmail, ip, userAgent, false, {
        type: suspicious.type,
        confidence: suspicious.confidence,
        details: suspicious.details,
      })
      return NextResponse.json(
        { error: 'Suspicious activity detected. Please try again later or contact support.' },
        { status: 403 }
      )
    }

    // Check if account is locked
    const locked = await isAccountLocked(normalizedEmail)
    if (locked) {
      await logSecurityEvent('locked_account_attempt', normalizedEmail, ip, userAgent, false)
      return NextResponse.json(
        { error: 'Account temporarily locked due to multiple failed attempts. Please try again in 15 minutes.' },
        { status: 423 }
      )
    }

    // Get user
    const user = await getUserByEmail(normalizedEmail)

    // Verify password (all users use bcrypt comparison)
    let isValid = false
    if (user) {
      isValid = await verifyPassword(password, user.password_hash)
    }

    // Add timing jitter to prevent timing attacks
    const elapsed = Date.now() - startTime
    const minTime = 200 // Minimum response time in ms
    if (elapsed < minTime) {
      await new Promise(resolve => setTimeout(resolve, minTime - elapsed))
    }

    if (!isValid || !user) {
      await recordFailedLogin(normalizedEmail)
      await logSecurityEvent('login_failed', normalizedEmail, ip, userAgent, false, {
        reason: !user ? 'user_not_found' : 'invalid_password',
      })
      // Generic error message to prevent user enumeration
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      )
    }

    // Successful login - clear rate limits and failed attempts
    await clearRateLimit(ip)
    await clearRateLimit(`email_${normalizedEmail}`)
    await clearFailedLogins(user.id)

    // Generate secure session token
    const token = generateSecureToken()

    // Create session record
    const session = await createSession(user.id, token, ip, userAgent)

    // Log successful login
    await logSecurityEvent('login_success', normalizedEmail, ip, userAgent, true, {
      sessionId: session?.id,
      role: user.role,
    })

    // Set secure cookies
    const cookieStore = await cookies()
    const maxAge = 60 * 60 * 24 * 7 // 7 days
    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax' as const,
      maxAge,
      path: '/',
    }

    cookieStore.set('l7_auth_token', token, cookieOptions)
    cookieStore.set('l7_user_role', user.role, cookieOptions)
    cookieStore.set('l7_user_email', normalizedEmail, cookieOptions)
    cookieStore.set('l7_user_id', user.id, cookieOptions)

    // User name can be accessed client-side for UI
    cookieStore.set('l7_user_name', user.name, {
      ...cookieOptions,
      httpOnly: false,
    })

    if (user.client_slug) {
      cookieStore.set('l7_client_slug', user.client_slug, cookieOptions)
    }

    return NextResponse.json({
      success: true,
      role: user.role,
      clientSlug: user.client_slug,
      name: user.name,
    })
  } catch (error) {
    console.error('[LOGIN] Error:', error)
    await logSecurityEvent('login_error', 'unknown', ip, userAgent, false, {
      error: error instanceof Error ? error.message : 'Unknown error',
    })
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
