import { FiActivity, FiAward, FiUser } from "react-icons/fi";
import type { PlayerProfile } from "@/types/player";
import { Card } from "@/components/ui/card";

function getInitials(name: string): string {
  return (
    name
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase())
      .join("") || "PL"
  );
}

export function PlayerHeader({ player }: { player: PlayerProfile }): React.ReactElement {
  return (
    <Card as="header" variant="strong" className="p-5 sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex min-w-0 items-center gap-4">
          <span className="inline-flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-brand-200 bg-brand-50 text-base font-black text-brand-700 shadow-sm sm:h-16 sm:w-16 sm:text-lg">
            {getInitials(player.name)}
          </span>
          <div className="min-w-0">
            <span className="inline-flex items-center gap-1 rounded-full bg-brand-100 px-2.5 py-0.5 text-[11px] font-extrabold uppercase tracking-wider text-brand-800">
              <FiUser className="h-3 w-3" aria-hidden="true" />
              {player.role}
            </span>
            <h1 className="mt-1 truncate text-2xl font-black tracking-tight text-slate-900 sm:text-3xl">
              {player.name}
            </h1>
          </div>
        </div>
        {player.teamId ? (
          <span className="score-pill uppercase">{player.teamId.replace(/^team-/, "")}</span>
        ) : null}
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <div className="rounded-xl border border-slate-200/80 bg-white/90 p-3.5">
          <p className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-500">
            <FiAward className="h-3.5 w-3.5 text-brand-600" aria-hidden="true" />
            Batting Style
          </p>
          <p className="mt-1 text-sm font-extrabold text-slate-900">{player.battingStyle ?? "-"}</p>
        </div>
        <div className="rounded-xl border border-slate-200/80 bg-white/90 p-3.5">
          <p className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-500">
            <FiActivity className="h-3.5 w-3.5 text-brand-600" aria-hidden="true" />
            Bowling Style
          </p>
          <p className="mt-1 text-sm font-extrabold text-slate-900">{player.bowlingStyle ?? "-"}</p>
        </div>
      </div>
    </Card>
  );
}
