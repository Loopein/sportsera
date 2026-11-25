import { notFound } from "next/navigation";
import { FiActivity, FiAward, FiTrendingUp } from "react-icons/fi";
import { SeriesTabs } from "@/app/(site)/series/[seriesId]/SeriesTabs";
import { PointsTable } from "@/components/series/PointsTable";
import { SeriesHeader } from "@/components/series/SeriesHeader";
import { AdSlot } from "@/components/shared/AdSlot";
import { Card } from "@/components/ui/card";
import { getSeriesById } from "@/lib/api/read";

type SeriesStatsProps = {
  params: Promise<{ seriesId: string }>;
};

export default async function SeriesStatsPage({ params }: SeriesStatsProps): Promise<React.ReactElement> {
  const { seriesId } = await params;
  const data = await getSeriesById(seriesId);
  if (!data) notFound();
  const bestNrr = data.standings.length ? Math.max(...data.standings.map((s) => s.netRunRate)).toFixed(2) : "-";
  const leader = data.standings[0];

  return (
    <div className="space-y-5">
      <SeriesHeader series={data.series} />
      <SeriesTabs seriesId={data.series.id} currentPath={`/series/${data.series.id}/stats`} />

      <section className="grid gap-3.5 sm:grid-cols-3">
        <Card className="p-4 sm:p-5">
          <p className="inline-flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-wider text-brand-700">
            <FiAward className="h-3.5 w-3.5" aria-hidden="true" />
            Table Leader
          </p>
          <p className="mt-2 truncate text-lg font-black text-slate-900">{leader?.teamName ?? "-"}</p>
          <p className="mt-0.5 text-xs font-semibold text-slate-500">
            {leader ? `${leader.points} pts · ${leader.won} wins` : "No standings recorded yet"}
          </p>
        </Card>

        <Card className="p-4 sm:p-5">
          <p className="inline-flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-wider text-emerald-700">
            <FiTrendingUp className="h-3.5 w-3.5" aria-hidden="true" />
            Best Net Run Rate
          </p>
          <p className="mt-2 text-lg font-black tabular-nums text-slate-900">{bestNrr}</p>
          <p className="mt-0.5 text-xs font-semibold text-slate-500">Highest efficiency in group table</p>
        </Card>

        <Card className="p-4 sm:p-5">
          <p className="inline-flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-wider text-slate-600">
            <FiActivity className="h-3.5 w-3.5 text-brand-600" aria-hidden="true" />
            Tournament Sync
          </p>
          <p className="mt-2 text-lg font-black tabular-nums text-slate-900">{data.standings.length} Teams</p>
          <p className="mt-0.5 text-xs font-semibold text-slate-500">Live table &amp; fixture API updates</p>
        </Card>
      </section>

      <PointsTable rows={data.standings} />
      <AdSlot variant="leaderboard" label="Sponsored · Series Stats" />
    </div>
  );
}

