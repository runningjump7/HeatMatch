'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import QuoteFormStepper from '@/components/QuoteFormStepper';

interface SuburbPageProps {
  params: Promise<{ suburb: string }>;
}

export default function SuburbPage({ params }: SuburbPageProps) {
  const [showStepper, setShowStepper] = useState(false);
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [suburb, setSuburb] = useState<string>('');

  // Unwrap async params on mount
  useEffect(() => {
    params.then(p => setSuburb(p.suburb));
  }, [params]);

  const suburbData: { [key: string]: { title: string; description: string; population: string; avgCost: string } } = {
    albany: {
      title: 'Heat Pump Installation in Albany',
      description: 'Professional heat pump services for Albany homes and businesses',
      population: '~18,000 residents',
      avgCost: '$4,500 - $8,000',
    },
    takapuna: {
      title: 'Heat Pump Installation in Takapuna',
      description: 'Expert heat pump installers serving Takapuna and surrounding areas',
      population: '~15,000 residents',
      avgCost: '$4,500 - $8,000',
    },
    milford: {
      title: 'Heat Pump Installation in Milford',
      description: 'Trusted heat pump installation and service in Milford',
      population: '~12,000 residents',
      avgCost: '$4,500 - $8,000',
    },
    'browns-bay': {
      title: 'Heat Pump Installation in Browns Bay',
      description: 'Heat pump experts serving Browns Bay residences and commercial spaces',
      population: '~8,000 residents',
      avgCost: '$4,500 - $8,000',
    },
    glenfield: {
      title: 'Heat Pump Installation in Glenfield',
      description: 'Reliable heat pump installation services for Glenfield homes',
      population: '~25,000 residents',
      avgCost: '$4,500 - $8,000',
    },
    birkenhead: {
      title: 'Heat Pump Installation in Birkenhead',
      description: 'Professional heat pump installers in Birkenhead',
      population: '~20,000 residents',
      avgCost: '$4,500 - $8,000',
    },
    devonport: {
      title: 'Heat Pump Installation in Devonport',
      description: 'Trusted heat pump services for Devonport homes',
      population: '~10,000 residents',
      avgCost: '$4,500 - $8,000',
    },
    'mairangi-bay': {
      title: 'Heat Pump Installation in Mairangi Bay',
      description: 'Expert heat pump installation in Mairangi Bay',
      population: '~9,000 residents',
      avgCost: '$4,500 - $8,000',
    },
    northcote: {
      title: 'Heat Pump Installation in Northcote',
      description: 'Professional heat pump services for Northcote residents',
      population: '~14,000 residents',
      avgCost: '$4,500 - $8,000',
    },
    'long-bay': {
      title: 'Heat Pump Installation in Long Bay',
      description: 'Quality heat pump installation in Long Bay',
      population: '~11,000 residents',
      avgCost: '$4,500 - $8,000',
    },
  };

  const suburbKey = suburb.toLowerCase().replace(/\s+/g, '-');
  const data = suburbData[suburbKey] || suburbData.albany;

  return (
    <main className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
          <Link href="/">
            <img src="/icons/heatmatch-logo.svg" alt="HeatMatch" className="h-10" />
          </Link>
          <button
            onClick={() => { setSelectedService(null); setShowStepper(true); }}
            className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2 rounded-lg font-medium text-sm transition">
            Get Quote
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-16 md:py-24 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 leading-tight">
              {data.title}
            </h1>
            <p className="text-lg text-gray-600 mb-2">{data.description}</p>
            <p className="text-sm text-gray-500">Population: {data.population} | Average Cost: {data.avgCost}</p>
          </div>

          {/* CTA */}
          <div className="flex justify-center gap-4 flex-wrap">
            <button
              onClick={() => { setSelectedService(null); setShowStepper(true); }}
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-3 rounded-lg font-semibold transition"
            >
              Get Free Quote →
            </button>
            <Link
              href="/"
              className="border-2 border-gray-300 hover:border-emerald-600 text-gray-900 px-8 py-3 rounded-lg font-semibold transition"
            >
              ← Back to Home
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">
            Heat Pump FAQs for {suburb}
          </h2>

          <div className="space-y-4">
            {[
              {
                q: `How much does heat pump installation cost in ${suburb}?`,
                a: `The average cost for heat pump installation in ${suburb} ranges from ${data.avgCost}. This depends on the size of your home, existing infrastructure, and the specific system chosen. Our installers provide free quotes to give you accurate pricing.`,
              },
              {
                q: 'Why should I choose a local heat pump installer?',
                a: 'Local installers understand regional climate conditions, local building codes, and can provide faster response times for maintenance and service calls. They\'re familiar with homes in your area and can recommend the best systems for your neighborhood.',
              },
              {
                q: 'How long does heat pump installation take?',
                a: 'Most heat pump installations take 1-3 days depending on complexity. Our installers will provide a timeline during the initial consultation.',
              },
              {
                q: 'Are heat pumps suitable for our North Shore climate?',
                a: 'Yes! Heat pumps are excellent for the North Shore\'s moderate climate. They provide efficient heating in winter and cooling in summer, reducing your energy costs year-round.',
              },
              {
                q: 'Do you offer financing options?',
                a: 'Many of our partner installers offer financing options. Discuss payment plans during your free consultation.',
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
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Why Choose HeatMatch?</h2>
            <ul className="space-y-3 text-gray-700">
              <li className="flex items-center gap-3">
                <span className="text-emerald-600 font-bold">✓</span>
                <span>Free quotes from trusted local installers in {suburb}</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="text-emerald-600 font-bold">✓</span>
                <span>No obligation to proceed</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="text-emerald-600 font-bold">✓</span>
                <span>Response within 24 hours</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="text-emerald-600 font-bold">✓</span>
                <span>All installers are verified professionals</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-16 md:py-24 bg-gradient-to-r from-gray-900 to-gray-800">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready for Your Heat Pump Installation?
          </h2>
          <p className="text-lg text-gray-300 mb-8">
            Get a free quote from trusted local installers in {suburb}. No obligation, no charge.
          </p>
          <button
            onClick={() => { setSelectedService(null); setShowStepper(true); }}
            className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-4 rounded-lg font-semibold transition"
          >
            Get Free Quote →
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
