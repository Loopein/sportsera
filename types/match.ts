export type MatchStatus = "live" | "innings_break" | "upcoming" | "completed";

export type TeamScoreInfo = {
  id: string;
  name: string;
  shortName: string;
  logo?: string;
  score?: string;
};

export type LiveMatch = {
  id: string;
  slug: string;
  status: MatchStatus;
  format: string;
  seriesName: string;
  venue: string;
  teamA: TeamScoreInfo;
  teamB: TeamScoreInfo;
  summary: string;
  startAt?: string;
  lastUpdatedAt: string;
};

export type MatchSummary = {
  id: string;
  status: MatchStatus;
  format: string;
  seriesName: string;
  venue: string;
  toss?: string;
  teamA: TeamScoreInfo;
  teamB: TeamScoreInfo;
  currentRunRate?: number;
  requiredRunRate?: number;
  resultText?: string;
  startAt?: string;
  lastUpdatedAt?: string;
  target?: number;
  overs?: string;
  currentBatters?: Array<{ name: string; runs: number; balls: number }>;
  currentBowlers?: Array<{ name: string; overs: string; runs: number; wickets: number }>;
  recentOvers?: string[];
  playingXI?: {
    teamA?: string[];
    teamB?: string[];
  };
};

export type ScorecardBatter = {
  name: string;
  dismissal: string;
  runs: number;
  balls: number;
  fours: number;
  sixes: number;
  strikeRate: number;
};

export type ScorecardBowler = {
  name: string;
  overs: string;
  maidens: number;
  runs: number;
  wickets: number;
  economy: number;
};

export type ScorecardInnings = {
  name: string;
  total: string;
  extras: string;
  fallOfWickets: string[];
  batters: ScorecardBatter[];
  bowlers: ScorecardBowler[];
};

export type Scorecard = {
  matchId: string;
  innings: ScorecardInnings[];
};

export type CommentaryItem = {
  id: string;
  over: string;
  ball: string;
  text: string;
  runs: number;
  timestamp: string;
};

export type MatchStats = {
  matchId: string;
  runRate: number;
  requiredRunRate?: number;
  partnerships: Array<{ wickets: string; runs: number; balls: number }>;
  wagonWheel: Array<{ zone: string; runs: number }>;
  matchupNotes: string[];
};
