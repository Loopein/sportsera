import { memo } from "react";
import type { MatchSummary } from "@/types/match";
import { MatchStatusBadge } from "@/components/live/MatchStatusBadge";
import { Card } from "@/components/ui/card";

function teamMonogram(shortName: string | undefined, name: string): string {
  const raw = (shortName?.trim() || name.trim()).toUpperCase();
  return raw.slice(0, 3) || "TM";
}

function MatchHeaderComponent({ match }: { match: MatchSummary }): React.ReactElement {
  return (
    <Card as="header" variant="strong" className="p-5 sm:p-6">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <span className="inline-flex items-center rounded-full border border-slate-200 bg-white/90 px-3 py-1 text-xs font-extrabold uppercase tracking-wide text-slate-700 shadow-xs">
          {match.seriesName} · {match.format}
        </span>
        <MatchStatusBadge status={match.status} />
      </div>
      <div className="grid gap-3.5 md:grid-cols-2">
        <div className="flex items-center justify-between gap-3 rounded-2xl border border-slate-200/80 bg-white/90 p-4 shadow-sm">
          <div className="flex min-w-0 items-center gap-3">
            <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-brand-200/80 bg-brand-50 text-xs font-black tracking-wider text-brand-700">
              {teamMonogram(match.teamA.shortName, match.teamA.name)}
            </span>
            <div className="min-w-0">
              <p className="truncate text-base font-extrabold text-slate-900 sm:text-lg">{match.teamA.name}</p>
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">{match.teamA.shortName}</p>
            </div>
          </div>
          <p className="shrink-0 rounded-xl bg-slate-100/90 px-3 py-1.5 text-lg font-black tabular-nums text-slate-900 sm:text-xl">
            {match.teamA.score ?? "-"}
          </p>
        </div>

        <div className="flex items-center justify-between gap-3 rounded-2xl border border-slate-200/80 bg-white/90 p-4 shadow-sm">
          <div className="flex min-w-0 items-center gap-3">
            <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-slate-100 text-xs font-black tracking-wider text-slate-700">
              {teamMonogram(match.teamB.shortName, match.teamB.name)}
            </span>
            <div className="min-w-0">
              <p className="truncate text-base font-extrabold text-slate-900 sm:text-lg">{match.teamB.name}</p>
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">{match.teamB.shortName}</p>
            </div>
          </div>
          <p className="shrink-0 rounded-xl bg-slate-100/90 px-3 py-1.5 text-lg font-black tabular-nums text-slate-900 sm:text-xl">
            {match.teamB.score ?? "-"}
          </p>
        </div>
      </div>
      {match.resultText ? (
        <p className="mt-4 rounded-xl border border-brand-200/70 bg-brand-50/70 px-3.5 py-2.5 text-sm font-bold text-brand-900">
          {match.resultText}
        </p>
      ) : null}
    </Card>
  );
}

export const MatchHeader = memo(
  MatchHeaderComponent,
  (previous, next) =>
    previous.match.status === next.match.status &&
    previous.match.seriesName === next.match.seriesName &&
    previous.match.format === next.match.format &&
    previous.match.resultText === next.match.resultText &&
    previous.match.teamA === next.match.teamA &&
    previous.match.teamB === next.match.teamB
);

MatchHeader.displayName = "MatchHeader";

