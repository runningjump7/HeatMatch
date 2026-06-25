'use client';

import { useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import SuccessModal from '@/components/SuccessModal';
import ErrorModal from '@/components/ErrorModal';
import ConfirmModal from '@/components/ConfirmModal';

interface Installer {
  id: string;
  business_name: string;
  phone: string;
  email: string;
  suburb_primary: string;
  service_suburbs: string[];
  approved: boolean;
  bio: string;
  created_at: string;
}

export default function AdminInstallersPage() {
  const [installers, setInstallers] = useState<Installer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [successModal, setSuccessModal] = useState<{ show: boolean; message: string; action?: string } | null>(null);
  const [errorModal, setErrorModal] = useState<{ show: boolean; title: string; message: string } | null>(null);
  const [confirmModal, setConfirmModal] = useState<{ show: boolean; message: string; onConfirm: () => void } | null>(null);

  const [form, setForm] = useState({
    name: '',
    phone: '',
    email: '',
    primary_suburb: '',
    service_suburbs: [] as string[],
    approved: false,
    bio: '',
  });

  const suburbs = [
    'Albany', 'Takapuna', 'Milford', 'Browns Bay',
    'Glenfield', 'Birkenhead', 'Devonport', 'Mairangi Bay',
    'Northcote', 'Long Bay'
  ];

  useEffect(() => {
    fetchInstallers();
  }, []);

  const fetchInstallers = async () => {
    try {
      const res = await fetch('/api/admin/installers');
      const data = await res.json();
      setInstallers(data.installers || []);
    } catch (error) {
      console.error('Error fetching installers:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenModal = (installer?: Installer) => {
    if (installer) {
      setEditingId(installer.id);
      setForm({
        name: installer.business_name,
        phone: installer.phone,
        email: installer.email,
        primary_suburb: installer.suburb_primary,
        service_suburbs: installer.service_suburbs,
        approved: installer.approved,
        bio: installer.bio,
      });
    } else {
      setEditingId(null);
      setForm({
        name: '',
        phone: '',
        email: '',
        primary_suburb: '',
        service_suburbs: [],
        approved: false,
        bio: '',
      });
    }
    setShowModal(true);
  };

  const handleSuburbToggle = (suburb: string) => {
    setForm((prev) => ({
      ...prev,
      service_suburbs: prev.service_suburbs.includes(suburb)
        ? prev.service_suburbs.filter((s) => s !== suburb)
        : [...prev.service_suburbs, suburb],
    }));
  };

  const handleSave = async () => {
    if (!form.name || !form.phone || !form.email || !form.primary_suburb) {
      setErrorModal({
        show: true,
        title: 'Missing Information',
        message: 'Please fill in all required fields',
      });
      return;
    }

    setIsSaving(true);
    try {
      if (editingId) {
        // Update
        const res = await fetch(`/api/admin/installers/${editingId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(form),
        });

        if (res.ok) {
          setSuccessModal({
            show: true,
            message: 'Installer updated successfully',
            action: 'updated',
          });
          fetchInstallers();
          setShowModal(false);
        }
      } else {
        // Create
        const res = await fetch('/api/admin/installers', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(form),
        });

        if (res.ok) {
          setSuccessModal({
            show: true,
            message: 'Installer created successfully',
            action: 'created',
          });
          fetchInstallers();
          setShowModal(false);
        }
      }
    } catch (error) {
      console.error('Error saving installer:', error);
      setErrorModal({
        show: true,
        title: 'Save Failed',
        message: 'There was an error saving the installer. Please try again.',
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = (id: string) => {
    setConfirmModal({
      show: true,
      message: 'Are you sure you want to delete this installer? This action cannot be undone.',
      onConfirm: async () => {
        try {
          await fetch(`/api/admin/installers/${id}`, { method: 'DELETE' });
          setSuccessModal({
            show: true,
            message: 'Installer deleted successfully',
            action: 'deleted',
          });
          fetchInstallers();
          setConfirmModal(null);
        } catch (error) {
          console.error('Error deleting installer:', error);
          setErrorModal({
            show: true,
            title: 'Delete Failed',
            message: 'There was an error deleting the installer. Please try again.',
          });
        }
      },
    });
  };

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Installers</h1>
          <p className="text-gray-600 mt-2">Manage your partner installers</p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-semibold transition"
        >
          ➕ Add Installer
        </button>
      </div>

      {/* Installers Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {isLoading ? (
          <div className="p-8 text-center text-gray-600">Loading installers...</div>
        ) : installers.length === 0 ? (
          <div className="p-8 text-center text-gray-600">No installers yet. Add one to get started.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Contact</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Primary Suburb</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Service Areas</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Active</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {installers.map((installer) => (
                  <tr key={installer.id} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{installer.business_name}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      <div className="text-xs">{installer.phone}</div>
                      <div className="text-xs">{installer.email}</div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">{installer.suburb_primary}</td>
                    <td className="px-6 py-4 text-sm">
                      <div className="flex flex-wrap gap-1">
                        {installer.service_suburbs?.slice(0, 3).map((suburb) => (
                          <span key={suburb} className="px-2 py-1 bg-gray-200 text-gray-800 text-xs rounded">
                            {suburb}
                          </span>
                        ))}
                        {(installer.service_suburbs?.length || 0) > 3 && (
                          <span className="px-2 py-1 bg-gray-200 text-gray-800 text-xs rounded">
                            +{(installer.service_suburbs?.length || 0) - 3}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${installer.approved ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-100 text-gray-800'}`}>
                        {installer.approved ? 'Approved' : 'Pending'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm space-x-2">
                      <button
                        onClick={() => handleOpenModal(installer)}
                        className="text-emerald-600 hover:text-emerald-700 font-medium"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(installer.id)}
                        className="text-red-600 hover:text-red-700 font-medium"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Success Modal */}
      {successModal?.show && (
        <SuccessModal
          title={successModal.action === 'created' ? 'Installer Added' : successModal.action === 'updated' ? 'Installer Updated' : 'Success'}
          subtitle={successModal.message}
          onClose={() => setSuccessModal(null)}
        />
      )}

      {/* Error Modal */}
      {errorModal?.show && (
        <ErrorModal
          title={errorModal.title}
          message={errorModal.message}
          onClose={() => setErrorModal(null)}
        />
      )}

      {/* Confirm Modal */}
      {confirmModal?.show && (
        <ConfirmModal
          title="Delete Installer"
          message={confirmModal.message}
          confirmText="Delete"
          cancelText="Cancel"
          isDestructive={true}
          onConfirm={confirmModal.onConfirm}
          onCancel={() => setConfirmModal(null)}
        />
      )}

      {/* Form Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full p-8 max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              {editingId ? 'Edit Installer' : 'Add New Installer'}
            </h2>

            <div className="space-y-4">
              {/* Name */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">Name *</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900"
                  placeholder="Installer name"
                />
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">Phone *</label>
                <input
                  type="tel"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900"
                  placeholder="Phone number"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">Email *</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900"
                  placeholder="Email address"
                />
              </div>

              {/* Primary Suburb */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">Primary Suburb *</label>
                <select
                  value={form.primary_suburb}
                  onChange={(e) => setForm({ ...form, primary_suburb: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900"
                >
                  <option value="">— Select —</option>
                  {suburbs.map((suburb) => (
                    <option key={suburb} value={suburb}>
                      {suburb}
                    </option>
                  ))}
                </select>
              </div>

              {/* Service Suburbs */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">Service Areas</label>
                <div className="grid grid-cols-2 gap-2">
                  {suburbs.map((suburb) => (
                    <label key={suburb} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={form.service_suburbs.includes(suburb)}
                        onChange={() => handleSuburbToggle(suburb)}
                        className="w-4 h-4 rounded border-gray-300"
                      />
                      <span className="text-sm text-gray-900">{suburb}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Approved */}
              <div>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.approved}
                    onChange={(e) => setForm({ ...form, approved: e.target.checked })}
                    className="w-4 h-4 rounded border-gray-300"
                  />
                  <span className="text-sm font-semibold text-gray-900">Active</span>
                </label>
              </div>

              {/* Bio */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">Notes</label>
                <textarea
                  value={form.bio}
                  onChange={(e) => setForm({ ...form, bio: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900 h-20 resize-none"
                  placeholder="Any notes about this installer..."
                />
              </div>
            </div>

            {/* Buttons */}
            <div className="flex gap-3 mt-8">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-900 rounded-lg font-semibold transition"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="flex-1 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-400 text-white rounded-lg font-semibold transition"
              >
                {isSaving ? 'Saving...' : 'Save'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
