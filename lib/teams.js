// FIFA World Cup 2026 — 48 teams across 12 groups (A–L).
//
// CANONICAL_TEAMS is the authoritative qualified-team list used as the source
// of truth and as the fallback when the live API is unavailable. Every entry
// has a UNIQUE `id` (API-Football team id, best-effort) and a UNIQUE `code`
// (ISO-ish, used for the flag CDN). `flag` is an emoji fallback.
//
// fetchTeams() prefers live API-Football data (GET /teams?league=1&season=2026)
// and falls back to CANONICAL_TEAMS so the product always shows all 48 teams,
// including Mexico, Canada, USA, Paraguay, Bosnia and Herzegovina,
// South Africa and Haiti.

export const CANONICAL_TEAMS = [
  // Group A — host Mexico
  { id: 2382, name: 'Mexico', code: 'mx', flag: '🇲🇽', rank: 14, group: 'A' },
  { id: 2385, name: 'Canada', code: 'ca', flag: '🇨🇦', rank: 30, group: 'A' },
  { id: 1531, name: 'South Africa', code: 'za', flag: '🇿🇦', rank: 58, group: 'A' },
  { id: 1532, name: 'Bosnia and Herzegovina', code: 'ba', flag: '🇧🇦', rank: 74, group: 'A' },

  // Group B — host USA
  { id: 2384, name: 'USA', code: 'us', flag: '🇺🇸', rank: 11, group: 'B' },
  { id: 2386, name: 'Paraguay', code: 'py', flag: '🇵🇾', rank: 54, group: 'B' },
  { id: 1, name: 'Belgium', code: 'be', flag: '🇧🇪', rank: 8, group: 'B' },
  { id: 1533, name: 'Haiti', code: 'ht', flag: '🇭🇹', rank: 83, group: 'B' },

  // Group C
  { id: 26, name: 'Argentina', code: 'ar', flag: '🇦🇷', rank: 1, group: 'C' },
  { id: 30, name: 'Australia', code: 'au', flag: '🇦🇺', rank: 25, group: 'C' },
  { id: 24, name: 'Poland', code: 'pl', flag: '🇵🇱', rank: 26, group: 'C' },
  { id: 23, name: 'Saudi Arabia', code: 'sa', flag: '🇸🇦', rank: 56, group: 'C' },

  // Group D
  { id: 2, name: 'France', code: 'fr', flag: '🇫🇷', rank: 2, group: 'D' },
  { id: 21, name: 'Denmark', code: 'dk', flag: '🇩🇰', rank: 19, group: 'D' },
  { id: 28, name: 'Tunisia', code: 'tn', flag: '🇹🇳', rank: 41, group: 'D' },
  { id: 1077, name: 'Peru', code: 'pe', flag: '🇵🇪', rank: 32, group: 'D' },

  // Group E
  { id: 9, name: 'Spain', code: 'es', flag: '🇪🇸', rank: 3, group: 'E' },
  { id: 12, name: 'Japan', code: 'jp', flag: '🇯🇵', rank: 18, group: 'E' },
  { id: 1098, name: 'Costa Rica', code: 'cr', flag: '🇨🇷', rank: 52, group: 'E' },
  { id: 25, name: 'Germany', code: 'de', flag: '🇩🇪', rank: 16, group: 'E' },

  // Group F
  { id: 6, name: 'Brazil', code: 'br', flag: '🇧🇷', rank: 5, group: 'F' },
  { id: 14, name: 'Serbia', code: 'rs', flag: '🇷🇸', rank: 29, group: 'F' },
  { id: 15, name: 'Switzerland', code: 'ch', flag: '🇨🇭', rank: 20, group: 'F' },
  { id: 1530, name: 'Cameroon', code: 'cm', flag: '🇨🇲', rank: 42, group: 'F' },

  // Group G
  { id: 27, name: 'Portugal', code: 'pt', flag: '🇵🇹', rank: 6, group: 'G' },
  { id: 1504, name: 'Ghana', code: 'gh', flag: '🇬🇭', rank: 60, group: 'G' },
  { id: 7, name: 'Uruguay', code: 'uy', flag: '🇺🇾', rank: 15, group: 'G' },
  { id: 17, name: 'South Korea', code: 'kr', flag: '🇰🇷', rank: 23, group: 'G' },

  // Group H
  { id: 10, name: 'England', code: 'gb-eng', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', rank: 4, group: 'H' },
  { id: 13, name: 'Senegal', code: 'sn', flag: '🇸🇳', rank: 17, group: 'H' },
  { id: 1118, name: 'Netherlands', code: 'nl', flag: '🇳🇱', rank: 7, group: 'H' },
  { id: 22, name: 'IR Iran', code: 'ir', flag: '🇮🇷', rank: 22, group: 'H' },

  // Group I
  { id: 768, name: 'Italy', code: 'it', flag: '🇮🇹', rank: 10, group: 'I' },
  { id: 31, name: 'Morocco', code: 'ma', flag: '🇲🇦', rank: 13, group: 'I' },
  { id: 8, name: 'Colombia', code: 'co', flag: '🇨🇴', rank: 12, group: 'I' },
  { id: 19, name: 'Nigeria', code: 'ng', flag: '🇳🇬', rank: 38, group: 'I' },

  // Group J
  { id: 1090, name: 'Norway', code: 'no', flag: '🇳🇴', rank: 21, group: 'J' },
  { id: 775, name: 'Austria', code: 'at', flag: '🇦🇹', rank: 24, group: 'J' },
  { id: 32, name: 'Egypt', code: 'eg', flag: '🇪🇬', rank: 36, group: 'J' },
  { id: 1501, name: "Côte d'Ivoire", code: 'ci', flag: '🇨🇮', rank: 39, group: 'J' },

  // Group K
  { id: 16, name: 'Sweden', code: 'se', flag: '🇸🇪', rank: 27, group: 'K' },
  { id: 1529, name: 'Ukraine', code: 'ua', flag: '🇺🇦', rank: 34, group: 'K' },
  { id: 1534, name: 'Algeria', code: 'dz', flag: '🇩🇿', rank: 43, group: 'K' },
  { id: 1535, name: 'Panama', code: 'pa', flag: '🇵🇦', rank: 45, group: 'K' },

  // Group L
  { id: 3, name: 'Croatia', code: 'hr', flag: '🇭🇷', rank: 9, group: 'L' },
  { id: 1569, name: 'Qatar', code: 'qa', flag: '🇶🇦', rank: 35, group: 'L' },
  { id: 2389, name: 'Ecuador', code: 'ec', flag: '🇪🇨', rank: 31, group: 'L' },
  { id: 1536, name: 'New Zealand', code: 'nz', flag: '🇳🇿', rank: 48, group: 'L' },
].map((t, i) => ({ ...t, uid: i + 1 })); // uid: stable unique id for selection/keys

// Backwards-compatible export used across the app as the default team list.
export const TEAMS = CANONICAL_TEAMS;

export const GROUPS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L'];

// Map an ISO-ish country name to a flag CDN code so API-supplied teams still
// render a flag image when we only get a logo URL.
const NAME_TO_CODE = Object.fromEntries(CANONICAL_TEAMS.map((t) => [t.name.toLowerCase(), t.code]));

export function codeForName(name) {
  if (!name) return null;
  return NAME_TO_CODE[String(name).toLowerCase()] || NAME_TO_CODE[fixTeamName(name).toLowerCase()] || null;
}

// Normalize a name for loose matching (strip case, punctuation, accents-as-removed).
function normKey(s) {
  return String(s || '').toLowerCase().replace(/&/g, 'and').replace(/[^a-z]/g, '');
}

// Canonical display-name corrections for national teams whose API/common name
// differs from the preferred display. Applied wherever a team name is shown.
const DISPLAY_FIXES = [
  { display: "Côte d'Ivoire", aliases: ['Ivory Coast', "Cote d'Ivoire", "Côte d'Ivoire"] },
  { display: 'IR Iran', aliases: ['Iran', 'IR Iran', 'Islamic Republic of Iran'] },
  { display: 'Cabo Verde', aliases: ['Cape Verde Islands', 'Cape Verde', 'Cabo Verde'] },
];
const FIX_BY_NORM = new Map();
DISPLAY_FIXES.forEach(({ display, aliases }) => aliases.forEach((a) => FIX_BY_NORM.set(normKey(a), display)));

export function fixTeamName(name) {
  if (!name) return name;
  return FIX_BY_NORM.get(normKey(name)) || name;
}

export function teamsByGroup(group, list = TEAMS) {
  return list.filter((t) => t.group === group);
}

export function findTeam(query, list = TEAMS) {
  if (query == null) return null;
  return (
    list.find((t) => t.uid === Number(query)) ||
    list.find((t) => t.name.toLowerCase() === String(query).toLowerCase()) ||
    null
  );
}

export function findTeamByName(name, list = TEAMS) {
  if (!name) return null;
  const n = String(name).toLowerCase();
  return (
    list.find((t) => t.name.toLowerCase() === n) ||
    list.find((t) => t.name.toLowerCase().includes(n)) ||
    null
  );
}

/* ---------------------------------------------------------------------------
 * Live teams from API-Football (cached 24h) with canonical fallback.
 * GET /teams?league=1&season=2026 → all 48 qualified teams.
 * ------------------------------------------------------------------------- */

const BASE = 'https://v3.football.api-sports.io';
let _teamsCache = null; // { value, expires }
const DAY_MS = 24 * 60 * 60 * 1000;

export async function fetchTeams() {
  // 24h in-memory cache.
  if (_teamsCache && Date.now() < _teamsCache.expires) return _teamsCache.value;

  let teams = CANONICAL_TEAMS;
  let source = 'canonical';

  try {
    const url = new URL(BASE + '/teams');
    url.searchParams.set('league', '1');
    url.searchParams.set('season', '2026');
    const res = await fetch(url.toString(), {
      headers: { 'x-apisports-key': process.env.FOOTBALL_API_KEY || '' },
      // Next.js fetch cache for 24h as well.
      next: { revalidate: 60 * 60 * 24 },
    });
    if (res.ok) {
      const json = await res.json();
      const rows = Array.isArray(json.response) ? json.response : [];
      if (rows.length >= 24) {
        // Merge API data onto canonical entries (so we keep group + rank + code),
        // and append any API team we don't already know about. Match by a
        // normalized key and apply display-name corrections (e.g. Ivory Coast
        // → Côte d'Ivoire, Iran → IR Iran, Cape Verde Islands → Cabo Verde).
        const byKey = new Map(CANONICAL_TEAMS.map((t) => [normKey(t.name), { ...t }]));
        rows.forEach((r) => {
          const raw = r.team?.name;
          if (!raw) return;
          const name = fixTeamName(raw);
          const key = normKey(name);
          const existing = byKey.get(key);
          if (existing) {
            existing.id = r.team?.id ?? existing.id;
            existing.logo = r.team?.logo || existing.logo;
            existing.name = name;
          } else {
            byKey.set(key, {
              id: r.team?.id,
              name,
              code: codeForName(name),
              logo: r.team?.logo,
              flag: '🏳️',
              rank: 99,
              group: '',
            });
          }
        });
        teams = [...byKey.values()].map((t, i) => ({ ...t, uid: i + 1 }));
        source = 'api';
      }
    }
  } catch {
    // fall back to canonical
  }

  _teamsCache = { value: { source, teams }, expires: Date.now() + DAY_MS };
  return _teamsCache.value;
}

export const HOST_CITIES = [
  'Mexico City', 'Guadalajara', 'Monterrey', 'Toronto', 'Vancouver',
  'Atlanta', 'Boston', 'Dallas', 'Houston', 'Kansas City', 'Los Angeles',
  'Miami', 'New York/NJ', 'Philadelphia', 'San Francisco', 'Seattle',
];
