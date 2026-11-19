import Link from "next/link";
import { FiAward, FiChevronDown } from "react-icons/fi";
import { AdSlot } from "@/components/shared/AdSlot";
import { EmptyState } from "@/components/shared/EmptyState";
import { Card } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { getStandingsSeasons } from "@/lib/api/read";
import { cn } from "@/lib/utils/text";
import type { StandingsSeason, StandingsSeries, StandingsStage } from "@/types/api";

type RankingsPageProps = {
  searchParams?: Promise<{
    season?: string;
    series?: string;
    stage?: string;
  }>;
};

function formatNrr(value: number): string {
  return `${value >= 0 ? "+" : ""}${value.toFixed(3)}`;
}

function sortSeasonsLatestFirst(seasons: StandingsSeason[]): StandingsSeason[] {
  return [...seasons].sort((a, b) => {
    const aYear = Number(a.season);
    const bYear = Number(b.season);
    const bothNumeric = Number.isFinite(aYear) && Number.isFinite(bYear);
    if (bothNumeric) return bYear - aYear;
    return b.season.localeCompare(a.season);
  });
}

function resolveSeries(season: StandingsSeason, requested?: string): StandingsSeries | null {
  if (!season.series.length) return null;
  return season.series.find((series) => series.id === requested) ?? season.series[0];
}

function resolveStage(series: StandingsSeries | null, requested?: string): StandingsStage | null {
  if (!series || !series.stages.length) return null;
  return series.stages.find((stage) => stage.id === requested) ?? series.stages[0];
}

function buildHref(season: string, series?: string, stage?: string): string {
  const query = new URLSearchParams();
  query.set("season", season);
  if (series) query.set("series", series);
  if (stage) query.set("stage", stage);
  return `/rankings?${query.toString()}`;
}

export default async function RankingsPage({ searchParams }: RankingsPageProps): Promise<React.ReactElement> {
  const params = await searchParams;
  const seasons = sortSeasonsLatestFirst(await getStandingsSeasons());

  if (!seasons.length) {
    return (
      <div className="space-y-5">
        <Card as="section" variant="strong" className="p-5 sm:p-6">
          <div className="flex items-start gap-3">
            <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-700 ring-1 ring-brand-200/80">
              <FiAward className="h-5 w-5" aria-hidden="true" />
            </span>
            <div>
              <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">Standings</h1>
              <p className="mt-1 text-sm text-slate-600">
                Tournament group standings, net run rate, and qualification snapshot.
              </p>
            </div>
          </div>
        </Card>
        <EmptyState title="No standings available" description="No tournament standings data found right now." />
      </div>
    );
  }

  const currentSeason = seasons.find((season) => season.season === params?.season) ?? seasons[0];
  const currentSeries = resolveSeries(currentSeason, params?.series);
  const currentStage = resolveStage(currentSeries, params?.stage);
  const filterTriggerClass =
    "group inline-flex w-full items-center justify-between gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm font-bold text-slate-800 shadow-sm transition hover:border-brand-300 hover:bg-brand-50/40 sm:text-base";

  return (
    <div className="space-y-5">
      <Card as="section" variant="strong" className="p-5 sm:p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-700 ring-1 ring-brand-200/80">
              <FiAward className="h-5 w-5" aria-hidden="true" />
            </span>
            <div>
              <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">Standings</h1>
              <p className="mt-1 text-sm text-slate-600">
                Tournament group standings, net run rate, and qualification snapshot.
              </p>
            </div>
          </div>
          <span className="score-pill">
            {currentSeries?.label ?? "Tournament"} · {currentSeason.season}
          </span>
        </div>
      </Card>

      <AdSlot variant="banner-compact" label="Sponsored · Tournament Standings" />

      <Card as="section" variant="strong" className="overflow-hidden">
        <div className="border-b border-slate-200/80 bg-white/80 px-4 py-4 sm:px-5">
          <div className="grid gap-3 md:grid-cols-2">
            <div>
              <p className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500">Series</p>
              <div className="mt-1.5">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button type="button" className={filterTriggerClass}>
                      <span className="truncate">{currentSeries?.label ?? "No series"}</span>
                      <FiChevronDown className="h-4 w-4 shrink-0 text-slate-500 transition group-data-[state=open]:rotate-180" aria-hidden="true" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" className="w-64">
                    {(currentSeason.series ?? []).map((series) => {
                      const stage = resolveStage(series);
                      return (
                        <DropdownMenuItem
                          key={series.id}
                          asChild
                          className={
                            series.id === currentSeries?.id
                              ? "bg-[#08104a] text-white focus:bg-[#08104a] focus:text-white"
                              : "text-slate-700"
                          }
                        >
                          <Link href={buildHref(currentSeason.season, series.id, stage?.id)}>{series.label}</Link>
                        </DropdownMenuItem>
                      );
                    })}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>

            <div>
              <p className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500">Season</p>
              <div className="mt-1.5">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button type="button" className={filterTriggerClass}>
                      <span>{currentSeason.season}</span>
                      <FiChevronDown className="h-4 w-4 shrink-0 text-slate-500 transition group-data-[state=open]:rotate-180" aria-hidden="true" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" className="w-44">
                    {seasons.map((season) => {
                      const latestSeries = resolveSeries(season);
                      const latestStage = resolveStage(latestSeries);
                      return (
                        <DropdownMenuItem
                          key={season.season}
                          asChild
                          className={
                            season.season === currentSeason.season
                              ? "bg-[#08104a] text-white focus:bg-[#08104a] focus:text-white"
                              : "text-slate-700"
                          }
                        >
                          <Link href={buildHref(season.season, latestSeries?.id, latestStage?.id)}>{season.season}</Link>
                        </DropdownMenuItem>
                      );
                    })}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </div>
        </div>

        {(currentSeries?.stages ?? []).length ? (
          <div className="flex flex-wrap gap-1.5 border-b border-slate-200/80 bg-slate-50/70 px-4 py-2.5 sm:px-5">
            {(currentSeries?.stages ?? []).map((stage) => (
              <Link
                key={stage.id}
                href={buildHref(currentSeason.season, currentSeries?.id, stage.id)}
                className={cn(
                  "rounded-xl px-3.5 py-2 text-xs font-bold uppercase tracking-wide transition sm:text-sm",
                  currentStage?.id === stage.id
                    ? "bg-[rgb(6,12,58)] text-white shadow-sm"
                    : "text-slate-600 hover:bg-white hover:text-slate-900"
                )}
              >
                {stage.label}
              </Link>
            ))}
          </div>
        ) : null}

        <div className="space-y-6 px-4 py-5 md:px-5">
          {!currentStage ? (
            <EmptyState title="No stage data" description="No stage standings are available for this series." />
          ) : (
            currentStage.groups.map((group) => (
              <section key={group.id} className="space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h2 className="text-lg font-extrabold tracking-tight text-slate-900 sm:text-xl">{group.label}</h2>
                  <span className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-0.5 text-xs font-bold text-slate-600">
                    {group.rows.length} teams
                  </span>
                </div>

                <div className="overflow-x-auto rounded-2xl border border-slate-200/90 bg-white shadow-sm">
                  <table className="min-w-[640px] w-full text-left text-sm">
                    <thead className="bg-slate-50/90">
                      <tr className="border-b border-slate-200 text-[11px] font-extrabold uppercase tracking-wider text-slate-500">
                        <th className="px-4 py-3">Team</th>
                        <th className="px-3 py-3 text-right tabular-nums">M</th>
                        <th className="px-3 py-3 text-right tabular-nums">W</th>
                        <th className="px-3 py-3 text-right tabular-nums">L</th>
                        <th className="px-3 py-3 text-right tabular-nums">NRR</th>
                        <th className="px-4 py-3 text-right font-extrabold text-slate-800 tabular-nums">Pts</th>
                      </tr>
                    </thead>
                    <tbody>
                      {group.rows.length ? (
                        group.rows.map((row, index) => (
                          <tr
                            key={`${group.id}-${row.teamId}`}
                            className={cn(
                              "border-b border-slate-100 transition-colors last:border-b-0 hover:bg-brand-50/35",
                              row.highlight && "bg-emerald-50/45"
                            )}
                          >
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-3">
                                <span
                                  className={cn(
                                    "inline-flex h-6 w-7 shrink-0 items-center justify-center rounded-md text-xs font-extrabold tabular-nums",
                                    index < 2
                                      ? "bg-emerald-100 text-emerald-800"
                                      : "bg-slate-100 text-slate-600"
                                  )}
                                >
                                  #{index + 1}
                                </span>
                                <span
                                  className="inline-flex h-7 w-9 shrink-0 items-center justify-center rounded-lg border border-brand-200/80 bg-brand-50 text-[10px] font-extrabold uppercase text-brand-700"
                                  title={row.teamName}
                                >
                                  {row.shortCode.slice(0, 3)}
                                </span>
                                <div className="min-w-0">
                                  <p className="truncate font-bold text-slate-900">{row.teamName}</p>
                                  <p className="text-[11px] font-semibold text-slate-500">{row.shortCode}</p>
                                </div>
                              </div>
                            </td>
                            <td className="px-3 py-3 text-right font-medium tabular-nums text-slate-700">{row.played}</td>
                            <td className="px-3 py-3 text-right font-medium tabular-nums text-slate-700">{row.won}</td>
                            <td className="px-3 py-3 text-right font-medium tabular-nums text-slate-700">{row.lost}</td>
                            <td
                              className={cn(
                                "px-3 py-3 text-right tabular-nums",
                                row.netRunRate >= 0 ? "font-semibold text-emerald-700" : "font-medium text-slate-600"
                              )}
                            >
                              {formatNrr(row.netRunRate)}
                            </td>
                            <td className="px-4 py-3 text-right">
                              <span className="score-pill tabular-nums">{row.points}</span>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={6} className="py-8 text-center text-sm text-slate-500">
                            No teams available for this group.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </section>
            ))
          )}
        </div>
      </Card>

      <AdSlot variant="leaderboard" label="Sponsored · Standings Leaderboard" />
    </div>
  );
}

