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
