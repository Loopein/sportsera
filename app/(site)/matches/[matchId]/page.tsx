import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { MatchSummaryLive } from "@/app/(site)/matches/[matchId]/MatchSummaryLive";
import { MatchTabs } from "@/app/(site)/matches/[matchId]/MatchTabs";
import { AdSlot } from "@/components/shared/AdSlot";
import { getMatchSummary } from "@/lib/api/read";

type MatchPageProps = {
  params: Promise<{ matchId: string }>;
};

export async function generateMetadata({ params }: MatchPageProps): Promise<Metadata> {
  const { matchId } = await params;
  const match = await getMatchSummary(matchId);
  if (!match) {
    return { title: "Match Not Found" };
  }
  return {
    title: `${match.teamA.shortName} vs ${match.teamB.shortName}`,
    description: `${match.seriesName} live summary, score updates, and match details.`
  };
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
      <MatchTabs matchId={match.id} currentPath={`/matches/${match.id}`} status={match.status} />
      <AdSlot variant="in-feed" label="Sponsored · Match Summary" />
      <MatchSummaryLive initialMatch={match} />
      <AdSlot variant="leaderboard" label="Sponsored · Match Center" />
    </div>
  );
}

