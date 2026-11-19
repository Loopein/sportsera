"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { MAIN_NAV, MORE_NAV } from "@/lib/constants/nav";

const DEFAULT_PREFETCH_ROUTES = Array.from(
  new Set([...MAIN_NAV, ...MORE_NAV].map((item) => item.href))
);

type PrefetchRoutesProps = {
  routes?: readonly string[];
};

export function PrefetchRoutes({ routes = DEFAULT_PREFETCH_ROUTES }: PrefetchRoutesProps): null {
  const router = useRouter();
  const pathname = usePathname() ?? "/";

  useEffect(() => {
    if (routes.length === 0) return;

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

    run();
    return () => {
      cancelled = true;
    };
  }, [router, pathname, routes]);

  return null;
}
