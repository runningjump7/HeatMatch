'use client';

import { useState } from 'react';

type CreateBusinessForm = {
  business_name: string;
  email: string;
  password: string;
  phone: string;
  business_number: string;
  suburb_primary: string;
  service_suburbs: string;
  photo_url: string;
  bio: string;
  years_in_business: string;
  images: string;
  profile_active: boolean;
};

const initialForm: CreateBusinessForm = {
  business_name: '',
  email: '',
  password: '',
  phone: '',
  business_number: '',
  suburb_primary: '',
  service_suburbs: '',
  photo_url: '',
  bio: '',
  years_in_business: '',
  images: '',
  profile_active: true,
};

export default function CreateBusinessPage() {
  const [form, setForm] = useState<CreateBusinessForm>(initialForm);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const updateField = <K extends keyof CreateBusinessForm>(field: K, value: CreateBusinessForm[K]) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitting(true);
    setMessage(null);

    try {
      const res = await fetch('/api/admin/create-business', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          years_in_business: form.years_in_business ? parseInt(form.years_in_business, 10) : null,
          service_suburbs: form.service_suburbs
            .split(',')
            .map((value) => value.trim())
            .filter(Boolean),
          images: form.images
            .split('\n')
            .map((value) => value.trim())
            .filter(Boolean),
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to create business');
      }

      setMessage({ type: 'success', text: 'Business created and approved successfully.' });
      setForm(initialForm);
    } catch (error) {
      console.error(error);
      setMessage({
        type: 'error',
        text: error instanceof Error ? error.message : 'Failed to create business',
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Create Business</h1>
        <p className="text-gray-600 mt-2">
          Add an installer manually, auto-approve the business, and generate login credentials in one step.
        </p>
      </div>

      {message && (
        <div className={`px-4 py-3 rounded-xl border ${message.type === 'success'
          ? 'bg-green-50 border-green-200 text-green-800'
          : 'bg-red-50 border-red-200 text-red-700'}`}>
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white border border-gray-200 rounded-2xl p-8 grid md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-2">Business name</label>
          <input
            value={form.business_name}
            onChange={(event) => updateField('business_name', event.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 placeholder-gray-600"
            placeholder="North Shore Heat Co"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-2">Login email</label>
          <input
            type="email"
            value={form.email}
            onChange={(event) => updateField('email', event.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 placeholder-gray-600"
            placeholder="owner@business.co.nz"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-2">Temporary password</label>
          <input
            type="text"
            value={form.password}
            onChange={(event) => updateField('password', event.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 placeholder-gray-600"
            placeholder="Testing123"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-2">Phone</label>
          <input
            value={form.phone}
            onChange={(event) => updateField('phone', event.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 placeholder-gray-600"
            placeholder="09 123 4567"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-2">ABN / business number</label>
          <input
            value={form.business_number}
            onChange={(event) => updateField('business_number', event.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 placeholder-gray-600"
            placeholder="9429041234567"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-2">Primary suburb</label>
          <input
            value={form.suburb_primary}
            onChange={(event) => updateField('suburb_primary', event.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 placeholder-gray-600"
            placeholder="Takapuna"
          />
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-semibold text-gray-900 mb-2">Service suburbs</label>
          <input
            value={form.service_suburbs}
            onChange={(event) => updateField('service_suburbs', event.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 placeholder-gray-600"
            placeholder="Takapuna, Milford, Devonport"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-2">Years in business</label>
          <input
            type="number"
            value={form.years_in_business}
            onChange={(event) => updateField('years_in_business', event.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 placeholder-gray-600"
            placeholder="12"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-2">Photo URL</label>
          <input
            value={form.photo_url}
            onChange={(event) => updateField('photo_url', event.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 placeholder-gray-600"
            placeholder="https://..."
          />
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-semibold text-gray-900 mb-2">Business bio</label>
          <textarea
            value={form.bio}
            onChange={(event) => updateField('bio', event.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-600 h-32"
            placeholder="What does this business specialise in?"
          />
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-semibold text-gray-900 mb-2">Gallery image URLs</label>
          <textarea
            value={form.images}
            onChange={(event) => updateField('images', event.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-600 h-28"
            placeholder={'One image URL per line'}
          />
        </div>
        <div className="md:col-span-2 flex items-center justify-between rounded-2xl bg-slate-50 border border-slate-200 p-4">
          <div>
            <p className="font-semibold text-gray-900">Make profile live immediately</p>
            <p className="text-sm text-gray-600 mt-1">If enabled, the business appears in public search as soon as it is created.</p>
          </div>
          <button
            type="button"
            onClick={() => updateField('profile_active', !form.profile_active)}
            className={`px-5 py-2 rounded-full font-semibold transition ${form.profile_active ? 'bg-green-600 text-white hover:bg-green-700' : 'bg-gray-300 text-gray-800 hover:bg-gray-400'}`}
          >
            {form.profile_active ? 'Active' : 'Inactive'}
          </button>
        </div>
        <div className="md:col-span-2">
          <button
            type="submit"
            disabled={submitting}
            className="w-full px-6 py-4 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition disabled:opacity-50"
          >
            {submitting ? 'Creating business...' : 'Create approved business'}
          </button>
        </div>
      </form>
    </div>
  );
}