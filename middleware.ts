import { NextResponse, type NextRequest } from 'next/server'
import { stackServerApp } from "@/stack";
import { prisma } from './lib/db';

export async function middleware(request: NextRequest) {
  const user = await stackServerApp.getUser(); 
  // Public routes that don't require authentication
  const publicRoutes = [
    '/',
    '/login',
    '/register',
    '/auth',
    '/api/auth/confirm',
    '/api/auth/callback',
    '/handler'
  ]

  const isPublicRoute = publicRoutes.some(route => 
    request.nextUrl.pathname.startsWith(route)
  )

  // If no user and trying to access protected route, redirect to login
  if (!user && !isPublicRoute) {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    return NextResponse.redirect(url)
  }

  // If user exists, check if profile is completed
  if (user && !isPublicRoute) {
    // Check if user has completed their profile using Prisma
    const profile = await prisma.profile.findFirst({
      where: { userId: user.id },
      select: { completedAt: true },
    });

    // If no profile or not completed, redirect to onboarding
    // Exception: allow access to the onboarding page itself
    if ((!profile || !profile.completedAt) && 
        !request.nextUrl.pathname.startsWith('/profile/onboarding') &&
        !request.nextUrl.pathname.startsWith('/api/profile/complete')) {
      const url = request.nextUrl.clone()
      url.pathname = '/profile/onboarding'
      return NextResponse.redirect(url)
    }

    // If profile is completed but trying to access onboarding, redirect to dashboard
    if (profile?.completedAt && request.nextUrl.pathname.startsWith('/profile/onboarding')) {
      const url = request.nextUrl.clone()
      url.pathname = '/dashboard'
      return NextResponse.redirect(url)
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}