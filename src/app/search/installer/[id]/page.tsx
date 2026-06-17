'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';

type InstallerProfile = {
  id: string;
  business_name: string;
  email: string;
  phone: string | null;
  suburb_primary: string | null;
  service_suburbs: string[] | null;
  photo_url: string | null;
  bio: string | null;
  years_in_business: number | null;
  images: string[] | null;
};

export default function PublicInstallerProfilePage() {
  const params = useParams<{ id: string }>();
  const installerId = Array.isArray(params.id) ? params.id[0] : params.id;

  const [installer, setInstaller] = useState<InstallerProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

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
      } catch (err) {
        console.error(err);
        setError('Failed to load installer profile');
      } finally {
        setLoading(false);
      }
    };

    void loadInstaller();
  }, [installerId]);

  if (loading) {
    return <div className="min-h-screen bg-slate-50 flex items-center justify-center text-gray-600">Loading profile...</div>;
  }

  if (error || !installer) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
        <div className="bg-white border border-red-200 rounded-2xl p-8 max-w-lg text-center">
          <p className="text-red-700 font-semibold">{error || 'Installer not found'}</p>
          <Link href="/search" className="inline-block mt-4 text-blue-600 hover:text-blue-700 font-semibold">
            Back to search
          </Link>
        </div>
      </div>
    );
  }

  const gallery = [installer.photo_url, ...(installer.images || [])].filter(Boolean) as string[];

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <Link href="/search" className="text-sm font-semibold text-blue-600 hover:text-blue-700">
          ← Back to search
        </Link>

        <div className="grid lg:grid-cols-[1.2fr_0.8fr] gap-8 mt-6">
          <section className="bg-white border border-gray-200 rounded-3xl overflow-hidden shadow-sm">
            <div className="h-72 bg-slate-100">
              {gallery[0] ? (
                <img src={gallery[0]} alt={installer.business_name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-6xl font-bold text-slate-400">
                  {installer.business_name.charAt(0)}
                </div>
              )}
            </div>

            <div className="p-8">
              <div className="flex flex-wrap items-center gap-3 mb-4">
                <h1 className="text-4xl font-bold text-gray-900">{installer.business_name}</h1>
                <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-sm font-semibold">
                  Verified
                </span>
                <span className="px-3 py-1 rounded-full bg-amber-50 text-amber-700 text-sm font-semibold">
                  Rating coming soon
                </span>
              </div>

              <p className="text-lg text-gray-600 mb-6">
                {installer.years_in_business
                  ? `${installer.years_in_business}+ years installing heat pumps across ${installer.suburb_primary || 'North Shore'}.`
                  : `Serving ${installer.suburb_primary || 'North Shore'} with residential heat pump installs.`}
              </p>

              <div className="grid sm:grid-cols-3 gap-4 mb-8">
                <div className="rounded-2xl bg-slate-50 p-4 border border-slate-200">
                  <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Primary Suburb</p>
                  <p className="text-gray-900 font-semibold mt-2">{installer.suburb_primary || 'North Shore'}</p>
                </div>
                <div className="rounded-2xl bg-slate-50 p-4 border border-slate-200">
                  <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Contact</p>
                  <p className="text-gray-900 font-semibold mt-2">{installer.phone || installer.email}</p>
                </div>
                <div className="rounded-2xl bg-slate-50 p-4 border border-slate-200">
                  <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Service Area</p>
                  <p className="text-gray-900 font-semibold mt-2">{(installer.service_suburbs || []).length} suburbs</p>
                </div>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-3">About this business</h2>
                <p className="text-gray-700 leading-7 whitespace-pre-line">
                  {installer.bio || 'Heat pump installation, replacement, and servicing for North Shore homes.'}
                </p>
              </div>

              {gallery.length > 1 && (
                <div className="mt-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Gallery</h2>
                  <div className="grid sm:grid-cols-2 gap-4">
                    {gallery.slice(1).map((image, index) => (
                      <img
                        key={`${image}-${index}`}
                        src={image}
                        alt={`${installer.business_name} gallery ${index + 1}`}
                        className="w-full h-48 object-cover rounded-2xl border border-gray-200"
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </section>

          <aside className="space-y-6">
            <div className="bg-white border border-gray-200 rounded-3xl p-6 shadow-sm">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Get in touch</h2>
              <div className="space-y-3">
                {installer.phone && (
                  <a
                    href={`tel:${installer.phone}`}
                    className="block w-full px-4 py-3 bg-blue-600 text-white text-center rounded-xl font-semibold hover:bg-blue-700 transition"
                  >
                    Call {installer.phone}
                  </a>
                )}
                <a
                  href={`mailto:${installer.email}`}
                  className="block w-full px-4 py-3 border border-gray-300 text-gray-900 text-center rounded-xl font-semibold hover:bg-gray-50 transition"
                >
                  Email business
                </a>
                <Link
                  href={`/search/installer/${installer.id}/quote`}
                  className="block w-full px-4 py-3 border border-blue-200 text-blue-700 text-center rounded-xl font-semibold hover:bg-blue-50 transition"
                >
                  Get a quote
                </Link>
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-3xl p-6 shadow-sm">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Service suburbs</h2>
              <div className="flex flex-wrap gap-2">
                {(installer.service_suburbs || []).map((item) => (
                  <span key={item} className="px-3 py-1.5 rounded-full bg-slate-100 text-slate-700 text-sm font-medium">
                    {item}
                  </span>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}