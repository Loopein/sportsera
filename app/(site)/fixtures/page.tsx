import Link from "next/link";
import { getMatches } from "@/lib/api/read";

export default async function FixturesPage(): Promise<React.ReactElement> {
  const fixtures = await getMatches("upcoming");

  return (
    <div className="space-y-5">
      <section>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Fixtures</h1>
        <p className="mt-1 text-sm text-slate-600">Upcoming matches and schedule.</p>
      </section>
      <div className="space-y-3">
        {fixtures.map((match) => (
          <Link
            key={match.id}
            href={`/matches/${match.id}`}
            className="block rounded-xl border border-slate-200 bg-white p-4 hover:border-brand-300"
          >
            <p className="font-semibold text-slate-900">
              {match.teamA.name} vs {match.teamB.name}
            </p>
            <p className="text-sm text-slate-600">
              {match.seriesName} - {match.venue}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}

