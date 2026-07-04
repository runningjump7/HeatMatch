'use client';

import { useTranslations } from 'next-intl';
import Footer from '@/components/Footer';

export default function AboutPage() {
  const t = useTranslations();

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-600 to-emerald-700 text-white py-16">
        <div className="max-w-4xl mx-auto px-4">
          <h1 className="text-4xl font-bold">{t('pages.about.heading')}</h1>
          <p className="text-emerald-100 mt-2">{t('pages.about.subheading')}</p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-16">
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">{t('pages.about.mission.title')}</h2>
          <p className="text-gray-700 leading-relaxed">
            {t('pages.about.mission.text')}
          </p>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">{t('pages.about.whyChoose.title')}</h2>
          <ul className="space-y-3 text-gray-700">
            <li className="flex gap-3">
              <span className="text-emerald-600 font-bold">✓</span>
              <span>{t('pages.about.whyChoose.localExpertise')}</span>
            </li>
            <li className="flex gap-3">
              <span className="text-emerald-600 font-bold">✓</span>
              <span>{t('pages.about.whyChoose.freeService')}</span>
            </li>
            <li className="flex gap-3">
              <span className="text-emerald-600 font-bold">✓</span>
              <span>{t('pages.about.whyChoose.noObligation')}</span>
            </li>
            <li className="flex gap-3">
              <span className="text-emerald-600 font-bold">✓</span>
              <span>{t('pages.about.whyChoose.trustedPartners')}</span>
            </li>
          </ul>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">{t('pages.about.service.title')}</h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            {t('pages.about.service.text1')}
          </p>
          <p className="text-gray-700 leading-relaxed">
            {t('pages.about.service.text2')}
          </p>
        </section>
      </div>

      <Footer />
    </div>
  );
}
