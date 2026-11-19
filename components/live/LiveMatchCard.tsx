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
  const ctaHref = isUpcoming ? `/matches/${match.id}/squads` : `/matches/${match.id}`;

  return (
    <Link
      href={ctaHref}
      className="group block min-w-0 rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
    >
      <Card
        as="article"
        variant="strong"
        className="h-full w-full min-w-0 overflow-hidden p-5 transition-all duration-300 group-hover:border-brand-200 group-hover:shadow-md md:min-h-0 md:p-4"
      >
        <div className="mb-4 flex items-center justify-between gap-2 md:mb-3">
          <p className="inline-flex min-w-0 items-center gap-1.5 truncate text-sm font-semibold uppercase tracking-wide text-slate-500 md:text-xs">
            <SeriesIcon
              className={`h-3.5 w-3.5 shrink-0 ${
                isLive ? "animate-pulse-soft text-red-500" : isUpcoming ? "text-brand-600" : isCompleted ? "text-emerald-600" : "text-amber-600"
              }`}
              aria-hidden="true"
            />
            <span className="truncate">{match.seriesName}</span>
          </p>
          <MatchStatusBadge status={match.status} label={badgeLabel} />
        </div>
        <div className="space-y-2 rounded-xl bg-slate-50 p-4 md:p-3">
          <div className="flex items-center justify-between gap-3 text-base md:text-sm">
            <div className="flex items-center gap-2">
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-brand-100 text-xs font-extrabold text-brand-700 md:h-7 md:w-7 md:text-[11px]">
                {match.teamA.shortName.slice(0, 2)}
              </span>
              <span className="font-bold text-slate-900">{match.teamA.shortName}</span>
            </div>
            <span className="text-lg font-extrabold text-slate-900 md:text-base">{match.teamA.score ?? "-"}</span>
          </div>
          <div className="flex items-center justify-between gap-3 text-base md:text-sm">
            <div className="flex items-center gap-2">
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-brand-200 text-xs font-extrabold text-brand-700 md:h-7 md:w-7 md:text-[11px]">
                {match.teamB.shortName.slice(0, 2)}
              </span>
              <span className="font-bold text-slate-900">{match.teamB.shortName}</span>
            </div>
            <span className="text-lg font-extrabold text-slate-900 md:text-base">{match.teamB.score ?? "-"}</span>
          </div>
          <div className="mt-1 space-y-1">
            <div className="h-2 rounded-full bg-slate-200 md:h-1.5">
              <div className="h-2 rounded-full bg-brand-500 md:h-1.5" style={{ width: teamAWidth }} />
            </div>
            <div className="h-2 rounded-full bg-slate-200 md:h-1.5">
              <div className="h-2 rounded-full bg-brand-400 md:h-1.5" style={{ width: teamBWidth }} />
            </div>
          </div>
        </div>
        <p className="mt-3 inline-flex w-full items-center gap-2 rounded-lg bg-brand-50 px-3.5 py-2.5 text-sm font-semibold text-brand-800 md:px-3 md:py-2">
          {isUpcoming ? (
            <>
              <FiClock className="h-4 w-4 shrink-0 text-brand-700" aria-hidden="true" />
              <UpcomingCountdown startAt={startAt} fallbackValue="Upcoming" valueClassName="text-brand-800" />
            </>
          ) : (
            <>
              <SummaryIcon className={`h-4 w-4 shrink-0 ${isLive ? "text-red-600" : "text-brand-700"}`} aria-hidden="true" />
              <span className="truncate">{match.summary}</span>
            </>
          )}
        </p>
        <div className="mt-4 flex items-center justify-between gap-2 text-sm text-slate-500 md:text-xs">
          <span className="inline-flex min-w-0 items-center gap-1.5 truncate">
            <FiMapPin className="h-3.5 w-3.5 shrink-0 text-slate-400" aria-hidden="true" />
            <span className="truncate">{match.venue}</span>
          </span>
          <span className="inline-flex max-w-[48%] items-center gap-1 truncate text-right sm:max-w-none">
            <FiClock className="h-3.5 w-3.5 text-slate-400" aria-hidden="true" />
            <span className="truncate">{footerLabel}</span>
          </span>
        </div>
        <span className="mt-4 inline-flex items-center gap-2 rounded-xl bg-brand-600 px-4 py-2.5 text-base font-semibold text-white transition-all duration-200 group-hover:bg-brand-700 md:py-2 md:text-sm">
          {ctaLabel}
          <FiArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" aria-hidden="true" />
        </span>
      </Card>
    </Link>
  );
}

export const LiveMatchCard = memo(
  LiveMatchCardComponent,
  (previous, next) => previous.match === next.match
);

LiveMatchCard.displayName = "LiveMatchCard";

