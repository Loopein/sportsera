"use client";

import { LiveMatchList } from "@/components/live/LiveMatchList";
import { ErrorState } from "@/components/shared/ErrorState";
import { useLiveMatches } from "@/hooks/useLiveMatches";
import type { LiveMatch } from "@/types/match";

export function LivePageClient({ initialMatches }: { initialMatches: LiveMatch[] }): React.ReactElement {
  const { matches, error } = useLiveMatches(initialMatches, 12_000);

  return (
    <div className="space-y-4">
      {error ? <ErrorState message={error} /> : null}
      <LiveMatchList matches={matches} emptyCount={3} emptyLabel="No data found" />
    </div>
  );
}
