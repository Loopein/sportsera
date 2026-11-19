import Link from "next/link";
import type { MatchSummary } from "@/types/match";

export function FixturesList({ matches }: { matches: MatchSummary[] }): React.ReactElement {
  return (
    <div className="space-y-3">
      {matches.map((match) => (
        <Link
          key={match.id}
          href={`/matches/${match.id}`}
          className="block rounded-xl border border-slate-200 bg-white p-4 hover:border-brand-300"
        >
          <p className="text-sm font-semibold text-slate-900">
            {match.teamA.shortName} vs {match.teamB.shortName}
          </p>
          <p className="mt-1 text-sm text-slate-600">{match.venue}</p>
        </Link>
      ))}
    </div>
  );
}

