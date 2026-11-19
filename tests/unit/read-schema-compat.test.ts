import { beforeEach, describe, expect, it, vi } from "vitest";

describe("lib/api/read schema compatibility", () => {
  beforeEach(() => {
    vi.resetModules();
  });

  it("adapts when teams lack logo/captain/coach, players use full_name, and matches use home/away + snapshots", async () => {
    const queryMock = vi.fn(async (sql: string) => {
      if (sql.includes("FROM information_schema.columns")) {
        return [
          { table_name: "teams", column_name: "id" },
          { table_name: "teams", column_name: "name" },
          { table_name: "teams", column_name: "short_name" },
          { table_name: "teams", column_name: "home_ground" },
          { table_name: "players", column_name: "id" },
          { table_name: "players", column_name: "team_id" },
          { table_name: "players", column_name: "full_name" },
          { table_name: "players", column_name: "role" },
          { table_name: "matches", column_name: "id" },
          { table_name: "matches", column_name: "tournament_id" },
          { table_name: "matches", column_name: "home_team_id" },
          { table_name: "matches", column_name: "away_team_id" },
          { table_name: "matches", column_name: "scheduled_at" },
          { table_name: "matches", column_name: "venue" },
          { table_name: "matches", column_name: "status" },
          { table_name: "tournaments", column_name: "id" },
          { table_name: "tournaments", column_name: "name" },
          { table_name: "tournaments", column_name: "season" },
          { table_name: "tournaments", column_name: "format" },
          { table_name: "match_snapshots", column_name: "match_id" },
          { table_name: "match_snapshots", column_name: "innings" },
          { table_name: "match_snapshots", column_name: "runs" },
          { table_name: "match_snapshots", column_name: "wickets" },
          { table_name: "match_snapshots", column_name: "state" },
          { table_name: "match_snapshots", column_name: "updated_at" },
          { table_name: "commentary", column_name: "id" },
          { table_name: "commentary", column_name: "match_id" },
          { table_name: "commentary", column_name: "over_number" },
          { table_name: "commentary", column_name: "ball_in_over" },
          { table_name: "commentary", column_name: "message" },
          { table_name: "commentary", column_name: "created_at" }
        ];
      }

      if (sql.includes("FROM matches m")) {
        expect(sql).not.toContain("ta.logo");
        expect(sql).not.toContain("tb.logo");
        expect(sql).toContain("m.home_team_id");
        expect(sql).toContain("m.away_team_id");
        return [
          {
            id: "match-1001",
            slug: "match-1001",
            status: "live",
            format: "ODI",
            series_name: "Asia Cup 2026",
            venue: "Dhaka",
            toss: null,
            summary: null,
            result_text: null,
            start_at: "2026-03-14T19:15:11.000Z",
            last_updated_at: "2026-03-14T19:35:11.000Z",
            current_run_rate: null,
            required_run_rate: null,
            target: null,
            overs: null,
            team_a_score: null,
            team_b_score: null,
            team_a_id: "team-ind",
            team_a_name: "India",
            team_a_short_name: "IND",
            team_a_logo: null,
            team_b_id: "team-aus",
            team_b_name: "Australia",
            team_b_short_name: "AUS",
            team_b_logo: null,
            snap_innings: 2,
            snap_runs: 221,
            snap_wickets: 4,
            snap_state: {
              overs: "39.1",
              target: 279,
              innings: 2,
              currentRunRate: 5.65,
              requiredRunRate: 5.35
            }
          }
        ];
      }

      if (sql.includes("FROM teams")) {
        expect(sql).not.toContain("SELECT id, name, short_name, logo");
        return [
          {
            id: "team-ind",
            name: "India",
            short_name: "IND",
            logo: null,
            home_ground: "Wankhede",
            captain: null,
            coach: null
          }
        ];
      }

      if (sql.includes("FROM players")) {
        expect(sql).toContain("full_name AS name");
        return [
          {
            id: "player-kohli",
            name: "Virat Kohli",
            team_id: "team-ind",
            role: "Batter",
            batting_style: null,
            bowling_style: null,
            image: null
          }
        ];
      }

      if (sql.includes("FROM commentary")) {
        return [
          {
            id: "c-1",
            over_number: 12,
            ball_in_over: 3,
            message: "Driven through covers for four",
            created_at: "2026-03-14T19:35:11.000Z"
          }
        ];
      }

      if (sql.includes("FROM match_snapshots")) {
        return [
          {
            match_id: "match-1001",
            state: { currentRunRate: 5.65, requiredRunRate: 5.35 }
          }
        ];
      }

      return [];
    });

    vi.doMock("@/lib/db", () => ({ query: queryMock }));

    const read = await import("@/lib/api/read");
    const live = await read.getLiveMatches();
    expect(live).toHaveLength(1);
    expect(live[0].teamA.score).toBe("221/4 (39.1)");
    expect(live[0].teamB.score).toBe("278 (1st inn)");
    expect(live[0].summary).toBe("Need 58 runs to win (Target 279)");

    const summary = await read.getMatchSummary("match-1001");
    expect(summary?.currentRunRate).toBe(5.65);
    expect(summary?.requiredRunRate).toBe(5.35);

    const scorecard = await read.getMatchScorecard("match-1001");
    expect(scorecard).toBeNull();

    const commentary = await read.getMatchCommentary("match-1001");
    expect(commentary).toHaveLength(1);
    expect(commentary[0].over).toBe("12");
    expect(commentary[0].ball).toBe("3");

    const stats = await read.getMatchStats("match-1001");
    expect(stats?.runRate).toBe(5.65);
    expect(stats?.requiredRunRate).toBe(5.35);

    const team = await read.getTeam("team-ind");
    expect(team?.name).toBe("India");
    expect(team?.logo).toBeUndefined();

    const player = await read.getPlayer("player-kohli");
    expect(player?.name).toBe("Virat Kohli");
  });

  it("uses schema.sql columns and sub-tables when present", async () => {
    const queryMock = vi.fn(async (sql: string) => {
      if (sql.includes("FROM information_schema.columns")) {
        return [
          { table_name: "teams", column_name: "id" },
          { table_name: "teams", column_name: "name" },
          { table_name: "teams", column_name: "short_name" },
          { table_name: "teams", column_name: "logo" },
          { table_name: "teams", column_name: "home_ground" },
          { table_name: "teams", column_name: "captain" },
          { table_name: "teams", column_name: "coach" },
          { table_name: "matches", column_name: "id" },
          { table_name: "matches", column_name: "slug" },
          { table_name: "matches", column_name: "status" },
          { table_name: "matches", column_name: "format" },
          { table_name: "matches", column_name: "series_name" },
          { table_name: "matches", column_name: "venue" },
          { table_name: "matches", column_name: "team_a_id" },
          { table_name: "matches", column_name: "team_b_id" },
          { table_name: "matches", column_name: "team_a_score" },
          { table_name: "matches", column_name: "team_b_score" },
          { table_name: "matches", column_name: "start_at" },
          { table_name: "matches", column_name: "last_updated_at" }
        ];
      }

      if (sql.includes("FROM matches m")) {
        expect(sql).toContain("ta.logo AS team_a_logo");
        expect(sql).toContain("tb.logo AS team_b_logo");
        return [
          {
            id: "match-2001",
            slug: "match-2001",
            status: "live",
            format: "T20",
            series_name: "Premier League 2026",
            venue: "Lord's",
            toss: null,
            summary: "England lead",
            result_text: null,
            start_at: null,
            last_updated_at: "2026-03-14T19:00:00.000Z",
            current_run_rate: "8.80",
            required_run_rate: null,
            target: null,
            overs: "20.0",
            team_a_score: "176/7 (20)",
            team_b_score: null,
            team_a_id: "team-eng",
            team_a_name: "England",
            team_a_short_name: "ENG",
            team_a_logo: "/images/teams/eng.png",
            team_b_id: "team-sa",
            team_b_name: "South Africa",
            team_b_short_name: "SA",
            team_b_logo: "/images/teams/sa.png",
            snap_innings: null,
            snap_runs: null,
            snap_wickets: null,
            snap_state: null
          }
        ];
      }

      return [];
    });

    vi.doMock("@/lib/db", () => ({ query: queryMock }));

    const read = await import("@/lib/api/read");
    const live = await read.getLiveMatches();
    expect(live).toHaveLength(1);
    expect(live[0].teamA.logo).toBe("/images/teams/eng.png");
    expect(live[0].teamA.score).toBe("176/7 (20)");
  });
});
