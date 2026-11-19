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
    let inFlight = false;
    let lastRunAt = leading ? 0 : Date.now();

    const tick = async (force = false) => {
      if (inFlight) return;
      if (!force && document.visibilityState === "hidden") return;
      inFlight = true;
      lastRunAt = Date.now();
      try {
        await callbackRef.current();
      } finally {
        inFlight = false;
      }
    };

    if (leading) {
      void tick(true);
    }

    const id = window.setInterval(() => {
      void tick();
    }, intervalMs);

    const onVisibilityChange = () => {
      if (document.visibilityState === "visible" && Date.now() - lastRunAt >= intervalMs) {
        void tick(true);
      }
    };

    document.addEventListener("visibilitychange", onVisibilityChange);
    return () => {
      window.clearInterval(id);
      document.removeEventListener("visibilitychange", onVisibilityChange);
    };
  }, [intervalMs, leading]);
}
