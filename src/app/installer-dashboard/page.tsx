'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import PageLayout from '@/components/PageLayout';

interface DashboardData {
  businessName: string;
  email: string;
  installerSlug?: string;
  verifiedAt?: string;
}

export default function InstallerDashboardPage() {
  const router = useRouter();
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const res = await fetch('/api/installer/dashboard');

        if (!res.ok) {
          if (res.status === 401) {
            router.push('/installer-login');
            return;
          }
          setError('Failed to load dashboard');
          return;
        }

        const userData = await res.json();
        setData(userData);
      } catch (err) {
        console.error('Dashboard error:', err);
        setError('An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [router]);

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      router.push('/');
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-NZ', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <PageLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-gray-600">Loading dashboard...</div>
        </div>
      </PageLayout>
    );
  }

  if (error || !data) {
    return (
      <PageLayout>
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <h2 className="text-lg font-semibold text-red-900 mb-2">Dashboard Unavailable</h2>
            <p className="text-red-700 mb-4">{error || 'Unable to load your dashboard'}</p>
            <Link
              href="/"
              className="inline-block px-4 py-2 bg-emerald-600 text-white rounded hover:bg-emerald-700"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      {/* Header */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold text-emerald-600">
            HeatMatch
          </Link>
          <button
            onClick={handleLogout}
            className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 border border-gray-300 rounded hover:bg-gray-50"
          >
            Logout
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Welcome Card */}
        <div className="bg-gradient-to-r from-emerald-50 to-emerald-100 rounded-lg p-8 mb-8 border border-emerald-200">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Welcome back, {data.businessName}
              </h1>
              <p className="text-gray-600">Manage your HeatMatch profile and track your activity</p>
            </div>
            <div className="bg-emerald-600 text-white px-4 py-2 rounded-full text-sm font-semibold flex items-center gap-2 whitespace-nowrap">
              <span>✓</span>
              <span>Verified</span>
            </div>
          </div>
          {data.verifiedAt && (
            <p className="text-sm text-gray-600 mt-4">
              Verified on {formatDate(data.verifiedAt)}
            </p>
          )}
        </div>

        {/* Quick Actions Card */}
        <div className="bg-white rounded-lg border border-gray-200 p-8 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Quick Actions</h2>
          <div className="space-y-3">
            {data.installerSlug && (
              <Link
                href={`/en/installers/${data.installerSlug}`}
                className="block w-full px-4 py-3 text-center bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 font-medium transition"
              >
                View Your Public Profile
              </Link>
            )}
            <button
              disabled
              className="block w-full px-4 py-3 text-center bg-gray-100 text-gray-500 rounded-lg cursor-not-allowed font-medium"
              title="Coming soon"
            >
              Edit Profile (Coming Soon)
            </button>
          </div>
        </div>

        {/* Help & Next Steps Card */}
        <div className="bg-white rounded-lg border border-gray-200 p-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">What's Next?</h2>
          <div className="space-y-4">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 font-bold text-sm">
                ✓
              </div>
              <div>
                <p className="font-medium text-gray-900">Your business is verified on HeatMatch</p>
                <p className="text-sm text-gray-600 mt-1">You can now receive leads from customers searching for heat pump installers in your area.</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-bold text-sm">
                •
              </div>
              <div>
                <p className="font-medium text-gray-900">Update your profile (Coming Soon)</p>
                <p className="text-sm text-gray-600 mt-1">Add photos, update your services, and write a description to attract more customers.</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-bold text-sm">
                •
              </div>
              <div>
                <p className="font-medium text-gray-900">Monitor leads (Coming Soon)</p>
                <p className="text-sm text-gray-600 mt-1">Track customer inquiries and respond to leads directly from your dashboard.</p>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-gray-200">
              <p className="text-sm text-gray-600">
                Need help? Email us at{' '}
                <a href="mailto:support@heatmatch.co.nz" className="text-emerald-600 hover:text-emerald-700 font-medium">
                  support@heatmatch.co.nz
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
