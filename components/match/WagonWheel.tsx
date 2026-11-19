import { Card } from "@/components/ui/card";
import type { MatchStats } from "@/types/match";

export function WagonWheel({ stats }: { stats: MatchStats }): React.ReactElement {
  const maxRuns = Math.max(...stats.wagonWheel.map((slice) => slice.runs), 1);

  return (
    <Card as="section" className="p-5">
      <div className="flex items-center justify-between gap-2">
        <h2 className="text-base font-extrabold tracking-tight text-slate-900">Wagon Wheel (Runs by Zone)</h2>
        <span className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider text-slate-500">
          {stats.wagonWheel.length} zones
        </span>
      </div>
      <ul className="mt-4 space-y-2.5">
        {stats.wagonWheel.map((slice) => {
          const widthPct = Math.max(4, Math.min(Math.round((slice.runs / maxRuns) * 100), 100));
          return (
            <li key={slice.zone} className="flex items-center gap-3">
              <span className="w-28 truncate text-xs font-bold uppercase tracking-wide text-slate-600">
                {slice.zone}
              </span>
              <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-slate-100">
                <div
                  className="h-2.5 rounded-full bg-gradient-to-r from-brand-600 to-cyan-500 transition-all duration-300"
                  style={{ width: `${widthPct}%` }}
                />
              </div>
              <span className="inline-flex min-w-[2.25rem] justify-end rounded-md bg-slate-100 px-2 py-0.5 text-xs font-extrabold tabular-nums text-slate-900">
                {slice.runs}
              </span>
            </li>
          );
        })}
      </ul>
    </Card>
  );
}

