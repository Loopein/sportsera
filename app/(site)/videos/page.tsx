import type { Metadata } from "next";
import Link from "next/link";
import { BiBroadcast } from "react-icons/bi";
import { FiArrowRight, FiFilm } from "react-icons/fi";
import { SportsEraPlayIcon } from "@/components/layout/SportsEraLogo";
import { AdSlot } from "@/components/shared/AdSlot";
import { Card } from "@/components/ui/card";
import { getLiveMatches, getVideoPosts } from "@/lib/api/read";

export const revalidate = 10;

export const metadata: Metadata = {
  title: "Videos & Live Streams",
  description: "Live match streams, highlights, and tactical breakdowns on SportsEra Player."
};

export default async function VideosPage(): Promise<React.ReactElement> {
  const [videos, liveMatches] = await Promise.all([getVideoPosts(), getLiveMatches()]);
  const spotlightMatchId = liveMatches[0]?.id;

  return (
    <div className="space-y-6">
      <Card as="section" variant="strong" className="page-hero-card p-4 sm:p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-200/80 bg-slate-50/80">
              <SportsEraPlayIcon className="h-5 w-5" />
            </span>
            <div>
              <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
                SportsEra Player &amp; Video Hub
              </h1>
              <p className="mt-1 text-sm text-slate-600">
                Watch live broadcast desks, match highlights, and multi-sport clips directly in SportsEra Player.
              </p>
            </div>
          </div>
          {spotlightMatchId ? (
            <Link
              href={`/matches/${spotlightMatchId}/watch`}
              className="inline-flex items-center gap-2 rounded-xl bg-[#FF4D00] px-4 py-2 text-xs font-extrabold uppercase tracking-wider text-white shadow-sm transition hover:brightness-110"
            >
              <BiBroadcast className="h-4 w-4 animate-pulse-soft" aria-hidden="true" />
              <span>Open Live Player</span>
            </Link>
          ) : (
            <span className="score-pill">{videos.length} videos</span>
          )}
        </div>
      </Card>

      {liveMatches.length > 0 ? (
        <section className="space-y-3">
          <div className="flex items-center justify-between gap-2">
            <h2 className="inline-flex items-center gap-2 text-base font-extrabold text-slate-900">
              <BiBroadcast className="h-4 w-4 text-red-600 animate-pulse-soft" aria-hidden="true" />
              Live Streams Now
            </h2>
            <Link href="/live" className="subtle-link inline-flex items-center gap-1 text-sm">
              All live
              <FiArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {liveMatches.slice(0, 8).map((match) => (
              <Link
                key={match.id}
                href={`/matches/${match.id}/watch`}
                className="group"
              >
                <Card className="flex items-center justify-between gap-3 p-3.5 transition hover:border-[#FF4D00]/60">
                  <div className="min-w-0">
                    <p className="truncate text-[10px] font-extrabold uppercase tracking-wider text-brand-700">
                      {match.seriesName}
                    </p>
                    <p className="mt-0.5 truncate text-sm font-extrabold text-slate-900">
                      {match.teamA.shortName} vs {match.teamB.shortName}
                    </p>
                    <p className="truncate text-xs font-semibold tabular-nums text-slate-600">
                      {match.teamA.score || "-"} · {match.teamB.score || "-"}
                    </p>
                  </div>
                  <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-slate-200/80 bg-slate-50/80 transition group-hover:scale-105">
                    <SportsEraPlayIcon className="h-4 w-4" />
                  </span>
                </Card>
              </Link>
            ))}
          </div>
        </section>
      ) : null}

      <section className="space-y-3">
        <div className="flex items-center justify-between gap-2">
          <h2 className="inline-flex items-center gap-2 text-base font-extrabold text-slate-900">
            <FiFilm className="h-4 w-4 text-[#FF4D00]" aria-hidden="true" />
            Featured Match Videos
          </h2>
          <span className="score-pill">{videos.length} clips</span>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {videos.map((video) => {
            const watchHref = spotlightMatchId ? `/matches/${spotlightMatchId}/watch` : "/matches";
            return (
              <Link key={video.id} href={watchHref} className="group block min-w-0">
                <Card className="flex h-full flex-col justify-between gap-3 p-4 transition hover:border-[#FF4D00]/60">
                  <div className="space-y-2.5">
                    <div className="relative flex aspect-video items-center justify-center overflow-hidden rounded-xl border border-slate-200/80 bg-slate-900">
                      {video.thumbnailUrl ? (
                        <img
                          src={video.thumbnailUrl}
                          alt={video.title}
                          className="h-full w-full object-cover opacity-85 transition duration-300 group-hover:scale-105"
                        />
                      ) : null}
                      <span className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-slate-900/80 shadow-lg transition group-hover:scale-110">
                        <SportsEraPlayIcon className="h-5 w-5" />
                      </span>
                    </div>
                    <div>
                      <h3 className="line-clamp-2 text-sm font-extrabold text-slate-900 sm:text-base">
                        {video.title}
                      </h3>
                      <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-slate-600">
                        {video.description}
                      </p>
                    </div>
                  </div>
                  <span className="inline-flex w-fit items-center gap-1.5 text-xs font-bold text-[#FF4D00]">
                    <SportsEraPlayIcon className="h-3.5 w-3.5" />
                    <span>Watch in SportsEra Player</span>
                  </span>
                </Card>
              </Link>
            );
          })}
        </div>
      </section>

      <AdSlot variant="native-card" label="Sponsored · Match Highlights Partner" />
      <AdSlot variant="leaderboard" label="Sponsored · Video Hub" />
    </div>
  );
}
