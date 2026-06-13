'use client';

import { useMemo } from 'react';

// Pure-CSS floating "stadium lights" particle field.
export default function Particles({ count = 28 }) {
  const dots = useMemo(
    () =>
      Array.from({ length: count }).map((_, i) => {
        // deterministic-ish spread without Math.random in render-critical path
        const left = (i * 37) % 100;
        const size = 2 + ((i * 13) % 4);
        const duration = 8 + ((i * 7) % 12);
        const delay = (i * 3) % 14;
        return { left, size, duration, delay, key: i };
      }),
    [count]
  );

  return (
    <div className="particles">
      {dots.map((d) => (
        <span
          key={d.key}
          className="particle"
          style={{
            left: `${d.left}%`,
            bottom: '-10px',
            width: d.size,
            height: d.size,
            animationDuration: `${d.duration}s`,
            animationDelay: `${d.delay}s`,
          }}
        />
      ))}
    </div>
  );
}
