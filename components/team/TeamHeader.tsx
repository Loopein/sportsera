import { FiMapPin, FiShield, FiUser, FiUsers } from "react-icons/fi";
import type { TeamProfile } from "@/types/team";
import { Card } from "@/components/ui/card";

export function TeamHeader({ team }: { team: TeamProfile }): React.ReactElement {
  const captainName = team.captain ?? team.squad.find((m) => m.isCaptain)?.name ?? "-";

  return (
    <Card as="header" variant="strong" className="page-hero-card p-4 sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex min-w-0 items-center gap-3 sm:gap-4">
          <span className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-brand-200 bg-brand-50 text-base font-black text-brand-700 shadow-sm sm:h-16 sm:w-16 sm:text-lg">
            {team.shortName.slice(0, 3)}
          </span>
          <div className="min-w-0">
            <span className="inline-flex items-center gap-1 rounded-full bg-brand-100 px-2.5 py-0.5 text-[11px] font-extrabold uppercase tracking-wider text-brand-800">
              <FiShield className="h-3 w-3" aria-hidden="true" />
              {team.shortName}
            </span>
            <h1 className="mt-1 truncate text-xl font-black tracking-tight text-slate-900 sm:text-3xl">
              {team.name}
            </h1>
          </div>
        </div>
        <span className="score-pill">{team.squad.length} squad members</span>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-3">
        <div className="rounded-xl border border-slate-200/80 bg-white/90 p-3.5">
          <p className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-500">
            <FiUser className="h-3.5 w-3.5 text-brand-600" aria-hidden="true" />
            Captain
          </p>
          <p className="mt-1 truncate text-sm font-extrabold text-slate-900">{captainName}</p>
        </div>
        <div className="rounded-xl border border-slate-200/80 bg-white/90 p-3.5">
          <p className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-500">
            <FiUsers className="h-3.5 w-3.5 text-brand-600" aria-hidden="true" />
            Head Coach
          </p>
          <p className="mt-1 truncate text-sm font-extrabold text-slate-900">{team.coach ?? "-"}</p>
        </div>
        <div className="rounded-xl border border-slate-200/80 bg-white/90 p-3.5">
          <p className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-500">
            <FiMapPin className="h-3.5 w-3.5 text-brand-600" aria-hidden="true" />
            Home Ground
          </p>
          <p className="mt-1 truncate text-sm font-extrabold text-slate-900">{team.homeGround ?? "-"}</p>
        </div>
      </div>
    </Card>
  );
}
