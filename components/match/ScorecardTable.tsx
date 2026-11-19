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
    <section className="surface-card overflow-hidden">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200/80 bg-gradient-to-r from-slate-50 via-white to-brand-50/40 px-4 py-3.5 sm:px-5">
        <div>
          <h2 className="text-base font-extrabold tracking-tight text-slate-900">{innings.name}</h2>
          <p className="mt-0.5 text-xs font-medium text-slate-500">Full innings batting &amp; bowling breakdown</p>
        </div>
        <span className="score-pill tabular-nums">{innings.total}</span>
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
                <tr className="border-b border-slate-200 text-[11px] font-extrabold uppercase tracking-wider text-slate-500">
                  <th scope="col" className="pb-2.5 pr-2 text-left">
                    {battingTeamName ? `Batting - ${battingTeamName}` : "Batting"}
                  </th>
                  <th scope="col" className="pb-2.5 text-right tabular-nums">
                    R
                  </th>
                  <th scope="col" className="pb-2.5 text-right tabular-nums">
                    B
                  </th>
                  <th scope="col" className="pb-2.5 text-right tabular-nums">
                    4S
                  </th>
                  <th scope="col" className="pb-2.5 text-right tabular-nums">
                    6S
                  </th>
                  <th scope="col" className="pb-2.5 text-right tabular-nums">
                    S/R
                  </th>
                </tr>
              </thead>
              <tbody>
                {innings.batters.map((batter) => (
                  <tr
                    key={`${innings.name}-${batter.name}`}
                    className="border-b border-slate-100 align-top transition-colors hover:bg-brand-50/30"
                  >
                    <td className="py-3 pr-2">
                      <div className="flex min-w-0 items-start gap-3">
                        <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-brand-200/80 bg-brand-50 text-[11px] font-extrabold text-brand-700">
                          {getInitials(batter.name)}
                        </span>
                        <div className="min-w-0">
                          <p className="truncate text-sm font-bold text-slate-900">{batter.name}</p>
                          <p className="truncate text-xs text-slate-500">{batter.dismissal}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 text-right text-sm font-extrabold tabular-nums text-slate-900">{batter.runs}</td>
                    <td className="py-3 text-right text-sm font-medium tabular-nums text-slate-700">{batter.balls}</td>
                    <td className="py-3 text-right text-sm font-medium tabular-nums text-slate-700">{batter.fours}</td>
                    <td className="py-3 text-right text-sm font-medium tabular-nums text-slate-700">{batter.sixes}</td>
                    <td className="py-3 text-right text-sm font-semibold tabular-nums text-slate-700">{batter.strikeRate.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="rounded-xl border border-dashed border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-600">
            Batting card not available yet.
          </p>
        )}

        <div className="mt-4 grid gap-2 text-sm">
          <div className="flex items-center justify-between gap-3 rounded-xl border border-slate-200/75 bg-slate-50/80 px-3.5 py-2">
            <p className="font-semibold text-slate-600">Extras</p>
            <p className="text-right font-bold text-slate-900">{innings.extras}</p>
          </div>
          <div className="flex items-center justify-between gap-3 rounded-xl border border-brand-200/70 bg-brand-50/50 px-3.5 py-2.5">
            <p className="font-extrabold text-slate-900">Total runs</p>
            <p className="text-right font-black tabular-nums text-brand-800">{innings.total}</p>
          </div>
          {yetToBat.length ? (
            <div className="rounded-xl border border-slate-200/75 bg-slate-50/80 px-3.5 py-2.5">
              <p className="text-xs font-extrabold uppercase tracking-wider text-slate-500">Yet to bat</p>
              <p className="mt-1 leading-6 font-medium text-slate-700">{yetToBat.join(" · ")}</p>
            </div>
          ) : null}
          {innings.fallOfWickets.length ? (
            <div className="rounded-xl border border-slate-200/75 bg-slate-50/80 px-3.5 py-2.5">
              <p className="text-xs font-extrabold uppercase tracking-wider text-slate-500">Fall of Wickets</p>
              <p className="mt-1 leading-6 font-medium text-slate-700">{innings.fallOfWickets.join(" · ")}</p>
            </div>
          ) : null}
        </div>
      </div>

      <div className="border-t border-slate-200/80 px-4 py-4 sm:px-5">
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
                <tr className="border-b border-slate-200 text-[11px] font-extrabold uppercase tracking-wider text-slate-500">
                  <th scope="col" className="pb-2.5 pr-2 text-left">
                    {bowlingTeamName ? `Bowling - ${bowlingTeamName}` : "Bowling"}
                  </th>
                  <th scope="col" className="pb-2.5 text-right tabular-nums">
                    O
                  </th>
                  <th scope="col" className="pb-2.5 text-right tabular-nums">
                    M
                  </th>
                  <th scope="col" className="pb-2.5 text-right tabular-nums">
                    R
                  </th>
                  <th scope="col" className="pb-2.5 text-right tabular-nums">
                    W
                  </th>
                  <th scope="col" className="pb-2.5 text-right tabular-nums">
                    Econ
                  </th>
                </tr>
              </thead>
              <tbody>
                {innings.bowlers.map((bowler) => (
                  <tr
                    key={`${innings.name}-${bowler.name}`}
                    className="border-b border-slate-100 transition-colors hover:bg-brand-50/30"
                  >
                    <td className="py-3 pr-2">
                      <div className="flex min-w-0 items-center gap-3">
                        <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-slate-300 bg-slate-100 text-[11px] font-extrabold text-slate-700">
                          {getInitials(bowler.name)}
                        </span>
                        <p className="truncate text-sm font-bold text-slate-900">{bowler.name}</p>
                      </div>
                    </td>
                    <td className="py-3 text-right text-sm font-medium tabular-nums text-slate-700">{bowler.overs}</td>
                    <td className="py-3 text-right text-sm font-medium tabular-nums text-slate-700">{bowler.maidens}</td>
                    <td className="py-3 text-right text-sm font-medium tabular-nums text-slate-700">{bowler.runs}</td>
                    <td className="py-3 text-right text-sm font-extrabold tabular-nums text-brand-700">{bowler.wickets}</td>
                    <td className="py-3 text-right text-sm font-semibold tabular-nums text-slate-700">{bowler.economy.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="rounded-xl border border-dashed border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-600">
            Bowling card not available yet.
          </p>
        )}
      </div>

      {showKey ? (
        <div className="flex flex-wrap items-center gap-x-5 gap-y-1 border-t border-slate-200/80 bg-slate-50/80 px-4 py-3 text-xs sm:px-5">
          <span className="font-extrabold uppercase tracking-wider text-slate-500">Key:</span>
          <span className="text-slate-700">
            <strong className="font-extrabold text-slate-900">C</strong> Captain
          </span>
          <span className="text-slate-700">
            <strong className="font-extrabold text-slate-900">WK</strong> Wicket-keeper
          </span>
        </div>
      ) : null}
    </section>
  );
}

