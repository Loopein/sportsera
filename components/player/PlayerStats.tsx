import { FiBarChart2 } from "react-icons/fi";
import type { PlayerCareerStat } from "@/types/player";
import { Card } from "@/components/ui/card";

export function PlayerStats({ career }: { career: PlayerCareerStat[] }): React.ReactElement {
  return (
    <Card as="section" className="p-4 sm:p-6">
      <div className="flex items-center justify-between gap-2">
        <h2 className="inline-flex items-center gap-2 text-lg font-extrabold text-slate-900">
          <FiBarChart2 className="h-4 w-4 text-brand-600" aria-hidden="true" />
          Career Stats
        </h2>
        <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-bold text-slate-600">
          {career.length} formats
        </span>
      </div>

      {career.length ? (
        <div className="mt-4 overflow-x-auto">
          <table className="min-w-[440px] w-full whitespace-nowrap border-collapse text-left text-xs sm:text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-xs font-extrabold uppercase tracking-wider text-slate-500">
                <th className="py-2.5 pr-4">Format</th>
                <th className="py-2.5 pr-4 text-right">Matches</th>
                <th className="py-2.5 pr-4 text-right">Runs</th>
                <th className="py-2.5 pr-4 text-right">Wickets</th>
                <th className="py-2.5 pr-4 text-right">Avg</th>
                <th className="py-2.5 text-right">SR</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {career.map((row) => (
                <tr key={row.format} className="transition hover:bg-brand-50/40">
                  <td className="py-3 pr-4">
                    <span className="inline-flex rounded-md border border-brand-200 bg-brand-50 px-2.5 py-0.5 text-xs font-extrabold uppercase tracking-wider text-brand-700">
                      {row.format}
                    </span>
                  </td>
                  <td className="py-3 pr-4 text-right font-bold tabular-nums text-slate-900">{row.matches}</td>
                  <td className="py-3 pr-4 text-right font-bold tabular-nums text-slate-900">{row.runs ?? "-"}</td>
                  <td className="py-3 pr-4 text-right font-bold tabular-nums text-slate-900">{row.wickets ?? "-"}</td>
                  <td className="py-3 pr-4 text-right font-semibold tabular-nums text-slate-700">
                    {row.average !== undefined ? row.average.toFixed(2) : "-"}
                  </td>
                  <td className="py-3 text-right font-semibold tabular-nums text-slate-700">
                    {row.strikeRate !== undefined ? row.strikeRate.toFixed(2) : "-"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="mt-4 rounded-xl border border-dashed border-slate-200 bg-slate-50 p-6 text-center text-sm text-slate-500">
          Career statistics are not available for this player yet.
        </p>
      )}
    </Card>
  );
}
