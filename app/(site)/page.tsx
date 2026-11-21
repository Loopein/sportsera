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
import { LiveUpcomingCarousel } from "@/components/live/LiveUpcomingCarousel";
import { NewsList } from "@/components/news/NewsList";
import { AdSlot } from "@/components/shared/AdSlot";
import { PrefetchRoutes } from "@/components/shared/PrefetchRoutes";
import { SearchForm } from "@/components/shared/SearchForm";
import { Card } from "@/components/ui/card";
import { SectionHeading } from "@/components/ui/section-heading";
import { LoopeinLogo } from "@/components/shared/LoopeinBranding";
import { getLiveMatches, getMatches, getNews } from "@/lib/api/read";
import type { LiveMatch } from "@/types/match";

function detectMatchSport(match: LiveMatch): "cricket" | "football" | "other" {
  const scoreText = `${match.teamA.score ?? ""} ${match.teamB.score ?? ""}`;
  const infoText = `${match.format} ${match.seriesName} ${match.summary} ${match.teamA.name} ${match.teamB.name}`;

  if (
    /\b(basketball|nba|euroleague|tennis|atp|wta|wimbledon|grand slam|baseball|mlb|hockey|nhl|rugby|six nations|motorsports|formula 1|f1|motogp|esports|valorant|cs2|dota|league of legends|mma|ufc|bellator|golf|pga|masters|ryder cup|athletics|diamond league|track and field|marathon)\b/i.test(
      infoText
    )
  ) {
    return "other";
  }

  if (
    /\b(football|soccer|epl|english premier league|la liga|serie a|bundesliga|ligue 1|ucl|champions league|europa|uefa|fifa|afc|isl|mls|fa cup|copa|libertadores|fc|real madrid|barcelona|arsenal|liverpool|chelsea|bayern|psg|juventus|manchester|inter|ac milan)\b/i.test(
      infoText
    )
  ) {
    return "football";
  }

  if (
    /\d+\/\d+|\b1st inn\b|\b2nd inn\b|\bov\b/i.test(scoreText) ||
    /\b(cricket|ipl|bbl|psl|cpl|bpl|asia cup|icc|ashes|ranji|wickets|overs|innings)\b/i.test(infoText) ||
    /^(t20|t20i|odi|test|t10|list a|first-class|hundred|cricket)$/i.test(match.format.trim())
  ) {
    return "cricket";
  }

  return "other";
}

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
  const upcomingFixtures: LiveMatch[] = upcoming.map((match) => ({
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
  const filterBySport = (list: LiveMatch[]) => ({
    cricket: list.filter((match) => detectMatchSport(match) === "cricket"),
    football: list.filter((match) => detectMatchSport(match) === "football"),
    other: list.filter((match) => detectMatchSport(match) === "other")
  });
  const liveBySport = filterBySport(live);
  const upcomingBySport = filterBySport(upcomingFixtures);

  const cricketLive = liveBySport.cricket.slice(0, 10);
  const cricketUpcoming = upcomingBySport.cricket.slice(0, 10);
  const footballLive = liveBySport.football.slice(0, 10);
  const footballUpcoming = upcomingBySport.football.slice(0, 10);
  const otherSportsLive = liveBySport.other.slice(0, 12);
  const otherSportsUpcoming = upcomingBySport.other.slice(0, 12);

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

      {[
        {
          key: "cricket",
          title: "Cricket",
          href: "/search?q=Cricket",
          icon: <MdSportsCricket className="h-5 w-5 text-brand-600" aria-hidden="true" />,
          liveMatches: cricketLive,
          upcomingMatches: cricketUpcoming,
          emptyLiveLabel: "No live cricket matches right now",
          emptyUpcomingLabel: "No upcoming cricket matches scheduled"
        },
        {
          key: "football",
          title: "Football",
          href: "/search?q=Football",
          icon: <MdSportsSoccer className="h-5 w-5 text-emerald-600" aria-hidden="true" />,
          liveMatches: footballLive,
          upcomingMatches: footballUpcoming,
          emptyLiveLabel: "No live football matches right now",
          emptyUpcomingLabel: "No upcoming football matches scheduled"
        },
        {
          key: "other-sports",
          title: "Other Sports",
          href: "/matches",
          icon: <FiActivity className="h-5 w-5 text-amber-500" aria-hidden="true" />,
          liveMatches: otherSportsLive,
          upcomingMatches: otherSportsUpcoming,
          emptyLiveLabel: "No live other sports matches right now",
          emptyUpcomingLabel: "No upcoming other sports matches scheduled"
        }
      ].map((section) => (
        <section key={section.key} className="space-y-5">
          <SectionHeading
            title={section.title}
            icon={section.icon}
            action={
              <Link href={section.href} className="group subtle-link inline-flex items-center gap-1 text-sm">
                View More
                <FiArrowRight
                  className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5"
                  aria-hidden="true"
                />
              </Link>
            }
          />

          <div className="space-y-3">
            <div className="flex items-center justify-between gap-2">
              <div className="inline-flex items-center gap-2">
                <BiBroadcast className="h-4 w-4 text-red-600 animate-pulse-soft" aria-hidden="true" />
                <h3 className="text-sm font-extrabold uppercase tracking-wider text-slate-800">Live</h3>
              </div>
              <span className="inline-flex items-center rounded-full border border-red-200 bg-red-50/90 px-2.5 py-0.5 text-[11px] font-bold tabular-nums text-red-700">
                {section.liveMatches.length} live
              </span>
            </div>
            <LiveUpcomingCarousel
              matches={section.liveMatches}
              emptyCount={6}
              emptyLabel={section.emptyLiveLabel}
            />
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between gap-2">
              <div className="inline-flex items-center gap-2">
                <FiCalendar className="h-4 w-4 text-brand-600" aria-hidden="true" />
                <h3 className="text-sm font-extrabold uppercase tracking-wider text-slate-800">Upcoming</h3>
              </div>
              <span className="inline-flex items-center rounded-full border border-brand-200 bg-brand-50/80 px-2.5 py-0.5 text-[11px] font-bold tabular-nums text-brand-700">
                {section.upcomingMatches.length} upcoming
              </span>
            </div>
            <LiveUpcomingCarousel
              matches={section.upcomingMatches}
              emptyCount={6}
              emptyLabel={section.emptyUpcomingLabel}
            />
          </div>
        </section>
      ))}

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
