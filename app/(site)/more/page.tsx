import Link from "next/link";
import { BiBroadcast } from "react-icons/bi";
import {
  FiArrowRight,
  FiAward,
  FiBarChart2,
  FiCalendar,
  FiCheckCircle,
  FiCompass,
  FiLayers,
  FiSearch,
  FiShield,
  FiUsers
} from "react-icons/fi";
import { AdSlot } from "@/components/shared/AdSlot";
import { Card } from "@/components/ui/card";
import { SITE_NAME, SITE_POWERED_BY } from "@/lib/constants/site";

const moreLinks = [
  { href: "/live", label: "Live Center", description: "Real-time ball-by-ball scores & active commentary", icon: BiBroadcast },
  { href: "/fixtures", label: "Fixtures", description: "Upcoming international and tournament match schedules", icon: FiCalendar },
  { href: "/results", label: "Results", description: "Completed matches, summaries, and full scorecards", icon: FiCheckCircle },
  { href: "/series", label: "Series", description: "Bilateral tours, leagues, and ICC tournament hubs", icon: FiLayers },
  { href: "/teams", label: "Teams", description: "International & league squads, fixtures, and rosters", icon: FiShield },
  { href: "/players", label: "Players", description: "Career stats, batting/bowling averages, and form", icon: FiUsers },
  { href: "/rankings", label: "Standings", description: "Tournament group tables, points, and net run rate", icon: FiAward },
  { href: "/stats", label: "Stats", description: "Tournament leaders across runs, wickets, and economy", icon: FiBarChart2 },
  { href: "/search", label: "Search", description: "Instant search across teams, players, series, and news", icon: FiSearch }
];

export default function MorePage(): React.ReactElement {
  return (
    <div className="space-y-6">
      <Card as="section" variant="strong" className="p-5 sm:p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-700 ring-1 ring-brand-200/80">
              <FiCompass className="h-5 w-5" aria-hidden="true" />
            </span>
            <div>
              <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">More</h1>
              <p className="mt-1 text-sm text-slate-600">
                Explore every cricket section, analytical leaderboard, and directory across {SITE_NAME}.
              </p>
            </div>
          </div>
          <span className="inline-flex items-center rounded-full border border-[#cfd7ef] bg-[#edf2ff] px-3 py-1 text-xs font-bold uppercase tracking-wide text-[rgb(6,12,58)]">
            {SITE_NAME} · Powered by {SITE_POWERED_BY}
          </span>
        </div>
      </Card>

      <div className="grid gap-3.5 sm:grid-cols-2 lg:grid-cols-3">
        {moreLinks.map((item) => {
          const Icon = item.icon;
          return (
            <Link key={item.href} href={item.href} className="group block h-full">
              <Card interactive className="flex h-full items-start justify-between gap-3 p-4 sm:p-5">
                <div className="flex items-start gap-3">
                  <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-brand-200/70 bg-brand-50/80 text-brand-700 transition group-hover:bg-brand-600 group-hover:text-white">
                    <Icon className="h-4 w-4" aria-hidden="true" />
                  </span>
                  <div className="min-w-0">
                    <h2 className="text-sm font-extrabold text-slate-900 transition group-hover:text-brand-700 sm:text-base">
                      {item.label}
                    </h2>
                    <p className="mt-1 text-xs leading-relaxed text-slate-600">{item.description}</p>
                  </div>
                </div>
                <FiArrowRight
                  className="mt-1 h-4 w-4 shrink-0 text-slate-400 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:text-brand-600"
                  aria-hidden="true"
                />
              </Card>
            </Link>
          );
        })}
      </div>

      <AdSlot variant="native-card" label="Sponsored · Featured Cricket Destination" />

      <AdSlot variant="leaderboard" label="Sponsored · SportsEra Network" />
    </div>
  );
}
