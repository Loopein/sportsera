import { describe, expect, it } from "vitest";
import { startsInCompactValue, startsInValue, startsInValueStaticOrLive } from "@/lib/utils/countdown";

describe("countdown utils", () => {
  it("formats multi-day upcoming kickoffs with days, hours, minutes, and seconds", () => {
    const nowMs = Date.parse("2026-11-22T00:00:00.000Z");
    const threeDaysAway = new Date(nowMs + (3 * 86_400 + 2 * 3_600 + 5 * 60 + 9) * 1000).toISOString();

    expect(startsInValue(threeDaysAway, nowMs)).toBe("3d 02h 05m 09s");
    expect(startsInValueStaticOrLive(threeDaysAway, nowMs)).toEqual({
      value: "3d 02h 05m 09s",
      shouldTick: true
    });
    expect(startsInCompactValue(threeDaysAway, nowMs)).toBe("3d");
    expect(startsInValueStaticOrLive(threeDaysAway, nowMs, true)).toEqual({
      value: "3d",
      shouldTick: true
    });
  });

  it("formats under-24h upcoming kickoffs as full and compact countdowns", () => {
    const nowMs = Date.parse("2026-11-22T00:00:00.000Z");
    const fourHoursAway = new Date(nowMs + (4 * 3_600 + 12 * 60 + 30) * 1000).toISOString();
    const twentyMinutesAway = new Date(nowMs + (20 * 60 + 15) * 1000).toISOString();
    const thirtySecondsAway = new Date(nowMs + 30 * 1000).toISOString();

    expect(startsInValueStaticOrLive(fourHoursAway, nowMs)).toEqual({
      value: "4h 12m 30s",
      shouldTick: true
    });
    expect(startsInCompactValue(fourHoursAway, nowMs)).toBe("4h");
    expect(startsInCompactValue(twentyMinutesAway, nowMs)).toBe("20m");
    expect(startsInCompactValue(thirtySecondsAway, nowMs)).toBe("30s");
  });

  it("returns null once kickoff time has passed", () => {
    const nowMs = Date.parse("2026-11-22T00:00:00.000Z");
    const past = new Date(nowMs - 60_000).toISOString();

    expect(startsInValueStaticOrLive(past, nowMs)).toEqual({
      value: null,
      shouldTick: false
    });
    expect(startsInValueStaticOrLive(past, nowMs, true)).toEqual({
      value: null,
      shouldTick: false
    });
  });
});
