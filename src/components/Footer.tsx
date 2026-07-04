'use client';

import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { usePathname } from 'next/navigation';

export default function Footer() {
  const t = useTranslations();
  const pathname = usePathname();
  const locale = pathname.split('/')[1];

  return (
    <footer className="bg-gray-900 text-gray-400 py-12">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          <div>
            <Link href="/">
              <img src="/icons/heatmatch-logo-white.svg" alt="HeatMatch" className="h-8 mb-4 cursor-pointer hover:opacity-80 transition" />
            </Link>
            <p className="text-sm">{t('footer.tagline')}</p>
          </div>
          <div>
            <h4 className="font-semibold text-white mb-4">{t('footer.companyHeading')}</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href={`/${locale}/about`} className="hover:text-white transition">{t('footer.aboutLink')}</Link></li>
              <li><Link href={`/${locale}/contact`} className="hover:text-white transition">{t('footer.contactLink')}</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-white mb-4">{t('footer.legalHeading')}</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href={`/${locale}/privacy`} className="hover:text-white transition">{t('footer.privacyLink')}</Link></li>
              <li><Link href={`/${locale}/terms`} className="hover:text-white transition">{t('footer.termsLink')}</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-white mb-4">{t('footer.contactHeading')}</h4>
            <p className="text-sm">hello@heatmatch.nz</p>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8 text-sm text-center">
          <p>{t('footer.copyright')}</p>
        </div>
      </div>
    </footer>
  );
}
