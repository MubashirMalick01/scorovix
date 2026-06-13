'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Trophy, Radio, Sparkles, ArrowRight, Loader2, Clock } from 'lucide-react';
import Particles from '@/components/ui/Particles';
import Ticker from '@/components/layout/Ticker';
import ProbabilityBar from '@/components/ui/ProbabilityBar';
import AnimatedNumber from '@/components/ui/AnimatedNumber';
import { Skeleton } from '@/components/ui/SkeletonLoader';
import Flag from '@/components/ui/Flag';
import { formatTime, formatDate } from '@/lib/utils';

// Static tournament facts — no API call needed.
const STATS = [
  { value: 48, label: 'Teams' },
  { value: 104, label: 'Matches' },
  { value: 16, label: 'Cities' },
  { value: 1, label: 'Champion' },
];

export default function HomeClient() {
  const [fixtures, setFixtures] = useState([]);
  const [nextMatch, setNextMatch] = useState(null);
  const [recent, setRecent] = useState([]);
  const [loading, setLoading] = useState(true);

  // Featured prediction is generated ONLY when the user asks for it —
  // never auto-generated on page load (keeps the home page fast).
  const [prediction, setPrediction] = useState(null);
  const [loadingPred, setLoadingPred] = useState(false);

  useEffect(() => {
    // Non-critical data fetched after paint; no blocking prediction call.
    let active = true;
    async function load() {
      try {
        const [fxRes, resRes] = await Promise.all([
          fetch('/api/fixtures'),
          fetch('/api/results'),
        ]);
        const fx = await fxRes.json();
        const rs = await resRes.json();
        if (!active) return;
        const matches = fx.matches || [];
        setFixtures(matches);
        setNextMatch(
          matches.find((m) => m.status === 'LIVE') ||
            matches.find((m) => m.status === 'NS') ||
            matches[0] ||
            null
        );
        setRecent((rs.matches || []).slice(0, 3));
      } catch {
        /* graceful */
      } finally {
        if (active) setLoading(false);
      }
    }
    load();
    return () => {
      active = false;
    };
  }, []);

  async function viewPrediction() {
    if (!nextMatch) return;
    setLoadingPred(true);
    try {
      const res = await fetch('/api/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ teamAId: nextMatch.home.uid, teamBId: nextMatch.away.uid, stage: 'Group Stage' }),
      });
      const data = await res.json();
      if (!data.error) setPrediction(data);
    } catch {
      /* graceful */
    } finally {
      setLoadingPred(false);
    }
  }

  return (
    <div>
      {/* HERO */}
      <section className="relative overflow-hidden border-b border-subtle">
        <Particles />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-bg-primary" />
        <div className="relative mx-auto max-w-7xl px-4 py-20 text-center sm:px-6 sm:py-28">
          <motion.div
            initial={{ scale: 0, rotate: -20 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring', stiffness: 200, damping: 14 }}
            className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-3xl gold-gradient shadow-gold-glow-lg"
          >
            <motion.div animate={{ y: [0, -6, 0] }} transition={{ duration: 2.5, repeat: Infinity }}>
              <Trophy size={40} className="text-bg-primary" />
            </motion.div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl font-bold leading-tight sm:text-6xl"
          >
            FIFA World Cup <span className="gold-text">2026</span> Predictions
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mx-auto mt-4 max-w-xl text-lg text-text-secondary"
          >
            Free predictions, live scores and real-time match analysis for all 48 teams and 104 matches.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row"
          >
            <Link
              href="/live"
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-accent-red/40 bg-accent-red/10 px-6 py-3 font-bold text-accent-red transition-transform hover:scale-105 active:scale-95 sm:w-auto"
            >
              <Radio size={18} /> Live Matches
            </Link>
            <Link
              href="/predict"
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl gold-gradient px-6 py-3 font-bold text-bg-primary transition-transform hover:scale-105 active:scale-95 sm:w-auto"
            >
              <Sparkles size={18} /> Predict a Match
            </Link>
          </motion.div>
        </div>
      </section>

      {/* LIVE TICKER */}
      {loading ? <Skeleton className="h-12 w-full" /> : <Ticker matches={fixtures} />}

      <div className="mx-auto max-w-7xl space-y-14 px-4 py-12 sm:px-6">
        {/* FEATURED / NEXT MATCH */}
        <section>
          <SectionTitle title="Next Featured Match" />
          {loading ? (
            <Skeleton className="h-56 w-full" />
          ) : nextMatch ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="card overflow-hidden p-6"
            >
              <div className="flex flex-col gap-6 lg:flex-row lg:items-center">
                <div className="flex flex-1 items-center justify-between">
                  <div className="flex flex-col items-center gap-1">
                    <Flag team={nextMatch.home} size={56} />
                    <span className="font-semibold">{nextMatch.home.name}</span>
                  </div>
                  <div className="text-center">
                    {prediction ? (
                      <>
                        <div className="gold-text tabular text-4xl font-bold">
                          {prediction.prediction.scoreA}-{prediction.prediction.scoreB}
                        </div>
                        <div className="text-[11px] uppercase tracking-wide text-text-secondary">Predicted</div>
                      </>
                    ) : (
                      <>
                        <div className="text-text-secondary text-2xl font-bold">vs</div>
                        <div className="mt-1 inline-flex items-center gap-1 text-[11px] uppercase tracking-wide text-text-secondary">
                          <Clock size={11} /> {formatDate(nextMatch.kickoff)} · {formatTime(nextMatch.kickoff)}
                        </div>
                      </>
                    )}
                  </div>
                  <div className="flex flex-col items-center gap-1">
                    <Flag team={nextMatch.away} size={56} />
                    <span className="font-semibold">{nextMatch.away.name}</span>
                  </div>
                </div>
                <div className="flex-1">
                  {prediction ? (
                    <>
                      <ProbabilityBar
                        winA={prediction.prediction.winA}
                        draw={prediction.prediction.draw}
                        winB={prediction.prediction.winB}
                        labelA={nextMatch.home.name}
                        labelB={nextMatch.away.name}
                      />
                      <p className="mt-3 line-clamp-2 text-sm text-text-secondary">{prediction.prediction.analysis}</p>
                      <Link
                        href="/predict"
                        className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-gold transition-all hover:gap-2"
                      >
                        Full breakdown <ArrowRight size={15} />
                      </Link>
                    </>
                  ) : (
                    <div className="flex flex-col items-start gap-3">
                      <p className="text-sm text-text-secondary">
                        {nextMatch.round || 'Group Stage'} · {nextMatch.venue || 'FIFA World Cup 2026'}
                      </p>
                      <button
                        onClick={viewPrediction}
                        disabled={loadingPred}
                        className="inline-flex items-center gap-2 rounded-xl gold-gradient px-5 py-2.5 text-sm font-bold text-bg-primary transition-transform hover:scale-105 active:scale-95 disabled:opacity-80"
                      >
                        {loadingPred ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} />}
                        {loadingPred ? 'Analysing…' : 'View Prediction'}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ) : (
            <EmptyState text="No upcoming match scheduled right now." />
          )}
        </section>

        {/* STATS STRIP (static) */}
        <section className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {STATS.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="card flex flex-col items-center py-8"
            >
              <span className="gold-text text-4xl font-bold sm:text-5xl">
                <AnimatedNumber value={s.value} />
              </span>
              <span className="mt-1 text-sm uppercase tracking-wide text-text-secondary">{s.label}</span>
            </motion.div>
          ))}
        </section>

        {/* RECENT RESULTS */}
        <section>
          <SectionTitle title="Recent Results" />
          {loading ? (
            <div className="space-y-2">
              {[0, 1, 2].map((i) => (
                <Skeleton key={i} className="h-14 w-full" />
              ))}
            </div>
          ) : recent.length ? (
            <div className="space-y-2">
              {recent.map((m, i) => (
                <motion.div
                  key={m.id || i}
                  initial={{ opacity: 0, x: -16 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                  className="card flex items-center justify-between px-4 py-3 text-sm"
                >
                  <span className="flex items-center gap-2">
                    <Flag team={m.home} size={20} /> {m.home.name}
                    <span className="tabular font-bold gold-text">
                      {m.goalsHome}-{m.goalsAway}
                    </span>
                    {m.away.name} <Flag team={m.away} size={20} />
                  </span>
                  <span className="hidden text-text-secondary sm:inline">{m.round || 'Group Stage'}</span>
                </motion.div>
              ))}
            </div>
          ) : (
            <EmptyState text="No completed matches yet — check back after kickoff." />
          )}
        </section>
      </div>
    </div>
  );
}

function SectionTitle({ title }) {
  return (
    <div className="mb-5 flex items-center gap-2">
      <span className="h-5 w-1 rounded-full gold-gradient" />
      <h2 className="text-section font-semibold">{title}</h2>
    </div>
  );
}

function EmptyState({ text }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-subtle py-12 text-center text-text-secondary">
      <span className="mb-2 text-4xl">⚽</span>
      {text}
    </div>
  );
}
