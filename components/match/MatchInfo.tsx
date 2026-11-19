import { memo } from "react";
import type { MatchSummary } from "@/types/match";
import { formatRunRate } from "@/lib/utils/score";
import { formatTime } from "@/lib/utils/date";

function MatchInfoComponent({ match }: { match: MatchSummary }): React.ReactElement {
  return (
    <section className="rounded-xl border border-slate-200 bg-white p-5">
      <h2 className="text-base font-semibold text-slate-900">Match Info</h2>
      <dl className="mt-3 grid gap-2 text-sm text-slate-700">
        <div className="flex justify-between gap-4">
          <dt>Venue</dt>
          <dd className="text-right">{match.venue}</dd>
        </div>
        <div className="flex justify-between gap-4">
          <dt>Toss</dt>
          <dd className="text-right">{match.toss ?? "-"}</dd>
        </div>
        <div className="flex justify-between gap-4">
          <dt>Current RR</dt>
          <dd>{formatRunRate(match.currentRunRate)}</dd>
        </div>
        <div className="flex justify-between gap-4">
          <dt>Required RR</dt>
          <dd>{formatRunRate(match.requiredRunRate)}</dd>
        </div>
        {match.lastUpdatedAt ? (
          <div className="flex justify-between gap-4">
            <dt>Last Update</dt>
            <dd>{formatTime(match.lastUpdatedAt)}</dd>
          </div>
        ) : null}
      </dl>
    </section>
  );
}

export const MatchInfo = memo(
  MatchInfoComponent,
  (previous, next) =>
    previous.match.venue === next.match.venue &&
    previous.match.toss === next.match.toss &&
    previous.match.currentRunRate === next.match.currentRunRate &&
    previous.match.requiredRunRate === next.match.requiredRunRate &&
    previous.match.lastUpdatedAt === next.match.lastUpdatedAt
);

MatchInfo.displayName = "MatchInfo";

