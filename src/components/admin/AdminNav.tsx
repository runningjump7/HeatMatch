'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function AdminNav() {
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
            className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-800 transition text-sm font-medium"
            onClick={() => setMobileMenuOpen(false)}
          >
            <img src="/icons/admin-dashboard.svg" alt="Dashboard" className="w-5 h-5" />
            Dashboard
          </Link>
          <Link
            href="/admin/leads"
            className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-800 transition text-sm font-medium"
            onClick={() => setMobileMenuOpen(false)}
          >
            <img src="/icons/admin-leads.svg" alt="Leads" className="w-5 h-5" />
            Leads
          </Link>
          <Link
            href="/admin/installers"
            className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-800 transition text-sm font-medium"
            onClick={() => setMobileMenuOpen(false)}
          >
            <img src="/icons/admin-installers.svg" alt="Installers" className="w-5 h-5" />
            Installers
          </Link>
          <Link
            href="/admin/leads"
            className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-800 transition text-sm font-medium"
            onClick={() => setMobileMenuOpen(false)}
          >
            <img src="/icons/admin-reports.svg" alt="Reports" className="w-5 h-5" />
            Reports
          </Link>
          <Link
            href="/admin/leads"
            className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-800 transition text-sm font-medium"
            onClick={() => setMobileMenuOpen(false)}
          >
            <img src="/icons/admin-settings.svg" alt="Settings" className="w-5 h-5" />
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
