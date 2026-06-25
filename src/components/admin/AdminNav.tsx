'use client';

import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useState } from 'react';

export default function AdminNav() {
  const router = useRouter();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (path: string) => {
    if (path === '/admin' && pathname === '/admin') return true;
    if (path !== '/admin' && pathname.startsWith(path)) return true;
    return false;
  };

  const handleLogout = async () => {
    await fetch('/api/admin/auth/logout', { method: 'POST' });
    router.push('/admin/login');
  };

  return (
    <>
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-gray-900 text-white flex items-center justify-between px-4 z-40">
        <Link href="/" className="font-bold text-lg">HeatMatch</Link>
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="text-white"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 w-64 h-screen bg-gray-900 text-white transform transition-transform duration-300 z-50 lg:translate-x-0 ${
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0`}
      >
        {/* Logo */}
        <div className="p-6 border-b border-gray-700">
          <Link href="/" className="flex items-center gap-2">
            <img src="/icons/heatmatch-logo-white.svg" alt="HeatMatch" className="h-8" />
            <span className="font-bold">Lead Admin</span>
          </Link>
        </div>

        {/* Nav Links */}
        <nav className="p-6 space-y-1">
          <Link
            href="/admin"
            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition text-sm font-medium ${
              isActive('/admin')
                ? 'bg-gray-800 text-white'
                : 'text-gray-400 hover:bg-gray-800 hover:text-white'
            }`}
            onClick={() => setMobileMenuOpen(false)}
          >
            <svg className={`w-5 h-5 ${isActive('/admin') ? 'text-emerald-500' : 'text-gray-400'}`} viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="3.5">
              <path d="M10 28L32 10l22 18" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M16 26v28h32V26" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M26 54V38h12v16" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Dashboard
          </Link>
          <Link
            href="/admin/leads"
            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition text-sm font-medium ${
              isActive('/admin/leads')
                ? 'bg-gray-800 text-white'
                : 'text-gray-400 hover:bg-gray-800 hover:text-white'
            }`}
            onClick={() => setMobileMenuOpen(false)}
          >
            <svg className={`w-5 h-5 ${isActive('/admin/leads') ? 'text-emerald-500' : 'text-gray-400'}`} viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="3.5">
              <rect x="16" y="12" width="32" height="40" rx="4" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M22 22h20M22 30h20M22 38h12" strokeLinecap="round"/>
              <path d="M22 12v8h20v-8" strokeLinecap="round" strokeLinejoin="round"/>
              <circle cx="40" cy="38" r="2" fill="currentColor"/>
            </svg>
            Leads
          </Link>
          <Link
            href="/admin/installers"
            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition text-sm font-medium ${
              isActive('/admin/installers')
                ? 'bg-gray-800 text-white'
                : 'text-gray-400 hover:bg-gray-800 hover:text-white'
            }`}
            onClick={() => setMobileMenuOpen(false)}
          >
            <svg className={`w-5 h-5 ${isActive('/admin/installers') ? 'text-emerald-500' : 'text-gray-400'}`} viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="3.5">
              <circle cx="24" cy="24" r="7" strokeLinecap="round"/>
              <circle cx="42" cy="28" r="6" strokeLinecap="round"/>
              <path d="M14 50c2-8 8-12 16-12s14 4 16 12" strokeLinecap="round"/>
            </svg>
            Installers
          </Link>
          <Link
            href="/admin/reports"
            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition text-sm font-medium ${
              isActive('/admin/reports')
                ? 'bg-gray-800 text-white'
                : 'text-gray-400 hover:bg-gray-800 hover:text-white'
            }`}
            onClick={() => setMobileMenuOpen(false)}
          >
            <svg className={`w-5 h-5 ${isActive('/admin/reports') ? 'text-emerald-500' : 'text-gray-400'}`} viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="3.5">
              <path d="M14 50h36" strokeLinecap="round"/>
              <rect x="18" y="34" width="5" height="16" rx="1.5"/>
              <rect x="29" y="26" width="5" height="24" rx="1.5"/>
              <rect x="40" y="18" width="5" height="32" rx="1.5"/>
            </svg>
            Reports
          </Link>
          <Link
            href="/admin/settings"
            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition text-sm font-medium ${
              isActive('/admin/settings')
                ? 'bg-gray-800 text-white'
                : 'text-gray-400 hover:bg-gray-800 hover:text-white'
            }`}
            onClick={() => setMobileMenuOpen(false)}
          >
            <svg className={`w-5 h-5 ${isActive('/admin/settings') ? 'text-emerald-500' : 'text-gray-400'}`} viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="3.5">
              <circle cx="32" cy="32" r="7" strokeLinecap="round"/>
              <path d="M32 14v6M32 44v6M14 32h6M44 32h6M20 20l4 4M40 40l4 4M44 20l-4 4M20 44l4-4" strokeLinecap="round"/>
              <circle cx="32" cy="32" r="18" strokeWidth="3"/>
            </svg>
            Settings
          </Link>
        </nav>

        {/* Footer */}
        <div className="absolute bottom-0 left-0 right-0 p-6 space-y-3 border-t border-gray-700">
          {/* User Profile */}
          <div className="flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-gray-800 cursor-pointer transition group">
            <div className="w-10 h-10 bg-emerald-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
              AR
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-white truncate">Alex Ross</p>
              <p className="text-xs text-gray-400">Admin</p>
            </div>
            <svg className="w-4 h-4 text-gray-400 group-hover:text-white transition" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </div>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg bg-gray-800 hover:bg-gray-700 transition text-sm font-medium text-gray-300 hover:text-white"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Logout
          </button>

          {/* Back to Site Button */}
          <Link
            href="/"
            className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-gray-800 hover:bg-gray-700 transition text-sm font-medium text-gray-300 hover:text-white"
            onClick={() => setMobileMenuOpen(false)}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Site
          </Link>
        </div>
      </aside>

      {/* Mobile overlay */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}
    </>
  );
}
