'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import Logo from '@/components/ui/Logo';

const LINKS = [
  { href: '/', label: 'Home' },
  { href: '/live', label: 'Live' },
  { href: '/predict', label: 'Predict' },
  { href: '/bracket', label: 'Bracket' },
  { href: '/teams', label: 'Teams' },
  { href: '/results', label: 'Results' },
  { href: '/blog', label: 'Blog' },
];

export default function Navbar() {
  const pathname = usePathname();
  return (
    <header className="sticky top-0 z-50 border-b border-subtle bg-bg-primary/80 backdrop-blur-xl">
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="group flex items-center" aria-label="Scorovix home">
          <motion.div whileHover={{ scale: 1.05 }}>
            <Logo size={36} />
          </motion.div>
        </Link>

        <div className="hidden items-center gap-1 md:flex">
          {LINKS.map((l) => {
            const active = l.href === '/' ? pathname === '/' : pathname.startsWith(l.href);
            return (
              <Link
                key={l.href}
                href={l.href}
                className={`relative rounded-lg px-3.5 py-2 text-sm font-medium transition-colors ${
                  active ? 'text-gold' : 'text-text-secondary hover:text-text-primary'
                }`}
              >
                {l.label}
                {active && (
                  <motion.span
                    layoutId="nav-underline"
                    className="absolute inset-x-2 -bottom-[1px] h-0.5 rounded-full bg-gold"
                  />
                )}
              </Link>
            );
          })}
        </div>

        <Link
          href="/predict"
          className="hidden rounded-lg gold-gradient px-4 py-2 text-sm font-bold text-bg-primary transition-transform hover:scale-105 active:scale-95 md:inline-flex"
        >
          Predict a Match
        </Link>
      </nav>
    </header>
  );
}
