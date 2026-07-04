'use client';

import { usePathname } from 'next/navigation';
import { locales } from '@/lib/i18n';
import Link from 'next/link';

export default function LanguageSwitcher() {
  const pathname = usePathname();

  const getLocalizedPath = (locale: string) => {
    const segments = pathname.split('/').filter(Boolean);
    if (segments.length === 0) return `/${locale}`;

    const currentLocale = segments[0];
    if (locales.includes(currentLocale as any)) {
      segments[0] = locale;
    } else {
      segments.unshift(locale);
    }
    return '/' + segments.join('/');
  };

  const languageNames: Record<string, { name: string; flag: string }> = {
    'en': { name: 'English', flag: '🇬🇧' },
    'zh-CN': { name: '简体中文', flag: '🇨🇳' },
    'zh-TW': { name: '繁體中文', flag: '🇹🇼' },
  };

  return (
    <div className="flex items-center gap-2">
      {locales.map((locale) => (
        <Link
          key={locale}
          href={getLocalizedPath(locale)}
          className="flex items-center gap-1 px-3 py-2 text-sm rounded-lg hover:bg-gray-100 transition"
          title={languageNames[locale].name}
        >
          <span>{languageNames[locale].flag}</span>
          <span className="hidden sm:inline text-gray-700">{languageNames[locale].name}</span>
        </Link>
      ))}
    </div>
  );
}
