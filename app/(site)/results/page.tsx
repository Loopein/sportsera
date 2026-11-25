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
      <Card as="section" variant="strong" className="page-hero-card p-4 sm:p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200/80">
              <FiCheckCircle className="h-5 w-5" aria-hidden="true" />
            </span>
            <div className="min-w-0">
              <p className="text-xs font-extrabold uppercase tracking-wider text-emerald-700">Completed Matches</p>
              <h1 className="mt-0.5 text-2xl font-black tracking-tight text-slate-900 sm:text-3xl">Results</h1>
              <p className="mt-1 text-sm text-slate-600">Recent match outcomes, final totals, and full scorecards.</p>
            </div>
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
