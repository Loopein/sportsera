import Link from "next/link";
import { FiChevronDown } from "react-icons/fi";
import { Card } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { getStandingsSeasons } from "@/lib/api/read";
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
        <section>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Standings</h1>
          <p className="mt-1 text-sm text-slate-600">Tournament group standings snapshot.</p>
        </section>
        <Card as="section" variant="strong" className="p-6">
          <p className="text-sm text-slate-600">No standings data available in mock database.</p>
        </Card>
      </div>
    );
  }

  const currentSeason = seasons.find((season) => season.season === params?.season) ?? seasons[0];
  const currentSeries = resolveSeries(currentSeason, params?.series);
  const currentStage = resolveStage(currentSeries, params?.stage);
  const filterTriggerClass =
    "group inline-flex w-full items-center justify-between gap-2 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-lg font-semibold text-brand-600 shadow-sm transition hover:border-brand-200 hover:bg-brand-50";

  return (
    <div className="space-y-5">
      <section>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Standings</h1>
        <p className="mt-1 text-sm text-slate-600">Tournament group standings snapshot.</p>
      </section>

      <Card as="section" variant="strong" className="overflow-hidden">
        <div className="border-b border-slate-200 bg-white/80 px-5 py-4">
          <div className="grid gap-3 md:grid-cols-2">
            <div>
              <p className="text-sm text-slate-600">Series</p>
              <div className="mt-1">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button type="button" className={filterTriggerClass}>
                      <span className="truncate">{currentSeries?.label ?? "No series"}</span>
                      <FiChevronDown className="h-4 w-4 text-slate-500 transition group-data-[state=open]:rotate-180" aria-hidden="true" />
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
              <p className="text-sm text-slate-600">Season</p>
              <div className="mt-1">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button type="button" className={filterTriggerClass}>
                      <span>{currentSeason.season}</span>
                      <FiChevronDown className="h-4 w-4 text-slate-500 transition group-data-[state=open]:rotate-180" aria-hidden="true" />
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

        <div className="flex flex-wrap border-b border-slate-200 bg-white">
          {(currentSeries?.stages ?? []).map((stage) => (
            <Link
              key={stage.id}
              href={buildHref(currentSeason.season, currentSeries?.id, stage.id)}
              className={`px-4 py-3 text-sm font-semibold transition ${
                currentStage?.id === stage.id
                  ? "border-b-2 border-brand-600 text-slate-900"
                  : "border-b-2 border-transparent text-slate-500 hover:text-slate-700"
              }`}
            >
              {stage.label}
            </Link>
          ))}
        </div>

        <div className="space-y-7 px-4 py-5 md:px-5">
          {!currentStage ? (
            <section>
              <p className="py-8 text-center text-sm text-slate-500">No stage data available for this series.</p>
            </section>
          ) : (
            currentStage.groups.map((group) => (
              <section key={group.id}>
                <div className="mb-2 flex items-center justify-between">
                  <h2 className="text-3xl font-bold text-slate-800">{group.label}</h2>
                </div>

                <div className="overflow-x-auto">
                  <table className="min-w-[620px] w-full text-left text-sm">
                    <thead>
                      <tr className="border-b border-slate-200 text-slate-500">
                        <th className="py-2 pr-3 font-medium">Team</th>
                        <th className="py-2 pr-3 text-right font-medium">M</th>
                        <th className="py-2 pr-3 text-right font-medium">W</th>
                        <th className="py-2 pr-3 text-right font-medium">L</th>
                        <th className="py-2 pr-3 text-right font-medium">NRR</th>
                        <th className="py-2 text-right font-semibold text-slate-700">Pts</th>
                      </tr>
                    </thead>
                    <tbody>
                      {group.rows.length ? (
                        group.rows.map((row, index) => (
                          <tr
                            key={`${group.id}-${row.teamId}`}
                            className={`border-b border-slate-100 last:border-b-0 ${row.highlight ? "bg-slate-100" : ""}`}
                          >
                            <td className="py-2.5 pr-3">
                              <div className="flex items-center gap-3">
                                <span className="w-4 text-base text-slate-600">{index + 1}</span>
                                <span
                                  className="inline-flex h-6 w-8 items-center justify-center rounded-sm border border-brand-200 bg-brand-50 text-[10px] font-bold text-brand-700"
                                  title={row.teamName}
                                >
                                  {row.shortCode.slice(0, 2)}
                                </span>
                                <span className="font-semibold text-slate-800">{row.shortCode}</span>
                              </div>
                            </td>
                            <td className="py-2.5 pr-3 text-right text-slate-600">{row.played}</td>
                            <td className="py-2.5 pr-3 text-right text-slate-600">{row.won}</td>
                            <td className="py-2.5 pr-3 text-right text-slate-600">{row.lost}</td>
                            <td className="py-2.5 pr-3 text-right text-slate-600">{formatNrr(row.netRunRate)}</td>
                            <td className="py-2.5 text-right font-extrabold text-slate-800">{row.points}</td>
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
    </div>
  );
}

