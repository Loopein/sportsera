"use client";

import { useCallback, useRef, useState } from "react";
import { API_ENDPOINTS } from "@/lib/api/endpoints";
import { toEtagFromData } from "@/lib/utils/data-version";
import { isDeepEqual, pickStableValue } from "@/lib/utils/stable-update";
import type { MatchSummary } from "@/types/match";
import { usePolling } from "@/hooks/usePolling";

type MatchResponse = {
  data: MatchSummary;
};

function mergeStableMatch(previous: MatchSummary, next: MatchSummary): MatchSummary {
  const merged: MatchSummary = {
    ...next,
    teamA: pickStableValue(previous.teamA, next.teamA),
    teamB: pickStableValue(previous.teamB, next.teamB),
    currentBatters: pickStableValue(previous.currentBatters, next.currentBatters),
    currentBowlers: pickStableValue(previous.currentBowlers, next.currentBowlers),
    recentOvers: pickStableValue(previous.recentOvers, next.recentOvers),
    playingXI: pickStableValue(previous.playingXI, next.playingXI)
  };

  return isDeepEqual(previous, merged) ? previous : merged;
}

export function useMatch(initialMatch: MatchSummary, intervalMs = 7_000) {
  const [match, setMatch] = useState<MatchSummary>(initialMatch);
  const [error, setError] = useState<string>("");
  const [isLoading, setLoading] = useState(false);
  const etagRef = useRef<string>(toEtagFromData(initialMatch));

  const refresh = useCallback(async (showLoading = false) => {
    try {
      if (showLoading) setLoading(true);
      const response = await fetch(API_ENDPOINTS.match(initialMatch.id), {
        cache: "no-store",
        headers: { "If-None-Match": etagRef.current }
      });
      if (response.status === 304) {
        setError("");
        return;
      }
      if (!response.ok) throw new Error("Failed to refresh match summary");
      const json = (await response.json()) as MatchResponse;
      const nextEtag = response.headers.get("etag");
      if (nextEtag) etagRef.current = nextEtag;
      setMatch((previous) => mergeStableMatch(previous, json.data));
      setError("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      if (showLoading) setLoading(false);
    }
  }, [initialMatch.id]);

  usePolling(refresh, intervalMs, { leading: false });

  return { match, error, isLoading, refresh: () => refresh(true) };
}
