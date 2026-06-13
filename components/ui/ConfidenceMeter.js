'use client';

import { motion } from 'framer-motion';
import { confidenceLabel } from '@/lib/utils';

// Circular progress ring with gold stroke. value: 0-100.
export default function ConfidenceMeter({ value = 60, size = 120, label, sublabel = 'Confidence' }) {
  const v = Math.max(0, Math.min(100, Math.round(value)));
  const stroke = size * 0.085;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const offset = c - (v / 100) * c;
  const text = label || confidenceLabel(v);

  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="rgba(255,255,255,0.08)"
          strokeWidth={stroke}
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="url(#confGrad)"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={c}
          initial={{ strokeDashoffset: c }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.1, ease: 'easeOut' }}
          style={{ filter: 'drop-shadow(0 0 6px rgba(255,215,0,0.5))' }}
        />
        <defs>
          <linearGradient id="confGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#ffd700" />
            <stop offset="100%" stopColor="#cc9a00" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="gold-text tabular text-2xl font-bold leading-none">{v}%</span>
        <span className="mt-1 text-[10px] font-semibold uppercase tracking-wide text-text-secondary">
          {text}
        </span>
      </div>
      <span className="sr-only">{sublabel}</span>
    </div>
  );
}
