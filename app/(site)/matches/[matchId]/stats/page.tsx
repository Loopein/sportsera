import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MatchTabs } from "@/app/(site)/matches/[matchId]/MatchTabs";
import { UpcomingCountdown } from "@/components/match/UpcomingCountdown";
import { WagonWheel } from "@/components/match/WagonWheel";
import { JsonLd } from "@/components/seo/JsonLd";
import { AdSlot } from "@/components/shared/AdSlot";
import { Card } from "@/components/ui/card";
import { getMatches, getMatchStats, getMatchSummary, getTournamentPlayerStats } from "@/lib/api/read";
import { buildBreadcrumbJsonLd, buildSportsEventJsonLd } from "@/lib/seo/jsonld";
import { buildPageMetadata } from "@/lib/seo/metadata";
import type { MatchSummary } from "@/types/match";
import type { TournamentPlayerStat } from "@/types/stats";

type StatsPageProps = {
  params: Promise<{ matchId: string }>;
};

function formatKickoffLabel(isoDate: string): string {
  const kickoff = new Date(isoDate);
  if (Number.isNaN(kickoff.getTime())) return "Schedule TBD";

  const now = new Date();
  const tomorrow = new Date(now);
  tomorrow.setDate(now.getDate() + 1);

  const timeLabel = kickoff.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit"
  });

  if (kickoff.toDateString() === now.toDateString()) return `Today, ${timeLabel}`;
  if (kickoff.toDateString() === tomorrow.toDateString()) return `Tomorrow, ${timeLabel}`;

  const dateLabel = kickoff.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric"
  });
  return `${dateLabel}, ${timeLabel}`;
}

function isHeadToHead(match: MatchSummary, teamAId: string, teamBId: string): boolean {
  return (
    (match.teamA.id === teamAId && match.teamB.id === teamBId) ||
    (match.teamA.id === teamBId && match.teamB.id === teamAId)
  );
}

function didTeamWin(match: MatchSummary, teamName: string, teamShortName: string): boolean {
  const resultText = (match.resultText ?? "").toLowerCase();
  return resultText.includes("won") && (resultText.includes(teamName.toLowerCase()) || resultText.includes(teamShortName.toLowerCase()));
}

function formatResultDate(isoDate?: string): string {
  if (!isoDate) return "Date TBD";
  const parsed = new Date(isoDate);
  if (Number.isNaN(parsed.getTime())) return "Date TBD";
  return parsed.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric"
  });
}

function pickTopStat(
  stats: TournamentPlayerStat[],
  teamId: string,
  metric: "runs" | "wickets"
): TournamentPlayerStat | null {
  const scoped = stats.filter((row) => row.teamId === teamId);
  if (!scoped.length) return null;
  return scoped.reduce((best, row) => (row[metric] > best[metric] ? row : best));
}

export async function generateMetadata({ params }: StatsPageProps): Promise<Metadata> {
  const { matchId } = await params;
  const match = await getMatchSummary(matchId);
  if (!match) {
    return buildPageMetadata({
      title: "Match Stats Not Found",
      description: "The requested match statistics could not be found.",
      path: `/matches/${matchId}/stats`,
      noIndex: true
    });
  }

  return buildPageMetadata({
    title: `${match.teamA.shortName} vs ${match.teamB.shortName} Stats & Head-to-Head`,
    description: `Run rates, partnerships, head-to-head records, wagon wheel zones, and player stats for ${match.teamA.name} vs ${match.teamB.name}.`,
    path: `/matches/${match.id}/stats`,
    keywords: [match.teamA.name, match.teamB.name, "match stats", "head to head", "partnerships"]
  });
}

export default async function StatsPage({ params }: StatsPageProps): Promise<React.ReactElement> {
  const { matchId } = await params;
  const summary = await getMatchSummary(matchId);
  if (!summary) notFound();

  if (summary.status === "upcoming") {
    const [completedMatches, tournamentStats] = await Promise.all([getMatches("completed"), getTournamentPlayerStats()]);
    const startIso = summary.startAt ?? summary.lastUpdatedAt ?? new Date().toISOString();
    const kickoffLabel = formatKickoffLabel(startIso);
    const shortMeta = `${summary.format} - Upcoming - ${summary.venue}`;

    const h2hMatches = completedMatches
      .filter((match) => isHeadToHead(match, summary.teamA.id, summary.teamB.id))
      .sort((a, b) => (b.lastUpdatedAt ?? "").localeCompare(a.lastUpdatedAt ?? ""));
    const teamAWins = h2hMatches.filter((match) => didTeamWin(match, summary.teamA.name, summary.teamA.shortName)).length;
    const teamBWins = h2hMatches.filter((match) => didTeamWin(match, summary.teamB.name, summary.teamB.shortName)).length;
    const draws = Math.max(h2hMatches.length - teamAWins - teamBWins, 0);

    const topRunA = pickTopStat(tournamentStats, summary.teamA.id, "runs");
    const topRunB = pickTopStat(tournamentStats, summary.teamB.id, "runs");
    const topWicketA = pickTopStat(tournamentStats, summary.teamA.id, "wickets");
    const topWicketB = pickTopStat(tournamentStats, summary.teamB.id, "wickets");

    return (
      <div className="space-y-4">
        <JsonLd
          data={[
            buildSportsEventJsonLd(summary, `/matches/${summary.id}/stats`),
            buildBreadcrumbJsonLd([
              { name: "Home", path: "/" },
              { name: "Matches", path: "/matches" },
              { name: `${summary.teamA.shortName} vs ${summary.teamB.shortName}`, path: `/matches/${summary.id}` },
              { name: "Stats", path: `/matches/${summary.id}/stats` }
            ])
          ]}
        />
        <MatchTabs matchId={summary.id} currentPath={`/matches/${summary.id}/stats`} status={summary.status} />

        <Card as="section" variant="strong" className="page-hero-card overflow-hidden p-0 text-slate-900">
          <div className="px-4 py-4 sm:px-6 sm:py-5">
            <p className="text-sm text-slate-600">
              {summary.seriesName}
              <span className="text-brand-700"> - {kickoffLabel}</span>
            </p>

            <div className="mt-5 grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-2 text-center sm:gap-3">
              <div className="min-w-0">
                <span className="mx-auto inline-flex h-10 w-10 items-center justify-center rounded-lg border border-brand-200 bg-brand-50 text-xs font-extrabold text-brand-700 sm:h-12 sm:w-12 sm:text-sm">
                  {summary.teamA.shortName.slice(0, 2)}
                </span>
                <p className="mt-2 truncate text-base font-bold tracking-tight text-slate-900 sm:text-xl md:text-2xl">
                  {summary.teamA.name}
                </p>
              </div>

              <span className="text-sm font-semibold text-slate-500 sm:text-xl">vs</span>

              <div className="min-w-0">
                <span className="mx-auto inline-flex h-10 w-10 items-center justify-center rounded-lg border border-brand-200 bg-brand-50 text-xs font-extrabold text-brand-700 sm:h-12 sm:w-12 sm:text-sm">
                  {summary.teamB.shortName.slice(0, 2)}
                </span>
                <p className="mt-2 truncate text-base font-bold tracking-tight text-slate-900 sm:text-xl md:text-2xl">
                  {summary.teamB.name}
                </p>
              </div>
            </div>
            <div className="mt-3 text-center">
              <UpcomingCountdown
                startAt={startIso}
                className="text-sm font-semibold text-slate-600"
                valueClassName="text-brand-700"
                fallbackValue="Upcoming"
              />
            </div>

            <p className="mt-3 text-center text-sm text-slate-600">
              {shortMeta}
            </p>
          </div>
        </Card>

        <Card as="section" className="space-y-4 p-4 sm:p-5">
          <h2 className="text-xl font-semibold text-slate-900">Head to Head</h2>
          <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4 sm:gap-3">
            <div className="rounded-lg bg-slate-50 p-3 text-center">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{summary.teamA.shortName}</p>
              <p className="mt-1 text-2xl font-extrabold text-slate-900">{teamAWins}</p>
              <p className="text-xs text-slate-500">Wins</p>
            </div>
            <div className="rounded-lg bg-slate-50 p-3 text-center">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{summary.teamB.shortName}</p>
              <p className="mt-1 text-2xl font-extrabold text-slate-900">{teamBWins}</p>
              <p className="text-xs text-slate-500">Wins</p>
            </div>
            <div className="rounded-lg bg-slate-50 p-3 text-center">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Draw/No Result</p>
              <p className="mt-1 text-2xl font-extrabold text-slate-900">{draws}</p>
              <p className="text-xs text-slate-500">Matches</p>
            </div>
            <div className="rounded-lg bg-slate-50 p-3 text-center">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Total</p>
              <p className="mt-1 text-2xl font-extrabold text-slate-900">{h2hMatches.length}</p>
              <p className="text-xs text-slate-500">Meetings</p>
            </div>
          </div>
          {h2hMatches.length ? (
            <ul className="space-y-2">
              {h2hMatches.slice(0, 5).map((match) => (
                <li key={match.id}>
                  <Link
                    href={`/matches/${match.id}`}
                    className="block rounded-xl border border-slate-200 bg-slate-50/80 p-3 transition hover:border-brand-300 hover:bg-brand-50/40"
                  >
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                      {formatResultDate(match.lastUpdatedAt)} - {match.seriesName}
                    </p>
                    <p className="mt-1 text-sm font-extrabold text-slate-900">
                      {match.teamA.shortName} vs {match.teamB.shortName}
                    </p>
                    <p className="mt-1 text-sm text-slate-700">{match.resultText ?? "Result details unavailable"}</p>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p className="rounded-lg border border-dashed border-slate-300 bg-slate-50 p-4 text-sm text-slate-600">
              No previous head-to-head completed matches found.
            </p>
          )}
        </Card>

        <Card as="section" className="space-y-4 p-4 sm:p-5">
          <h2 className="text-xl font-semibold text-slate-900">Player Summary</h2>
          <div className="grid gap-4 lg:grid-cols-2">
            <article className="rounded-xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">{summary.teamA.name}</p>
              <div className="mt-3 space-y-2 text-sm">
                <p className="text-slate-700">
                  Top Runs:{" "}
                  <span className="font-semibold text-slate-900">
                    {topRunA ? `${topRunA.playerName} (${topRunA.runs})` : "No data"}
                  </span>
                </p>
                <p className="text-slate-700">
                  Top Wickets:{" "}
                  <span className="font-semibold text-slate-900">
                    {topWicketA ? `${topWicketA.playerName} (${topWicketA.wickets})` : "No data"}
                  </span>
                </p>
              </div>
            </article>
            <article className="rounded-xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">{summary.teamB.name}</p>
              <div className="mt-3 space-y-2 text-sm">
                <p className="text-slate-700">
                  Top Runs:{" "}
                  <span className="font-semibold text-slate-900">
                    {topRunB ? `${topRunB.playerName} (${topRunB.runs})` : "No data"}
                  </span>
                </p>
                <p className="text-slate-700">
                  Top Wickets:{" "}
                  <span className="font-semibold text-slate-900">
                    {topWicketB ? `${topWicketB.playerName} (${topWicketB.wickets})` : "No data"}
                  </span>
                </p>
              </div>
            </article>
          </div>
        </Card>

        <AdSlot variant="leaderboard" label="Sponsored · Match Preview" />
      </div>
    );
  }

  const stats = await getMatchStats(matchId);
  if (!stats) notFound();
  const maxPartnershipRuns = Math.max(...stats.partnerships.map((p) => p.runs), 1);

  return (
    <div className="space-y-4">
      <JsonLd
        data={[
          buildSportsEventJsonLd(summary, `/matches/${summary.id}/stats`),
          buildBreadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "Matches", path: "/matches" },
            { name: `${summary.teamA.shortName} vs ${summary.teamB.shortName}`, path: `/matches/${summary.id}` },
            { name: "Stats", path: `/matches/${summary.id}/stats` }
          ])
        ]}
      />
      <MatchTabs matchId={summary.id} currentPath={`/matches/${summary.id}/stats`} status={summary.status} />
      <Card as="section" variant="strong" className="page-hero-card p-4 sm:p-5">
        <h2 className="text-base font-extrabold text-slate-900">Matchup Stats</h2>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          <div className="rounded-xl border border-slate-200/80 bg-slate-50/90 p-3.5">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Run Rate</p>
            <p className="mt-1 text-2xl font-black tabular-nums text-brand-700">{stats.runRate.toFixed(2)}</p>
          </div>
          <div className="rounded-xl border border-slate-200/80 bg-slate-50/90 p-3.5">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Required Run Rate</p>
            <p className="mt-1 text-2xl font-black tabular-nums text-slate-900">
              {stats.requiredRunRate?.toFixed(2) ?? "-"}
            </p>
          </div>
        </div>
        {stats.matchupNotes.length ? (
          <ul className="mt-3 space-y-2 text-sm text-slate-700">
            {stats.matchupNotes.map((note) => (
              <li key={note} className="rounded-xl bg-slate-50/80 px-3.5 py-2.5 font-medium">
                {note}
              </li>
            ))}
          </ul>
        ) : null}
      </Card>
      <Card as="section" className="p-4 sm:p-5">
        <div className="flex items-center justify-between gap-2">
          <h2 className="text-base font-extrabold text-slate-900">Partnerships</h2>
          <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-bold text-slate-600">
            {stats.partnerships.length} stands
          </span>
        </div>
        <ul className="mt-3 space-y-2.5 text-sm text-slate-700">
          {stats.partnerships.map((partnership) => {
            const widthPct = Math.max(8, Math.round((partnership.runs / maxPartnershipRuns) * 100));
            return (
              <li key={partnership.wickets} className="rounded-xl bg-slate-50/80 px-3.5 py-3">
                <div className="flex items-center justify-between gap-2 font-semibold">
                  <span className="text-slate-900">{partnership.wickets}</span>
                  <span className="tabular-nums text-brand-700">
                    {partnership.runs} runs ({partnership.balls} balls)
                  </span>
                </div>
                <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-brand-500 to-sky-400"
                    style={{ width: `${widthPct}%` }}
                  />
                </div>
              </li>
            );
          })}
        </ul>
      </Card>
      <WagonWheel stats={stats} />
      <AdSlot variant="leaderboard" label="Sponsored · Match Analytics Banner" />
    </div>
  );
}

