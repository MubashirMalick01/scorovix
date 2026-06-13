'use client';

import { useState } from 'react';

// Renders a country flag as an image (works on every OS, unlike flag emoji
// which Windows/Chrome render as plain letter codes). Falls back to the
// emoji, then to a white-flag glyph.
export default function Flag({ team, code, emoji, size = 24, className = '' }) {
  const c = code || team?.code;
  const e = emoji || team?.flag;
  const logo = team?.logo;
  const [errored, setErrored] = useState(false);

  const h = Math.round(size * 0.72);

  // No ISO code (e.g. an API-sourced team) but we have a crest/logo URL.
  if ((!c || errored) && logo) {
    return (
      <img
        src={logo}
        alt={team?.name ? `${team.name}` : ''}
        width={size}
        height={size}
        loading="lazy"
        className={`inline-block object-contain align-middle ${className}`}
        style={{ width: size, height: size }}
      />
    );
  }

  if (!c || errored) {
    return (
      <span
        className={`inline-flex items-center justify-center leading-none ${className}`}
        style={{ width: size, height: h, fontSize: Math.round(size * 0.9) }}
      >
        {e || '🏳️'}
      </span>
    );
  }

  return (
    <img
      src={`https://flagcdn.com/${c}.svg`}
      alt={team?.name ? `${team.name} flag` : ''}
      width={size}
      height={h}
      loading="lazy"
      onError={() => setErrored(true)}
      className={`inline-block rounded-[3px] object-cover align-middle shadow-sm ring-1 ring-white/10 ${className}`}
      style={{ width: size, height: h }}
    />
  );
}
