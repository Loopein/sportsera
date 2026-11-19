"use client";

import { memo } from "react";
import { MatchHeader } from "@/components/match/MatchHeader";
import { MatchInfo } from "@/components/match/MatchInfo";
import { OverSummary } from "@/components/match/OverSummary";
import { ErrorState } from "@/components/shared/ErrorState";
import { useMatch } from "@/hooks/useMatch";
import type { MatchSummary } from "@/types/match";

const EMPTY_OVERS: string[] = [];

const MatchSyncStatus = memo(
  function MatchSyncStatusComponent({ isLoading }: { isLoading: boolean }): React.ReactElement {
    return (
      <div className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-600">
        Live refresh every 5-8 seconds ({isLoading ? "syncing..." : "idle"})
      </div>
    );
  },
  (previous, next) => previous.isLoading === next.isLoading
);

MatchSyncStatus.displayName = "MatchSyncStatus";

const CurrentPlayersPanel = memo(
  function CurrentPlayersPanelComponent({
    batters,
    bowlers
  }: {
    batters: MatchSummary["currentBatters"];
    bowlers: MatchSummary["currentBowlers"];
  }): React.ReactElement {
    return (
      <section className="rounded-xl border border-slate-200 bg-white p-5">
        <h2 className="text-base font-semibold text-slate-900">Current Players</h2>
        <div className="mt-3 space-y-2">
          {(batters ?? []).map((batter) => (
            <p key={batter.name} className="text-sm text-slate-700">
              {batter.name}: {batter.runs} ({batter.balls})
            </p>
          ))}
          {(bowlers ?? []).map((bowler) => (
            <p key={bowler.name} className="text-sm text-slate-700">
              {bowler.name}: {bowler.overs}-{bowler.wickets}-{bowler.runs}
            </p>
          ))}
        </div>
      </section>
    );
  },
  (previous, next) => previous.batters === next.batters && previous.bowlers === next.bowlers
);

CurrentPlayersPanel.displayName = "CurrentPlayersPanel";

export function MatchSummaryLive({ initialMatch }: { initialMatch: MatchSummary }): React.ReactElement {
  const { match, error, isLoading } = useMatch(initialMatch, 7_000);
  const recentOvers = match.recentOvers ?? EMPTY_OVERS;

  return (
    <div className="space-y-4">
      <MatchSyncStatus isLoading={isLoading} />
      {error ? <ErrorState message={error} /> : null}
      <MatchHeader match={match} />
      <div className="grid gap-4 lg:grid-cols-2">
        <MatchInfo match={match} />
        <CurrentPlayersPanel batters={match.currentBatters} bowlers={match.currentBowlers} />
      </div>
      <OverSummary overs={recentOvers} />
    </div>
  );
}

