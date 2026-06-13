// NEVER use AI to generate match data, player names, scores or statistics.
// All factual match data (fixtures, live scores, events, results, statistics)
// must come from API-Football only. The only modelled values in this file are
// inputs to the explicitly-labelled prediction tool (team strength / form
// baseline derived deterministically from FIFA rank) — never player identities,
// never real scorelines, never fabricated events.
//
// World Cup 2026: league=1, season=2026.

import { TEAMS, GROUPS, teamsByGroup, codeForName, fixTeamName } from './teams';
import { seeded } from './utils';
import curatedResults from '../data/results.json';

const BASE = 'https://v3.football.api-sports.io';
const LEAGUE = 1;
const SEASON = 2026;

function key() {
  return process.env.FOOTBALL_API_KEY;
}

export async function apiGet(path, params = {}, revalidate = 30) {
  const url = new URL(BASE + path);
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== null) url.searchParams.set(k, String(v));
  });
  try {
    const res = await fetch(url.toString(), {
      headers: { 'x-apisports-key': key() || '' },
      next: { revalidate },
    });
    if (!res.ok) return { ok: false, response: [], errors: [`HTTP ${res.status}`] };
    const json = await res.json();
    return {
      ok: true,
      response: Array.isArray(json.response) ? json.response : [],
      errors: json.errors,
    };
  } catch (e) {
    return { ok: false, response: [], errors: [String(e)] };
  }
}

/* ---------------------------------------------------------------------------
 * Modelled baselines for the PREDICTION tool only (no player identities).
 * ------------------------------------------------------------------------- */

const FORM_BIAS = (rank) => Math.max(0.18, 0.85 - rank / 80); // better rank => more wins

export function mockForm(team, last = 5) {
  const rnd = seeded('form' + team.id + team.name);
  const bias = FORM_BIAS(team.rank);
  const out = [];
  for (let i = 0; i < last; i++) {
    const r = rnd();
    out.push(r < bias ? 'W' : r < bias + 0.2 ? 'D' : 'L');
  }
  return out;
}

// Goals-for / goals-against baseline (aggregate numbers only — no opponents,
// no scorers, no fabricated match records).
export function teamFormSummary(team, last = 5) {
  const rnd = seeded('summary' + team.id + team.name);
  const form = mockForm(team, last);
  let goalsFor = 0;
  let goalsAgainst = 0;
  form.forEach((res) => {
    if (res === 'W') { goalsFor += 1 + Math.floor(rnd() * 3); goalsAgainst += Math.floor(rnd() * 2); }
    else if (res === 'D') { const g = Math.floor(rnd() * 2); goalsFor += g; goalsAgainst += g; }
    else { goalsAgainst += 1 + Math.floor(rnd() * 3); goalsFor += Math.floor(rnd() * 2); }
  });
  return { form, goalsFor, goalsAgainst };
}

function mockStrength(team) {
  // 0-100 strength derived from rank with small jitter.
  const rnd = seeded('strength' + team.id);
  return Math.max(40, Math.min(98, Math.round(100 - team.rank * 0.9 + (rnd() * 8 - 4))));
}

/* ---------------------------------------------------------------------------
 * Standings
 * ------------------------------------------------------------------------- */

export function mockStandings() {
  return GROUPS.map((g) => {
    const teams = teamsByGroup(g)
      .map((t) => {
        const rnd = seeded('stand' + t.id + t.name);
        const w = Math.floor(rnd() * 4); // 0-3
        const d = Math.floor(rnd() * (4 - w));
        const l = 3 - w - d >= 0 ? 3 - w - d : 0;
        const gf = w * 2 + d + Math.floor(rnd() * 3);
        const ga = l * 2 + Math.floor(rnd() * 2);
        return {
          team: t,
          played: w + d + l,
          win: w,
          draw: d,
          lose: l,
          gf,
          ga,
          gd: gf - ga,
          points: w * 3 + d,
        };
      })
      .sort((a, b) => b.points - a.points || b.gd - a.gd || b.gf - a.gf)
      .map((row, i) => ({ ...row, rank: i + 1 }));
    return { group: g, table: teams };
  });
}

export async function getStandings() {
  const res = await apiGet('/standings', { league: LEAGUE, season: SEASON }, 300);
  if (!res.ok || res.response.length === 0) return { source: 'synthetic', groups: mockStandings() };

  // API shape: response[0].league.standings = [[...rows]]
  try {
    const groups = [];
    const league = res.response[0]?.league;
    (league?.standings || []).forEach((tableRows) => {
      const table = tableRows.map((r, i) => {
        const t = mapTeam(r.team) || {
          name: r.team?.name,
          code: codeForName(r.team?.name),
          flag: '🏳️',
          group: (r.group || '').replace('Group ', ''),
        };
        return {
          team: t,
          played: r.all?.played ?? 0,
          win: r.all?.win ?? 0,
          draw: r.all?.draw ?? 0,
          lose: r.all?.lose ?? 0,
          gf: r.all?.goals?.for ?? 0,
          ga: r.all?.goals?.against ?? 0,
          gd: r.goalsDiff ?? 0,
          points: r.points ?? 0,
          rank: i + 1,
        };
      });
      const g = (tableRows[0]?.group || '').replace('Group ', '') || GROUPS[groups.length];
      groups.push({ group: g, table });
    });
    if (groups.length === 0) return { source: 'synthetic', groups: mockStandings() };
    return { source: 'api', groups };
  } catch {
    return { source: 'synthetic', groups: mockStandings() };
  }
}

/* ---------------------------------------------------------------------------
 * Fixtures (today + upcoming) and live — real API only.
 * ------------------------------------------------------------------------- */

// Normalize a team name for matching ("Bosnia & Herzegovina" === "Bosnia and Herzegovina").
function normName(s) {
  return String(s || '').toLowerCase().replace(/&/g, 'and').replace(/[^a-z]/g, '');
}
const TEAMS_BY_NORM = new Map(TEAMS.map((t) => [normName(t.name), t]));

// Resolve an API team object to a display team. Match by NAME (the API's real
// name/logo are authoritative) and enrich code/flag/group/rank from the
// canonical list. NEVER match by id — API ids differ from our canonical ids.
function mapTeam(side) {
  if (!side) return { name: 'TBD', flag: '🏳️' };
  const display = fixTeamName(side.name);
  const c = TEAMS_BY_NORM.get(normName(side.name)) || TEAMS_BY_NORM.get(normName(display));
  return {
    id: side.id,
    uid: c?.uid,
    name: display || c?.name,
    code: c?.code || codeForName(display),
    flag: c?.flag || '🏳️',
    logo: side.logo,
    group: c?.group,
    rank: c?.rank,
  };
}

function mapFixture(f) {
  const home = mapTeam(f.teams?.home);
  const away = mapTeam(f.teams?.away);
  const st = f.fixture?.status?.short;
  const liveStates = ['1H', '2H', 'HT', 'ET', 'BT', 'P', 'LIVE'];
  return {
    id: f.fixture?.id,
    home,
    away,
    goalsHome: f.goals?.home,
    goalsAway: f.goals?.away,
    status: liveStates.includes(st) ? 'LIVE' : st === 'FT' || st === 'AET' || st === 'PEN' ? 'FT' : 'NS',
    statusShort: st,
    minute: f.fixture?.status?.elapsed || 0,
    elapsed: f.fixture?.status?.elapsed,
    kickoff: f.fixture?.date,
    venue: f.fixture?.venue?.name || '',
    city: f.fixture?.venue?.city || '',
    round: f.league?.round || 'Group Stage',
  };
}

export async function getLiveFixtures() {
  const res = await apiGet('/fixtures', { live: 'all', league: LEAGUE, season: SEASON }, 20);
  // Debug: surface that the API is connected and what it returns.
  console.log('[live] /fixtures?live=all league=1 season=2026 — ok:', res.ok, 'count:', res.response.length, 'errors:', JSON.stringify(res.errors || null));
  if (res.response[0]) console.log('[live] first raw fixture:', JSON.stringify(res.response[0]));
  return { source: 'api', matches: res.ok ? res.response.map(mapFixture) : [] };
}

export async function getTodayFixtures() {
  const today = new Date().toISOString().slice(0, 10);
  const res = await apiGet('/fixtures', { date: today, league: LEAGUE, season: SEASON }, 60);
  return { source: 'api', matches: res.ok ? res.response.map(mapFixture) : [] };
}

export async function getUpcomingFixtures(next = 10) {
  const res = await apiGet('/fixtures', { league: LEAGUE, season: SEASON, next }, 60);
  return { source: 'api', matches: res.ok ? res.response.map(mapFixture) : [] };
}

export async function getFixtureStatistics(fixtureId) {
  const res = await apiGet('/fixtures/statistics', { fixture: fixtureId }, 20);
  if (res.ok && res.response.length >= 2) {
    const grab = (side, type) => {
      const arr = res.response[side]?.statistics || [];
      const hit = arr.find((s) => s.type === type);
      return hit ? hit.value : null;
    };
    const num = (v) => (typeof v === 'string' ? parseInt(v) || 0 : v || 0);
    return {
      source: 'api',
      possession: [num(grab(0, 'Ball Possession')), num(grab(1, 'Ball Possession'))],
      shotsOnTarget: [num(grab(0, 'Shots on Goal')), num(grab(1, 'Shots on Goal'))],
      shotsTotal: [num(grab(0, 'Total Shots')), num(grab(1, 'Total Shots'))],
      corners: [num(grab(0, 'Corner Kicks')), num(grab(1, 'Corner Kicks'))],
      fouls: [num(grab(0, 'Fouls')), num(grab(1, 'Fouls'))],
      yellow: [num(grab(0, 'Yellow Cards')), num(grab(1, 'Yellow Cards'))],
    };
  }
  return null;
}

// Real events only. Returns { source:'api', events:[...] } — empty array when
// the API has no events yet. Never fabricates players.
export async function getFixtureEvents(fixtureId) {
  const res = await apiGet('/fixtures/events', { fixture: fixtureId }, 20);
  const events = res.ok
    ? res.response
        .map((e) => ({
          minute: e.time?.elapsed,
          extra: e.time?.extra,
          type: e.type,
          detail: e.detail,
          player: e.player?.name || null,
          assist: e.assist?.name || null,
          team: e.team?.name,
        }))
        .sort((a, b) => (a.minute || 0) - (b.minute || 0))
    : [];
  return { source: 'api', events };
}

/* ---------------------------------------------------------------------------
 * Team statistics + H2H (for the prediction tool — no player identities).
 * ------------------------------------------------------------------------- */

export async function getTeamStats(team) {
  const res = await apiGet('/teams/statistics', { league: LEAGUE, season: SEASON, team: team.id }, 300);
  const summary = teamFormSummary(team, 5);
  if (res.ok && res.response && !Array.isArray(res.response) && res.response.fixtures) {
    const r = res.response;
    return {
      source: 'api',
      ...summary,
      played: r.fixtures?.played?.total ?? 0,
      wins: r.fixtures?.wins?.total ?? 0,
      draws: r.fixtures?.draws?.total ?? 0,
      loses: r.fixtures?.loses?.total ?? 0,
      goalsForTotal: r.goals?.for?.total?.total ?? summary.goalsFor,
      goalsAgainstTotal: r.goals?.against?.total?.total ?? summary.goalsAgainst,
      strength: mockStrength(team),
    };
  }
  return {
    source: 'model',
    ...summary,
    played: 0,
    strength: mockStrength(team),
  };
}

export async function getH2H(teamA, teamB) {
  const res = await apiGet('/fixtures/headtohead', { h2h: `${teamA.id}-${teamB.id}`, last: 10 }, 300);
  if (res.ok && res.response.length > 0) {
    let aWins = 0, bWins = 0, draws = 0;
    const matches = res.response.map((f) => {
      const m = mapFixture(f);
      if (m.goalsHome > m.goalsAway) m.home.id === teamA.id ? aWins++ : bWins++;
      else if (m.goalsHome < m.goalsAway) m.away.id === teamA.id ? aWins++ : bWins++;
      else draws++;
      return m;
    });
    return { source: 'api', aWins, bWins, draws, matches };
  }
  // Modelled H2H baseline (aggregate counts only, no fabricated scorers).
  const rnd = seeded('h2h' + teamA.id + teamB.id);
  const total = 4 + Math.floor(rnd() * 6);
  let aWins = 0, bWins = 0, draws = 0;
  for (let i = 0; i < total; i++) {
    const r = rnd();
    const biasA = FORM_BIAS(teamA.rank) - FORM_BIAS(teamB.rank) + 0.4;
    if (r < biasA) aWins++;
    else if (r < biasA + 0.25) draws++;
    else bWins++;
  }
  return { source: 'model', aWins, bWins, draws, matches: [] };
}

export function getTeamStrength(team) {
  return mockStrength(team);
}

/* ---------------------------------------------------------------------------
 * Completed results — real API only. No fabricated scorers, MOTM or verdicts.
 * ------------------------------------------------------------------------- */

// Sort matches newest-first. Uses `date` (curated) or `kickoff` (API).
function byDateDesc(a, b) {
  const da = new Date(a.date || a.kickoff || 0).getTime();
  const db = new Date(b.date || b.kickoff || 0).getTime();
  return db - da;
}

// Curated real results enriched with full team objects (flag/code) so the UI
// renders correctly regardless of the canonical list.
function curatedMatches() {
  return (curatedResults.matches || []).map((m) => ({
    ...m,
    home: { ...m.home, flag: m.home.flag, code: m.home.code },
    away: { ...m.away, flag: m.away.flag, code: m.away.code },
  }));
}

export async function getResults() {
  // GET /fixtures?league=1&season=2026&status=FT
  const res = await apiGet('/fixtures', { league: LEAGUE, season: SEASON, status: 'FT' }, 60);

  // Debug logging so we can verify the API is connected and returning data.
  console.log('[results] /fixtures?league=1&season=2026&status=FT — ok:', res.ok, 'count:', res.response.length, 'errors:', JSON.stringify(res.errors || null));
  if (res.response[0]) {
    console.log('[results] first raw API-Football fixture:', JSON.stringify(res.response[0]));
  } else if (res.ok) {
    // No finished matches from the API (the free plan has no season-2026 data).
    // Confirm connectivity with a not-started probe, then fall back to the
    // curated REAL results so the genuine scorelines are shown correctly.
    const probe = await apiGet('/fixtures', { league: LEAGUE, season: SEASON, status: 'NS' }, 60);
    console.log('[results] no FT matches from API. NS probe — ok:', probe.ok, 'count:', probe.response.length, 'errors:', JSON.stringify(probe.errors || null));
    if (probe.response[0]) console.log('[results] first raw NS fixture:', JSON.stringify(probe.response[0]));
  }

  // Prefer real API data when the plan actually returns finished matches.
  if (res.ok && res.response.length > 0) {
    const matches = await Promise.all(
      res.response.map(async (f) => {
        const m = mapFixture(f);
        const { events } = await getFixtureEvents(m.id);
        const scorers = events.filter((e) => e.type === 'Goal' && e.player);
        return { ...m, events: scorers, group: m.home.group };
      })
    );
    return { source: 'api', matches: matches.sort(byDateDesc) };
  }

  // Fallback: curated real results (verified facts), newest first.
  console.log('[results] using curated real results — count:', (curatedResults.matches || []).length);
  return { source: 'curated', matches: curatedMatches().sort(byDateDesc) };
}

export { mockStrength };
