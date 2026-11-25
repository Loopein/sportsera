"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { BiBroadcast } from "react-icons/bi";
import {
  FiActivity,
  FiCheckCircle,
  FiChevronLeft,
  FiChevronRight,
  FiClock,
  FiInfo,
  FiPlus
} from "react-icons/fi";
import type { LiveMatch } from "@/types/match";
import { ensureGsapRegistered, gsap, prefersReducedMotion } from "@/lib/gsap/client";
import { SportsEraPlayIcon } from "@/components/layout/SportsEraLogo";
import { MatchStatusBadge } from "@/components/live/MatchStatusBadge";
import { UpcomingCountdown } from "@/components/match/UpcomingCountdown";
import { formatTime, relativeTime } from "@/lib/utils/date";
import { formatTournamentShortName } from "@/lib/utils/text";

type LiveUpcomingCarouselProps = {
  matches: LiveMatch[];
  emptyCount?: number;
  emptyLabel?: string;
  showGameNameOnHover?: boolean;
};

function parseRuns(score?: string): number {
  const found = score?.match(/\d+/);
  return found ? Number(found[0]) : 0;
}

const CAROUSEL_CARD_BASE_CLASS =
  "surface-card carousel-card-size relative flex shrink-0 cursor-pointer flex-col overflow-hidden rounded-2xl transition-[width,border-color,box-shadow] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]";

function getCarouselCardClass(isActive: boolean): string {
  return `${CAROUSEL_CARD_BASE_CLASS} ${
    isActive
      ? "border-brand-400/70 p-2.5 sm:p-3 shadow-lg"
      : "p-2.5 sm:p-3 xl:p-3.5 hover:border-brand-300"
  }`;
}

export function LiveUpcomingCarousel({
  matches,
  emptyCount = 6,
  emptyLabel = "No live or upcoming matches",
  showGameNameOnHover = false
}: LiveUpcomingCarouselProps): React.ReactElement {
  const isEmpty = matches.length === 0;
  const totalItems = isEmpty ? emptyCount : matches.length;
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const trackRef = useRef<HTMLDivElement | null>(null);

  const scrollTrack = useCallback((direction: -1 | 1) => {
    const track = trackRef.current;
    if (!track) return;
    ensureGsapRegistered();
    const step = Math.max(260, Math.round(track.clientWidth * 0.78));
    const maxScroll = Math.max(0, track.scrollWidth - track.clientWidth);
    const targetX = Math.max(0, Math.min(maxScroll, track.scrollLeft + direction * step));
    if (prefersReducedMotion()) {
      track.scrollLeft = targetX;
      return;
    }
    gsap.to(track, {
      scrollTo: { x: targetX, autoKill: true },
      duration: 0.68,
      ease: "power3.out",
      overwrite: "auto"
    });
  }, []);

  useEffect(() => {
    if (activeIndex === null || !trackRef.current || prefersReducedMotion()) return;
    ensureGsapRegistered();
    const activeBody = trackRef.current.querySelectorAll<HTMLElement>(
      `[data-carousel-index="${activeIndex}"] [data-carousel-active-body]`
    );
    if (!activeBody.length) return;
    const tween = gsap.fromTo(
      activeBody,
      { opacity: 0.65, y: 4 },
      { opacity: 1, y: 0, duration: 0.28, ease: "power2.out", clearProps: "transform,opacity" }
    );
    return () => {
      tween.kill();
    };
  }, [activeIndex]);

  const handlePrev = useCallback(() => {
    scrollTrack(-1);
  }, [scrollTrack]);

  const handleNext = useCallback(() => {
    scrollTrack(1);
  }, [scrollTrack]);

  return (
    <div className="relative group/carousel">
      {totalItems > 1 ? (
        <>
          <button
            type="button"
            onClick={handlePrev}
            aria-label="Previous match card"
            className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-slate-200/80 bg-slate-900/75 text-white shadow-lg transition-all duration-200 hover:scale-105 hover:bg-brand-600 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 sm:h-10 sm:w-10 absolute left-2 top-1/2 z-20 -translate-y-1/2"
          >
            <FiChevronLeft className="h-4 w-4 sm:h-5 sm:w-5" aria-hidden="true" />
          </button>

          <button
            type="button"
            onClick={handleNext}
            aria-label="Next match card"
            className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-slate-200/80 bg-slate-900/75 text-white shadow-lg transition-all duration-200 hover:scale-105 hover:bg-brand-600 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 sm:h-10 sm:w-10 absolute right-2 top-1/2 z-20 -translate-y-1/2"
          >
            <FiChevronRight className="h-4 w-4 sm:h-5 sm:w-5" aria-hidden="true" />
          </button>
        </>
      ) : null}

      <div
        ref={trackRef}
        onMouseLeave={() => setActiveIndex(null)}
        className="overflow-x-auto py-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        <div className="mx-auto flex w-max items-stretch gap-3 sm:gap-3.5">
        {isEmpty
          ? Array.from({ length: emptyCount }).map((_, index) => {
              const isActive = activeIndex === index;
              return (
                <article
                  key={`empty-carousel-${index}`}
                  data-active={isActive ? "true" : "false"}
                  onMouseEnter={() => setActiveIndex(index)}
                  onMouseLeave={() => setActiveIndex((prev) => (prev === index ? null : prev))}
                  className={getCarouselCardClass(isActive)}
                >
                  <Link
                    href="/matches"
                    aria-label="Browse all matches"
                    className="absolute inset-0 z-10 rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
                  />
                  <div className="flex h-full flex-col items-center justify-center rounded-xl border border-dashed border-slate-200 bg-white/90 px-4 py-6 text-center">
                    <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-brand-50 text-brand-600">
                      <FiActivity className="h-5 w-5" aria-hidden="true" />
                    </span>
                    <p className="mt-3 text-sm font-bold text-slate-800">{emptyLabel}</p>
                    {isActive ? (
                      <p className="mt-1 max-w-xs text-xs text-slate-500">
                        Live fixtures and upcoming schedules will spotlight here automatically when active.
                      </p>
                    ) : null}
                  </div>
                </article>
              );
            })
          : matches.map((match, index) => {
              const isActive = activeIndex === index;
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
              const footerLabel = `Updated ${relativeTime(match.lastUpdatedAt)}`;
              const tournamentShortName = formatTournamentShortName(match.seriesName);
              const badgeLabel = isUpcoming ? (
                <UpcomingCountdown
                  startAt={startAt}
                  prefix=""
                  compact={!isActive}
                  fallbackValue={isActive ? formatTime(startAt) : "Soon"}
                  className="normal-case tabular-nums"
                  valueClassName="tabular-nums"
                />
              ) : undefined;
              const ctaHref = isUpcoming
                ? `/matches/${match.id}/squads`
                : isLive || match.status === "innings_break"
                  ? `/matches/${match.id}/scorecard`
                  : `/matches/${match.id}`;

              return (
                <article
                  key={match.id}
                  data-carousel-index={index}
                  data-active={isActive ? "true" : "false"}
                  onMouseEnter={() => setActiveIndex(index)}
                  onMouseLeave={() => setActiveIndex((prev) => (prev === index ? null : prev))}
                  className={getCarouselCardClass(isActive)}
                >
                  <span
                    aria-hidden="true"
                    className={`pointer-events-none absolute inset-x-0 top-0 h-0.5 rounded-t-2xl ${
                      isLive
                        ? "bg-gradient-to-r from-red-500 via-rose-400 to-orange-400"
                        : isUpcoming
                          ? "bg-gradient-to-r from-brand-500 via-sky-400 to-indigo-500"
                          : isCompleted
                            ? "bg-gradient-to-r from-emerald-500 to-teal-400"
                            : "bg-gradient-to-r from-amber-500 to-orange-400"
                    }`}
                  />
                  <Link
                    href={ctaHref}
                    aria-label={`Open ${match.teamA.shortName} vs ${match.teamB.shortName}`}
                    className="absolute inset-0 z-10 rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
                  />
                  {isActive ? (
                    <div data-carousel-active-body className="flex flex-1 flex-col justify-between">
                      <div className="flex items-center justify-between gap-2">
                        <MatchStatusBadge status={match.status} label={badgeLabel} hideIcon={isUpcoming} />
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
                          {showGameNameOnHover && match.format ? (
                            <span className="shrink-0 rounded-md border border-slate-200 bg-slate-50/80 px-1.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wider text-slate-700">
                              {match.format}
                            </span>
                          ) : null}
                        </div>
                      </div>

                      <div className="mt-1.5 space-y-1.5">
                        <div className="space-y-1.5 rounded-xl border border-slate-200/80 bg-white/90 p-2 sm:p-2.5">
                          <div className="grid grid-cols-2 items-center gap-2">
                            <div className="flex min-w-0 items-center justify-between gap-1.5 border-r border-slate-200/80 pr-1.5">
                              <div className="flex min-w-0 items-center gap-1.5">
                                <span className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-brand-200 bg-brand-50 text-[10px] font-black text-brand-700">
                                  {match.teamA.shortName.slice(0, 3)}
                                </span>
                                <div className="min-w-0">
                                  <p className="truncate text-xs font-extrabold text-slate-900">
                                    {match.teamA.shortName}
                                  </p>
                                  <p className="truncate text-[10px] font-medium text-slate-500">
                                    {match.teamA.name}
                                  </p>
                                </div>
                              </div>
                              <span className="shrink-0 text-right text-xs font-black tabular-nums text-slate-900">
                                {match.teamA.score || "-"}
                              </span>
                            </div>

                            <div className="flex min-w-0 items-center justify-between gap-1.5 pl-0.5">
                              <div className="flex min-w-0 items-center gap-1.5">
                                <span className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-indigo-200 bg-indigo-50 text-[10px] font-black text-indigo-800">
                                  {match.teamB.shortName.slice(0, 3)}
                                </span>
                                <div className="min-w-0">
                                  <p className="truncate text-xs font-extrabold text-slate-900">
                                    {match.teamB.shortName}
                                  </p>
                                  <p className="truncate text-[10px] font-medium text-slate-500">
                                    {match.teamB.name}
                                  </p>
                                </div>
                              </div>
                              <span className="shrink-0 text-right text-xs font-black tabular-nums text-slate-900">
                                {match.teamB.score || "-"}
                              </span>
                            </div>
                          </div>

                          <div className="flex h-1.5 w-full gap-0.5 overflow-hidden rounded-full bg-slate-100">
                            <div
                              className="h-full rounded-l-full bg-brand-600 transition-all duration-500"
                              style={{ width: teamAWidth }}
                            />
                            <div
                              className="h-full rounded-r-full bg-indigo-400 transition-all duration-500"
                              style={{ width: teamBWidth }}
                            />
                          </div>
                        </div>

                        <div className="flex items-center gap-1.5 rounded-xl border border-brand-100 bg-brand-50/80 px-2 py-1 text-[10px] font-semibold text-brand-900 sm:text-[11px]">
                          <SummaryIcon
                            className={`h-3 w-3 shrink-0 ${isLive ? "text-red-600" : "text-brand-700"}`}
                            aria-hidden="true"
                          />
                          <span className="truncate">
                            {match.summary || (isUpcoming ? "Upcoming fixture" : "Live match in progress")}
                          </span>
                        </div>
                      </div>

                      <div className="mt-auto pt-1.5">
                        <div className="relative z-20 flex items-center gap-1.5">
                          <Link
                            href={`/matches/${match.id}/watch`}
                            aria-label={`Watch ${match.teamA.shortName} vs ${match.teamB.shortName} on SportsEra Player`}
                            title="Open SportsEra Player"
                            className="inline-flex h-7 w-9 items-center justify-center rounded-lg border border-slate-200/80 bg-slate-50/80 shadow-sm transition hover:scale-105 hover:border-[#FF4D00]/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF4D00]"
                          >
                            <SportsEraPlayIcon className="h-3.5 w-3.5" />
                          </Link>
                          <Link
                            href={`/matches/${match.id}/squads`}
                            aria-label="View squads"
                            title="View squads"
                            className="inline-flex h-7 w-7 items-center justify-center rounded-lg border border-slate-200/80 bg-slate-50/80 text-slate-700 transition hover:border-brand-300 hover:text-brand-700"
                          >
                            <FiPlus className="h-3.5 w-3.5" aria-hidden="true" />
                          </Link>
                          <Link
                            href={`/matches/${match.id}/scorecard`}
                            aria-label="View scorecard"
                            title="View scorecard"
                            className="inline-flex h-7 w-7 items-center justify-center rounded-lg border border-slate-200/80 bg-slate-50/80 text-slate-700 transition hover:border-brand-300 hover:text-brand-700"
                          >
                            <FiActivity className="h-3.5 w-3.5" aria-hidden="true" />
                          </Link>
                          <Link
                            href={`/matches/${match.id}`}
                            aria-label="Match info"
                            title="Match info"
                            className="inline-flex h-7 w-7 items-center justify-center rounded-lg border border-slate-200/80 bg-slate-50/80 text-slate-700 transition hover:border-brand-300 hover:text-brand-700"
                          >
                            <FiInfo className="h-3.5 w-3.5" aria-hidden="true" />
                          </Link>
                        </div>

                        <h3 className="mt-1 truncate text-[13px] font-black tracking-tight text-slate-900 sm:text-sm">
                          {match.teamA.name} vs {match.teamB.name}
                        </h3>
                        <div className="mt-0.5 flex items-center gap-1.5 overflow-hidden whitespace-nowrap text-[10px] font-medium text-slate-600 sm:text-[11px]">
                          <span className="truncate max-w-[110px] sm:max-w-[140px]">{match.seriesName}</span>
                          {showGameNameOnHover && match.format ? (
                            <>
                              <span aria-hidden="true">•</span>
                              <span className="shrink-0 rounded border border-slate-200/80 bg-slate-50/80 px-1.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wider text-slate-700">
                                {match.format}
                              </span>
                            </>
                          ) : null}
                          <span aria-hidden="true">•</span>
                          <span className="truncate">{match.venue}</span>
                          {!isUpcoming ? (
                            <>
                              <span aria-hidden="true">•</span>
                              <span className="shrink-0">{footerLabel}</span>
                            </>
                          ) : null}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="flex items-center justify-between gap-1.5">
                        <MatchStatusBadge status={match.status} label={badgeLabel} hideIcon={isUpcoming} />
                        {tournamentShortName ? (
                          <span className="min-w-0 truncate max-w-[76px] rounded-md border border-slate-200 bg-slate-50/80 px-1.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wider text-slate-700">
                            {tournamentShortName}
                          </span>
                        ) : null}
                      </div>

                      <div className="mt-1.5 space-y-1.5 rounded-xl border border-slate-200/80 bg-white/90 p-2.5">
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex min-w-0 items-center gap-1.5">
                            <span className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-brand-200 bg-brand-50 text-[10px] font-black text-brand-700">
                              {match.teamA.shortName.slice(0, 3)}
                            </span>
                            <span className="truncate text-xs font-extrabold text-slate-900">
                              {match.teamA.shortName}
                            </span>
                          </div>
                          <span className="shrink-0 text-xs font-black tabular-nums text-slate-900">
                            {match.teamA.score || "-"}
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          <div className="h-px flex-1 bg-slate-200/80" />
                          <span className="rounded-full border border-slate-200/80 bg-slate-50/80 px-1.5 py-0.5 text-[8px] font-extrabold uppercase tracking-widest text-slate-500">
                            VS
                          </span>
                          <div className="h-px flex-1 bg-slate-200/80" />
                        </div>

                        <div className="flex items-center justify-between gap-2">
                          <div className="flex min-w-0 items-center gap-1.5">
                            <span className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-indigo-200 bg-indigo-50 text-[10px] font-black text-indigo-800">
                              {match.teamB.shortName.slice(0, 3)}
                            </span>
                            <span className="truncate text-xs font-extrabold text-slate-900">
                              {match.teamB.shortName}
                            </span>
                          </div>
                          <span className="shrink-0 text-xs font-black tabular-nums text-slate-900">
                            {match.teamB.score || "-"}
                          </span>
                        </div>
                      </div>

                      <div className="mt-auto pt-1.5">
                        <p className="truncate font-display text-base font-black uppercase tracking-tight text-slate-900">
                          {match.teamA.shortName} <span className="text-brand-600">vs</span> {match.teamB.shortName}
                        </p>
                        <p className="mt-0.5 truncate text-[11px] font-semibold text-slate-500">
                          {match.seriesName}
                        </p>
                        <p
                          className={`mt-0.5 truncate text-[11px] font-bold ${
                            isUpcoming ? "text-slate-500" : "text-brand-700"
                          }`}
                        >
                          {isUpcoming ? match.venue : match.summary || "View match"}
                        </p>
                      </div>
                    </>
                  )}
                </article>
              );
            })}
        </div>
      </div>
    </div>
  );
}
