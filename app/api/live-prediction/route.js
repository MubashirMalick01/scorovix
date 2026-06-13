// Factual match data (live scores, events, player names) comes from
// API-Football only and is NEVER AI-generated. This route returns an
// explicitly labelled in-play FORECAST built from the real live statistics
// passed in; it asserts no real player identities.

import { NextResponse } from 'next/server';
import { predictLive } from '@/lib/anthropic';

export const dynamic = 'force-dynamic';

export async function POST(req) {
  try {
    const body = await req.json();
    const { matchData } = body;
    if (!matchData) {
      return NextResponse.json({ error: 'matchData required' }, { status: 400 });
    }

    const recent = (matchData.events || [])
      .filter((e) => e.minute >= (matchData.minute || 0) - 15)
      .map((e) => `${e.minute}' ${e.type} ${e.player || ''} (${e.team || ''})`)
      .join('; ');

    const prediction = await predictLive({
      home: matchData.home?.name || matchData.home,
      away: matchData.away?.name || matchData.away,
      score: `${matchData.goalsHome ?? 0}-${matchData.goalsAway ?? 0}`,
      minute: matchData.minute || 0,
      stats: matchData.stats,
      recentEvents: recent,
    });

    return NextResponse.json({ prediction, updatedAt: new Date().toISOString() });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
