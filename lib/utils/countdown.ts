const SECOND_IN_MS = 1000;
const MINUTE_IN_SECONDS = 60;
const HOUR_IN_SECONDS = 60 * 60;
const DAY_IN_SECONDS = 24 * HOUR_IN_SECONDS;
const DAY_IN_MS = DAY_IN_SECONDS * SECOND_IN_MS;

export function remainingToStartMs(startAt: string, nowMs: number = Date.now()): number | null {
  const kickoffMs = new Date(startAt).getTime();
  if (Number.isNaN(kickoffMs)) return null;
  return kickoffMs - nowMs;
}

export function startsInValue(startAt: string, nowMs: number = Date.now()): string | null {
  const remainingMs = remainingToStartMs(startAt, nowMs);
  if (remainingMs === null || remainingMs <= 0) return null;

  const totalSeconds = Math.max(Math.floor(remainingMs / SECOND_IN_MS), 0);
  const days = Math.floor(totalSeconds / DAY_IN_SECONDS);
  const hours = Math.floor((totalSeconds % DAY_IN_SECONDS) / HOUR_IN_SECONDS);
  const minutes = Math.floor((totalSeconds % HOUR_IN_SECONDS) / MINUTE_IN_SECONDS);
  const seconds = totalSeconds % MINUTE_IN_SECONDS;

  if (days > 0) {
    return `${days}d ${String(hours).padStart(2, "0")}h ${String(minutes).padStart(2, "0")}m ${String(seconds).padStart(2, "0")}s`;
  }

  return `${hours}h ${String(minutes).padStart(2, "0")}m ${String(seconds).padStart(2, "0")}s`;
}

export function startsInValueStaticOrLive(startAt: string, nowMs: number = Date.now()): {
  value: string | null;
  shouldTick: boolean;
} {
  const remainingMs = remainingToStartMs(startAt, nowMs);
  if (remainingMs === null || remainingMs <= 0) return { value: null, shouldTick: false };

  if (remainingMs < DAY_IN_MS) {
    return { value: startsInValue(startAt, nowMs), shouldTick: true };
  }

  const totalSeconds = Math.max(Math.floor(remainingMs / SECOND_IN_MS), 0);
  const days = Math.floor(totalSeconds / DAY_IN_SECONDS);
  const hours = Math.floor((totalSeconds % DAY_IN_SECONDS) / HOUR_IN_SECONDS);
  return { value: `${days}d ${hours}h`, shouldTick: false };
}
