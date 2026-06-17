'use client';

import { useState } from 'react';

interface Props {
  profile: any;
  onClose: () => void;
  onSave: () => void;
}

export default function ExperienceModal({ profile, onClose, onSave }: Props) {
  const [yearsInBusiness, setYearsInBusiness] = useState(profile.years_in_business || '');
  const [bio, setBio] = useState(profile.bio || '');
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
          business_name: profile.business_name,
          phone: profile.phone,
          years_in_business: yearsInBusiness ? parseInt(yearsInBusiness) : null,
          bio,
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
        <h3 className="text-lg font-bold text-gray-900 mb-4">Experience & Bio</h3>

        {error && (
          <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded-lg text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-1">Years in Business</label>
            <input
              type="number"
              value={yearsInBusiness}
              onChange={(e) => setYearsInBusiness(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 placeholder-gray-600"
              placeholder="e.g., 5"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-1">Bio / Description</label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 placeholder-gray-600"
              placeholder="Tell customers about your business, experience, and expertise..."
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
              disabled={loading || !yearsInBusiness || !bio.trim()}
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
