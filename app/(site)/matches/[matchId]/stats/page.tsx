import { notFound } from "next/navigation";
import { MatchTabs } from "@/app/(site)/matches/[matchId]/MatchTabs";
import { UpcomingCountdown } from "@/components/match/UpcomingCountdown";
import { WagonWheel } from "@/components/match/WagonWheel";
import { Card } from "@/components/ui/card";
import { getMatches, getMatchStats, getMatchSummary, getTournamentPlayerStats } from "@/lib/api/read";
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
        <MatchTabs matchId={summary.id} currentPath={`/matches/${summary.id}/stats`} status={summary.status} />

        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white text-slate-900 shadow-sm">
          <div className="px-6 py-5">
            <p className="text-sm text-slate-600">
              {summary.seriesName}
              <span className="text-brand-700"> - {kickoffLabel}</span>
            </p>

            <div className="mt-5 grid grid-cols-[1fr_auto_1fr] items-center gap-3 text-center">
              <div>
                <span className="mx-auto inline-flex h-12 w-12 items-center justify-center rounded-lg border border-brand-200 bg-brand-50 text-sm font-extrabold text-brand-700">
                  {summary.teamA.shortName.slice(0, 2)}
                </span>
                <p className="mt-2 text-2xl font-semibold tracking-tight text-slate-900">{summary.teamA.name}</p>
              </div>

              <span className="text-xl font-semibold text-slate-500">vs</span>

              <div>
                <span className="mx-auto inline-flex h-12 w-12 items-center justify-center rounded-lg border border-brand-200 bg-brand-50 text-sm font-extrabold text-brand-700">
                  {summary.teamB.shortName.slice(0, 2)}
                </span>
                <p className="mt-2 text-2xl font-semibold tracking-tight text-slate-900">{summary.teamB.name}</p>
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
        </section>

        <Card as="section" className="space-y-4 p-5">
          <h2 className="text-xl font-semibold text-slate-900">Head to Head</h2>
          <div className="grid gap-3 sm:grid-cols-4">
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
                <li key={match.id} className="rounded-lg border border-slate-200 bg-slate-50 p-3">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    {formatResultDate(match.lastUpdatedAt)} - {match.seriesName}
                  </p>
                  <p className="mt-1 text-sm font-semibold text-slate-900">
                    {match.teamA.shortName} vs {match.teamB.shortName}
                  </p>
                  <p className="mt-1 text-sm text-slate-700">{match.resultText ?? "Result details unavailable"}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="rounded-lg border border-dashed border-slate-300 bg-slate-50 p-4 text-sm text-slate-600">
              No previous head-to-head completed matches found.
            </p>
          )}
        </Card>

        <Card as="section" className="space-y-4 p-5">
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
      </div>
    );
  }

  const stats = await getMatchStats(matchId);
  if (!stats) notFound();

  return (
    <div className="space-y-4">
      <MatchTabs matchId={summary.id} currentPath={`/matches/${summary.id}/stats`} status={summary.status} />
      <Card as="section" className="p-5">
        <h2 className="text-base font-semibold text-slate-900">Matchup Stats</h2>
        <p className="mt-2 text-sm text-slate-700">Run Rate: {stats.runRate.toFixed(2)}</p>
        <p className="text-sm text-slate-700">Required Run Rate: {stats.requiredRunRate?.toFixed(2) ?? "-"}</p>
        <ul className="mt-3 space-y-2 text-sm text-slate-700">
          {stats.matchupNotes.map((note) => (
            <li key={note} className="rounded-md bg-slate-50 px-3 py-2">
              {note}
            </li>
          ))}
        </ul>
      </Card>
      <Card as="section" className="p-5">
        <h2 className="text-base font-semibold text-slate-900">Partnerships</h2>
        <ul className="mt-3 space-y-2 text-sm text-slate-700">
          {stats.partnerships.map((partnership) => (
            <li key={partnership.wickets} className="rounded-md bg-slate-50 px-3 py-2">
              {partnership.wickets}: {partnership.runs} runs ({partnership.balls} balls)
            </li>
          ))}
        </ul>
      </Card>
      <WagonWheel stats={stats} />
    </div>
  );
}

