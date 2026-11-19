import Link from "next/link";
import { BiBroadcast } from "react-icons/bi";
import {
  FiActivity,
  FiArrowRight,
  FiCalendar,
  FiCheckCircle,
  FiAward,
  FiShield,
  FiSmartphone,
  FiZap
} from "react-icons/fi";
import { LiveMatchList } from "@/components/live/LiveMatchList";
import { NewsList } from "@/components/news/NewsList";
import { PrefetchRoutes } from "@/components/shared/PrefetchRoutes";
import { SearchForm } from "@/components/shared/SearchForm";
import { Card } from "@/components/ui/card";
import { SectionHeading } from "@/components/ui/section-heading";
import { getLiveMatches, getMatches, getNews } from "@/lib/api/read";

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
    <div className="space-y-12">
      <PrefetchRoutes />
      <Card as="section" variant="strong" className="relative overflow-hidden p-6 md:p-8">
        <div className="glow-orb glow-orb-blue float-slow -left-12 -top-10 h-44 w-44" />
        <div className="glow-orb glow-orb-cyan float-delay -right-10 top-8 h-40 w-40" />
        <div className="hero-grid-overlay absolute inset-0 opacity-80" />
        <div className="grid items-start gap-6 lg:grid-cols-[1.35fr_0.65fr]">
          <div className="relative z-10">
            <p className="inline-flex items-center gap-2 rounded-full bg-red-50 px-3 py-1 text-xs font-bold uppercase tracking-[0.14em] text-red-700">
              <BiBroadcast className="h-3.5 w-3.5 animate-pulse-soft" aria-hidden="true" />
              Live & Match-Ready
            </p>
            <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-slate-900 md:text-4xl">
              Catch Every Ball Without Refreshing the Whole Page
            </h1>
            <p className="mt-3 max-w-2xl text-sm text-slate-700 md:text-base">
              Live matches, scorecards, ball-by-ball commentary, fixtures, results, rankings, teams, players, and
              unified search in one clean public app.
            </p>
            <div className="mt-5 max-w-2xl">
              <SearchForm action="/search" />
            </div>
            <div className="mt-5 flex flex-wrap gap-2">
              <span className="metric-chip inline-flex items-center gap-1.5 transition-all duration-200 hover:border-brand-300">
                <FiZap className="h-3.5 w-3.5 text-brand-600" aria-hidden="true" />
                10k concurrent-read friendly
              </span>
              <span className="metric-chip inline-flex items-center gap-1.5 transition-all duration-200 hover:border-brand-300">
                <FiSmartphone className="h-3.5 w-3.5 text-brand-600" aria-hidden="true" />
                Mobile-first score visibility
              </span>
              <span className="metric-chip inline-flex items-center gap-1.5 transition-all duration-200 hover:border-brand-300">
                <FiShield className="h-3.5 w-3.5 text-brand-600" aria-hidden="true" />
                Read-only safe architecture
              </span>
            </div>
          </div>
          <aside className="relative z-10 space-y-3">
            <Card className="p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Quick Access</p>
              <div className="mt-3 grid grid-cols-2 gap-2">
                <Link
                  href="/live"
                  className="group inline-flex items-center justify-between rounded-lg bg-brand-600 px-3 py-2 text-sm font-semibold text-white transition-all duration-200 hover:bg-brand-700 hover:shadow-sm"
                >
                  <span className="inline-flex items-center gap-1.5">
                    <BiBroadcast className="h-3.5 w-3.5" aria-hidden="true" />
                    Live
                  </span>
                  <FiArrowRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5" aria-hidden="true" />
                </Link>
                <Link
                  href="/matches"
                  className="group inline-flex items-center justify-between rounded-lg bg-slate-100 px-3 py-2 text-sm font-semibold text-slate-700 transition-all duration-200 hover:bg-slate-200 hover:shadow-sm"
                >
                  <span className="inline-flex items-center gap-1.5">
                    <FiActivity className="h-3.5 w-3.5 text-slate-500" aria-hidden="true" />
                    Matches
                  </span>
                  <FiArrowRight className="h-3.5 w-3.5 text-slate-500 transition-transform duration-200 group-hover:translate-x-0.5" aria-hidden="true" />
                </Link>
                <Link
                  href="/fixtures"
                  className="group inline-flex items-center justify-between rounded-lg bg-slate-100 px-3 py-2 text-sm font-semibold text-slate-700 transition-all duration-200 hover:bg-slate-200 hover:shadow-sm"
                >
                  <span className="inline-flex items-center gap-1.5">
                    <FiCalendar className="h-3.5 w-3.5 text-slate-500" aria-hidden="true" />
                    Fixtures
                  </span>
                  <FiArrowRight className="h-3.5 w-3.5 text-slate-500 transition-transform duration-200 group-hover:translate-x-0.5" aria-hidden="true" />
                </Link>
                <Link
                  href="/rankings"
                  className="group inline-flex items-center justify-between rounded-lg bg-slate-100 px-3 py-2 text-sm font-semibold text-slate-700 transition-all duration-200 hover:bg-slate-200 hover:shadow-sm"
                >
                  <span className="inline-flex items-center gap-1.5">
                    <FiAward className="h-3.5 w-3.5 text-slate-500" aria-hidden="true" />
                    Rankings
                  </span>
                  <FiArrowRight className="h-3.5 w-3.5 text-slate-500 transition-transform duration-200 group-hover:translate-x-0.5" aria-hidden="true" />
                </Link>
              </div>
            </Card>
            <Card className="p-4">
              <div className="flex items-center justify-between">
                <p className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-slate-500">
                  <BiBroadcast className="h-3.5 w-3.5 text-brand-600" aria-hidden="true" />
                  Live Activity
                </p>
                <span className="score-pill">{live.length} live</span>
              </div>
              <div className="mt-3 rounded-xl bg-slate-50 p-3">
                <div className="mt-2 grid grid-cols-3 gap-2 text-center">
                  <div className="rounded-lg bg-white px-2 py-2 transition-all duration-200 hover:shadow-sm">
                    <p className="mb-1 inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wide text-red-600">
                      <BiBroadcast className="h-3 w-3" aria-hidden="true" />
                      Live
                    </p>
                    <p className="text-sm font-extrabold text-slate-900">{live.length}</p>
                  </div>
                  <div className="rounded-lg bg-white px-2 py-2 transition-all duration-200 hover:shadow-sm">
                    <p className="mb-1 inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wide text-brand-700">
                      <FiCalendar className="h-3 w-3" aria-hidden="true" />
                      Upcoming
                    </p>
                    <p className="text-sm font-extrabold text-slate-900">{upcoming.length}</p>
                  </div>
                  <div className="rounded-lg bg-white px-2 py-2 transition-all duration-200 hover:shadow-sm">
                    <p className="mb-1 inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wide text-emerald-700">
                      <FiCheckCircle className="h-3 w-3" aria-hidden="true" />
                      Results
                    </p>
                    <p className="text-sm font-extrabold text-slate-900">{results.length}</p>
                  </div>
                </div>
              </div>
            </Card>
          </aside>
        </div>
      </Card>

      <section className="space-y-3 animate-reveal-up" style={{ animationDelay: "60ms" }}>
        <SectionHeading
          title="Live & Upcoming"
          icon={<BiBroadcast className="h-5 w-5 text-brand-600" aria-hidden="true" />}
        />
        <LiveMatchList
          matches={liveAndUpcoming}
          desktopColumns={4}
          emptyCount={4}
          emptyLabel="No data found"
        />
      </section>

      <section className="space-y-3 animate-reveal-up" style={{ animationDelay: "120ms" }}>
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
          emptyLabel="No data found"
        />
      </section>

      <section className="space-y-3 animate-reveal-up" style={{ animationDelay: "240ms" }}>
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
    </div>
  );
}
