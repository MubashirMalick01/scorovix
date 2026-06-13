// NEVER use AI to generate match data, player names, scores or statistics.
// All data must come from API-Football only.

import { NextResponse } from 'next/server';
import { findTeam } from '@/lib/teams';
import { getTeamStats } from '@/lib/apiFootball';

export const dynamic = 'force-dynamic';

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const teamId = searchParams.get('teamId') || searchParams.get('id');
    const team = findTeam(teamId);
    if (!team) return NextResponse.json({ error: 'Unknown team' }, { status: 400 });

    const stats = await getTeamStats(team);
    return NextResponse.json({ team, stats });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const { teamId } = await req.json();
    const team = findTeam(teamId);
    if (!team) return NextResponse.json({ error: 'Unknown team' }, { status: 400 });
    const stats = await getTeamStats(team);
    return NextResponse.json({ team, stats });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
