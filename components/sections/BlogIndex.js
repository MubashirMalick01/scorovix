'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Newspaper, Clock, ArrowRight, Calendar } from 'lucide-react';

// Filter label → matching category in the data.
const FILTERS = [
  { label: 'All', match: null },
  { label: 'Match Analysis', match: 'Match Analysis' },
  { label: 'Previews', match: 'Preview' },
  { label: 'Tournament', match: 'Tournament' },
];

function CategoryTag({ category }) {
  return (
    <span className="inline-block rounded-full bg-gold/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-gold">
      {category}
    </span>
  );
}

function PostCard({ post, delay }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-30px' }}
      transition={{ duration: 0.3, delay }}
      className="card flex flex-col p-5"
    >
      <div className="mb-3 flex items-center justify-between">
        <CategoryTag category={post.category} />
        <span className="inline-flex items-center gap-1 text-[11px] text-text-secondary">
          <Clock size={11} /> {post.readTime}
        </span>
      </div>
      <h3 className="text-cardtitle font-semibold leading-snug text-text-primary">
        <Link href={`/blog/${post.slug}`} className="transition-colors hover:text-gold">
          {post.title}
        </Link>
      </h3>
      <p className="mt-2 line-clamp-3 flex-1 text-sm text-text-secondary">{post.excerpt}</p>
      <div className="mt-4 flex items-center justify-between">
        <span className="inline-flex items-center gap-1 text-[11px] text-text-secondary">
          <Calendar size={11} /> {post.date}
        </span>
        <Link
          href={`/blog/${post.slug}`}
          className="inline-flex items-center gap-1 text-sm font-semibold text-gold transition-all hover:gap-2"
        >
          Read Article <ArrowRight size={14} />
        </Link>
      </div>
    </motion.div>
  );
}

export default function BlogIndex({ posts, featured }) {
  const [filter, setFilter] = useState('All');

  const active = FILTERS.find((f) => f.label === filter);
  const grid = useMemo(() => {
    const rest = posts.filter((p) => p.slug !== featured?.slug);
    if (!active || !active.match) return rest;
    return rest.filter((p) => p.category === active.match);
  }, [posts, featured, active]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <h1 className="mb-1 flex items-center gap-2 text-3xl font-bold sm:text-hero">
        <Newspaper className="text-gold" /> World Cup 2026 Match Analysis &amp; <span className="gold-text">Predictions</span>
      </h1>
      <p className="mb-8 text-text-secondary">Match reports, previews and tournament analysis for the FIFA World Cup 2026.</p>

      {/* Featured post */}
      {featured && (
        <Link href={`/blog/${featured.slug}`} className="group mb-10 block">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="card overflow-hidden p-6 sm:p-8"
          >
            <div className="mb-3 flex items-center gap-3">
              <CategoryTag category={featured.category} />
              <span className="text-[11px] uppercase tracking-wide text-gold">Featured</span>
            </div>
            <h2 className="text-2xl font-bold leading-tight text-text-primary transition-colors group-hover:text-gold sm:text-3xl">
              {featured.title}
            </h2>
            <p className="mt-3 max-w-3xl text-text-secondary">{featured.excerpt}</p>
            <div className="mt-4 flex items-center gap-4 text-[12px] text-text-secondary">
              <span className="inline-flex items-center gap-1"><Calendar size={12} /> {featured.date}</span>
              <span className="inline-flex items-center gap-1"><Clock size={12} /> {featured.readTime}</span>
              <span className="inline-flex items-center gap-1 font-semibold text-gold">
                Read Article <ArrowRight size={14} />
              </span>
            </div>
          </motion.div>
        </Link>
      )}

      {/* Filters */}
      <div className="mb-6 flex flex-wrap gap-2">
        {FILTERS.map((f) => (
          <button
            key={f.label}
            onClick={() => setFilter(f.label)}
            className={`rounded-full px-3.5 py-1.5 text-xs font-medium transition-all ${
              filter === f.label
                ? 'gold-gradient text-bg-primary'
                : 'border border-subtle bg-bg-elevated text-text-secondary hover:text-text-primary'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Grid */}
      {grid.length ? (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
          {grid.map((p, i) => (
            <PostCard key={p.slug} post={p} delay={i * 0.05} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-subtle py-16 text-center text-text-secondary">
          <span className="mb-2 text-4xl">📝</span>
          No articles in this category yet.
        </div>
      )}
    </div>
  );
}
