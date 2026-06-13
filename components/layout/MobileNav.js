'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { Home, Radio, Sparkles, GitFork, Users, Newspaper } from 'lucide-react';

const LINKS = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/live', label: 'Live', icon: Radio },
  { href: '/predict', label: 'Predict', icon: Sparkles },
  { href: '/bracket', label: 'Bracket', icon: GitFork },
  { href: '/teams', label: 'Teams', icon: Users },
  { href: '/blog', label: 'Blog', icon: Newspaper },
];

export default function MobileNav() {
  const pathname = usePathname();
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-subtle bg-bg-primary/95 backdrop-blur-xl md:hidden">
      <div className="flex items-stretch justify-around">
        {LINKS.map((l) => {
          const Icon = l.icon;
          const active = l.href === '/' ? pathname === '/' : pathname.startsWith(l.href);
          return (
            <Link
              key={l.href}
              href={l.href}
              className="relative flex min-h-[56px] flex-1 flex-col items-center justify-center gap-1 py-2"
            >
              <Icon size={20} className={active ? 'text-gold' : 'text-text-secondary'} />
              <span className={`text-[10px] font-medium ${active ? 'text-gold' : 'text-text-secondary'}`}>
                {l.label}
              </span>
              {active && (
                <motion.span
                  layoutId="mobile-nav-dot"
                  className="absolute top-1 h-1 w-1 rounded-full bg-gold"
                />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
