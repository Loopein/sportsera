"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Autoplay from "embla-carousel-autoplay";
import { FiActivity, FiClock, FiMapPin, FiStar, FiZap } from "react-icons/fi";
import type { HeroSpotlightSlide } from "@/lib/utils/hero-spotlight";
import { SportsEraPlayIcon } from "@/components/layout/SportsEraLogo";
import { MatchStatusBadge } from "@/components/live/MatchStatusBadge";
import { UpcomingCountdown } from "@/components/match/UpcomingCountdown";
import { Carousel, CarouselContent, CarouselItem, type CarouselApi } from "@/components/ui/carousel";
import { formatTime } from "@/lib/utils/date";
import { formatTournamentShortName } from "@/lib/utils/text";

const HERO_AUTOPLAY_DELAY_MS = 10000;
const HERO_SLIDE_DURATION = 55;

type HeroSpotlightCarouselProps = {
  slides: HeroSpotlightSlide[];
};

export function HeroSpotlightCarousel({ slides }: HeroSpotlightCarouselProps): React.ReactElement {
  const [api, setApi] = useState<CarouselApi>();
  const [activeIndex, setActiveIndex] = useState(0);
  const autoplayPlugin = useMemo(
    () =>
      Autoplay({
        delay: HERO_AUTOPLAY_DELAY_MS,
        stopOnInteraction: false,
        stopOnMouseEnter: true
      }),
    []
  );

  useEffect(() => {
    if (!api) return;
    const onSelect = () => {
      setActiveIndex(api.selectedScrollSnap());
    };
    onSelect();
    api.on("select", onSelect);
    api.on("reInit", onSelect);
    return () => {
      api.off("select", onSelect);
      api.off("reInit", onSelect);
    };
  }, [api]);

  if (slides.length === 0) {
    return (
      <div className="surface-card !border-0 !shadow-none relative cursor-pointer p-6 text-center">
        <Link
          href="/fixtures"
          aria-label="Browse upcoming fixtures"
          className="absolute inset-0 z-10 rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
        />
        <h1 className="text-2xl font-black tracking-tight text-slate-900">
          Upcoming Big Tournaments &amp; Recommendations
        </h1>
        <p className="mt-2 text-sm text-slate-600">
          Upcoming marquee fixtures and tailored match recommendations will spotlight here automatically.
        </p>
        <div className="relative z-20 mt-4 flex flex-wrap justify-center gap-2">
          <Link
            href="/fixtures"
            className="rounded-xl bg-slate-50 px-4 py-2 text-xs font-bold text-slate-800 hover:bg-brand-50"
          >
            Browse Fixtures
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <Carousel
        opts={{ align: "start", loop: true, duration: HERO_SLIDE_DURATION }}
        plugins={[autoplayPlugin]}
        setApi={setApi}
        className="w-full"
      >
        <CarouselContent>
          {slides.map((slide, idx) => {
            const { match } = slide;
            const startAt = match.startAt ?? match.lastUpdatedAt;
            const tournamentShort = formatTournamentShortName(match.seriesName);
            const HeadingTag = idx === 0 ? "h1" : "h2";

            return (
              <CarouselItem key={match.id} className="w-full">
                <div
                  className={`surface-card !border-0 !shadow-none group relative flex w-full cursor-pointer flex-col justify-between gap-4 rounded-2xl p-4 transition-opacity duration-700 ease-out sm:p-6 ${
                    idx === activeIndex ? "opacity-100" : "opacity-60"
                  }`}
                >
                  <Link
                    href={`/matches/${match.id}`}
                    draggable={false}
                    aria-label={`Open ${match.teamA.name} vs ${match.teamB.name}`}
                    className="absolute inset-0 z-10 rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
                  />
                  <div>
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex flex-wrap items-center gap-2">
                        <span
                          className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-extrabold uppercase tracking-wider ${
                            slide.category === "big-tournament"
                              ? "bg-amber-100 text-amber-800"
                              : "bg-brand-50 text-brand-700"
                          }`}
                        >
                          {slide.category === "big-tournament" ? (
                            <FiZap className="h-3 w-3" aria-hidden="true" />
                          ) : (
                            <FiStar className="h-3 w-3" aria-hidden="true" />
                          )}
                          <span>{slide.tagLabel}</span>
                        </span>
                        {tournamentShort ? (
                          <span className="rounded-md bg-slate-50/80 px-1.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wider text-slate-700">
                            {tournamentShort}
                          </span>
                        ) : null}
                        <span className="text-xs font-bold text-slate-600">{match.seriesName}</span>
                      </div>
                      <MatchStatusBadge
                        status="upcoming"
                        hideIcon
                        className="!ring-0"
                        label={
                          <UpcomingCountdown
                            startAt={startAt}
                            prefix=""
                            fallbackValue={formatTime(startAt)}
                            className="normal-case tabular-nums"
                            valueClassName="tabular-nums"
                          />
                        }
                      />
                    </div>

                    <HeadingTag className="mt-2.5 text-xl font-black tracking-tight text-slate-900 transition-colors group-hover:text-brand-700 sm:text-2xl md:text-3xl">
                      {match.teamA.name} vs {match.teamB.name}
                    </HeadingTag>
                    <p className="mt-1 text-xs font-semibold text-slate-600 sm:text-sm">
                      {slide.reasonLabel}
                    </p>
                  </div>

                  {/* Upcoming Matchup Box */}
                  <div className="space-y-3 rounded-xl bg-slate-50/80 p-3.5 sm:p-4">
                    <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3">
                      <div className="flex min-w-0 items-center gap-2.5">
                        <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-sm font-black text-brand-700">
                          {match.teamA.shortName.slice(0, 3)}
                        </span>
                        <div className="min-w-0">
                          <p className="truncate text-sm font-extrabold text-slate-900 sm:text-base">
                            {match.teamA.shortName}
                          </p>
                          <p className="truncate text-xs font-medium text-slate-500">
                            {match.teamA.name}
                          </p>
                        </div>
                      </div>

                      <span className="rounded-full bg-white/90 px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-widest text-slate-500">
                        VS
                      </span>

                      <div className="flex min-w-0 items-center justify-end gap-2.5 text-right">
                        <div className="min-w-0">
                          <p className="truncate text-sm font-extrabold text-slate-900 sm:text-base">
                            {match.teamB.shortName}
                          </p>
                          <p className="truncate text-xs font-medium text-slate-500">
                            {match.teamB.name}
                          </p>
                        </div>
                        <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-sm font-black text-indigo-800">
                          {match.teamB.shortName.slice(0, 3)}
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-2 pt-1 text-xs font-medium text-slate-600">
                      <span className="inline-flex min-w-0 items-center gap-1.5 font-bold text-brand-700">
                        <FiClock className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                        <UpcomingCountdown
                          startAt={startAt}
                          fallbackValue={`Starts ${formatTime(startAt)}`}
                          valueClassName="tabular-nums"
                        />
                      </span>

                      <div className="flex items-center gap-2 text-[11px] text-slate-500">
                        <span className="inline-flex items-center gap-1 truncate max-w-[220px]">
                          <FiMapPin className="h-3 w-3 shrink-0" aria-hidden="true" />
                          <span className="truncate">{match.venue}</span>
                        </span>
                        <span aria-hidden="true">•</span>
                        <span className="shrink-0">{formatTime(startAt)}</span>
                      </div>
                    </div>
                  </div>

                  {/* CTA Row & Indicator Dots */}
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="relative z-20 flex flex-wrap items-center gap-2">
                      <Link
                        href={`/matches/${match.id}/watch`}
                        className="inline-flex items-center gap-2 rounded-xl bg-[#0B1221] px-4 py-2 text-xs font-extrabold uppercase tracking-wider text-white shadow-sm transition hover:brightness-110"
                      >
                        <SportsEraPlayIcon className="h-3.5 w-3.5" />
                        <span>Watch in SportsEra Player</span>
                      </Link>
                      <Link
                        href={`/matches/${match.id}/squads`}
                        className="inline-flex items-center gap-1.5 rounded-xl bg-slate-50 px-3.5 py-2 text-xs font-bold text-slate-800 transition hover:bg-brand-50 hover:text-brand-700"
                      >
                        <FiActivity className="h-3.5 w-3.5 text-brand-600" aria-hidden="true" />
                        <span>View Squads</span>
                      </Link>
                    </div>

                    {slides.length > 1 ? (
                      <div
                        className="relative z-20 flex items-center gap-1.5"
                        role="tablist"
                        aria-label="Hero spotlight slides"
                      >
                        {slides.map((dotSlide, dotIdx) => {
                          const isCurrent = dotIdx === activeIndex;
                          return (
                            <button
                              key={dotSlide.match.id}
                              type="button"
                              role="tab"
                              aria-selected={isCurrent}
                              aria-label={`Show ${dotSlide.match.teamA.shortName} vs ${dotSlide.match.teamB.shortName}`}
                              onClick={() => {
                                api?.scrollTo(dotIdx);
                                autoplayPlugin.reset();
                              }}
                              className={`h-2 rounded-full transition-all duration-300 ${
                                isCurrent ? "w-6 bg-brand-600" : "w-2 bg-slate-300 hover:bg-brand-400"
                              }`}
                            />
                          );
                        })}
                      </div>
                    ) : null}
                  </div>
                </div>
              </CarouselItem>
            );
          })}
        </CarouselContent>
      </Carousel>
    </div>
  );
}
