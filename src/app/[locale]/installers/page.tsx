'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Footer from '@/components/Footer';

interface Installer {
  id: string;
  slug: string;
  businessName: string;
  bio: string | null;
  photoUrl: string | null;
  suburb: string;
  serviceSuburbs: string[];
  phone: string;
  email: string;
  yearsInBusiness: number | null;
  status: string;
}

interface ListResponse {
  success: boolean;
  data: {
    installers: Installer[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      pages: number;
    };
  };
}

export default function InstallersDirectory() {
  const [installers, setInstallers] = useState<Installer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [suburb, setSuburb] = useState<string>('');

  const limit = 12;

  useEffect(() => {
    const fetchInstallers = async () => {
      try {
        setLoading(true);
        const params = new URLSearchParams({
          page: currentPage.toString(),
          limit: limit.toString(),
          lang: 'en',
        });

        if (suburb) {
          params.append('suburb', suburb);
        }

        const response = await fetch(`/api/installers?${params}`);
        const data: ListResponse = await response.json();

        if (!data.success) {
          setError(data.error || 'Failed to load installers');
          return;
        }

        setInstallers(data.data.installers);
        setTotalPages(data.data.pagination.pages);
      } catch (err) {
        setError('Failed to load installers');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchInstallers();
  }, [currentPage, suburb]);

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setCurrentPage(1);
  };

  return (
    <main className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
          <Link href="/">
            <img src="/icons/heatmatch-logo.svg" alt="HeatMatch" className="h-10" />
          </Link>
          <Link
            href="/"
            className="text-gray-600 hover:text-gray-900 font-medium text-sm transition"
          >
            ← Back to Home
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-16 md:py-24 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 leading-tight">
              Find Trusted Heat Pump Installers
            </h1>
            <p className="text-lg text-gray-600">
              Browse verified and unclaimed installers across the North Shore
            </p>
          </div>

          {/* Search Form */}
          <form onSubmit={handleSearch} className="max-w-md mx-auto mb-12">
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Search by suburb..."
                value={suburb}
                onChange={(e) => setSuburb(e.target.value)}
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
              <button
                type="submit"
                className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-lg font-medium transition"
              >
                Search
              </button>
            </div>
          </form>

          {/* Results info */}
          {installers.length > 0 && (
            <p className="text-center text-gray-600 mb-8">
              Showing {installers.length} installer{installers.length !== 1 ? 's' : ''}
            </p>
          )}
        </div>
      </section>

      {/* Error State */}
      {error && (
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <p className="text-red-700 font-medium">{error}</p>
          </div>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="max-w-6xl mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-gray-100 rounded-lg h-80 animate-pulse" />
            ))}
          </div>
        </div>
      )}

      {/* Installers Grid */}
      {!loading && installers.length > 0 && (
        <section className="py-16">
          <div className="max-w-6xl mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {installers.map((installer) => (
                <Link
                  key={installer.id}
                  href={`/installers/${installer.slug}`}
                  className="group bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg hover:border-emerald-200 transition duration-300"
                >
                  {/* Card Image */}
                  {installer.photoUrl ? (
                    <div className="w-full h-48 bg-gray-100 overflow-hidden">
                      <img
                        src={installer.photoUrl}
                        alt={installer.businessName}
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                      />
                    </div>
                  ) : (
                    <div className="w-full h-48 bg-gradient-to-br from-emerald-50 to-blue-50 flex items-center justify-center">
                      <div className="text-center">
                        <div className="text-4xl text-emerald-200 mb-2">🔧</div>
                        <p className="text-gray-400 text-sm">No photo</p>
                      </div>
                    </div>
                  )}

                  {/* Card Content */}
                  <div className="p-6">
                    {/* Status Badge */}
                    <div className="mb-3 flex items-center justify-between">
                      <span
                        className={`inline-block px-3 py-1 text-xs font-semibold rounded-full ${
                          installer.status === 'verified'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {installer.status === 'verified' ? '✓ Verified' : 'Unclaimed'}
                      </span>
                    </div>

                    {/* Business Name */}
                    <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-emerald-600 transition">
                      {installer.businessName}
                    </h3>

                    {/* Location */}
                    <p className="text-sm text-gray-600 mb-3">📍 {installer.suburb}</p>

                    {/* Bio */}
                    {installer.bio && (
                      <p className="text-sm text-gray-600 line-clamp-2 mb-4">
                        {installer.bio}
                      </p>
                    )}

                    {/* Meta Info */}
                    <div className="flex items-center justify-between text-xs text-gray-500 pt-4 border-t border-gray-100">
                      {installer.yearsInBusiness && (
                        <span>{installer.yearsInBusiness} years in business</span>
                      )}
                      {installer.serviceSuburbs.length > 0 && (
                        <span>{installer.serviceSuburbs.length} suburbs</span>
                      )}
                    </div>

                    {/* CTA */}
                    <div className="mt-4 pt-4 border-t border-gray-100">
                      <p className="text-emerald-600 font-semibold text-sm group-hover:text-emerald-700">
                        View Profile →
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Empty State */}
      {!loading && installers.length === 0 && !error && (
        <section className="py-16">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <div className="text-6xl mb-4">🔍</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">No installers found</h2>
            <p className="text-gray-600 mb-8">
              {suburb
                ? `Try searching for a different suburb or browse all installers.`
                : 'Start by searching for a suburb to find installers near you.'}
            </p>
            {suburb && (
              <button
                onClick={() => {
                  setSuburb('');
                  setCurrentPage(1);
                }}
                className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-lg font-medium transition"
              >
                Clear Search
              </button>
            )}
          </div>
        </section>
      )}

      {/* Pagination */}
      {!loading && totalPages > 1 && (
        <section className="py-12 bg-gray-50">
          <div className="max-w-6xl mx-auto px-4">
            <div className="flex justify-center items-center gap-2">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed hover:border-emerald-600 transition"
              >
                ← Previous
              </button>

              <div className="flex gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`px-4 py-2 rounded-lg font-medium transition ${
                      currentPage === page
                        ? 'bg-emerald-600 text-white'
                        : 'border border-gray-300 text-gray-700 hover:border-emerald-600'
                    }`}
                  >
                    {page}
                  </button>
                ))}
              </div>

              <button
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed hover:border-emerald-600 transition"
              >
                Next →
              </button>
            </div>
            <p className="text-center text-sm text-gray-600 mt-4">
              Page {currentPage} of {totalPages}
            </p>
          </div>
        </section>
      )}

      {/* Footer CTA */}
      <section className="py-16 md:py-24 bg-gradient-to-r from-gray-900 to-gray-800">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready for Your Heat Pump Installation?
          </h2>
          <p className="text-lg text-gray-300 mb-8">
            Contact an installer directly or get a free quote from multiple providers.
          </p>
          <Link
            href="/"
            className="inline-block bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-4 rounded-lg font-semibold transition"
          >
            Get Free Quote →
          </Link>
        </div>
      </section>

      <Footer />
    </main>
  );
}
