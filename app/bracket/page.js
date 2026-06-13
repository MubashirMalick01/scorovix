'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Loader2, GitFork, Wand2 } from 'lucide-react';
import GroupTable from '@/components/sections/GroupTable';
import BracketView from '@/components/sections/BracketView';
import { SkeletonRows } from '@/components/ui/SkeletonLoader';
import { useToast } from '@/components/ui/Toast';
import { GROUPS } from '@/lib/teams';

export default function BracketPage() {
  const [standings, setStandings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeGroup, setActiveGroup] = useState('A');
  const [sim, setSim] = useState(null);
  const [simulating, setSimulating] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetch('/api/standings')
      .then((r) => r.json())
      .then((d) => setStandings(d.groups || []))
      .catch(() => toast('Could not load standings', 'error'))
      .finally(() => setLoading(false));
  }, [toast]);

  async function simulate() {
    setSimulating(true);
    setSim(null);
    try {
      const res = await fetch('/api/simulate', { method: 'POST' });
      const data = await res.json();
      if (data.error) throw new Error();
      setSim(data);
      toast(`Simulator crowns ${data.champion.name} 🏆`, 'success', 4000);
    } catch {
      toast('Simulation failed', 'error');
    } finally {
      setSimulating(false);
    }
  }

  const groupData = standings?.find((g) => g.group === activeGroup);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <h1 className="mb-1 flex items-center gap-2 text-3xl font-bold sm:text-hero">
        <GitFork className="text-gold" /> World Cup 2026 Groups & <span className="gold-text">Bracket</span>
      </h1>
      <p className="mb-8 text-text-secondary">Group standings and a full simulated knockout bracket.</p>

      {/* GROUP STANDINGS */}
      <section className="mb-12">
        <div className="mb-4 flex flex-wrap gap-2">
          {GROUPS.map((g) => (
            <button
              key={g}
              onClick={() => setActiveGroup(g)}
              className={`h-9 w-9 rounded-lg text-sm font-bold transition-all ${
                activeGroup === g
                  ? 'gold-gradient text-bg-primary'
                  : 'border border-subtle bg-bg-elevated text-text-secondary hover:text-text-primary'
              }`}
            >
              {g}
            </button>
          ))}
        </div>
        {loading ? (
          <SkeletonRows rows={4} />
        ) : groupData ? (
          <motion.div key={activeGroup} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
            <GroupTable group={groupData.group} table={groupData.table} />
          </motion.div>
        ) : (
          <p className="text-text-secondary">No standings available.</p>
        )}
      </section>

      {/* TOURNAMENT SIMULATOR */}
      <section>
        <div className="card mb-8 flex flex-col items-center gap-4 p-8 text-center">
          <motion.div
            animate={{ rotate: simulating ? 360 : 0 }}
            transition={{ duration: 1.5, repeat: simulating ? Infinity : 0, ease: 'linear' }}
            className="flex h-14 w-14 items-center justify-center rounded-2xl gold-gradient shadow-gold-glow"
          >
            <Wand2 size={26} className="text-bg-primary" />
          </motion.div>
          <h2 className="text-section font-semibold">Tournament Simulator</h2>
          <p className="max-w-md text-sm text-text-secondary">
            Play out every knockout tie from the Round of 32 to the Final and crown a champion.
          </p>
          <button
            onClick={simulate}
            disabled={simulating}
            className="flex items-center gap-2 rounded-xl gold-gradient px-6 py-3 font-bold text-bg-primary transition-transform hover:scale-105 active:scale-95 disabled:opacity-80"
          >
            {simulating ? (
              <>
                <Loader2 size={18} className="animate-spin" /> Simulating knockout rounds…
              </>
            ) : (
              <>
                <Wand2 size={18} /> Simulate Rest of Tournament
              </>
            )}
          </button>
        </div>

        {sim && <BracketView data={sim} />}
      </section>
    </div>
  );
}
