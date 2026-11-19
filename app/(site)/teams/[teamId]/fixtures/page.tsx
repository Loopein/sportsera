import { notFound } from "next/navigation";
import { TeamTabs } from "@/app/(site)/teams/[teamId]/TeamTabs";
import { FixturesList } from "@/components/series/FixturesList";
import { AdSlot } from "@/components/shared/AdSlot";
import { getMatches, getTeam } from "@/lib/api/read";

type TeamFixturesProps = {
  params: Promise<{ teamId: string }>;
};

export default async function TeamFixturesPage({ params }: TeamFixturesProps): Promise<React.ReactElement> {
  const { teamId } = await params;
  const [team, matches] = await Promise.all([getTeam(teamId), getMatches()]);
  if (!team) notFound();

  const teamMatches = matches.filter((match) => match.teamA.id === team.id || match.teamB.id === team.id);

  return (
    <div className="space-y-4">
      <TeamTabs teamId={team.id} currentPath={`/teams/${team.id}/fixtures`} />
      <FixturesList matches={teamMatches} />
      <AdSlot variant="leaderboard" label="Sponsored · Team Schedule" />
    </div>
  );
}
