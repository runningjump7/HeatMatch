'use client';

import { useState, useEffect } from 'react';

type ProfileState = {
  business_name: string;
  years_in_business: number | '';
  bio: string;
  images: string[];
  profile_active: boolean;
};

export default function InstallerProfilePage() {
  const [profile, setProfile] = useState<ProfileState>({
    business_name: '',
    years_in_business: '',
    bio: '',
    images: [],
    profile_active: false,
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [imageInput, setImageInput] = useState('');

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await fetch('/api/installer/profile');
      const data = await res.json();
      setProfile({
        business_name: data.profile.business_name || '',
        years_in_business: data.profile.years_in_business || '',
        bio: data.profile.bio || '',
        images: Array.isArray(data.profile.images) ? data.profile.images : [],
        profile_active: data.profile.profile_active || false,
      });
    } catch (err) {
      setError('Failed to load profile');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setError('');
    setSuccess('');

    try {
      const res = await fetch('/api/installer/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profile),
      });

      if (!res.ok) {
        throw new Error('Save failed');
      }

      setSuccess('Profile saved successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Failed to save profile');
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const addImage = () => {
    if (imageInput.trim()) {
      setProfile({ ...profile, images: [...profile.images, imageInput] });
      setImageInput('');
    }
  };

  const removeImage = (index: number) => {
    setProfile({ ...profile, images: profile.images.filter((_, i) => i !== index) });
  };

  if (loading) {
    return <div className="text-center py-12"><p>Loading profile...</p></div>;
  }

  return (
    <div className="space-y-8 max-w-2xl">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Business Listing</h1>
        <p className="text-gray-600 mt-2">Manage your public profile and business information</p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-lg">
          {error}
        </div>
      )}

      {success && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-6 py-4 rounded-lg">
          {success}
        </div>
      )}

      <div className="bg-white rounded-lg shadow p-8 space-y-6">
        {/* Business Name */}
        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-2">Business Name</label>
          <input
            type="text"
            value={profile.business_name}
            onChange={(e) => setProfile({ ...profile, business_name: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 placeholder-gray-600"
            placeholder="Your business name"
          />
        </div>

        {/* Years in Business */}
        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-2">Years in Business</label>
          <input
            type="number"
            value={profile.years_in_business}
            onChange={(e) => setProfile({ ...profile, years_in_business: parseInt(e.target.value) || '' })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 placeholder-gray-600"
            placeholder="e.g., 5"
          />
        </div>

        {/* Bio */}
        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-2">Bio / Description</label>
          <textarea
            value={profile.bio}
            onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
            rows={4}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 placeholder-gray-600"
            placeholder="Tell customers about your business..."
          />
        </div>

        {/* Images */}
        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-2">Before/After Images</label>
          <div className="flex gap-2 mb-4">
            <input
              type="text"
              value={imageInput}
              onChange={(e) => setImageInput(e.target.value)}
              placeholder="Paste image URL"
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm text-gray-900 placeholder-gray-600"
            />
            <button
              onClick={addImage}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
            >
              Add
            </button>
          </div>
          {profile.images.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {profile.images.map((img, idx) => (
                <div key={idx} className="relative group">
                  <img src={img} alt={`image-${idx}`} className="w-full h-24 object-cover rounded-lg" />
                  <button
                    onClick={() => removeImage(idx)}
                    className="absolute top-1 right-1 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Profile Status */}
        <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg border border-blue-200">
          <div>
            <p className="font-semibold text-gray-900">Profile Status</p>
            <p className="text-sm text-gray-600">
              {profile.profile_active ? 'Your profile is live and visible to customers' : 'Your profile is hidden'}
            </p>
          </div>
          <button
            onClick={() => setProfile({ ...profile, profile_active: !profile.profile_active })}
            className={`px-6 py-2 rounded-lg font-medium transition ${
              profile.profile_active
                ? 'bg-green-600 text-white hover:bg-green-700'
                : 'bg-gray-400 text-white hover:bg-gray-500'
            }`}
          >
            {profile.profile_active ? '🟢 Active' : '🔴 Inactive'}
          </button>
        </div>

        {/* Save Button */}
        <button
          onClick={handleSave}
          disabled={saving}
          className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-bold disabled:opacity-50"
        >
          {saving ? 'Saving...' : 'Save Profile'}
        </button>
      </div>
    </div>
  );
}
