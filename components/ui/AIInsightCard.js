'use client';

import { motion } from 'framer-motion';
import { Brain } from 'lucide-react';
import Typewriter from './Typewriter';

export default function AIInsightCard({ title = 'Analysis', text = '', children, typewriter = true, source }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.45, ease: 'easeOut' }}
      className="relative overflow-hidden rounded-2xl border border-subtle bg-bg-card p-5"
      style={{ borderLeft: '3px solid #ffd700' }}
    >
      <div className="mb-3 flex items-center gap-2">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
          className="flex h-7 w-7 items-center justify-center rounded-lg bg-gold/15"
        >
          <Brain size={16} className="text-gold" />
        </motion.div>
        <h3 className="text-cardtitle font-semibold text-text-primary">{title}</h3>
      </div>

      {text ? (
        <p className="text-sm leading-relaxed text-text-secondary">
          {typewriter ? <Typewriter text={text} speed={18} /> : text}
        </p>
      ) : null}

      {children}

      <div className="mt-4 flex items-center justify-between border-t border-subtle pt-3">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-gold/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-gold">
          <Brain size={11} /> SCOROVIX
        </span>
        {source && (
          <span className="text-[10px] uppercase tracking-wide text-text-secondary">
            {source === 'intelligence' ? 'Live model' : source === 'model' ? 'Statistical model' : source}
          </span>
        )}
      </div>
    </motion.div>
  );
}
