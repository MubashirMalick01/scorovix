'use client';

import { useState, useRef, useEffect, useMemo } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronDown, Search, Check } from 'lucide-react';
import { useTeams } from '@/lib/useTeams';
import Flag from './Flag';

export default function TeamSelector({ value, onChange, label, exclude, placeholder = 'Select a team' }) {
  const { teams: TEAMS } = useTeams();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const ref = useRef(null);

  useEffect(() => {
    function handler(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const selected = useMemo(() => TEAMS.find((t) => t.uid === value), [value, TEAMS]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return TEAMS.filter(
      (t) => t.uid !== exclude && (!q || t.name.toLowerCase().includes(q) || (t.group || '').toLowerCase() === q)
    );
  }, [query, exclude, TEAMS]);

  return (
    <div className="relative w-full" ref={ref}>
      {label && <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wide text-text-secondary">{label}</label>}
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between rounded-xl border border-subtle bg-bg-elevated px-4 py-3 text-left transition-all hover:border-gold/40 active:scale-[0.99]"
      >
        {selected ? (
          <span className="flex items-center gap-2.5">
            <Flag team={selected} size={26} />
            <span className="font-semibold text-text-primary">{selected.name}</span>
            <span className="rounded bg-white/5 px-1.5 py-0.5 text-[10px] text-text-secondary">Grp {selected.group}</span>
            <span className="text-[11px] text-gold">#{selected.rank}</span>
          </span>
        ) : (
          <span className="text-text-secondary">{placeholder}</span>
        )}
        <ChevronDown size={18} className={`text-text-secondary transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.16 }}
            className="absolute z-50 mt-2 w-full overflow-hidden rounded-xl border border-subtle bg-bg-elevated shadow-card"
          >
            <div className="flex items-center gap-2 border-b border-subtle px-3 py-2">
              <Search size={15} className="text-text-secondary" />
              <input
                autoFocus
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search team or group…"
                className="w-full bg-transparent text-sm text-text-primary outline-none placeholder:text-text-secondary"
              />
            </div>
            <div className="max-h-64 overflow-y-auto">
              {filtered.length === 0 && (
                <div className="px-4 py-6 text-center text-sm text-text-secondary">No teams found</div>
              )}
              {filtered.map((t) => (
                <button
                  key={t.uid}
                  onClick={() => {
                    onChange(t.uid);
                    setOpen(false);
                    setQuery('');
                  }}
                  className="flex w-full items-center justify-between px-3 py-2.5 text-left transition-colors hover:bg-white/5"
                >
                  <span className="flex items-center gap-2.5">
                    <Flag team={t} size={22} />
                    <span className="text-sm font-medium text-text-primary">{t.name}</span>
                    <span className="rounded bg-white/5 px-1.5 py-0.5 text-[10px] text-text-secondary">Grp {t.group}</span>
                  </span>
                  <span className="flex items-center gap-2">
                    <span className="text-[11px] text-gold">#{t.rank}</span>
                    {value === t.uid && <Check size={14} className="text-accent-green" />}
                  </span>
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
