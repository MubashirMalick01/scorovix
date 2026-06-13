'use client';

import { formatTime } from '@/lib/utils';
import Flag from '@/components/ui/Flag';

function Item({ m }) {
  const live = m.status === 'LIVE';
  return (
    <span className="mx-5 inline-flex shrink-0 items-center gap-2 text-sm">
      <Flag team={m.home} size={20} />
      <span className="font-medium text-text-primary">{m.home.name}</span>
      <span className={`tabular font-bold ${live ? 'gold-text' : 'text-text-primary'}`}>
        {m.status === 'NS' ? formatTime(m.kickoff) : `${m.goalsHome ?? 0} - ${m.goalsAway ?? 0}`}
      </span>
      <span className="font-medium text-text-primary">{m.away.name}</span>
      <Flag team={m.away} size={20} />
      {live ? (
        <span className="ml-1 rounded bg-accent-red/20 px-1.5 py-0.5 text-[10px] font-bold text-accent-red">
          {m.minute}'
        </span>
      ) : (
        <span className="ml-1 text-[11px] text-text-secondary">{m.round}</span>
      )}
      <span className="ml-3 text-text-secondary/40">•</span>
    </span>
  );
}

export default function Ticker({ matches = [] }) {
  if (!matches.length) return null;
  const doubled = [...matches, ...matches];
  return (
    <div className="relative overflow-hidden border-y border-subtle bg-bg-card py-2.5">
      <div className="flex w-max animate-ticker pause-on-hover whitespace-nowrap">
        {doubled.map((m, i) => (
          <Item key={i} m={m} />
        ))}
      </div>
      <div className="pointer-events-none absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-bg-card to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-bg-card to-transparent" />
    </div>
  );
}
