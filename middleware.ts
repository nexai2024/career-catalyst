import { NextResponse, type NextRequest } from 'next/server'
import { stackServerApp } from "@/stack";
import { prisma } from './lib/db';

export async function middleware(request: NextRequest) {
  const user = await stackServerApp.getUser(); 
 // console.log('Middleware user:', user);
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