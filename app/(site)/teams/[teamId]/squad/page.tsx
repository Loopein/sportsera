import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { TeamTabs } from "@/app/(site)/teams/[teamId]/TeamTabs";
import { TeamSquad } from "@/components/team/TeamSquad";
import { JsonLd } from "@/components/seo/JsonLd";
import { AdSlot } from "@/components/shared/AdSlot";
import { getTeam } from "@/lib/api/read";
import { buildBreadcrumbJsonLd, buildSportsTeamJsonLd } from "@/lib/seo/jsonld";
import { buildPageMetadata } from "@/lib/seo/metadata";

type TeamSquadProps = {
  params: Promise<{ teamId: string }>;
};

export async function generateMetadata({ params }: TeamSquadProps): Promise<Metadata> {
  const { teamId } = await params;
  const team = await getTeam(teamId);
  if (!team) {
    return buildPageMetadata({
      title: "Team Squad Not Found",
      description: "The requested team squad could not be found.",
      path: `/teams/${teamId}/squad`,
      noIndex: true
    });
  }

  return buildPageMetadata({
    title: `${team.name} Squad & Player Roster`,
    description: `Full squad list, player roles, captains, and keepers for ${team.name} (${team.shortName}).`,
    path: `/teams/${team.id}/squad`,
    keywords: [team.name, team.shortName, "squad", "roster", "players"]
  });
}

export default async function TeamSquadPage({ params }: TeamSquadProps): Promise<React.ReactElement> {
  const { teamId } = await params;
  const team = await getTeam(teamId);
  if (!team) notFound();

  return (
    <div className="space-y-4">
      <JsonLd
        data={[
          buildSportsTeamJsonLd(team, `/teams/${team.id}/squad`),
          buildBreadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "Teams", path: "/teams" },
            { name: team.name, path: `/teams/${team.id}` },
            { name: "Squad", path: `/teams/${team.id}/squad` }
          ])
        ]}
      />
      <TeamTabs teamId={team.id} currentPath={`/teams/${team.id}/squad`} />
      <TeamSquad members={team.squad} />
      <AdSlot variant="leaderboard" label="Sponsored · Squad Lineup" />
    </div>
  );
}

