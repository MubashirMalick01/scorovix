import './globals.css';
import { Inter } from 'next/font/google';
import Navbar from '@/components/layout/Navbar';
import MobileNav from '@/components/layout/MobileNav';
import Footer from '@/components/layout/Footer';
import { ToastProvider } from '@/components/ui/Toast';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const SITE_URL = 'https://www.scorovix.com';

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'World Cup 2026 Predictions | Live Scores & AI Analysis — Scorovix',
    template: '%s | Scorovix',
  },
  description:
    'Free FIFA World Cup 2026 predictions, live scores, real-time match analysis and group standings. Powered by Scorovix.',
  keywords: [
    'world cup 2026 predictions',
    'fifa world cup 2026',
    'world cup live scores',
    'world cup 2026 results',
    'world cup 2026 bracket',
  ],
  applicationName: 'Scorovix',
  authors: [{ name: 'Scorovix' }],
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    siteName: 'Scorovix',
    title: 'World Cup 2026 Predictions | Live Scores & AI Analysis — Scorovix',
    description:
      'Free FIFA World Cup 2026 predictions, live scores, real-time match analysis and group standings. Powered by Scorovix.',
    url: SITE_URL,
  },
  twitter: {
    card: 'summary_large_image',
    title: 'World Cup 2026 Predictions | Live Scores & AI Analysis — Scorovix',
    description:
      'Free FIFA World Cup 2026 predictions, live scores, real-time match analysis and group standings. Powered by Scorovix.',
  },
  robots: { index: true, follow: true },
};

export const viewport = {
  themeColor: '#080c18',
  width: 'device-width',
  initialScale: 1,
};

const WEBSITE_JSONLD = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'Scorovix',
  url: SITE_URL,
  description: 'FIFA World Cup 2026 predictions and live match analysis',
  potentialAction: {
    '@type': 'SearchAction',
    target: `${SITE_URL}/predict?q={search_term_string}`,
    'query-input': 'required name=search_term_string',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={inter.variable}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(WEBSITE_JSONLD) }}
        />
      </head>
      <body className="font-sans min-h-screen bg-bg-primary text-text-primary">
        <ToastProvider>
          <Navbar />
          <main className="pb-24 md:pb-0 min-h-screen">{children}</main>
          <Footer />
          <MobileNav />
        </ToastProvider>
      </body>
    </html>
  );
}
