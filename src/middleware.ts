import { NextRequest, NextResponse } from 'next/server'
import { verifySessionToken } from '@/lib/auth/session'

// Middleware matcher - only for /admin routes
export const config = {
  matcher: ['/admin/:path*'],
}

/**
 * Middleware for admin route protection
 * - Verifies JWT token in admin_session cookie
 * - Allows /admin/login without authentication
 * - Redirects authenticated users away from /admin/login
 */
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Allow /admin/login without authentication
  if (pathname === '/admin/login') {
    // If already authenticated, redirect to /admin
    const token = request.cookies.get('admin_session')?.value
    if (token) {
      try {
        await verifySessionToken(token)
        // Token is valid, redirect to /admin
        const response = NextResponse.redirect(new URL('/admin', request.url))
        return response
      } catch {
        // Token is invalid, allow access to login page
        // Delete invalid cookie
        const response = NextResponse.next()
        response.cookies.set('admin_session', '', { maxAge: 0, path: '/admin' })
        return response
      }
    }
    // No token, allow access to login page
    return NextResponse.next()
  }

  // For all other /admin routes, require authentication
  const token = request.cookies.get('admin_session')?.value

  if (!token) {
    // No token, redirect to login
    return NextResponse.redirect(new URL('/admin/login', request.url))
  }

  try {
    // Verify token
    await verifySessionToken(token)
    // Token is valid, allow request
    return NextResponse.next()
  } catch (error) {
    // Token is invalid or expired, redirect to login
    const response = NextResponse.redirect(new URL('/admin/login', request.url))
    // Delete invalid cookie
    response.cookies.set('admin_session', '', { maxAge: 0, path: '/admin' })
    return response
  }
}
