import type { Metadata } from "next";
import Link from "next/link";
import { BiBroadcast } from "react-icons/bi";
import { FiCalendar, FiCheckCircle, FiChevronDown } from "react-icons/fi";
import { getMatches } from "@/lib/api/read";
import { cn } from "@/lib/utils/text";
import { LiveMatchList } from "@/components/live/LiveMatchList";
import { AdSlot } from "@/components/shared/AdSlot";
import { EmptyState } from "@/components/shared/EmptyState";
import { Tabs } from "@/components/shared/Tabs";
import { Card } from "@/components/ui/card";
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
    "group inline-flex w-full min-w-0 items-center justify-between gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-brand-300 hover:bg-brand-50/40 data-[state=open]:border-brand-500 data-[state=open]:bg-brand-50 data-[state=open]:text-brand-700 sm:w-[210px]";

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
      <Card as="section" variant="strong" className="page-hero-card p-4 sm:p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-700 ring-1 ring-brand-200/80">
              <BiBroadcast className="h-5 w-5" aria-hidden="true" />
            </span>
            <div>
              <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">Matches</h1>
              <p className="mt-1 text-sm text-slate-600">
                Browse live action, upcoming fixtures, and completed match results with instant filters.
              </p>
            </div>
          </div>
          <span className="score-pill">{matches.length} matches</span>
        </div>

        <div className="mt-5">
          <Tabs
            groupId="matches-main-tabs"
            tabs={[
              {
                href: "/matches?tab=live-upcoming",
                label: "Live & Upcoming",
                icon: <BiBroadcast className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />,
                isActive: tab === "live-upcoming"
              },
              {
                href: "/matches?tab=results",
                label: "Results",
                icon: <FiCheckCircle className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />,
                isActive: tab === "results"
              },
              {
                href: "/matches?tab=fixtures",
                label: "Fixtures",
                icon: <FiCalendar className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />,
                isActive: tab === "fixtures"
              }
            ]}
          />
        </div>
      </Card>

      <Card as="section" className="space-y-3 p-3.5 sm:p-4">
        <div className="flex flex-wrap items-center justify-between gap-2.5">
          <div className="grid w-full gap-2 sm:flex sm:w-auto sm:flex-wrap">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button type="button" className={filterTriggerClass}>
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
                <button type="button" className={filterTriggerClass}>
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
                <button type="button" className={filterTriggerClass}>
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
          {selectedSeries !== "all" || selectedTeam !== "all" || selectedVenue !== "all" ? (
            <Link
              href={buildHref({ series: "all", team: "all", venue: "all" })}
              className="inline-flex items-center rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-bold uppercase tracking-wider text-slate-700 transition hover:border-brand-300 hover:bg-brand-50 hover:text-brand-700"
            >
              Reset Filters
            </Link>
          ) : null}
        </div>

        <AdSlot variant="banner-compact" label="Sponsored · Match Filter Desk" />
      </Card>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="inline-flex max-w-full items-center gap-2 rounded-xl border border-[#4ed8a0]/35 bg-[#0b1221] px-4 py-2 text-xs font-extrabold uppercase tracking-wider text-white shadow-sm sm:text-sm">
          <FiCalendar className="h-4 w-4 text-[#4ed8a0]" aria-hidden="true" />
          <span className="truncate">{sectionDate}</span>
        </div>
        {availableDays.length > 1 ? (
          <div className="flex max-w-full items-center gap-1.5 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {availableDays.slice(0, 6).map((day) => (
              <Link
                key={day}
                href={buildHref({ day })}
                className={cn(
                  "shrink-0 rounded-lg border px-2.5 py-1 text-xs font-bold tabular-nums transition",
                  day === selectedDay
                    ? "border-brand-600 bg-brand-600 text-white shadow-sm"
                    : "border-slate-200 bg-white text-slate-600 hover:border-brand-200 hover:bg-brand-50"
                )}
              >
                {day}
              </Link>
            ))}
          </div>
        ) : null}
      </div>

      <div className="space-y-4">
        {matches.length ? (
          <LiveMatchList matches={cardMatches} />
        ) : (
          <div className="space-y-4">
            <EmptyState
              title="No matches found for the selected filters."
              description="Try changing the date, series, team, or venue."
            />
            <LiveMatchList matches={[]} emptyCount={3} emptyLabel="No data found" />
          </div>
        )}
      </div>

      <AdSlot variant="leaderboard" label="Sponsored · Match Center Banner" />
    </div>
  );
}
