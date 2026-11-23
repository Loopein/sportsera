"use client";

import { useEffect, useRef } from "react";
import { GOOGLE_ADSENSE_CLIENT_ID } from "@/lib/constants/site";
import { cn } from "@/lib/utils/text";

export type AdSlotVariant = "leaderboard" | "in-feed" | "rectangle" | "banner-compact" | "native-card";

type AdSlotProps = {
  slot?: string;
  variant?: AdSlotVariant;
  label?: string;
  className?: string;
};

declare global {
  interface Window {
    adsbygoogle?: unknown[];
  }
}

const variantMinHeight: Record<AdSlotVariant, number> = {
  leaderboard: 90,
  "in-feed": 50,
  "banner-compact": 50,
  rectangle: 250,
  "native-card": 90
};

const variantAdFormat: Record<AdSlotVariant, string> = {
  leaderboard: "horizontal",
  "in-feed": "auto",
  "banner-compact": "horizontal",
  rectangle: "rectangle",
  "native-card": "auto"
};

export function AdSlot({
  slot,
  variant = "leaderboard",
  className
}: AdSlotProps): React.ReactElement | null {
  const pushedRef = useRef(false);
  const clientId = GOOGLE_ADSENSE_CLIENT_ID;
  const resolvedSlot = slot?.trim() || process.env.NEXT_PUBLIC_GOOGLE_ADSENSE_DEFAULT_SLOT?.trim() || "";
  const isLiveAdConfig = Boolean(clientId && resolvedSlot);

  useEffect(() => {
    if (!isLiveAdConfig || pushedRef.current) return;
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
      pushedRef.current = true;
    } catch {
      // Ignore AdSense push errors when ad blockers or script delays occur.
    }
  }, [isLiveAdConfig]);

  if (!isLiveAdConfig) return null;

  return (
    <aside aria-label="Advertisement" className={cn("relative w-full", className)}>
      <div className="flex w-full items-center justify-center overflow-hidden">
        <ins
          className="adsbygoogle block w-full overflow-hidden"
          style={{
            display: "block",
            width: "100%",
            minHeight: `${variantMinHeight[variant]}px`
          }}
          data-ad-client={clientId}
          data-ad-slot={resolvedSlot}
          data-ad-format={variantAdFormat[variant]}
          data-full-width-responsive={variant === "banner-compact" ? "false" : "true"}
        />
      </div>
    </aside>
  );
}
