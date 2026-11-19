"use client";

import { useCallback, useRef, useState } from "react";
import { API_ENDPOINTS } from "@/lib/api/endpoints";
import { toEtagFromData } from "@/lib/utils/data-version";
import { mergeStableListById } from "@/lib/utils/stable-update";
import type { LiveMatch } from "@/types/match";
import { usePolling } from "@/hooks/usePolling";

type LiveMatchesResponse = {
  data: LiveMatch[];
};

export function useLiveMatches(initialMatches: LiveMatch[], intervalMs = 12_000) {
  const [matches, setMatches] = useState<LiveMatch[]>(initialMatches);
  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const etagRef = useRef<string>(toEtagFromData(initialMatches));

  const refresh = useCallback(async (showLoading = false) => {
    try {
      if (showLoading) setLoading(true);
      const response = await fetch(API_ENDPOINTS.live, {
        cache: "no-store",
        headers: { "If-None-Match": etagRef.current }
      });
      if (response.status === 304) {
        setError("");
        return;
      }
      if (!response.ok) throw new Error("Failed to fetch live matches");
      const json = (await response.json()) as LiveMatchesResponse;
      const nextEtag = response.headers.get("etag");
      if (nextEtag) etagRef.current = nextEtag;
      setMatches((previous) => mergeStableListById(previous, json.data));
      setError("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      if (showLoading) setLoading(false);
    }
  }, []);

  usePolling(refresh, intervalMs, { leading: false });

  return { matches, isLoading, error, refresh: () => refresh(true) };
}
