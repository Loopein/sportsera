import { getMatchCommentary, getMatchScorecard, getMatchStats, getMatchSummary } from "@/lib/api/read";

export async function fetchMatchSummary(matchId: string) {
  return getMatchSummary(matchId);
}

export async function fetchMatchScorecard(matchId: string) {
  return getMatchScorecard(matchId);
}

export async function fetchMatchCommentary(matchId: string) {
  return getMatchCommentary(matchId);
}

export async function fetchMatchStats(matchId: string) {
  return getMatchStats(matchId);
}
