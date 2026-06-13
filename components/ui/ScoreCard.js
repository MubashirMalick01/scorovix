'use client';

import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import Flag from './Flag';

function Side({ team, align }) {
  return (
    <div className={`flex flex-1 items-center gap-2 ${align === 'right' ? 'flex-row-reverse text-right' : ''}`}>
      <Flag team={team} size={34} />
      <div className={align === 'right' ? 'text-right' : ''}>
        <div className="text-sm font-semibold text-text-primary">{team?.name || 'TBD'}</div>
        {team?.rank ? <div className="text-[11px] text-text-secondary">#{team.rank}</div> : null}
      </div>
    </div>
  );
}

function ScoreNum({ value }) {
  const prev = useRef(value);
  const [glow, setGlow] = useState(false);
  useEffect(() => {
    if (prev.current !== value) {
      setGlow(true);
      const t = setTimeout(() => setGlow(false), 700);
      prev.current = value;
      return () => clearTimeout(t);
    }
  }, [value]);
  return (
    <motion.span
      key={value}
      animate={glow ? { scale: [1, 1.35, 1] } : {}}
      transition={{ duration: 0.6 }}
      className={`tabular text-4xl font-bold ${glow ? 'gold-text' : 'text-text-primary'}`}
    >
      {value ?? '-'}
    </motion.span>
  );
}

export default function ScoreCard({ home, away, goalsHome, goalsAway, minute, status }) {
  return (
    <div className="flex items-center gap-3">
      <Side team={home} align="left" />
      <div className="flex flex-col items-center px-2">
        <div className="flex items-center gap-2">
          <ScoreNum value={goalsHome} />
          <span className="text-2xl text-text-secondary">:</span>
          <ScoreNum value={goalsAway} />
        </div>
        {status === 'LIVE' && minute != null && (
          <span className="mt-1 tabular text-[11px] font-bold text-accent-red">{minute}'</span>
        )}
        {status === 'FT' && <span className="mt-1 text-[11px] font-bold text-text-secondary">FT</span>}
      </div>
      <Side team={away} align="right" />
    </div>
  );
}
