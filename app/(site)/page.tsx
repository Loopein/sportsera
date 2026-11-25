import Link from "next/link";
import { BiBroadcast } from "react-icons/bi";
import {
  FiActivity,
  FiArrowRight,
  FiCalendar,
  FiCheckCircle,
  FiAward
} from "react-icons/fi";
import { MdSportsCricket, MdSportsSoccer } from "react-icons/md";
import { HeroSpotlightCarousel } from "@/components/home/HeroSpotlightCarousel";
import { LiveMatchList } from "@/components/live/LiveMatchList";
import { LiveUpcomingCarousel } from "@/components/live/LiveUpcomingCarousel";
import { NewsList } from "@/components/news/NewsList";
import { AdSlot } from "@/components/shared/AdSlot";
import { PrefetchRoutes } from "@/components/shared/PrefetchRoutes";
import { SectionHeading } from "@/components/ui/section-heading";
import { getLiveMatches, getMatches, getNews } from "@/lib/api/read";
import { buildHeroSpotlightSlides } from "@/lib/utils/hero-spotlight";
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
  const heroSlides = buildHeroSpotlightSlides(upcomingFixtures);

  return (
    <div className="space-y-5 md:space-y-6">
      <PrefetchRoutes />
      <section className="relative w-full">
        <HeroSpotlightCarousel slides={heroSlides} />
      </section>

      {[
        {
          key: "cricket",
          title: "Cricket",
          href: "/search?q=Cricket",
          icon: <MdSportsCricket className="h-5 w-5 text-brand-600" aria-hidden="true" />,
          liveMatches: cricketLive,
          upcomingMatches: cricketUpcoming,
          emptyLiveLabel: "No live cricket matches right now",
          emptyUpcomingLabel: "No upcoming cricket matches scheduled",
          adLabel: "Sponsored · Cricket Desk"
        },
        {
          key: "football",
          title: "Football",
          href: "/search?q=Football",
          icon: <MdSportsSoccer className="h-5 w-5 text-emerald-600" aria-hidden="true" />,
          liveMatches: footballLive,
          upcomingMatches: footballUpcoming,
          emptyLiveLabel: "No live football matches right now",
          emptyUpcomingLabel: "No upcoming football matches scheduled",
          adLabel: "Sponsored · Football Desk"
        },
        {
          key: "other-sports",
          title: "Other Sports",
          href: "/matches",
          icon: <FiActivity className="h-5 w-5 text-amber-500" aria-hidden="true" />,
          liveMatches: otherSportsLive,
          upcomingMatches: otherSportsUpcoming,
          emptyLiveLabel: "No live other sports matches right now",
          emptyUpcomingLabel: "No upcoming other sports matches scheduled",
          adLabel: "Sponsored · Match Center"
        }
      ].map((section) => (
        <section key={section.key} className="space-y-3">
          <SectionHeading
            title={section.title}
            icon={section.icon}
            action={
              <Link
                href={section.href}
                className="group inline-flex items-center gap-1 rounded-full border border-slate-200/80 bg-white/80 px-3 py-1 text-xs font-bold text-brand-600 shadow-sm transition hover:border-brand-300 hover:bg-brand-50"
              >
                View More
                <FiArrowRight
                  className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5"
                  aria-hidden="true"
                />
              </Link>
            }
          />

          <div className="space-y-1.5">
            <div className="flex items-center justify-between gap-2">
              <div className="inline-flex items-center gap-1.5 rounded-full border border-red-200 bg-red-50/90 px-2.5 py-0.5">
                <BiBroadcast className="h-3.5 w-3.5 text-red-600 animate-pulse-soft" aria-hidden="true" />
                <h3 className="text-xs font-extrabold uppercase tracking-wider text-red-700">Live Now</h3>
              </div>
              <span className="inline-flex items-center rounded-full border border-red-200 bg-red-50/90 px-2.5 py-0.5 text-[11px] font-bold tabular-nums text-red-700">
                {section.liveMatches.length} live
              </span>
            </div>
            <LiveUpcomingCarousel
              matches={section.liveMatches}
              emptyCount={6}
              emptyLabel={section.emptyLiveLabel}
              showGameNameOnHover={section.key === "other-sports"}
            />
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between gap-2">
              <div className="inline-flex items-center gap-1.5 rounded-full border border-brand-200 bg-brand-50/80 px-2.5 py-0.5">
                <FiCalendar className="h-3.5 w-3.5 text-brand-600" aria-hidden="true" />
                <h3 className="text-xs font-extrabold uppercase tracking-wider text-brand-700">Upcoming</h3>
              </div>
              <span className="inline-flex items-center rounded-full border border-brand-200 bg-brand-50/80 px-2.5 py-0.5 text-[11px] font-bold tabular-nums text-brand-700">
                {section.upcomingMatches.length} upcoming
              </span>
            </div>
            <LiveUpcomingCarousel
              matches={section.upcomingMatches}
              emptyCount={6}
              emptyLabel={section.emptyUpcomingLabel}
              showGameNameOnHover={section.key === "other-sports"}
            />
          </div>

          <div className="pt-1">
            <AdSlot variant="in-feed" label={section.adLabel} />
          </div>
        </section>
      ))}

      <section className="space-y-4">
        <SectionHeading
          title="Recent Results"
          icon={<FiCheckCircle className="h-5 w-5 text-emerald-600" aria-hidden="true" />}
          action={
            <Link
              href="/matches?tab=results"
              className="group inline-flex items-center gap-1 rounded-full border border-slate-200/80 bg-white/80 px-3 py-1 text-xs font-bold text-brand-600 shadow-sm transition hover:border-brand-300 hover:bg-brand-50"
            >
              View all results
              <FiArrowRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5" aria-hidden="true" />
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

      <section className="space-y-4">
        <SectionHeading
          title="Latest News"
          icon={<FiAward className="h-5 w-5 text-brand-600" aria-hidden="true" />}
          action={
            <Link
              href="/news"
              className="group inline-flex items-center gap-1 rounded-full border border-slate-200/80 bg-white/80 px-3 py-1 text-xs font-bold text-brand-600 shadow-sm transition hover:border-brand-300 hover:bg-brand-50"
            >
              More news
              <FiArrowRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5" aria-hidden="true" />
            </Link>
          }
        />
        <NewsList articles={news} />
      </section>

      <AdSlot variant="leaderboard" label="Sponsored · Global Sports Network" />
    </div>
  );
}
