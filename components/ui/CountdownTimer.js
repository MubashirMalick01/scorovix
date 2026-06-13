'use client';

import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

function diff(target) {
  const ms = Math.max(0, new Date(target).getTime() - Date.now());
  return {
    days: Math.floor(ms / 86400000),
    hours: Math.floor((ms % 86400000) / 3600000),
    minutes: Math.floor((ms % 3600000) / 60000),
    seconds: Math.floor((ms % 60000) / 1000),
    done: ms === 0,
  };
}

function Unit({ value, label }) {
  const str = String(value).padStart(2, '0');
  return (
    <div className="flex flex-col items-center">
      <div className="relative flex h-16 w-14 items-center justify-center overflow-hidden rounded-xl border border-subtle bg-bg-elevated sm:h-20 sm:w-16">
        <AnimatePresence mode="popLayout">
          <motion.span
            key={str}
            initial={{ y: '-100%', opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: '100%', opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="gold-text tabular text-3xl font-bold sm:text-4xl"
          >
            {str}
          </motion.span>
        </AnimatePresence>
      </div>
      <span className="mt-1.5 text-[10px] font-semibold uppercase tracking-wider text-text-secondary">{label}</span>
    </div>
  );
}

export default function CountdownTimer({ target, onComplete }) {
  const [t, setT] = useState(() => diff(target));

  useEffect(() => {
    const id = setInterval(() => {
      const d = diff(target);
      setT(d);
      if (d.done) {
        clearInterval(id);
        onComplete && onComplete();
      }
    }, 1000);
    return () => clearInterval(id);
  }, [target, onComplete]);

  return (
    <div className="flex items-center gap-2 sm:gap-3">
      <Unit value={t.days} label="Days" />
      <span className="gold-text text-2xl font-bold">:</span>
      <Unit value={t.hours} label="Hrs" />
      <span className="gold-text text-2xl font-bold">:</span>
      <Unit value={t.minutes} label="Min" />
      <span className="gold-text text-2xl font-bold">:</span>
      <Unit value={t.seconds} label="Sec" />
    </div>
  );
}
