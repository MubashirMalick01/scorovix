'use client';

import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Loader2, Sparkles } from 'lucide-react';
import FormBadge from '@/components/ui/FormBadge';
import ConfidenceMeter from '@/components/ui/ConfidenceMeter';
import { useToast } from '@/components/ui/Toast';
import Flag from '@/components/ui/Flag';

export default function TeamCard({ team }) {
  const [open, setOpen] = useState(false);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  async function expand() {
    if (open) {
      setOpen(false);
      return;
    }
    setOpen(true);
    if (stats) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/team-stats?teamId=${team.uid}`);
      const data = await res.json();
      setStats(data.stats);
    } catch {
      toast('Could not load team stats', 'error');
    } finally {
      setLoading(false);
    }
  }

  return (
    <motion.div layout className="card overflow-hidden">
      <motion.button
        layout
        onClick={expand}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.99 }}
        className="flex w-full items-center gap-3 p-4 text-left transition-colors hover:bg-white/[0.02]"
      >
        <Flag team={team} size={42} />
        <div className="flex-1">
          <div className="font-semibold text-text-primary">{team.name}</div>
          <div className="flex items-center gap-2 text-[11px] text-text-secondary">
            <span className="rounded bg-white/5 px-1.5 py-0.5">Group {team.group}</span>
            <span className="text-gold">FIFA #{team.rank}</span>
          </div>
        </div>
        <Sparkles size={16} className={`transition-colors ${open ? 'text-gold' : 'text-text-secondary'}`} />
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden border-t border-subtle"
          >
            <div className="p-4">
              {loading || !stats ? (
                <div className="flex items-center justify-center gap-2 py-8 text-sm text-text-secondary">
                  <Loader2 size={16} className="animate-spin" /> Loading stats…
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="mb-1.5 text-[11px] uppercase tracking-wide text-text-secondary">
                        Recent form
                      </div>
                      <FormBadge form={stats.form} matches={stats.matches} />
                    </div>
                    <ConfidenceMeter value={stats.strength} size={84} label="Strength" />
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <Stat label="Goals For (L5)" value={stats.goalsFor} />
                    <Stat label="Goals Against (L5)" value={stats.goalsAgainst} />
                    <Stat label="Strength" value={`${stats.strength}/100`} />
                    <Stat label="FIFA Rank" value={`#${team.rank}`} />
                  </div>

                  <div className="rounded-xl border border-subtle bg-bg-elevated p-3">
                    <div className="mb-1 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide text-gold">
                      <Sparkles size={12} /> Tournament Outlook
                    </div>
                    <p className="text-sm text-text-secondary">
                      {team.rank <= 8
                        ? `${team.name} are genuine contenders. With a strength rating of ${stats.strength}/100 and ${stats.goalsFor} goals in their last five, expect a deep knockout run — semi-final or beyond.`
                        : team.rank <= 24
                        ? `${team.name} are dark horses. A favourable draw and solid recent form could carry them to the quarter-finals.`
                        : `${team.name} face an uphill task but can spring a group-stage upset on their day.`}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function Stat({ label, value }) {
  return (
    <div className="rounded-lg bg-bg-elevated px-3 py-2">
      <div className="text-[10px] uppercase tracking-wide text-text-secondary">{label}</div>
      <div className="mt-0.5 font-semibold tabular text-text-primary">{value}</div>
    </div>
  );
}
