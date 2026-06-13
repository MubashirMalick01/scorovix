// Scorovix prediction engine. Uses claude-sonnet-4-6 to produce
// clearly-labelled FORECASTS from real statistical inputs (FIFA rank, form,
// goals, head-to-head). It never asserts real player identities, real
// scorelines or real match events — those come from API-Football only.
// Always falls back to a deterministic statistical prediction if the model
// is unavailable, so the product never shows a broken state.

import Anthropic from '@anthropic-ai/sdk';
import { extractJSON, normalizeProbs, clampPct } from './utils';

const MODEL = 'claude-sonnet-4-6';

function client() {
  return new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
}

async function ask(system, user, maxTokens = 1024) {
  const anthropic = client();
  const msg = await anthropic.messages.create({
    model: MODEL,
    max_tokens: maxTokens,
    system,
    messages: [{ role: 'user', content: user }],
  });
  const text = msg.content
    .filter((b) => b.type === 'text')
    .map((b) => b.text)
    .join('\n');
  return text;
}

/* ------------------------------ Pre-match ------------------------------ */

const PREMATCH_SYSTEM =
  'You are an elite football analyst for FIFA World Cup 2026. Always reference the specific statistics provided. Never give generic answers. Be precise and confident.';

export async function predictMatch(payload) {
  const { teamA, teamB, dataA, dataB, h2h, stage, venue } = payload;

  const user = `Forecast this match from the statistical inputs below. Do NOT invent
specific player names, real scorelines or real events — reference only the stats given.
HOME: ${teamA.name}
- FIFA Rank: ${teamA.rank}
- Form last 5: ${dataA.form.join('')} (W/D/L)
- Goals scored last 5 games: ${dataA.goalsFor}
- Goals conceded last 5 games: ${dataA.goalsAgainst}
- Team strength: ${dataA.strength}/100

AWAY: ${teamB.name}
- FIFA Rank: ${teamB.rank}
- Form last 5: ${dataB.form.join('')}
- Goals scored last 5 games: ${dataB.goalsFor}
- Goals conceded last 5 games: ${dataB.goalsAgainst}
- Team strength: ${dataB.strength}/100

HEAD TO HEAD (last 10): ${teamA.name} ${h2h.aWins}W - ${h2h.draws}D - ${h2h.bWins}W ${teamB.name}
STAGE: ${stage}
VENUE: ${venue}

Return ONLY this JSON:
{
  "winA": <int 0-100>,
  "draw": <int 0-100>,
  "winB": <int 0-100>,
  "scoreA": <int>,
  "scoreB": <int>,
  "analysis": "<string, 4 sentences, reference the stats above, no player names>",
  "tacticalNote": "<string, how the match will be played>",
  "biggestThreat": "<string, main danger for the favorite, no player names>",
  "confidence": "<low|medium|high|very_high>",
  "upsetPossibility": <int 0-100>
}`;

  try {
    const text = await ask(PREMATCH_SYSTEM, user, 1100);
    const json = extractJSON(text);
    if (json && (json.winA != null)) return finalizePrematch(json, payload);
  } catch (e) {
    // fall through to statistical model
  }
  return statisticalPrematch(payload);
}

function finalizePrematch(json, payload) {
  const [winA, draw, winB] = normalizeProbs(json.winA, json.draw, json.winB);
  return {
    source: 'intelligence',
    winA,
    draw,
    winB,
    scoreA: clampPct(json.scoreA) % 7,
    scoreB: clampPct(json.scoreB) % 7,
    analysis: json.analysis || '',
    tacticalNote: json.tacticalNote || '',
    biggestThreat: json.biggestThreat || '',
    confidence: json.confidence || 'medium',
    upsetPossibility: clampPct(json.upsetPossibility),
  };
}

export function statisticalPrematch(payload) {
  const { teamA, teamB, dataA, dataB, h2h, stage } = payload;
  const sA = dataA.strength + (dataA.goalsFor - dataA.goalsAgainst) * 2 + h2h.aWins * 3;
  const sB = dataB.strength + (dataB.goalsFor - dataB.goalsAgainst) * 2 + h2h.bWins * 3;
  const total = sA + sB || 1;
  let winA = Math.round((sA / total) * 78) + 6;
  let winB = Math.round((sB / total) * 78) + 6;
  let draw = 100 - winA - winB;
  if (draw < 8) {
    draw = 8;
  }
  [winA, draw, winB] = normalizeProbs(winA, draw, winB);
  const scoreA = Math.max(0, Math.round((dataA.goalsFor / 5) * (sA / total) * 2.2));
  const scoreB = Math.max(0, Math.round((dataB.goalsFor / 5) * (sB / total) * 2.2));
  const fav = winA >= winB ? teamA : teamB;
  const dog = winA >= winB ? teamB : teamA;
  const upset = clampPct(Math.min(winA, winB) + 8);
  const conf = Math.abs(winA - winB) > 35 ? 'very_high' : Math.abs(winA - winB) > 20 ? 'high' : Math.abs(winA - winB) > 8 ? 'medium' : 'low';
  return {
    source: 'model',
    winA,
    draw,
    winB,
    scoreA,
    scoreB,
    analysis: `${fav.name} enter as favourites on the strength of a ${(winA >= winB ? dataA : dataB).form.join('')} run and FIFA rank ${fav.rank}, against ${dog.name}'s ${(winA >= winB ? dataB : dataA).form.join('')}. The head-to-head reads ${h2h.aWins}-${h2h.draws}-${h2h.bWins} in ${teamA.name}'s favour over the last ${h2h.aWins + h2h.draws + h2h.bWins} meetings. Goal output (${dataA.goalsFor} vs ${dataB.goalsFor} in the last five) points to a ${scoreA}-${scoreB} scoreline. In a ${stage} tie, tournament experience and ${fav.name}'s defensive record (${(winA >= winB ? dataA : dataB).goalsAgainst} conceded) should prove decisive.`,
    tacticalNote: `${fav.name} will likely dominate possession and press high, forcing ${dog.name} to absorb pressure and break on the counter.`,
    biggestThreat: `${dog.name}'s set-piece threat and pace on the break remain the favourite's chief concern.`,
    confidence: conf,
    upsetPossibility: upset,
  };
}

/* ------------------------------ Live in-play ------------------------------ */

export async function predictLive(payload) {
  const { home, away, score, minute, stats, recentEvents } = payload;
  const user = `Current match state — ${home} vs ${away}:
Score: ${score} | Minute: ${minute}
Possession: ${stats.possession[0]}% - ${stats.possession[1]}%
Shots on target: ${stats.shotsOnTarget[0]} - ${stats.shotsOnTarget[1]}
Corners: ${stats.corners[0]} - ${stats.corners[1]}
Yellow cards: ${stats.yellow[0]} - ${stats.yellow[1]}
Recent events last 15 min: ${recentEvents || 'none'}
xG (if available): n/a

Predict next 15 minutes. Return ONLY JSON:
{
  "nextGoalHome": <int 0-100>,
  "nextGoalAway": <int 0-100>,
  "noMoreGoals": <int 0-100>,
  "predictedFinal": "<score string e.g. 2-1>",
  "momentum": "<home|away|neutral>",
  "momentumScore": <int 0-100>,
  "insight": "<string, one punchy pundit-style sentence>",
  "dangerZone": "<string, what to watch next 15 min>",
  "redCardRisk": <int 0-100>
}`;

  const sys =
    'You are a live in-play football pundit for FIFA World Cup 2026. Use the live stats provided. Be sharp, specific, and confident. One-line insights only.';

  try {
    const text = await ask(sys, user, 700);
    const json = extractJSON(text);
    if (json && json.nextGoalHome != null) {
      const [h, a, n] = normalizeProbs(json.nextGoalHome, json.nextGoalAway, json.noMoreGoals);
      return {
        source: 'intelligence',
        nextGoalHome: h,
        nextGoalAway: a,
        noMoreGoals: n,
        predictedFinal: json.predictedFinal || score,
        momentum: json.momentum || 'neutral',
        momentumScore: clampPct(json.momentumScore),
        insight: json.insight || '',
        dangerZone: json.dangerZone || '',
        redCardRisk: clampPct(json.redCardRisk),
      };
    }
  } catch (e) {
    // fall through
  }
  return statisticalLive(payload);
}

export function statisticalLive(payload) {
  const { home, away, score, minute, stats } = payload;
  const [sh, sa] = stats.shotsOnTarget;
  const [ph, pa] = stats.possession;
  const homePower = sh * 3 + ph * 0.4;
  const awayPower = sa * 3 + pa * 0.4;
  const remaining = Math.max(0.1, (90 - minute) / 90);
  let nextGoalHome = clampPct(homePower * 0.9 * remaining + 8);
  let nextGoalAway = clampPct(awayPower * 0.9 * remaining + 8);
  let noMoreGoals = clampPct(100 - nextGoalHome - nextGoalAway);
  [nextGoalHome, nextGoalAway, noMoreGoals] = normalizeProbs(nextGoalHome, nextGoalAway, noMoreGoals);
  const [gh, ga] = score.split('-').map((n) => parseInt(n) || 0);
  const projH = gh + (nextGoalHome > 45 ? 1 : 0);
  const projA = ga + (nextGoalAway > 45 ? 1 : 0);
  const momentumScore = clampPct(50 + (homePower - awayPower) * 1.5);
  const momentum = momentumScore > 58 ? 'home' : momentumScore < 42 ? 'away' : 'neutral';
  const leader = momentum === 'home' ? home : momentum === 'away' ? away : null;
  return {
    source: 'model',
    nextGoalHome,
    nextGoalAway,
    noMoreGoals,
    predictedFinal: `${projH}-${projA}`,
    momentum,
    momentumScore,
    insight: leader
      ? `${leader} are turning the screw — ${momentum === 'home' ? sh : sa} shots on target and ${momentum === 'home' ? ph : pa}% of the ball is starting to tell.`
      : `Finely poised at ${score} — neither side has found the decisive gear yet with ${90 - minute} minutes to play.`,
    dangerZone: `Watch the ${minute < 75 ? 'next 15 minutes' : 'closing stages'} — ${(sh >= sa ? home : away)} are generating the better looks and a set-piece could settle it.`,
    redCardRisk: clampPct((stats.yellow[0] + stats.yellow[1]) * 12 + (minute > 70 ? 15 : 5)),
  };
}
