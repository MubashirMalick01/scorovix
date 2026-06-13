'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Zap, Sparkles, Loader2 } from 'lucide-react';
import TeamSelector from '@/components/ui/TeamSelector';
import PredictionResult from '@/components/sections/PredictionResult';
import { SkeletonCard } from '@/components/ui/SkeletonLoader';
import { useToast } from '@/components/ui/Toast';
import { STAGES } from '@/lib/utils';

export default function PredictPage() {
  const [teamA, setTeamA] = useState(null);
  const [teamB, setTeamB] = useState(null);
  const [stage, setStage] = useState('Group Stage');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const { toast } = useToast();

  async function generate() {
    if (!teamA || !teamB) {
      toast('Pick both teams first', 'error');
      return;
    }
    if (teamA === teamB) {
      toast('Choose two different teams', 'error');
      return;
    }
    setLoading(true);
    setResult(null);
    try {
      const res = await fetch('/api/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ teamAId: teamA, teamBId: teamB, stage }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setResult(data);
      toast('Prediction ready', 'success');
    } catch (e) {
      toast('Prediction failed — try again', 'error');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <h1 className="text-3xl font-bold sm:text-hero">
          World Cup 2026 Match <span className="gold-text">Predictor</span>
        </h1>
        <p className="mt-1 text-text-secondary">Pick two teams. Real data analysis breaks down the matchup and calls it.</p>
      </motion.div>

      <div className="grid gap-6 lg:grid-cols-[420px_1fr]">
        {/* LEFT: setup */}
        <div className="card h-fit p-5 lg:sticky lg:top-20">
          <h2 className="mb-4 text-cardtitle font-semibold">Match Setup</h2>
          <div className="space-y-4">
            <TeamSelector label="Home Team" value={teamA} onChange={setTeamA} exclude={teamB} />

            <div className="flex items-center justify-center">
              <motion.div
                animate={{ scale: [1, 1.15, 1] }}
                transition={{ duration: 1.4, repeat: Infinity }}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-gold/30 bg-gold/10"
              >
                <Zap size={18} className="bolt-flash text-gold" />
              </motion.div>
            </div>

            <TeamSelector label="Away Team" value={teamB} onChange={setTeamB} exclude={teamA} />

            <div>
              <label className="mb-2 block text-[11px] font-semibold uppercase tracking-wide text-text-secondary">
                Stage
              </label>
              <div className="flex flex-wrap gap-2">
                {STAGES.map((s) => (
                  <button
                    key={s}
                    onClick={() => setStage(s)}
                    className={`rounded-full px-3 py-1.5 text-xs font-medium transition-all ${
                      stage === s
                        ? 'gold-gradient text-bg-primary'
                        : 'border border-subtle bg-bg-elevated text-text-secondary hover:text-text-primary'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={generate}
              disabled={loading}
              className={`relative flex w-full items-center justify-center gap-2 overflow-hidden rounded-xl py-3.5 font-bold text-bg-primary transition-transform active:scale-[0.98] ${
                loading ? 'opacity-90' : 'hover:scale-[1.02]'
              } gold-gradient ${loading ? 'animate-pulse' : ''}`}
            >
              {loading ? <Loader2 size={18} className="animate-spin" /> : <Sparkles size={18} />}
              {loading ? 'Analysing…' : 'Generate Prediction'}
            </button>
          </div>
        </div>

        {/* RIGHT: results */}
        <div>
          {loading && <SkeletonCard />}
          {!loading && result && <PredictionResult result={result} />}
          {!loading && !result && (
            <div className="flex h-full min-h-[400px] flex-col items-center justify-center rounded-2xl border border-dashed border-subtle text-center">
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity }}
                className="mb-4 text-6xl"
              >
                🔮
              </motion.div>
              <h3 className="text-cardtitle font-semibold">Your prediction will appear here</h3>
              <p className="mt-1 max-w-sm text-sm text-text-secondary">
                Select a home and away team, choose the stage, and we'll break down probabilities,
                team strengths, and tactics.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
