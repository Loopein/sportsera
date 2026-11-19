import { memo } from "react";
import { Card } from "@/components/ui/card";
import type { MatchSummary } from "@/types/match";
import { formatRunRate } from "@/lib/utils/score";
import { formatTime } from "@/lib/utils/date";

function MatchInfoComponent({ match }: { match: MatchSummary }): React.ReactElement {
  return (
    <Card as="section" className="p-5">
      <div className="flex items-center justify-between gap-2">
        <h2 className="text-base font-extrabold tracking-tight text-slate-900">Match Info</h2>
        <span className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider text-slate-500">
          {match.format}
        </span>
      </div>
      <dl className="mt-4 grid gap-2 text-sm text-slate-700">
        <div className="flex items-center justify-between gap-4 rounded-xl border border-slate-200/75 bg-slate-50/80 px-3.5 py-2.5">
          <dt className="text-xs font-bold uppercase tracking-wider text-slate-500">Venue</dt>
          <dd className="text-right font-semibold text-slate-900">{match.venue}</dd>
        </div>
        <div className="flex items-center justify-between gap-4 rounded-xl border border-slate-200/75 bg-slate-50/80 px-3.5 py-2.5">
          <dt className="text-xs font-bold uppercase tracking-wider text-slate-500">Toss</dt>
          <dd className="text-right font-semibold text-slate-900">{match.toss ?? "-"}</dd>
        </div>
        <div className="flex items-center justify-between gap-4 rounded-xl border border-slate-200/75 bg-slate-50/80 px-3.5 py-2.5">
          <dt className="text-xs font-bold uppercase tracking-wider text-slate-500">Current RR</dt>
          <dd className="font-bold tabular-nums text-slate-900">{formatRunRate(match.currentRunRate)}</dd>
        </div>
        <div className="flex items-center justify-between gap-4 rounded-xl border border-slate-200/75 bg-slate-50/80 px-3.5 py-2.5">
          <dt className="text-xs font-bold uppercase tracking-wider text-slate-500">Required RR</dt>
          <dd className="font-bold tabular-nums text-slate-900">{formatRunRate(match.requiredRunRate)}</dd>
        </div>
        {match.lastUpdatedAt ? (
          <div className="flex items-center justify-between gap-4 rounded-xl border border-slate-200/75 bg-slate-50/80 px-3.5 py-2.5">
            <dt className="text-xs font-bold uppercase tracking-wider text-slate-500">Last Update</dt>
            <dd className="font-semibold tabular-nums text-slate-900">{formatTime(match.lastUpdatedAt)}</dd>
          </div>
        ) : null}
      </dl>
    </Card>
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

