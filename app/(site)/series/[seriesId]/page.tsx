import { notFound } from "next/navigation";
import { SeriesTabs } from "@/app/(site)/series/[seriesId]/SeriesTabs";
import { PointsTable } from "@/components/series/PointsTable";
import { SeriesHeader } from "@/components/series/SeriesHeader";
import { AdSlot } from "@/components/shared/AdSlot";
import { getSeriesById } from "@/lib/api/read";

type SeriesOverviewProps = {
  params: Promise<{ seriesId: string }>;
};

export default async function SeriesOverviewPage({ params }: SeriesOverviewProps): Promise<React.ReactElement> {
  const { seriesId } = await params;
  const data = await getSeriesById(seriesId);
  if (!data) notFound();

  return (
    <div className="space-y-4">
      <SeriesTabs seriesId={data.series.id} currentPath={`/series/${data.series.id}`} />
      <SeriesHeader series={data.series} />
      <AdSlot variant="in-feed" label="Sponsored · Series Overview" />
      <PointsTable rows={data.standings} />
      <AdSlot variant="leaderboard" label="Sponsored · Tournament Table" />
    </div>
  );
}

