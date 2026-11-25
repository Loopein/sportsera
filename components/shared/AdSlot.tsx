"use client";

import { useEffect, useRef, useState } from "react";
import { FiX } from "react-icons/fi";
import { LoopeinLoopIcon } from "@/components/shared/LoopeinBranding";
import { GOOGLE_ADSENSE_CLIENT_ID, SITE_NAME, SITE_POWERED_BY } from "@/lib/constants/site";
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

const variantWrapperClass: Record<AdSlotVariant, string> = {
  leaderboard: "mx-auto w-full max-w-3xl px-3.5 py-2",
  "in-feed": "mx-auto w-full max-w-2xl px-3 py-1.5",
  "banner-compact": "w-full px-2.5 py-1",
  rectangle: "w-full p-3.5",
  "native-card": "w-full p-3.5"
};

const variantDimensionBadge: Record<AdSlotVariant, string> = {
  leaderboard: "728×90",
  "in-feed": "320×50",
  "banner-compact": "300×40",
  rectangle: "300×250",
  "native-card": "Fluid Card"
};

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
  label = "Sponsored",
  className
}: AdSlotProps): React.ReactElement | null {
  const [dismissed, setDismissed] = useState(false);
  const pushedRef = useRef(false);
  const clientId = GOOGLE_ADSENSE_CLIENT_ID;
  const resolvedSlot = slot?.trim() || process.env.NEXT_PUBLIC_GOOGLE_ADSENSE_DEFAULT_SLOT?.trim() || "";
  const isLiveAdConfig = Boolean(clientId && resolvedSlot);

  useEffect(() => {
    if (!isLiveAdConfig || pushedRef.current || dismissed) return;
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
      pushedRef.current = true;
    } catch {
      // Ignore AdSense push errors when ad blockers or script delays occur.
    }
  }, [isLiveAdConfig, dismissed]);

  if (dismissed) return null;

  return (
    <aside
      aria-label="Advertisement"
      className={cn(
        "surface-card relative rounded-xl",
        variant === "rectangle" && "rounded-2xl",
        variant === "native-card" && "rounded-2xl",
        variantWrapperClass[variant],
        className
      )}
    >
      {isLiveAdConfig ? (
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
      ) : variant === "rectangle" ? (
        <div className="flex min-h-[110px] flex-col justify-between gap-2.5">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-1.5">
              <span className="shrink-0 rounded bg-brand-600 px-1.5 py-0.5 text-[9px] font-extrabold uppercase tracking-wider text-white">
                Ad
              </span>
              <span className="rounded-md border border-slate-200 bg-white px-1.5 py-0.5 text-[9px] font-bold tabular-nums text-slate-500">
                {variantDimensionBadge.rectangle}
              </span>
            </div>
            <button
              type="button"
              onClick={() => setDismissed(true)}
              aria-label="Dismiss advertisement"
              className="inline-flex h-5 w-5 items-center justify-center rounded-md text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
            >
              <FiX className="h-3 w-3" aria-hidden="true" />
            </button>
          </div>
          <div className="my-auto rounded-xl border border-dashed border-slate-200/90 bg-white/80 px-3 py-3 text-center">
            <p className="text-xs font-extrabold text-slate-900">{label}</p>
            <p className="mt-1 inline-flex items-center justify-center gap-1.5 text-[11px] font-medium text-slate-500">
              <LoopeinLoopIcon className="h-3.5 w-auto shrink-0" />
              <span>
                {SITE_NAME} Display Unit · {SITE_POWERED_BY} Ad Network
              </span>
            </p>
          </div>
          <div className="flex items-center justify-between text-[10px] font-semibold text-slate-400">
            <span>Google AdSense Ready</span>
            <span className="rounded bg-brand-50 px-1.5 py-0.5 text-brand-700">Sidebar Box</span>
          </div>
        </div>
      ) : variant === "native-card" ? (
        <div className="flex min-h-[76px] items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-brand-200/80 bg-brand-50 text-[10px] font-black uppercase tracking-wider text-brand-700">
              Ad
            </div>
            <div className="min-w-0">
              <p className="truncate text-xs font-extrabold text-slate-900 sm:text-sm">{label}</p>
              <p className="mt-0.5 flex items-center gap-1.5 truncate text-[11px] font-medium text-slate-500">
                <LoopeinLoopIcon className="h-3.5 w-auto shrink-0" />
                <span className="truncate">
                  {SITE_NAME} Native Partner Placement · Powered by {SITE_POWERED_BY}
                </span>
              </p>
            </div>
          </div>
          <div className="flex shrink-0 items-center gap-1.5">
            <span className="hidden rounded-full border border-brand-200/80 bg-brand-50 px-2 py-0.5 text-[10px] font-bold text-brand-700 sm:inline-flex">
              {variantDimensionBadge["native-card"]}
            </span>
            <button
              type="button"
              onClick={() => setDismissed(true)}
              aria-label="Dismiss advertisement"
              className="inline-flex h-6 w-6 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
            >
              <FiX className="h-3.5 w-3.5" aria-hidden="true" />
            </button>
          </div>
        </div>
      ) : variant === "banner-compact" ? (
        <div className="flex min-h-[28px] items-center justify-between gap-2">
          <div className="flex min-w-0 items-center gap-1.5">
            <span className="shrink-0 rounded bg-brand-50 px-1.5 py-0.5 text-[8px] font-extrabold uppercase tracking-wider text-brand-700 ring-1 ring-brand-200/80">
              Ad
            </span>
            <p className="flex min-w-0 items-center gap-1 truncate text-[11px] font-semibold text-slate-700">
              <span className="truncate font-bold text-slate-900">{label}</span>
              <span className="mx-0.5 text-slate-300">·</span>
              <LoopeinLoopIcon className="h-3.5 w-auto shrink-0" />
              <span className="shrink-0 text-slate-500">{SITE_POWERED_BY}</span>
            </p>
          </div>
          <div className="flex shrink-0 items-center gap-1">
            <span className="hidden rounded border border-slate-200 bg-slate-50 px-1.5 py-0.5 text-[9px] font-bold tabular-nums text-slate-500 sm:inline-flex">
              {variantDimensionBadge["banner-compact"]}
            </span>
            <button
              type="button"
              onClick={() => setDismissed(true)}
              aria-label="Dismiss advertisement"
              className="inline-flex h-5 w-5 items-center justify-center rounded-md text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
            >
              <FiX className="h-3 w-3" aria-hidden="true" />
            </button>
          </div>
        </div>
      ) : (
        <div
          className={cn(
            "flex items-center justify-between gap-2.5",
            variant === "leaderboard" ? "min-h-[40px] sm:min-h-[46px]" : "min-h-[34px]"
          )}
        >
          <div className="flex min-w-0 items-center gap-2">
            <span
              className={cn(
                "shrink-0 rounded px-1.5 py-0.5 text-[9px] font-extrabold uppercase tracking-wider",
                variant === "leaderboard"
                  ? "bg-gradient-to-r from-[#060c3a] to-brand-600 text-white"
                  : "bg-brand-50 text-brand-700 ring-1 ring-brand-200/80"
              )}
            >
              Sponsored
            </span>
            <p className="flex min-w-0 items-center gap-1.5 truncate text-[11px] font-semibold text-slate-600 sm:text-xs">
              <span className="truncate font-bold text-slate-800">{label}</span>
              <span className="hidden min-w-0 items-center gap-1.5 sm:inline-flex">
                <span className="text-slate-300">·</span>
                <LoopeinLoopIcon className="h-3.5 w-auto shrink-0" />
                <span className="truncate">
                  {SITE_NAME} Google Ads ({SITE_POWERED_BY})
                </span>
              </span>
            </p>
          </div>

          <div className="flex shrink-0 items-center gap-1.5">
            {variant === "leaderboard" ? (
              <span className="hidden rounded-full border border-brand-200/80 bg-brand-50/70 px-2 py-0.5 text-[10px] font-bold text-brand-700 sm:inline-flex">
                Banner Unit
              </span>
            ) : null}
            <span className="hidden rounded-md border border-slate-200 bg-slate-50 px-1.5 py-0.5 text-[9px] font-bold tabular-nums text-slate-500 sm:inline">
              {variantDimensionBadge[variant]}
            </span>
            <button
              type="button"
              onClick={() => setDismissed(true)}
              aria-label="Dismiss advertisement"
              className="inline-flex h-5 w-5 items-center justify-center rounded-md text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
            >
              <FiX className="h-3 w-3" aria-hidden="true" />
            </button>
          </div>
        </div>
      )}
    </aside>
  );
}
