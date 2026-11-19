import { notFound } from "next/navigation";
import { TeamTabs } from "@/app/(site)/teams/[teamId]/TeamTabs";
import { TeamSquad } from "@/components/team/TeamSquad";
import { getTeam } from "@/lib/api/read";

type TeamSquadProps = {
  params: Promise<{ teamId: string }>;
};

export default async function TeamSquadPage({ params }: TeamSquadProps): Promise<React.ReactElement> {
  const { teamId } = await params;
  const team = await getTeam(teamId);
  if (!team) notFound();

  return (
    <div className="space-y-4">
      <TeamTabs teamId={team.id} currentPath={`/teams/${team.id}/squad`} />
      <TeamSquad members={team.squad} />
    </div>
  );
}

