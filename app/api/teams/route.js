// NEVER use AI to generate match data, player names, scores or statistics.
// All data must come from API-Football only.

import { NextResponse } from 'next/server';
import { fetchTeams } from '@/lib/teams';

// Cache the route response for 24 hours.
export const revalidate = 86400;

export async function GET() {
  try {
    const { source, teams } = await fetchTeams();
    // Return sorted list with id, name, logo, group, FIFA rank.
    const sorted = [...teams].sort(
      (a, b) => (a.group || 'Z').localeCompare(b.group || 'Z') || a.rank - b.rank
    );
    return NextResponse.json(
      { source, count: sorted.length, teams: sorted },
      { headers: { 'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate=43200' } }
    );
  } catch (e) {
    return NextResponse.json({ source: 'error', teams: [], error: String(e) }, { status: 200 });
  }
}
