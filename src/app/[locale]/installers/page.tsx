'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import PageLayout from '@/components/PageLayout';
import LanguageSwitcher from '@/components/LanguageSwitcher';

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
  data?: {
    installers: Installer[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      pages: number;
    };
  };
  error?: string;
}

export default function InstallersDirectory() {
  const t = useTranslations();
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

        if (!data.success || !data.data) {
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

  const popularSuburbs = ['Takapuna', 'Albany', 'Glenfield', 'Browns Bay', 'Milford'];

  const handleSuburbClick = (suburbName: string) => {
    setSuburb(suburbName);
    setCurrentPage(1);
  };

  return (
    <PageLayout>
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center gap-2 md:gap-4">
          <Link href="/">
            <img src="/icons/heatmatch-logo.svg" alt="HeatMatch" className="h-10 flex-shrink-0" />
          </Link>
          <div className="hidden md:flex items-center gap-8">
            <a href="/#how-it-works" className="text-gray-600 hover:text-gray-900 text-sm">{t('nav.howItWorks')}</a>
            <a href="/#coverage" className="text-gray-600 hover:text-gray-900 text-sm">{t('nav.coverage')}</a>
            <a href="/#faq" className="text-gray-600 hover:text-gray-900 text-sm">{t('nav.faq')}</a>
          </div>
          <div className="flex items-center gap-2 md:gap-4 ml-auto flex-shrink-0">
            <LanguageSwitcher />
            <Link
              href="/"
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 md:px-6 py-2 rounded-lg font-medium text-sm transition whitespace-nowrap"
            >
              {t('nav.getQuote')}
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section
        className="relative pt-24 md:pt-32 pb-48 md:pb-64 bg-cover bg-center overflow-hidden"
        style={{
          backgroundImage: 'url(/images/heatmatch-background.svg)',
        }}
      >
        {/* White overlay to lighten background */}
        <div className="absolute inset-0 bg-white/40" />

        <div className="relative max-w-6xl mx-auto px-4">
          <div className="text-center">
            {/* Tagline */}
            <p className="text-sm md:text-base font-semibold text-gray-600 tracking-widest mb-6">
              {t('installers.tagline')}
            </p>

            {/* Main Heading */}
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-4 leading-tight">
              {t('installers.heading')}
            </h1>

            {/* Subtitle */}
            <p className="text-lg md:text-xl text-gray-600 mb-12">
              {t('installers.subheading')}
            </p>

            {/* Search Form */}
            <form onSubmit={handleSearch} className="max-w-2xl mx-auto mb-10">
              <div className="flex flex-col md:flex-row gap-3">
                <div className="flex-1 relative">
                  <img src="/icons/location-pin.svg" alt="Location" className="absolute left-4 top-4 w-6 h-6 text-gray-500" style={{color: '#9CA3AF'}} />
                  <input
                    type="text"
                    placeholder={t('installers.searchPlaceholder')}
                    value={suburb}
                    onChange={(e) => setSuburb(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 border-0 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-gray-900 placeholder-gray-500 bg-white"
                  />
                </div>
                <button
                  type="submit"
                  className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-4 rounded-lg font-semibold transition flex items-center justify-center gap-2 whitespace-nowrap md:px-8 w-full md:w-auto"
                >
                  <img src="/icons/search.svg" alt="Search" className="w-5 h-5" />
                  {t('installers.searchButton')}
                </button>
              </div>
            </form>

            {/* Popular Suburbs */}
            <div className="flex flex-wrap justify-center gap-3">
              <span className="text-gray-700 text-sm font-medium self-center">{t('installers.popularSuburbs')}</span>
              {popularSuburbs.map((suburbName) => (
                <button
                  key={suburbName}
                  onClick={() => handleSuburbClick(suburbName)}
                  className="px-4 py-2 bg-white text-gray-700 rounded-lg text-sm font-medium border border-gray-300 hover:bg-gray-50 transition"
                >
                  {suburbName}
                </button>
              ))}
            </div>
          </div>

          {/* Results info */}
          {installers.length > 0 && (
            <p className="text-center text-gray-700 mt-12">
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

      {/* Installers Stack */}
      {!loading && installers.length > 0 && (
        <section className="py-16">
          <div className="max-w-4xl mx-auto px-4 space-y-4">
            {installers.map((installer) => (
              <div
                key={installer.id}
                className="group bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg hover:border-emerald-200 transition duration-300"
              >
                <div className="flex flex-col md:flex-row gap-6 p-6">
                  {/* Left: Image */}
                  <div className="md:w-48 flex-shrink-0">
                    {installer.photoUrl ? (
                      <div className="w-full h-40 bg-gray-100 rounded-lg overflow-hidden">
                        <img
                          src={installer.photoUrl}
                          alt={installer.businessName}
                          className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                        />
                      </div>
                    ) : (
                      <div className="w-full h-40 bg-gradient-to-br from-emerald-50 to-blue-50 rounded-lg flex items-center justify-center">
                        <div className="text-center">
                          <div className="text-3xl text-emerald-200 mb-2">🔧</div>
                          <p className="text-gray-400 text-xs">No photo</p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Middle: Content */}
                  <div className="flex-1 flex flex-col justify-between">
                    {/* Top Section: Name, Badge, Location */}
                    <div>
                      <div className="flex items-start gap-3 mb-2">
                        <Link href={`/installers/${installer.slug}`} className="flex-1">
                          <h3 className="text-xl font-bold text-gray-900 hover:text-emerald-600 hover:underline transition cursor-pointer">
                            {installer.businessName}
                          </h3>
                        </Link>
                        <span
                          className={`inline-block px-3 py-1 text-xs font-semibold rounded-full flex-shrink-0 whitespace-nowrap ${
                            installer.status === 'verified'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}
                        >
                          {installer.status === 'verified' ? '✓ Verified' : 'Unclaimed'}
                        </span>
                      </div>

                      <p className="text-sm text-gray-600 mb-3">📍 {installer.suburb}</p>

                      {/* Bio */}
                      {installer.bio && (
                        <p className="text-sm text-gray-600 line-clamp-2 mb-4">
                          {installer.bio}
                        </p>
                      )}
                    </div>

                    {/* Meta Info - Services */}
                    <div className="flex flex-wrap gap-3 pt-4 border-t border-gray-100">
                      <span className="text-xs text-gray-600 px-3 py-1 bg-gray-50 rounded-full">
                        ✓ Installation
                      </span>
                      <span className="text-xs text-gray-600 px-3 py-1 bg-gray-50 rounded-full">
                        ✓ Servicing
                      </span>
                      <span className="text-xs text-gray-600 px-3 py-1 bg-gray-50 rounded-full">
                        ✓ Repairs
                      </span>
                    </div>
                  </div>

                  {/* Right: Actions */}
                  <div className="md:w-40 flex flex-col gap-3 justify-center">
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        // Contact button - not hooked up yet
                      }}
                      className="w-full bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-3 rounded-lg font-semibold transition text-sm whitespace-nowrap"
                    >
                      Contact
                    </button>
                    <Link
                      href={`/installers/${installer.slug}`}
                      className="w-full text-center border border-emerald-600 text-emerald-600 hover:bg-emerald-50 px-4 py-3 rounded-lg font-semibold transition text-sm whitespace-nowrap"
                    >
                      View Profile
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Empty State */}
      {!loading && installers.length === 0 && !error && (
        <section className="py-16">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <div className="text-6xl mb-4">🔍</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">{t('installers.noInstallersFound')}</h2>
            <p className="text-gray-600 mb-8">
              {suburb
                ? t('installers.tryDifferent')
                : t('installers.startSearching')}
            </p>
            {suburb && (
              <button
                onClick={() => {
                  setSuburb('');
                  setCurrentPage(1);
                }}
                className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-lg font-medium transition"
              >
                {t('installers.clearSearch')}
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
            {t('installers.readyForInstallation')}
          </h2>
          <p className="text-lg text-gray-300 mb-8">
            {t('installers.contactInstaller')}
          </p>
          <Link
            href="/"
            className="inline-block bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-4 rounded-lg font-semibold transition"
          >
            {t('installers.getQuoteButton')}
          </Link>
        </div>
      </section>
    </PageLayout>
  );
}
