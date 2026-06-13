'use client';

import { useEffect, useState } from 'react';
import { TEAMS } from './teams';

// Loads the qualified-team list from /api/teams (cached 24h server-side),
// falling back to the canonical list bundled with the app. Module-level cache
// avoids refetching on every component mount within a session.
let _cache = null;
let _inflight = null;

async function load() {
  if (_cache) return _cache;
  if (!_inflight) {
    _inflight = fetch('/api/teams')
      .then((r) => r.json())
      .then((d) => {
        _cache = Array.isArray(d.teams) && d.teams.length ? d.teams : TEAMS;
        return _cache;
      })
      .catch(() => {
        _cache = TEAMS;
        return _cache;
      });
  }
  return _inflight;
}

export function useTeams() {
  const [teams, setTeams] = useState(_cache || TEAMS);
  const [loading, setLoading] = useState(!_cache);

  useEffect(() => {
    let active = true;
    load().then((t) => {
      if (active) {
        setTeams(t);
        setLoading(false);
      }
    });
    return () => {
      active = false;
    };
  }, []);

  return { teams, loading };
}
