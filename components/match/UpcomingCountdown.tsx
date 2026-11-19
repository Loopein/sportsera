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
};

export function UpcomingCountdown({
  startAt,
  className = "",
  valueClassName = "",
  fallbackValue = "Upcoming",
  prefix = "Starts in",
  showPrefixOnFallback = false
}: UpcomingCountdownProps): React.ReactElement {
  const [nowMs, setNowMs] = useState<number | null>(null);
  const { value, shouldTick } =
    nowMs === null ? { value: null, shouldTick: false } : startsInValueStaticOrLive(startAt, nowMs);

  useEffect(() => {
    setNowMs(Date.now());
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
  const shouldShowPrefix = value !== null || showPrefixOnFallback;

  return (
    <span className={className}>
      {shouldShowPrefix ? `${prefix} ` : ""}
      <span className={valueClassName}>{value ?? fallbackValue}</span>
    </span>
  );
}
