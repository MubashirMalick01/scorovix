import Link from 'next/link';
import { Mail, ArrowLeft } from 'lucide-react';

export const metadata = {
  title: { absolute: 'Contact Scorovix' },
  description: 'Contact Scorovix for partnerships, press requests and general enquiries about our FIFA World Cup 2026 predictions.',
  alternates: { canonical: '/contact' },
  openGraph: {
    title: 'Contact Scorovix',
    description: 'Contact Scorovix for partnerships, press requests and general enquiries.',
    url: 'https://www.scorovix.com/contact',
  },
};

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6">
      <h1 className="text-3xl font-bold sm:text-hero">Contact Us</h1>
      <div className="mt-6 space-y-5 text-text-secondary">
        <p>Have a question, partnership enquiry or press request? We'd love to hear from you.</p>

        <div className="card flex flex-col items-start gap-2 p-6">
          <span className="text-[11px] font-semibold uppercase tracking-wide text-text-secondary">Email</span>
          <a
            href="mailto:contact@scorovix.com"
            className="inline-flex items-center gap-2 text-lg font-bold text-gold transition-colors hover:text-gold/80"
          >
            <Mail size={18} /> contact@scorovix.com
          </a>
        </div>

        <p>We typically respond within 24 hours.</p>
      </div>

      <Link
        href="/"
        className="mt-8 inline-flex items-center gap-1 text-sm font-semibold text-gold transition-all hover:gap-2"
      >
        <ArrowLeft size={15} /> Back to Home
      </Link>
    </div>
  );
}
