'use client';

import { useTranslations } from 'next-intl';
import Footer from '@/components/Footer';

export default function PrivacyPolicyPage() {
  const t = useTranslations();

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-600 to-emerald-700 text-white py-16">
        <div className="max-w-4xl mx-auto px-4">
          <h1 className="text-4xl font-bold">{t('pages.privacy.heading')}</h1>
          <p className="text-emerald-100 mt-2">{t('pages.privacy.subheading')}</p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-16">
        <div className="prose prose-sm max-w-none text-gray-700 space-y-6">
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Introduction</h2>
            <p>{t('pages.privacy.introduction')}</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">2. {t('pages.privacy.section1')}</h2>
            <p>{t('pages.privacy.section1Text')}</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">3. {t('pages.privacy.section2')}</h2>
            <p>{t('pages.privacy.section2Text')}</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">4. {t('pages.privacy.section3')}</h2>
            <p>{t('pages.privacy.section3Text')}</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">5. {t('pages.privacy.section4')}</h2>
            <p>{t('pages.privacy.section4Text')}</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">6. {t('pages.privacy.section5')}</h2>
            <p>{t('pages.privacy.section5Text')}</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">7. {t('pages.privacy.section6')}</h2>
            <p>{t('pages.privacy.section6Text')}</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">8. {t('pages.privacy.section7')}</h2>
            <p>{t('pages.privacy.section7Text')}</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">9. {t('pages.privacy.section8')}</h2>
            <p>{t('pages.privacy.section8Text')}</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">10. {{t('pages.privacy.section9')}}</h2>
            <p>{t('pages.privacy.section9Text')}</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">11. {t('pages.privacy.section10')}</h2>
            <p>{t('pages.privacy.section10Text')}</p>
          </section>
        </div>
      </div>

      <Footer />
    </div>
  );
}
