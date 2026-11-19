import type { Metadata } from "next";
import Link from "next/link";
import { BiBroadcast } from "react-icons/bi";
import { FiCalendar, FiCheckCircle, FiChevronDown } from "react-icons/fi";
import { getMatches } from "@/lib/api/read";
import { cn } from "@/lib/utils/text";
import { LiveMatchList } from "@/components/live/LiveMatchList";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

type MatchesPageProps = {
  searchParams?: Promise<{
    tab?: string;
    day?: string;
    series?: string;
    team?: string;
    venue?: string;
  }>;
};

export const metadata: Metadata = {
  title: "Matches",
  description: "Results and fixtures in a clean match-centre layout."
};

export default async function MatchesPage({ searchParams }: MatchesPageProps): Promise<React.ReactElement> {
  const params = await searchParams;
  const tab = params?.tab === "results" || params?.tab === "fixtures" || params?.tab === "live-upcoming" ? params.tab : "live-upcoming";
  const baseMatches = (() => {
    if (tab === "results") return getMatches("completed");
    if (tab === "fixtures") return getMatches("upcoming");
    return getMatches().then((matches) => matches.filter((match) => match.status === "live" || match.status === "innings_break" || match.status === "upcoming"));
  })();
  const resolvedMatches = await baseMatches;

  const toMatchDay = (iso?: string): string => (iso ? new Date(iso).toISOString().slice(0, 10) : new Date().toISOString().slice(0, 10));
  const getMatchDay = (match: { status: string; startAt?: string; lastUpdatedAt?: string }): string => {
    const dateSource = match.status === "completed" ? match.lastUpdatedAt : match.startAt ?? match.lastUpdatedAt;
    return toMatchDay(dateSource);
  };

  const availableDays = [...new Set(resolvedMatches.map((match) => getMatchDay(match)))].sort((a, b) =>
    tab === "results" ? b.localeCompare(a) : a.localeCompare(b)
  );

  const selectedDay =
    params?.day && availableDays.includes(params.day)
      ? params.day
      : availableDays[0] ?? new Date().toISOString().slice(0, 10);

  const series = [...new Set(resolvedMatches.map((match) => match.seriesName))].sort((a, b) => a.localeCompare(b));
  const selectedSeries = series.includes(params?.series ?? "") ? (params?.series as string) : "all";
  const seriesScopedMatches =
    selectedSeries === "all" ? resolvedMatches : resolvedMatches.filter((match) => match.seriesName === selectedSeries);
  const teams = Array.from(
    new Map(
      seriesScopedMatches.flatMap((match) => [
        [match.teamA.id, match.teamA.name],
        [match.teamB.id, match.teamB.name]
      ])
    )
  )
    .map(([id, name]) => ({ id, name }))
    .sort((a, b) => a.name.localeCompare(b.name));

  const venues = [...new Set(resolvedMatches.map((match) => match.venue))].sort((a, b) => a.localeCompare(b));
  const selectedTeam = teams.some((team) => team.id === params?.team) ? (params?.team as string) : "all";
  const selectedVenue = venues.includes(params?.venue ?? "") ? (params?.venue as string) : "all";

  const matches = resolvedMatches
    .filter((match) => getMatchDay(match) === selectedDay)
    .filter((match) => selectedSeries === "all" || match.seriesName === selectedSeries)
    .filter((match) => selectedTeam === "all" || match.teamA.id === selectedTeam || match.teamB.id === selectedTeam)
    .filter((match) => selectedVenue === "all" || match.venue === selectedVenue);

  const sectionDate = new Date(`${selectedDay}T00:00:00Z`)
    .toLocaleDateString("en-GB", { day: "2-digit", month: "long", year: "numeric" })
    .toUpperCase();

  const seriesLabel = selectedSeries === "all" ? "All Series" : selectedSeries;
  const teamLabel = selectedTeam === "all" ? "All Teams" : teams.find((team) => team.id === selectedTeam)?.name ?? "All Teams";
  const venueLabel = selectedVenue === "all" ? "All Venues" : selectedVenue;
  const filterTriggerClass =
    "group inline-flex w-full sm:w-[220px] items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-brand-300 hover:bg-brand-50/40 data-[state=open]:border-brand-500 data-[state=open]:bg-brand-50 data-[state=open]:text-brand-700";

  const buildHref = (overrides: Partial<{ tab: string; day: string; series: string; team: string; venue: string }>): string => {
    const query = new URLSearchParams();
    query.set("tab", overrides.tab ?? tab);
    query.set("day", overrides.day ?? selectedDay);

    const seriesValue = overrides.series ?? selectedSeries;
    const teamValue = overrides.team ?? selectedTeam;
    const venueValue = overrides.venue ?? selectedVenue;

    if (seriesValue !== "all") query.set("series", seriesValue);
    if (teamValue !== "all") query.set("team", teamValue);
    if (venueValue !== "all") query.set("venue", venueValue);

    return `/matches?${query.toString()}`;
  };

  const toCardSummary = (match: { status: string; resultText?: string }): string => {
    if (match.resultText) return match.resultText;
    if (match.status === "live") return "Live";
    if (match.status === "innings_break") return "Innings break";
    if (match.status === "upcoming") return "Upcoming fixture";
    return "Match completed";
  };

  const cardMatches = matches.map((match) => ({
    id: match.id,
    slug: match.id,
    status: match.status,
    format: match.format,
    seriesName: match.seriesName,
    venue: match.venue,
    teamA: match.teamA,
    teamB: match.teamB,
    summary: toCardSummary(match),
    startAt: match.startAt ?? match.lastUpdatedAt ?? new Date().toISOString(),
    lastUpdatedAt: match.lastUpdatedAt ?? new Date().toISOString()
  }));

  return (
    <div className="space-y-6">
      <div className="-mx-1 overflow-x-auto pb-1">
        <div className="flex min-w-max items-center gap-6 border-b border-slate-200 px-1">
          <Link
            href="/matches?tab=live-upcoming"
            className={cn(
              "inline-flex items-center gap-1.5 border-b-2 pb-2 text-xs font-extrabold uppercase tracking-wide transition-colors sm:text-sm",
              tab === "live-upcoming"
                ? "border-[#08104a] text-[#08104a]"
                : "border-transparent text-slate-500 hover:text-slate-700"
            )}
          >
            <BiBroadcast className="h-3.5 w-3.5" aria-hidden="true" />
            Live & Upcoming
          </Link>
          <Link
            href="/matches?tab=results"
            className={cn(
              "inline-flex items-center gap-1.5 border-b-2 pb-2 text-xs font-extrabold uppercase tracking-wide transition-colors sm:text-sm",
              tab === "results"
                ? "border-[#08104a] text-[#08104a]"
                : "border-transparent text-slate-500 hover:text-slate-700"
            )}
          >
            <FiCheckCircle className="h-3.5 w-3.5" aria-hidden="true" />
            Results
          </Link>
          <Link
            href="/matches?tab=fixtures"
            className={cn(
              "inline-flex items-center gap-1.5 border-b-2 pb-2 text-xs font-extrabold uppercase tracking-wide transition-colors sm:text-sm",
              tab === "fixtures"
                ? "border-[#08104a] text-[#08104a]"
                : "border-transparent text-slate-500 hover:text-slate-700"
            )}
          >
            <FiCalendar className="h-3.5 w-3.5" aria-hidden="true" />
            Fixtures
          </Link>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              className={filterTriggerClass}
            >
              <span className="truncate">Series: {seriesLabel}</span>
              <FiChevronDown
                aria-hidden="true"
                className="h-4 w-4 shrink-0 text-slate-500 transition group-data-[state=open]:rotate-180 group-data-[state=open]:text-brand-700"
              />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="max-h-60 w-52 overflow-y-auto">
            <DropdownMenuItem
              asChild
              className={cn(
                "text-sm font-semibold",
                selectedSeries === "all"
                  ? "bg-brand-600 text-white focus:bg-brand-600 focus:text-white"
                  : "text-slate-700 hover:bg-slate-100"
              )}
            >
              <Link href={buildHref({ series: "all" })}>All Series</Link>
            </DropdownMenuItem>
            {series.map((seriesName) => (
              <DropdownMenuItem
                key={seriesName}
                asChild
                className={cn(
                  "text-sm font-semibold",
                  selectedSeries === seriesName
                    ? "bg-brand-600 text-white focus:bg-brand-600 focus:text-white"
                    : "text-slate-700 hover:bg-slate-100"
                )}
              >
                <Link href={buildHref({ series: seriesName })}>{seriesName}</Link>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              className={filterTriggerClass}
            >
              <span className="truncate">Team: {teamLabel}</span>
              <FiChevronDown
                aria-hidden="true"
                className="h-4 w-4 shrink-0 text-slate-500 transition group-data-[state=open]:rotate-180 group-data-[state=open]:text-brand-700"
              />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="max-h-60 w-56 overflow-y-auto">
            <DropdownMenuItem
              asChild
              className={cn(
                "text-sm font-semibold",
                selectedTeam === "all"
                  ? "bg-brand-600 text-white focus:bg-brand-600 focus:text-white"
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
                    ? "bg-brand-600 text-white focus:bg-brand-600 focus:text-white"
                    : "text-slate-700 hover:bg-slate-100"
                )}
              >
                <Link href={buildHref({ team: team.id })}>{team.name}</Link>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              className={filterTriggerClass}
            >
              <span className="truncate">Venue: {venueLabel}</span>
              <FiChevronDown
                aria-hidden="true"
                className="h-4 w-4 shrink-0 text-slate-500 transition group-data-[state=open]:rotate-180 group-data-[state=open]:text-brand-700"
              />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="max-h-60 w-64 overflow-y-auto">
            <DropdownMenuItem
              asChild
              className={cn(
                "text-sm font-semibold",
                selectedVenue === "all"
                  ? "bg-brand-600 text-white focus:bg-brand-600 focus:text-white"
                  : "text-slate-700 hover:bg-slate-100"
              )}
            >
              <Link href={buildHref({ venue: "all" })}>All Venues</Link>
            </DropdownMenuItem>
            {venues.map((venue) => (
              <DropdownMenuItem
                key={venue}
                asChild
                className={cn(
                  "text-sm font-semibold",
                  selectedVenue === venue
                    ? "bg-brand-600 text-white focus:bg-brand-600 focus:text-white"
                    : "text-slate-700 hover:bg-slate-100"
                )}
              >
                <Link href={buildHref({ venue })}>{venue}</Link>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="inline-flex max-w-full items-center gap-2 rounded-sm bg-[#08104a] px-4 py-2.5 text-xs font-extrabold uppercase tracking-wide text-white sm:text-base">
        <FiCalendar className="h-4 w-4" aria-hidden="true" />
        <span className="truncate">{sectionDate}</span>
      </div>

      <div className="space-y-4">
        {matches.length ? (
          <LiveMatchList matches={cardMatches} />
        ) : (
          <div className="space-y-4">
            <div className="rounded-lg border border-dashed border-slate-300 bg-white p-8 text-center">
              <p className="text-base font-semibold text-slate-900">No matches found for the selected filters.</p>
              <p className="mt-2 text-sm text-slate-600">Try changing date, series, team, or venue.</p>
            </div>
            <LiveMatchList matches={[]} emptyCount={3} emptyLabel="No data found" />
          </div>
        )}
      </div>
    </div>
  );
}
