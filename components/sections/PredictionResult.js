'use client';

import { motion } from 'framer-motion';
import { Share2, AlertTriangle, Swords } from 'lucide-react';
import ProbabilityBar from '@/components/ui/ProbabilityBar';
import ConfidenceMeter from '@/components/ui/ConfidenceMeter';
import FormBadge from '@/components/ui/FormBadge';
import AIInsightCard from '@/components/ui/AIInsightCard';
import AnimatedNumber from '@/components/ui/AnimatedNumber';
import { confidenceToPct } from '@/lib/utils';
import { useToast } from '@/components/ui/Toast';
import Flag from '@/components/ui/Flag';

function CompareRow({ label, a, b, highlight }) {
  return (
    <div className="grid grid-cols-3 items-center gap-2 py-2 text-sm">
      <span className={`text-left font-semibold tabular ${highlight === 'a' ? 'text-gold' : 'text-text-primary'}`}>{a}</span>
      <span className="text-center text-[11px] uppercase tracking-wide text-text-secondary">{label}</span>
      <span className={`text-right font-semibold tabular ${highlight === 'b' ? 'text-accent-blue' : 'text-text-primary'}`}>{b}</span>
    </div>
  );
}

export default function PredictionResult({ result }) {
  const { toast } = useToast();
  const { teamA, teamB, dataA, dataB, h2h, prediction: p } = result;

  function share() {
    const text = `🏆 Scorovix — ${teamA.name} vs ${teamB.name}
${teamA.name} ${p.winA}% | Draw ${p.draw}% | ${teamB.name} ${p.winB}%
Predicted score: ${p.scoreA}-${p.scoreB}
Confidence: ${confidenceToPct(p.confidence)}%
${p.analysis}`;
    navigator.clipboard?.writeText(text).then(
      () => toast('Prediction copied to clipboard', 'success'),
      () => toast('Could not copy', 'error')
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-5"
    >
      {/* Header */}
      <div className="card p-5">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Flag team={teamA} size={40} />
            <div>
              <div className="font-bold text-text-primary">{teamA.name}</div>
              <div className="text-[11px] text-text-secondary">FIFA #{teamA.rank}</div>
            </div>
          </div>
          <ConfidenceMeter value={confidenceToPct(p.confidence)} size={96} />
          <div className="flex items-center gap-3">
            <div className="text-right">
              <div className="font-bold text-text-primary">{teamB.name}</div>
              <div className="text-[11px] text-text-secondary">FIFA #{teamB.rank}</div>
            </div>
            <Flag team={teamB} size={40} />
          </div>
        </div>

        {/* Predicted score */}
        <div className="my-5 flex items-center justify-center gap-4">
          <span className="gold-text tabular text-5xl font-bold">
            <AnimatedNumber value={p.scoreA} duration={0.8} />
          </span>
          <span className="text-3xl text-text-secondary">-</span>
          <span className="gold-text tabular text-5xl font-bold">
            <AnimatedNumber value={p.scoreB} duration={0.8} />
          </span>
        </div>

        <ProbabilityBar winA={p.winA} draw={p.draw} winB={p.winB} labelA={teamA.name} labelB={teamB.name} />
      </div>

      {/* Comparison */}
      <div className="card p-5">
        <h3 className="mb-2 flex items-center gap-2 text-cardtitle font-semibold">
          <Swords size={16} className="text-gold" /> Head to Head
        </h3>
        <CompareRow label="FIFA Rank" a={`#${teamA.rank}`} b={`#${teamB.rank}`} highlight={teamA.rank < teamB.rank ? 'a' : 'b'} />
        <div className="grid grid-cols-3 items-center gap-2 py-2">
          <div className="flex justify-start"><FormBadge form={dataA.form} matches={dataA.matches} /></div>
          <span className="text-center text-[11px] uppercase tracking-wide text-text-secondary">Form (L5)</span>
          <div className="flex justify-end"><FormBadge form={dataB.form} matches={dataB.matches} /></div>
        </div>
        <CompareRow label="Goals For (L5)" a={dataA.goalsFor} b={dataB.goalsFor} highlight={dataA.goalsFor > dataB.goalsFor ? 'a' : 'b'} />
        <CompareRow label="Goals Against (L5)" a={dataA.goalsAgainst} b={dataB.goalsAgainst} highlight={dataA.goalsAgainst < dataB.goalsAgainst ? 'a' : 'b'} />
        <CompareRow label="H2H Wins (L10)" a={h2h.aWins} b={h2h.bWins} highlight={h2h.aWins > h2h.bWins ? 'a' : 'b'} />
        <div className="mt-1 text-center text-[11px] text-text-secondary">
          {h2h.draws} draw{h2h.draws === 1 ? '' : 's'} in last {h2h.aWins + h2h.bWins + h2h.draws} meetings
        </div>
      </div>

      {/* Tactical analysis */}
      <AIInsightCard title="Tactical Analysis" text={p.analysis} source={p.source}>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <div className="rounded-xl border border-subtle bg-bg-elevated p-3">
            <div className="text-[10px] uppercase tracking-wide text-gold">Team Strength · {teamA.name}</div>
            <div className="mt-0.5 font-semibold tabular text-text-primary">{dataA.strength}/100</div>
            <div className="mt-1 text-xs text-text-secondary">Form {dataA.form.join('')} · {dataA.goalsFor} scored / {dataA.goalsAgainst} conceded (L5)</div>
          </div>
          <div className="rounded-xl border border-subtle bg-bg-elevated p-3">
            <div className="text-[10px] uppercase tracking-wide text-accent-blue">Team Strength · {teamB.name}</div>
            <div className="mt-0.5 font-semibold tabular text-text-primary">{dataB.strength}/100</div>
            <div className="mt-1 text-xs text-text-secondary">Form {dataB.form.join('')} · {dataB.goalsFor} scored / {dataB.goalsAgainst} conceded (L5)</div>
          </div>
        </div>
        <div className="mt-3 rounded-xl border border-subtle bg-bg-elevated p-3">
          <div className="text-[10px] uppercase tracking-wide text-text-secondary">Tactical Note</div>
          <div className="mt-1 text-sm text-text-secondary">{p.tacticalNote}</div>
        </div>
        <div className="mt-3 flex items-start gap-2 rounded-xl border border-accent-red/20 bg-accent-red/5 p-3">
          <AlertTriangle size={15} className="mt-0.5 shrink-0 text-accent-red" />
          <div>
            <div className="text-[10px] uppercase tracking-wide text-accent-red">
              Risk Factor · Upset {p.upsetPossibility}%
            </div>
            <div className="mt-0.5 text-sm text-text-secondary">{p.biggestThreat}</div>
          </div>
        </div>
      </AIInsightCard>

      <button
        onClick={share}
        className="flex w-full items-center justify-center gap-2 rounded-xl border border-subtle bg-bg-elevated py-3 font-semibold text-text-primary transition-all hover:border-gold/40 hover:text-gold active:scale-[0.99]"
      >
        <Share2 size={16} /> Share this prediction
      </button>
    </motion.div>
  );
}
