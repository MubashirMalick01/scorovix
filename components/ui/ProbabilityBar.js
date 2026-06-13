'use client';

import { motion } from 'framer-motion';

// Three-section animated probability bar: home (gold) | draw (gray) | away (blue).
export default function ProbabilityBar({
  winA = 33,
  draw = 34,
  winB = 33,
  labelA = 'Home',
  labelB = 'Away',
  showLabels = true,
}) {
  const sections = [
    { pct: winA, color: 'linear-gradient(90deg,#ffd700,#cc9a00)', text: '#080c18', label: labelA },
    { pct: draw, color: 'linear-gradient(90deg,#475569,#334155)', text: '#f1f5f9', label: 'Draw' },
    { pct: winB, color: 'linear-gradient(90deg,#3b82f6,#1d4ed8)', text: '#fff', label: labelB },
  ];

  return (
    <div className="w-full">
      <div className="flex h-9 w-full overflow-hidden rounded-lg border border-subtle bg-bg-elevated">
        {sections.map((s, i) => (
          <motion.div
            key={i}
            initial={{ width: 0 }}
            animate={{ width: `${s.pct}%` }}
            transition={{ duration: 0.9, delay: i * 0.12, ease: 'easeOut' }}
            className="flex items-center justify-center overflow-hidden"
            style={{ background: s.color }}
          >
            {s.pct >= 12 && (
              <span className="tabular text-xs font-bold" style={{ color: s.text }}>
                {s.pct}%
              </span>
            )}
          </motion.div>
        ))}
      </div>
      {showLabels && (
        <div className="mt-1.5 flex justify-between text-[11px] font-medium text-text-secondary">
          <span className="text-gold">{labelA}</span>
          <span>Draw</span>
          <span className="text-accent-blue">{labelB}</span>
        </div>
      )}
    </div>
  );
}
