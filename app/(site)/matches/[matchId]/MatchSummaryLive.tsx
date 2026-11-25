"use client";

import { memo } from "react";
import { MatchHeader } from "@/components/match/MatchHeader";
import { MatchInfo } from "@/components/match/MatchInfo";
import { OverSummary } from "@/components/match/OverSummary";
import { AdSlot } from "@/components/shared/AdSlot";
import { ErrorState } from "@/components/shared/ErrorState";
import { Card } from "@/components/ui/card";
import { useMatch } from "@/hooks/useMatch";
import type { MatchSummary } from "@/types/match";

const EMPTY_OVERS: string[] = [];

function getInitials(name: string): string {
  return (
    name
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase())
      .join("") || "PL"
  );
}

const CurrentPlayersPanel = memo(
  function CurrentPlayersPanelComponent({
    batters,
    bowlers
  }: {
    batters: MatchSummary["currentBatters"];
    bowlers: MatchSummary["currentBowlers"];
  }): React.ReactElement {
    const activeBatters = batters ?? [];
    const activeBowlers = bowlers ?? [];
    const hasPlayers = activeBatters.length > 0 || activeBowlers.length > 0;

    return (
      <Card as="section" className="min-w-0 p-4 sm:p-5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 className="text-base font-extrabold tracking-tight text-slate-900">Current Players</h2>
          <span className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider text-slate-500">
            Crease &amp; Attack
          </span>
        </div>

        {hasPlayers ? (
          <div className="mt-4 space-y-4">
            {activeBatters.length ? (
              <div className="space-y-2">
                <p className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500">Batters at Crease</p>
                <div className="space-y-2">
                  {activeBatters.map((batter) => (
                    <div
                      key={batter.name}
                      className="flex items-center justify-between gap-3 rounded-xl border border-slate-200/75 bg-slate-50/80 px-3.5 py-2.5"
                    >
                      <div className="flex min-w-0 items-center gap-2.5">
                        <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-brand-200 bg-brand-50 text-[11px] font-extrabold text-brand-700">
                          {getInitials(batter.name)}
                        </span>
                        <span className="truncate text-sm font-bold text-slate-900">{batter.name}</span>
                      </div>
                      <span className="score-pill shrink-0 tabular-nums">
                        {batter.runs} ({batter.balls})
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ) : null}

            {activeBowlers.length ? (
              <div className="space-y-2">
                <p className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500">Current Bowlers</p>
                <div className="space-y-2">
                  {activeBowlers.map((bowler) => (
                    <div
                      key={bowler.name}
                      className="flex items-center justify-between gap-3 rounded-xl border border-slate-200/75 bg-slate-50/80 px-3.5 py-2.5"
                    >
                      <div className="flex min-w-0 items-center gap-2.5">
                        <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-slate-300 bg-white text-[11px] font-extrabold text-slate-700">
                          {getInitials(bowler.name)}
                        </span>
                        <span className="truncate text-sm font-bold text-slate-900">{bowler.name}</span>
                      </div>
                      <span className="rounded-full border border-slate-200 bg-white px-2.5 py-1 text-xs font-extrabold tabular-nums text-slate-800 shadow-xs">
                        {bowler.overs}-{bowler.wickets}-{bowler.runs}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ) : null}
          </div>
        ) : (
          <p className="mt-4 rounded-xl border border-dashed border-slate-200 bg-slate-50/70 px-4 py-6 text-center text-sm text-slate-500">
            Active batter and bowler figures will appear once play is underway.
          </p>
        )}
      </Card>
    );
  },
  (previous, next) => previous.batters === next.batters && previous.bowlers === next.bowlers
);

CurrentPlayersPanel.displayName = "CurrentPlayersPanel";

export function MatchSummaryLive({ initialMatch }: { initialMatch: MatchSummary }): React.ReactElement {
  const { match, error } = useMatch(initialMatch, 7_000);
  const recentOvers = match.recentOvers ?? EMPTY_OVERS;

  return (
    <div className="space-y-4">
      {error ? <ErrorState message={error} /> : null}
      <MatchHeader match={match} />
      <div className="grid gap-4 lg:grid-cols-2">
        <MatchInfo match={match} />
        <CurrentPlayersPanel batters={match.currentBatters} bowlers={match.currentBowlers} />
      </div>
      <AdSlot variant="native-card" label="Sponsored · Live Match Center" />
      <OverSummary overs={recentOvers} />
    </div>
  );
}

