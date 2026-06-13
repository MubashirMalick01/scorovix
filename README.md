# Scorovix 🏆

A premium FIFA World Cup 2026 prediction website. Real data, live in-play
predictions, a full tournament simulator and an SEO blog — built to feel like
ESPN × FIFA × Bet365.

## Stack

- **Next.js 15** (App Router) + React 19
- **Tailwind CSS** (custom dark/gold design system)
- **Framer Motion** for every animation
- **Recharts**-ready data layer
- **Scorovix** prediction engine (`claude-sonnet-4-6`) for clearly-labelled
  pre-match and in-play *forecasts* — never used to fabricate factual data
- **API-Football** (v3) as the single source of truth for all factual data
  (teams, fixtures, live scores, events, results, statistics)

## Getting started

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build
npm start        # serve production build
```

Environment variables live in `.env.local`:

```
ANTHROPIC_API_KEY=...
FOOTBALL_API_KEY=...
```

## Data integrity

**All factual match data — teams, fixtures, live scores, goal scorers, events,
results and statistics — comes from API-Football only.** Player names, scores
and events are never generated. If the API has no scorer/event data for a
match, the UI shows the score only (and live timelines show
"Match events will appear here as they happen").

The prediction tools (`/predict`, in-play predictions, the bracket simulator)
are explicitly labelled **forecasts**. They are built from real statistical
inputs (FIFA rank, form, goals, head-to-head, team strength) and never assert
real player identities or real scorelines. The `source` field on prediction
responses indicates the path taken (`intelligence` = live model,
`model` = statistical fallback).

Teams load from `/api/teams` (`GET /teams?league=1&season=2026`), cached 24h,
with a canonical 48-team fallback so the full field always renders.

## Pages

| Route       | Description |
|-------------|-------------|
| `/`         | Hero, live ticker, next featured match (prediction on demand), static stats, recent results |
| `/live`     | Live match cards auto-refreshing every 30s with freshness indicator + in-play predictions; countdown, upcoming fixtures and latest results when nothing is live |
| `/predict`  | Pick two teams + stage → full analysis with probabilities, team strengths, tactics, risk |
| `/bracket`  | Group standings (A–L) + tournament simulator (R32 → Final → Champion) |
| `/teams`    | All 48 teams (from `/api/teams`), searchable, expand for per-team stats |
| `/results`  | Completed matches with real goal scorers (filter + pagination) |

## API routes

`/api/teams`, `/api/live`, `/api/predict`, `/api/live-prediction`,
`/api/standings`, `/api/fixtures`, `/api/team-stats`, `/api/results`,
`/api/simulate`.

## Structure

```
app/            pages + API routes
components/ui/  reusable primitives (Flag, ProbabilityBar, ConfidenceMeter, …)
components/layout/  Navbar, MobileNav, Ticker
components/sections/  LiveMatchCard, PredictionResult, BracketView, …
lib/            teams, apiFootball, anthropic, cache, utils, useTeams
```

## Notes

- Flags render via `flagcdn.com` images (the `Flag` component), not emoji —
  Windows/Chrome render regional-indicator flag emoji as plain letter codes,
  so images guarantee correct flags on every OS. API-sourced teams fall back
  to their crest/logo.
- Live data refreshes every 30s (state only, no page reload); in-play
  predictions refresh every 60s and pause at half-time / full-time.
