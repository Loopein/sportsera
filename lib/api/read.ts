import { cacheKeys } from "@/lib/cache/keys";
import { getCached, setCached } from "@/lib/cache/redis";
import { revalidateTtl } from "@/lib/cache/revalidate";
import { query } from "@/lib/db";
import type { RankingEntry, SearchResult, StandingsSeason } from "@/types/api";
import type { CommentaryItem, LiveMatch, MatchStats, MatchStatus, MatchSummary, Scorecard } from "@/types/match";
import type { NewsArticle } from "@/types/news";
import type { PlayerProfile } from "@/types/player";
import type { SeriesStanding, SeriesSummary } from "@/types/series";
import type { TournamentPlayerStat } from "@/types/stats";
import type { TeamProfile } from "@/types/team";

type SchemaInfo = {
  tables: Map<string, Set<string>>;
  hasTable: (table: string) => boolean;
  hasColumn: (table: string, column: string) => boolean;
};

const SCHEMA_TTL_MS = 60_000;
let cachedSchema: { info: SchemaInfo; expiresAt: number } | null = null;
let inFlightSchema: Promise<SchemaInfo> | null = null;

async function getSchemaInfo(): Promise<SchemaInfo> {
  if (cachedSchema && Date.now() < cachedSchema.expiresAt) {
    return cachedSchema.info;
  }

  if (!inFlightSchema) {
    inFlightSchema = query<{ table_name: string; column_name: string }>(
      `
      SELECT table_name, column_name
      FROM information_schema.columns
      WHERE table_schema = 'public'
      `
    )
      .then((rows) => {
        const tables = new Map<string, Set<string>>();
        for (const row of rows) {
          let columns = tables.get(row.table_name);
          if (!columns) {
            columns = new Set<string>();
            tables.set(row.table_name, columns);
          }
          columns.add(row.column_name);
        }
        const info: SchemaInfo = {
          tables,
          hasTable: (table) => tables.has(table),
          hasColumn: (table, column) => tables.get(table)?.has(column) ?? false
        };
        cachedSchema = { info, expiresAt: Date.now() + SCHEMA_TTL_MS };
        return info;
      })
      .finally(() => {
        inFlightSchema = null;
      });
  }

  return inFlightSchema;
}

async function withCache<T>(key: string, ttl: number, factory: () => Promise<T> | T): Promise<T> {
  const cached = await getCached<T>(key);
  if (cached) return cached;
  const value = await factory();
  await setCached(key, value, ttl);
  return value;
}

function toIsoString(value: string | Date | null | undefined): string | undefined {
  if (!value) return undefined;
  if (value instanceof Date) return value.toISOString();
  return value;
}

function toNumber(value: string | number | null | undefined): number {
  if (value === null || value === undefined) return 0;
  return Number(value);
}

function toMaybeNumber(value: string | number | null | undefined): number | undefined {
  if (value === null || value === undefined) return undefined;
  return Number(value);
}

function normalizeMatchStatus(status: string): MatchStatus {
  const normalized = status.trim().toLowerCase();
  if (normalized === "live" || normalized === "innings_break" || normalized === "upcoming" || normalized === "completed") {
    return normalized;
  }
  if (normalized === "finished" || normalized === "ended" || normalized === "result") {
    return "completed";
  }
  return "upcoming";
}

function colOrNull(schema: SchemaInfo, table: string, alias: string, column: string, castType: string): string {
  return schema.hasColumn(table, column) ? `${alias}.${column}` : `NULL::${castType}`;
}

function buildPlayerNameExpr(schema: SchemaInfo, alias = ""): string {
  const prefix = alias ? `${alias}.` : "";
  const hasName = schema.hasColumn("players", "name");
  const hasFullName = schema.hasColumn("players", "full_name");
  if (hasName && hasFullName) return `COALESCE(${prefix}name, ${prefix}full_name)`;
  if (hasName) return `${prefix}name`;
  if (hasFullName) return `${prefix}full_name`;
  return `${prefix}id`;
}

function buildTeamSelectColumns(schema: SchemaInfo): string {
  const logo = schema.hasColumn("teams", "logo") ? "logo" : "NULL::text AS logo";
  const homeGround = schema.hasColumn("teams", "home_ground") ? "home_ground" : "NULL::text AS home_ground";
  const captain = schema.hasColumn("teams", "captain") ? "captain" : "NULL::text AS captain";
  const coach = schema.hasColumn("teams", "coach") ? "coach" : "NULL::text AS coach";
  return `id, name, short_name, ${logo}, ${homeGround}, ${captain}, ${coach}`;
}

function buildPlayerSelectColumns(schema: SchemaInfo): string {
  const nameExpr = `${buildPlayerNameExpr(schema)} AS name`;
  const battingStyle = schema.hasColumn("players", "batting_style")
    ? "batting_style"
    : "NULL::text AS batting_style";
  const bowlingStyle = schema.hasColumn("players", "bowling_style")
    ? "bowling_style"
    : "NULL::text AS bowling_style";
  const image = schema.hasColumn("players", "image") ? "image" : "NULL::text AS image";
  return `id, ${nameExpr}, team_id, role, ${battingStyle}, ${bowlingStyle}, ${image}`;
}

type SnapshotState = {
  overs?: string;
  target?: number | null;
  innings?: number;
  currentRunRate?: number | null;
  requiredRunRate?: number | null;
};

function parseSnapshotState(raw: unknown): SnapshotState | null {
  if (!raw) return null;
  if (typeof raw === "string") {
    try {
      const parsed = JSON.parse(raw) as SnapshotState;
      return parsed && typeof parsed === "object" ? parsed : null;
    } catch {
      return null;
    }
  }
  return typeof raw === "object" ? (raw as SnapshotState) : null;
}

type MatchQueryParts = {
  teamAIdExpr: string;
  teamBIdExpr: string;
  seriesNameExpr: string;
  startAtExpr: string;
  lastUpdatedAtExpr: string;
  joinsSql: string;
  baseSelectList: string;
  fullSelectList: string;
};

function buildMatchQueryParts(schema: SchemaInfo): MatchQueryParts {
  const hasTeamAId = schema.hasColumn("matches", "team_a_id");
  const hasHomeTeamId = schema.hasColumn("matches", "home_team_id");
  const teamAIdExpr =
    hasTeamAId && hasHomeTeamId
      ? "COALESCE(m.team_a_id, m.home_team_id)"
      : hasTeamAId
        ? "m.team_a_id"
        : "m.home_team_id";

  const hasTeamBId = schema.hasColumn("matches", "team_b_id");
  const hasAwayTeamId = schema.hasColumn("matches", "away_team_id");
  const teamBIdExpr =
    hasTeamBId && hasAwayTeamId
      ? "COALESCE(m.team_b_id, m.away_team_id)"
      : hasTeamBId
        ? "m.team_b_id"
        : "m.away_team_id";

  const hasTournaments = schema.hasTable("tournaments") && schema.hasColumn("matches", "tournament_id");
  const hasSeries = schema.hasTable("series") && schema.hasColumn("matches", "series_id");
  const hasSnapshots = schema.hasTable("match_snapshots");

  const seriesNameParts: string[] = [];
  if (schema.hasColumn("matches", "series_name")) {
    seriesNameParts.push("NULLIF(NULLIF(m.series_name, ''), 'Unknown Series')");
  }
  if (hasTournaments) {
    seriesNameParts.push("NULLIF(TRIM(CONCAT_WS(' ', t.name, t.season)), '')");
  }
  if (hasSeries) {
    seriesNameParts.push("NULLIF(TRIM(CONCAT_WS(' ', s.name, s.season)), '')");
  }
  if (schema.hasColumn("matches", "series_name")) {
    seriesNameParts.push("NULLIF(m.series_name, '')");
  }
  seriesNameParts.push("'Series'");
  const seriesNameExpr = `COALESCE(${seriesNameParts.join(", ")})`;

  const formatParts: string[] = [];
  if (hasTournaments) formatParts.push("NULLIF(t.format, '')");
  if (hasSeries) formatParts.push("NULLIF(s.format, '')");
  if (schema.hasColumn("matches", "format")) formatParts.push("NULLIF(m.format, '')");
  formatParts.push("'ODI'");
  const formatExpr = `COALESCE(${formatParts.join(", ")})`;

  const startAtParts: string[] = [];
  if (schema.hasColumn("matches", "start_at")) startAtParts.push("m.start_at");
  if (schema.hasColumn("matches", "scheduled_at")) startAtParts.push("m.scheduled_at");
  const startAtExpr = startAtParts.length ? `COALESCE(${startAtParts.join(", ")})` : "NULL::timestamptz";

  const lastUpdatedParts: string[] = [];
  if (schema.hasColumn("matches", "last_updated_at")) lastUpdatedParts.push("m.last_updated_at");
  if (hasSnapshots) lastUpdatedParts.push("snap.updated_at");
  if (schema.hasColumn("matches", "updated_at")) lastUpdatedParts.push("m.updated_at");
  const lastUpdatedAtExpr = lastUpdatedParts.length ? `COALESCE(${lastUpdatedParts.join(", ")})` : "NULL::timestamptz";

  const slugExpr = schema.hasColumn("matches", "slug") ? "m.slug" : "m.id";
  const teamALogoExpr = schema.hasColumn("teams", "logo") ? "ta.logo" : "NULL::text";
  const teamBLogoExpr = schema.hasColumn("teams", "logo") ? "tb.logo" : "NULL::text";

  const snapshotColumns = hasSnapshots
    ? `
    snap.innings AS snap_innings,
    snap.runs AS snap_runs,
    snap.wickets AS snap_wickets,
    snap.state AS snap_state`
    : `
    NULL::integer AS snap_innings,
    NULL::integer AS snap_runs,
    NULL::integer AS snap_wickets,
    NULL::jsonb AS snap_state`;

  const joinsSql = [
    `FROM matches m`,
    `JOIN teams ta ON ta.id = ${teamAIdExpr}`,
    `JOIN teams tb ON tb.id = ${teamBIdExpr}`,
    hasTournaments ? `LEFT JOIN tournaments t ON t.id = m.tournament_id` : "",
    hasSeries ? `LEFT JOIN series s ON s.id = m.series_id` : "",
    hasSnapshots ? `LEFT JOIN match_snapshots snap ON snap.match_id = m.id` : ""
  ]
    .filter(Boolean)
    .join("\n  ");

  const baseSelectColumns = `
    m.id,
    ${slugExpr} AS slug,
    LOWER(m.status) AS status,
    ${formatExpr} AS format,
    ${seriesNameExpr} AS series_name,
    m.venue,
    ${colOrNull(schema, "matches", "m", "toss", "text")} AS toss,
    ${colOrNull(schema, "matches", "m", "summary", "text")} AS summary,
    ${colOrNull(schema, "matches", "m", "result_text", "text")} AS result_text,
    ${startAtExpr} AS start_at,
    ${lastUpdatedAtExpr} AS last_updated_at,
    ${colOrNull(schema, "matches", "m", "current_run_rate", "numeric")} AS current_run_rate,
    ${colOrNull(schema, "matches", "m", "required_run_rate", "numeric")} AS required_run_rate,
    ${colOrNull(schema, "matches", "m", "target", "integer")} AS target,
    ${colOrNull(schema, "matches", "m", "overs", "text")} AS overs,
    ${colOrNull(schema, "matches", "m", "team_a_score", "text")} AS team_a_score,
    ${colOrNull(schema, "matches", "m", "team_b_score", "text")} AS team_b_score,
    ta.id AS team_a_id,
    ta.name AS team_a_name,
    ta.short_name AS team_a_short_name,
    ${teamALogoExpr} AS team_a_logo,
    tb.id AS team_b_id,
    tb.name AS team_b_name,
    tb.short_name AS team_b_short_name,
    ${teamBLogoExpr} AS team_b_logo,
    ${snapshotColumns}
  `;

  const currentBattersExpr = schema.hasTable("match_current_batters")
    ? `(
      SELECT json_agg(
        json_build_object('name', b.name, 'runs', b.runs, 'balls', b.balls)
        ORDER BY b.order_index
      )
      FROM match_current_batters b
      WHERE b.match_id = m.id
    )`
    : "NULL::json";

  const currentBowlersExpr = schema.hasTable("match_current_bowlers")
    ? `(
      SELECT json_agg(
        json_build_object('name', bo.name, 'overs', bo.overs, 'runs', bo.runs, 'wickets', bo.wickets)
        ORDER BY bo.order_index
      )
      FROM match_current_bowlers bo
      WHERE bo.match_id = m.id
    )`
    : "NULL::json";

  const recentOversExpr = schema.hasTable("match_recent_overs")
    ? `(
      SELECT json_agg(ro.value ORDER BY ro.over_index)
      FROM match_recent_overs ro
      WHERE ro.match_id = m.id
    )`
    : "NULL::json";

  const playingXiAExpr = schema.hasTable("match_playing_xi")
    ? `(
      SELECT json_agg(px.player_id ORDER BY px.order_index)
      FROM match_playing_xi px
      WHERE px.match_id = m.id AND px.team_id = ${teamAIdExpr}
    )`
    : "NULL::json";

  const playingXiBExpr = schema.hasTable("match_playing_xi")
    ? `(
      SELECT json_agg(px.player_id ORDER BY px.order_index)
      FROM match_playing_xi px
      WHERE px.match_id = m.id AND px.team_id = ${teamBIdExpr}
    )`
    : "NULL::json";

  const baseSelectList = `
  SELECT
    ${baseSelectColumns}
  ${joinsSql}
`;

  const fullSelectList = `
  SELECT
    ${baseSelectColumns},
    ${currentBattersExpr} AS current_batters,
    ${currentBowlersExpr} AS current_bowlers,
    ${recentOversExpr} AS recent_overs,
    ${playingXiAExpr} AS playing_xi_a,
    ${playingXiBExpr} AS playing_xi_b
  ${joinsSql}
`;

  return {
    teamAIdExpr,
    teamBIdExpr,
    seriesNameExpr,
    startAtExpr,
    lastUpdatedAtExpr,
    joinsSql,
    baseSelectList,
    fullSelectList
  };
}

type BaseMatchRow = {
  id: string;
  slug: string;
  status: string;
  format: string;
  series_name: string;
  venue: string;
  toss: string | null;
  summary: string | null;
  result_text: string | null;
  start_at: string | Date | null;
  last_updated_at: string | Date | null;
  current_run_rate: string | number | null;
  required_run_rate: string | number | null;
  target: number | null;
  overs: string | null;
  team_a_score: string | null;
  team_b_score: string | null;
  team_a_id: string;
  team_a_name: string;
  team_a_short_name: string;
  team_a_logo: string | null;
  team_b_id: string;
  team_b_name: string;
  team_b_short_name: string;
  team_b_logo: string | null;
  snap_innings: number | null;
  snap_runs: number | null;
  snap_wickets: number | null;
  snap_state: unknown;
};

type MatchSummaryRow = BaseMatchRow & {
  current_batters?: Array<{ name: string; runs: number; balls: number }> | null;
  current_bowlers?: Array<{ name: string; overs: string; runs: number; wickets: number }> | null;
  recent_overs?: string[] | null;
  playing_xi_a?: string[] | null;
  playing_xi_b?: string[] | null;
};

function deriveSnapshotFields(row: BaseMatchRow, status: MatchStatus, includeOversInScore: boolean) {
  const snapState = parseSnapshotState(row.snap_state);
  const hasSnapshotActivity =
    row.snap_runs !== null &&
    row.snap_wickets !== null &&
    (status !== "upcoming" || row.snap_runs > 0 || row.snap_wickets > 0);

  let teamAScore = row.team_a_score ?? undefined;
  let teamBScore = row.team_b_score ?? undefined;
  let summaryText = row.summary ?? undefined;
  let overs = row.overs ?? undefined;
  let target = row.target ?? undefined;
  let currentRunRate =
    row.current_run_rate !== null && row.current_run_rate !== undefined
      ? toNumber(row.current_run_rate)
      : undefined;
  let requiredRunRate =
    row.required_run_rate !== null && row.required_run_rate !== undefined
      ? toNumber(row.required_run_rate)
      : undefined;

  if (hasSnapshotActivity) {
    const oversStr = snapState?.overs ?? "0.0";
    const runs = Number(row.snap_runs ?? 0);
    const wickets = Number(row.snap_wickets ?? 0);
    const innings = row.snap_innings ?? snapState?.innings ?? 1;
    const snapTarget = snapState?.target ?? undefined;

    if (target === undefined && snapTarget !== undefined && snapTarget !== null) {
      target = Number(snapTarget);
    }
    if (overs === undefined && oversStr !== "0.0") {
      overs = oversStr;
    }
    if (currentRunRate === undefined && snapState?.currentRunRate !== null && snapState?.currentRunRate !== undefined) {
      currentRunRate = Number(snapState.currentRunRate);
    }
    if (
      requiredRunRate === undefined &&
      snapState?.requiredRunRate !== null &&
      snapState?.requiredRunRate !== undefined &&
      Number(snapState.requiredRunRate) > 0
    ) {
      requiredRunRate = Number(snapState.requiredRunRate);
    }

    if (!teamAScore) {
      teamAScore = includeOversInScore ? `${runs}/${wickets} (${oversStr})` : `${runs}/${wickets}`;
    }
    if (!teamBScore && innings >= 2 && target !== undefined) {
      teamBScore = `${Math.max(target - 1, 0)} (1st inn)`;
    }
    if (!summaryText) {
      if (innings >= 2 && target !== undefined) {
        const needed = Math.max(target - runs, 0);
        summaryText = needed === 0 ? "Target achieved" : `Need ${needed} runs to win (Target ${target})`;
      } else {
        summaryText = `1st Innings: ${runs}/${wickets} (${oversStr} ov)`;
      }
    }
  }

  return {
    teamAScore,
    teamBScore,
    summaryText,
    overs,
    target,
    currentRunRate,
    requiredRunRate
  };
}

function mapLiveMatch(row: BaseMatchRow): LiveMatch {
  const status = normalizeMatchStatus(row.status);
  const derived = deriveSnapshotFields(row, status, true);
  const lastUpdatedAt =
    toIsoString(row.last_updated_at) ?? toIsoString(row.start_at) ?? new Date().toISOString();

  return {
    id: row.id,
    slug: row.slug,
    status,
    format: row.format,
    seriesName: row.series_name,
    venue: row.venue,
    teamA: {
      id: row.team_a_id,
      name: row.team_a_name,
      shortName: row.team_a_short_name,
      logo: row.team_a_logo ?? undefined,
      score: derived.teamAScore
    },
    teamB: {
      id: row.team_b_id,
      name: row.team_b_name,
      shortName: row.team_b_short_name,
      logo: row.team_b_logo ?? undefined,
      score: derived.teamBScore
    },
    summary: derived.summaryText ?? "",
    startAt: toIsoString(row.start_at),
    lastUpdatedAt
  };
}

function mapMatchSummary(row: MatchSummaryRow): MatchSummary {
  const status = normalizeMatchStatus(row.status);
  const derived = deriveSnapshotFields(row, status, false);

  const summary: MatchSummary = {
    id: row.id,
    status,
    format: row.format,
    seriesName: row.series_name,
    venue: row.venue,
    teamA: {
      id: row.team_a_id,
      name: row.team_a_name,
      shortName: row.team_a_short_name,
      logo: row.team_a_logo ?? undefined,
      score: derived.teamAScore
    },
    teamB: {
      id: row.team_b_id,
      name: row.team_b_name,
      shortName: row.team_b_short_name,
      logo: row.team_b_logo ?? undefined,
      score: derived.teamBScore
    }
  };

  if (row.toss) summary.toss = row.toss;
  if (row.result_text) {
    summary.resultText = row.result_text;
  } else if (derived.summaryText) {
    summary.resultText = derived.summaryText;
  }
  if (derived.currentRunRate !== undefined) summary.currentRunRate = derived.currentRunRate;
  if (derived.requiredRunRate !== undefined) summary.requiredRunRate = derived.requiredRunRate;
  if (derived.target !== undefined) summary.target = derived.target;
  if (derived.overs) summary.overs = derived.overs;
  if (row.start_at) summary.startAt = toIsoString(row.start_at);
  if (row.last_updated_at) summary.lastUpdatedAt = toIsoString(row.last_updated_at);

  const currentBatters = row.current_batters?.map((b) => ({
    name: b.name,
    runs: Number(b.runs),
    balls: Number(b.balls)
  }));
  if (currentBatters && currentBatters.length) summary.currentBatters = currentBatters;

  const currentBowlers = row.current_bowlers?.map((b) => ({
    name: b.name,
    overs: b.overs,
    runs: Number(b.runs),
    wickets: Number(b.wickets)
  }));
  if (currentBowlers && currentBowlers.length) summary.currentBowlers = currentBowlers;

  if (row.recent_overs && row.recent_overs.length) summary.recentOvers = row.recent_overs;

  const playingXI = {
    teamA: row.playing_xi_a ?? undefined,
    teamB: row.playing_xi_b ?? undefined
  };
  if ((playingXI.teamA && playingXI.teamA.length) || (playingXI.teamB && playingXI.teamB.length)) {
    summary.playingXI = playingXI;
  }

  return summary;
}

export function getLiveMatches(): Promise<LiveMatch[]> {
  return withCache(cacheKeys.live, revalidateTtl.live, async () => {
    const schema = await getSchemaInfo();
    if (!schema.hasTable("matches") || !schema.hasTable("teams")) return [];
    const parts = buildMatchQueryParts(schema);
    const rows = await query<BaseMatchRow>(
      `${parts.baseSelectList}
       WHERE LOWER(m.status) IN ('live', 'innings_break')
       ORDER BY ${parts.lastUpdatedAtExpr} DESC NULLS LAST`
    );
    return rows.map(mapLiveMatch);
  });
}

export function getMatches(filter?: string): Promise<MatchSummary[]> {
  const normalized = filter ?? "all";
  return withCache(cacheKeys.matches(normalized), revalidateTtl.listings, async () => {
    const schema = await getSchemaInfo();
    if (!schema.hasTable("matches") || !schema.hasTable("teams")) return [];
    const parts = buildMatchQueryParts(schema);

    if (!filter || filter === "all") {
      const rows = await query<MatchSummaryRow>(
        `${parts.baseSelectList}
         ORDER BY COALESCE(${parts.startAtExpr}, ${parts.lastUpdatedAtExpr}) DESC NULLS LAST`
      );
      return rows.map(mapMatchSummary);
    }

    const whereClause =
      filter.toLowerCase() === "completed"
        ? "WHERE LOWER(m.status) IN ('completed', 'finished', 'ended', 'result')"
        : "WHERE LOWER(m.status) = LOWER($1)";
    const params = filter.toLowerCase() === "completed" ? [] : [filter];

    const rows = await query<MatchSummaryRow>(
      `${parts.baseSelectList}
       ${whereClause}
       ORDER BY COALESCE(${parts.startAtExpr}, ${parts.lastUpdatedAtExpr}) DESC NULLS LAST`,
      params
    );
    return rows.map(mapMatchSummary);
  });
}

export function getMatchSummary(matchId: string): Promise<MatchSummary | null> {
  return withCache(cacheKeys.matchSummary(matchId), revalidateTtl.matchSummary, async () => {
    const schema = await getSchemaInfo();
    if (!schema.hasTable("matches") || !schema.hasTable("teams")) return null;
    const parts = buildMatchQueryParts(schema);
    const rows = await query<MatchSummaryRow>(
      `${parts.fullSelectList}
       WHERE m.id = $1
       LIMIT 1`,
      [matchId]
    );
    const row = rows[0];
    return row ? mapMatchSummary(row) : null;
  });
}

export function getMatchScorecard(matchId: string): Promise<Scorecard | null> {
  return withCache(cacheKeys.scorecard(matchId), revalidateTtl.scorecard, async () => {
    const schema = await getSchemaInfo();
    if (!schema.hasTable("scorecard_innings")) return null;

    const fowExpr = schema.hasTable("scorecard_fall_of_wickets")
      ? `COALESCE(
          (
            SELECT json_agg(f.value ORDER BY f.order_index)
            FROM scorecard_fall_of_wickets f
            WHERE f.innings_id = i.id
          ),
          '[]'
        )`
      : `'[]'::json`;

    const battersExpr = schema.hasTable("scorecard_batters")
      ? `COALESCE(
          (
            SELECT json_agg(
              json_build_object(
                'name', b.name,
                'dismissal', b.dismissal,
                'runs', b.runs,
                'balls', b.balls,
                'fours', b.fours,
                'sixes', b.sixes,
                'strikeRate', b.strike_rate
              )
              ORDER BY b.order_index
            )
            FROM scorecard_batters b
            WHERE b.innings_id = i.id
          ),
          '[]'
        )`
      : `'[]'::json`;

    const bowlersExpr = schema.hasTable("scorecard_bowlers")
      ? `COALESCE(
          (
            SELECT json_agg(
              json_build_object(
                'name', bo.name,
                'overs', bo.overs,
                'maidens', bo.maidens,
                'runs', bo.runs,
                'wickets', bo.wickets,
                'economy', bo.economy
              )
              ORDER BY bo.order_index
            )
            FROM scorecard_bowlers bo
            WHERE bo.innings_id = i.id
          ),
          '[]'
        )`
      : `'[]'::json`;

    const rows = await query<{
      id: number;
      name: string;
      total: string;
      extras: string | null;
      fall_of_wickets: string[];
      batters: Array<{
        name: string;
        dismissal: string;
        runs: number;
        balls: number;
        fours: number;
        sixes: number;
        strikeRate: string | number;
      }>;
      bowlers: Array<{
        name: string;
        overs: string;
        maidens: number;
        runs: number;
        wickets: number;
        economy: string | number;
      }>;
    }>(
      `
      SELECT
        i.id,
        i.name,
        i.total,
        i.extras,
        ${fowExpr} AS fall_of_wickets,
        ${battersExpr} AS batters,
        ${bowlersExpr} AS bowlers
      FROM scorecard_innings i
      WHERE i.match_id = $1
      ORDER BY i.order_index
      `,
      [matchId]
    );

    if (!rows.length) return null;

    return {
      matchId,
      innings: rows.map((row) => ({
        name: row.name,
        total: row.total,
        extras: row.extras ?? "",
        fallOfWickets: row.fall_of_wickets ?? [],
        batters: (row.batters ?? []).map((b) => ({
          name: b.name,
          dismissal: b.dismissal,
          runs: Number(b.runs),
          balls: Number(b.balls),
          fours: Number(b.fours),
          sixes: Number(b.sixes),
          strikeRate: toNumber(b.strikeRate)
        })),
        bowlers: (row.bowlers ?? []).map((b) => ({
          name: b.name,
          overs: b.overs,
          maidens: Number(b.maidens),
          runs: Number(b.runs),
          wickets: Number(b.wickets),
          economy: toNumber(b.economy)
        }))
      }))
    };
  });
}

export function getMatchCommentary(matchId: string): Promise<CommentaryItem[]> {
  return withCache(cacheKeys.commentary(matchId), revalidateTtl.commentary, async () => {
    const schema = await getSchemaInfo();

    if (schema.hasTable("match_commentary")) {
      const rows = await query<{
        id: string;
        over: string;
        ball: string;
        text: string;
        runs: number;
        timestamp: string | Date;
      }>(
        `
        SELECT id, over, ball, text, runs, timestamp
        FROM match_commentary
        WHERE match_id = $1
        ORDER BY timestamp DESC
        `,
        [matchId]
      );
      return rows.map((row) => ({
        id: row.id,
        over: row.over,
        ball: row.ball,
        text: row.text,
        runs: Number(row.runs),
        timestamp: toIsoString(row.timestamp) ?? new Date().toISOString()
      }));
    }

    if (schema.hasTable("commentary")) {
      const rows = await query<{
        id: string;
        over_number: number | null;
        ball_in_over: number | null;
        message: string;
        created_at: string | Date;
      }>(
        `
        SELECT id, over_number, ball_in_over, message, created_at
        FROM commentary
        WHERE match_id = $1
        ORDER BY created_at DESC
        `,
        [matchId]
      );
      return rows.map((row) => ({
        id: row.id,
        over: row.over_number !== null && row.over_number !== undefined ? String(row.over_number) : "-",
        ball: row.ball_in_over !== null && row.ball_in_over !== undefined ? String(row.ball_in_over) : "-",
        text: row.message,
        runs: 0,
        timestamp: toIsoString(row.created_at) ?? new Date().toISOString()
      }));
    }

    return [];
  });
}

export function getMatchStats(matchId: string): Promise<MatchStats | null> {
  return withCache(cacheKeys.stats(matchId), revalidateTtl.scorecard, async () => {
    const schema = await getSchemaInfo();

    if (schema.hasTable("match_stats")) {
      const partnershipsExpr = schema.hasTable("match_partnerships")
        ? `(
            SELECT json_agg(
              json_build_object('wickets', p.wickets, 'runs', p.runs, 'balls', p.balls)
              ORDER BY p.order_index
            )
            FROM match_partnerships p
            WHERE p.match_id = ms.match_id
          )`
        : "NULL::json";

      const wagonWheelExpr = schema.hasTable("match_wagon_wheel")
        ? `(
            SELECT json_agg(
              json_build_object('zone', w.zone, 'runs', w.runs)
              ORDER BY w.order_index
            )
            FROM match_wagon_wheel w
            WHERE w.match_id = ms.match_id
          )`
        : "NULL::json";

      const matchupNotesExpr = schema.hasTable("match_matchup_notes")
        ? `(
            SELECT json_agg(n.note ORDER BY n.order_index)
            FROM match_matchup_notes n
            WHERE n.match_id = ms.match_id
          )`
        : "NULL::json";

      const rows = await query<{
        match_id: string;
        run_rate: string | number;
        required_run_rate: string | number | null;
        partnerships: Array<{ wickets: string; runs: number; balls: number }> | null;
        wagon_wheel: Array<{ zone: string; runs: number }> | null;
        matchup_notes: string[] | null;
      }>(
        `
        SELECT
          ms.match_id,
          ms.run_rate,
          ms.required_run_rate,
          ${partnershipsExpr} AS partnerships,
          ${wagonWheelExpr} AS wagon_wheel,
          ${matchupNotesExpr} AS matchup_notes
        FROM match_stats ms
        WHERE ms.match_id = $1
        LIMIT 1
        `,
        [matchId]
      );

      const row = rows[0];
      if (row) {
        return {
          matchId: row.match_id,
          runRate: toNumber(row.run_rate),
          requiredRunRate: toMaybeNumber(row.required_run_rate),
          partnerships: (row.partnerships ?? []).map((p) => ({
            wickets: p.wickets,
            runs: Number(p.runs),
            balls: Number(p.balls)
          })),
          wagonWheel: (row.wagon_wheel ?? []).map((w) => ({
            zone: w.zone,
            runs: Number(w.runs)
          })),
          matchupNotes: row.matchup_notes ?? []
        };
      }
    }

    if (schema.hasTable("match_snapshots")) {
      const snaps = await query<{ match_id: string; state: unknown }>(
        `
        SELECT match_id, state
        FROM match_snapshots
        WHERE match_id = $1
        LIMIT 1
        `,
        [matchId]
      );
      const snap = snaps[0];
      if (!snap) return null;
      const state = parseSnapshotState(snap.state);
      const requiredRunRate =
        state?.requiredRunRate !== null &&
        state?.requiredRunRate !== undefined &&
        Number(state.requiredRunRate) > 0
          ? Number(state.requiredRunRate)
          : undefined;
      return {
        matchId: snap.match_id,
        runRate: Number(state?.currentRunRate ?? 0),
        requiredRunRate,
        partnerships: [],
        wagonWheel: [],
        matchupNotes: []
      };
    }

    return null;
  });
}

export function getSeries(): Promise<SeriesSummary[]> {
  return withCache(cacheKeys.series, revalidateTtl.listings, async () => {
    const schema = await getSchemaInfo();

    if (schema.hasTable("series")) {
      const rows = await query<{
        id: string;
        name: string;
        season: string;
        format: string;
        start_date: string | Date;
        end_date: string | Date;
        status: SeriesSummary["status"];
      }>(
        `
        SELECT id, name, season, format, start_date, end_date, status
        FROM series
        ORDER BY start_date DESC
        `
      );

      return rows.map((row) => ({
        id: row.id,
        name: row.name,
        season: row.season,
        format: row.format,
        startDate: toIsoString(row.start_date)?.slice(0, 10) ?? "",
        endDate: toIsoString(row.end_date)?.slice(0, 10) ?? "",
        status: row.status
      }));
    }

    if (schema.hasTable("tournaments")) {
      const rows = await query<{
        id: string;
        name: string;
        season: string;
        format: string;
        start_date: string | Date;
        end_date: string | Date;
      }>(
        `
        SELECT id, name, season, format, start_date, end_date
        FROM tournaments
        ORDER BY start_date DESC
        `
      );
      const now = Date.now();
      return rows.map((row) => {
        const startMs = new Date(row.start_date).getTime();
        const endMs = new Date(row.end_date).getTime();
        const status: SeriesSummary["status"] =
          endMs < now ? "completed" : startMs > now ? "upcoming" : "ongoing";
        return {
          id: row.id,
          name: row.name,
          season: row.season,
          format: row.format,
          startDate: toIsoString(row.start_date)?.slice(0, 10) ?? "",
          endDate: toIsoString(row.end_date)?.slice(0, 10) ?? "",
          status
        };
      });
    }

    return [];
  });
}

export async function getSeriesById(seriesId: string): Promise<{ series: SeriesSummary; standings: SeriesStanding[] } | null> {
  const [series, schema] = await Promise.all([getSeries(), getSchemaInfo()]);
  const found = series.find((s) => s.id === seriesId);
  if (!found) return null;

  if (!schema.hasTable("series_standings")) {
    return { series: found, standings: [] };
  }

  const standingsRows = await query<{
    team_id: string | null;
    team_name: string;
    played: number;
    won: number;
    lost: number;
    points: number;
    net_run_rate: string | number;
  }>(
    `
    SELECT team_id, team_name, played, won, lost, points, net_run_rate
    FROM series_standings
    WHERE series_id = $1
    ORDER BY points DESC, net_run_rate DESC
    `,
    [seriesId]
  );

  return {
    series: found,
    standings: standingsRows.map((row) => ({
      teamId: row.team_id ?? "",
      teamName: row.team_name,
      played: Number(row.played),
      won: Number(row.won),
      lost: Number(row.lost),
      points: Number(row.points),
      netRunRate: toNumber(row.net_run_rate)
    }))
  };
}

type TeamRow = {
  id: string;
  name: string;
  short_name: string;
  logo: string | null;
  home_ground: string | null;
  captain: string | null;
  coach: string | null;
};

function mapTeamProfile(team: TeamRow, squad: TeamProfile["squad"]): TeamProfile {
  return {
    id: team.id,
    name: team.name,
    shortName: team.short_name,
    logo: team.logo ?? undefined,
    homeGround: team.home_ground ?? undefined,
    captain: team.captain ?? undefined,
    coach: team.coach ?? undefined,
    squad
  };
}

export function getTeam(teamId: string): Promise<TeamProfile | null> {
  return withCache(cacheKeys.team(teamId), revalidateTtl.profiles, async () => {
    const schema = await getSchemaInfo();
    if (!schema.hasTable("teams")) return null;

    const teams = await query<TeamRow>(
      `
      SELECT ${buildTeamSelectColumns(schema)}
      FROM teams
      WHERE id = $1
      LIMIT 1
      `,
      [teamId]
    );

    const team = teams[0];
    if (!team) return null;

    const squadRows = schema.hasTable("team_squad_members")
      ? await query<{
          player_id: string | null;
          name: string;
          role: string;
          is_captain: boolean;
          is_wicket_keeper: boolean;
        }>(
          `
          SELECT player_id, name, role, is_captain, is_wicket_keeper
          FROM team_squad_members
          WHERE team_id = $1
          ORDER BY id
          `,
          [teamId]
        )
      : [];

    return mapTeamProfile(
      team,
      squadRows.map((row) => ({
        playerId: row.player_id ?? "",
        name: row.name,
        role: row.role,
        isCaptain: row.is_captain,
        isWicketKeeper: row.is_wicket_keeper
      }))
    );
  });
}

export async function getTeams(): Promise<TeamProfile[]> {
  return withCache(cacheKeys.matches("teams"), revalidateTtl.profiles, async () => {
    const schema = await getSchemaInfo();
    if (!schema.hasTable("teams")) return [];

    const teams = await query<TeamRow>(
      `
      SELECT ${buildTeamSelectColumns(schema)}
      FROM teams
      ORDER BY name
      `
    );

    const squads = schema.hasTable("team_squad_members")
      ? await query<{
          team_id: string;
          player_id: string | null;
          name: string;
          role: string;
          is_captain: boolean;
          is_wicket_keeper: boolean;
        }>(
          `
          SELECT team_id, player_id, name, role, is_captain, is_wicket_keeper
          FROM team_squad_members
          ORDER BY id
          `
        )
      : [];

    const squadByTeam = new Map<string, TeamProfile["squad"]>();
    for (const member of squads) {
      const list = squadByTeam.get(member.team_id) ?? [];
      list.push({
        playerId: member.player_id ?? "",
        name: member.name,
        role: member.role,
        isCaptain: member.is_captain,
        isWicketKeeper: member.is_wicket_keeper
      });
      squadByTeam.set(member.team_id, list);
    }

    return teams.map((team) => mapTeamProfile(team, squadByTeam.get(team.id) ?? []));
  });
}

type PlayerRow = {
  id: string;
  name: string;
  team_id: string;
  role: string;
  batting_style: string | null;
  bowling_style: string | null;
  image: string | null;
};

type CareerRow = {
  player_id?: string;
  format: string;
  matches: number;
  runs: number | null;
  wickets: number | null;
  average: string | number | null;
  strike_rate: string | number | null;
};

function mapCareerRow(row: CareerRow): PlayerProfile["career"][number] {
  return {
    format: row.format,
    matches: Number(row.matches),
    runs: row.runs ?? undefined,
    wickets: row.wickets ?? undefined,
    average: toMaybeNumber(row.average),
    strikeRate: toMaybeNumber(row.strike_rate)
  };
}

function mapPlayerProfile(
  player: PlayerRow,
  career: PlayerProfile["career"],
  recentForm: string[]
): PlayerProfile {
  return {
    id: player.id,
    name: player.name,
    teamId: player.team_id,
    role: player.role,
    battingStyle: player.batting_style ?? undefined,
    bowlingStyle: player.bowling_style ?? undefined,
    image: player.image ?? undefined,
    career,
    recentForm
  };
}

export function getPlayer(playerId: string): Promise<PlayerProfile | null> {
  return withCache(cacheKeys.player(playerId), revalidateTtl.profiles, async () => {
    const schema = await getSchemaInfo();
    if (!schema.hasTable("players")) return null;

    const players = await query<PlayerRow>(
      `
      SELECT ${buildPlayerSelectColumns(schema)}
      FROM players
      WHERE id = $1
      LIMIT 1
      `,
      [playerId]
    );

    const player = players[0];
    if (!player) return null;

    const careerRows = schema.hasTable("player_career_stats")
      ? await query<CareerRow>(
          `
          SELECT format, matches, runs, wickets, average, strike_rate
          FROM player_career_stats
          WHERE player_id = $1
          ORDER BY id
          `,
          [playerId]
        )
      : [];

    const formRows = schema.hasTable("player_recent_form")
      ? await query<{ value: string }>(
          `
          SELECT value
          FROM player_recent_form
          WHERE player_id = $1
          ORDER BY entry_order
          `,
          [playerId]
        )
      : [];

    return mapPlayerProfile(
      player,
      careerRows.map(mapCareerRow),
      formRows.map((row) => row.value)
    );
  });
}

export function getPlayers(): Promise<PlayerProfile[]> {
  return withCache(cacheKeys.matches("players"), revalidateTtl.profiles, async () => {
    const schema = await getSchemaInfo();
    if (!schema.hasTable("players")) return [];

    const playerNameExpr = buildPlayerNameExpr(schema);
    const players = await query<PlayerRow>(
      `
      SELECT ${buildPlayerSelectColumns(schema)}
      FROM players
      ORDER BY ${playerNameExpr}
      `
    );

    const careerRows = schema.hasTable("player_career_stats")
      ? await query<CareerRow & { player_id: string }>(
          `
          SELECT player_id, format, matches, runs, wickets, average, strike_rate
          FROM player_career_stats
          ORDER BY id
          `
        )
      : [];

    const formRows = schema.hasTable("player_recent_form")
      ? await query<{ player_id: string; value: string }>(
          `
          SELECT player_id, value
          FROM player_recent_form
          ORDER BY entry_order
          `
        )
      : [];

    const careerByPlayer = new Map<string, PlayerProfile["career"]>();
    for (const row of careerRows) {
      const list = careerByPlayer.get(row.player_id) ?? [];
      list.push(mapCareerRow(row));
      careerByPlayer.set(row.player_id, list);
    }

    const formByPlayer = new Map<string, string[]>();
    for (const row of formRows) {
      const list = formByPlayer.get(row.player_id) ?? [];
      list.push(row.value);
      formByPlayer.set(row.player_id, list);
    }

    return players.map((player) =>
      mapPlayerProfile(
        player,
        careerByPlayer.get(player.id) ?? [],
        formByPlayer.get(player.id) ?? []
      )
    );
  });
}

export function getRankings(): Promise<RankingEntry[]> {
  return withCache(cacheKeys.rankings, revalidateTtl.rankings, async () => {
    const schema = await getSchemaInfo();
    if (!schema.hasTable("rankings")) return [];

    const rows = await query<{
      team_id: string | null;
      team_name: string;
      format: RankingEntry["format"];
      rank: number;
      rating: number;
    }>(
      `
      SELECT team_id, team_name, format, rank, rating
      FROM rankings
      ORDER BY format, rank
      `
    );
    return rows.map((row) => ({
      teamId: row.team_id ?? "",
      teamName: row.team_name,
      format: row.format,
      rank: Number(row.rank),
      rating: Number(row.rating)
    }));
  });
}

export function getStandingsSeasons(): Promise<StandingsSeason[]> {
  return withCache(cacheKeys.standings, revalidateTtl.standings, async () => {
    const schema = await getSchemaInfo();
    if (
      !schema.hasTable("standings_seasons") ||
      !schema.hasTable("standings_series") ||
      !schema.hasTable("standings_stages") ||
      !schema.hasTable("standings_groups") ||
      !schema.hasTable("standings_rows")
    ) {
      return [];
    }

    const seasons = await query<{ season: string }>(
      `
      SELECT season
      FROM standings_seasons
      ORDER BY season DESC
      `
    );

    const series = await query<{ season: string; id: string; label: string }>(
      `
      SELECT season, id, label
      FROM standings_series
      ORDER BY season DESC, id
      `
    );

    const stages = await query<{
      season: string;
      series_id: string;
      id: string;
      label: string;
      sort_order: number;
    }>(
      `
      SELECT season, series_id, id, label, sort_order
      FROM standings_stages
      ORDER BY season DESC, series_id, sort_order
      `
    );

    const groups = await query<{
      season: string;
      series_id: string;
      stage_id: string;
      id: string;
      label: string;
      sort_order: number;
    }>(
      `
      SELECT season, series_id, stage_id, id, label, sort_order
      FROM standings_groups
      ORDER BY season DESC, series_id, stage_id, sort_order
      `
    );

    const rows = await query<{
      season: string;
      series_id: string;
      stage_id: string;
      group_id: string;
      team_id: string | null;
      team_name: string;
      short_code: string;
      played: number;
      won: number;
      lost: number;
      net_run_rate: string | number;
      points: number;
      highlight: boolean;
      row_index: number;
    }>(
      `
      SELECT season, series_id, stage_id, group_id, team_id, team_name, short_code, played, won, lost, net_run_rate, points, highlight, row_index
      FROM standings_rows
      ORDER BY season DESC, series_id, stage_id, group_id, row_index
      `
    );

    const seasonMap = new Map<string, StandingsSeason>();
    for (const season of seasons) {
      seasonMap.set(season.season, { season: season.season, series: [] });
    }

    const seriesMap = new Map<string, StandingsSeason["series"][number]>();
    for (const row of series) {
      const parent = seasonMap.get(row.season);
      if (!parent) continue;
      const entry = { id: row.id, label: row.label, stages: [] };
      parent.series.push(entry);
      seriesMap.set(`${row.season}::${row.id}`, entry);
    }

    const stageMap = new Map<string, StandingsSeason["series"][number]["stages"][number]>();
    for (const row of stages) {
      const parent = seriesMap.get(`${row.season}::${row.series_id}`);
      if (!parent) continue;
      const entry = { id: row.id as StandingsSeason["series"][number]["stages"][number]["id"], label: row.label, groups: [] };
      parent.stages.push(entry);
      stageMap.set(`${row.season}::${row.series_id}::${row.id}`, entry);
    }

    const groupMap = new Map<string, StandingsSeason["series"][number]["stages"][number]["groups"][number]>();
    for (const row of groups) {
      const parent = stageMap.get(`${row.season}::${row.series_id}::${row.stage_id}`);
      if (!parent) continue;
      const entry = { id: row.id, label: row.label, rows: [] };
      parent.groups.push(entry);
      groupMap.set(`${row.season}::${row.series_id}::${row.stage_id}::${row.id}`, entry);
    }

    for (const row of rows) {
      const group = groupMap.get(`${row.season}::${row.series_id}::${row.stage_id}::${row.group_id}`);
      if (!group) continue;
      group.rows.push({
        teamId: row.team_id ?? "",
        teamName: row.team_name,
        shortCode: row.short_code,
        played: Number(row.played),
        won: Number(row.won),
        lost: Number(row.lost),
        netRunRate: toNumber(row.net_run_rate),
        points: Number(row.points),
        highlight: row.highlight
      });
    }

    return Array.from(seasonMap.values());
  });
}

export function search(queryText: string): Promise<SearchResult[]> {
  return withCache(cacheKeys.search(queryText), revalidateTtl.live, async () => {
    const q = queryText.trim().toLowerCase();
    if (!q) return [];
    const like = `%${q}%`;
    const schema = await getSchemaInfo();

    const matchRows =
      schema.hasTable("matches") && schema.hasTable("teams")
        ? await (() => {
            const parts = buildMatchQueryParts(schema);
            return query<{
              id: string;
              series_name: string;
              venue: string;
              team_a_short_name: string;
              team_b_short_name: string;
            }>(
              `
              SELECT
                m.id,
                ${parts.seriesNameExpr} AS series_name,
                m.venue,
                ta.short_name AS team_a_short_name,
                tb.short_name AS team_b_short_name
              ${parts.joinsSql}
              WHERE lower(${parts.seriesNameExpr}) LIKE $1 OR lower(ta.name) LIKE $1 OR lower(tb.name) LIKE $1
              ORDER BY ${parts.lastUpdatedAtExpr} DESC NULLS LAST
              LIMIT 10
              `,
              [like]
            );
          })()
        : [];

    const teamRows = schema.hasTable("teams")
      ? await query<{ id: string; name: string; home_ground: string | null }>(
          `
          SELECT id, name, ${schema.hasColumn("teams", "home_ground") ? "home_ground" : "NULL::text AS home_ground"}
          FROM teams
          WHERE lower(name) LIKE $1
          ORDER BY name
          LIMIT 10
          `,
          [like]
        )
      : [];

    const playerNameExpr = buildPlayerNameExpr(schema);
    const playerRows = schema.hasTable("players")
      ? await query<{ id: string; name: string; role: string }>(
          `
          SELECT id, ${playerNameExpr} AS name, role
          FROM players
          WHERE lower(${playerNameExpr}) LIKE $1
          ORDER BY ${playerNameExpr}
          LIMIT 10
          `,
          [like]
        )
      : [];

    const seriesRows = schema.hasTable("series")
      ? await query<{ id: string; name: string; season: string; format: string; status: string }>(
          `
          SELECT id, name, season, format, status
          FROM series
          WHERE lower(name) LIKE $1
          ORDER BY start_date DESC
          LIMIT 10
          `,
          [like]
        )
      : [];

    const matchResults: SearchResult[] = matchRows.map((row) => ({
      type: "match",
      id: row.id,
      label: `${row.team_a_short_name} vs ${row.team_b_short_name}`,
      href: `/matches/${row.id}`,
      description: `${row.series_name} - ${row.venue}`
    }));

    const teamResults: SearchResult[] = teamRows.map((row) => ({
      type: "team",
      id: row.id,
      label: row.name,
      href: `/teams/${row.id}`,
      description: row.home_ground ?? undefined
    }));

    const playerResults: SearchResult[] = playerRows.map((row) => ({
      type: "player",
      id: row.id,
      label: row.name,
      href: `/players/${row.id}`,
      description: row.role
    }));

    const seriesResults: SearchResult[] = seriesRows.map((row) => ({
      type: "series",
      id: row.id,
      label: `${row.name} ${row.season}`,
      href: `/series/${row.id}`,
      description: `${row.format} - ${row.status}`
    }));

    return [...matchResults, ...teamResults, ...playerResults, ...seriesResults].slice(0, 25);
  });
}

export function getNews(): Promise<NewsArticle[]> {
  return withCache(cacheKeys.matches("news"), revalidateTtl.listings, async () => {
    const schema = await getSchemaInfo();
    if (!schema.hasTable("news_articles")) return [];

    const rows = await query<{
      slug: string;
      title: string;
      summary: string;
      content: string;
      published_at: string | Date;
    }>(
      `
      SELECT slug, title, summary, content, published_at
      FROM news_articles
      ORDER BY published_at DESC
      `
    );

    return rows.map((row) => ({
      slug: row.slug,
      title: row.title,
      summary: row.summary,
      content: row.content,
      publishedAt: toIsoString(row.published_at) ?? new Date().toISOString()
    }));
  });
}

export function getTournamentPlayerStats(): Promise<TournamentPlayerStat[]> {
  return withCache(cacheKeys.matches("tournament-stats"), revalidateTtl.listings, async () => {
    const schema = await getSchemaInfo();
    if (!schema.hasTable("tournament_player_stats")) return [];

    const rows = await query<{
      player_id: string | null;
      player_name: string;
      team_id: string | null;
      team_name: string;
      matches: number;
      innings: number;
      runs: number;
      highest_score: number;
      batting_average: string | number;
      strike_rate: string | number;
      fours: number;
      sixes: number;
      wickets: number;
      bowling_average: string | number;
      economy: string | number;
      overs: string | number;
      best_bowling: string;
    }>(
      `
      SELECT player_id, player_name, team_id, team_name, matches, innings, runs, highest_score, batting_average, strike_rate, fours, sixes, wickets, bowling_average, economy, overs, best_bowling
      FROM tournament_player_stats
      ORDER BY runs DESC
      `
    );

    return rows.map((row) => ({
      playerId: row.player_id ?? "",
      playerName: row.player_name,
      teamId: row.team_id ?? "",
      teamName: row.team_name,
      matches: Number(row.matches),
      innings: Number(row.innings),
      runs: Number(row.runs),
      highestScore: Number(row.highest_score),
      battingAverage: toNumber(row.batting_average),
      strikeRate: toNumber(row.strike_rate),
      fours: Number(row.fours),
      sixes: Number(row.sixes),
      wickets: Number(row.wickets),
      bowlingAverage: toNumber(row.bowling_average),
      economy: toNumber(row.economy),
      overs: toNumber(row.overs),
      bestBowling: row.best_bowling
    }));
  });
}

export async function getNewsArticle(slug: string): Promise<NewsArticle | null> {
  const articles = await getNews();
  return articles.find((article) => article.slug === slug) ?? null;
}
