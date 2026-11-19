import type { SeriesStanding } from "@/types/series";

export function PointsTable({ rows }: { rows: SeriesStanding[] }): React.ReactElement {
  return (
    <section className="rounded-xl border border-slate-200 bg-white p-5">
      <h2 className="text-base font-semibold text-slate-900">Points Table</h2>
      <div className="mt-4 overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead>
            <tr className="border-b border-slate-200 text-slate-600">
              <th className="py-2 pr-3">Team</th>
              <th className="py-2 pr-3">P</th>
              <th className="py-2 pr-3">W</th>
              <th className="py-2 pr-3">L</th>
              <th className="py-2 pr-3">Pts</th>
              <th className="py-2 pr-3">NRR</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.teamId} className="border-b border-slate-100">
                <td className="py-2 pr-3 font-medium text-slate-900">{row.teamName}</td>
                <td className="py-2 pr-3">{row.played}</td>
                <td className="py-2 pr-3">{row.won}</td>
                <td className="py-2 pr-3">{row.lost}</td>
                <td className="py-2 pr-3">{row.points}</td>
                <td className="py-2 pr-3">{row.netRunRate.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

