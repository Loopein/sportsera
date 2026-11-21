import type { MatchStatus } from "@/types/match";

export function formatRunRate(value?: number): string {
  if (value === undefined) return "-";
  return value.toFixed(2);
}

export function statusLabel(status: MatchStatus): string {
  switch (status) {
    case "live":
      return "Live";
    case "innings_break":
      return "Innings Break";
    case "upcoming":
      return "Upcoming";
    case "completed":
      return "Completed";
    default:
      return status;
  }
}

export function getScoreMomentum(
  scoreA?: string,
  scoreB?: string
): { teamAWidth: string; teamBWidth: string } {
  const parseFirstNumber = (score?: string): number => {
    const found = score?.match(/\d+/);
    return found ? Number(found[0]) : 0;
  };
  const a = parseFirstNumber(scoreA);
  const b = parseFirstNumber(scoreB);
  const total = Math.max(a + b, 1);
  return {
    teamAWidth: `${Math.max((a / total) * 100, 8)}%`,
    teamBWidth: `${Math.max((b / total) * 100, 8)}%`
  };
}
