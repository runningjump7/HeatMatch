'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

type OnboardingForm = {
  business_name: string;
  phone: string;
  years_in_business: string;
  bio: string;
  primary_suburb: string;
  service_suburbs: string;
  images: string[];
};

export default function InstallerOnboardingPage() {
  const router = useRouter();
  const [form, setForm] = useState<OnboardingForm>({
    business_name: '',
    phone: '',
    years_in_business: '',
    bio: '',
    primary_suburb: '',
    service_suburbs: '',
    images: [],
  });
  const [imageInput, setImageInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const updateField = <K extends keyof OnboardingForm>(field: K, value: OnboardingForm[K]) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const addImage = () => {
    if (imageInput.trim()) {
      setForm({ ...form, images: [...form.images, imageInput] });
      setImageInput('');
    }
  };

  const removeImage = (index: number) => {
    setForm({ ...form, images: form.images.filter((_, i) => i !== index) });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/installer/onboarding', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          business_name: form.business_name,
          phone: form.phone,
          years_in_business: form.years_in_business ? parseInt(form.years_in_business) : null,
          bio: form.bio,
          primary_suburb: form.primary_suburb,
          service_suburbs: form.service_suburbs
            .split(',')
            .map((s) => s.trim())
            .filter(Boolean),
          images: form.images,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || 'Failed to complete onboarding');
        return;
      }

      router.push('/installer-dashboard');
    } catch (err) {
      setError('An error occurred. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Complete Your Profile</h1>
          <p className="text-gray-600 mt-2">
            Tell us about your business. You'll be able to accept leads once your profile is approved by an admin.
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-8">
          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Business Name */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">Business Name *</label>
              <input
                type="text"
                value={form.business_name}
                onChange={(e) => updateField('business_name', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 placeholder-gray-600"
                placeholder="e.g., Smith Heat Pump Services"
                required
              />
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">Contact Phone *</label>
              <input
                type="tel"
                value={form.phone}
                onChange={(e) => updateField('phone', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 placeholder-gray-600"
                placeholder="+64 9 234 5678"
                required
              />
            </div>

            {/* Years in Business */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">Years in Business *</label>
              <input
                type="number"
                value={form.years_in_business}
                onChange={(e) => updateField('years_in_business', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 placeholder-gray-600"
                placeholder="e.g., 5"
                required
              />
            </div>

            {/* Bio */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">Bio / Description</label>
              <textarea
                value={form.bio}
                onChange={(e) => updateField('bio', e.target.value)}
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 placeholder-gray-600"
                placeholder="Tell customers about your business, experience, and why they should choose you..."
              />
            </div>

            {/* Primary Suburb */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">Primary Suburb *</label>
              <input
                type="text"
                value={form.primary_suburb}
                onChange={(e) => updateField('primary_suburb', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 placeholder-gray-600"
                placeholder="e.g., Takapuna"
                required
              />
            </div>

            {/* Service Suburbs */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">Service Suburbs</label>
              <input
                type="text"
                value={form.service_suburbs}
                onChange={(e) => updateField('service_suburbs', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 placeholder-gray-600"
                placeholder="e.g., Takapuna, Devonport, Milford (comma-separated)"
              />
              <p className="text-xs text-gray-500 mt-1">List all suburbs where you provide service</p>
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
                  type="button"
                  onClick={addImage}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
                >
                  Add
                </button>
              </div>
              {form.images.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {form.images.map((img, idx) => (
                    <div key={idx} className="relative group">
                      <img src={img} alt={`image-${idx}`} className="w-full h-24 object-cover rounded-lg" />
                      <button
                        type="button"
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

            {/* Submit Button */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={loading}
                className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-bold disabled:opacity-50"
              >
                {loading ? 'Saving...' : 'Complete Profile'}
              </button>
              <p className="text-sm text-gray-600 mt-3 text-center">
                Your account will be pending approval. You can log in and edit your profile while waiting.
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
