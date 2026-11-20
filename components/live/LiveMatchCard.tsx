"use client";

import { memo } from "react";
import Link from "next/link";
import { BiBroadcast } from "react-icons/bi";
import { FiActivity, FiArrowRight, FiCheckCircle, FiClock, FiMapPin } from "react-icons/fi";
import type { LiveMatch } from "@/types/match";
import { MatchStatusBadge } from "@/components/live/MatchStatusBadge";
import { UpcomingCountdown } from "@/components/match/UpcomingCountdown";
import { Card } from "@/components/ui/card";
import { formatTime, relativeTime } from "@/lib/utils/date";

function LiveMatchCardComponent({ match }: { match: LiveMatch }): React.ReactElement {
  const parseRuns = (score?: string): number => {
    const found = score?.match(/\d+/);
    return found ? Number(found[0]) : 0;
  };
  const teamARuns = parseRuns(match.teamA.score);
  const teamBRuns = parseRuns(match.teamB.score);
  const total = Math.max(teamARuns + teamBRuns, 1);
  const teamAWidth = `${Math.max((teamARuns / total) * 100, 8)}%`;
  const teamBWidth = `${Math.max((teamBRuns / total) * 100, 8)}%`;
  const startAt = match.startAt ?? match.lastUpdatedAt;
  const isLive = match.status === "live";
  const isUpcoming = match.status === "upcoming";
  const isCompleted = match.status === "completed";
  const SeriesIcon = isLive ? BiBroadcast : isUpcoming ? FiClock : isCompleted ? FiCheckCircle : FiActivity;
  const SummaryIcon = isLive ? BiBroadcast : FiActivity;
  const footerLabel = isUpcoming
    ? `Starts ${formatTime(match.startAt ?? match.lastUpdatedAt)}`
    : `Updated ${relativeTime(match.lastUpdatedAt)}`;
  const badgeLabel = isUpcoming ? "Upcoming" : undefined;
  const ctaLabel =
    isUpcoming ? "View Squads" : match.status === "completed" ? "View Result" : "View Match";
  const ctaHref = isUpcoming
    ? `/matches/${match.id}/squads`
    : isLive || match.status === "innings_break"
      ? `/matches/${match.id}/scorecard`
      : `/matches/${match.id}`;

  return (
    <Link
      href={ctaHref}
      className="group block h-full min-w-0 rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
    >
      <Card
        as="article"
        variant="strong"
        className="relative flex h-full w-full min-w-0 flex-col justify-between p-4 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:border-brand-300 group-hover:shadow-lg sm:p-5"
      >
        <div>
          <div className="mb-3.5 flex items-center justify-between gap-2">
            <div className="flex min-w-0 items-center gap-1.5">
              <SeriesIcon
                className={`h-3.5 w-3.5 shrink-0 ${
                  isLive
                    ? "animate-pulse-soft text-red-500"
                    : isUpcoming
                      ? "text-brand-600"
                      : isCompleted
                        ? "text-emerald-600"
                        : "text-amber-600"
                }`}
                aria-hidden="true"
              />
              <span className="truncate text-xs font-bold uppercase tracking-wider text-slate-600">
                {match.seriesName}
              </span>
              {match.format ? (
                <span className="shrink-0 rounded-md border border-slate-200 bg-white px-1.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wider text-slate-700">
                  {match.format}
                </span>
              ) : null}
            </div>
            <MatchStatusBadge status={match.status} label={badgeLabel} />
          </div>

          <div className="space-y-2.5 rounded-xl border border-slate-200/80 bg-white/90 p-3.5 shadow-inner">
            <div className="flex items-center justify-between gap-2">
              <div className="flex min-w-0 items-center gap-2.5">
                <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border border-brand-200 bg-brand-50 text-xs font-black text-brand-700">
                  {match.teamA.shortName.slice(0, 3)}
                </span>
                <div className="min-w-0">
                  <p className="truncate text-sm font-extrabold text-slate-900">{match.teamA.shortName}</p>
                  <p className="truncate text-[11px] font-medium text-slate-500">{match.teamA.name}</p>
                </div>
              </div>
              <span className="shrink-0 text-right text-sm font-black tabular-nums text-slate-900 sm:text-base">
                {match.teamA.score || "-"}
              </span>
            </div>

            <div className="h-px bg-slate-100" />

            <div className="flex items-center justify-between gap-2">
              <div className="flex min-w-0 items-center gap-2.5">
                <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border border-indigo-200 bg-indigo-50 text-xs font-black text-indigo-800">
                  {match.teamB.shortName.slice(0, 3)}
                </span>
                <div className="min-w-0">
                  <p className="truncate text-sm font-extrabold text-slate-900">{match.teamB.shortName}</p>
                  <p className="truncate text-[11px] font-medium text-slate-500">{match.teamB.name}</p>
                </div>
              </div>
              <span className="shrink-0 text-right text-sm font-black tabular-nums text-slate-900 sm:text-base">
                {match.teamB.score || "-"}
              </span>
            </div>

            <div className="pt-1">
              <div className="flex h-1.5 w-full overflow-hidden rounded-full bg-slate-100 gap-0.5">
                <div className="h-full rounded-l-full bg-brand-600 transition-all duration-500" style={{ width: teamAWidth }} />
                <div className="h-full rounded-r-full bg-indigo-400 transition-all duration-500" style={{ width: teamBWidth }} />
              </div>
            </div>
          </div>

          <div className="mt-3 flex min-h-[2.35rem] w-full items-center gap-2 rounded-xl border border-brand-100 bg-brand-50/80 px-3 py-2 text-xs font-semibold text-brand-900">
            {isUpcoming ? (
              <>
                <FiClock className="h-3.5 w-3.5 shrink-0 text-brand-700" aria-hidden="true" />
                <UpcomingCountdown startAt={startAt} fallbackValue="Upcoming fixture" valueClassName="text-brand-800" />
              </>
            ) : (
              <>
                <SummaryIcon
                  className={`h-3.5 w-3.5 shrink-0 ${isLive ? "text-red-600" : "text-brand-700"}`}
                  aria-hidden="true"
                />
                <span className="truncate">{match.summary || "Live match in progress"}</span>
              </>
            )}
          </div>
        </div>

        <div className="mt-3.5 pt-3 border-t border-slate-200/70">
          <div className="flex items-center justify-between gap-2 text-xs text-slate-500">
            <span className="inline-flex min-w-0 items-center gap-1 truncate">
              <FiMapPin className="h-3.5 w-3.5 shrink-0 text-slate-400" aria-hidden="true" />
              <span className="truncate">{match.venue}</span>
            </span>
            <span className="inline-flex shrink-0 items-center gap-1 text-[11px] font-medium">
              <FiClock className="h-3 w-3 text-slate-400" aria-hidden="true" />
              <span>{footerLabel}</span>
            </span>
          </div>
          <div className="mt-3 flex w-full items-center justify-between rounded-xl bg-brand-600 px-3.5 py-2 text-xs font-bold uppercase tracking-wider text-white shadow-sm transition-all duration-200 group-hover:bg-brand-700">
            <span>{ctaLabel}</span>
            <FiArrowRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-1" aria-hidden="true" />
          </div>
        </div>
      </Card>
    </Link>
  );
}

export const LiveMatchCard = memo(
  LiveMatchCardComponent,
  (previous, next) => previous.match === next.match
);

LiveMatchCard.displayName = "LiveMatchCard";
