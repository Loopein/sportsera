import { describe, expect, it } from "vitest";
import {
  getLiveMatches,
  getMatches,
  getMatchCommentary,
  getMatchScorecard,
  getMatchStats,
  getMatchSummary,
  getNews,
  getPlayer,
  getPlayers,
  getRankings,
  getSeries,
  getSeriesById,
  getStandingsSeasons,
  getTeam,
  getTeams,
  getTournamentPlayerStats,
  search
} from "@/lib/api/read";

describe("read API queries against database", () => {
  it("resolves home, match, team, player, series, standings, news, stats, and search queries without schema errors", async () => {
    const [
      live,
      allMatches,
      upcoming,
      completed,
      summary,
      scorecard,
      commentary,
      stats,
      series,
      teams,
      players,
      rankings,
      standings,
      news,
      tStats
    ] = await Promise.all([
      getLiveMatches(),
      getMatches(),
      getMatches("upcoming"),
      getMatches("completed"),
      getMatchSummary("match-1001"),
      getMatchScorecard("match-1001"),
      getMatchCommentary("match-1001"),
      getMatchStats("match-1001"),
      getSeries(),
      getTeams(),
      getPlayers(),
      getRankings(),
      getStandingsSeasons(),
      getNews(),
      getTournamentPlayerStats()
    ]);

    expect(live.length).toBeGreaterThan(0);
    expect(allMatches.length).toBeGreaterThanOrEqual(live.length);
    expect(Array.isArray(upcoming)).toBe(true);
    expect(Array.isArray(completed)).toBe(true);
    expect(summary?.id).toBe("match-1001");
    expect(summary?.teamA.shortName).toBeTruthy();
    expect(summary?.teamB.shortName).toBeTruthy();
    expect(scorecard === null || Array.isArray(scorecard.innings)).toBe(true);
    expect(Array.isArray(commentary)).toBe(true);
    expect(stats === null || typeof stats.runRate === "number").toBe(true);
    expect(series.length).toBeGreaterThan(0);
    expect(teams.length).toBeGreaterThan(0);
    expect(players.length).toBeGreaterThan(0);
    expect(Array.isArray(rankings)).toBe(true);
    expect(Array.isArray(standings)).toBe(true);
    expect(news.length).toBeGreaterThan(0);
    expect(tStats.length).toBeGreaterThan(0);

    const [seriesById, teamInd, playerKohli, searchIndia, searchKohli] = await Promise.all([
      getSeriesById(series[0].id),
      getTeam("team-ind"),
      getPlayer("player-kohli"),
      search("india"),
      search("kohli")
    ]);

    expect(seriesById?.series.id).toBe(series[0].id);
    expect(teamInd?.id).toBe("team-ind");
    expect(playerKohli?.name).toBe("Virat Kohli");
    expect(searchIndia.some((item) => item.type === "match" && item.label.includes("IND vs"))).toBe(true);
    expect(searchKohli.some((item) => item.type === "player" && item.label === "Virat Kohli")).toBe(true);
  });
});
