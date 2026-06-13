// NEVER use AI to generate match data, player names, scores or statistics.
// All factual data comes from API-Football only. This route runs an explicitly
// labelled knockout SIMULATION from team strength — it is a forecast, never
// presented as real results.

import { NextResponse } from 'next/server';
import { TEAMS } from '@/lib/teams';
import { getStandings, getTeamStrength } from '@/lib/apiFootball';
import { seeded } from '@/lib/utils';

export const dynamic = 'force-dynamic';

// Simulate a single knockout tie deterministically from team strength.
function playTie(a, b, rnd) {
  const sa = getTeamStrength(a) + rnd() * 18;
  const sb = getTeamStrength(b) + rnd() * 18;
  let ga = Math.max(0, Math.round((sa / (sa + sb)) * 3 + rnd() - 0.5));
  let gb = Math.max(0, Math.round((sb / (sa + sb)) * 3 + rnd() - 0.5));
  let pens = null;
  let winner;
  if (ga === gb) {
    // penalties
    winner = sa + rnd() * 10 >= sb + rnd() * 10 ? a : b;
    pens = winner === a ? '5-4' : '4-5';
  } else {
    winner = ga > gb ? a : b;
  }
  return { a, b, ga, gb, pens, winner };
}

function roundFrom(teams, label, seedKey) {
  const rnd = seeded(seedKey);
  const ties = [];
  for (let i = 0; i < teams.length; i += 2) {
    if (teams[i + 1]) ties.push(playTie(teams[i], teams[i + 1], rnd));
  }
  return { label, ties, winners: ties.map((t) => t.winner) };
}

export async function POST() {
  try {
    const { groups } = await getStandings();

    // Qualified: top 2 of each group + 8 best thirds → 32 teams.
    const top2 = [];
    const thirds = [];
    groups.forEach((g) => {
      const sorted = [...g.table].sort((a, b) => a.rank - b.rank);
      if (sorted[0]) top2.push(sorted[0].team);
      if (sorted[1]) top2.push(sorted[1].team);
      if (sorted[2]) thirds.push(sorted[2].team);
    });
    const bestThirds = thirds
      .sort((a, b) => getTeamStrength(b) - getTeamStrength(a))
      .slice(0, 32 - top2.length);
    let bracket = [...top2, ...bestThirds].slice(0, 32);

    // Fallback if standings thin: fill from ranked teams.
    if (bracket.length < 32) {
      const extra = [...TEAMS].sort((a, b) => a.rank - b.rank);
      for (const t of extra) {
        if (bracket.length >= 32) break;
        if (!bracket.find((x) => x.uid === t.uid)) bracket.push(t);
      }
    }

    const r32 = roundFrom(bracket, 'Round of 32', 'r32');
    const r16 = roundFrom(r32.winners, 'Round of 16', 'r16');
    const qf = roundFrom(r16.winners, 'Quarter Finals', 'qf');
    const sf = roundFrom(qf.winners, 'Semi Finals', 'sf');
    const finalRound = roundFrom(sf.winners, 'Final', 'final');
    const champion = finalRound.winners[0];

    return NextResponse.json({
      rounds: [r32, r16, qf, sf, finalRound],
      champion,
      generatedAt: new Date().toISOString(),
    });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
