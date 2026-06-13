// Scorovix brand logo: gold circle with a bold "S", wordmark beside it.
// `compact` renders just the mark (no wordmark) for tight spaces.

export default function Logo({ size = 36, withWordmark = true, className = '' }) {
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
        className="shrink-0"
      >
        <defs>
          <linearGradient id="scorovixGold" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#ffe27a" />
            <stop offset="55%" stopColor="#ffd700" />
            <stop offset="100%" stopColor="#cc9a00" />
          </linearGradient>
        </defs>
        <circle cx="24" cy="24" r="22" fill="url(#scorovixGold)" />
        <circle cx="24" cy="24" r="22" stroke="#cc9a00" strokeOpacity="0.4" strokeWidth="1.5" />
        <text
          x="24"
          y="25"
          textAnchor="middle"
          dominantBaseline="central"
          fontFamily="var(--font-inter), system-ui, sans-serif"
          fontSize="30"
          fontWeight="800"
          fill="#080c18"
        >
          S
        </text>
      </svg>
      {withWordmark && (
        <span className="text-lg font-extrabold tracking-tight text-text-primary">SCOROVIX</span>
      )}
    </span>
  );
}
