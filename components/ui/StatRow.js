'use client';

import { motion } from 'framer-motion';

// Two bars facing each other from the center, label in the middle.
export default function StatRow({ label, home = 0, away = 0, suffix = '' }) {
  const total = home + away || 1;
  const homePct = (home / total) * 100;
  const awayPct = (away / total) * 100;
  const homeLead = home > away;
  const awayLead = away > home;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-30px' }}
      transition={{ duration: 0.4 }}
      className="py-1.5"
    >
      <div className="mb-1 flex items-center justify-between text-xs">
        <span className={`tabular font-bold ${homeLead ? 'text-gold' : 'text-text-primary'}`}>
          {home}
          {suffix}
        </span>
        <span className="text-[11px] uppercase tracking-wide text-text-secondary">{label}</span>
        <span className={`tabular font-bold ${awayLead ? 'text-accent-blue' : 'text-text-primary'}`}>
          {away}
          {suffix}
        </span>
      </div>
      <div className="flex items-center gap-1">
        <div className="flex h-1.5 flex-1 justify-end overflow-hidden rounded-full bg-bg-elevated">
          <motion.div
            initial={{ width: 0 }}
            whileInView={{ width: `${homePct}%` }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
            className="rounded-full bg-gradient-to-l from-gold to-gold-dim"
          />
        </div>
        <div className="flex h-1.5 flex-1 overflow-hidden rounded-full bg-bg-elevated">
          <motion.div
            initial={{ width: 0 }}
            whileInView={{ width: `${awayPct}%` }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
            className="rounded-full bg-gradient-to-r from-accent-blue to-blue-700"
          />
        </div>
      </div>
    </motion.div>
  );
}
