'use client';

import { useState } from 'react';

interface Props {
  profile: any;
  onClose: () => void;
  onSave: () => void;
}

export default function BasicInfoModal({ profile, onClose, onSave }: Props) {
  const [businessName, setBusinessName] = useState(profile.business_name || '');
  const [phone, setPhone] = useState(profile.phone || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/installer/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          business_name: businessName,
          phone,
          years_in_business: profile.years_in_business,
          bio: profile.bio,
          images: profile.images,
          profile_active: profile.profile_active,
        }),
      });

      if (!res.ok) {
        throw new Error('Failed to save');
      }

      onSave();
    } catch (err) {
      setError('Failed to save. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Business Name & Phone</h3>

        {error && (
          <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded-lg text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-1">Business Name</label>
            <input
              type="text"
              value={businessName}
              onChange={(e) => setBusinessName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 placeholder-gray-600"
              placeholder="e.g., Smith Heat Pump Services"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-1">Contact Phone</label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 placeholder-gray-600"
              placeholder="+64 9 234 5678"
              required
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 bg-gray-200 text-gray-900 rounded-lg hover:bg-gray-300 transition font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !businessName.trim() || !phone.trim()}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium disabled:opacity-50"
            >
              {loading ? 'Saving...' : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
