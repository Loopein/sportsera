import type { LiveMatch } from "@/types/match";

export function toScoreStripLabel(match: LiveMatch): string {
  return `${match.teamA.shortName} ${match.teamA.score ?? "-"} | ${match.teamB.shortName} ${match.teamB.score ?? "-"}`;
}
