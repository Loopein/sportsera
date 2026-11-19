import type { SeriesSummary } from "@/types/series";

export function SeriesHeader({ series }: { series: SeriesSummary }): React.ReactElement {
  return (
    <header className="rounded-xl border border-slate-200 bg-white p-5">
      <p className="text-xs uppercase tracking-wide text-slate-500">{series.format}</p>
      <h1 className="mt-1 text-2xl font-bold text-slate-900">
        {series.name} {series.season}
      </h1>
      <p className="mt-2 text-sm text-slate-700">
        {series.startDate} to {series.endDate} | {series.status}
      </p>
    </header>
  );
}

