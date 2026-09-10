import { NextRequest, NextResponse } from 'next/server';
import createIntlMiddleware from 'next-intl/middleware';
import { defaultLocale, locales } from './lib/i18n';

const intlMiddleware = createIntlMiddleware({
  locales,
  defaultLocale,
  localePrefix: 'always',
});

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Skip i18n for admin, installer, and API routes — they don't use locale prefixes
  const isAdminRoute = pathname.startsWith('/admin') && !pathname.startsWith('/admin-login');
  const isAdminLoginPage = pathname === '/admin-login';
  const isInstallerRoute = pathname.startsWith('/installer-dashboard');
  const isApiRoute = pathname.startsWith('/api');
  const isNonLocaleRoute =
    isAdminRoute ||
    isAdminLoginPage ||
    isInstallerRoute ||
    isApiRoute ||
    pathname.startsWith('/installer-login') ||
    pathname.startsWith('/installer-onboarding') ||
    pathname.startsWith('/installer-signup') ||
    pathname.startsWith('/installer/') ||
    pathname.startsWith('/search');

  // For non-locale routes, apply auth guards instead of i18n
  if (isNonLocaleRoute) {
    const adminSession = request.cookies.get('admin_session')?.value;
    const installerSession = request.cookies.get('tradeev2_session')?.value;

    if (isAdminRoute && !adminSession) {
      return NextResponse.redirect(new URL('/admin-login', request.url));
    }

    if (isAdminLoginPage && adminSession) {
      return NextResponse.redirect(new URL('/admin', request.url));
    }

    if (isInstallerRoute && !installerSession) {
      return NextResponse.redirect(new URL('/installer-login', request.url));
    }

    return NextResponse.next();
  }

  // For public locale routes, apply i18n middleware
  return intlMiddleware(request);
}

export const config = {
  matcher: [
    '/',
    '/(en|zh-CN|zh-TW)/:path*',
    '/((?!_next|_vercel|.*\\..*).*)',
  ],
};
