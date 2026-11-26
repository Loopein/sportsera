import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SeriesTabs } from "@/app/(site)/series/[seriesId]/SeriesTabs";
import { FixturesList } from "@/components/series/FixturesList";
import { JsonLd } from "@/components/seo/JsonLd";
import { AdSlot } from "@/components/shared/AdSlot";
import { getMatches, getSeriesById } from "@/lib/api/read";
import { buildBreadcrumbJsonLd, buildSeriesEventJsonLd } from "@/lib/seo/jsonld";
import { buildPageMetadata } from "@/lib/seo/metadata";

type SeriesFixturesProps = {
  params: Promise<{ seriesId: string }>;
};

export async function generateMetadata({ params }: SeriesFixturesProps): Promise<Metadata> {
  const { seriesId } = await params;
  const seriesData = await getSeriesById(seriesId);
  if (!seriesData) {
    return buildPageMetadata({
      title: "Series Fixtures Not Found",
      description: "The requested tournament fixtures could not be found.",
      path: `/series/${seriesId}/fixtures`,
      noIndex: true
    });
  }

  return buildPageMetadata({
    title: `${seriesData.series.name} ${seriesData.series.season} Fixtures`,
    description: `Complete match schedule, upcoming fixtures, venues, and live results for ${seriesData.series.name} ${seriesData.series.season}.`,
    path: `/series/${seriesData.series.id}/fixtures`,
    keywords: [seriesData.series.name, seriesData.series.season, "fixtures", "schedule"]
  });
}

export default async function SeriesFixturesPage({ params }: SeriesFixturesProps): Promise<React.ReactElement> {
  const { seriesId } = await params;
  const [seriesData, matches] = await Promise.all([getSeriesById(seriesId), getMatches()]);
  if (!seriesData) notFound();

  const filtered = matches.filter((match) => match.seriesName.toLowerCase().includes(seriesData.series.name.toLowerCase()));

  return (
    <div className="space-y-4">
      <JsonLd
        data={[
          buildSeriesEventJsonLd(seriesData.series, `/series/${seriesData.series.id}/fixtures`),
          buildBreadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "Series", path: "/series" },
            { name: `${seriesData.series.name} ${seriesData.series.season}`.trim(), path: `/series/${seriesData.series.id}` },
            { name: "Fixtures", path: `/series/${seriesData.series.id}/fixtures` }
          ])
        ]}
      />
      <SeriesTabs seriesId={seriesData.series.id} currentPath={`/series/${seriesData.series.id}/fixtures`} />
      <FixturesList matches={filtered} />
      <AdSlot variant="leaderboard" label="Sponsored · Series Fixtures" />
    </div>
  );
}

