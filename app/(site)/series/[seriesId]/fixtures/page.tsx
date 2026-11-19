import { notFound } from "next/navigation";
import { SeriesTabs } from "@/app/(site)/series/[seriesId]/SeriesTabs";
import { FixturesList } from "@/components/series/FixturesList";
import { AdSlot } from "@/components/shared/AdSlot";
import { getMatches, getSeriesById } from "@/lib/api/read";

type SeriesFixturesProps = {
  params: Promise<{ seriesId: string }>;
};

export default async function SeriesFixturesPage({ params }: SeriesFixturesProps): Promise<React.ReactElement> {
  const { seriesId } = await params;
  const [seriesData, matches] = await Promise.all([getSeriesById(seriesId), getMatches()]);
  if (!seriesData) notFound();

  const filtered = matches.filter((match) => match.seriesName.toLowerCase().includes(seriesData.series.name.toLowerCase()));

  return (
    <div className="space-y-4">
      <SeriesTabs seriesId={seriesData.series.id} currentPath={`/series/${seriesData.series.id}/fixtures`} />
      <FixturesList matches={filtered} />
      <AdSlot variant="leaderboard" label="Sponsored · Series Fixtures" />
    </div>
  );
}

