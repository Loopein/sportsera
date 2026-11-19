import { notFound } from "next/navigation";
import { SeriesTabs } from "@/app/(site)/series/[seriesId]/SeriesTabs";
import { AdSlot } from "@/components/shared/AdSlot";
import { getSeriesById } from "@/lib/api/read";

type SeriesStatsProps = {
  params: Promise<{ seriesId: string }>;
};

export default async function SeriesStatsPage({ params }: SeriesStatsProps): Promise<React.ReactElement> {
  const { seriesId } = await params;
  const data = await getSeriesById(seriesId);
  if (!data) notFound();
  const bestNrr = data.standings.length ? Math.max(...data.standings.map((s) => s.netRunRate)).toFixed(2) : "-";

  return (
    <div className="space-y-4">
      <SeriesTabs seriesId={data.series.id} currentPath={`/series/${data.series.id}/stats`} />
      <section className="rounded-xl border border-slate-200 bg-white p-5">
        <h2 className="text-base font-semibold text-slate-900">Series Stats Snapshot</h2>
        <ul className="mt-3 space-y-2 text-sm text-slate-700">
          <li className="rounded-md bg-slate-50 px-3 py-2">Top team by points: {data.standings[0]?.teamName ?? "-"}</li>
          <li className="rounded-md bg-slate-50 px-3 py-2">Best NRR: {bestNrr}</li>
          <li className="rounded-md bg-slate-50 px-3 py-2">Matches are updated in near-real-time from read APIs.</li>
        </ul>
      </section>
      <AdSlot variant="leaderboard" label="Sponsored · Series Stats" />
    </div>
  );
}

