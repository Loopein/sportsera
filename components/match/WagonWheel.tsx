import type { MatchStats } from "@/types/match";

export function WagonWheel({ stats }: { stats: MatchStats }): React.ReactElement {
  return (
    <section className="rounded-xl border border-slate-200 bg-white p-5">
      <h2 className="text-base font-semibold text-slate-900">Wagon Wheel (Runs by Zone)</h2>
      <ul className="mt-4 space-y-2">
        {stats.wagonWheel.map((slice) => (
          <li key={slice.zone} className="flex items-center gap-3">
            <span className="w-28 text-sm text-slate-700">{slice.zone}</span>
            <div className="h-3 flex-1 rounded-full bg-slate-100">
              <div className="h-3 rounded-full bg-brand-500" style={{ width: `${Math.min(slice.runs * 2, 100)}%` }} />
            </div>
            <span className="w-8 text-right text-sm font-semibold text-slate-900">{slice.runs}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}

