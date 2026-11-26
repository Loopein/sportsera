import type { Metadata } from "next";
import { FiCalendar } from "react-icons/fi";
import { LiveMatchList } from "@/components/live/LiveMatchList";
import { JsonLd } from "@/components/seo/JsonLd";
import { AdSlot } from "@/components/shared/AdSlot";
import { Card } from "@/components/ui/card";
import { getMatches } from "@/lib/api/read";
import { buildBreadcrumbJsonLd, buildCollectionPageJsonLd } from "@/lib/seo/jsonld";
import { buildPageMetadata } from "@/lib/seo/metadata";

export const revalidate = 30;

export const metadata: Metadata = buildPageMetadata({
  title: "Fixtures & Match Schedule",
  description: "Upcoming international, league, and tournament fixtures, start times, venues, and squad previews.",
  path: "/fixtures",
  keywords: ["match fixtures", "upcoming matches", "match schedule"]
});

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
      <JsonLd
        data={[
          buildCollectionPageJsonLd({
            name: "Fixtures & Match Schedule",
            description: "Upcoming matches, start times, venues, and squad previews.",
            path: "/fixtures"
          }),
          buildBreadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "Fixtures", path: "/fixtures" }
          ])
        ]}
      />
      <Card as="section" variant="strong" className="page-hero-card p-4 sm:p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-700 ring-1 ring-brand-200/80">
              <FiCalendar className="h-5 w-5" aria-hidden="true" />
            </span>
            <div className="min-w-0">
              <p className="text-xs font-extrabold uppercase tracking-wider text-brand-700">Match Schedule</p>
              <h1 className="mt-0.5 text-2xl font-black tracking-tight text-slate-900 sm:text-3xl">Fixtures</h1>
              <p className="mt-1 text-sm text-slate-600">Upcoming matches, start times, venues, and squad previews.</p>
            </div>
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
