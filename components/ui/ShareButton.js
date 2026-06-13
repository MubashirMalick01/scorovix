'use client';

import { useState } from 'react';
import { Share2, Check } from 'lucide-react';

export default function ShareButton({ url }) {
  const [copied, setCopied] = useState(false);

  function share() {
    const full = url || (typeof window !== 'undefined' ? window.location.href : '');
    if (navigator.share) {
      navigator.share({ url: full }).catch(() => copy(full));
    } else {
      copy(full);
    }
  }

  function copy(full) {
    navigator.clipboard?.writeText(full).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  return (
    <button
      onClick={share}
      className="inline-flex items-center gap-2 rounded-xl border border-subtle bg-bg-elevated px-4 py-2 text-sm font-semibold text-text-primary transition-all hover:border-gold/40 hover:text-gold active:scale-[0.98]"
    >
      {copied ? <Check size={15} className="text-accent-green" /> : <Share2 size={15} />}
      {copied ? 'Link copied!' : 'Share'}
    </button>
  );
}
