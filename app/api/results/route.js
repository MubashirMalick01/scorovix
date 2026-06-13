// NEVER use AI to generate match data, player names, scores or statistics.
// All data must come from API-Football only.

import { NextResponse } from 'next/server';
import { getResults } from '@/lib/apiFootball';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const data = await getResults();
    return NextResponse.json(data, {
      headers: { 'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=120' },
    });
  } catch (e) {
    return NextResponse.json({ source: 'error', matches: [], error: String(e) }, { status: 200 });
  }
}
