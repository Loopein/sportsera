import Link from "next/link";
import type { IconType } from "react-icons";
import { BiBroadcast } from "react-icons/bi";
import {
  FiActivity,
  FiArrowRight,
  FiCalendar,
  FiCheckCircle,
  FiAward
} from "react-icons/fi";
import {
  MdDirectionsRun,
  MdSportsBaseball,
  MdSportsBasketball,
  MdSportsCricket,
  MdSportsEsports,
  MdSportsGolf,
  MdSportsHockey,
  MdSportsMma,
  MdSportsMotorsports,
  MdSportsRugby,
  MdSportsSoccer,
  MdSportsTennis
} from "react-icons/md";
import { LiveMatchList } from "@/components/live/LiveMatchList";
import { NewsList } from "@/components/news/NewsList";
import { AdSlot } from "@/components/shared/AdSlot";
import { PrefetchRoutes } from "@/components/shared/PrefetchRoutes";
import { SearchForm } from "@/components/shared/SearchForm";
import { Card } from "@/components/ui/card";
import { SectionHeading } from "@/components/ui/section-heading";
import { LoopeinLogo } from "@/components/shared/LoopeinBranding";
import { getLiveMatches, getMatches, getNews } from "@/lib/api/read";

const SPORT_CATEGORIES: Array<{ label: string; icon: IconType }> = [
  { label: "Football", icon: MdSportsSoccer },
  { label: "Cricket", icon: MdSportsCricket },
  { label: "Basketball", icon: MdSportsBasketball },
  { label: "Tennis", icon: MdSportsTennis },
  { label: "Baseball", icon: MdSportsBaseball },
  { label: "Hockey", icon: MdSportsHockey },
  { label: "Rugby", icon: MdSportsRugby },
  { label: "Motorsports", icon: MdSportsMotorsports },
  { label: "Esports", icon: MdSportsEsports },
  { label: "MMA", icon: MdSportsMma },
  { label: "Golf", icon: MdSportsGolf },
  { label: "Athletics", icon: MdDirectionsRun }
];

export const revalidate = 10;

export default async function HomePage(): Promise<React.ReactElement> {
  const [live, upcoming, results, news] = await Promise.all([
    getLiveMatches(),
    getMatches("upcoming"),
    getMatches("completed"),
    getNews()
  ]);
  const recentResults = results.slice(0, 4).map((match) => ({
    id: match.id,
    slug: match.id,
    status: match.status,
    format: match.format,
    seriesName: match.seriesName,
    venue: match.venue,
    teamA: match.teamA,
    teamB: match.teamB,
    summary: match.resultText ?? "Match completed",
    lastUpdatedAt: match.lastUpdatedAt ?? new Date().toISOString()
  }));
  const upcomingFixtures = upcoming.slice(0, 4).map((match) => ({
    id: match.id,
    slug: match.id,
    status: match.status,
    format: match.format,
    seriesName: match.seriesName,
    venue: match.venue,
    teamA: match.teamA,
    teamB: match.teamB,
    summary: match.resultText ?? "Upcoming fixture",
    startAt: match.startAt ?? match.lastUpdatedAt ?? new Date().toISOString(),
    lastUpdatedAt: match.lastUpdatedAt ?? new Date().toISOString()
  }));
  const liveAndUpcoming = [...live, ...upcomingFixtures].slice(0, 4);

  return (
    <div className="space-y-10 md:space-y-12">
      <PrefetchRoutes />
      <Card as="section" className="relative p-5 sm:p-7 md:p-8">
        <div className="grid items-center gap-6 lg:grid-cols-[1.35fr_0.65fr]">
          <div className="relative z-10 min-w-0">
            <h1 className="text-2xl font-black tracking-tight text-slate-900 sm:text-3xl md:text-4xl lg:leading-[1.15]">
              Live Scores, Match Centers &amp; Analytics Across Every Sport
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-slate-700 md:text-base">
              Follow real-time scores, play-by-play commentary, fixtures, results, standings, teams, and athletes across
              football, cricket, basketball, tennis, motorsports, and every major sport in one fast public hub.
            </p>
            <div className="mt-5 max-w-2xl">
              <SearchForm action="/search" />
            </div>
            <div className="mt-4 flex flex-wrap items-center gap-1.5">
              {SPORT_CATEGORIES.map((sport) => {
                const SportIcon = sport.icon;
                return (
                  <Link
                    key={sport.label}
                    href={`/search?q=${encodeURIComponent(sport.label)}`}
                    className="inline-flex items-center gap-1.5 rounded-full border border-slate-200/80 bg-slate-50/80 px-2.5 py-1 text-xs font-bold text-slate-700 transition hover:border-brand-300 hover:bg-brand-50 hover:text-brand-700"
                  >
                    <SportIcon className="h-3.5 w-3.5 text-brand-600" aria-hidden="true" />
                    <span>{sport.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>

          <aside className="relative z-10 min-w-0 space-y-3">
            <Card className="p-4 shadow-sm">
              <div className="flex items-center justify-between">
                <p className="text-xs font-extrabold uppercase tracking-wider text-slate-500">Quick Access</p>
                <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-brand-700">
                  <LoopeinLogo height={14} />
                  <span>Sports</span>
                </span>
              </div>
              <div className="mt-3 grid grid-cols-2 gap-2">
                <Link
                  href="/live"
                  className="group inline-flex items-center justify-between rounded-xl bg-brand-600 px-3.5 py-2.5 text-sm font-bold text-white shadow-sm transition-all duration-200 hover:bg-brand-700 hover:shadow"
                >
                  <span className="inline-flex items-center gap-1.5">
                    <BiBroadcast className="h-3.5 w-3.5" aria-hidden="true" />
                    Live
                  </span>
                  <FiArrowRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5" aria-hidden="true" />
                </Link>
                <Link
                  href="/matches"
                  className="group inline-flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm font-bold text-slate-800 transition-all duration-200 hover:border-brand-200 hover:bg-brand-50"
                >
                  <span className="inline-flex items-center gap-1.5">
                    <FiActivity className="h-3.5 w-3.5 text-brand-600" aria-hidden="true" />
                    Matches
                  </span>
                  <FiArrowRight className="h-3.5 w-3.5 text-slate-500 transition-transform duration-200 group-hover:translate-x-0.5" aria-hidden="true" />
                </Link>
                <Link
                  href="/fixtures"
                  className="group inline-flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm font-bold text-slate-800 transition-all duration-200 hover:border-brand-200 hover:bg-brand-50"
                >
                  <span className="inline-flex items-center gap-1.5">
                    <FiCalendar className="h-3.5 w-3.5 text-brand-600" aria-hidden="true" />
                    Fixtures
                  </span>
                  <FiArrowRight className="h-3.5 w-3.5 text-slate-500 transition-transform duration-200 group-hover:translate-x-0.5" aria-hidden="true" />
                </Link>
                <Link
                  href="/rankings"
                  className="group inline-flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm font-bold text-slate-800 transition-all duration-200 hover:border-brand-200 hover:bg-brand-50"
                >
                  <span className="inline-flex items-center gap-1.5">
                    <FiAward className="h-3.5 w-3.5 text-brand-600" aria-hidden="true" />
                    Standings
                  </span>
                  <FiArrowRight className="h-3.5 w-3.5 text-slate-500 transition-transform duration-200 group-hover:translate-x-0.5" aria-hidden="true" />
                </Link>
              </div>
            </Card>

            <Card className="p-4 shadow-sm">
              <div className="flex items-center justify-between">
                <p className="inline-flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-wider text-slate-500">
                  <BiBroadcast className="h-3.5 w-3.5 text-red-600 animate-pulse-soft" aria-hidden="true" />
                  Match Center Pulse
                </p>
                <span className="score-pill">{live.length} live</span>
              </div>
              <div className="mt-3 grid grid-cols-3 gap-2 text-center">
                <div className="rounded-xl border border-red-100 bg-red-50/60 px-2 py-2.5">
                  <p className="mb-1 inline-flex items-center gap-1 text-[10px] font-extrabold uppercase tracking-wider text-red-600">
                    <BiBroadcast className="h-3 w-3" aria-hidden="true" />
                    Live
                  </p>
                  <p className="text-lg font-black tabular-nums text-slate-900">{live.length}</p>
                </div>
                <div className="rounded-xl border border-brand-100 bg-brand-50/60 px-2 py-2.5">
                  <p className="mb-1 inline-flex items-center gap-1 text-[10px] font-extrabold uppercase tracking-wider text-brand-700">
                    <FiCalendar className="h-3 w-3" aria-hidden="true" />
                    Upcoming
                  </p>
                  <p className="text-lg font-black tabular-nums text-slate-900">{upcoming.length}</p>
                </div>
                <div className="rounded-xl border border-emerald-100 bg-emerald-50/60 px-2 py-2.5">
                  <p className="mb-1 inline-flex items-center gap-1 text-[10px] font-extrabold uppercase tracking-wider text-emerald-700">
                    <FiCheckCircle className="h-3 w-3" aria-hidden="true" />
                    Results
                  </p>
                  <p className="text-lg font-black tabular-nums text-slate-900">{results.length}</p>
                </div>
              </div>
            </Card>

            <AdSlot variant="banner-compact" label="Sponsored · Hero Spotlight" />
          </aside>
        </div>
      </Card>

      <section className="space-y-4 animate-reveal-up" style={{ animationDelay: "60ms" }}>
        <SectionHeading
          title="Live & Upcoming"
          icon={<BiBroadcast className="h-5 w-5 text-red-600 animate-pulse-soft" aria-hidden="true" />}
          action={
            <Link href="/matches" className="group subtle-link inline-flex items-center gap-1 text-sm">
              All matches
              <FiArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" aria-hidden="true" />
            </Link>
          }
        />
        <LiveMatchList
          matches={liveAndUpcoming}
          desktopColumns={4}
          emptyCount={4}
          emptyLabel="No live or upcoming matches"
        />
      </section>

      <AdSlot variant="in-feed" label="Sponsored · Match Center" />

      <section className="space-y-4 animate-reveal-up" style={{ animationDelay: "120ms" }}>
        <SectionHeading
          title="Recent Results"
          icon={<FiCheckCircle className="h-5 w-5 text-emerald-600" aria-hidden="true" />}
          action={
            <Link href="/matches?tab=results" className="group subtle-link inline-flex items-center gap-1 text-sm">
              View all results
              <FiArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" aria-hidden="true" />
            </Link>
          }
        />
        <LiveMatchList
          matches={recentResults}
          mobileLimit={1}
          desktopColumns={4}
          emptyCount={4}
          emptyLabel="No recent results"
        />
      </section>

      <AdSlot variant="leaderboard" label="Sponsored · Results Desk" />

      <section className="space-y-4 animate-reveal-up" style={{ animationDelay: "180ms" }}>
        <SectionHeading
          title="Latest News"
          icon={<FiAward className="h-5 w-5 text-brand-600" aria-hidden="true" />}
          action={
            <Link href="/news" className="group subtle-link inline-flex items-center gap-1 text-sm">
              More news
              <FiArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" aria-hidden="true" />
            </Link>
          }
        />
        <NewsList articles={news} />
      </section>

      <AdSlot variant="leaderboard" label="Sponsored · Global Sports Network" />
    </div>
  );
}
