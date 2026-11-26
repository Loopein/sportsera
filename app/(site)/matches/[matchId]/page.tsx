import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { MatchSummaryLive } from "@/app/(site)/matches/[matchId]/MatchSummaryLive";
import { MatchTabs } from "@/app/(site)/matches/[matchId]/MatchTabs";
import { JsonLd } from "@/components/seo/JsonLd";
import { AdSlot } from "@/components/shared/AdSlot";
import { getMatchSummary } from "@/lib/api/read";
import { buildBreadcrumbJsonLd, buildSportsEventJsonLd } from "@/lib/seo/jsonld";
import { buildPageMetadata } from "@/lib/seo/metadata";

type MatchPageProps = {
  params: Promise<{ matchId: string }>;
};

export async function generateMetadata({ params }: MatchPageProps): Promise<Metadata> {
  const { matchId } = await params;
  const match = await getMatchSummary(matchId);
  if (!match) {
    return buildPageMetadata({
      title: "Match Not Found",
      description: "The requested match could not be found.",
      path: `/matches/${matchId}`,
      noIndex: true
    });
  }
  return buildPageMetadata({
    title: `${match.teamA.shortName} vs ${match.teamB.shortName} - ${match.seriesName}`,
    description:
      match.resultText ||
      `${match.teamA.name} vs ${match.teamB.name} (${match.format}) in ${match.seriesName} at ${match.venue}. Live score updates and match summary.`,
    path: `/matches/${match.id}`,
    keywords: [match.teamA.name, match.teamB.name, match.seriesName, match.format, "live score"]
  });
}

export default async function MatchPage({ params }: MatchPageProps): Promise<React.ReactElement> {
  const { matchId } = await params;
  const match = await getMatchSummary(matchId);
  if (!match) notFound();
  if (match.status === "live" || match.status === "innings_break") {
    redirect(`/matches/${match.id}/scorecard`);
  }

  return (
    <div className="space-y-4">
      <JsonLd
        data={[
          buildSportsEventJsonLd(match, `/matches/${match.id}`),
          buildBreadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "Matches", path: "/matches" },
            { name: `${match.teamA.shortName} vs ${match.teamB.shortName}`, path: `/matches/${match.id}` }
          ])
        ]}
      />
      <MatchTabs matchId={match.id} currentPath={`/matches/${match.id}`} status={match.status} />
      <AdSlot variant="in-feed" label="Sponsored · Match Summary" />
      <MatchSummaryLive initialMatch={match} />
      <AdSlot variant="leaderboard" label="Sponsored · Match Center" />
    </div>
  );
}

