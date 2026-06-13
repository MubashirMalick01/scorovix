import Link from 'next/link';
import { Mail } from 'lucide-react';
import Logo from '@/components/ui/Logo';

const QUICK_LINKS = [
  { href: '/', label: 'Home' },
  { href: '/live', label: 'Live Matches' },
  { href: '/predict', label: 'Match Predictor' },
  { href: '/bracket', label: 'Bracket' },
  { href: '/teams', label: 'Teams' },
  { href: '/results', label: 'Results' },
  { href: '/blog', label: 'Blog' },
];

export default function Footer() {
  return (
    <footer className="border-t border-subtle bg-bg-card">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-3">
        {/* Column 1 — Brand */}
        <div>
          <Logo size={34} />
          <p className="mt-4 max-w-xs text-sm text-text-secondary">
            Real-time World Cup 2026 predictions and match intelligence.
          </p>
          <p className="mt-4 text-xs text-text-secondary">© 2026 Scorovix. All rights reserved.</p>
        </div>

        {/* Column 2 — Quick Links */}
        <div>
          <h2 className="mb-4 text-sm font-bold uppercase tracking-wide text-text-primary">Quick Links</h2>
          <ul className="space-y-2 text-sm">
            {QUICK_LINKS.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="text-text-secondary transition-colors hover:text-gold">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Column 3 — Contact */}
        <div>
          <h2 className="mb-4 text-sm font-bold uppercase tracking-wide text-text-primary">Get in Touch</h2>
          <a
            href="mailto:contact@scorovix.com"
            className="inline-flex items-center gap-2 text-sm font-semibold text-gold transition-colors hover:text-gold/80"
          >
            <Mail size={15} /> contact@scorovix.com
          </a>
          <p className="mt-3 text-sm text-text-secondary">For partnerships, press and general enquiries.</p>
          <div className="mt-4 flex flex-wrap gap-x-3 gap-y-1 text-xs text-text-secondary">
            <Link href="/contact" className="transition-colors hover:text-gold">Contact</Link>
            <span className="text-subtle">|</span>
            <Link href="/terms" className="transition-colors hover:text-gold">Terms &amp; Conditions</Link>
            <span className="text-subtle">|</span>
            <Link href="/privacy" className="transition-colors hover:text-gold">Privacy Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
