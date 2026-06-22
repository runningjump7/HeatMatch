'use client';

import { useEffect, useState } from 'react';

interface Metrics {
  total: number;
  new: number;
  allocated: number;
  contacted: number;
  converted: number;
  failed: number;
  conversionRate: number;
}

export default function AdminDashboard() {
  const [metrics, setMetrics] = useState<Metrics | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const res = await fetch('/api/admin/leads?limit=9999');
        const data = await res.json();

        const leads = data.leads || [];
        const stats: Metrics = {
          total: data.total || 0,
          new: leads.filter((l: any) => l.status === 'new').length,
          allocated: leads.filter((l: any) => l.status === 'allocated').length,
          contacted: leads.filter((l: any) => l.status === 'contacted').length,
          converted: leads.filter((l: any) => l.status === 'converted').length,
          failed: leads.filter((l: any) => l.status === 'failed').length,
          conversionRate: data.total > 0 ? Math.round((leads.filter((l: any) => l.status === 'converted').length / data.total) * 100) : 0,
        };

        setMetrics(stats);
      } catch (error) {
        console.error('Error fetching metrics:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMetrics();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-600">Loading metrics...</div>
      </div>
    );
  }

  if (!metrics) {
    return <div className="text-red-600">Failed to load metrics</div>;
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Dashboard</h1>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        {/* Total Leads */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Total Leads</div>
          <div className="text-3xl font-bold text-gray-900 mt-2">{metrics.total}</div>
          <p className="text-xs text-gray-500 mt-1">All time</p>
        </div>

        {/* New */}
        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-blue-500">
          <div className="text-sm font-semibold text-gray-600 uppercase tracking-wide">New</div>
          <div className="text-3xl font-bold text-blue-600 mt-2">{metrics.new}</div>
          <p className="text-xs text-gray-500 mt-1">Awaiting review</p>
        </div>

        {/* Allocated */}
        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-yellow-500">
          <div className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Allocated</div>
          <div className="text-3xl font-bold text-yellow-600 mt-2">{metrics.allocated}</div>
          <p className="text-xs text-gray-500 mt-1">Sent to installers</p>
        </div>

        {/* Contacted */}
        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-purple-500">
          <div className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Contacted</div>
          <div className="text-3xl font-bold text-purple-600 mt-2">{metrics.contacted}</div>
          <p className="text-xs text-gray-500 mt-1">Installer reached customer</p>
        </div>

        {/* Converted */}
        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-emerald-500">
          <div className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Converted</div>
          <div className="text-3xl font-bold text-emerald-600 mt-2">{metrics.converted}</div>
          <p className="text-xs text-gray-500 mt-1">Customer accepted</p>
        </div>

        {/* Failed */}
        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-red-500">
          <div className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Failed</div>
          <div className="text-3xl font-bold text-red-600 mt-2">{metrics.failed}</div>
          <p className="text-xs text-gray-500 mt-1">Rejected or declined</p>
        </div>

        {/* Conversion Rate */}
        <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-lg shadow p-6 border border-emerald-200">
          <div className="text-sm font-semibold text-emerald-700 uppercase tracking-wide">Conversion Rate</div>
          <div className="text-3xl font-bold text-emerald-700 mt-2">{metrics.conversionRate}%</div>
          <p className="text-xs text-emerald-600 mt-1">Converted / Total</p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h2>
        <div className="flex flex-col sm:flex-row gap-3">
          <a
            href="/admin/leads"
            className="px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-medium transition"
          >
            View All Leads
          </a>
          <a
            href="/admin/installers"
            className="px-6 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-medium transition"
          >
            Manage Installers
          </a>
        </div>
      </div>
    </div>
  );
}
