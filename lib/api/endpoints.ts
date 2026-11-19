export const API_ENDPOINTS = {
  live: "/api/live",
  matches: "/api/matches",
  match: (matchId: string) => `/api/matches/${matchId}`,
  scorecard: (matchId: string) => `/api/matches/${matchId}/scorecard`,
  commentary: (matchId: string) => `/api/matches/${matchId}/commentary`,
  stats: (matchId: string) => `/api/matches/${matchId}/stats`,
  series: "/api/series",
  seriesById: (seriesId: string) => `/api/series/${seriesId}`,
  teamById: (teamId: string) => `/api/teams/${teamId}`,
  playerById: (playerId: string) => `/api/players/${playerId}`,
  rankings: "/api/rankings",
  search: "/api/search"
} as const;
