import Link from "next/link";
import { BiBroadcast } from "react-icons/bi";
import {
  FiActivity,
  FiArrowRight,
  FiCalendar,
  FiCheckCircle,
  FiAward
} from "react-icons/fi";
import { LiveMatchList } from "@/components/live/LiveMatchList";
import { NewsList } from "@/components/news/NewsList";
import { AdSlot } from "@/components/shared/AdSlot";
import { PrefetchRoutes } from "@/components/shared/PrefetchRoutes";
import { SearchForm } from "@/components/shared/SearchForm";
import { Card } from "@/components/ui/card";
import { SectionHeading } from "@/components/ui/section-heading";
import { getLiveMatches, getMatches, getNews } from "@/lib/api/read";
import { SITE_POWERED_BY } from "@/lib/constants/site";

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
      <Card as="section" variant="strong" className="relative overflow-hidden p-5 sm:p-7 md:p-8">
        <div className="glow-orb glow-orb-blue float-slow -left-12 -top-10 h-44 w-44" />
        <div className="glow-orb glow-orb-cyan float-delay -right-10 top-8 h-40 w-40" />
        <div className="hero-grid-overlay absolute inset-0 opacity-80" />
        <div className="grid items-center gap-6 lg:grid-cols-[1.35fr_0.65fr]">
          <div className="relative z-10 min-w-0">
            <h1 className="text-2xl font-black tracking-tight text-slate-900 sm:text-3xl md:text-4xl lg:leading-[1.15]">
              Catch Every Ball Without Refreshing the Whole Page
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-slate-700 md:text-base">
              Live matches, scorecards, ball-by-ball commentary, fixtures, results, rankings, teams, players, and
              unified search in one fast public cricket center.
            </p>
            <div className="mt-5 max-w-2xl">
              <SearchForm action="/search" />
            </div>
          </div>

          <aside className="relative z-10 min-w-0 space-y-3">
            <Card className="p-4 shadow-sm">
              <div className="flex items-center justify-between">
                <p className="text-xs font-extrabold uppercase tracking-wider text-slate-500">Quick Access</p>
                <span className="text-[11px] font-bold text-brand-700">{SITE_POWERED_BY} Sports</span>
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

      <AdSlot variant="leaderboard" label="Sponsored · Cricket Network" />
    </div>
  );
}
