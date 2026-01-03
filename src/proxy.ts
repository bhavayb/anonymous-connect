import { NextResponse, NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/sign-in',
    '/sign-up',
    '/',
    '/verify/:path*',
  ],
}

// Only one middleware; remove default re-export to avoid conflicts.
export async function proxy(request: NextRequest) {
  const token = await getToken({ req: request })
  const url = request.nextUrl
  const pathname = url.pathname
  const isAuthed = !!token

  const isPublic =
    pathname === '/' ||
    pathname.startsWith('/sign-in') ||
    pathname.startsWith('/sign-up') ||
    pathname.startsWith('/verify')

  // Only redirect authenticated users from sign-in, sign-up, or verify to dashboard
  if (
    isAuthed &&
    (pathname.startsWith('/sign-in') ||
      pathname.startsWith('/sign-up') ||
      pathname.startsWith('/verify'))
  ) {
    if (pathname !== '/dashboard') {
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }
    return NextResponse.next()
  }

  // If not authenticated and trying to access dashboard, send to sign-in
  if (!isAuthed && pathname.startsWith('/dashboard')) {
    const signInUrl = new URL('/sign-in', request.url)
    // preserve where the user intended to go
    signInUrl.searchParams.set('callbackUrl', url.pathname + url.search)
    return NextResponse.redirect(signInUrl)
  }

  return NextResponse.next()
}

