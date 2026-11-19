import Link from "next/link";
import { FiArrowRight, FiMapPin } from "react-icons/fi";
import type { MatchSummary } from "@/types/match";
import { MatchStatusBadge } from "@/components/live/MatchStatusBadge";
import { Card } from "@/components/ui/card";

export function FixturesList({ matches }: { matches: MatchSummary[] }): React.ReactElement {
  if (!matches.length) {
    return (
      <Card className="border-dashed border-slate-200 bg-white/85 p-6 text-center text-sm text-slate-500">
        No matches found for this selection.
      </Card>
    );
  }

  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {matches.map((match) => {
        const href =
          match.status === "upcoming"
            ? `/matches/${match.id}/squads`
            : match.status === "live" || match.status === "innings_break"
              ? `/matches/${match.id}/scorecard`
              : `/matches/${match.id}`;

        return (
          <Link
            key={match.id}
            href={href}
            className="group block rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
          >
            <Card
              interactive
              className="flex h-full flex-col justify-between p-4 transition-all duration-200 group-hover:-translate-y-0.5 group-hover:border-brand-300 group-hover:shadow-md"
            >
              <div>
                <div className="flex items-center justify-between gap-2">
                  <span className="truncate text-xs font-bold uppercase tracking-wider text-slate-500">
                    {match.seriesName} · {match.format}
                  </span>
                  <MatchStatusBadge status={match.status} />
                </div>

                <div className="mt-3 flex items-center justify-between gap-3 rounded-xl bg-slate-50 p-3">
                  <div className="flex min-w-0 items-center gap-2">
                    <span className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-brand-100 text-[11px] font-black text-brand-700">
                      {match.teamA.shortName.slice(0, 3)}
                    </span>
                    <span className="truncate text-sm font-extrabold text-slate-900">{match.teamA.shortName}</span>
                    {match.teamA.score ? (
                      <span className="text-xs font-bold tabular-nums text-slate-600">{match.teamA.score}</span>
                    ) : null}
                  </div>
                  <span className="text-xs font-bold uppercase text-slate-400">vs</span>
                  <div className="flex min-w-0 items-center gap-2">
                    {match.teamB.score ? (
                      <span className="text-xs font-bold tabular-nums text-slate-600">{match.teamB.score}</span>
                    ) : null}
                    <span className="truncate text-sm font-extrabold text-slate-900">{match.teamB.shortName}</span>
                    <span className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-indigo-100 text-[11px] font-black text-indigo-800">
                      {match.teamB.shortName.slice(0, 3)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-3 flex items-center justify-between gap-2 text-xs text-slate-500">
                <span className="inline-flex min-w-0 items-center gap-1 truncate">
                  <FiMapPin className="h-3.5 w-3.5 shrink-0 text-slate-400" aria-hidden="true" />
                  <span className="truncate">{match.venue}</span>
                </span>
                <FiArrowRight className="h-3.5 w-3.5 shrink-0 text-brand-700 transition-transform duration-200 group-hover:translate-x-1" aria-hidden="true" />
              </div>
            </Card>
          </Link>
        );
      })}
    </div>
  );
}
