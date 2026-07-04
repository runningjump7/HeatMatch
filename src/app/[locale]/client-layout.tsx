'use client';

import { NextIntlClientProvider } from 'next-intl';
import enMessages from '../../../messages/en.json';
import zhCNMessages from '../../../messages/zh-CN.json';
import zhTWMessages from '../../../messages/zh-TW.json';

const messages = {
  en: enMessages,
  'zh-CN': zhCNMessages,
  'zh-TW': zhTWMessages,
};

type ClientLayoutProps = {
  children: React.ReactNode;
  locale: string;
};

export function ClientLayout({ children, locale }: ClientLayoutProps) {
  const pageMessages = messages[locale as keyof typeof messages] || messages.en;

  return (
    <NextIntlClientProvider messages={pageMessages} locale={locale}>
      {children}
    </NextIntlClientProvider>
  );
}
