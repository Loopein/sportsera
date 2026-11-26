import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { TeamTabs } from "@/app/(site)/teams/[teamId]/TeamTabs";
import { TeamHeader } from "@/components/team/TeamHeader";
import { TeamSquad } from "@/components/team/TeamSquad";
import { JsonLd } from "@/components/seo/JsonLd";
import { AdSlot } from "@/components/shared/AdSlot";
import { getTeam } from "@/lib/api/read";
import { buildBreadcrumbJsonLd, buildSportsTeamJsonLd } from "@/lib/seo/jsonld";
import { buildPageMetadata } from "@/lib/seo/metadata";

type TeamOverviewProps = {
  params: Promise<{ teamId: string }>;
};

export async function generateMetadata({ params }: TeamOverviewProps): Promise<Metadata> {
  const { teamId } = await params;
  const team = await getTeam(teamId);
  if (!team) {
    return buildPageMetadata({
      title: "Team Not Found",
      description: "The requested team profile could not be found.",
      path: `/teams/${teamId}`,
      noIndex: true
    });
  }

  return buildPageMetadata({
    title: `${team.name} (${team.shortName}) Profile & Squad`,
    description: `${team.name} team overview, captain, coach, home ground (${team.homeGround ?? "TBD"}), and active squad roster.`,
    path: `/teams/${team.id}`,
    keywords: [team.name, team.shortName, "team squad", "fixtures"]
  });
}

export default async function TeamOverviewPage({ params }: TeamOverviewProps): Promise<React.ReactElement> {
  const { teamId } = await params;
  const team = await getTeam(teamId);
  if (!team) notFound();

  return (
    <div className="space-y-4">
      <JsonLd
        data={[
          buildSportsTeamJsonLd(team, `/teams/${team.id}`),
          buildBreadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "Teams", path: "/teams" },
            { name: team.name, path: `/teams/${team.id}` }
          ])
        ]}
      />
      <TeamTabs teamId={team.id} currentPath={`/teams/${team.id}`} />
      <TeamHeader team={team} />
      <AdSlot variant="in-feed" label="Sponsored · Team Hub" />
      <TeamSquad members={team.squad} />
      <AdSlot variant="leaderboard" label="Sponsored · Team Roster" />
    </div>
  );
}

