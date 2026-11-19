import { notFound } from "next/navigation";
import { TeamTabs } from "@/app/(site)/teams/[teamId]/TeamTabs";
import { TeamHeader } from "@/components/team/TeamHeader";
import { TeamSquad } from "@/components/team/TeamSquad";
import { getTeam } from "@/lib/api/read";

type TeamOverviewProps = {
  params: Promise<{ teamId: string }>;
};

export default async function TeamOverviewPage({ params }: TeamOverviewProps): Promise<React.ReactElement> {
  const { teamId } = await params;
  const team = await getTeam(teamId);
  if (!team) notFound();

  return (
    <div className="space-y-4">
      <TeamTabs teamId={team.id} currentPath={`/teams/${team.id}`} />
      <TeamHeader team={team} />
      <TeamSquad members={team.squad} />
    </div>
  );
}

