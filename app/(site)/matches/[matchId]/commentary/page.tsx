import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CommentaryLive } from "@/app/(site)/matches/[matchId]/CommentaryLive";
import { MatchTabs } from "@/app/(site)/matches/[matchId]/MatchTabs";
import { JsonLd } from "@/components/seo/JsonLd";
import { AdSlot } from "@/components/shared/AdSlot";
import { getMatchCommentary, getMatchSummary } from "@/lib/api/read";
import { buildBreadcrumbJsonLd, buildSportsEventJsonLd } from "@/lib/seo/jsonld";
import { buildPageMetadata } from "@/lib/seo/metadata";

type CommentaryPageProps = {
  params: Promise<{ matchId: string }>;
};

export async function generateMetadata({ params }: CommentaryPageProps): Promise<Metadata> {
  const { matchId } = await params;
  const match = await getMatchSummary(matchId);
  if (!match) {
    return buildPageMetadata({
      title: "Match Commentary Not Found",
      description: "The requested match commentary could not be found.",
      path: `/matches/${matchId}/commentary`,
      noIndex: true
    });
  }

  return buildPageMetadata({
    title: `${match.teamA.shortName} vs ${match.teamB.shortName} Live Commentary`,
    description: `Ball-by-ball and play-by-play commentary for ${match.teamA.name} vs ${match.teamB.name} (${match.seriesName}).`,
    path: `/matches/${match.id}/commentary`,
    keywords: [match.teamA.name, match.teamB.name, match.seriesName, "live commentary", "play-by-play"]
  });
}

export default async function CommentaryPage({ params }: CommentaryPageProps): Promise<React.ReactElement> {
  const { matchId } = await params;
  const [summary, commentary] = await Promise.all([getMatchSummary(matchId), getMatchCommentary(matchId)]);
  if (!summary) notFound();

  return (
    <div className="space-y-4">
      <JsonLd
        data={[
          buildSportsEventJsonLd(summary, `/matches/${summary.id}/commentary`),
          buildBreadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "Matches", path: "/matches" },
            { name: `${summary.teamA.shortName} vs ${summary.teamB.shortName}`, path: `/matches/${summary.id}` },
            { name: "Commentary", path: `/matches/${summary.id}/commentary` }
          ])
        ]}
      />
      <MatchTabs matchId={summary.id} currentPath={`/matches/${summary.id}/commentary`} status={summary.status} />
      <AdSlot variant="in-feed" label="Sponsored · Live Commentary" />
      <CommentaryLive matchId={summary.id} initialItems={commentary} />
      <AdSlot variant="leaderboard" label="Sponsored · Commentary Desk Banner" />
    </div>
  );
}

