'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';

type InstallerSummary = {
  id: string;
  business_name: string;
  suburb_primary: string | null;
};

type QuoteFormState = {
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  suburb: string;
  address: string;
  description: string;
  urgency: string;
  budget: string;
  property_type: string;
  system_type: string;
  contact_preference: string;
};

const initialForm: QuoteFormState = {
  customer_name: '',
  customer_email: '',
  customer_phone: '',
  suburb: '',
  address: '',
  description: '',
  urgency: 'Within 2 weeks',
  budget: '',
  property_type: 'Residential',
  system_type: 'Wall-mounted heat pump',
  contact_preference: 'email',
};

export default function QuotePage() {
  const params = useParams<{ id: string }>();
  const installerId = Array.isArray(params.id) ? params.id[0] : params.id;

  const [installer, setInstaller] = useState<InstallerSummary | null>(null);
  const [form, setForm] = useState<QuoteFormState>(initialForm);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const loadInstaller = async () => {
      if (!installerId) return;

      setLoading(true);
      setError('');

      try {
        const res = await fetch(`/api/search/installer/${installerId}`);
        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || 'Failed to load installer');
        }

        setInstaller(data.installer);
        setForm((current) => ({
          ...current,
          suburb: data.installer.suburb_primary || current.suburb,
        }));
      } catch (err) {
        console.error(err);
        setError('Failed to load installer');
      } finally {
        setLoading(false);
      }
    };

    void loadInstaller();
  }, [installerId]);

  const updateField = <K extends keyof QuoteFormState>(field: K, value: QuoteFormState[K]) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          installer_id: installerId,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to submit quote request');
      }

      setSuccess(true);
      setForm(initialForm);
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : 'Failed to submit quote request');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="min-h-screen bg-slate-50 flex items-center justify-center text-gray-600">Loading quote form...</div>;
  }

  if (!installer) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
        <div className="bg-white border border-red-200 rounded-2xl p-8 text-center max-w-md">
          <p className="text-red-700 font-semibold">{error || 'Installer not found'}</p>
          <Link href="/search" className="inline-block mt-4 text-blue-600 hover:text-blue-700 font-semibold">
            Back to search
          </Link>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="max-w-5xl mx-auto px-4 py-12">
        <Link href={`/search/installer/${installer.id}`} className="text-sm font-semibold text-blue-600 hover:text-blue-700">
          ← Back to profile
        </Link>

        <div className="grid lg:grid-cols-[1.15fr_0.85fr] gap-8 mt-6">
          <section className="bg-white border border-gray-200 rounded-3xl p-8 shadow-sm">
            <h1 className="text-4xl font-bold text-gray-900">Request a quote</h1>
            <p className="text-gray-600 mt-3 max-w-2xl">
              Send your project details directly to {installer.business_name}. New quote requests appear in the installer dashboard immediately.
            </p>

            {success && (
              <div className="mt-6 bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-xl">
                Quote request sent successfully. {installer.business_name} can now review it in their dashboard.
              </div>
            )}

            {error && (
              <div className="mt-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="mt-8 grid md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">Your name</label>
                <input
                  value={form.customer_name}
                  onChange={(event) => updateField('customer_name', event.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-600"
                  placeholder="Jane Smith"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">Email</label>
                <input
                  type="email"
                  value={form.customer_email}
                  onChange={(event) => updateField('customer_email', event.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-600"
                  placeholder="jane@example.com"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">Phone</label>
                <input
                  value={form.customer_phone}
                  onChange={(event) => updateField('customer_phone', event.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-600"
                  placeholder="021 123 4567"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">Suburb</label>
                <input
                  value={form.suburb}
                  onChange={(event) => updateField('suburb', event.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-600"
                  placeholder="Takapuna"
                  required
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-900 mb-2">Installation address</label>
                <input
                  value={form.address}
                  onChange={(event) => updateField('address', event.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-600"
                  placeholder="Street address or property details"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">Urgency</label>
                <select
                  value={form.urgency}
                  onChange={(event) => updateField('urgency', event.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option>ASAP</option>
                  <option>Within 2 weeks</option>
                  <option>This month</option>
                  <option>Just comparing options</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">Budget</label>
                <input
                  value={form.budget}
                  onChange={(event) => updateField('budget', event.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-600"
                  placeholder="$3,000 - $5,000"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">Property type</label>
                <select
                  value={form.property_type}
                  onChange={(event) => updateField('property_type', event.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option>Residential</option>
                  <option>Apartment</option>
                  <option>Rental property</option>
                  <option>Commercial</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">System type</label>
                <select
                  value={form.system_type}
                  onChange={(event) => updateField('system_type', event.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option>Wall-mounted heat pump</option>
                  <option>Ducted system</option>
                  <option>Multi-room system</option>
                  <option>Not sure yet</option>
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-900 mb-2">Project description</label>
                <textarea
                  value={form.description}
                  onChange={(event) => updateField('description', event.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-600 h-36"
                  placeholder="Tell the installer what you need, the rooms involved, and any constraints."
                  required
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-900 mb-2">Preferred contact method</label>
                <div className="flex flex-wrap gap-3">
                  {['email', 'phone'].map((option) => (
                    <button
                      key={option}
                      type="button"
                      onClick={() => updateField('contact_preference', option)}
                      className={`px-4 py-2 rounded-full border font-medium transition ${
                        form.contact_preference === option
                          ? 'border-blue-600 bg-blue-50 text-blue-700'
                          : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      {option === 'email' ? 'Email me' : 'Call me'}
                    </button>
                  ))}
                </div>
              </div>
              <div className="md:col-span-2">
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full px-6 py-4 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition disabled:opacity-50"
                >
                  {submitting ? 'Sending quote request...' : `Send to ${installer.business_name}`}
                </button>
              </div>
            </form>
          </section>

          <aside className="bg-slate-900 text-white rounded-3xl p-8 shadow-sm h-fit">
            <p className="text-sm uppercase tracking-[0.2em] text-sky-200">Direct lead</p>
            <h2 className="text-3xl font-bold mt-3">{installer.business_name}</h2>
            <p className="text-slate-300 mt-4 leading-7">
              This request creates a new lead tied to the installer immediately, so they can accept, reject, or complete it from their dashboard.
            </p>

            <div className="mt-8 space-y-4 text-sm text-slate-200">
              <div className="rounded-2xl bg-white/10 p-4 border border-white/10">
                <p className="font-semibold text-white">Primary area</p>
                <p className="mt-1">{installer.suburb_primary || 'North Shore Auckland'}</p>
              </div>
              <div className="rounded-2xl bg-white/10 p-4 border border-white/10">
                <p className="font-semibold text-white">What to include</p>
                <p className="mt-1">Property details, desired system, timing, and any install access constraints.</p>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}