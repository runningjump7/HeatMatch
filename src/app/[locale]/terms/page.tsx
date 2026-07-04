'use client';

import { useTranslations } from 'next-intl';
import Footer from '@/components/Footer';

export default function TermsPage() {
  const t = useTranslations();

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-600 to-emerald-700 text-white py-16">
        <div className="max-w-4xl mx-auto px-4">
          <h1 className="text-4xl font-bold">{t('pages.terms.heading')}</h1>
          <p className="text-emerald-100 mt-2">{t('pages.terms.subheading')}</p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-16">
        <div className="prose prose-sm max-w-none text-gray-700 space-y-6">
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">1. {t('pages.terms.section1Title')}</h2>
            <p>{t('pages.terms.section1Text')}</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">2. {t('pages.terms.section2Title')}</h2>
            <p>{t('pages.terms.section2Text')}</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">3. {t('pages.terms.section3Title')}</h2>
            <p>{t('pages.terms.section3Text')}</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">4. {t('pages.terms.section4Title')}</h2>
            <p>{t('pages.terms.section4Text')}</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">5. {t('pages.terms.section5Title')}</h2>
            <p>{t('pages.terms.section5Text')}</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">6. {t('pages.terms.section6Title')}</h2>
            <p>{t('pages.terms.section6Text')}</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">7. {t('pages.terms.section7Title')}</h2>
            <p>{t('pages.terms.section7Text')}</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">8. {t('pages.terms.section8Title')}</h2>
            <p>{t('pages.terms.section8Text')}</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">9. {t('pages.terms.section9Title')}</h2>
            <p>{t('pages.terms.section9Text')}</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">10. {t('pages.terms.section10Title')}</h2>
            <p>{t('pages.terms.section10Text')}</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">11. {t('pages.terms.section11Title')}</h2>
            <p>{t('pages.terms.section11Text')}</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">12. {t('pages.terms.section12Title')}</h2>
            <p>{t('pages.terms.section12Text')}</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">13. {t('pages.terms.section13Title')}</h2>
            <p>{t('pages.terms.section13Text')}</p>
          </section>
        </div>
      </div>

      <Footer />
    </div>
  );
}
