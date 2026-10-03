'use client';

import Footer from '@/components/Footer';

interface PageLayoutProps {
  children: React.ReactNode;
}

export default function PageLayout({ children }: PageLayoutProps) {
  return (
    <main className="flex flex-col min-h-screen bg-white">
      {children}
      <div className="flex-1"></div>
      <Footer />
    </main>
  );
}
