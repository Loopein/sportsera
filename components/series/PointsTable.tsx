import Link from "next/link";
import { FiAward } from "react-icons/fi";
import type { SeriesStanding } from "@/types/series";
import { Card } from "@/components/ui/card";

export function PointsTable({ rows }: { rows: SeriesStanding[] }): React.ReactElement {
  return (
    <Card as="section" className="p-5 sm:p-6">
      <div className="flex items-center justify-between gap-2">
        <h2 className="inline-flex items-center gap-2 text-lg font-extrabold text-slate-900">
          <FiAward className="h-4 w-4 text-brand-600" aria-hidden="true" />
          Points Table
        </h2>
        <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-bold text-slate-600">
          {rows.length} teams
        </span>
      </div>

      {rows.length ? (
        <div className="mt-4 overflow-x-auto">
          <table className="min-w-full border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-xs font-extrabold uppercase tracking-wider text-slate-500">
                <th className="py-2.5 pr-3">#</th>
                <th className="py-2.5 pr-4">Team</th>
                <th className="py-2.5 pr-3 text-right">P</th>
                <th className="py-2.5 pr-3 text-right">W</th>
                <th className="py-2.5 pr-3 text-right">L</th>
                <th className="py-2.5 pr-3 text-right">Pts</th>
                <th className="py-2.5 text-right">NRR</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {rows.map((row, idx) => (
                <tr key={row.teamId || row.teamName} className="transition hover:bg-brand-50/40">
                  <td className="py-3 pr-3 font-bold tabular-nums text-slate-500">{idx + 1}</td>
                  <td className="py-3 pr-4 font-extrabold text-slate-900">
                    {row.teamId ? (
                      <Link href={`/teams/${row.teamId}`} className="hover:text-brand-700 hover:underline">
                        {row.teamName}
                      </Link>
                    ) : (
                      row.teamName
                    )}
                  </td>
                  <td className="py-3 pr-3 text-right font-semibold tabular-nums text-slate-700">{row.played}</td>
                  <td className="py-3 pr-3 text-right font-semibold tabular-nums text-emerald-700">{row.won}</td>
                  <td className="py-3 pr-3 text-right font-semibold tabular-nums text-rose-600">{row.lost}</td>
                  <td className="py-3 pr-3 text-right">
                    <span className="inline-flex min-w-[1.8rem] justify-center rounded-md bg-brand-50 px-2 py-0.5 font-black tabular-nums text-brand-700">
                      {row.points}
                    </span>
                  </td>
                  <td
                    className={`py-3 text-right font-bold tabular-nums ${
                      row.netRunRate >= 0 ? "text-emerald-700" : "text-slate-600"
                    }`}
                  >
                    {row.netRunRate >= 0 ? `+${row.netRunRate.toFixed(3)}` : row.netRunRate.toFixed(3)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="mt-4 rounded-xl border border-dashed border-slate-200 bg-slate-50 p-6 text-center text-sm text-slate-500">
          Standings data is not available for this series yet.
        </p>
      )}
    </Card>
  );
}
