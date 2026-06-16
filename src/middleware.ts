import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const session = request.cookies.get('tradeev2_session')?.value;

  // Protected routes that require authentication
  const adminRoutes = pathname.startsWith('/admin');
  const installerRoutes = pathname.startsWith('/installer-dashboard');
  const isAuthPage = pathname.startsWith('/admin-login') || pathname.startsWith('/installer-login') || pathname.startsWith('/password-reset');

  // If user is already logged in and tries to visit login page, redirect to dashboard
  if (session && isAuthPage) {
    // Determine which dashboard based on session type
    // For now, redirect to installer-dashboard (can be enhanced to check role)
    return NextResponse.redirect(new URL('/installer-dashboard', request.url));
  }

  // If protected route and no session, redirect to login
  if ((adminRoutes || installerRoutes) && !session) {
    const loginUrl = adminRoutes ? '/admin-login' : '/installer-login';
    return NextResponse.redirect(new URL(loginUrl, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
};
