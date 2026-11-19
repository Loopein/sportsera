import Link from "next/link";
import { BiBroadcast } from "react-icons/bi";
import { FiPlay } from "react-icons/fi";
import type { LiveMatch } from "@/types/match";
import { Card } from "@/components/ui/card";

export function ScoreStrip({ matches }: { matches: LiveMatch[] }): React.ReactElement {
  return (
    <Card className="overflow-x-auto p-2">
      <ul className="flex min-w-max gap-2">
        {matches.map((match) => (
          <li key={match.id}>
            <Link
              href={`/matches/${match.id}`}
              className="block min-w-[240px] rounded-xl border border-slate-200 bg-gradient-to-b from-white to-slate-50 px-3 py-2 text-xs transition hover:border-brand-300 hover:shadow-sm"
            >
              <div className="mb-1 flex items-center justify-between gap-2">
                <p className="inline-flex items-center rounded-full bg-red-50 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-red-700">
                  <BiBroadcast className="mr-1 h-3 w-3 animate-pulse-soft" aria-hidden="true" />
                  Live
                </p>
                <span className="inline-flex items-center gap-1 rounded-full bg-brand-50 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-brand-700">
                  Watch
                  <FiPlay className="h-3 w-3" aria-hidden="true" />
                </span>
              </div>
              <p className="font-bold text-slate-900">
                {match.teamA.shortName} {match.teamA.score}
              </p>
              <p className="font-bold text-slate-900">
                {match.teamB.shortName} {match.teamB.score}
              </p>
              <p className="mt-1 truncate text-slate-600">{match.summary}</p>
            </Link>
          </li>
        ))}
      </ul>
    </Card>
  );
}

