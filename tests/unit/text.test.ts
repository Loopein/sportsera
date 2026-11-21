import { describe, expect, it } from "vitest";
import { formatTournamentShortName } from "@/lib/utils/text";

describe("formatTournamentShortName", () => {
  it("maps major tournaments across sports to standard abbreviations", () => {
    expect(formatTournamentShortName("English Premier League")).toBe("EPL");
    expect(formatTournamentShortName("Bangladesh Premier League 2026")).toBe("BPL");
    expect(formatTournamentShortName("UEFA Champions League")).toBe("UCL");
    expect(formatTournamentShortName("Premier League T20 2026")).toBe("PLT20");
    expect(formatTournamentShortName("World Test Championship 2026")).toBe("WTC");
    expect(formatTournamentShortName("NBA Finals · Game 6")).toBe("NBA");
    expect(formatTournamentShortName("Formula 1 Monaco Grand Prix")).toBe("F1");
    expect(formatTournamentShortName("Valorant Champions Tour Masters")).toBe("VCT");
  });

  it("derives clean initials for unmapped tournament names without falling back to sport names", () => {
    expect(formatTournamentShortName("Champions Trophy 2026")).toBe("CT");
    expect(formatTournamentShortName("Ashes")).toBe("ASHES");
    expect(formatTournamentShortName("")).toBe("");
  });
});
