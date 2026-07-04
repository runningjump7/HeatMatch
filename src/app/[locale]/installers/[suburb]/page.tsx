'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { useLocale } from 'next-intl';
import QuoteFormStepper from '@/components/QuoteFormStepper';
import LanguageSwitcher from '@/components/LanguageSwitcher';

interface SuburbPageProps {
  params: Promise<{ suburb: string; locale: string }>;
}

const suburbData: { [key: string]: { titleKey: string; descKey: string; population: string; avgCost: string; costDisplay: string } } = {
  albany: {
    titleKey: 'Albany',
    descKey: 'Albany',
    population: '~18,000 residents',
    avgCost: '$4,500 - $8,000',
    costDisplay: '$4,500 - $8,000',
  },
  takapuna: {
    titleKey: 'Takapuna',
    descKey: 'Takapuna',
    population: '~15,000 residents',
    avgCost: '$4,500 - $8,000',
    costDisplay: '$4,500 - $8,000',
  },
  milford: {
    titleKey: 'Milford',
    descKey: 'Milford',
    population: '~12,000 residents',
    avgCost: '$4,500 - $8,000',
    costDisplay: '$4,500 - $8,000',
  },
  'browns-bay': {
    titleKey: 'Browns Bay',
    descKey: 'Browns Bay',
    population: '~8,000 residents',
    avgCost: '$4,500 - $8,000',
    costDisplay: '$4,500 - $8,000',
  },
  glenfield: {
    titleKey: 'Glenfield',
    descKey: 'Glenfield',
    population: '~25,000 residents',
    avgCost: '$4,500 - $8,000',
    costDisplay: '$4,500 - $8,000',
  },
  birkenhead: {
    titleKey: 'Birkenhead',
    descKey: 'Birkenhead',
    population: '~20,000 residents',
    avgCost: '$4,500 - $8,000',
    costDisplay: '$4,500 - $8,000',
  },
  devonport: {
    titleKey: 'Devonport',
    descKey: 'Devonport',
    population: '~10,000 residents',
    avgCost: '$4,500 - $8,000',
    costDisplay: '$4,500 - $8,000',
  },
  'mairangi-bay': {
    titleKey: 'Mairangi Bay',
    descKey: 'Mairangi Bay',
    population: '~9,000 residents',
    avgCost: '$4,500 - $8,000',
    costDisplay: '$4,500 - $8,000',
  },
  northcote: {
    titleKey: 'Northcote',
    descKey: 'Northcote',
    population: '~14,000 residents',
    avgCost: '$4,500 - $8,000',
    costDisplay: '$4,500 - $8,000',
  },
  'long-bay': {
    titleKey: 'Long Bay',
    descKey: 'Long Bay',
    population: '~11,000 residents',
    avgCost: '$4,500 - $8,000',
    costDisplay: '$4,500 - $8,000',
  },
};

export default function SuburbPage({ params }: SuburbPageProps) {
  const t = useTranslations('suburbs');
  const navT = useTranslations('nav');
  const footerT = useTranslations('footer');
  const locale = useLocale();
  const [showStepper, setShowStepper] = useState(false);
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [suburb, setSuburb] = useState<string>('');

  useEffect(() => {
    params.then(p => setSuburb(p.suburb));
  }, [params]);

  const suburbKey = suburb.toLowerCase().replace(/\s+/g, '-');
  const data = suburbData[suburbKey] || suburbData.albany;

  // Helper function to interpolate template strings
  const interpolate = (template: string, vars: Record<string, string>) => {
    return template.replace(/{{(\w+)}}/g, (_, key) => vars[key] || '');
  };

  return (
    <main className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
          <Link href={`/${locale}`}>
            <img src="/icons/heatmatch-logo.svg" alt="HeatMatch" className="h-10" />
          </Link>
          <div className="flex items-center gap-4">
            <LanguageSwitcher />
            <button
              onClick={() => { setSelectedService(null); setShowStepper(true); }}
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2 rounded-lg font-medium text-sm transition">
              {navT('getQuote')}
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-16 md:py-24 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 leading-tight">
              {interpolate(t('pageTitle'), { suburb: data.titleKey })}
            </h1>
            <p className="text-lg text-gray-600 mb-2">
              {interpolate(t('pageDescription'), { suburb: data.descKey })}
            </p>
            <p className="text-sm text-gray-500">
              {t('nav.coverage')}: {data.population} | {t('nav.coverage')}: {data.costDisplay}
            </p>
          </div>

          {/* CTA */}
          <div className="flex justify-center gap-4 flex-wrap">
            <button
              onClick={() => { setSelectedService(null); setShowStepper(true); }}
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-3 rounded-lg font-semibold transition"
            >
              {t('freeQuoteButton')}
            </button>
            <Link
              href={`/${locale}`}
              className="border-2 border-gray-300 hover:border-emerald-600 text-gray-900 px-8 py-3 rounded-lg font-semibold transition"
            >
              {t('backButton')}
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">
            {interpolate(t('faqHeading'), { suburb: data.titleKey })}
          </h2>

          <div className="space-y-4">
            {[
              {
                q: interpolate(t('costQuestion'), { suburb: data.titleKey }),
                a: interpolate(t('costAnswer'), { suburb: data.titleKey, cost: data.costDisplay }),
              },
              {
                q: t('localQuestion'),
                a: t('localAnswer'),
              },
              {
                q: t('timelineQuestion'),
                a: t('timelineAnswer'),
              },
              {
                q: t('climateQuestion'),
                a: t('climateAnswer'),
              },
              {
                q: t('financingQuestion'),
                a: t('financingAnswer'),
              },
            ].map((item, idx) => (
              <details key={idx} className="group border border-gray-200 rounded-lg p-4 hover:border-emerald-200 transition">
                <summary className="cursor-pointer font-semibold text-gray-900 flex justify-between items-center">
                  {item.q}
                  <span className="group-open:rotate-180 transition">▼</span>
                </summary>
                <p className="text-gray-600 mt-3 text-sm">{item.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-gradient-to-r from-emerald-50 to-blue-50 rounded-2xl p-8 md:p-12 border border-emerald-200">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">{t('whyChooseHeading')}</h2>
            <ul className="space-y-3 text-gray-700">
              <li className="flex items-center gap-3">
                <span className="text-emerald-600 font-bold">✓</span>
                <span>{interpolate(t('whyChoose1'), { suburb: data.titleKey })}</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="text-emerald-600 font-bold">✓</span>
                <span>{t('whyChoose2')}</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="text-emerald-600 font-bold">✓</span>
                <span>{t('whyChoose3')}</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="text-emerald-600 font-bold">✓</span>
                <span>{t('whyChoose4')}</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-16 md:py-24 bg-gradient-to-r from-gray-900 to-gray-800">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            {t('ctaHeading')}
          </h2>
          <p className="text-lg text-gray-300 mb-8">
            {interpolate(t('ctaSubheading'), { suburb: data.titleKey })}
          </p>
          <button
            onClick={() => { setSelectedService(null); setShowStepper(true); }}
            className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-4 rounded-lg font-semibold transition"
          >
            {t('ctaButton')}
          </button>
        </div>
      </section>

      {/* Form Modal */}
      {showStepper && (
        <QuoteFormStepper
          isOpen={showStepper}
          onClose={() => setShowStepper(false)}
          initialServiceType={selectedService || undefined}
        />
      )}
    </main>
  );
}
