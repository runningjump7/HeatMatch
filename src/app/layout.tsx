import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "HeatMatch - Find Heat Pump Installers | North Shore Auckland",
  description: "Connect with trusted local heat pump installers on Auckland's North Shore. Free quotes, no obligation. Get your heat pump installation quote today.",
  keywords: "heat pump installation Auckland, heat pump installers North Shore, heat pump replacement, heat pump service",
  openGraph: {
    type: "website",
    locale: "en_NZ",
    url: "https://heatmatch.nz",
    siteName: "HeatMatch",
    title: "HeatMatch - Find Heat Pump Installers | North Shore Auckland",
    description: "Connect with trusted local heat pump installers on Auckland's North Shore. Free quotes, no obligation.",
    images: [
      {
        url: "https://heatmatch.nz/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "HeatMatch - Find Local Heat Pump Installers",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "HeatMatch - Find Heat Pump Installers | North Shore Auckland",
    description: "Connect with trusted local heat pump installers on Auckland's North Shore. Free quotes, no obligation.",
  },
  alternates: {
    canonical: "https://heatmatch.nz",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Schema markup for LocalBusiness
  const localBusinessSchema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": "HeatMatch",
    "description": "Heat pump installer marketplace connecting homeowners with trusted local installers on Auckland's North Shore",
    "url": "https://heatmatch.nz",
    "logo": "https://heatmatch.nz/icons/heatmatch-logo.svg",
    "areaServed": {
      "@type": "City",
      "name": "Auckland",
      "areaServed": [
        "Albany", "Takapuna", "Milford", "Browns Bay",
        "Glenfield", "Birkenhead", "Devonport", "Mairangi Bay",
        "Northcote", "Long Bay"
      ]
    },
    "contactPoint": {
      "@type": "ContactPoint",
      "contactType": "Customer Service",
      "url": "https://heatmatch.nz"
    },
    "sameAs": [
      "https://www.facebook.com/heatmatch",
      "https://www.instagram.com/heatmatch"
    ]
  };

  // Schema markup for Service
  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": "Heat Pump Installation & Service",
    "provider": {
      "@type": "LocalBusiness",
      "name": "HeatMatch"
    },
    "areaServed": "North Shore, Auckland, New Zealand",
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "Heat Pump Services",
      "itemListElement": [
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "New Heat Pump Installation"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Heat Pump Replacement"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Heat Pump Service & Maintenance"
          }
        }
      ]
    }
  };

  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
        />
      </head>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
