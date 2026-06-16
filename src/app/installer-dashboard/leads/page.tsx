'use client';

import { useState, useEffect } from 'react';

interface Lead {
  id: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  suburb: string;
  description: string;
  status: string;
  rejection_reason?: string;
  completed_notes?: string;
  created_at: string;
}

export default function InstallerLeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all');
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [actionModal, setActionModal] = useState<{ lead: Lead; action: 'accept' | 'reject' | 'complete' } | null>(null);
  const [reason, setReason] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchLeads();
  }, [filter]);

  const fetchLeads = async () => {
    setLoading(true);
    setError('');
    try {
      const query = filter === 'all' ? '' : `?status=${filter}`;
      const res = await fetch(`/api/installer/leads${query}`);
      const data = await res.json();
      setLeads(data.leads || []);
    } catch (err) {
      setError('Failed to load leads');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async () => {
    if (!actionModal) return;
    setSubmitting(true);

    try {
      const endpoint = `/api/installer/leads/${actionModal.lead.id}/${actionModal.action}`;
      const body =
        actionModal.action === 'reject'
          ? JSON.stringify({ reason })
          : actionModal.action === 'complete'
            ? JSON.stringify({ notes: reason })
            : {};

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body,
      });

      if (!res.ok) {
        throw new Error('Action failed');
      }

      setActionModal(null);
      setReason('');
      fetchLeads();
    } catch (err) {
      alert('Failed to perform action. Please try again.');
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const statusBadge = (status: string) => {
    const colors: Record<string, string> = {
      new: 'bg-blue-100 text-blue-800',
      accepted: 'bg-green-100 text-green-800',
      completed: 'bg-gray-100 text-gray-800',
      rejected: 'bg-red-100 text-red-800',
      unconfirmed: 'bg-yellow-100 text-yellow-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const filteredLeads = leads.filter(lead =>
    filter === 'all' ? true : lead.status === filter
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Leads</h1>
        <p className="text-gray-600 mt-2">Manage your customer inquiries</p>
      </div>

      {/* Filter Tabs */}
      <div className="bg-white rounded-lg shadow p-4 border-b border-gray-200 flex space-x-2 overflow-x-auto">
        {['all', 'new', 'accepted', 'completed', 'rejected'].map(tab => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={`px-4 py-2 rounded-lg font-medium transition whitespace-nowrap ${
              filter === tab
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* Leads List */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-lg">
          {error}
        </div>
      )}

      {loading ? (
        <div className="text-center py-12">
          <p className="text-gray-600">Loading leads...</p>
        </div>
      ) : filteredLeads.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-12 text-center">
          <p className="text-gray-600">No leads found</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredLeads.map(lead => (
            <div
              key={lead.id}
              className="bg-white rounded-lg shadow p-6 hover:shadow-md transition cursor-pointer"
              onClick={() => setSelectedLead(selectedLead?.id === lead.id ? null : lead)}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-lg font-bold text-gray-900">{lead.customer_name}</h3>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusBadge(lead.status)}`}>
                      {lead.status.charAt(0).toUpperCase() + lead.status.slice(1)}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">{lead.description}</p>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600">
                    <div>
                      <p className="font-semibold text-gray-900">Phone</p>
                      <p>{lead.customer_phone}</p>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">Email</p>
                      <p>{lead.customer_email}</p>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">Suburb</p>
                      <p>{lead.suburb}</p>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">Date</p>
                      <p>{new Date(lead.created_at).toLocaleDateString()}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Expanded Details */}
              {selectedLead?.id === lead.id && (
                <div className="mt-6 pt-6 border-t border-gray-200 space-y-4">
                  {lead.rejection_reason && (
                    <div className="bg-red-50 p-4 rounded">
                      <p className="text-sm font-semibold text-red-900">Rejection Reason</p>
                      <p className="text-sm text-red-800 mt-1">{lead.rejection_reason}</p>
                    </div>
                  )}

                  {lead.completed_notes && (
                    <div className="bg-green-50 p-4 rounded">
                      <p className="text-sm font-semibold text-green-900">Completion Notes</p>
                      <p className="text-sm text-green-800 mt-1">{lead.completed_notes}</p>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex flex-wrap gap-3 pt-4">
                    {lead.status === 'new' && (
                      <>
                        <button
                          onClick={() => setActionModal({ lead, action: 'accept' })}
                          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-medium text-sm"
                        >
                          Accept Lead
                        </button>
                        <button
                          onClick={() => setActionModal({ lead, action: 'reject' })}
                          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-medium text-sm"
                        >
                          Reject
                        </button>
                      </>
                    )}

                    {lead.status === 'accepted' && (
                      <button
                        onClick={() => setActionModal({ lead, action: 'complete' })}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium text-sm"
                      >
                        Mark Complete
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Action Modal */}
      {actionModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">
              {actionModal.action === 'reject' ? 'Reject Lead' : actionModal.action === 'complete' ? 'Mark Complete' : 'Confirm'}
            </h2>

            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder={
                actionModal.action === 'reject'
                  ? 'Why are you rejecting this lead?'
                  : 'Add completion notes...'
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4 h-24"
            />

            <div className="flex gap-3">
              <button
                onClick={() => { setActionModal(null); setReason(''); }}
                className="flex-1 px-4 py-2 bg-gray-200 text-gray-900 rounded-lg hover:bg-gray-300 transition font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleAction}
                disabled={!reason.trim() || submitting}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium disabled:opacity-50"
              >
                {submitting ? 'Submitting...' : 'Confirm'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
