import { FiCalendar } from "react-icons/fi";
import { LiveMatchList } from "@/components/live/LiveMatchList";
import { AdSlot } from "@/components/shared/AdSlot";
import { Card } from "@/components/ui/card";
import { getMatches } from "@/lib/api/read";

export const revalidate = 30;

export default async function FixturesPage(): Promise<React.ReactElement> {
  const fixtures = await getMatches("upcoming");
  const mappedFixtures = fixtures.map((match) => ({
    id: match.id,
    slug: match.id,
    status: match.status,
    format: match.format,
    seriesName: match.seriesName,
    venue: match.venue,
    teamA: match.teamA,
    teamB: match.teamB,
    summary: match.resultText ?? "Upcoming fixture",
    startAt: match.startAt ?? match.lastUpdatedAt ?? new Date().toISOString(),
    lastUpdatedAt: match.lastUpdatedAt ?? new Date().toISOString()
  }));

  return (
    <div className="space-y-6">
      <Card as="section" variant="strong" className="p-5 sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="inline-flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-wider text-brand-700">
              <FiCalendar className="h-3.5 w-3.5" aria-hidden="true" />
              Match Schedule
            </p>
            <h1 className="mt-1 text-2xl font-black tracking-tight text-slate-900 sm:text-3xl">Fixtures</h1>
            <p className="mt-1 text-sm text-slate-600">Upcoming matches, start times, venues, and squad previews.</p>
          </div>
          <span className="score-pill">{mappedFixtures.length} upcoming</span>
        </div>
      </Card>
      <AdSlot variant="in-feed" label="Sponsored · Fixtures Desk" />
      <LiveMatchList matches={mappedFixtures} emptyCount={3} emptyLabel="No upcoming fixtures scheduled" />
      <AdSlot variant="leaderboard" label="Sponsored · Schedule Partner" />
    </div>
  );
}
