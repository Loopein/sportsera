import { describe, expect, it } from "vitest";
import type { LiveMatch } from "@/types/match";
import { buildHeroSpotlightSlides } from "@/lib/utils/hero-spotlight";

function makeMatch(overrides: Partial<LiveMatch> & { id: string }): LiveMatch {
  return {
    slug: overrides.id,
    status: "upcoming",
    format: "ODI",
    seriesName: "Asia Cup 2026",
    venue: "Dhaka",
    teamA: { id: "a", name: "India", shortName: "IND" },
    teamB: { id: "b", name: "Australia", shortName: "AUS" },
    summary: "Upcoming",
    startAt: "2026-11-23T12:00:00Z",
    lastUpdatedAt: "2026-11-22T00:00:00Z",
    ...overrides
  };
}

describe("hero spotlight slide curation", () => {
  it("shows only upcoming matches and excludes live or completed games", () => {
    const matches: LiveMatch[] = [
      makeMatch({ id: "live-1", status: "live", seriesName: "UEFA Champions League", format: "Football" }),
      makeMatch({ id: "comp-1", status: "completed", seriesName: "Asia Cup 2026", format: "ODI" }),
      makeMatch({ id: "u1", status: "upcoming", seriesName: "UEFA Champions League", format: "Football", startAt: "2026-11-22T15:00:00Z", teamA: { id: "psg", name: "Paris Saint-Germain", shortName: "PSG" }, teamB: { id: "int", name: "Inter Milan", shortName: "INT" } }),
      makeMatch({ id: "u2", status: "upcoming", seriesName: "Premier League T20 2026", format: "T20", startAt: "2026-11-22T16:00:00Z" }),
      makeMatch({ id: "u3", status: "upcoming", seriesName: "NBA Finals · Game 7", format: "Basketball", startAt: "2026-11-22T18:00:00Z", teamA: { id: "bos", name: "Boston Celtics", shortName: "BOS" }, teamB: { id: "lal", name: "LA Lakers", shortName: "LAL" } }),
      makeMatch({ id: "u4", status: "upcoming", seriesName: "English Premier League", format: "Football", startAt: "2026-11-22T20:00:00Z", teamA: { id: "ars", name: "Arsenal FC", shortName: "ARS" }, teamB: { id: "liv", name: "Liverpool FC", shortName: "LIV" } }),
      makeMatch({ id: "u5", status: "upcoming", seriesName: "Asia Cup 2026", format: "ODI", startAt: "2026-11-23T06:00:00Z" }),
      makeMatch({ id: "u6", status: "upcoming", seriesName: "Wanda Diamond League", format: "Athletics", startAt: "2026-11-23T14:00:00Z", teamA: { id: "ust", name: "USA Track", shortName: "UST" }, teamB: { id: "jam", name: "Jamaica Track", shortName: "JAM" } })
    ];

    const slides = buildHeroSpotlightSlides(matches);
    expect(slides.length).toBe(6);
    expect(slides.every((s) => s.match.status === "upcoming")).toBe(true);
    expect(slides.some((s) => s.match.id === "live-1" || s.match.id === "comp-1")).toBe(false);
    expect(slides.some((s) => s.category === "big-tournament")).toBe(true);
    expect(slides.some((s) => s.category === "recommended")).toBe(true);
    expect(new Set(slides.map((s) => s.match.id)).size).toBe(6);
  });
});
