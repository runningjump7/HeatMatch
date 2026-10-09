'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface ProfileData {
  installer_id: string;
  business_name: string;
  login_email: string;
  public_email: string;
  phone: string;
  website: string;
  description: string;
  cover_image_url: string;
  logo_url: string;
  services: {
    installation: boolean;
    maintenance: boolean;
    repairs: boolean;
  };
  slug: string;
  verified_at: string;
  status: string;
}

export default function ProfilePage() {
  const router = useRouter();
  const [data, setData] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);

  // Form state
  const [publicEmail, setPublicEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [website, setWebsite] = useState('');
  const [description, setDescription] = useState('');
  const [services, setServices] = useState({
    installation: true,
    maintenance: false,
    repairs: false,
  });

  // Password modal state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [passwordLoading, setPasswordLoading] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch('/api/installer/profile');

        if (!res.ok) {
          if (res.status === 401) {
            router.push('/installer-login');
            return;
          }
          setError('Failed to load profile');
          return;
        }

        const profileData = await res.json();
        setData(profileData);
        setPublicEmail(profileData.public_email || '');
        setPhone(profileData.phone || '');
        setWebsite(profileData.website || '');
        setDescription(profileData.description || '');
        setServices(profileData.services);
      } catch (err) {
        console.error('Profile error:', err);
        setError('An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [router]);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSaveSuccess(false);

    try {
      const res = await fetch('/api/installer/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          public_email: publicEmail || null,
          phone: phone || null,
          website: website || null,
          description: description || null,
          services,
        }),
      });

      const result = await res.json();

      if (!res.ok) {
        setError(result.error || 'Failed to save profile');
        return;
      }

      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      console.error('Save error:', err);
      setError('An error occurred');
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError('');
    setPasswordLoading(true);

    try {
      const res = await fetch('/api/installer/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          current_password: currentPassword,
          new_password: newPassword,
        }),
      });

      const result = await res.json();

      if (!res.ok) {
        setPasswordError(result.error || 'Failed to change password');
        return;
      }

      setShowPasswordModal(false);
      setCurrentPassword('');
      setNewPassword('');
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      console.error('Password error:', err);
      setPasswordError('An error occurred');
    } finally {
      setPasswordLoading(false);
    }
  };

  if (loading) {
    return (
      <main className="flex flex-col min-h-screen bg-white">
        <div className="max-w-4xl mx-auto px-4 py-8 w-full">
          <div className="text-gray-600">Loading profile...</div>
        </div>
      </main>
    );
  }

  if (error || !data) {
    return (
      <main className="flex flex-col min-h-screen bg-white">
        <div className="max-w-4xl mx-auto px-4 py-8 w-full">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <h2 className="text-lg font-semibold text-red-900 mb-2">Error</h2>
            <p className="text-red-700 mb-4">{error}</p>
            <Link
              href="/installer-dashboard"
              className="inline-block px-4 py-2 bg-emerald-600 text-white rounded hover:bg-emerald-700"
            >
              Back to Dashboard
            </Link>
          </div>
        </div>
      </main>
    );
  }

  const descriptionLength = description.length;
  const publicProfileUrl = `https://heatmatch.co.nz/en/installers/${data.slug}`;

  return (
    <main className="flex flex-col min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-4 py-8 w-full">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <Link href="/installer-dashboard" className="text-emerald-600 hover:text-emerald-700 text-sm mb-2 block">
              ← Back to Dashboard
            </Link>
            <h1 className="text-3xl font-bold text-gray-900">Profile Settings</h1>
          </div>
          <button
            type="submit"
            form="profile-form"
            disabled={saving}
            className="px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:opacity-50 font-medium"
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>

        {/* Success message */}
        {saveSuccess && (
          <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 px-4 py-3 rounded-lg mb-6">
            ✓ Changes saved successfully!
          </div>
        )}

        {/* Main form */}
        <form id="profile-form" onSubmit={handleSaveProfile} className="space-y-6">
          {/* Account Settings */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Account Settings</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Login Email</label>
                <input
                  type="email"
                  value={data.login_email}
                  disabled
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-600 cursor-not-allowed"
                />
                <p className="text-xs text-gray-500 mt-1">Used for account login. Contact support to change.</p>
              </div>

              <div>
                <button
                  type="button"
                  onClick={() => setShowPasswordModal(true)}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 font-medium"
                >
                  Change Password
                </button>
              </div>
            </div>
          </div>

          {/* Listing Info */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Listing Information</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Public Contact Email</label>
                <input
                  type="email"
                  value={publicEmail}
                  onChange={(e) => setPublicEmail(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-gray-900"
                  placeholder="contact@business.co.nz"
                />
                <p className="text-xs text-gray-500 mt-1">Shown to customers on your public profile</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-gray-900"
                  placeholder="09 555 0004"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Website</label>
                <input
                  type="url"
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-gray-900"
                  placeholder="example.co.nz"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description ({descriptionLength}/500)
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value.slice(0, 500))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-gray-900 resize-none"
                  rows={4}
                  placeholder="Tell customers about your business..."
                />
              </div>
            </div>
          </div>

          {/* Services */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Services Offered</h2>
            <div className="space-y-3">
              {[
                { key: 'installation', label: 'Installation' },
                { key: 'maintenance', label: 'Maintenance' },
                { key: 'repairs', label: 'Repairs' },
              ].map((service) => (
                <label key={service.key} className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={services[service.key as keyof typeof services]}
                    onChange={(e) =>
                      setServices({
                        ...services,
                        [service.key]: e.target.checked,
                      })
                    }
                    className="w-4 h-4 rounded border-gray-300 text-emerald-600 cursor-pointer"
                  />
                  <span className="ml-3 text-gray-700">{service.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Status (Read-only) */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Verification Status</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Business Name</label>
                <div className="px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg text-gray-900 flex items-center gap-2">
                  {data.business_name}
                  <span className="text-xs bg-gray-200 px-2 py-1 rounded text-gray-600">Locked</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Public Profile URL</label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={publicProfileUrl}
                    disabled
                    className="flex-1 px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg text-gray-600 cursor-not-allowed text-sm"
                  />
                  <button
                    type="button"
                    onClick={() => navigator.clipboard.writeText(publicProfileUrl)}
                    className="px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 text-sm"
                  >
                    Copy
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                <div className="px-4 py-2 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-700 flex items-center gap-2">
                  ✓ Verified on {new Date(data.verified_at).toLocaleDateString('en-NZ')}
                </div>
              </div>
            </div>
          </div>
        </form>

        {/* Change Password Modal */}
        {showPasswordModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-md w-full p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Change Password</h3>

              <form onSubmit={handleChangePassword} className="space-y-4">
                {passwordError && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded text-sm">
                    {passwordError}
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
                  <input
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-gray-900"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-gray-900"
                    placeholder="8+ chars, 1 uppercase, 1 number"
                    required
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="submit"
                    disabled={passwordLoading}
                    className="flex-1 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:opacity-50 font-medium"
                  >
                    {passwordLoading ? 'Changing...' : 'Change Password'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowPasswordModal(false);
                      setCurrentPassword('');
                      setNewPassword('');
                      setPasswordError('');
                    }}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
