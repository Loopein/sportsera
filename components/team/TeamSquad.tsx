import type { TeamSquadMember } from "@/types/team";

export function TeamSquad({ members }: { members: TeamSquadMember[] }): React.ReactElement {
  return (
    <section className="rounded-xl border border-slate-200 bg-white p-5">
      <h2 className="text-base font-semibold text-slate-900">Squad</h2>
      <ul className="mt-3 space-y-2">
        {members.map((member) => (
          <li key={member.playerId} className="rounded-md bg-slate-50 px-3 py-2 text-sm text-slate-700">
            {member.name} - {member.role}
            {member.isCaptain ? " (C)" : ""}
            {member.isWicketKeeper ? " (WK)" : ""}
          </li>
        ))}
      </ul>
    </section>
  );
}

