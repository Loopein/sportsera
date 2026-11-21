"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { BiBroadcast } from "react-icons/bi";
import {
  FiActivity,
  FiArrowRight,
  FiClock,
  FiExternalLink,
  FiFilm,
  FiMapPin,
  FiRadio
} from "react-icons/fi";
import type { CommentaryItem, LiveMatch, MatchSummary } from "@/types/match";
import type { VideoPost } from "@/types/video";
import { SportsEraLogo, SportsEraPlayIcon } from "@/components/layout/SportsEraLogo";
import { MatchStatusBadge } from "@/components/live/MatchStatusBadge";
import { UpcomingCountdown } from "@/components/match/UpcomingCountdown";
import { Card } from "@/components/ui/card";
import { useMatch } from "@/hooks/useMatch";
import { formatTime, relativeTime } from "@/lib/utils/date";
import { getMatchRelatedVideos, parseVideoEmbed } from "@/lib/utils/video";

type SportsEraPlayerClientProps = {
  initialMatch: MatchSummary;
  initialCommentary: CommentaryItem[];
  videos: VideoPost[];
  liveStreams: LiveMatch[];
};

export function SportsEraPlayerClient({
  initialMatch,
  initialCommentary,
  videos,
  liveStreams
}: SportsEraPlayerClientProps): React.ReactElement {
  const { match } = useMatch(initialMatch, 7_000);
  const { matchRelated, otherVideos } = useMemo(
    () => getMatchRelatedVideos(match, videos),
    [match, videos]
  );

  const orderedVideos = useMemo(
    () => [...matchRelated, ...otherVideos],
    [matchRelated, otherVideos]
  );

  const [selectedVideoId, setSelectedVideoId] = useState<string>(
    () => orderedVideos[0]?.id ?? ""
  );
  const [stageMode, setStageMode] = useState<"video" | "stream">(
    () => (orderedVideos.length > 0 ? "video" : "stream")
  );

  const activeVideo =
    orderedVideos.find((video) => video.id === selectedVideoId) ?? orderedVideos[0] ?? null;

  const playableSource = activeVideo ? parseVideoEmbed(activeVideo.videoUrl) : null;
  const isLive = match.status === "live" || match.status === "innings_break";
  const isUpcoming = match.status === "upcoming";
  const startAt = match.startAt ?? match.lastUpdatedAt ?? new Date().toISOString();
  const otherLiveStreams = liveStreams.filter((item) => item.id !== match.id).slice(0, 8);

  return (
    <div className="space-y-5">
      <div className="grid gap-5 xl:grid-cols-[1.65fr_0.95fr]">
        {/* Main SportsEra Theater Player */}
        <Card as="section" variant="strong" className="overflow-hidden p-3.5 sm:p-5">
          <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-200/80">
            <div className="flex min-w-0 items-center gap-2.5">
              <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-slate-200/80 bg-slate-50/80">
                <SportsEraPlayIcon className="h-4 w-4" />
              </span>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-black uppercase tracking-wider text-slate-900 sm:text-sm">
                    SportsEra Player
                  </span>
                  <MatchStatusBadge status={match.status} />
                </div>
                <p className="truncate text-[11px] font-medium text-slate-500">
                  {match.seriesName} · {match.teamA.name} vs {match.teamB.name}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-1.5">
              <button
                type="button"
                onClick={() => setStageMode("stream")}
                className={`inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-xs font-bold transition ${
                  stageMode === "stream"
                    ? "border-brand-500 bg-brand-600 text-white"
                    : "border-slate-200/80 bg-slate-50/80 text-slate-700 hover:border-brand-300"
                }`}
              >
                <BiBroadcast className="h-3.5 w-3.5" aria-hidden="true" />
                <span>Live Stream Desk</span>
              </button>
              {activeVideo ? (
                <button
                  type="button"
                  onClick={() => setStageMode("video")}
                  className={`inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-xs font-bold transition ${
                    stageMode === "video"
                      ? "border-[#FF4D00] bg-[#FF4D00] text-white"
                      : "border-slate-200/80 bg-slate-50/80 text-slate-700 hover:border-[#FF4D00]/60"
                  }`}
                >
                  <FiFilm className="h-3.5 w-3.5" aria-hidden="true" />
                  <span>Match Video</span>
                </button>
              ) : null}
            </div>
          </div>

          {/* 16:9 Viewport */}
          <div className="mt-3 relative aspect-video w-full overflow-hidden rounded-xl border border-slate-200/80 bg-[#070b16] text-white shadow-inner">
            {stageMode === "video" && activeVideo && playableSource ? (
              playableSource.kind === "youtube" ? (
                <iframe
                  key={activeVideo.id}
                  src={playableSource.embedUrl}
                  title={activeVideo.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  className="h-full w-full border-0"
                />
              ) : playableSource.kind === "native" ? (
                <video
                  key={activeVideo.id}
                  src={playableSource.src}
                  poster={activeVideo.thumbnailUrl}
                  controls
                  playsInline
                  className="h-full w-full bg-black object-contain"
                />
              ) : (
                <div className="flex h-full flex-col items-center justify-center gap-3 p-6 text-center">
                  <SportsEraLogo theme="dark" />
                  <p className="max-w-md text-sm font-semibold text-slate-200">{activeVideo.title}</p>
                  <a
                    href={playableSource.href}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 rounded-xl bg-[#FF4D00] px-4 py-2 text-xs font-extrabold uppercase tracking-wider text-white transition hover:brightness-110"
                  >
                    <span>Open External Stream</span>
                    <FiExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
                  </a>
                </div>
              )
            ) : (
              /* Interactive SportsEra Live Stream Broadcast Studio */
              <div className="flex h-full flex-col justify-between bg-[radial-gradient(circle_at_top_right,rgba(255,77,0,0.22),transparent_48%),linear-gradient(135deg,#070b16_0%,#0f172a_55%,#131f3b_100%)] p-4 sm:p-6">
                <div className="flex items-center justify-between gap-2">
                  <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-[11px] font-extrabold uppercase tracking-wider text-white">
                    <FiRadio
                      className={`h-3.5 w-3.5 ${isLive ? "animate-pulse text-[#FF4D00]" : "text-sky-400"}`}
                      aria-hidden="true"
                    />
                    <span>
                      {isLive ? "Live Broadcast Feed" : isUpcoming ? "Pre-Match Stream Room" : "Match Replay Desk"}
                    </span>
                  </div>
                  <span className="rounded-md border border-white/15 bg-white/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-slate-200">
                    {match.format}
                  </span>
                </div>

                <div className="my-auto grid gap-4 py-2 sm:grid-cols-[1fr_auto_1fr] sm:items-center">
                  <div className="flex items-center justify-between gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-3 sm:flex-col sm:items-start sm:gap-1">
                    <span className="text-xs font-extrabold uppercase tracking-wider text-sky-300">
                      {match.teamA.shortName}
                    </span>
                    <p className="text-sm font-bold text-slate-200 truncate">{match.teamA.name}</p>
                    <p className="text-xl font-black tabular-nums text-white sm:text-2xl">
                      {match.teamA.score || (isUpcoming ? "TBD" : "-")}
                    </p>
                  </div>

                  <div className="mx-auto flex flex-col items-center gap-1 text-center">
                    <span className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[#FF4D00]/50 bg-[#FF4D00]/15">
                      <SportsEraPlayIcon className="h-5 w-5" />
                    </span>
                    <span className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-slate-300">
                      {isUpcoming ? "KICKOFF" : "LIVE"}
                    </span>
                  </div>

                  <div className="flex items-center justify-between gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-3 sm:flex-col sm:items-end sm:gap-1 sm:text-right">
                    <span className="text-xs font-extrabold uppercase tracking-wider text-indigo-300">
                      {match.teamB.shortName}
                    </span>
                    <p className="text-sm font-bold text-slate-200 truncate">{match.teamB.name}</p>
                    <p className="text-xl font-black tabular-nums text-white sm:text-2xl">
                      {match.teamB.score || (isUpcoming ? "TBD" : "-")}
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-white/10 bg-black/35 px-3.5 py-2 text-xs">
                  <div className="flex min-w-0 items-center gap-2 text-slate-100">
                    {isUpcoming ? (
                      <>
                        <FiClock className="h-3.5 w-3.5 shrink-0 text-[#FF4D00]" aria-hidden="true" />
                        <UpcomingCountdown
                          startAt={startAt}
                          fallbackValue={`Starts ${formatTime(startAt)}`}
                          valueClassName="tabular-nums font-bold text-white"
                        />
                      </>
                    ) : (
                      <>
                        <BiBroadcast className="h-3.5 w-3.5 shrink-0 text-[#FF4D00]" aria-hidden="true" />
                        <span className="truncate font-semibold">
                          {match.resultText || `${match.seriesName} live coverage`}
                        </span>
                      </>
                    )}
                  </div>
                  <span className="inline-flex items-center gap-1 text-[11px] text-slate-300">
                    <FiMapPin className="h-3 w-3 shrink-0" aria-hidden="true" />
                    <span className="truncate max-w-[180px]">{match.venue}</span>
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Synchronized Live Scoreboard Strip Beneath Video */}
          <div className="mt-3 rounded-xl border border-slate-200/80 bg-white/90 p-3">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex min-w-0 flex-wrap items-center gap-2.5">
                <span className="text-sm font-black text-slate-900">
                  {match.teamA.shortName}{" "}
                  <span className="tabular-nums text-brand-700">{match.teamA.score || "-"}</span>
                </span>
                <span className="text-xs font-extrabold uppercase text-slate-400">vs</span>
                <span className="text-sm font-black text-slate-900">
                  {match.teamB.shortName}{" "}
                  <span className="tabular-nums text-indigo-700">{match.teamB.score || "-"}</span>
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                {match.lastUpdatedAt ? (
                  <span className="text-[11px] font-medium text-slate-500">
                    Synced {relativeTime(match.lastUpdatedAt)}
                  </span>
                ) : null}
                <Link
                  href={isUpcoming ? `/matches/${match.id}/squads` : `/matches/${match.id}/scorecard`}
                  className="inline-flex items-center gap-1 rounded-lg border border-slate-200/80 bg-slate-50/80 px-2.5 py-1 text-xs font-bold text-slate-700 transition hover:border-brand-300 hover:text-brand-700"
                >
                  <FiActivity className="h-3.5 w-3.5" aria-hidden="true" />
                  <span>{isUpcoming ? "Squads" : "Full Scorecard"}</span>
                </Link>
              </div>
            </div>

            {activeVideo && stageMode === "video" ? (
              <div className="mt-2 border-t border-slate-200/70 pt-2">
                <h2 className="text-sm font-extrabold text-slate-900 sm:text-base">{activeVideo.title}</h2>
                {activeVideo.description ? (
                  <p className="mt-0.5 text-xs text-slate-600">{activeVideo.description}</p>
                ) : null}
              </div>
            ) : null}
          </div>

          {/* Live Commentary Ticker Feed */}
          {initialCommentary.length > 0 ? (
            <div className="mt-3 rounded-xl border border-slate-200/80 bg-slate-50/80 p-3">
              <div className="flex items-center justify-between gap-2">
                <p className="inline-flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-wider text-slate-700">
                  <BiBroadcast className="h-3.5 w-3.5 text-red-600 animate-pulse-soft" aria-hidden="true" />
                  Live Play-by-Play Ticker
                </p>
                <Link
                  href={`/matches/${match.id}/commentary`}
                  className="subtle-link inline-flex items-center gap-1 text-xs"
                >
                  All commentary
                  <FiArrowRight className="h-3 w-3" aria-hidden="true" />
                </Link>
              </div>
              <ul className="mt-2 space-y-1.5">
                {initialCommentary.slice(0, 3).map((item) => (
                  <li
                    key={item.id}
                    className="flex items-start gap-2 rounded-lg border border-slate-200/70 bg-white/90 px-2.5 py-1.5 text-xs"
                  >
                    <span className="shrink-0 rounded bg-brand-50 px-1.5 py-0.5 text-[10px] font-black tabular-nums text-brand-700">
                      {item.over}.{item.ball}
                    </span>
                    <span className="text-slate-700">{item.text}</span>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </Card>

        {/* Right Column: Match Related Videos & Playlist */}
        <Card as="aside" variant="strong" className="flex flex-col p-3.5 sm:p-5">
          <div className="flex items-center justify-between gap-2 pb-3 border-b border-slate-200/80">
            <div className="inline-flex items-center gap-2">
              <FiFilm className="h-4 w-4 text-[#FF4D00]" aria-hidden="true" />
              <h2 className="text-sm font-extrabold uppercase tracking-wider text-slate-900">
                Match Related Videos
              </h2>
            </div>
            <span className="score-pill">{orderedVideos.length} videos</span>
          </div>

          {orderedVideos.length > 0 ? (
            <div className="mt-3 space-y-2.5 overflow-y-auto pr-0.5 max-h-[540px]">
              {orderedVideos.map((video, index) => {
                const isSelected = activeVideo?.id === video.id && stageMode === "video";
                const isDirectMatch = index < matchRelated.length;
                return (
                  <button
                    key={video.id}
                    type="button"
                    onClick={() => {
                      setSelectedVideoId(video.id);
                      setStageMode("video");
                    }}
                    className={`group flex w-full items-start gap-3 rounded-xl border p-2.5 text-left transition ${
                      isSelected
                        ? "border-[#FF4D00]/70 bg-brand-50/70 shadow-sm"
                        : "border-slate-200/80 bg-white/90 hover:border-brand-300"
                    }`}
                  >
                    <div className="relative flex h-16 w-28 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-slate-200/80 bg-slate-900">
                      {video.thumbnailUrl ? (
                        <img
                          src={video.thumbnailUrl}
                          alt={video.title}
                          className="h-full w-full object-cover opacity-85 transition duration-300 group-hover:scale-105"
                        />
                      ) : null}
                      <span className="absolute inline-flex h-7 w-7 items-center justify-center rounded-full bg-slate-900/80 shadow">
                        <SportsEraPlayIcon className="h-3.5 w-3.5" />
                      </span>
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5">
                        {isSelected ? (
                          <span className="rounded bg-[#FF4D00] px-1.5 py-0.5 text-[9px] font-extrabold uppercase tracking-wider text-white">
                            Playing
                          </span>
                        ) : isDirectMatch ? (
                          <span className="rounded bg-brand-50 px-1.5 py-0.5 text-[9px] font-extrabold uppercase tracking-wider text-brand-700 ring-1 ring-brand-200/80">
                            Match Video
                          </span>
                        ) : (
                          <span className="rounded bg-slate-50 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-slate-600 ring-1 ring-slate-200">
                            Highlight
                          </span>
                        )}
                      </div>
                      <p className="mt-1 line-clamp-2 text-xs font-extrabold leading-snug text-slate-900">
                        {video.title}
                      </p>
                      <p className="mt-0.5 truncate text-[11px] text-slate-500">
                        {video.description}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="my-auto rounded-xl border border-dashed border-slate-200 bg-white/80 p-6 text-center">
              <SportsEraPlayIcon className="mx-auto h-6 w-6" />
              <p className="mt-2 text-sm font-bold text-slate-800">No match clips uploaded yet</p>
              <p className="mt-1 text-xs text-slate-500">
                Use Live Stream Desk to follow real-time match play and commentary.
              </p>
            </div>
          )}
        </Card>
      </div>

      {/* Live Channel Switcher Strip */}
      {otherLiveStreams.length > 0 ? (
        <Card as="section" className="p-4 sm:p-5">
          <div className="flex flex-wrap items-center justify-between gap-2 pb-3">
            <div className="inline-flex items-center gap-2">
              <BiBroadcast className="h-4 w-4 text-red-600 animate-pulse-soft" aria-hidden="true" />
              <h2 className="text-sm font-extrabold uppercase tracking-wider text-slate-900">
                Live Streams On Now
              </h2>
            </div>
            <Link href="/live" className="subtle-link inline-flex items-center gap-1 text-xs">
              All live streams
              <FiArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
            </Link>
          </div>
          <div className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-4">
            {otherLiveStreams.map((liveItem) => (
              <Link
                key={liveItem.id}
                href={`/matches/${liveItem.id}/watch`}
                className="group flex items-center justify-between gap-2.5 rounded-xl border border-slate-200/80 bg-white/90 p-3 transition hover:border-[#FF4D00]/60"
              >
                <div className="min-w-0">
                  <p className="truncate text-[10px] font-extrabold uppercase tracking-wider text-brand-700">
                    {liveItem.seriesName}
                  </p>
                  <p className="mt-0.5 truncate text-xs font-extrabold text-slate-900">
                    {liveItem.teamA.shortName} vs {liveItem.teamB.shortName}
                  </p>
                  <p className="truncate text-[11px] font-semibold tabular-nums text-slate-600">
                    {liveItem.teamA.score || "-"} · {liveItem.teamB.score || "-"}
                  </p>
                </div>
                <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-slate-200/80 bg-slate-50/80 transition group-hover:scale-105 group-hover:border-[#FF4D00]/60">
                  <SportsEraPlayIcon className="h-3.5 w-3.5" />
                </span>
              </Link>
            ))}
          </div>
        </Card>
      ) : null}
    </div>
  );
}
