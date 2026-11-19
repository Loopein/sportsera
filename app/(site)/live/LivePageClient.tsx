"use client";

import { memo } from "react";
import { FiRefreshCw } from "react-icons/fi";
import { LiveMatchList } from "@/components/live/LiveMatchList";
import { ErrorState } from "@/components/shared/ErrorState";
import { Card } from "@/components/ui/card";
import { useLiveMatches } from "@/hooks/useLiveMatches";
import type { LiveMatch } from "@/types/match";

const LiveRefreshStatus = memo(
  function LiveRefreshStatusComponent({
    isLoading,
    matchCount
  }: {
    isLoading: boolean;
    matchCount: number;
  }): React.ReactElement {
    return (
      <Card className="animate-reveal-up flex items-center justify-between gap-3 p-4 text-sm" interactive>
        <div className="flex items-center gap-2">
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-brand-100 text-brand-700">
            <FiRefreshCw className="h-4 w-4" aria-hidden="true" />
          </span>
          <span className="font-semibold text-slate-700">
            Auto-refresh every 10-15 seconds
            <span className="ml-2 rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-600">
              {isLoading ? "syncing" : "idle"}
            </span>
          </span>
        </div>
        <span className="rounded-full bg-brand-50 px-2.5 py-1 text-xs font-semibold text-brand-700">
          {matchCount} live match(es)
        </span>
      </Card>
    );
  },
  (previous, next) => previous.isLoading === next.isLoading && previous.matchCount === next.matchCount
);

LiveRefreshStatus.displayName = "LiveRefreshStatus";

export function LivePageClient({ initialMatches }: { initialMatches: LiveMatch[] }): React.ReactElement {
  const { matches, error, isLoading } = useLiveMatches(initialMatches, 12_000);

  return (
    <div className="space-y-4">
      <LiveRefreshStatus isLoading={isLoading} matchCount={matches.length} />
      {error ? <ErrorState message={error} /> : null}
      <LiveMatchList matches={matches} emptyCount={3} emptyLabel="No data found" />
    </div>
  );
}

