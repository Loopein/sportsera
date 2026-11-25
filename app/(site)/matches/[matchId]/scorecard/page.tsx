import Link from "next/link";
import { notFound } from "next/navigation";
import { FiActivity, FiArrowRight, FiPlayCircle, FiRadio } from "react-icons/fi";
import { MatchTabs } from "@/app/(site)/matches/[matchId]/MatchTabs";
import { ScorecardTable } from "@/components/match/ScorecardTable";
import { AdSlot } from "@/components/shared/AdSlot";
import { EmptyState } from "@/components/shared/EmptyState";
import { Tabs } from "@/components/shared/Tabs";
import { Card } from "@/components/ui/card";
import { getMatchScorecard, getMatchSummary, getTeam } from "@/lib/api/read";
import type { MatchSummary, ScorecardInnings } from "@/types/match";
import type { TeamProfile } from "@/types/team";

type ScorecardPageProps = {
  params: Promise<{ matchId: string }>;
  searchParams?: Promise<{ team?: string }>;
};

type TeamKey = "a" | "b";

function normalize(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
}

function inferInningsTeamKey(inningsName: string, summary: MatchSummary): TeamKey | null {
  const normalizedInningsName = normalize(inningsName);
  const teamAName = normalize(summary.teamA.name);
  const teamAShort = normalize(summary.teamA.shortName);
  const teamBName = normalize(summary.teamB.name);
  const teamBShort = normalize(summary.teamB.shortName);

  if (normalizedInningsName.includes(teamAName) || normalizedInningsName.includes(teamAShort)) return "a";
  if (normalizedInningsName.includes(teamBName) || normalizedInningsName.includes(teamBShort)) return "b";
  return null;
}

function formatKickoffLabel(isoDate?: string): string {
  if (!isoDate) return "Date TBD";
  const kickoff = new Date(isoDate);
  if (Number.isNaN(kickoff.getTime())) return "Date TBD";

  const now = new Date();
  const tomorrow = new Date(now);
  tomorrow.setDate(now.getDate() + 1);

  const timeLabel = kickoff.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
  if (kickoff.toDateString() === now.toDateString()) return `Today, ${timeLabel}`;
  if (kickoff.toDateString() === tomorrow.toDateString()) return `Tomorrow, ${timeLabel}`;

  const dateLabel = kickoff.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric"
  });
  return `${dateLabel}, ${timeLabel}`;
}

function formatStartDateTime(isoDate?: string): string {
  if (!isoDate) return "Date and time not confirmed";
  const parsed = new Date(isoDate);
  if (Number.isNaN(parsed.getTime())) return "Date and time not confirmed";

  return parsed.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit"
  });
}

function normalizePlayerName(name: string): string {
  return name
    .replace(/\(.*?\)/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function getTeamInitials(name: string, fallback: string): string {
  const initials = name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
  return initials || fallback.slice(0, 2).toUpperCase();
}

function buildYetToBat(innings: ScorecardInnings, team: TeamProfile | null): string[] {
  if (!team) return [];

  const battedPlayers = new Set(innings.batters.map((batter) => normalizePlayerName(batter.name)));
  return team.squad
    .filter((member) => !battedPlayers.has(normalizePlayerName(member.name)))
    .map((member) => `${member.name}${member.isCaptain ? " (C)" : ""}${member.isWicketKeeper ? " (WK)" : ""}`);
}

export default async function ScorecardPage({ params, searchParams }: ScorecardPageProps): Promise<React.ReactElement> {
  const { matchId } = await params;
  const query = (await searchParams) ?? {};
  const [summary, scorecard] = await Promise.all([getMatchSummary(matchId), getMatchScorecard(matchId)]);
  if (!summary) notFound();

  const [teamA, teamB] = await Promise.all([getTeam(summary.teamA.id), getTeam(summary.teamB.id)]);

  const inningsByTeam = scorecard?.innings.map((innings, index) => ({
    innings,
    teamKey: inferInningsTeamKey(innings.name, summary) ?? (index % 2 === 0 ? "a" : "b")
  }));
  const hasInnings = Boolean(inningsByTeam?.length);
  const defaultTeam: TeamKey = (() => {
    if (!inningsByTeam?.length) return "a";
    if (summary.status === "live" || summary.status === "innings_break") {
      return inningsByTeam[inningsByTeam.length - 1]?.teamKey ?? "a";
    }
    return inningsByTeam[0]?.teamKey ?? "a";
  })();
  const requestedTeamKey: TeamKey | null = query.team === "b" ? "b" : query.team === "a" ? "a" : null;
  const selectedTeamKey: TeamKey = requestedTeamKey ?? defaultTeam;
  const inningsForSelectedTeam = inningsByTeam?.filter((entry) => entry.teamKey === selectedTeamKey) ?? [];
  const fallbackInningsEntry =
    summary.status === "live" || summary.status === "innings_break"
      ? inningsByTeam?.[inningsByTeam.length - 1]
      : inningsByTeam?.[0];
  const selectedInningsEntry =
    inningsForSelectedTeam.length > 0
      ? summary.status === "live" || summary.status === "innings_break"
        ? inningsForSelectedTeam[inningsForSelectedTeam.length - 1]
        : inningsForSelectedTeam[0]
      : requestedTeamKey
        ? null
        : fallbackInningsEntry;
  const activeTeamKey: TeamKey = requestedTeamKey ?? selectedInningsEntry?.teamKey ?? selectedTeamKey;
  const selectedInnings = selectedInningsEntry?.innings ?? null;
  const battingTeam = activeTeamKey === "a" ? summary.teamA : summary.teamB;
  const bowlingTeam = activeTeamKey === "a" ? summary.teamB : summary.teamA;
  const battingTeamProfile = activeTeamKey === "a" ? teamA : teamB;
  const shouldShowYetToBat = summary.status === "live" || summary.status === "innings_break";
  const yetToBat = shouldShowYetToBat && selectedInnings ? buildYetToBat(selectedInnings, battingTeamProfile) : [];
  const statusLabel =
    summary.status === "live"
      ? "Live"
      : summary.status === "innings_break"
        ? "Innings Break"
        : summary.status === "upcoming"
          ? "Upcoming"
          : "Completed";
  const metaLabel = `${summary.format} - ${statusLabel} - ${summary.venue}`;
  const kickoffLabel = formatKickoffLabel(summary.startAt ?? summary.lastUpdatedAt);
  const fullStartLabel = formatStartDateTime(summary.startAt ?? summary.lastUpdatedAt);
  const buildTeamHref = (teamKey: TeamKey): string => `/matches/${summary.id}/scorecard?team=${teamKey}`;

  return (
    <div className="space-y-4">
      <MatchTabs matchId={summary.id} currentPath={`/matches/${summary.id}/scorecard`} status={summary.status} />

      <Card as="section" variant="strong" className="page-hero-card overflow-hidden p-0 text-slate-900">
        <div className="px-4 py-4 sm:px-6 sm:py-5">
          <p className="text-sm text-slate-600">
            {summary.seriesName}
            <span className="text-brand-700"> - {kickoffLabel}</span>
          </p>

          <div className="mt-5 grid grid-cols-1 items-center gap-4 sm:grid-cols-[1fr_auto_1fr] sm:gap-6">
            <div className="flex min-w-0 items-center gap-3 sm:gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-brand-200 bg-brand-50 sm:h-12 sm:w-12">
                {summary.teamA.logo ? (
                  <img src={summary.teamA.logo} alt={summary.teamA.name} className="h-full w-full object-cover" />
                ) : (
                  <span className="text-sm font-extrabold text-brand-700">
                    {getTeamInitials(summary.teamA.name, summary.teamA.shortName)}
                  </span>
                )}
              </div>
              <div className="min-w-0">
                <p className="truncate text-base font-extrabold text-slate-900 sm:text-lg">{summary.teamA.name}</p>
                <p className="text-sm font-bold tabular-nums text-slate-700">{summary.teamA.score ?? "-"}</p>
              </div>
            </div>

            <div className="rounded-xl bg-slate-50 px-3 py-2 text-center sm:bg-transparent sm:p-0">
              <p className="text-xs font-extrabold uppercase tracking-wider text-slate-400">vs</p>
              <p className="mt-1 text-xs font-semibold text-slate-700 sm:mt-2 sm:text-sm">{summary.resultText ?? metaLabel}</p>
            </div>

            <div className="flex min-w-0 items-center justify-between gap-3 sm:justify-end sm:gap-4 sm:text-right">
              <div className="min-w-0 order-2 sm:order-1">
                <p className="truncate text-base font-extrabold text-slate-900 sm:text-lg">{summary.teamB.name}</p>
                <p className="text-sm font-bold tabular-nums text-slate-700">{summary.teamB.score ?? "-"}</p>
              </div>
              <div className="order-1 flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-brand-200 bg-brand-50 sm:order-2 sm:h-12 sm:w-12">
                {summary.teamB.logo ? (
                  <img src={summary.teamB.logo} alt={summary.teamB.name} className="h-full w-full object-cover" />
                ) : (
                  <span className="text-sm font-extrabold text-brand-700">
                    {getTeamInitials(summary.teamB.name, summary.teamB.shortName)}
                  </span>
                )}
              </div>
            </div>
          </div>

          <p className="mt-3 text-center text-sm text-slate-600">{metaLabel}</p>
        </div>

        {summary.status !== "upcoming" ? (
          <div className="grid gap-3 border-t border-slate-200/80 bg-slate-50/80 px-4 py-4 sm:grid-cols-3 sm:px-6">
            <Link
              href={`/matches/${summary.id}/watch`}
              className="group flex items-center justify-between gap-3 rounded-xl border border-slate-200/80 bg-white/90 p-3.5 transition hover:-translate-y-0.5 hover:border-brand-300 hover:shadow-md"
            >
              <div className="flex min-w-0 items-center gap-3">
                <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-red-50/90 text-red-600">
                  <FiPlayCircle className="h-4 w-4" aria-hidden="true" />
                </span>
                <div className="min-w-0">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Broadcast</p>
                  <p className="truncate text-sm font-extrabold text-slate-900 group-hover:text-brand-700">
                    Watch Live Stream
                  </p>
                </div>
              </div>
              <FiArrowRight className="h-4 w-4 shrink-0 text-slate-400 transition group-hover:translate-x-0.5 group-hover:text-brand-600" aria-hidden="true" />
            </Link>

            <Link
              href={`/matches/${summary.id}/commentary`}
              className="group flex items-center justify-between gap-3 rounded-xl border border-slate-200/80 bg-white/90 p-3.5 transition hover:-translate-y-0.5 hover:border-brand-300 hover:shadow-md"
            >
              <div className="flex min-w-0 items-center gap-3">
                <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-700">
                  <FiRadio className="h-4 w-4" aria-hidden="true" />
                </span>
                <div className="min-w-0">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Commentary</p>
                  <p className="truncate text-sm font-extrabold text-slate-900 group-hover:text-brand-700">
                    Play-by-Play Updates
                  </p>
                </div>
              </div>
              <FiArrowRight className="h-4 w-4 shrink-0 text-slate-400 transition group-hover:translate-x-0.5 group-hover:text-brand-600" aria-hidden="true" />
            </Link>

            <Link
              href={`/matches/${summary.id}/stats`}
              className="group flex items-center justify-between gap-3 rounded-xl border border-slate-200/80 bg-white/90 p-3.5 transition hover:-translate-y-0.5 hover:border-brand-300 hover:shadow-md"
            >
              <div className="flex min-w-0 items-center gap-3">
                <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-800">
                  <FiActivity className="h-4 w-4" aria-hidden="true" />
                </span>
                <div className="min-w-0">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Analytics</p>
                  <p className="truncate text-sm font-extrabold text-slate-900 group-hover:text-brand-700">
                    Match Insights &amp; Stats
                  </p>
                </div>
              </div>
              <FiArrowRight className="h-4 w-4 shrink-0 text-slate-400 transition group-hover:translate-x-0.5 group-hover:text-brand-600" aria-hidden="true" />
            </Link>
          </div>
        ) : null}
      </Card>

      <AdSlot variant="in-feed" label="Sponsored · Live Match Partner" />

      {hasInnings && selectedInnings ? (
        <div className="space-y-4">
          <Tabs
            fullWidth
            groupId={`scorecard-team-${summary.id}`}
            tabs={[
              {
                href: buildTeamHref("a"),
                label: summary.teamA.name,
                isActive: activeTeamKey === "a"
              },
              {
                href: buildTeamHref("b"),
                label: summary.teamB.name,
                isActive: activeTeamKey === "b"
              }
            ]}
          />

          <ScorecardTable
            innings={selectedInnings}
            battingTeamName={battingTeam.name}
            bowlingTeamName={bowlingTeam.name}
            yetToBat={yetToBat}
          />

          <Card as="section" className="overflow-hidden p-0">
            <div className="space-y-2 px-4 py-4 text-sm sm:px-5">
              {summary.toss ? (
                <p className="text-slate-700">
                  <span className="font-semibold text-emerald-700">Toss:</span> {summary.toss}
                </p>
              ) : null}
              <p className="text-slate-700">
                <span className="font-semibold text-emerald-700">Venue:</span> {summary.venue}
              </p>
            </div>
            <div className="border-t border-slate-200 px-4 py-3 text-xs text-slate-500 sm:px-5">
              Start time: {fullStartLabel}
            </div>
          </Card>
        </div>
      ) : hasInnings ? (
        <div className="space-y-4">
          <Tabs
            fullWidth
            groupId={`scorecard-team-${summary.id}`}
            tabs={[
              {
                href: buildTeamHref("a"),
                label: summary.teamA.name,
                isActive: activeTeamKey === "a"
              },
              {
                href: buildTeamHref("b"),
                label: summary.teamB.name,
                isActive: activeTeamKey === "b"
              }
            ]}
          />
          <div>
            <EmptyState title={`${activeTeamKey === "a" ? summary.teamA.name : summary.teamB.name} scorecard not available yet`} />
          </div>
        </div>
      ) : (
        <EmptyState title="Scorecard not available yet" />
      )}

      <AdSlot variant="leaderboard" label="Sponsored · Scorecard Footer" />
    </div>
  );
}
