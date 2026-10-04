'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import PageLayout from '@/components/PageLayout';
import ClaimBusinessModal from '@/components/ClaimBusinessModal';

interface DetailResponse {
  success: boolean;
  data?: {
    id: string;
    slug: string;
    businessName: string;
    bio: string | null;
    photoUrl: string | null;
    email: string;
    phone: string;
    website: string | null;
    businessNumber: string | null;
    suburb: string;
    serviceSuburbs: string[];
    yearsInBusiness: number | null;
    status: string;
    verifiedAt: string | null;
    language: string;
    fallbackLangs: string[];
  };
  error?: string;
}

export default function InstallerProfile({ params }: { params: Promise<{ slug: string }> }) {
  const [slug, setSlug] = useState<string>('');
  const [installer, setInstaller] = useState<DetailResponse['data'] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [claimModalOpen, setClaimModalOpen] = useState(false);

  useEffect(() => {
    params.then((p) => setSlug(p.slug));
  }, [params]);

  useEffect(() => {
    if (!slug) return;

    const fetchInstaller = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/installers/${slug}?lang=en`);
        const data: DetailResponse = await response.json();

        if (!data.success || !data.data) {
          setError(data.error || 'Installer not found');
          return;
        }

        setInstaller(data.data);
      } catch (err) {
        setError('Failed to load installer profile');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchInstaller();
  }, [slug]);

  if (loading) {
    return (
      <main className="min-h-screen bg-white">
        <nav className="sticky top-0 z-50 bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
            <Link href="/">
              <img src="/icons/heatmatch-logo.svg" alt="HeatMatch" className="h-10" />
            </Link>
            <Link href="/installers" className="text-gray-600 hover:text-gray-900 font-medium text-sm">
              ← Back to Directory
            </Link>
          </div>
        </nav>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="text-6xl mb-4 animate-spin">⚙️</div>
            <p className="text-gray-600 font-medium">Loading installer profile...</p>
          </div>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen bg-white">
        <nav className="sticky top-0 z-50 bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
            <Link href="/">
              <img src="/icons/heatmatch-logo.svg" alt="HeatMatch" className="h-10" />
            </Link>
            <Link href="/installers" className="text-gray-600 hover:text-gray-900 font-medium text-sm">
              ← Back to Directory
            </Link>
          </div>
        </nav>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="text-6xl mb-4">❌</div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Profile Not Found</h1>
            <p className="text-gray-600 mb-6">{error}</p>
            <Link
              href="/installers"
              className="inline-block bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-lg font-medium transition"
            >
              Back to Directory
            </Link>
          </div>
        </div>
      </main>
    );
  }

  if (!installer) {
    return (
      <main className="min-h-screen bg-white">
        <nav className="sticky top-0 z-50 bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
            <Link href="/">
              <img src="/icons/heatmatch-logo.svg" alt="HeatMatch" className="h-10" />
            </Link>
            <Link href="/installers" className="text-gray-600 hover:text-gray-900 font-medium text-sm">
              ← Back to Directory
            </Link>
          </div>
        </nav>
      </main>
    );
  }

  return (
    <PageLayout>
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
          <Link href="/">
            <img src="/icons/heatmatch-logo.svg" alt="HeatMatch" className="h-10" />
          </Link>
          <Link href="/installers" className="text-gray-600 hover:text-gray-900 font-medium text-sm">
            ← Back to Directory
          </Link>
        </div>
      </nav>

      {/* Hero Section with Photo */}
      <section className="relative h-96 bg-gray-100 overflow-hidden">
        {installer.photoUrl ? (
          <img
            src={installer.photoUrl}
            alt={installer.businessName}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-emerald-50 to-blue-50">
            <div className="text-center">
              <div className="text-8xl text-emerald-200 mb-4">🔧</div>
              <p className="text-gray-400 text-lg">No photo available</p>
            </div>
          </div>
        )}

        {/* Overlay with Info */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end">
          <div className="w-full p-8 text-white">
            <div className="max-w-6xl mx-auto">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-4xl md:text-5xl font-bold mb-2">{installer.businessName}</h1>
                  <p className="text-xl text-gray-200 flex items-center gap-2">
                    📍 {installer.suburb}
                  </p>
                </div>
                <span
                  className={`px-4 py-2 rounded-full font-semibold text-sm ${
                    installer.status === 'verified'
                      ? 'bg-emerald-500 text-white'
                      : 'bg-gray-500 text-white'
                  }`}
                >
                  {installer.status === 'verified' ? '✓ Verified' : 'Unclaimed'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Main Column */}
            <div className="lg:col-span-2">
              {/* About Section */}
              {installer.bio && (
                <div className="bg-white rounded-lg p-8 border border-gray-200 mb-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">About</h2>
                  <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{installer.bio}</p>
                </div>
              )}

              {/* Service Areas */}
              {installer.serviceSuburbs.length > 0 && (
                <div className="bg-white rounded-lg p-8 border border-gray-200 mb-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Service Areas</h2>
                  <div className="flex flex-wrap gap-2">
                    {installer.serviceSuburbs.map((suburb) => (
                      <span
                        key={suburb}
                        className="px-4 py-2 bg-emerald-50 text-emerald-700 rounded-full text-sm font-medium border border-emerald-200"
                      >
                        {suburb}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Experience */}
              {installer.yearsInBusiness && (
                <div className="bg-white rounded-lg p-8 border border-gray-200">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Experience</h2>
                  <p className="text-lg text-gray-700">
                    <span className="font-bold text-emerald-600">{installer.yearsInBusiness}</span> years
                    in business
                  </p>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              {/* Contact Card */}
              <div className="bg-emerald-50 rounded-lg p-8 border border-emerald-200 sticky top-20">
                <h3 className="text-xl font-bold text-gray-900 mb-6">Get in Touch</h3>

                {/* Phone */}
                <div className="mb-6">
                  <p className="text-sm text-gray-600 mb-2">Phone</p>
                  <a
                    href={`tel:${installer.phone}`}
                    className="text-lg font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-2 transition"
                  >
                    <span>📞</span> {installer.phone}
                  </a>
                </div>

                {/* Email */}
                <div className="mb-6">
                  <p className="text-sm text-gray-600 mb-2">Email</p>
                  <a
                    href={`mailto:${installer.email}`}
                    className="text-emerald-600 hover:text-emerald-700 font-medium transition word-break: break-all"
                  >
                    {installer.email}
                  </a>
                </div>

                {/* Website */}
                {installer.website && (
                  <div className="mb-6">
                    <p className="text-sm text-gray-600 mb-2">Website</p>
                    <a
                      href={installer.website.startsWith('http') ? installer.website : `https://${installer.website}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-emerald-600 hover:text-emerald-700 font-medium transition flex items-center gap-2"
                    >
                      <span>🌐</span>
                      {installer.website.replace(/^https?:\/\//, '')}
                    </a>
                  </div>
                )}

                {/* Business Number */}
                {installer.businessNumber && (
                  <div className="mb-6 pb-6 border-b border-emerald-200">
                    <p className="text-sm text-gray-600 mb-2">Business Registration</p>
                    <p className="font-mono text-sm text-gray-700">{installer.businessNumber}</p>
                  </div>
                )}

                {/* CTA Button */}
                <a
                  href={`tel:${installer.phone}`}
                  className="w-full block text-center bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-lg font-semibold transition mb-3"
                >
                  Call Now
                </a>

                <a
                  href={`mailto:${installer.email}`}
                  className="w-full block text-center border-2 border-emerald-600 text-emerald-600 hover:bg-emerald-50 px-6 py-3 rounded-lg font-semibold transition"
                >
                  Send Email
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Information Banner */}
      <section className="py-12 bg-blue-50 border-t border-blue-200">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-4 flex-1">
              <div className="text-2xl mt-1">ℹ️</div>
              <div>
                <h3 className="font-bold text-gray-900 mb-2">About This Listing</h3>
                <p className="text-gray-700 text-sm">
                  {installer.status === 'verified'
                    ? 'This installer has been verified and is eligible to receive leads through HeatMatch.'
                    : 'This installer has not yet verified their profile. They are listed for informational purposes only.'}
                </p>
              </div>
            </div>
            {installer.status !== 'verified' && (
              <button
                onClick={() => setClaimModalOpen(true)}
                className="flex-shrink-0 bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2 rounded-lg font-semibold transition whitespace-nowrap"
              >
                Claim This Business
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="py-16 md:py-24 bg-gradient-to-r from-gray-900 to-gray-800">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready for Your Heat Pump Installation?
          </h2>
          <p className="text-lg text-gray-300 mb-8">
            Contact {installer.businessName} directly or get free quotes from multiple installers.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href={`tel:${installer.phone}`}
              className="inline-block bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-4 rounded-lg font-semibold transition"
            >
              Call: {installer.phone}
            </a>
            <Link
              href="/installers"
              className="inline-block border-2 border-white text-white hover:bg-white/10 px-8 py-4 rounded-lg font-semibold transition"
            >
              Browse Other Installers
            </Link>
          </div>
        </div>
      </section>

      {/* Claim Modal */}
      <ClaimBusinessModal
        slug={slug}
        businessName={installer.businessName}
        isOpen={claimModalOpen}
        onClose={() => setClaimModalOpen(false)}
      />
    </PageLayout>
  );
}
