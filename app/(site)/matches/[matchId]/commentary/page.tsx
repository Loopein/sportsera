import { notFound } from "next/navigation";
import { CommentaryLive } from "@/app/(site)/matches/[matchId]/CommentaryLive";
import { MatchTabs } from "@/app/(site)/matches/[matchId]/MatchTabs";
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
      <CommentaryLive matchId={summary.id} initialItems={commentary} />
    </div>
  );
}

