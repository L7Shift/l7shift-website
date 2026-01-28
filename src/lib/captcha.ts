// reCAPTCHA v3 verification
// Add RECAPTCHA_SECRET_KEY to your environment variables

const RECAPTCHA_SECRET = process.env.RECAPTCHA_SECRET_KEY
const RECAPTCHA_VERIFY_URL = 'https://www.google.com/recaptcha/api/siteverify'

export interface CaptchaVerifyResult {
  success: boolean
  score?: number
  action?: string
  challenge_ts?: string
  hostname?: string
  errorCodes?: string[]
}

export async function verifyCaptcha(token: string, expectedAction?: string): Promise<CaptchaVerifyResult> {
  // Skip verification in development if no secret key
  if (!RECAPTCHA_SECRET) {
    console.warn('[CAPTCHA] No secret key configured, skipping verification')
    return { success: true, score: 1.0 }
  }

  try {
    const response = await fetch(RECAPTCHA_VERIFY_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: `secret=${encodeURIComponent(RECAPTCHA_SECRET)}&response=${encodeURIComponent(token)}`,
    })

    const data = await response.json()

    // Verify the response
    if (!data.success) {
      return {
        success: false,
        errorCodes: data['error-codes'],
      }
    }

    // Check action if expected
    if (expectedAction && data.action !== expectedAction) {
      return {
        success: false,
        errorCodes: ['invalid-action'],
      }
    }

    // Check score (0.0 to 1.0, higher is more likely human)
    // Threshold of 0.5 is recommended by Google
    const score = data.score || 0
    if (score < 0.5) {
      return {
        success: false,
        score,
        errorCodes: ['low-score'],
      }
    }

    return {
      success: true,
      score: data.score,
      action: data.action,
      challenge_ts: data.challenge_ts,
      hostname: data.hostname,
    }
  } catch (error) {
    console.error('[CAPTCHA] Verification error:', error)
    return {
      success: false,
      errorCodes: ['verification-failed'],
    }
  }
}

// hCaptcha verification (alternative to reCAPTCHA)
const HCAPTCHA_SECRET = process.env.HCAPTCHA_SECRET_KEY
const HCAPTCHA_VERIFY_URL = 'https://hcaptcha.com/siteverify'

export async function verifyHCaptcha(token: string): Promise<CaptchaVerifyResult> {
  if (!HCAPTCHA_SECRET) {
    console.warn('[HCAPTCHA] No secret key configured, skipping verification')
    return { success: true }
  }

  try {
    const response = await fetch(HCAPTCHA_VERIFY_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: `secret=${encodeURIComponent(HCAPTCHA_SECRET)}&response=${encodeURIComponent(token)}`,
    })

    const data = await response.json()

    return {
      success: data.success,
      errorCodes: data['error-codes'],
    }
  } catch (error) {
    console.error('[HCAPTCHA] Verification error:', error)
    return {
      success: false,
      errorCodes: ['verification-failed'],
    }
  }
}

// Turnstile verification (Cloudflare's CAPTCHA alternative)
const TURNSTILE_SECRET = process.env.TURNSTILE_SECRET_KEY
const TURNSTILE_VERIFY_URL = 'https://challenges.cloudflare.com/turnstile/v0/siteverify'

export async function verifyTurnstile(token: string, ip?: string): Promise<CaptchaVerifyResult> {
  if (!TURNSTILE_SECRET) {
    console.warn('[TURNSTILE] No secret key configured, skipping verification')
    return { success: true }
  }

  try {
    const body: Record<string, string> = {
      secret: TURNSTILE_SECRET,
      response: token,
    }

    if (ip) {
      body.remoteip = ip
    }

    const response = await fetch(TURNSTILE_VERIFY_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    })

    const data = await response.json()

    return {
      success: data.success,
      challenge_ts: data.challenge_ts,
      hostname: data.hostname,
      errorCodes: data['error-codes'],
    }
  } catch (error) {
    console.error('[TURNSTILE] Verification error:', error)
    return {
      success: false,
      errorCodes: ['verification-failed'],
    }
  }
}

// Generic CAPTCHA verifier that uses whichever is configured
export async function verifyCaptchaToken(
  token: string,
  type: 'recaptcha' | 'hcaptcha' | 'turnstile' = 'recaptcha',
  options?: { action?: string; ip?: string }
): Promise<CaptchaVerifyResult> {
  switch (type) {
    case 'hcaptcha':
      return verifyHCaptcha(token)
    case 'turnstile':
      return verifyTurnstile(token, options?.ip)
    case 'recaptcha':
    default:
      return verifyCaptcha(token, options?.action)
  }
}
