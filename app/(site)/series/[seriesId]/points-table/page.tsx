import { notFound } from "next/navigation";
import { SeriesTabs } from "@/app/(site)/series/[seriesId]/SeriesTabs";
import { PointsTable } from "@/components/series/PointsTable";
import { getSeriesById } from "@/lib/api/read";

type SeriesPointsProps = {
  params: Promise<{ seriesId: string }>;
};

export default async function SeriesPointsPage({ params }: SeriesPointsProps): Promise<React.ReactElement> {
  const { seriesId } = await params;
  const data = await getSeriesById(seriesId);
  if (!data) notFound();

  return (
    <div className="space-y-4">
      <SeriesTabs seriesId={data.series.id} currentPath={`/series/${data.series.id}/points-table`} />
      <PointsTable rows={data.standings} />
    </div>
  );
}

