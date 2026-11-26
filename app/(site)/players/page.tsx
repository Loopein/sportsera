import type { Metadata } from "next";
import Link from "next/link";
import { FiArrowRight, FiAward, FiUser } from "react-icons/fi";
import { JsonLd } from "@/components/seo/JsonLd";
import { AdSlot } from "@/components/shared/AdSlot";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/shared/EmptyState";
import { getPlayers } from "@/lib/api/read";
import { buildBreadcrumbJsonLd, buildCollectionPageJsonLd } from "@/lib/seo/jsonld";
import { buildPageMetadata } from "@/lib/seo/metadata";

export const revalidate = 60;

export const metadata: Metadata = buildPageMetadata({
  title: "Players & Athlete Directory",
  description: "Athlete profiles, roles, playing styles, career statistics, and recent form across sports.",
  path: "/players",
  keywords: ["players", "athlete profiles", "career stats", "recent form"]
});

function getInitials(name: string): string {
  return (
    name
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase())
      .join("") || "PL"
  );
}

export default async function PlayersPage(): Promise<React.ReactElement> {
  const players = await getPlayers();

  return (
    <div className="space-y-6">
      <JsonLd
        data={[
          buildCollectionPageJsonLd({
            name: "Players & Athlete Directory",
            description: "Athlete profiles, roles, playing styles, career statistics, and recent form.",
            path: "/players"
          }),
          buildBreadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "Players", path: "/players" }
          ])
        ]}
      />
      <Card as="section" variant="strong" className="page-hero-card p-4 sm:p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-700 ring-1 ring-brand-200/80">
              <FiAward className="h-5 w-5" aria-hidden="true" />
            </span>
            <div className="min-w-0">
              <p className="text-xs font-extrabold uppercase tracking-wider text-brand-700">
                All-Sports Athlete Directory
              </p>
              <h1 className="mt-0.5 text-2xl font-black tracking-tight text-slate-900 sm:text-3xl">Players</h1>
              <p className="mt-1 text-sm text-slate-600">
                Athlete profiles, roles, playing styles, career statistics, and recent form across all sports.
              </p>
            </div>
          </div>
          <span className="score-pill">{players.length} players</span>
        </div>
      </Card>

      <AdSlot variant="in-feed" label="Sponsored · Players Hub" />

      {players.length ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {players.map((player) => (
            <Link
              key={player.id}
              href={`/players/${player.id}`}
              className="group block min-w-0 rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
            >
              <Card
                as="article"
                interactive
                className="flex h-full flex-col justify-between p-4 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:border-brand-300 group-hover:shadow-lg sm:p-5"
              >
                <div>
                  <div className="flex items-center gap-3.5">
                    <span className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-brand-200 bg-brand-50 text-sm font-black text-brand-700 shadow-sm">
                      {getInitials(player.name)}
                    </span>
                    <div className="min-w-0">
                      <p className="truncate text-lg font-extrabold text-slate-900 group-hover:text-brand-700">
                        {player.name}
                      </p>
                      <span className="inline-flex items-center gap-1 rounded-full bg-brand-50 px-2.5 py-0.5 text-[11px] font-bold text-brand-700">
                        <FiUser className="h-3 w-3" aria-hidden="true" />
                        {player.role}
                      </span>
                    </div>
                  </div>

                  <div className="mt-4 space-y-1.5 rounded-xl bg-slate-50/90 p-3 text-xs text-slate-600">
                    <p className="flex items-center justify-between gap-2">
                      <span className="font-semibold text-slate-500">Batting</span>
                      <span className="truncate font-bold text-slate-800">{player.battingStyle ?? "-"}</span>
                    </p>
                    <p className="flex items-center justify-between gap-2">
                      <span className="font-semibold text-slate-500">Bowling</span>
                      <span className="truncate font-bold text-slate-800">{player.bowlingStyle ?? "-"}</span>
                    </p>
                  </div>

                  {player.recentForm.length ? (
                    <div className="mt-3 flex flex-wrap items-center gap-1.5">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Form:</span>
                      {player.recentForm.slice(0, 4).map((item, idx) => (
                        <span
                          key={`${player.id}-form-${idx}`}
                          className="rounded-md border border-slate-200 bg-white px-2 py-0.5 text-[11px] font-bold tabular-nums text-slate-700"
                        >
                          {item}
                        </span>
                      ))}
                    </div>
                  ) : null}
                </div>

                <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3 text-xs font-bold uppercase tracking-wider text-brand-700">
                  <span>View Career Profile</span>
                  <FiArrowRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-1" aria-hidden="true" />
                </div>
              </Card>
            </Link>
          ))}
        </div>
      ) : (
        <EmptyState title="No players available" description="Player profiles will appear here once added." />
      )}
      <AdSlot variant="leaderboard" label="Sponsored · Player Directory" />
    </div>
  );
}
