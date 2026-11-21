import type { MatchSummary } from "@/types/match";
import type { VideoPost } from "@/types/video";

export type PlayableVideoSource =
  | { kind: "youtube"; videoId: string; embedUrl: string }
  | { kind: "native"; src: string }
  | { kind: "external"; href: string };

export function extractYouTubeId(rawUrl: string): string | null {
  try {
    const parsed = new URL(rawUrl);
    const host = parsed.hostname.replace(/^www\./, "").toLowerCase();

    if (host === "youtu.be") {
      const id = parsed.pathname.split("/").filter(Boolean)[0];
      return id && /^[\w-]{6,}$/.test(id) ? id : null;
    }

    if (host === "youtube.com" || host === "m.youtube.com" || host === "youtube-nocookie.com") {
      const vParam = parsed.searchParams.get("v");
      if (vParam && /^[\w-]{6,}$/.test(vParam)) return vParam;

      const segments = parsed.pathname.split("/").filter(Boolean);
      if ((segments[0] === "embed" || segments[0] === "live" || segments[0] === "shorts") && segments[1]) {
        return /^[\w-]{6,}$/.test(segments[1]) ? segments[1] : null;
      }
    }
  } catch {
    return null;
  }
  return null;
}

export function parseVideoEmbed(rawUrl: string): PlayableVideoSource {
  const trimmed = rawUrl.trim();
  const youtubeId = extractYouTubeId(trimmed);
  if (youtubeId) {
    return {
      kind: "youtube",
      videoId: youtubeId,
      embedUrl: `https://www.youtube.com/embed/${youtubeId}?rel=0&modestbranding=1&playsinline=1`
    };
  }

  if (/\.(mp4|webm|ogg|m3u8)(\?.*)?$/i.test(trimmed)) {
    return { kind: "native", src: trimmed };
  }

  return { kind: "external", href: trimmed };
}

function buildMatchKeywords(match: MatchSummary): string[] {
  const rawTokens = [
    match.teamA.name,
    match.teamA.shortName,
    match.teamB.name,
    match.teamB.shortName,
    match.seriesName,
    match.format
  ]
    .join(" ")
    .toLowerCase()
    .split(/[^a-z0-9]+/)
    .filter((token) => token.length >= 2 && !new Set(["the", "cup", "vs", "2026", "2025", "fc"]).has(token));

  return [...new Set(rawTokens)];
}

export function getMatchRelatedVideos(
  match: MatchSummary,
  videos: VideoPost[]
): { matchRelated: VideoPost[]; otherVideos: VideoPost[] } {
  const keywords = buildMatchKeywords(match);

  const scored = videos.map((video) => {
    const haystack = `${video.title} ${video.description}`.toLowerCase();
    let score = 0;

    if (
      haystack.includes(match.teamA.name.toLowerCase()) ||
      haystack.includes(match.teamB.name.toLowerCase())
    ) {
      score += 10;
    }
    if (haystack.includes(match.seriesName.toLowerCase())) {
      score += 6;
    }
    if (match.format && haystack.includes(match.format.toLowerCase())) {
      score += 4;
    }
    for (const token of keywords) {
      if (haystack.includes(token)) {
        score += 2;
      }
    }

    return { video, score };
  });

  scored.sort((a, b) => b.score - a.score);

  const matchRelated = scored.filter((entry) => entry.score > 0).map((entry) => entry.video);
  const otherVideos = scored.filter((entry) => entry.score === 0).map((entry) => entry.video);

  return {
    matchRelated: matchRelated.length ? matchRelated : videos.slice(0, 4),
    otherVideos: matchRelated.length ? otherVideos : videos.slice(4)
  };
}
