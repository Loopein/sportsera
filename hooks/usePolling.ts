"use client";

import { useEffect, useRef } from "react";

type PollingOptions = {
  leading?: boolean;
};

export function usePolling(
  callback: () => void | Promise<void>,
  intervalMs: number,
  options: PollingOptions = {}
): void {
  const { leading = true } = options;
  const callbackRef = useRef(callback);
  callbackRef.current = callback;

  useEffect(() => {
    const tick = () => void callbackRef.current();
    if (leading) tick();
    const id = window.setInterval(tick, intervalMs);
    return () => window.clearInterval(id);
  }, [intervalMs, leading]);
}
