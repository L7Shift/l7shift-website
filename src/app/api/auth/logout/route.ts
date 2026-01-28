import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { invalidateSession, logSecurityEvent } from '@/lib/auth'

export async function POST(request: NextRequest) {
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
             request.headers.get('x-real-ip') ||
             'unknown'
  const userAgent = request.headers.get('user-agent') || 'unknown'

  try {
    const cookieStore = await cookies()
    const token = cookieStore.get('l7_auth_token')?.value
    const email = cookieStore.get('l7_user_email')?.value || 'unknown'

    // Invalidate session in database
    if (token) {
      await invalidateSession(token)
    }

    // Log logout event
    await logSecurityEvent('logout', email, ip, userAgent, true)

    // Clear all auth cookies
    const cookiesToClear = [
      'l7_auth_token',
      'l7_user_role',
      'l7_user_email',
      'l7_user_id',
      'l7_user_name',
      'l7_client_slug',
    ]

    for (const name of cookiesToClear) {
      cookieStore.delete(name)
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('[LOGOUT] Error:', error)
    return NextResponse.json(
      { error: 'Logout failed' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
             request.headers.get('x-real-ip') ||
             'unknown'
  const userAgent = request.headers.get('user-agent') || 'unknown'

  const cookieStore = await cookies()
  const token = cookieStore.get('l7_auth_token')?.value
  const email = cookieStore.get('l7_user_email')?.value || 'unknown'

  // Invalidate session in database
  if (token) {
    await invalidateSession(token)
  }

  // Log logout event
  await logSecurityEvent('logout', email, ip, userAgent, true)

  // Clear all auth cookies
  const cookiesToClear = [
    'l7_auth_token',
    'l7_user_role',
    'l7_user_email',
    'l7_user_id',
    'l7_user_name',
    'l7_client_slug',
  ]

  for (const name of cookiesToClear) {
    cookieStore.delete(name)
  }

  // Redirect to login
  return NextResponse.redirect(new URL('/login', process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3001'))
}
