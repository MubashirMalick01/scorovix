// Shared helpers used across server routes and components.

export function cn(...parts) {
  return parts.filter(Boolean).join(' ');
}

export function clampPct(n) {
  const v = Math.round(Number(n) || 0);
  return Math.max(0, Math.min(100, v));
}

// Normalize a probability triple to sum exactly 100.
export function normalizeProbs(a, b, c) {
  let x = Math.max(0, Number(a) || 0);
  let y = Math.max(0, Number(b) || 0);
  let z = Math.max(0, Number(c) || 0);
  const sum = x + y + z || 1;
  x = Math.round((x / sum) * 100);
  y = Math.round((y / sum) * 100);
  z = 100 - x - y;
  if (z < 0) {
    x = Math.max(0, x + z);
    z = 0;
  }
  return [x, y, z];
}

export function confidenceLabel(value) {
  if (typeof value === 'string') {
    const map = {
      low: 'Low',
      medium: 'Medium',
      high: 'High',
      very_high: 'Very High',
    };
    return map[value] || 'Medium';
  }
  const n = Number(value) || 0;
  if (n >= 85) return 'Very High';
  if (n >= 65) return 'High';
  if (n >= 45) return 'Medium';
  return 'Low';
}

export function confidenceToPct(value) {
  if (typeof value === 'number') return clampPct(value);
  const map = { low: 35, medium: 58, high: 78, very_high: 92 };
  return map[value] ?? 60;
}

// Deterministic pseudo-random in [0,1) from a seed — used for stable mock data.
export function seeded(seed) {
  let s = 0;
  const str = String(seed);
  for (let i = 0; i < str.length; i++) s = (s * 31 + str.charCodeAt(i)) % 2147483647;
  s = s || 1;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

export function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

export function formatTime(iso) {
  if (!iso) return '';
  try {
    return new Date(iso).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  } catch {
    return '';
  }
}

export function formatDate(iso) {
  if (!iso) return '';
  try {
    return new Date(iso).toLocaleDateString([], { month: 'short', day: 'numeric' });
  } catch {
    return '';
  }
}

// Robustly extract a JSON object from a model text response.
export function extractJSON(text) {
  if (!text) return null;
  // Try direct parse first.
  try {
    return JSON.parse(text);
  } catch {}
  // Strip code fences.
  const fence = text.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (fence) {
    try {
      return JSON.parse(fence[1]);
    } catch {}
  }
  // Grab first {...} block.
  const start = text.indexOf('{');
  const end = text.lastIndexOf('}');
  if (start !== -1 && end !== -1 && end > start) {
    try {
      return JSON.parse(text.slice(start, end + 1));
    } catch {}
  }
  return null;
}

export const STAGES = [
  'Group Stage',
  'Round of 32',
  'Round of 16',
  'Quarter Final',
  'Semi Final',
  'Final',
];

// Tournament kickoff used for countdowns/fallbacks.
export const WC_START = '2026-06-11T16:00:00Z';
