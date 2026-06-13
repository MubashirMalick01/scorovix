import Link from 'next/link';

export const metadata = {
  title: 'Privacy Policy',
  description: 'Privacy Policy for Scorovix. We do not collect personal data and use no non-essential cookies.',
  alternates: { canonical: '/privacy' },
  openGraph: {
    title: 'Privacy Policy | Scorovix',
    description: 'Privacy Policy for Scorovix. We do not collect personal data.',
    url: 'https://www.scorovix.com/privacy',
  },
};

const SECTIONS = [
  {
    h: 'What Data We Collect',
    p: 'Scorovix does not collect any personally identifiable information. We do not require accounts, and we do not store names, emails or payment details from visitors.',
  },
  {
    h: 'Third-Party APIs',
    p: 'Live match data, fixtures and statistics are sourced from third-party providers, primarily API-Football. Requests for this data are made server-side and do not expose your personal information.',
  },
  {
    h: 'Cookies Policy',
    p: 'We use no cookies beyond those strictly necessary for essential site functionality. We do not use advertising or tracking cookies.',
  },
  {
    h: 'Contact',
    p: 'For any privacy enquiries, contact us at contact@scorovix.com.',
  },
];

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <h1 className="text-3xl font-bold sm:text-hero">Privacy Policy</h1>
      <p className="mt-2 text-sm text-text-secondary">Last updated: June 2026</p>

      <div className="mt-8 space-y-8">
        {SECTIONS.map((s) => (
          <section key={s.h}>
            <h2 className="text-cardtitle font-semibold text-text-primary">{s.h}</h2>
            <p className="mt-2 leading-relaxed text-text-secondary">{s.p}</p>
          </section>
        ))}
      </div>

      <Link
        href="/"
        className="mt-10 inline-flex items-center gap-1 text-sm font-semibold text-gold transition-all hover:gap-2"
      >
        ← Back to Home
      </Link>
    </div>
  );
}
