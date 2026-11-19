export const cacheKeys = {
  live: "live:list",
  matches: (filter: string) => `matches:${filter}`,
  matchSummary: (matchId: string) => `match:summary:${matchId}`,
  scorecard: (matchId: string) => `match:scorecard:${matchId}`,
  commentary: (matchId: string) => `match:commentary:${matchId}`,
  stats: (matchId: string) => `match:stats:${matchId}`,
  series: "series:list",
  team: (teamId: string) => `team:${teamId}`,
  player: (playerId: string) => `player:${playerId}`,
  rankings: "rankings:list",
  standings: "standings:list",
  search: (query: string) => `search:${query}`
} as const;
