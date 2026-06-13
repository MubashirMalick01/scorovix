'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronDown, RefreshCw, Loader2, Brain } from 'lucide-react';
import LiveBadge from '@/components/ui/LiveBadge';
import ScoreCard from '@/components/ui/ScoreCard';
import StatRow from '@/components/ui/StatRow';
import MomentumMeter from '@/components/ui/MomentumMeter';
import ProbabilityBar from '@/components/ui/ProbabilityBar';
import Typewriter from '@/components/ui/Typewriter';

const EVENT_ICON = (e) => {
  if (e.type === 'Goal') return '⚽';
  if (e.type === 'Card') return e.detail === 'Red Card' ? '🟥' : '🟨';
  if (e.type === 'subst') return '🔄';
  return '•';
};

// Match is paused for prediction purposes at half-time or once finished.
const isPaused = (m) => m.statusShort === 'HT' || m.status === 'FT';

export default function LiveMatchCard({ match }) {
  const [expanded, setExpanded] = useState(true);
  const [prediction, setPrediction] = useState(null);
  const [loadingPred, setLoadingPred] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [cooldown, setCooldown] = useState(0);
  const [nextIn, setNextIn] = useState(60);
  const cooldownRef = useRef(null);

  const fetchPrediction = useCallback(async () => {
    setLoadingPred(true);
    try {
      const res = await fetch('/api/live-prediction', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fixtureId: match.id, matchData: match }),
      });
      const data = await res.json();
      if (data.prediction) {
        setPrediction(data.prediction);
        setLastUpdated(Date.now());
      }
    } catch {
      /* keep prior prediction */
    } finally {
      setLoadingPred(false);
      setNextIn(60);
    }
  }, [match]);

  // Initial prediction + automatic refresh every 60s.
  // Do NOT refresh while the match is at half-time or finished.
  useEffect(() => {
    fetchPrediction();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [match.id]);

  useEffect(() => {
    if (isPaused(match)) return;
    const id = setInterval(() => {
      setNextIn((n) => {
        if (n <= 1) {
          fetchPrediction();
          return 60;
        }
        return n - 1;
      });
    }, 1000);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [match.id, match.statusShort, match.status]);

  // "x seconds ago" ticker
  const [, force] = useState(0);
  useEffect(() => {
    const id = setInterval(() => force((n) => n + 1), 1000);
    return () => clearInterval(id);
  }, []);

  function startCooldown() {
    setCooldown(60);
    clearInterval(cooldownRef.current);
    cooldownRef.current = setInterval(() => {
      setCooldown((c) => {
        if (c <= 1) {
          clearInterval(cooldownRef.current);
          return 0;
        }
        return c - 1;
      });
    }, 1000);
  }

  function manualRefresh() {
    if (cooldown > 0) return;
    fetchPrediction();
    startCooldown();
  }

  const agoSec = lastUpdated ? Math.floor((Date.now() - lastUpdated) / 1000) : null;
  const stats = match.stats || {};

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="card overflow-hidden"
    >
      {/* Top bar */}
      <div className="flex items-center justify-between border-b border-subtle px-4 py-2.5">
        <span className="text-[11px] font-medium text-text-secondary">{match.round || 'FIFA World Cup 2026'}</span>
        <LiveBadge minute={match.minute} />
      </div>

      {/* Score */}
      <div className="px-4 py-5">
        <ScoreCard
          home={match.home}
          away={match.away}
          goalsHome={match.goalsHome}
          goalsAway={match.goalsAway}
          minute={match.minute}
          status="LIVE"
        />
      </div>

      <div className="grid gap-4 px-4 pb-4 lg:grid-cols-[1.4fr_1fr]">
        {/* LEFT: stats + prediction */}
        <div className="space-y-4">
          {/* Live stats (expandable) */}
          <div className="rounded-xl border border-subtle bg-bg-elevated/50">
            <button
              onClick={() => setExpanded((e) => !e)}
              className="flex w-full items-center justify-between px-4 py-2.5 text-sm font-semibold"
            >
              <span>Live Match Stats</span>
              <ChevronDown size={16} className={`text-text-secondary transition-transform ${expanded ? 'rotate-180' : ''}`} />
            </button>
            <AnimatePresence>
              {expanded && stats.possession && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <div className="space-y-1 px-4 pb-4">
                    <StatRow label="Possession" home={stats.possession[0]} away={stats.possession[1]} suffix="%" />
                    <StatRow label="Shots on Target" home={stats.shotsOnTarget[0]} away={stats.shotsOnTarget[1]} />
                    <StatRow label="Total Shots" home={stats.shotsTotal[0]} away={stats.shotsTotal[1]} />
                    <StatRow label="Corners" home={stats.corners[0]} away={stats.corners[1]} />
                    <StatRow label="Fouls" home={stats.fouls[0]} away={stats.fouls[1]} />
                    <StatRow label="Yellow Cards" home={stats.yellow[0]} away={stats.yellow[1]} />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Live prediction panel */}
          <div className="rounded-xl border border-gold/20 bg-bg-elevated/60 p-4" style={{ borderLeft: '3px solid #ffd700' }}>
            <div className="mb-3 flex items-center justify-between">
              <span className="flex items-center gap-2 text-sm font-semibold text-gold">
                <Brain size={15} className="animate-spin-slow" /> Live Prediction
              </span>
              <div className="flex items-center gap-2">
                {!isPaused(match) && (
                  <span className="tabular text-[10px] text-text-secondary">Next prediction in {nextIn}s</span>
                )}
                <button
                  onClick={manualRefresh}
                  disabled={cooldown > 0 || loadingPred}
                  className="flex items-center gap-1.5 rounded-lg border border-subtle px-2.5 py-1 text-[11px] font-medium text-text-secondary transition-colors hover:text-gold disabled:opacity-40"
                >
                  {loadingPred ? <Loader2 size={12} className="animate-spin" /> : <RefreshCw size={12} />}
                  {cooldown > 0 ? `${cooldown}s` : 'Refresh'}
                </button>
              </div>
            </div>
            {isPaused(match) && (
              <div className="mb-3 rounded-lg bg-bg-card px-3 py-1.5 text-center text-[10px] uppercase tracking-wide text-text-secondary">
                {match.status === 'FT' ? 'Full time — prediction paused' : 'Half time — prediction paused'}
              </div>
            )}

            {!prediction ? (
              <div className="flex items-center justify-center gap-2 py-6 text-sm text-text-secondary">
                <Loader2 size={15} className="animate-spin" /> Generating live prediction…
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <div className="mb-1.5 text-[11px] uppercase tracking-wide text-text-secondary">Next goal probability</div>
                  <ProbabilityBar
                    winA={prediction.nextGoalHome}
                    draw={prediction.noMoreGoals}
                    winB={prediction.nextGoalAway}
                    labelA={match.home.name}
                    labelB={match.away.name}
                  />
                  <div className="mt-1 text-center text-[10px] uppercase tracking-wide text-text-secondary">
                    Middle: no more goals
                  </div>
                </div>

                <div className="flex items-center justify-between rounded-lg bg-bg-card px-3 py-2">
                  <span className="text-[11px] uppercase tracking-wide text-text-secondary">Predicted final</span>
                  <span className="gold-text tabular text-lg font-bold">{prediction.predictedFinal}</span>
                </div>

                <MomentumMeter
                  score={prediction.momentum === 'home' ? prediction.momentumScore : prediction.momentum === 'away' ? 100 - prediction.momentumScore : 50}
                  home={match.home.name}
                  away={match.away.name}
                />

                <div className="rounded-lg bg-bg-card p-3">
                  <p className="text-sm italic text-text-primary">
                    <Typewriter text={prediction.insight} speed={22} />
                  </p>
                </div>

                <div className="flex items-center justify-between text-[10px] text-text-secondary">
                  <span>Danger: {prediction.dangerZone}</span>
                </div>

                <div className="flex items-center justify-between border-t border-subtle pt-2 text-[10px] text-text-secondary">
                  <span className="inline-flex items-center gap-1 text-gold">
                    <Brain size={10} /> SCOROVIX
                  </span>
                  <span>Updated {agoSec != null ? `${agoSec}s ago` : 'just now'}</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT: events timeline */}
        <div className="rounded-xl border border-subtle bg-bg-elevated/50 p-4">
          <div className="mb-3 text-sm font-semibold">Match Events</div>
          <div className="max-h-[420px] space-y-2 overflow-y-auto pr-1">
            {(match.events || []).length === 0 && (
              <div className="py-6 text-center text-xs text-text-secondary">
                Match events will appear here as they happen
              </div>
            )}
            {(match.events || [])
              .slice()
              .reverse()
              .map((e, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.03 }}
                  className="flex items-center gap-2 rounded-lg bg-bg-card px-2.5 py-1.5 text-sm"
                >
                  <span className="tabular w-7 text-[11px] font-bold text-text-secondary">{e.minute}'</span>
                  <span className="text-base">{EVENT_ICON(e)}</span>
                  <span className="flex-1 truncate text-text-primary">{e.player || e.detail}</span>
                  <span className="truncate text-[10px] text-text-secondary">{e.team}</span>
                </motion.div>
              ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
