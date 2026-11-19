import Link from "next/link";
import { FiUsers } from "react-icons/fi";
import type { TeamSquadMember } from "@/types/team";
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

export function TeamSquad({ members }: { members: TeamSquadMember[] }): React.ReactElement {
  return (
    <Card as="section" className="p-5 sm:p-6">
      <div className="flex items-center justify-between gap-2">
        <h2 className="inline-flex items-center gap-2 text-lg font-extrabold text-slate-900">
          <FiUsers className="h-4 w-4 text-brand-600" aria-hidden="true" />
          Squad
        </h2>
        <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-bold text-slate-600">
          {members.length} players
        </span>
      </div>

      {members.length ? (
        <ul className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {members.map((member, idx) => {
            const cardInner = (
              <div className="flex items-center gap-3 rounded-xl border border-slate-200/80 bg-slate-50/80 p-3 transition hover:border-brand-300 hover:bg-brand-50/50">
                <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-brand-200 bg-white text-xs font-black text-brand-700 shadow-sm">
                  {getInitials(member.name)}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <p className="truncate text-sm font-extrabold text-slate-900">{member.name}</p>
                    {member.isCaptain ? (
                      <span className="rounded bg-amber-100 px-1.5 py-0.5 text-[10px] font-black text-amber-800">
                        C
                      </span>
                    ) : null}
                    {member.isWicketKeeper ? (
                      <span className="rounded bg-emerald-100 px-1.5 py-0.5 text-[10px] font-black text-emerald-800">
                        WK
                      </span>
                    ) : null}
                  </div>
                  <p className="mt-0.5 truncate text-xs font-medium text-slate-500">{member.role}</p>
                </div>
              </div>
            );

            return (
              <li key={member.playerId || `${member.name}-${idx}`}>
                {member.playerId ? (
                  <Link href={`/players/${member.playerId}`} className="block">
                    {cardInner}
                  </Link>
                ) : (
                  cardInner
                )}
              </li>
            );
          })}
        </ul>
      ) : (
        <p className="mt-4 rounded-xl border border-dashed border-slate-200 bg-slate-50 p-6 text-center text-sm text-slate-500">
          Squad list has not been announced yet.
        </p>
      )}
    </Card>
  );
}
