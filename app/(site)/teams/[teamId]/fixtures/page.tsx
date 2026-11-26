import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { TeamTabs } from "@/app/(site)/teams/[teamId]/TeamTabs";
import { FixturesList } from "@/components/series/FixturesList";
import { JsonLd } from "@/components/seo/JsonLd";
import { AdSlot } from "@/components/shared/AdSlot";
import { getMatches, getTeam } from "@/lib/api/read";
import { buildBreadcrumbJsonLd, buildSportsTeamJsonLd } from "@/lib/seo/jsonld";
import { buildPageMetadata } from "@/lib/seo/metadata";

type TeamFixturesProps = {
  params: Promise<{ teamId: string }>;
};

export async function generateMetadata({ params }: TeamFixturesProps): Promise<Metadata> {
  const { teamId } = await params;
  const team = await getTeam(teamId);
  if (!team) {
    return buildPageMetadata({
      title: "Team Fixtures Not Found",
      description: "The requested team schedule could not be found.",
      path: `/teams/${teamId}/fixtures`,
      noIndex: true
    });
  }

  return buildPageMetadata({
    title: `${team.name} Fixtures & Results`,
    description: `Upcoming match schedule, recent results, and venues for ${team.name} (${team.shortName}).`,
    path: `/teams/${team.id}/fixtures`,
    keywords: [team.name, team.shortName, "fixtures", "results", "schedule"]
  });
}

export default async function TeamFixturesPage({ params }: TeamFixturesProps): Promise<React.ReactElement> {
  const { teamId } = await params;
  const [team, matches] = await Promise.all([getTeam(teamId), getMatches()]);
  if (!team) notFound();

  const teamMatches = matches.filter((match) => match.teamA.id === team.id || match.teamB.id === team.id);

  return (
    <div className="space-y-4">
      <JsonLd
        data={[
          buildSportsTeamJsonLd(team, `/teams/${team.id}/fixtures`),
          buildBreadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "Teams", path: "/teams" },
            { name: team.name, path: `/teams/${team.id}` },
            { name: "Fixtures", path: `/teams/${team.id}/fixtures` }
          ])
        ]}
      />
      <TeamTabs teamId={team.id} currentPath={`/teams/${team.id}/fixtures`} />
      <FixturesList matches={teamMatches} />
      <AdSlot variant="leaderboard" label="Sponsored · Team Schedule" />
    </div>
  );
}
