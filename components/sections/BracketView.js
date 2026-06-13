'use client';

import { motion } from 'framer-motion';
import { Trophy } from 'lucide-react';
import Flag from '@/components/ui/Flag';

function Tie({ tie, delay }) {
  const aWin = tie.winner?.uid === tie.a?.uid;
  return (
    <motion.div
      initial={{ opacity: 0, x: -16 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay, duration: 0.35 }}
      className="card overflow-hidden text-sm"
    >
      <Row team={tie.a} goals={tie.ga} win={aWin} />
      <div className="h-px bg-subtle" />
      <Row team={tie.b} goals={tie.gb} win={!aWin} />
      {tie.pens && (
        <div className="bg-bg-elevated px-3 py-1 text-center text-[10px] text-text-secondary">
          Penalties {tie.pens}
        </div>
      )}
    </motion.div>
  );
}

function Row({ team, goals, win }) {
  return (
    <div className={`flex items-center justify-between px-3 py-2 ${win ? 'bg-gold/5' : ''}`}>
      <span className="flex items-center gap-2">
        <Flag team={team} size={22} />
        <span className={`font-medium ${win ? 'text-gold' : 'text-text-secondary'}`}>{team?.name || 'TBD'}</span>
      </span>
      <span className={`tabular font-bold ${win ? 'gold-text' : 'text-text-secondary'}`}>{goals}</span>
    </div>
  );
}

export default function BracketView({ data }) {
  if (!data) return null;
  const { rounds, champion } = data;

  return (
    <div className="space-y-8">
      {rounds.map((round, ri) => (
        <motion.section
          key={round.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: ri * 0.25 }}
        >
          <h3 className="mb-3 flex items-center gap-2 text-section font-semibold">
            <span className="h-4 w-1 rounded-full gold-gradient" />
            {round.label}
            <span className="text-xs font-normal text-text-secondary">({round.ties.length} ties)</span>
          </h3>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {round.ties.map((tie, i) => (
              <Tie key={i} tie={tie} delay={ri * 0.25 + i * 0.05} />
            ))}
          </div>
        </motion.section>
      ))}

      {champion && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: rounds.length * 0.25, type: 'spring', stiffness: 200, damping: 18 }}
          className="relative mx-auto max-w-md overflow-hidden rounded-2xl border border-gold/40 bg-gradient-to-b from-gold/10 to-transparent p-8 text-center shadow-gold-glow-lg"
        >
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 3, repeat: Infinity }}
            className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-2xl gold-gradient shadow-gold-glow"
          >
            <Trophy size={32} className="text-bg-primary" />
          </motion.div>
          <div className="text-[11px] uppercase tracking-[0.2em] text-gold">Predicted Champion</div>
          <div className="mt-3 flex justify-center"><Flag team={champion} size={72} /></div>
          <div className="mt-2 text-3xl font-bold text-text-primary">{champion.name}</div>
          <div className="mt-1 text-sm text-text-secondary">FIFA World Cup 2026 Winner</div>
        </motion.div>
      )}
    </div>
  );
}
