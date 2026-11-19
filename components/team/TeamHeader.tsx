import type { TeamProfile } from "@/types/team";

export function TeamHeader({ team }: { team: TeamProfile }): React.ReactElement {
  return (
    <header className="rounded-xl border border-slate-200 bg-white p-5">
      <h1 className="text-2xl font-bold text-slate-900">{team.name}</h1>
      <p className="mt-2 text-sm text-slate-700">
        Captain: {team.captain ?? "-"} | Coach: {team.coach ?? "-"}
      </p>
      <p className="text-sm text-slate-700">Home: {team.homeGround ?? "-"}</p>
    </header>
  );
}

