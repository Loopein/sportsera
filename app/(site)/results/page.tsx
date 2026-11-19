import Link from "next/link";
import { getMatches } from "@/lib/api/read";

export const revalidate = 30;

export default async function ResultsPage(): Promise<React.ReactElement> {
  const results = await getMatches("completed");

  return (
    <div className="space-y-5">
      <section>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Results</h1>
        <p className="mt-1 text-sm text-slate-600">Completed match outcomes.</p>
      </section>
      <div className="space-y-3">
        {results.map((match) => (
          <Link
            key={match.id}
            href={`/matches/${match.id}`}
            className="block rounded-xl border border-slate-200 bg-white p-4 hover:border-brand-300"
          >
            <p className="font-semibold text-slate-900">
              {match.teamA.name} vs {match.teamB.name}
            </p>
            <p className="text-sm text-slate-600">{match.resultText}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}

