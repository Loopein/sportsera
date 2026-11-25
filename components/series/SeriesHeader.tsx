import { FiCalendar, FiLayers } from "react-icons/fi";
import type { SeriesSummary } from "@/types/series";
import { Card } from "@/components/ui/card";

export function SeriesHeader({ series }: { series: SeriesSummary }): React.ReactElement {
  return (
    <Card as="header" variant="strong" className="page-hero-card p-4 sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-1 rounded-md border border-slate-200 bg-white px-2.5 py-0.5 text-xs font-extrabold uppercase tracking-wider text-slate-700">
            <FiLayers className="h-3.5 w-3.5 text-brand-600" aria-hidden="true" />
            {series.format}
          </span>
          <span className="inline-flex items-center rounded-full bg-brand-100 px-2.5 py-0.5 text-xs font-extrabold uppercase tracking-wider text-brand-800">
            {series.status}
          </span>
        </div>
        <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600">
          <FiCalendar className="h-3.5 w-3.5 text-brand-600" aria-hidden="true" />
          {series.startDate || "TBD"} &mdash; {series.endDate || "TBD"}
        </span>
      </div>
      <h1 className="mt-3 break-words text-xl font-black tracking-tight text-slate-900 sm:text-3xl">
        {series.name} {series.season}
      </h1>
    </Card>
  );
}
