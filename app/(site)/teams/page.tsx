import Link from "next/link";
import { FiArrowRight, FiMapPin, FiShield, FiUsers } from "react-icons/fi";
import { AdSlot } from "@/components/shared/AdSlot";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/shared/EmptyState";
import { getTeams } from "@/lib/api/read";

export const revalidate = 60;

export default async function TeamsPage(): Promise<React.ReactElement> {
  const teams = await getTeams();

  return (
    <div className="space-y-6">
      <Card as="section" variant="strong" className="page-hero-card p-4 sm:p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-700 ring-1 ring-brand-200/80">
              <FiShield className="h-5 w-5" aria-hidden="true" />
            </span>
            <div className="min-w-0">
              <p className="text-xs font-extrabold uppercase tracking-wider text-brand-700">
                National Teams &amp; Global Clubs
              </p>
              <h1 className="mt-0.5 text-2xl font-black tracking-tight text-slate-900 sm:text-3xl">Teams</h1>
              <p className="mt-1 text-sm text-slate-600">
                Explore team profiles, home arenas, active squads, and upcoming fixtures across every sport.
              </p>
            </div>
          </div>
          <span className="score-pill">{teams.length} teams</span>
        </div>
      </Card>

      <AdSlot variant="in-feed" label="Sponsored · Teams Hub" />

      {teams.length ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {teams.map((team) => (
            <Link
              key={team.id}
              href={`/teams/${team.id}`}
              className="group block min-w-0 rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
            >
              <Card
                as="article"
                interactive
                className="flex h-full flex-col justify-between p-4 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:border-brand-300 group-hover:shadow-lg sm:p-5"
              >
                <div>
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex min-w-0 items-center gap-3.5">
                      <span className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-brand-200 bg-brand-50 text-sm font-black text-brand-700 shadow-sm">
                        {team.shortName.slice(0, 3)}
                      </span>
                      <div className="min-w-0">
                        <p className="truncate text-lg font-extrabold text-slate-900 group-hover:text-brand-700">
                          {team.name}
                        </p>
                        <span className="inline-flex items-center rounded-md bg-slate-100 px-2 py-0.5 text-[11px] font-bold uppercase tracking-wider text-slate-600">
                          {team.shortName}
                        </span>
                      </div>
                    </div>
                    <span className="inline-flex items-center gap-1 rounded-full bg-brand-50 px-2.5 py-1 text-xs font-bold text-brand-700">
                      <FiUsers className="h-3.5 w-3.5" aria-hidden="true" />
                      {team.squad.length}
                    </span>
                  </div>

                  <div className="mt-4 space-y-1.5 rounded-xl bg-slate-50/90 p-3 text-xs text-slate-600">
                    <p className="flex items-center justify-between gap-2">
                      <span className="font-semibold text-slate-500">Captain</span>
                      <span className="truncate font-bold text-slate-800">
                        {team.captain ?? team.squad.find((m) => m.isCaptain)?.name ?? "-"}
                      </span>
                    </p>
                    <p className="flex items-center justify-between gap-2">
                      <span className="inline-flex items-center gap-1 font-semibold text-slate-500">
                        <FiMapPin className="h-3 w-3" aria-hidden="true" />
                        Home Ground
                      </span>
                      <span className="truncate font-bold text-slate-800">{team.homeGround ?? "-"}</span>
                    </p>
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3 text-xs font-bold uppercase tracking-wider text-brand-700">
                  <span>View Squad &amp; Fixtures</span>
                  <FiArrowRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-1" aria-hidden="true" />
                </div>
              </Card>
            </Link>
          ))}
        </div>
      ) : (
        <EmptyState title="No teams available" description="Teams will appear here once added." />
      )}
      <AdSlot variant="leaderboard" label="Sponsored · Team Directory" />
    </div>
  );
}
