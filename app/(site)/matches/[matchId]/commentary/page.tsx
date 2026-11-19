import { notFound } from "next/navigation";
import { CommentaryLive } from "@/app/(site)/matches/[matchId]/CommentaryLive";
import { MatchTabs } from "@/app/(site)/matches/[matchId]/MatchTabs";
import { AdSlot } from "@/components/shared/AdSlot";
import { getMatchCommentary, getMatchSummary } from "@/lib/api/read";

type CommentaryPageProps = {
  params: Promise<{ matchId: string }>;
};

export default async function CommentaryPage({ params }: CommentaryPageProps): Promise<React.ReactElement> {
  const { matchId } = await params;
  const [summary, commentary] = await Promise.all([getMatchSummary(matchId), getMatchCommentary(matchId)]);
  if (!summary) notFound();

  return (
    <div className="space-y-4">
      <MatchTabs matchId={summary.id} currentPath={`/matches/${summary.id}/commentary`} status={summary.status} />
      <AdSlot variant="in-feed" label="Sponsored · Live Commentary" />
      <CommentaryLive matchId={summary.id} initialItems={commentary} />
      <AdSlot variant="leaderboard" label="Sponsored · Commentary Desk Banner" />
    </div>
  );
}

