import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MatchTabs } from "@/app/(site)/matches/[matchId]/MatchTabs";
import { SportsEraPlayerClient } from "@/components/player/SportsEraPlayerClient";
import { JsonLd } from "@/components/seo/JsonLd";
import { AdSlot } from "@/components/shared/AdSlot";
import {
  getLiveMatches,
  getMatchCommentary,
  getMatchSummary,
  getVideoPosts
} from "@/lib/api/read";
import { buildBreadcrumbJsonLd, buildSportsEventJsonLd } from "@/lib/seo/jsonld";
import { buildPageMetadata } from "@/lib/seo/metadata";

type WatchPageProps = {
  params: Promise<{ matchId: string }>;
};

export async function generateMetadata({ params }: WatchPageProps): Promise<Metadata> {
  const { matchId } = await params;
  const match = await getMatchSummary(matchId);
  if (!match) {
    return buildPageMetadata({
      title: "SportsEra Player",
      description: "Watch live sports streams and match highlights on SportsEra Player.",
      path: `/matches/${matchId}/watch`,
      noIndex: true
    });
  }
  return buildPageMetadata({
    title: `Watch ${match.teamA.shortName} vs ${match.teamB.shortName} - SportsEra Player`,
    description: `Live stream desk and match-related videos for ${match.teamA.name} vs ${match.teamB.name} (${match.seriesName}).`,
    path: `/matches/${match.id}/watch`,
    keywords: [match.teamA.name, match.teamB.name, match.seriesName, "watch live", "SportsEra Player"]
  });
}

export default async function MatchWatchPage({ params }: WatchPageProps): Promise<React.ReactElement> {
  const { matchId } = await params;
  const [match, commentary, videos, liveStreams] = await Promise.all([
    getMatchSummary(matchId),
    getMatchCommentary(matchId),
    getVideoPosts(),
    getLiveMatches()
  ]);

  if (!match) notFound();

  return (
    <div className="space-y-4">
      <JsonLd
        data={[
          buildSportsEventJsonLd(match, `/matches/${match.id}/watch`),
          buildBreadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "Matches", path: "/matches" },
            { name: `${match.teamA.shortName} vs ${match.teamB.shortName}`, path: `/matches/${match.id}` },
            { name: "Watch", path: `/matches/${match.id}/watch` }
          ])
        ]}
      />
      <MatchTabs matchId={match.id} currentPath={`/matches/${match.id}/watch`} status={match.status} />
      <AdSlot variant="in-feed" label="Sponsored · Broadcast Stream" />
      <SportsEraPlayerClient
        initialMatch={match}
        initialCommentary={commentary}
        videos={videos}
        liveStreams={liveStreams}
      />
      <AdSlot variant="leaderboard" label="Sponsored · SportsEra Player" />
    </div>
  );
}
