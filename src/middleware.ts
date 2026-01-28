import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Routes that require authentication
const protectedRoutes = ['/internal', '/portal']

// Routes that are always public
const publicRoutes = ['/', '/login', '/start', '/insights', '/wakeup', '/discovery', '/api']

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Check if this is a protected route
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route))

  if (!isProtectedRoute) {
    return NextResponse.next()
  }

  // Check for auth cookie
  const authToken = request.cookies.get('l7_auth_token')?.value
  const userRole = request.cookies.get('l7_user_role')?.value
  const userClientSlug = request.cookies.get('l7_client_slug')?.value

  // No auth token - redirect to login
  if (!authToken) {
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('redirect', pathname)
    return NextResponse.redirect(loginUrl)
  }

  // Check role-based access
  if (pathname.startsWith('/internal')) {
    // Internal routes require admin or internal role
    if (userRole !== 'admin' && userRole !== 'internal') {
      return NextResponse.redirect(new URL('/login?error=unauthorized', request.url))
    }
  }

  if (pathname.startsWith('/portal/')) {
    // Portal routes - admin can access any, clients only their own
    if (userRole === 'admin' || userRole === 'internal') {
      // Full access
      return NextResponse.next()
    }

    if (userRole === 'client') {
      // Extract client slug from path: /portal/[clientSlug]/...
      const pathParts = pathname.split('/')
      const requestedSlug = pathParts[2]

      if (requestedSlug !== userClientSlug) {
        return NextResponse.redirect(new URL('/login?error=unauthorized', request.url))
      }
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/internal/:path*',
    '/portal/:path*',
  ],
}
