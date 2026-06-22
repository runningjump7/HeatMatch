import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const adminSession = request.cookies.get('admin_session')?.value;
  const installerSession = request.cookies.get('tradeev2_session')?.value;

  // Admin routes (new auth system) - MUST exclude /admin-login
  const isAdminRoute = pathname.startsWith('/admin') && pathname !== '/admin-login' && !pathname.startsWith('/admin-login');
  const isAdminLoginPage = pathname === '/admin-login';

  // Installer routes (old auth system)
  const isInstallerRoute = pathname.startsWith('/installer-dashboard');

  // Admin auth checks
  if (isAdminRoute && !adminSession) {
    // Not logged in as admin, redirect to admin login
    return NextResponse.redirect(new URL('/admin-login', request.url));
  }

  if (isAdminLoginPage && adminSession) {
    // Already logged in as admin, redirect to dashboard
    return NextResponse.redirect(new URL('/admin', request.url));
  }

  // Installer auth checks (old system, keep for backwards compatibility)
  if (isInstallerRoute && !installerSession) {
    return NextResponse.redirect(new URL('/installer-login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
};
