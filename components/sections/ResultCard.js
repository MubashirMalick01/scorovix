'use client';

import { motion } from 'framer-motion';
import Flag from '@/components/ui/Flag';

export default function ResultCard({ match }) {
  const { home, away, goalsHome, goalsAway, events = [] } = match;
  // Only real goal scorers from API-Football events. If none, show score only.
  const scorers = events.filter((e) => e.type === 'Goal' && e.player);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-30px' }}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.3 }}
      className="card p-4"
    >
      <div className="mb-3 flex items-center justify-between text-[11px] text-text-secondary">
        <span>{match.round || 'Group Stage'}</span>
        <span className="rounded bg-white/5 px-2 py-0.5 font-semibold">FT</span>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex flex-1 items-center gap-2">
          <Flag team={home} size={26} />
          <span className="font-semibold text-text-primary">{home.name}</span>
        </div>
        <div className="px-3 tabular text-2xl font-bold">
          <span className={goalsHome > goalsAway ? 'gold-text' : 'text-text-primary'}>{goalsHome}</span>
          <span className="mx-1 text-text-secondary">-</span>
          <span className={goalsAway > goalsHome ? 'gold-text' : 'text-text-primary'}>{goalsAway}</span>
        </div>
        <div className="flex flex-1 items-center justify-end gap-2 text-right">
          <span className="font-semibold text-text-primary">{away.name}</span>
          <Flag team={away} size={26} />
        </div>
      </div>

      {scorers.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 border-t border-subtle pt-3 text-[11px] text-text-secondary">
          {scorers.map((s, i) => (
            <span key={i} className="inline-flex items-center gap-1">
              ⚽ {s.player} <span className="text-text-secondary/60">{s.minute}'</span>
            </span>
          ))}
        </div>
      )}
    </motion.div>
  );
}
