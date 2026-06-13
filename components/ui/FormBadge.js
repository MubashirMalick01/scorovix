'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Flag from './Flag';

const STYLE = {
  W: 'bg-accent-green/90 text-bg-primary',
  D: 'bg-slate-500/80 text-white',
  L: 'bg-accent-red/90 text-white',
};

function Pill({ r, i, match }) {
  const [hover, setHover] = useState(false);
  return (
    <div className="relative">
      <motion.span
        initial={{ scale: 0, rotate: -30 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ delay: i * 0.06, type: 'spring', stiffness: 400, damping: 18 }}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        className={`flex h-6 w-6 cursor-default items-center justify-center rounded-md text-[11px] font-bold ${STYLE[r] || STYLE.D}`}
      >
        {r}
      </motion.span>
      {hover && match && (
        <div className="absolute bottom-full left-1/2 z-20 mb-1 flex -translate-x-1/2 items-center gap-1 whitespace-nowrap rounded-md border border-subtle bg-bg-elevated px-2 py-1 text-[11px] text-text-primary shadow-card">
          <Flag code={match.opponentCode} emoji={match.opponentFlag} size={14} /> {match.opponent} {match.score}
        </div>
      )}
    </div>
  );
}

// form: array like ['W','D','L'...]; matches: optional [{opponent, score, ...}]
export default function FormBadge({ form = [], matches = [] }) {
  return (
    <div className="flex gap-1">
      {form.map((r, i) => (
        <Pill key={i} r={r} i={i} match={matches[i]} />
      ))}
    </div>
  );
}
