import type { Metadata } from "next";
import Link from "next/link";
import { FiAward, FiBarChart2, FiChevronDown, FiChevronRight } from "react-icons/fi";
import { AdSlot } from "@/components/shared/AdSlot";
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
      <Card as="section" variant="strong" className="p-5 sm:p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-700 ring-1 ring-brand-200/80">
              <FiBarChart2 className="h-5 w-5" aria-hidden="true" />
            </span>
            <div>
              <p className="text-[11px] font-extrabold uppercase tracking-[0.14em] text-brand-700">
                ICC Men&apos;s T20 World Cup 2026
              </p>
              <h1 className="mt-1 text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">Tournament Stats</h1>
            </div>
          </div>

          <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/90 px-3 py-1 text-xs font-bold uppercase tracking-wide text-slate-600 shadow-sm">
            <Link href="/matches" className="transition hover:text-brand-700">
              Matches
            </Link>
            <span className="text-slate-300">/</span>
            <span className="text-[rgb(6,12,58)]">Stats</span>
          </div>
        </div>

        <div className="-mx-1 mt-5 overflow-x-auto pb-1">
          <div className="inline-flex min-w-max flex-wrap gap-2 px-1">
            {categoryItems.map((item) => (
              <Link
                key={item.key}
                href={buildHref({ category: item.key })}
                className={cn(
                  "rounded-xl px-3.5 py-2 text-xs font-extrabold uppercase tracking-wide transition sm:text-sm",
                  category === item.key
                    ? "bg-[rgb(6,12,58)] text-white shadow-sm"
                    : "border border-slate-200 bg-white/90 text-slate-700 hover:border-brand-200 hover:bg-brand-50 hover:text-brand-700"
                )}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </Card>

      <section className="grid gap-5 xl:grid-cols-[1fr_310px]">
        <div className="space-y-4">
          <Card className="space-y-3 p-3.5 sm:p-4">
            <div className="flex flex-wrap items-center justify-between gap-2.5">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button type="button" className={filterTriggerClass}>
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
              <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-600">
                {categoryDescription(category)}
              </span>
            </div>

            <AdSlot variant="banner-compact" label="Sponsored · Stats Filter" />
          </Card>

          <div className="overflow-x-auto rounded-2xl border border-slate-200/90 bg-white shadow-sm">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-slate-50/90 text-[11px] font-extrabold uppercase tracking-wider text-slate-500">
                <tr className="border-b border-slate-200">
                  <th className="px-3.5 py-3 tabular-nums">#</th>
                  <th className="px-3.5 py-3">Player</th>
                  <th className="px-3.5 py-3">Team</th>
                  <th className="px-3 py-3 text-right tabular-nums">Mat</th>
                  <th className="px-3 py-3 text-right tabular-nums">Inns</th>
                  {category === "most-runs" || category === "best-strike-rate" || category === "most-sixes" ? (
                    <>
                      <th className="px-3.5 py-3 text-right tabular-nums">Runs</th>
                      <th className="px-3 py-3 text-right tabular-nums">HS</th>
                      <th className="px-3.5 py-3 text-right tabular-nums">Avg</th>
                      <th className="px-3.5 py-3 text-right tabular-nums">SR</th>
                      <th className="px-3.5 py-3 text-right tabular-nums">4s</th>
                      <th className="px-3.5 py-3 text-right tabular-nums">6s</th>
                    </>
                  ) : (
                    <>
                      <th className="px-3.5 py-3 text-right tabular-nums">Wkts</th>
                      <th className="px-3.5 py-3 text-right tabular-nums">BBI</th>
                      <th className="px-3.5 py-3 text-right tabular-nums">Avg</th>
                      <th className="px-3.5 py-3 text-right tabular-nums">Econ</th>
                      <th className="px-3.5 py-3 text-right tabular-nums">Overs</th>
                    </>
                  )}
                </tr>
              </thead>
              <tbody>
                {rankedRows.length ? (
                  rankedRows.slice(0, 20).map((row, index) => {
                    const rankClass =
                      index === 0
                        ? "bg-amber-100 text-amber-800 ring-1 ring-amber-300/70"
                        : index === 1
                          ? "bg-slate-200 text-slate-800"
                          : index === 2
                            ? "bg-orange-100 text-orange-800"
                            : "bg-slate-100 text-slate-600";

                    return (
                      <tr
                        key={`${row.playerId}-${row.teamId}-${row.matches}-${index}`}
                        className="border-t border-slate-100 transition-colors hover:bg-brand-50/35"
                      >
                        <td className="px-3.5 py-3">
                          <span
                            className={cn(
                              "inline-flex h-6 w-6 items-center justify-center rounded-md text-xs font-extrabold tabular-nums",
                              rankClass
                            )}
                          >
                            {index + 1}
                          </span>
                        </td>
                        <td className="px-3.5 py-3 font-bold text-slate-900">{row.playerName}</td>
                        <td className="px-3.5 py-3 font-medium text-slate-600">{row.teamName}</td>
                        <td className="px-3.5 py-3 text-right tabular-nums text-slate-700">{row.matches}</td>
                        <td className="px-3.5 py-3 text-right tabular-nums text-slate-700">{row.innings}</td>
                        {category === "most-runs" || category === "best-strike-rate" || category === "most-sixes" ? (
                          <>
                            <td
                              className={cn(
                                "px-3.5 py-3 text-right tabular-nums",
                                category === "most-runs" ? "font-extrabold text-brand-700" : "font-semibold text-slate-900"
                              )}
                            >
                              {row.runs}
                            </td>
                            <td className="px-3.5 py-3 text-right tabular-nums text-slate-700">{row.highestScore ?? "-"}</td>
                            <td className="px-3.5 py-3 text-right tabular-nums text-slate-700">{formatStat(row.battingAverage, 2)}</td>
                            <td
                              className={cn(
                                "px-3.5 py-3 text-right tabular-nums",
                                category === "best-strike-rate" ? "font-extrabold text-brand-700" : "text-slate-700"
                              )}
                            >
                              {formatStat(row.strikeRate, 2)}
                            </td>
                            <td className="px-3.5 py-3 text-right tabular-nums text-slate-700">{row.fours}</td>
                            <td
                              className={cn(
                                "px-3.5 py-3 text-right tabular-nums",
                                category === "most-sixes" ? "font-extrabold text-brand-700" : "font-semibold text-slate-900"
                              )}
                            >
                              {row.sixes}
                            </td>
                          </>
                        ) : (
                          <>
                            <td
                              className={cn(
                                "px-3.5 py-3 text-right tabular-nums",
                                category === "most-wickets" ? "font-extrabold text-brand-700" : "font-semibold text-slate-900"
                              )}
                            >
                              {row.wickets}
                            </td>
                            <td className="px-3.5 py-3 text-right tabular-nums text-slate-700">{row.bestBowling ?? "-"}</td>
                            <td className="px-3.5 py-3 text-right tabular-nums text-slate-700">{formatStat(row.bowlingAverage, 2)}</td>
                            <td
                              className={cn(
                                "px-3.5 py-3 text-right tabular-nums",
                                category === "best-economy" ? "font-extrabold text-brand-700" : "text-slate-700"
                              )}
                            >
                              {formatStat(row.economy, 2)}
                            </td>
                            <td className="px-3.5 py-3 text-right tabular-nums text-slate-700">{formatStat(row.overs, 1)}</td>
                          </>
                        )}
                      </tr>
                    );
                  })
                ) : (
                  <tr className="border-t border-slate-100">
                    <td colSpan={11} className="px-3 py-8 text-center text-sm text-slate-500">
                      No leaderboard records for this filter.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <aside className="space-y-4">
          <div className="rounded-2xl border border-[#14226b] bg-gradient-to-br from-[#060c3a] via-[#0d1b63] to-[#132cc2] p-5 text-white shadow-md">
            <div className="flex items-center justify-between gap-2">
              <p className="text-xs font-extrabold uppercase tracking-wider text-brand-200">Top Performer</p>
              <FiAward className="h-4 w-4 text-amber-300" aria-hidden="true" />
            </div>
            <p className="mt-2.5 text-xl font-black tracking-tight">{leader?.playerName ?? "-"}</p>
            <p className="mt-1 text-sm font-medium text-brand-100">{leader?.teamName ?? "-"}</p>
            <p className="mt-4 inline-flex rounded-full border border-white/20 bg-white/15 px-3 py-1 text-sm font-extrabold tabular-nums">
              {categoryHeadline(category, leader)}
            </p>
          </div>

          <Card className="p-4">
            <p className="text-xs font-extrabold uppercase tracking-wider text-slate-500">Category Summary</p>
            <ul className="mt-3 space-y-2 text-sm text-slate-700">
              <li className="flex items-center justify-between rounded-xl border border-slate-200/70 bg-slate-50/80 px-3 py-2">
                <span className="text-slate-500">Entries</span>
                <span className="font-bold tabular-nums text-slate-900">{rankedRows.length}</span>
              </li>
              <li className="flex items-center justify-between rounded-xl border border-slate-200/70 bg-slate-50/80 px-3 py-2">
                <span className="text-slate-500">Selected team</span>
                <span className="truncate font-bold text-slate-900">
                  {selectedTeam === "all" ? "All Teams" : teams.find((t) => t.id === selectedTeam)?.name}
                </span>
              </li>
              <li className="flex items-center justify-between rounded-xl border border-slate-200/70 bg-slate-50/80 px-3 py-2">
                <span className="text-slate-500">Category</span>
                <span className="font-bold text-slate-900">
                  {categoryItems.find((item) => item.key === category)?.label}
                </span>
              </li>
            </ul>
          </Card>

          <Card className="p-4">
            <p className="text-xs font-extrabold uppercase tracking-wider text-slate-500">Quick Links</p>
            <div className="mt-3 flex flex-col gap-2">
              <Link
                href="/matches"
                className="group flex items-center justify-between rounded-xl border border-slate-200/80 bg-slate-50 px-3.5 py-2.5 text-sm font-bold text-slate-800 transition hover:border-brand-200 hover:bg-brand-50 hover:text-brand-700"
              >
                <span>Match Centre</span>
                <FiChevronRight className="h-4 w-4 text-slate-400 transition group-hover:translate-x-0.5 group-hover:text-brand-600" aria-hidden="true" />
              </Link>
              <Link
                href="/rankings"
                className="group flex items-center justify-between rounded-xl border border-slate-200/80 bg-slate-50 px-3.5 py-2.5 text-sm font-bold text-slate-800 transition hover:border-brand-200 hover:bg-brand-50 hover:text-brand-700"
              >
                <span>Team Standings</span>
                <FiChevronRight className="h-4 w-4 text-slate-400 transition group-hover:translate-x-0.5 group-hover:text-brand-600" aria-hidden="true" />
              </Link>
            </div>
          </Card>

          <AdSlot variant="rectangle" label="Sponsored · Stats Sidebar" />
          <AdSlot variant="native-card" label="Sponsored · Fantasy & Analytics" />
        </aside>
      </section>

      <AdSlot variant="leaderboard" label="Sponsored · Tournament Leaderboard" />
    </div>
  );
}

