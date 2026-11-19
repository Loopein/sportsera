import type { Metadata } from "next";
import Link from "next/link";
import { FiChevronDown } from "react-icons/fi";
import { Card } from "@/components/ui/card";
import { getTournamentPlayerStats } from "@/lib/api/read";
import { cn } from "@/lib/utils/text";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import type { StatsCategory, TournamentPlayerStat } from "@/types/stats";

type StatsPageProps = {
  searchParams?: Promise<{
    category?: string;
    team?: string;
  }>;
};

const categoryItems: Array<{ key: StatsCategory; label: string }> = [
  { key: "most-runs", label: "Most Runs" },
  { key: "most-wickets", label: "Most Wickets" },
  { key: "best-strike-rate", label: "Best Strike Rate" },
  { key: "best-economy", label: "Best Economy" },
  { key: "most-sixes", label: "Most Sixes" }
];

function safeCategory(input?: string): StatsCategory {
  const found = categoryItems.find((item) => item.key === input);
  return found?.key ?? "most-runs";
}

function valueByCategory(row: TournamentPlayerStat, category: StatsCategory): number {
  switch (category) {
    case "most-runs":
      return row.runs;
    case "most-wickets":
      return row.wickets;
    case "best-strike-rate":
      return row.strikeRate;
    case "best-economy":
      return row.economy;
    case "most-sixes":
      return row.sixes;
    default:
      return 0;
  }
}

function sortRows(rows: TournamentPlayerStat[], category: StatsCategory): TournamentPlayerStat[] {
  const data = [...rows];
  if (category === "best-economy") {
    return data
      .filter((row) => row.overs >= 10)
      .sort((a, b) => a.economy - b.economy || b.wickets - a.wickets);
  }
  return data.sort((a, b) => valueByCategory(b, category) - valueByCategory(a, category));
}

function categoryHeadline(category: StatsCategory, row?: TournamentPlayerStat): string {
  if (!row) return "-";
  switch (category) {
    case "most-runs":
      return `${row.runs} Runs`;
    case "most-wickets":
      return `${row.wickets} Wickets`;
    case "best-strike-rate":
      return `${row.strikeRate.toFixed(2)} SR`;
    case "best-economy":
      return `${row.economy.toFixed(2)} Economy`;
    case "most-sixes":
      return `${row.sixes} Sixes`;
    default:
      return "-";
  }
}

function categoryDescription(category: StatsCategory): string {
  switch (category) {
    case "most-runs":
      return "Tournament batting leaderboard by aggregate runs.";
    case "most-wickets":
      return "Top wicket-takers across tournament matches.";
    case "best-strike-rate":
      return "Batters ranked by strike rate (minimum impact innings).";
    case "best-economy":
      return "Bowlers ranked by lowest economy (minimum 10 overs).";
    case "most-sixes":
      return "Most sixes hit in the tournament.";
    default:
      return "Tournament leaderboard.";
  }
}

function formatStat(value: number | null | undefined, decimals = 2): string {
  if (value === null || value === undefined) return "-";
  const parsed = Number(value);
  if (Number.isNaN(parsed)) return "-";
  return parsed.toFixed(decimals);
}

export const metadata: Metadata = {
  title: "Stats",
  description: "Tournament stats leaderboard for batting and bowling categories."
};

export default async function StatsPage({ searchParams }: StatsPageProps): Promise<React.ReactElement> {
  const params = await searchParams;
  const category = safeCategory(params?.category);
  const stats = await getTournamentPlayerStats();

  const teams = Array.from(new Map(stats.map((row) => [row.teamId, row.teamName]))).map(([id, name]) => ({
    id,
    name
  }));
  const selectedTeam = teams.some((team) => team.id === params?.team) ? (params?.team as string) : "all";
  const teamLabel = selectedTeam === "all" ? "All Teams" : teams.find((team) => team.id === selectedTeam)?.name ?? "All Teams";
  const filterTriggerClass =
    "group inline-flex min-w-[180px] items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-[#3142b0] hover:bg-[#eff2ff] data-[state=open]:border-[#08104a] data-[state=open]:bg-[#edf0ff] data-[state=open]:text-[#08104a]";

  const filtered = selectedTeam === "all" ? stats : stats.filter((row) => row.teamId === selectedTeam);
  const rankedRows = sortRows(filtered, category);
  const leader = rankedRows[0];

  const buildHref = (overrides: Partial<{ category: StatsCategory; team: string }>): string => {
    const query = new URLSearchParams();
    query.set("category", overrides.category ?? category);
    const teamValue = overrides.team ?? selectedTeam;
    if (teamValue !== "all") query.set("team", teamValue);
    return `/stats?${query.toString()}`;
  };

  return (
    <div className="space-y-6">
      <Card as="section" variant="strong" className="overflow-hidden">
        <div className="border-b border-slate-200 bg-[#08104a] px-5 py-3">
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-brand-200">ICC Men&apos;s T20 World Cup 2026</p>
          <h1 className="mt-1 text-2xl font-extrabold text-white md:text-3xl">Tournament Stats</h1>
        </div>
        <div className="flex flex-wrap items-center gap-3 bg-white px-5 py-3 text-xs font-bold uppercase tracking-wide">
          <Link href="/matches" className="text-slate-500 hover:text-slate-800">
            Matches
          </Link>
          <span className="text-slate-300">/</span>
          <span className="text-[#08104a]">Stats</span>
        </div>
      </Card>

      <section className="flex flex-wrap gap-2 border-b border-slate-200 pb-2">
        {categoryItems.map((item) => (
          <Link
            key={item.key}
            href={buildHref({ category: item.key })}
            className={cn(
              "rounded-md px-3 py-2 text-xs font-extrabold uppercase tracking-wide transition",
              category === item.key ? "bg-[#08104a] text-white" : "bg-slate-100 text-slate-700 hover:bg-slate-200"
            )}
          >
            {item.label}
          </Link>
        ))}
      </section>

      <section className="grid gap-5 xl:grid-cols-[1fr_310px]">
        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  type="button"
                  className={filterTriggerClass}
                >
                  <span className="truncate">Team: {teamLabel}</span>
                  <FiChevronDown
                    aria-hidden="true"
                    className="h-4 w-4 shrink-0 text-slate-500 transition group-data-[state=open]:rotate-180 group-data-[state=open]:text-[#08104a]"
                  />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="max-h-64 w-56 overflow-y-auto">
                <DropdownMenuItem
                  asChild
                  className={cn(
                    "text-sm font-semibold",
                    selectedTeam === "all"
                      ? "bg-[#08104a] text-white focus:bg-[#08104a] focus:text-white"
                      : "text-slate-700 hover:bg-slate-100"
                  )}
                >
                  <Link href={buildHref({ team: "all" })}>All Teams</Link>
                </DropdownMenuItem>
                {teams.map((team) => (
                  <DropdownMenuItem
                    key={team.id}
                    asChild
                    className={cn(
                      "text-sm font-semibold",
                      selectedTeam === team.id
                        ? "bg-[#08104a] text-white focus:bg-[#08104a] focus:text-white"
                        : "text-slate-700 hover:bg-slate-100"
                    )}
                  >
                    <Link href={buildHref({ team: team.id })}>{team.name}</Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{categoryDescription(category)}</p>
          </div>

          <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-slate-50 text-[11px] font-extrabold uppercase tracking-wide text-slate-600">
                <tr>
                  <th className="px-3 py-3">#</th>
                  <th className="px-3 py-3">Player</th>
                  <th className="px-3 py-3">Team</th>
                  <th className="px-3 py-3">Mat</th>
                  <th className="px-3 py-3">Inns</th>
                  {category === "most-runs" || category === "best-strike-rate" || category === "most-sixes" ? (
                    <>
                      <th className="px-3 py-3">Runs</th>
                      <th className="px-3 py-3">HS</th>
                      <th className="px-3 py-3">Avg</th>
                      <th className="px-3 py-3">SR</th>
                      <th className="px-3 py-3">4s</th>
                      <th className="px-3 py-3">6s</th>
                    </>
                  ) : (
                    <>
                      <th className="px-3 py-3">Wkts</th>
                      <th className="px-3 py-3">BBI</th>
                      <th className="px-3 py-3">Avg</th>
                      <th className="px-3 py-3">Econ</th>
                      <th className="px-3 py-3">Overs</th>
                    </>
                  )}
                </tr>
              </thead>
              <tbody>
                {rankedRows.length ? (
                  rankedRows.slice(0, 20).map((row, index) => (
                    <tr key={`${row.playerId}-${row.teamId}-${row.matches}-${index}`} className="border-t border-slate-100">
                      <td className="px-3 py-3 font-bold text-slate-700">{index + 1}</td>
                      <td className="px-3 py-3 font-semibold text-slate-900">{row.playerName}</td>
                      <td className="px-3 py-3 text-slate-700">{row.teamName}</td>
                      <td className="px-3 py-3 text-slate-700">{row.matches}</td>
                      <td className="px-3 py-3 text-slate-700">{row.innings}</td>
                      {category === "most-runs" || category === "best-strike-rate" || category === "most-sixes" ? (
                        <>
                          <td className="px-3 py-3 font-semibold text-slate-900">{row.runs}</td>
                          <td className="px-3 py-3 text-slate-700">{row.highestScore ?? "-"}</td>
                          <td className="px-3 py-3 text-slate-700">{formatStat(row.battingAverage, 2)}</td>
                          <td className="px-3 py-3 text-slate-700">{formatStat(row.strikeRate, 2)}</td>
                          <td className="px-3 py-3 text-slate-700">{row.fours}</td>
                          <td className="px-3 py-3 font-semibold text-slate-900">{row.sixes}</td>
                        </>
                      ) : (
                        <>
                          <td className="px-3 py-3 font-semibold text-slate-900">{row.wickets}</td>
                          <td className="px-3 py-3 text-slate-700">{row.bestBowling ?? "-"}</td>
                          <td className="px-3 py-3 text-slate-700">{formatStat(row.bowlingAverage, 2)}</td>
                          <td className="px-3 py-3 text-slate-700">{formatStat(row.economy, 2)}</td>
                          <td className="px-3 py-3 text-slate-700">{formatStat(row.overs, 1)}</td>
                        </>
                      )}
                    </tr>
                  ))
                ) : (
                  <tr className="border-t border-slate-100">
                    <td colSpan={12} className="px-3 py-8 text-center text-sm text-slate-500">
                      No leaderboard records for this filter.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <aside className="space-y-4">
          <div className="rounded-lg border border-[#0b1454] bg-[#0b1454] p-4 text-white">
            <p className="text-xs font-bold uppercase tracking-wide text-brand-200">Top Performer</p>
            <p className="mt-2 text-xl font-extrabold">{leader?.playerName ?? "-"}</p>
            <p className="mt-1 text-sm text-brand-100">{leader?.teamName ?? "-"}</p>
            <p className="mt-4 inline-flex rounded-full bg-white/20 px-3 py-1 text-sm font-bold">
              {categoryHeadline(category, leader)}
            </p>
          </div>

          <Card className="p-4">
            <p className="text-xs font-bold uppercase tracking-wide text-slate-500">Category Summary</p>
            <ul className="mt-3 space-y-2 text-sm text-slate-700">
              <li className="rounded-md bg-slate-50 px-3 py-2">Leaderboard entries: {rankedRows.length}</li>
              <li className="rounded-md bg-slate-50 px-3 py-2">Selected team: {selectedTeam === "all" ? "All Teams" : teams.find((t) => t.id === selectedTeam)?.name}</li>
              <li className="rounded-md bg-slate-50 px-3 py-2">Category: {categoryItems.find((item) => item.key === category)?.label}</li>
            </ul>
          </Card>

          <Card className="p-4">
            <p className="text-xs font-bold uppercase tracking-wide text-slate-500">Quick Links</p>
            <div className="mt-3 flex flex-col gap-2">
              <Link href="/matches" className="rounded-md bg-slate-100 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-200">
                Match Centre
              </Link>
              <Link href="/rankings" className="rounded-md bg-slate-100 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-200">
                Team Standings
              </Link>
            </div>
          </Card>
        </aside>
      </section>
    </div>
  );
}

