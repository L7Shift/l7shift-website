import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { validateSession } from '@/lib/auth'

// Get current session info
export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get('l7_auth_token')?.value

    if (!token) {
      return NextResponse.json({ authenticated: false }, { status: 401 })
    }

    // Validate session (for database users)
    const user = await validateSession(token)

    // For env users, fall back to cookie data
    if (!user) {
      const role = cookieStore.get('l7_user_role')?.value
      const email = cookieStore.get('l7_user_email')?.value
      const name = cookieStore.get('l7_user_name')?.value
      const clientSlug = cookieStore.get('l7_client_slug')?.value

      if (role && email) {
        return NextResponse.json({
          authenticated: true,
          user: {
            email,
            role,
            name,
            clientSlug,
          },
        })
      }

      return NextResponse.json({ authenticated: false }, { status: 401 })
    }

    return NextResponse.json({
      authenticated: true,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        name: user.name,
        clientSlug: user.client_slug,
      },
    })
  } catch (error) {
    console.error('[SESSION] Error:', error)
    return NextResponse.json(
      { error: 'Session check failed' },
      { status: 500 }
    )
  }
}
