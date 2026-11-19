import { fetchMatchCommentary, fetchMatchScorecard, fetchMatchStats, fetchMatchSummary } from "@/features/match/api";

export const matchQueries = {
  summary: fetchMatchSummary,
  scorecard: fetchMatchScorecard,
  commentary: fetchMatchCommentary,
  stats: fetchMatchStats
};
