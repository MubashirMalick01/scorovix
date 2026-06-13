// Factual match data (results, scores, events, player names) comes from
// API-Football only and is NEVER AI-generated. This route returns an
// explicitly labelled pre-match FORECAST built from real statistical inputs
// (FIFA rank, form, goals, head-to-head); it asserts no real player identities.

import { NextResponse } from 'next/server';
import { findTeam } from '@/lib/teams';
import { getTeamStats, getH2H } from '@/lib/apiFootball';
import { predictMatch } from '@/lib/anthropic';

export const dynamic = 'force-dynamic';

export async function POST(req) {
  try {
    const body = await req.json();
    const { teamAId, teamBId, teamA: nameA, teamB: nameB, stage = 'Group Stage', venue = 'MetLife Stadium' } = body;

    const teamA = findTeam(teamAId) || findTeam(nameA);
    const teamB = findTeam(teamBId) || findTeam(nameB);

    if (!teamA || !teamB) {
      return NextResponse.json({ error: 'Both teams are required.' }, { status: 400 });
    }
    if (teamA.uid === teamB.uid) {
      return NextResponse.json({ error: 'Pick two different teams.' }, { status: 400 });
    }

    const [dataA, dataB, h2h] = await Promise.all([
      getTeamStats(teamA),
      getTeamStats(teamB),
      getH2H(teamA, teamB),
    ]);

    const prediction = await predictMatch({ teamA, teamB, dataA, dataB, h2h, stage, venue });

    return NextResponse.json({
      teamA,
      teamB,
      stage,
      venue,
      dataA,
      dataB,
      h2h,
      prediction,
    });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
