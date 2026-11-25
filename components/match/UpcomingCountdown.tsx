"use client";

import { useEffect, useState } from "react";
import { startsInValueStaticOrLive } from "@/lib/utils/countdown";

type UpcomingCountdownProps = {
  startAt: string;
  className?: string;
  valueClassName?: string;
  fallbackValue?: string;
  prefix?: string;
  showPrefixOnFallback?: boolean;
  compact?: boolean;
};

export function UpcomingCountdown({
  startAt,
  className = "",
  valueClassName = "",
  fallbackValue = "Upcoming",
  prefix = "Starts in",
  showPrefixOnFallback = false,
  compact = false
}: UpcomingCountdownProps): React.ReactElement {
  const [nowMs, setNowMs] = useState<number | null>(null);
  const { value, shouldTick } =
    nowMs === null ? { value: null, shouldTick: false } : startsInValueStaticOrLive(startAt, nowMs, compact);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      setNowMs(Date.now());
    });
    return () => window.cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    if (!shouldTick) return;

    let intervalId: number | undefined;
    const alignDelay = 1000 - (Date.now() % 1000);
    const alignTimeout = window.setTimeout(() => {
      setNowMs(Date.now());
      intervalId = window.setInterval(() => setNowMs(Date.now()), 1000);
    }, alignDelay);

    return () => {
      window.clearTimeout(alignTimeout);
      if (intervalId !== undefined) {
        window.clearInterval(intervalId);
      }
    };
  }, [shouldTick]);
  const shouldShowPrefix = Boolean(prefix) && (value !== null || showPrefixOnFallback);

  return (
    <span className={className}>
      {shouldShowPrefix ? `${prefix} ` : ""}
      <span className={valueClassName}>{value ?? fallbackValue}</span>
    </span>
  );
}
