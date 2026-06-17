'use client';

import { Suspense } from 'react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

type SearchInstaller = {
  id: string;
  business_name: string;
  suburb_primary: string | null;
  service_suburbs: string[] | null;
  photo_url: string | null;
  bio: string | null;
  years_in_business: number | null;
  images: string[] | null;
};

function SearchPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialSuburb = searchParams.get('suburb') || '';

  const [suburb, setSuburb] = useState(initialSuburb);
  const [installers, setInstallers] = useState<SearchInstaller[]>([]);
  const [suburbs, setSuburbs] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    setSuburb(initialSuburb);
  }, [initialSuburb]);

  useEffect(() => {
    const loadInstallers = async () => {
      setLoading(true);
      setError('');

      try {
        const query = initialSuburb ? `?suburb=${encodeURIComponent(initialSuburb)}` : '';
        const res = await fetch(`/api/search${query}`);
        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || 'Failed to search installers');
        }

        setInstallers(data.installers || []);
        setSuburbs(data.suburbs || []);
      } catch (err) {
        console.error(err);
        setError('Failed to load installers');
      } finally {
        setLoading(false);
      }
    };

    void loadInstallers();
  }, [initialSuburb]);

  const handleSearch = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmedSuburb = suburb.trim();
    const nextPath = trimmedSuburb
      ? `/search?suburb=${encodeURIComponent(trimmedSuburb)}`
      : '/search';

    router.push(nextPath);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <div className="mb-10">
        <Link href="/" className="text-sm font-semibold text-blue-600 hover:text-blue-700">
          ← Back to home
        </Link>
        <h1 className="text-4xl font-bold text-gray-900 mt-4">Find Heat Pump Installers</h1>
        <p className="text-lg text-gray-600 mt-3 max-w-2xl">
          Search North Shore installers by suburb, compare experience, and request a quote directly.
        </p>
      </div>

      <section className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm mb-10">
        <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Looking for installers in
            </label>
            <input
              list="north-shore-suburbs"
              value={suburb}
              onChange={(event) => setSuburb(event.target.value)}
              placeholder="Takapuna, Milford, Glenfield..."
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-600"
            />
            <datalist id="north-shore-suburbs">
              {suburbs.map((item) => (
                <option key={item} value={item} />
              ))}
            </datalist>
          </div>

          <button
            type="submit"
            className="md:self-end px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition"
          >
            Search
          </button>
        </form>

        {suburbs.length > 0 && (
          <div className="mt-5 flex flex-wrap gap-2">
            {suburbs.slice(0, 9).map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => {
                  setSuburb(item);
                  router.push(`/search?suburb=${encodeURIComponent(item)}`);
                }}
                className="px-3 py-1.5 rounded-full bg-blue-50 text-blue-700 text-sm font-medium hover:bg-blue-100 transition"
              >
                {item}
              </button>
            ))}
          </div>
        )}
      </section>

      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl">
          {error}
        </div>
      )}

      <div className="flex items-center justify-between mb-6 gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            {initialSuburb ? `Results for ${initialSuburb}` : 'Available installers'}
          </h2>
          <p className="text-gray-600 mt-1">
            {loading ? 'Loading...' : `${installers.length} installer${installers.length === 1 ? '' : 's'} found`}
          </p>
        </div>
      </div>

      {loading ? (
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
          {[0, 1, 2].map((item) => (
            <div key={item} className="h-72 rounded-2xl border border-gray-200 bg-white animate-pulse" />
          ))}
        </div>
      ) : installers.length === 0 ? (
        <div className="bg-white border border-dashed border-gray-300 rounded-2xl p-12 text-center">
          <h3 className="text-xl font-semibold text-gray-900">No active installers found</h3>
          <p className="text-gray-600 mt-3">
            Try another suburb or clear the search to see all active North Shore businesses.
          </p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
          {installers.map((installer) => {
            const heroImage = installer.photo_url || installer.images?.[0] || null;

            return (
              <article key={installer.id} className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition">
                <div className="h-48 bg-slate-100">
                  {heroImage ? (
                    <img src={heroImage} alt={installer.business_name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-4xl font-bold text-slate-400">
                      {installer.business_name.charAt(0)}
                    </div>
                  )}
                </div>

                <div className="p-6">
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <h3 className="text-xl font-bold text-gray-900">{installer.business_name}</h3>
                    <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold">
                      Verified
                    </span>
                  </div>

                  <p className="text-sm text-gray-600 mb-2">
                    {installer.years_in_business
                      ? `${installer.years_in_business}+ years in business`
                      : 'Experienced local installer'}
                  </p>
                  <p className="text-sm text-gray-600 mb-4">
                    Primary suburb: {installer.suburb_primary || 'North Shore'}
                  </p>
                  <p className="text-gray-700 text-sm leading-6 mb-5 line-clamp-4">
                    {installer.bio || 'Heat pump installation and servicing across the North Shore.'}
                  </p>

                  <div className="flex flex-wrap gap-2 mb-5">
                    {(installer.service_suburbs || []).slice(0, 4).map((item) => (
                      <span key={item} className="px-3 py-1 rounded-full bg-gray-100 text-gray-700 text-xs font-medium">
                        {item}
                      </span>
                    ))}
                  </div>

                  <div className="flex gap-3">
                    <Link
                      href={`/search/installer/${installer.id}`}
                      className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-xl font-semibold text-center hover:bg-blue-700 transition"
                    >
                      View Profile
                    </Link>
                    <Link
                      href={`/search/installer/${installer.id}/quote`}
                      className="px-4 py-3 border border-blue-200 text-blue-700 rounded-xl font-semibold hover:bg-blue-50 transition"
                    >
                      Quote
                    </Link>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default function SearchPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-blue-50">
      <Suspense fallback={<div className="max-w-6xl mx-auto px-4 py-12 text-gray-600">Loading search...</div>}>
        <SearchPageContent />
      </Suspense>
    </main>
  );
}