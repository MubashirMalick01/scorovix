'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Search, Users } from 'lucide-react';
import TeamCard from '@/components/sections/TeamCard';
import { GROUPS } from '@/lib/teams';
import { useTeams } from '@/lib/useTeams';
import { SkeletonGrid } from '@/components/ui/SkeletonLoader';

export default function TeamsPage() {
  const { teams, loading } = useTeams();
  const [query, setQuery] = useState('');
  const [group, setGroup] = useState('All');

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return teams.filter(
      (t) => (group === 'All' || t.group === group) && (!q || t.name.toLowerCase().includes(q))
    );
  }, [query, group, teams]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <h1 className="mb-1 flex items-center gap-2 text-3xl font-bold sm:text-hero">
        <Users className="text-gold" /> FIFA World Cup <span className="gold-text">2026</span> Teams
      </h1>
      <p className="mb-6 text-text-secondary">Every nation at the FIFA World Cup 2026. Tap a card for team stats.</p>

      <div className="mb-4 flex items-center gap-2 rounded-xl border border-subtle bg-bg-elevated px-4 py-3">
        <Search size={18} className="text-text-secondary" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search teams…"
          className="w-full bg-transparent text-sm outline-none placeholder:text-text-secondary"
        />
      </div>

      <div className="mb-6 flex flex-wrap gap-2">
        {['All', ...GROUPS].map((g) => (
          <button
            key={g}
            onClick={() => setGroup(g)}
            className={`rounded-full px-3 py-1.5 text-xs font-medium transition-all ${
              group === g
                ? 'gold-gradient text-bg-primary'
                : 'border border-subtle bg-bg-elevated text-text-secondary hover:text-text-primary'
            }`}
          >
            {g === 'All' ? 'All' : `Group ${g}`}
          </button>
        ))}
      </div>

      {loading ? (
        <SkeletonGrid count={6} />
      ) : filtered.length ? (
        <motion.div layout className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((t) => (
            <TeamCard key={t.uid} team={t} />
          ))}
        </motion.div>
      ) : (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-subtle py-16 text-center text-text-secondary">
          <span className="mb-2 text-4xl">🔍</span>
          No teams match “{query}”.
        </div>
      )}
    </div>
  );
}
