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
            <img src="/icons/heatmatch-logo.svg" alt="HeatMatch" className="h-8" />
            <span className="font-bold">Lead Admin</span>
          </Link>
        </div>

        {/* Nav Links */}
        <nav className="p-6 space-y-1">
          <Link
            href="/admin"
            className="block px-4 py-2 rounded-lg hover:bg-gray-800 transition text-sm font-medium"
            onClick={() => setMobileMenuOpen(false)}
          >
            📊 Dashboard
          </Link>
          <Link
            href="/admin/leads"
            className="block px-4 py-2 rounded-lg hover:bg-gray-800 transition text-sm font-medium"
            onClick={() => setMobileMenuOpen(false)}
          >
            📋 Leads
          </Link>
          <Link
            href="/admin/installers"
            className="block px-4 py-2 rounded-lg hover:bg-gray-800 transition text-sm font-medium"
            onClick={() => setMobileMenuOpen(false)}
          >
            👷 Installers
          </Link>
        </nav>

        {/* Footer */}
        <div className="absolute bottom-0 left-0 right-0 p-6 space-y-2 border-t border-gray-700">
          <button
            onClick={handleLogout}
            className="w-full px-4 py-2 rounded-lg bg-red-700 hover:bg-red-600 transition text-sm font-medium"
          >
            🚪 Logout
          </button>
          <Link
            href="/"
            className="block px-4 py-2 rounded-lg bg-gray-700 hover:bg-gray-600 transition text-center text-sm font-medium"
            onClick={() => setMobileMenuOpen(false)}
          >
            ← Back to Site
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
