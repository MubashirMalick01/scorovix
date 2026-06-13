'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Loader2, RefreshCw, Radio, Sparkles } from 'lucide-react';
import LiveMatchCard from '@/components/sections/LiveMatchCard';
import CountdownTimer from '@/components/ui/CountdownTimer';
import ProbabilityBar from '@/components/ui/ProbabilityBar';
import ResultCard from '@/components/sections/ResultCard';
import { SkeletonCard } from '@/components/ui/SkeletonLoader';
import { useToast } from '@/components/ui/Toast';
import Flag from '@/components/ui/Flag';
import { formatTime, formatDate, WC_START } from '@/lib/utils';

const REFRESH_MS = 30000; // live data refresh every 30 seconds

function FreshnessDot({ ageSec }) {
  // green < 30s, orange 30–60s, red > 60s
  const color = ageSec == null ? 'bg-text-secondary' : ageSec < 30 ? 'bg-accent-green' : ageSec <= 60 ? 'bg-orange-400' : 'bg-accent-red';
  const fresh = ageSec != null && ageSec < 30;
  return (
    <span className="relative flex h-2.5 w-2.5">
      {fresh && <span className={`absolute inline-flex h-full w-full rounded-full ${color} opacity-75 animate-live-pulse`} />}
      <span className={`relative inline-flex h-2.5 w-2.5 rounded-full ${color}`} />
    </span>
  );
}

export default function LivePage() {
  const [matches, setMatches] = useState([]);
  const [upcoming, setUpcoming] = useState([]);
  const [recent, setRecent] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [, force] = useState(0); // drives the "x seconds ago" ticker
  const { toast } = useToast();
  const didInit = useRef(false);

  const load = useCallback(async (manual) => {
    setRefreshing(true);
    try {
      const res = await fetch('/api/live', { cache: 'no-store' });
      const data = await res.json();
      setMatches(data.matches || []);
      setLastUpdated(Date.now());

      // When nothing is live, surface upcoming fixtures + recent results.
      if (!data.matches?.length) {
        const [fx, rs] = await Promise.all([
          fetch('/api/fixtures'),
          fetch('/api/results'),
        ]);
        const fd = await fx.json();
        const rd = await rs.json();
        setUpcoming((fd.matches || []).filter((m) => m.status === 'NS'));
        setRecent((rd.matches || []).slice(0, 3));
      }
      if (manual) toast('Live data refreshed', 'info');
    } catch {
      if (manual) toast('Refresh failed', 'error');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [toast]);

  // Auto-refresh every 30s — updates state only, never reloads the page.
  useEffect(() => {
    if (didInit.current) return;
    didInit.current = true;
    load(false);
    const id = setInterval(() => load(false), REFRESH_MS);
    return () => clearInterval(id);
  }, [load]);

  // "x seconds ago" counter ticks every second.
  useEffect(() => {
    const id = setInterval(() => force((n) => n + 1), 1000);
    return () => clearInterval(id);
  }, []);

  const ageSec = lastUpdated ? Math.floor((Date.now() - lastUpdated) / 1000) : null;
  const nextMatch = upcoming[0];
  const nextKickoff = nextMatch?.kickoff || WC_START;
  const todayUpcoming = upcoming.slice(0, 4);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <div className="mb-6 flex items-center justify-between gap-3">
        <div>
          <h1 className="flex items-center gap-2 text-3xl font-bold sm:text-hero">
            <Radio className="text-accent-red" /> Live World Cup <span className="gold-text">2026</span> Scores
          </h1>
          <p className="mt-1 text-text-secondary">Real-time scores, stats and in-play predictions.</p>
        </div>
        <div className="flex flex-col items-end gap-2">
          <button
            onClick={() => load(true)}
            disabled={refreshing}
            className="flex items-center gap-2 rounded-xl border border-subtle bg-bg-elevated px-4 py-2 text-sm font-medium transition-colors hover:border-gold/40 disabled:opacity-50"
          >
            {refreshing ? <Loader2 size={15} className="animate-spin" /> : <RefreshCw size={15} />}
            {refreshing ? 'Refreshing…' : 'Refresh'}
          </button>
          <span className="flex items-center gap-1.5 text-[11px] text-text-secondary">
            <FreshnessDot ageSec={ageSec} />
            {ageSec == null ? 'Connecting…' : `Last updated ${ageSec}s ago`}
          </span>
        </div>
      </div>

      {loading ? (
        <div className="space-y-6">
          <SkeletonCard />
          <SkeletonCard />
        </div>
      ) : matches.length > 0 ? (
        <div className="grid gap-6">
          {matches.map((m) => (
            <LiveMatchCard key={m.id} match={m} />
          ))}
        </div>
      ) : (
        <div className="space-y-10">
          {/* No live matches → countdown to the next match */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="card flex flex-col items-center gap-5 p-8 text-center"
          >
            <span className="rounded-full bg-bg-elevated px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-text-secondary">
              No matches live right now
            </span>
            <h2 className="text-section font-semibold">
              {nextMatch ? (
                <span className="inline-flex flex-wrap items-center justify-center gap-2">
                  Next kickoff: <Flag team={nextMatch.home} size={24} /> {nextMatch.home.name} vs {nextMatch.away.name} <Flag team={nextMatch.away} size={24} />
                </span>
              ) : (
                'Countdown to the next match'
              )}
            </h2>
            <CountdownTimer target={nextKickoff} />
            {nextMatch && (
              <span className="text-sm text-text-secondary">
                Kickoff {formatDate(nextMatch.kickoff)} at {formatTime(nextMatch.kickoff)}
              </span>
            )}
          </motion.div>

          {/* Today's upcoming fixtures with kick-off times */}
          {todayUpcoming.length > 0 && (
            <section>
              <div className="mb-4 flex items-center gap-2">
                <Sparkles size={18} className="text-gold" />
                <h2 className="text-section font-semibold">Upcoming Fixtures</h2>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                {todayUpcoming.map((m, i) => (
                  <PreMatchCard key={m.id} match={m} delay={i * 0.08} />
                ))}
              </div>
            </section>
          )}

          {/* Last 3 results */}
          {recent.length > 0 && (
            <section>
              <div className="mb-4 flex items-center gap-2">
                <Radio size={18} className="text-text-secondary" />
                <h2 className="text-section font-semibold">Latest Results</h2>
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {recent.map((m) => (
                  <ResultCard key={m.id} match={m} />
                ))}
              </div>
            </section>
          )}
        </div>
      )}
    </div>
  );
}

function PreMatchCard({ match, delay }) {
  const [pred, setPred] = useState(null);
  useEffect(() => {
    let active = true;
    fetch('/api/predict', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ teamAId: match.home.uid, teamBId: match.away.uid, stage: 'Group Stage' }),
    })
      .then((r) => r.json())
      .then((d) => active && !d.error && setPred(d.prediction))
      .catch(() => {});
    return () => {
      active = false;
    };
  }, [match]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      whileHover={{ scale: 1.02 }}
      className="card p-4"
    >
      <div className="mb-3 flex items-center justify-between text-[11px] text-text-secondary">
        <span>{match.round}</span>
        <span>{formatDate(match.kickoff)} · {formatTime(match.kickoff)}</span>
      </div>
      <div className="mb-3 flex items-center justify-between">
        <span className="flex items-center gap-2 font-semibold">
          <Flag team={match.home} size={26} /> {match.home.name}
        </span>
        <span className="flex items-center gap-2 font-semibold">
          {match.away.name} <Flag team={match.away} size={26} />
        </span>
      </div>
      {pred ? (
        <ProbabilityBar winA={pred.winA} draw={pred.draw} winB={pred.winB} labelA={match.home.name} labelB={match.away.name} />
      ) : (
        <div className="flex items-center gap-2 py-2 text-xs text-text-secondary">
          <Loader2 size={13} className="animate-spin" /> Analysing…
        </div>
      )}
      <Link href="/predict" className="mt-3 inline-block text-xs font-semibold text-gold">
        Full analysis →
      </Link>
    </motion.div>
  );
}
