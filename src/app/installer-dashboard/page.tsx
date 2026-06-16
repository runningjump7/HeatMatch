import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { query } from '@/lib/db';

export default async function InstallerDashboard() {
  const cookieStore = await cookies();
  const session = cookieStore.get('tradeev2_session');

  if (!session) {
    redirect('/installer-login');
  }

  const sessionId = session.value;

  try {
    // Get installer ID from users table
    const userResult = await query(
      `SELECT installer_id FROM users WHERE id = $1`,
      [sessionId]
    );

    if (!userResult.rows.length) {
      redirect('/installer-login');
    }

    const installerId = userResult.rows[0].installer_id;

    // Fetch metrics
    const metricsResult = await query(
      `SELECT
        (SELECT COUNT(*) FROM leads WHERE status IN ('new', 'unconfirmed')) as pending_leads,
        (SELECT COUNT(*) FROM leads WHERE status = 'accepted') as accepted_leads,
        (SELECT COALESCE(SUM(search_impressions), 0) FROM analytics
         WHERE installer_id = $1 AND date >= CURRENT_DATE - INTERVAL '30 days') as search_impressions,
        (SELECT COALESCE(SUM(profile_views), 0) FROM analytics
         WHERE installer_id = $1 AND date >= CURRENT_DATE - INTERVAL '30 days') as profile_views`,
      [installerId]
    );

    const metrics = metricsResult.rows[0];

    // Calculate response rate
    const totalLeads = parseInt(metrics.pending_leads) + parseInt(metrics.accepted_leads);
    const responseRate = totalLeads > 0
      ? Math.round((parseInt(metrics.accepted_leads) / totalLeads) * 100)
      : 0;

    return (
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-2">Welcome back! Here's your performance at a glance.</p>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Pending Leads */}
          <div className="bg-white rounded-lg shadow p-6 border-l-4 border-blue-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Pending Leads</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{metrics.pending_leads}</p>
              </div>
              <div className="text-4xl">📋</div>
            </div>
            <p className="text-xs text-gray-500 mt-3">Waiting for your action</p>
          </div>

          {/* Search Impressions */}
          <div className="bg-white rounded-lg shadow p-6 border-l-4 border-green-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Search Impressions</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{metrics.search_impressions}</p>
              </div>
              <div className="text-4xl">👁️</div>
            </div>
            <p className="text-xs text-gray-500 mt-3">Last 30 days</p>
          </div>

          {/* Profile Views */}
          <div className="bg-white rounded-lg shadow p-6 border-l-4 border-purple-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Profile Views</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{metrics.profile_views}</p>
              </div>
              <div className="text-4xl">👤</div>
            </div>
            <p className="text-xs text-gray-500 mt-3">Last 30 days</p>
          </div>

          {/* Response Rate */}
          <div className="bg-white rounded-lg shadow p-6 border-l-4 border-orange-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Response Rate</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{responseRate}%</p>
              </div>
              <div className="text-4xl">📊</div>
            </div>
            <p className="text-xs text-gray-500 mt-3">Leads accepted</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow p-8">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link
              href="/installer-dashboard/leads"
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-center font-medium"
            >
              View Leads →
            </Link>
            <Link
              href="/installer-dashboard/profile"
              className="px-6 py-3 bg-gray-200 text-gray-900 rounded-lg hover:bg-gray-300 transition text-center font-medium"
            >
              Edit Profile
            </Link>
            <Link
              href="/installer-dashboard/account"
              className="px-6 py-3 bg-gray-200 text-gray-900 rounded-lg hover:bg-gray-300 transition text-center font-medium"
            >
              Account Settings
            </Link>
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error('Dashboard error:', error);
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-lg">
        <p className="font-medium">Error loading dashboard</p>
        <p className="text-sm mt-1">Please try refreshing the page.</p>
      </div>
    );
  }
}
