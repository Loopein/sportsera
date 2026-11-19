import type { MatchSummary } from "@/types/match";

export function matchTitle(match: MatchSummary): string {
  return `${match.teamA.shortName} vs ${match.teamB.shortName}`;
}
