import { memo } from "react";
import type { MatchSummary } from "@/types/match";
import { MatchStatusBadge } from "@/components/live/MatchStatusBadge";
import { Card } from "@/components/ui/card";

function MatchHeaderComponent({ match }: { match: MatchSummary }): React.ReactElement {
  return (
    <Card as="header" className="p-5">
      <div className="mb-4 flex items-center justify-between gap-4">
        <p className="text-sm font-medium text-slate-600">
          {match.seriesName} - {match.format}
        </p>
        <MatchStatusBadge status={match.status} />
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-lg bg-slate-50 p-3">
          <p className="text-lg font-semibold text-slate-900">{match.teamA.name}</p>
          <p className="text-sm text-slate-700">{match.teamA.score ?? "-"}</p>
        </div>
        <div className="rounded-lg bg-slate-50 p-3">
          <p className="text-lg font-semibold text-slate-900">{match.teamB.name}</p>
          <p className="text-sm text-slate-700">{match.teamB.score ?? "-"}</p>
        </div>
      </div>
      {match.resultText ? <p className="mt-4 text-sm font-medium text-slate-800">{match.resultText}</p> : null}
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

