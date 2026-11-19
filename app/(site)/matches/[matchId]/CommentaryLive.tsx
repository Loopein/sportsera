"use client";

import { useCallback, useRef, useState } from "react";
import { CommentaryFeed } from "@/components/match/CommentaryFeed";
import { ErrorState } from "@/components/shared/ErrorState";
import { usePolling } from "@/hooks/usePolling";
import { API_ENDPOINTS } from "@/lib/api/endpoints";
import { toEtagFromData } from "@/lib/utils/data-version";
import { mergeStableListById } from "@/lib/utils/stable-update";
import type { CommentaryItem } from "@/types/match";

type CommentaryResponse = {
  data: CommentaryItem[];
};

export function CommentaryLive({
  matchId,
  initialItems
}: {
  matchId: string;
  initialItems: CommentaryItem[];
}): React.ReactElement {
  const [items, setItems] = useState(initialItems);
  const [error, setError] = useState("");
  const etagRef = useRef<string>(toEtagFromData(initialItems));

  const refresh = useCallback(async () => {
    try {
      const response = await fetch(API_ENDPOINTS.commentary(matchId), {
        cache: "no-store",
        headers: { "If-None-Match": etagRef.current }
      });
      if (response.status === 304) {
        setError("");
        return;
      }
      if (!response.ok) throw new Error("Failed to refresh commentary");
      const json = (await response.json()) as CommentaryResponse;
      const nextEtag = response.headers.get("etag");
      if (nextEtag) etagRef.current = nextEtag;
      setItems((previous) => mergeStableListById(previous, json.data));
      setError("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    }
  }, [matchId]);

  usePolling(refresh, 7_000, { leading: false });

  return (
    <div className="space-y-4">
      {error ? <ErrorState message={error} /> : null}
      <CommentaryFeed items={items} />
    </div>
  );
}
