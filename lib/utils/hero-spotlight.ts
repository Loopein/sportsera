import type { LiveMatch } from "@/types/match";

export type HeroSpotlightCategory = "recommended" | "big-tournament";

export type HeroSpotlightSlide = {
  match: LiveMatch;
  category: HeroSpotlightCategory;
  tagLabel: string;
  reasonLabel: string;
};

const BIG_TOURNAMENT_PATTERNS: RegExp[] = [
  /\buefa champions league\b|\bchampions league\b/i,
  /\basia cup\b/i,
  /\benglish premier league\b/i,
  /\bworld test championship\b/i,
  /\bnba finals\b/i,
  /\bwimbledon\b/i,
  /\bformula 1\b|\bmonaco grand prix\b/i,
  /\bfifa world cup\b/i,
  /\bpremier league t20\b/i,
  /\bmlb world series\b/i,
  /\bnhl stanley cup\b/i,
  /\bufc\b/i
];

function isBigTournament(seriesName: string): boolean {
  return BIG_TOURNAMENT_PATTERNS.some((pattern) => pattern.test(seriesName));
}

function getSportBucket(match: LiveMatch): "cricket" | "football" | "other" {
  const info = `${match.format} ${match.seriesName} ${match.teamA.name} ${match.teamB.name}`.toLowerCase();
  if (/\b(football|soccer|premier league|la liga|serie a|bundesliga|mls|champions league|fifa)\b/.test(info) && !/t20/.test(info)) {
    return "football";
  }
  if (/\b(t20|odi|test|cricket|asia cup|wtc|bgt)\b/.test(info)) {
    return "cricket";
  }
  return "other";
}

function getStartTimestamp(match: LiveMatch): number {
  const parsed = Date.parse(match.startAt ?? match.lastUpdatedAt ?? "");
  return Number.isNaN(parsed) ? Number.MAX_SAFE_INTEGER : parsed;
}

export function buildHeroSpotlightSlides(upcoming: LiveMatch[]): HeroSpotlightSlide[] {
  const upcomingOnly = upcoming
    .filter((match) => match.status === "upcoming")
    .sort((a, b) => getStartTimestamp(a) - getStartTimestamp(b));

  const bigTournamentPool = upcomingOnly.filter((match) => isBigTournament(match.seriesName));
  const selectedIds = new Set<string>();
  const bigSlides: HeroSpotlightSlide[] = [];
  const recommendedSlides: HeroSpotlightSlide[] = [];

  for (const match of bigTournamentPool) {
    if (bigSlides.length >= 4) break;
    if (selectedIds.has(match.id)) continue;
    selectedIds.add(match.id);
    bigSlides.push({
      match,
      category: "big-tournament",
      tagLabel: "Big Tournament · Starting Soon",
      reasonLabel: `Upcoming marquee fixture in ${match.seriesName}`
    });
  }

  const pickRecommended = (targetBucket?: "cricket" | "football" | "other") => {
    for (const match of upcomingOnly) {
      if (recommendedSlides.length >= 4) break;
      if (selectedIds.has(match.id)) continue;
      if (targetBucket && getSportBucket(match) !== targetBucket) continue;
      selectedIds.add(match.id);
      const bucket = getSportBucket(match);
      const bucketLabel =
        bucket === "cricket"
          ? "Cricket Pick"
          : bucket === "football"
            ? "Football Pick"
            : `${match.format || "Pro Sports"} Pick`;
      recommendedSlides.push({
        match,
        category: "recommended",
        tagLabel: "Recommended For You",
        reasonLabel: `${bucketLabel} · Upcoming matchup in ${match.seriesName}`
      });
    }
  };

  pickRecommended("cricket");
  pickRecommended("football");
  pickRecommended("other");
  pickRecommended();

  const interleaved: HeroSpotlightSlide[] = [];
  const maxLen = Math.max(bigSlides.length, recommendedSlides.length);
  for (let i = 0; i < maxLen; i++) {
    if (bigSlides[i]) interleaved.push(bigSlides[i]);
    if (recommendedSlides[i]) interleaved.push(recommendedSlides[i]);
  }

  return interleaved.slice(0, 8);
}
