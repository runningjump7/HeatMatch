'use client';

import { useState } from 'react';
import SuccessModal from './SuccessModal';
import ErrorModal from './ErrorModal';
import ConfirmModal from './ConfirmModal';

export interface ClaimDetails {
  id: string;
  installer_id: string;
  installer_name: string;
  slug: string;
  business_phone: string;
  business_email: string;
  claimed_by_email: string;
  claimed_by_name: string;
  status: string;
  submitted_at: string;
  reviewed_at: string | null;
  admin_notes: string | null;
}

interface AdminClaimDetailsModalProps {
  claimId: string | null;
  isOpen: boolean;
  onClose: () => void;
  onApprove?: () => void;
  onReject?: () => void;
  claim?: ClaimDetails | null;
  isLoading?: boolean;
}

export default function AdminClaimDetailsModal({
  claimId,
  isOpen,
  onClose,
  onApprove,
  onReject,
  claim,
  isLoading = false,
}: AdminClaimDetailsModalProps) {
  const [action, setAction] = useState<'view' | 'approve' | 'reject'>('view');
  const [adminNotes, setAdminNotes] = useState('');
  const [rejectReason, setRejectReason] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);

  if (!isOpen || !claim) return null;

  const handleApproveClick = async () => {
    setSubmitting(true);
    try {
      const res = await fetch(`/api/admin/installer-claims/${claim.id}/approve`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ admin_notes: adminNotes }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorMessage(data.error || 'Failed to approve claim');
        setShowError(true);
        return;
      }

      setSuccessMessage(
        `Claim approved!\n\nTemp Password: ${data.temp_password}\n\nShare this with the user or it will be sent via email.`
      );
      setShowSuccess(true);
      setAction('view');

      // Call parent callback
      if (onApprove) {
        setTimeout(() => onApprove(), 1500);
      }
    } catch (err) {
      setErrorMessage('Network error. Please try again.');
      setShowError(true);
    } finally {
      setSubmitting(false);
    }
  };

  const handleRejectClick = async () => {
    setSubmitting(true);
    try {
      const res = await fetch(`/api/admin/installer-claims/${claim.id}/reject`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason: rejectReason }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorMessage(data.error || 'Failed to reject claim');
        setShowError(true);
        return;
      }

      setSuccessMessage('Claim rejected. User will be notified.');
      setShowSuccess(true);
      setAction('view');

      // Call parent callback
      if (onReject) {
        setTimeout(() => onReject(), 1500);
      }
    } catch (err) {
      setErrorMessage('Network error. Please try again.');
      setShowError(true);
    } finally {
      setSubmitting(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-NZ', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg max-w-2xl w-full p-6 max-h-96 overflow-y-auto">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Claim Details</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-2xl leading-none"
            >
              ×
            </button>
          </div>

          {isLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin text-2xl mb-2">⚙️</div>
              <p className="text-gray-600">Loading claim details...</p>
            </div>
          ) : (
            <>
              {/* View State */}
              {action === 'view' && (
                <div className="space-y-6">
                  {/* Installer Info */}
                  <div className="border-b border-gray-200 pb-4">
                    <h3 className="font-bold text-gray-900 mb-3">Installer</h3>
                    <div className="space-y-2 text-sm">
                      <p>
                        <span className="text-gray-600">Business:</span>{' '}
                        <span className="font-medium text-gray-900">{claim.installer_name}</span>
                      </p>
                      <p>
                        <span className="text-gray-600">Email:</span>{' '}
                        <span className="font-medium text-gray-900">{claim.business_email}</span>
                      </p>
                      <p>
                        <span className="text-gray-600">Phone:</span>{' '}
                        <span className="font-medium text-gray-900">{claim.business_phone}</span>
                      </p>
                    </div>
                  </div>

                  {/* Claim Info */}
                  <div className="border-b border-gray-200 pb-4">
                    <h3 className="font-bold text-gray-900 mb-3">Claim Details</h3>
                    <div className="space-y-2 text-sm">
                      <p>
                        <span className="text-gray-600">Claimed By:</span>{' '}
                        <span className="font-medium text-gray-900">{claim.claimed_by_name}</span>
                      </p>
                      <p>
                        <span className="text-gray-600">Email:</span>{' '}
                        <span className="font-medium text-gray-900">{claim.claimed_by_email}</span>
                      </p>
                      <p>
                        <span className="text-gray-600">Submitted:</span>{' '}
                        <span className="font-medium text-gray-900">{formatDate(claim.submitted_at)}</span>
                      </p>
                      <p>
                        <span className="text-gray-600">Status:</span>{' '}
                        <span
                          className={`font-medium px-2 py-1 rounded text-xs ${
                            claim.status === 'pending'
                              ? 'bg-yellow-100 text-yellow-800'
                              : claim.status === 'approved'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {claim.status.toUpperCase()}
                        </span>
                      </p>
                    </div>
                  </div>

                  {/* Admin Actions */}
                  {claim.status === 'pending' && (
                    <div className="flex gap-3">
                      <button
                        onClick={() => setAction('approve')}
                        className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg font-semibold transition"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => setAction('reject')}
                        className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg font-semibold transition"
                      >
                        Reject
                      </button>
                    </div>
                  )}

                  <button
                    onClick={onClose}
                    className="w-full bg-gray-200 hover:bg-gray-300 text-gray-900 py-2 rounded-lg font-semibold transition"
                  >
                    Close
                  </button>
                </div>
              )}

              {/* Approve State */}
              {action === 'approve' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Admin Notes (Optional)
                    </label>
                    <textarea
                      value={adminNotes}
                      onChange={(e) => setAdminNotes(e.target.value)}
                      placeholder="e.g., Verified business registration"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900 placeholder-gray-600"
                      rows={3}
                    />
                  </div>

                  <p className="text-sm text-gray-600 bg-blue-50 p-3 rounded">
                    ℹ️ A temporary password will be generated and can be shared with the user.
                  </p>

                  <div className="flex gap-3">
                    <button
                      onClick={handleApproveClick}
                      disabled={submitting}
                      className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white py-2 rounded-lg font-semibold transition"
                    >
                      {submitting ? 'Approving...' : 'Confirm Approval'}
                    </button>
                    <button
                      onClick={() => setAction('view')}
                      className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-900 py-2 rounded-lg font-semibold transition"
                    >
                      Back
                    </button>
                  </div>
                </div>
              )}

              {/* Reject State */}
              {action === 'reject' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Rejection Reason (Optional)
                    </label>
                    <textarea
                      value={rejectReason}
                      onChange={(e) => setRejectReason(e.target.value)}
                      placeholder="e.g., Business number doesn't match records"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent text-gray-900 placeholder-gray-600"
                      rows={3}
                    />
                  </div>

                  <p className="text-sm text-gray-600 bg-yellow-50 p-3 rounded">
                    ⚠️ User will be notified of the rejection. No account will be created.
                  </p>

                  <div className="flex gap-3">
                    <button
                      onClick={handleRejectClick}
                      disabled={submitting}
                      className="flex-1 bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white py-2 rounded-lg font-semibold transition"
                    >
                      {submitting ? 'Rejecting...' : 'Confirm Rejection'}
                    </button>
                    <button
                      onClick={() => setAction('view')}
                      className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-900 py-2 rounded-lg font-semibold transition"
                    >
                      Back
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Success Modal */}
      {showSuccess && (
        <SuccessModal
          title="Success"
          message={successMessage}
          onClose={() => {
            setShowSuccess(false);
            onClose();
          }}
        />
      )}

      {/* Error Modal */}
      {showError && (
        <ErrorModal
          title="Error"
          message={errorMessage}
          onClose={() => setShowError(false)}
        />
      )}
    </>
  );
}
