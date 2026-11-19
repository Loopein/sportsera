import Link from "next/link";
import { getTeams } from "@/lib/api/read";

export default async function TeamsPage(): Promise<React.ReactElement> {
  const teams = await getTeams();

  return (
    <div className="space-y-5">
      <section>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Teams</h1>
        <p className="mt-1 text-sm text-slate-600">National and franchise team profiles.</p>
      </section>
      <div className="grid gap-4 md:grid-cols-2">
        {teams.map((team) => (
          <Link
            key={team.id}
            href={`/teams/${team.id}`}
            className="rounded-xl border border-slate-200 bg-white p-4 hover:border-brand-300"
          >
            <p className="text-lg font-semibold text-slate-900">{team.name}</p>
            <p className="text-sm text-slate-600">Captain: {team.captain ?? "-"}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}

