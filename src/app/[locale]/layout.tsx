import { NextIntlClientProvider } from 'next-intl';
import { notFound } from 'next/navigation';
import { locales } from '@/lib/i18n';

export const dynamic = 'force-dynamic';

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Omit<Props, 'children'>) {
  const { locale } = await params;

  const titles: Record<string, string> = {
    'en': 'HeatMatch - Find Heat Pump Installers | North Shore Auckland',
    'zh-CN': 'HeatMatch - 寻找热泵安装商 | 奥克兰北岸',
    'zh-TW': 'HeatMatch - 尋找熱泵安裝商 | 奧克蘭北岸',
  };

  return {
    title: titles[locale] || titles['en'],
  };
}

export default async function LocaleLayout({
  children,
  params
}: Props) {
  const { locale } = await params;

  if (!locales.includes(locale as any)) {
    notFound();
  }

  const messages = (await import(`../../../messages/${locale}.json`)).default;

  return (
    <NextIntlClientProvider messages={messages} locale={locale}>
      {children}
    </NextIntlClientProvider>
  );
}
