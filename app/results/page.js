'use client';

import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { ListChecks, ChevronLeft, ChevronRight } from 'lucide-react';
import ResultCard from '@/components/sections/ResultCard';
import { SkeletonGrid } from '@/components/ui/SkeletonLoader';
import { GROUPS } from '@/lib/teams';

const PER_PAGE = 6;

export default function ResultsPage() {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');
  const [page, setPage] = useState(1);

  useEffect(() => {
    fetch('/api/results')
      .then((r) => r.json())
      .then((d) => setResults(d.matches || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    const list = filter === 'All' ? results : results.filter((m) => m.group === filter);
    return list;
  }, [results, filter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const current = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <h1 className="mb-1 flex items-center gap-2 text-3xl font-bold sm:text-hero">
        <ListChecks className="text-gold" /> World Cup 2026 <span className="gold-text">Results</span>
      </h1>
      <p className="mb-6 text-text-secondary">Final scores and goal scorers, from live match data.</p>

      <div className="mb-6 flex flex-wrap gap-2">
        {['All', ...GROUPS].map((g) => (
          <button
            key={g}
            onClick={() => {
              setFilter(g);
              setPage(1);
            }}
            className={`rounded-full px-3 py-1.5 text-xs font-medium transition-all ${
              filter === g
                ? 'gold-gradient text-bg-primary'
                : 'border border-subtle bg-bg-elevated text-text-secondary hover:text-text-primary'
            }`}
          >
            {g === 'All' ? 'All Groups' : `Group ${g}`}
          </button>
        ))}
      </div>

      {loading ? (
        <SkeletonGrid count={6} />
      ) : current.length ? (
        <>
          <motion.div layout className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {current.map((m) => (
              <ResultCard key={m.id} match={m} />
            ))}
          </motion.div>

          {totalPages > 1 && (
            <div className="mt-8 flex items-center justify-center gap-3">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-subtle bg-bg-elevated disabled:opacity-40"
              >
                <ChevronLeft size={16} />
              </button>
              <span className="tabular text-sm text-text-secondary">
                Page {page} of {totalPages}
              </span>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-subtle bg-bg-elevated disabled:opacity-40"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          )}
        </>
      ) : (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-subtle py-16 text-center text-text-secondary">
          <span className="mb-2 text-4xl">📋</span>
          No results for this filter yet.
        </div>
      )}
    </div>
  );
}
