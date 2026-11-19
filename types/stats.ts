export type StatsCategory =
  | "most-runs"
  | "most-wickets"
  | "best-strike-rate"
  | "best-economy"
  | "most-sixes";

export type TournamentPlayerStat = {
  playerId: string;
  playerName: string;
  teamId: string;
  teamName: string;
  matches: number;
  innings: number;
  runs: number;
  highestScore: number;
  battingAverage: number;
  strikeRate: number;
  fours: number;
  sixes: number;
  wickets: number;
  bowlingAverage: number;
  economy: number;
  overs: number;
  bestBowling: string;
};
