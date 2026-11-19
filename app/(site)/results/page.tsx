import { FiCheckCircle } from "react-icons/fi";
import { LiveMatchList } from "@/components/live/LiveMatchList";
import { AdSlot } from "@/components/shared/AdSlot";
import { Card } from "@/components/ui/card";
import { getMatches } from "@/lib/api/read";

export const revalidate = 30;

export default async function ResultsPage(): Promise<React.ReactElement> {
  const results = await getMatches("completed");
  const mappedResults = results.map((match) => ({
    id: match.id,
    slug: match.id,
    status: match.status,
    format: match.format,
    seriesName: match.seriesName,
    venue: match.venue,
    teamA: match.teamA,
    teamB: match.teamB,
    summary: match.resultText ?? "Match completed",
    lastUpdatedAt: match.lastUpdatedAt ?? new Date().toISOString()
  }));

  return (
    <div className="space-y-6">
      <Card as="section" variant="strong" className="p-5 sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="inline-flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-wider text-emerald-700">
              <FiCheckCircle className="h-3.5 w-3.5" aria-hidden="true" />
              Completed Matches
            </p>
            <h1 className="mt-1 text-2xl font-black tracking-tight text-slate-900 sm:text-3xl">Results</h1>
            <p className="mt-1 text-sm text-slate-600">Recent match outcomes, final totals, and full scorecards.</p>
          </div>
          <span className="score-pill">{mappedResults.length} results</span>
        </div>
      </Card>
      <AdSlot variant="in-feed" label="Sponsored · Results Desk" />
      <LiveMatchList matches={mappedResults} emptyCount={3} emptyLabel="No completed matches yet" />
      <AdSlot variant="leaderboard" label="Sponsored · Match Archive" />
    </div>
  );
}
