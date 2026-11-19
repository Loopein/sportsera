import { describe, expect, it } from "vitest";
import { formatRunRate, statusLabel } from "@/lib/utils/score";

describe("score utils", () => {
  it("formats run rate with 2 decimal places", () => {
    expect(formatRunRate(6.1234)).toBe("6.12");
  });

  it("returns placeholder for missing run rate", () => {
    expect(formatRunRate(undefined)).toBe("-");
  });

  it("maps match status labels", () => {
    expect(statusLabel("innings_break")).toBe("Innings Break");
  });
});
