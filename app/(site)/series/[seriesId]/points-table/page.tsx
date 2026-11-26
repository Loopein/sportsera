import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SeriesTabs } from "@/app/(site)/series/[seriesId]/SeriesTabs";
import { PointsTable } from "@/components/series/PointsTable";
import { JsonLd } from "@/components/seo/JsonLd";
import { AdSlot } from "@/components/shared/AdSlot";
import { getSeriesById } from "@/lib/api/read";
import { buildBreadcrumbJsonLd, buildSeriesEventJsonLd } from "@/lib/seo/jsonld";
import { buildPageMetadata } from "@/lib/seo/metadata";

type SeriesPointsProps = {
  params: Promise<{ seriesId: string }>;
};

export async function generateMetadata({ params }: SeriesPointsProps): Promise<Metadata> {
  const { seriesId } = await params;
  const data = await getSeriesById(seriesId);
  if (!data) {
    return buildPageMetadata({
      title: "Points Table Not Found",
      description: "The requested series points table could not be found.",
      path: `/series/${seriesId}/points-table`,
      noIndex: true
    });
  }

  return buildPageMetadata({
    title: `${data.series.name} ${data.series.season} Points Table`,
    description: `Live standings, wins, losses, net run rate (NRR), and points table for ${data.series.name} ${data.series.season}.`,
    path: `/series/${data.series.id}/points-table`,
    keywords: [data.series.name, "points table", "standings", "NRR"]
  });
}

export default async function SeriesPointsPage({ params }: SeriesPointsProps): Promise<React.ReactElement> {
  const { seriesId } = await params;
  const data = await getSeriesById(seriesId);
  if (!data) notFound();

  return (
    <div className="space-y-4">
      <JsonLd
        data={[
          buildSeriesEventJsonLd(data.series, `/series/${data.series.id}/points-table`),
          buildBreadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "Series", path: "/series" },
            { name: `${data.series.name} ${data.series.season}`.trim(), path: `/series/${data.series.id}` },
            { name: "Points Table", path: `/series/${data.series.id}/points-table` }
          ])
        ]}
      />
      <SeriesTabs seriesId={data.series.id} currentPath={`/series/${data.series.id}/points-table`} />
      <PointsTable rows={data.standings} />
      <AdSlot variant="leaderboard" label="Sponsored · Points Table" />
    </div>
  );
}

