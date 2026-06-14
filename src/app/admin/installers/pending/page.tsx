'use client';

import { useEffect, useState } from 'react';

interface PendingInstaller {
  id: string;
  business_name: string;
  email: string;
  phone: string;
  service_suburbs: string[];
  created_at: string;
}

export default function PendingInstallersPage() {
  const [installers, setInstallers] = useState<PendingInstaller[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    fetchPendingInstallers();
  }, []);

  const fetchPendingInstallers = async () => {
    try {
      const res = await fetch('/api/admin/installers/pending');
      if (!res.ok) throw new Error('Failed to fetch');
      const data = await res.json();
      setInstallers(data);
    } catch (error) {
      console.error('Error fetching installers:', error);
      setMessage({ type: 'error', text: 'Failed to load installers' });
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id: string) => {
    setActionLoading(id);
    try {
      const res = await fetch(`/api/admin/installers/${id}/approve`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'approve' }),
      });

      if (!res.ok) throw new Error('Failed to approve');

      setMessage({ type: 'success', text: 'Installer approved!' });
      setInstallers(installers.filter(i => i.id !== id));
    } catch (error) {
      console.error('Error approving installer:', error);
      setMessage({ type: 'error', text: 'Failed to approve installer' });
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async (id: string) => {
    if (!confirm('Are you sure you want to reject this installer?')) return;

    setActionLoading(id);
    try {
      const res = await fetch(`/api/admin/installers/${id}/approve`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'reject' }),
      });

      if (!res.ok) throw new Error('Failed to reject');

      setMessage({ type: 'success', text: 'Installer rejected' });
      setInstallers(installers.filter(i => i.id !== id));
    } catch (error) {
      console.error('Error rejecting installer:', error);
      setMessage({ type: 'error', text: 'Failed to reject installer' });
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Installer Applications</h1>

      {message && (
        <div className={`mb-6 p-4 rounded-lg ${message.type === 'success' ? 'bg-green-50 border border-green-200 text-green-800' : 'bg-red-50 border border-red-200 text-red-800'}`}>
          {message.text}
        </div>
      )}

      {loading ? (
        <div className="text-center py-12">
          <p className="text-gray-600">Loading installers...</p>
        </div>
      ) : installers.length === 0 ? (
        <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
          <p className="text-gray-600 text-lg">No pending applications</p>
          <p className="text-gray-500 mt-2">All applicants have been reviewed.</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Business Name</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Email</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Phone</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Service Areas</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Applied</th>
                <th className="px-6 py-3 text-right text-sm font-semibold text-gray-900">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {installers.map((installer) => (
                <tr key={installer.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">{installer.business_name}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{installer.email}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{installer.phone}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {installer.service_suburbs?.join(', ') || 'Not specified'}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {new Date(installer.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex gap-2 justify-end">
                      <button
                        onClick={() => handleApprove(installer.id)}
                        disabled={actionLoading === installer.id}
                        className="px-4 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition disabled:bg-gray-400"
                      >
                        {actionLoading === installer.id ? 'Processing...' : 'Approve'}
                      </button>
                      <button
                        onClick={() => handleReject(installer.id)}
                        disabled={actionLoading === installer.id}
                        className="px-4 py-2 border border-red-300 text-red-600 text-sm rounded-lg hover:bg-red-50 transition disabled:opacity-50"
                      >
                        {actionLoading === installer.id ? 'Processing...' : 'Reject'}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
