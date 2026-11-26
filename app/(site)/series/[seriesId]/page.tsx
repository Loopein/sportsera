import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SeriesTabs } from "@/app/(site)/series/[seriesId]/SeriesTabs";
import { PointsTable } from "@/components/series/PointsTable";
import { SeriesHeader } from "@/components/series/SeriesHeader";
import { JsonLd } from "@/components/seo/JsonLd";
import { AdSlot } from "@/components/shared/AdSlot";
import { getSeriesById } from "@/lib/api/read";
import { buildBreadcrumbJsonLd, buildSeriesEventJsonLd } from "@/lib/seo/jsonld";
import { buildPageMetadata } from "@/lib/seo/metadata";

type SeriesOverviewProps = {
  params: Promise<{ seriesId: string }>;
};

export async function generateMetadata({ params }: SeriesOverviewProps): Promise<Metadata> {
  const { seriesId } = await params;
  const data = await getSeriesById(seriesId);
  if (!data) {
    return buildPageMetadata({
      title: "Series Not Found",
      description: "The requested sports series could not be found.",
      path: `/series/${seriesId}`,
      noIndex: true
    });
  }

  return buildPageMetadata({
    title: `${data.series.name} ${data.series.season}`.trim(),
    description: `${data.series.name} ${data.series.season} (${data.series.format}) overview, standings, points table, and fixtures.`,
    path: `/series/${data.series.id}`,
    keywords: [data.series.name, data.series.season, data.series.format, "points table", "standings"]
  });
}

export default async function SeriesOverviewPage({ params }: SeriesOverviewProps): Promise<React.ReactElement> {
  const { seriesId } = await params;
  const data = await getSeriesById(seriesId);
  if (!data) notFound();

  return (
    <div className="space-y-4">
      <JsonLd
        data={[
          buildSeriesEventJsonLd(data.series, `/series/${data.series.id}`),
          buildBreadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "Series", path: "/series" },
            { name: `${data.series.name} ${data.series.season}`.trim(), path: `/series/${data.series.id}` }
          ])
        ]}
      />
      <SeriesTabs seriesId={data.series.id} currentPath={`/series/${data.series.id}`} />
      <SeriesHeader series={data.series} />
      <AdSlot variant="in-feed" label="Sponsored · Series Overview" />
      <PointsTable rows={data.standings} />
      <AdSlot variant="leaderboard" label="Sponsored · Tournament Table" />
    </div>
  );
}

