'use client';

export default function LiveBadge({ minute, className = '' }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full bg-accent-red/15 px-2.5 py-1 ${className}`}
    >
      <span className="relative flex h-2 w-2">
        <span className="absolute inline-flex h-full w-full rounded-full bg-accent-red opacity-75 animate-live-pulse" />
        <span className="relative inline-flex h-2 w-2 rounded-full bg-accent-red" />
      </span>
      <span className="text-[11px] font-bold uppercase tracking-wider text-accent-red">
        Live{minute != null ? ` ${minute}'` : ''}
      </span>
    </span>
  );
}
