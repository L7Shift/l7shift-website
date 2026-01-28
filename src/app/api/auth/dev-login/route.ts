import { NextRequest, NextResponse } from 'next/server'

// Simple dev-only login route that bypasses rate limiting and captcha
// Only works in development mode

const DEV_USERS: Record<string, { password: string; role: 'admin' | 'internal' | 'client'; name: string; clientSlug?: string }> = {
  'ken@l7shift.com': {
    password: process.env.ADMIN_PASSWORD || 'admin123',
    role: 'admin',
    name: 'Ken',
  },
  'closetsbyjazz@gmail.com': {
    password: process.env.PPC_CLIENT_PASSWORD || 'client123',
    role: 'client',
    name: 'Jazz',
    clientSlug: 'prettypaidcloset',
  },
}

export async function POST(request: NextRequest) {
  // Only allow in development
  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json({ error: 'Not available in production' }, { status: 403 })
  }

  try {
    const body = await request.json()
    const { email, password } = body

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password required' }, { status: 400 })
    }

    const user = DEV_USERS[email.toLowerCase()]

    if (!user || user.password !== password) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
    }

    // Create response with cookies
    const response = NextResponse.json({
      success: true,
      role: user.role,
      clientSlug: user.clientSlug,
      name: user.name,
    })

    const maxAge = 60 * 60 * 24 * 7 // 7 days

    response.cookies.set('l7_auth_token', `dev_${Date.now()}`, {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
      maxAge,
      path: '/',
    })
    response.cookies.set('l7_user_role', user.role, {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
      maxAge,
      path: '/',
    })
    response.cookies.set('l7_user_email', email.toLowerCase(), {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
      maxAge,
      path: '/',
    })
    response.cookies.set('l7_user_id', `dev_${email.toLowerCase()}`, {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
      maxAge,
      path: '/',
    })
    response.cookies.set('l7_user_name', user.name, {
      httpOnly: false,
      secure: false,
      sameSite: 'lax',
      maxAge,
      path: '/',
    })

    if (user.clientSlug) {
      response.cookies.set('l7_client_slug', user.clientSlug, {
        httpOnly: true,
        secure: false,
        sameSite: 'lax',
        maxAge,
        path: '/',
      })
    }

    return response
  } catch (error) {
    console.error('[DEV-LOGIN] Error:', error)
    return NextResponse.json({ error: 'Login failed', details: String(error) }, { status: 500 })
  }
}
