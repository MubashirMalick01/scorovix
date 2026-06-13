'use client';

import { motion } from 'framer-motion';

// score: 0-100. 0 = away dominating, 100 = home dominating, 50 = neutral.
export default function MomentumMeter({ score = 50, home = 'Home', away = 'Away' }) {
  const s = Math.max(0, Math.min(100, score));
  const homeWinning = s > 55;
  const awayWinning = s < 45;
  const needleColor = homeWinning ? '#ffd700' : awayWinning ? '#3b82f6' : '#94a3b8';

  return (
    <div className="w-full">
      <div className="mb-1.5 flex justify-between text-[11px] font-semibold">
        <span className={homeWinning ? 'text-gold' : 'text-text-secondary'}>{home}</span>
        <span className="text-text-secondary">Momentum</span>
        <span className={awayWinning ? 'text-accent-blue' : 'text-text-secondary'}>{away}</span>
      </div>
      <div className="relative h-3 w-full overflow-hidden rounded-full bg-gradient-to-r from-gold/30 via-slate-600/30 to-accent-blue/30">
        <div
          className="absolute inset-y-0 left-0 bg-gradient-to-r from-gold to-gold-dim"
          style={{ width: `${s}%`, opacity: 0.35 }}
        />
        <motion.div
          className="absolute top-1/2 h-6 w-1.5 -translate-y-1/2 rounded-full"
          style={{ background: needleColor, boxShadow: `0 0 12px ${needleColor}` }}
          initial={{ left: '50%' }}
          animate={{ left: `${s}%` }}
          transition={{ type: 'spring', stiffness: 120, damping: 18 }}
        />
      </div>
      <div className="mt-1 text-center text-[11px] tabular text-text-secondary">
        {homeWinning ? `${home} +${s - 50}` : awayWinning ? `${away} +${50 - s}` : 'Even'}
      </div>
    </div>
  );
}
