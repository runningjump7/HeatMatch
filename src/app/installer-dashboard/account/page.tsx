'use client';

import { useState, useEffect } from 'react';

export default function InstallerAccountPage() {
  const [account, setAccount] = useState({
    email: '',
    phone: '',
    business_name: '',
  });
  const [password, setPassword] = useState({
    current: '',
    new: '',
    confirm: '',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchAccount();
  }, []);

  const fetchAccount = async () => {
    try {
      const res = await fetch('/api/installer/account');
      const data = await res.json();
      setAccount({
        email: data.account.email || '',
        phone: data.account.phone || '',
        business_name: data.account.business_name || '',
      });
    } catch (err) {
      setError('Failed to load account');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setError('');
    setSuccess('');

    if (password.new && password.new !== password.confirm) {
      setError('New passwords do not match');
      setSaving(false);
      return;
    }

    try {
      const res = await fetch('/api/installer/account', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone: account.phone,
          username: account.business_name,
          currentPassword: password.current || undefined,
          newPassword: password.new || undefined,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Save failed');
      }

      setSuccess('Account updated successfully!');
      setPassword({ current: '', new: '', confirm: '' });
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save account');
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="text-center py-12"><p>Loading account...</p></div>;
  }

  return (
    <div className="space-y-8 max-w-2xl">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Account Settings</h1>
        <p className="text-gray-600 mt-2">Manage your account details and security</p>
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

      {/* Basic Account Info */}
      <div className="bg-white rounded-lg shadow p-8 space-y-6">
        <div>
          <h2 className="text-lg font-bold text-gray-900 mb-6">Account Information</h2>

          {/* Email */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-900 mb-2">Email</label>
            <input
              type="email"
              value={account.email}
              disabled
              className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-600 cursor-not-allowed"
            />
            <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
          </div>

          {/* Username / Business Name */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-900 mb-2">Username</label>
            <input
              type="text"
              value={account.business_name}
              onChange={(e) => setAccount({ ...account, business_name: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-600"
              placeholder="Your username"
            />
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">Contact Phone</label>
            <input
              type="tel"
              value={account.phone}
              onChange={(e) => setAccount({ ...account, phone: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-600"
              placeholder="+64 9 234 5678"
            />
          </div>
        </div>
      </div>

      {/* Password Section */}
      <div className="bg-white rounded-lg shadow p-8 space-y-6">
        <div>
          <h2 className="text-lg font-bold text-gray-900 mb-6">Change Password</h2>

          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-900 mb-2">Current Password</label>
            <input
              type="password"
              value={password.current}
              onChange={(e) => setPassword({ ...password, current: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-600"
              placeholder="••••••••"
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-900 mb-2">New Password</label>
            <input
              type="password"
              value={password.new}
              onChange={(e) => setPassword({ ...password, new: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-600"
              placeholder="••••••••"
            />
            <p className="text-xs text-gray-500 mt-1">Min 8 characters, 1 uppercase, 1 number</p>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">Confirm New Password</label>
            <input
              type="password"
              value={password.confirm}
              onChange={(e) => setPassword({ ...password, confirm: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-600"
              placeholder="••••••••"
            />
          </div>
        </div>
      </div>

      {/* Stubs */}
      <div className="bg-white rounded-lg shadow p-8">
        <div>
          <h2 className="text-lg font-bold text-gray-900 mb-6">Additional Settings</h2>
          <div className="space-y-4">
            <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
              <p className="font-semibold text-gray-900">🔐 Two-Factor Authentication</p>
              <p className="text-sm text-gray-600 mt-1">Coming soon</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
              <p className="font-semibold text-gray-900">🔔 Notification Preferences</p>
              <p className="text-sm text-gray-600 mt-1">Coming soon</p>
            </div>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <button
        onClick={handleSave}
        disabled={saving}
        className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-bold disabled:opacity-50"
      >
        {saving ? 'Saving...' : 'Save Changes'}
      </button>
    </div>
  );
}
