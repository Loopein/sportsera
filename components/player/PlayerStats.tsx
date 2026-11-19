import type { PlayerCareerStat } from "@/types/player";
import { Card } from "@/components/ui/card";

export function PlayerStats({ career }: { career: PlayerCareerStat[] }): React.ReactElement {
  return (
    <Card as="section" className="p-5">
      <h2 className="text-base font-semibold text-slate-900">Career Stats</h2>
      <div className="mt-4 overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead>
            <tr className="border-b border-slate-200 text-slate-600">
              <th className="py-2 pr-3">Format</th>
              <th className="py-2 pr-3">Matches</th>
              <th className="py-2 pr-3">Runs</th>
              <th className="py-2 pr-3">Wickets</th>
              <th className="py-2 pr-3">Avg</th>
              <th className="py-2 pr-3">SR</th>
            </tr>
          </thead>
          <tbody>
            {career.map((row) => (
              <tr key={row.format} className="border-b border-slate-100">
                <td className="py-2 pr-3 font-medium text-slate-900">{row.format}</td>
                <td className="py-2 pr-3">{row.matches}</td>
                <td className="py-2 pr-3">{row.runs ?? "-"}</td>
                <td className="py-2 pr-3">{row.wickets ?? "-"}</td>
                <td className="py-2 pr-3">{row.average ?? "-"}</td>
                <td className="py-2 pr-3">{row.strikeRate ?? "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}

