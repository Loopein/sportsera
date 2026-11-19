import type { ScorecardInnings } from "@/types/match";

type ScorecardTableProps = {
  innings: ScorecardInnings;
  battingTeamName?: string;
  bowlingTeamName?: string;
  yetToBat?: string[];
  showKey?: boolean;
};

function getInitials(name: string): string {
  return (
    name
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase())
      .join("") || "PL"
  );
}

export function ScorecardTable({
  innings,
  battingTeamName,
  bowlingTeamName,
  yetToBat = [],
  showKey = true
}: ScorecardTableProps): React.ReactElement {
  return (
    <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
      <div className="border-b border-slate-200 px-4 py-3 sm:px-5">
        <h2 className="text-base font-semibold text-slate-900">{innings.name}</h2>
        <p className="mt-1 text-sm text-slate-600">{innings.total}</p>
      </div>
      <div className="px-4 py-4 sm:px-5">
        {innings.batters.length ? (
          <div className="overflow-x-auto">
            <table className="min-w-[660px] w-full table-fixed border-collapse">
              <colgroup>
                <col />
                <col className="w-12" />
                <col className="w-12" />
                <col className="w-12" />
                <col className="w-12" />
                <col className="w-16" />
              </colgroup>
              <thead>
                <tr className="border-b border-slate-200 text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                  <th scope="col" className="pb-2 pr-2 text-left">
                    {battingTeamName ? `Batting - ${battingTeamName}` : "Batting"}
                  </th>
                  <th scope="col" className="pb-2 text-right tabular-nums">
                    R
                  </th>
                  <th scope="col" className="pb-2 text-right tabular-nums">
                    B
                  </th>
                  <th scope="col" className="pb-2 text-right tabular-nums">
                    4S
                  </th>
                  <th scope="col" className="pb-2 text-right tabular-nums">
                    6S
                  </th>
                  <th scope="col" className="pb-2 text-right tabular-nums">
                    S/R
                  </th>
                </tr>
              </thead>
              <tbody>
                {innings.batters.map((batter) => (
                  <tr key={`${innings.name}-${batter.name}`} className="border-b border-slate-100 align-top">
                    <td className="py-3 pr-2">
                      <div className="flex min-w-0 items-start gap-3">
                        <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-slate-300 bg-slate-100 text-[11px] font-bold text-slate-700">
                          {getInitials(batter.name)}
                        </span>
                        <div className="min-w-0">
                          <p className="truncate text-sm font-semibold text-slate-900">{batter.name}</p>
                          <p className="truncate text-sm text-slate-600">{batter.dismissal}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 text-right text-sm font-semibold tabular-nums text-slate-900">{batter.runs}</td>
                    <td className="py-3 text-right text-sm font-semibold tabular-nums text-slate-900">{batter.balls}</td>
                    <td className="py-3 text-right text-sm font-semibold tabular-nums text-slate-900">{batter.fours}</td>
                    <td className="py-3 text-right text-sm font-semibold tabular-nums text-slate-900">{batter.sixes}</td>
                    <td className="py-3 text-right text-sm font-semibold tabular-nums text-slate-900">{batter.strikeRate.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="rounded-lg border border-dashed border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-600">
            Batting card not available yet.
          </p>
        )}

        <div className="mt-3 space-y-3 text-sm">
          <div className="flex items-start justify-between gap-3 border-b border-slate-100 pb-2">
            <p className="font-medium text-slate-700">Extras</p>
            <p className="text-right font-semibold text-slate-900">{innings.extras}</p>
          </div>
          <div className="flex items-start justify-between gap-3 border-b border-slate-100 pb-2">
            <p className="font-medium text-slate-900">Total runs</p>
            <p className="text-right font-bold text-slate-900">{innings.total}</p>
          </div>
          {yetToBat.length ? (
            <div className="border-b border-slate-100 pb-2">
              <p className="font-medium text-slate-700">Yet to bat</p>
              <p className="mt-1 leading-6 text-slate-700">{yetToBat.join(" - ")}</p>
            </div>
          ) : null}
          {innings.fallOfWickets.length ? (
            <div>
              <p className="font-medium text-slate-700">Fall of Wickets</p>
              <p className="mt-1 leading-6 text-slate-700">{innings.fallOfWickets.join(", ")}</p>
            </div>
          ) : null}
        </div>
      </div>

      <div className="border-t border-slate-200 px-4 py-4 sm:px-5">
        {innings.bowlers.length ? (
          <div className="overflow-x-auto">
            <table className="min-w-[660px] w-full table-fixed border-collapse">
              <colgroup>
                <col />
                <col className="w-12" />
                <col className="w-12" />
                <col className="w-12" />
                <col className="w-12" />
                <col className="w-16" />
              </colgroup>
              <thead>
                <tr className="border-b border-slate-200 text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                  <th scope="col" className="pb-2 pr-2 text-left">
                    {bowlingTeamName ? `Bowling - ${bowlingTeamName}` : "Bowling"}
                  </th>
                  <th scope="col" className="pb-2 text-right tabular-nums">
                    O
                  </th>
                  <th scope="col" className="pb-2 text-right tabular-nums">
                    M
                  </th>
                  <th scope="col" className="pb-2 text-right tabular-nums">
                    R
                  </th>
                  <th scope="col" className="pb-2 text-right tabular-nums">
                    W
                  </th>
                  <th scope="col" className="pb-2 text-right tabular-nums">
                    Econ
                  </th>
                </tr>
              </thead>
              <tbody>
                {innings.bowlers.map((bowler) => (
                  <tr key={`${innings.name}-${bowler.name}`} className="border-b border-slate-100">
                    <td className="py-3 pr-2">
                      <div className="flex min-w-0 items-start gap-3">
                        <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-slate-300 bg-slate-100 text-[11px] font-bold text-slate-700">
                          {getInitials(bowler.name)}
                        </span>
                        <p className="truncate text-sm font-semibold text-slate-900">{bowler.name}</p>
                      </div>
                    </td>
                    <td className="py-3 text-right text-sm font-semibold tabular-nums text-slate-900">{bowler.overs}</td>
                    <td className="py-3 text-right text-sm font-semibold tabular-nums text-slate-900">{bowler.maidens}</td>
                    <td className="py-3 text-right text-sm font-semibold tabular-nums text-slate-900">{bowler.runs}</td>
                    <td className="py-3 text-right text-sm font-semibold tabular-nums text-slate-900">{bowler.wickets}</td>
                    <td className="py-3 text-right text-sm font-semibold tabular-nums text-slate-900">{bowler.economy.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="rounded-lg border border-dashed border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-600">
            Bowling card not available yet.
          </p>
        )}
      </div>

      {showKey ? (
        <div className="border-t border-slate-200 bg-slate-50 px-4 py-3 sm:px-5">
          <p className="text-sm font-semibold text-slate-900">Key</p>
          <p className="mt-1 text-sm text-slate-700">
            <span className="font-semibold text-slate-900">C</span> Captain
          </p>
          <p className="text-sm text-slate-700">
            <span className="font-semibold text-slate-900">WK</span> Wicket-keeper
          </p>
        </div>
      ) : null}
    </section>
  );
}

