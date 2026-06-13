// NEVER use AI to generate match data, player names, scores or statistics.
// All data must come from API-Football only.

import { NextResponse } from 'next/server';
import {
  getLiveFixtures,
  getFixtureStatistics,
  getFixtureEvents,
} from '@/lib/apiFootball';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const { source, matches } = await getLiveFixtures();

    // For each live fixture, fetch real statistics + events from API-Football.
    const enriched = await Promise.all(
      matches.map(async (m) => {
        const [stats, ev] = await Promise.all([
          getFixtureStatistics(m.id),
          getFixtureEvents(m.id),
        ]);
        return { ...m, stats: stats || null, events: ev.events };
      })
    );

    return NextResponse.json(
      { source, count: enriched.length, matches: enriched, updatedAt: new Date().toISOString() },
      { headers: { 'Cache-Control': 'no-store' } }
    );
  } catch (e) {
    return NextResponse.json({ source: 'error', matches: [], error: String(e) }, { status: 200 });
  }
}
