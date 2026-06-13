// NEVER use AI to generate match data, player names, scores or statistics.
// All data must come from API-Football only.

import { NextResponse } from 'next/server';
import { getStandings } from '@/lib/apiFootball';

export const revalidate = 300;

export async function GET() {
  try {
    const data = await getStandings();
    return NextResponse.json(data, {
      headers: { 'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600' },
    });
  } catch (e) {
    return NextResponse.json({ source: 'error', groups: [], error: String(e) }, { status: 200 });
  }
}
