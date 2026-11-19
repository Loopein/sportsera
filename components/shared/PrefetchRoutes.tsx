"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";

const TOP_PREFETCH_ROUTES = ["/live", "/matches", "/rankings"] as const;

type PrefetchRoutesProps = {
  routes?: readonly string[];
};

export function PrefetchRoutes({ routes = TOP_PREFETCH_ROUTES }: PrefetchRoutesProps): null {
  const router = useRouter();
  const pathname = usePathname() ?? "/";

  useEffect(() => {
    if (routes.length === 0) return;

    const nav = navigator as Navigator & { connection?: { saveData?: boolean } };
    if (nav.connection?.saveData) return;

    let cancelled = false;
    const run = () => {
      for (const href of routes) {
        if (cancelled) return;
        if (!href || href === pathname) continue;
        try {
          router.prefetch(href);
        } catch {
          // Ignore prefetch errors; navigation will still fetch on demand.
        }
      }
    };

    const win = window as Window & {
      requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => number;
      cancelIdleCallback?: (id: number) => void;
    };

    if (typeof win.requestIdleCallback === "function") {
      const id = win.requestIdleCallback(run, { timeout: 2500 });
      return () => {
        cancelled = true;
        win.cancelIdleCallback?.(id);
      };
    }

    const timer = window.setTimeout(run, 1200);
    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, [router, pathname, routes]);

  return null;
}
