'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface Lead {
  id: string;
  homeowner_name: string;
  email: string;
  phone: string;
  suburb: string;
  service_type: string;
  timeline: string;
  status: string;
  has_photos: boolean;
  created_at: string;
  assigned_installers: string[];
}

export default function AdminLeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [limit] = useState(10);

  // Filters
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterSuburb, setFilterSuburb] = useState('');
  const [filterServiceType, setFilterServiceType] = useState('all');

  const fetchLeads = async () => {
    setIsLoading(true);
    try {
      const offset = (currentPage - 1) * limit;
      const params = new URLSearchParams({
        limit: limit.toString(),
        offset: offset.toString(),
      });

      if (filterStatus !== 'all') params.append('status', filterStatus);
      if (filterSuburb) params.append('suburb', filterSuburb);
      if (filterServiceType !== 'all') params.append('service_type', filterServiceType);

      const res = await fetch(`/api/admin/leads?${params}`);
      const data = await res.json();

      setLeads(data.leads || []);
      setTotal(data.total || 0);
    } catch (error) {
      console.error('Error fetching leads:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    setCurrentPage(1); // Reset to page 1 when filters change
  }, [filterStatus, filterSuburb, filterServiceType]);

  useEffect(() => {
    fetchLeads();
  }, [currentPage, filterStatus, filterSuburb, filterServiceType]);

  const pages = Math.ceil(total / limit);
  const statusColors: Record<string, string> = {
    new: 'bg-blue-100 text-blue-800',
    allocated: 'bg-yellow-100 text-yellow-800',
    contacted: 'bg-purple-100 text-purple-800',
    converted: 'bg-emerald-100 text-emerald-800',
    failed: 'bg-red-100 text-red-800',
  };

  const serviceTypeLabels: Record<string, string> = {
    new_install: 'New Install',
    replace: 'Replace',
    service: 'Service',
    advice: 'Advice',
  };

  const timelineLabels: Record<string, string> = {
    asap: 'ASAP',
    two_weeks: '2 Weeks',
    one_month: '1 Month',
    researching: 'Researching',
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Leads</h1>
        <p className="text-gray-600 mt-2">Manage and track all incoming leads</p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Filters</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Status Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900"
            >
              <option value="all">All Statuses</option>
              <option value="new">New</option>
              <option value="allocated">Allocated</option>
              <option value="contacted">Contacted</option>
              <option value="converted">Converted</option>
              <option value="failed">Failed</option>
            </select>
          </div>

          {/* Service Type Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Service Type</label>
            <select
              value={filterServiceType}
              onChange={(e) => setFilterServiceType(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900"
            >
              <option value="all">All Services</option>
              <option value="new_install">New Install</option>
              <option value="replace">Replace</option>
              <option value="service">Service</option>
              <option value="advice">Advice</option>
            </select>
          </div>

          {/* Suburb Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Suburb</label>
            <input
              type="text"
              placeholder="Filter by suburb..."
              value={filterSuburb}
              onChange={(e) => setFilterSuburb(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900"
            />
          </div>

          {/* Reset Filters */}
          <div className="flex items-end">
            <button
              onClick={() => {
                setFilterStatus('all');
                setFilterSuburb('');
                setFilterServiceType('all');
              }}
              className="w-full px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-900 rounded-lg font-medium transition"
            >
              Reset
            </button>
          </div>
        </div>
      </div>

      {/* Leads Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {isLoading ? (
          <div className="p-8 text-center text-gray-600">Loading leads...</div>
        ) : leads.length === 0 ? (
          <div className="p-8 text-center text-gray-600">No leads found</div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Contact</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Suburb</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Service</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Timeline</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Photos</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {leads.map((lead) => (
                    <tr key={lead.id} className="hover:bg-gray-50 transition">
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {new Date(lead.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">{lead.homeowner_name}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        <div className="text-xs">{lead.phone}</div>
                        <div className="text-xs">{lead.email}</div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">{lead.suburb}</td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {serviceTypeLabels[lead.service_type] || lead.service_type}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {timelineLabels[lead.timeline] || lead.timeline}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {lead.has_photos ? '📷 Yes' : '—'}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusColors[lead.status] || 'bg-gray-100 text-gray-800'}`}>
                          {lead.status.charAt(0).toUpperCase() + lead.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <Link
                          href={`/admin/leads/${lead.id}`}
                          className="text-emerald-600 hover:text-emerald-700 font-medium"
                        >
                          View
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="bg-white px-6 py-4 border-t border-gray-200 flex items-center justify-between">
              <div className="text-sm text-gray-600">
                Showing {(currentPage - 1) * limit + 1} to {Math.min(currentPage * limit, total)} of {total} leads
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="px-4 py-2 bg-gray-200 hover:bg-gray-300 disabled:bg-gray-100 text-gray-900 rounded-lg font-medium transition disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                {Array.from({ length: pages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`px-3 py-2 rounded-lg font-medium transition ${
                      currentPage === page
                        ? 'bg-emerald-600 text-white'
                        : 'bg-gray-200 hover:bg-gray-300 text-gray-900'
                    }`}
                  >
                    {page}
                  </button>
                ))}
                <button
                  onClick={() => setCurrentPage(Math.min(pages, currentPage + 1))}
                  disabled={currentPage === pages}
                  className="px-4 py-2 bg-gray-200 hover:bg-gray-300 disabled:bg-gray-100 text-gray-900 rounded-lg font-medium transition disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
