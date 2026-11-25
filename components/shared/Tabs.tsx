"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ensureGsapRegistered, gsap, prefersReducedMotion } from "@/lib/gsap/client";
import { cn } from "@/lib/utils/text";

type TabItem = {
  href: string;
  label: string;
  icon?: React.ReactNode;
  isActive?: boolean;
};

type TabsProps = {
  tabs: TabItem[];
  align?: "start" | "center";
  fullWidth?: boolean;
  groupId?: string;
};

type PillRect = {
  left: number;
  top: number;
  width: number;
  height: number;
};

const lastIndicatorByGroup = new Map<string, PillRect>();

function measureRelativeRect(el: HTMLElement, container: HTMLElement): PillRect {
  const elRect = el.getBoundingClientRect();
  const containerRect = container.getBoundingClientRect();
  return {
    left: elRect.left - containerRect.left - container.clientLeft,
    top: elRect.top - containerRect.top - container.clientTop,
    width: elRect.width,
    height: elRect.height
  };
}

export function Tabs({
  tabs,
  align = "start",
  fullWidth = false,
  groupId
}: TabsProps): React.ReactElement {
  const navRef = useRef<HTMLElement | null>(null);
  const listRef = useRef<HTMLUListElement | null>(null);
  const indicatorRef = useRef<HTMLSpanElement | null>(null);
  const hoverIndicatorRef = useRef<HTMLSpanElement | null>(null);
  const hasMountedRef = useRef(false);
  const hoverVisibleRef = useRef(false);
  const [indicatorReady, setIndicatorReady] = useState(false);
  const [pendingSelection, setPendingSelection] = useState<{ fromHref: string; toHref: string } | null>(null);

  const activeHref = tabs.find((tab) => tab.isActive)?.href ?? "";
  const effectiveHref =
    pendingSelection && pendingSelection.fromHref === activeHref ? pendingSelection.toHref : activeHref;
  const groupKey = groupId ?? tabs.map((tab) => tab.href).join("|");

  useEffect(() => {
    ensureGsapRegistered();
    const list = listRef.current;
    const indicator = indicatorRef.current;
    if (!list || !indicator) return;

    const applyIndicator = (immediate: boolean): void => {
      const activeLink = list.querySelector<HTMLElement>('[data-tab-active="true"]');
      if (!activeLink) {
        gsap.set(indicator, { opacity: 0 });
        setIndicatorReady(true);
        return;
      }

      const nextRect = measureRelativeRect(activeLink, list);
      const prevRect = lastIndicatorByGroup.get(groupKey);
      const shouldReduce = prefersReducedMotion();

      if (!immediate && !shouldReduce && prevRect && (Math.abs(prevRect.left - nextRect.left) > 1 || Math.abs(prevRect.width - nextRect.width) > 1)) {
        gsap.fromTo(
          indicator,
          {
            x: prevRect.left,
            y: prevRect.top,
            width: prevRect.width,
            height: prevRect.height,
            opacity: 1
          },
          {
            x: nextRect.left,
            y: nextRect.top,
            width: nextRect.width,
            height: nextRect.height,
            opacity: 1,
            duration: 0.42,
            ease: "power3.out",
            overwrite: "auto"
          }
        );
      } else if (!immediate && !shouldReduce && hasMountedRef.current) {
        gsap.to(indicator, {
          x: nextRect.left,
          y: nextRect.top,
          width: nextRect.width,
          height: nextRect.height,
          opacity: 1,
          duration: 0.38,
          ease: "power3.out",
          overwrite: "auto"
        });
      } else {
        gsap.set(indicator, {
          x: nextRect.left,
          y: nextRect.top,
          width: nextRect.width,
          height: nextRect.height,
          opacity: 1
        });
      }

      lastIndicatorByGroup.set(groupKey, nextRect);
      hasMountedRef.current = true;
      setIndicatorReady(true);

      const nav = navRef.current;
      if (nav) {
        const maxScroll = Math.max(0, nav.scrollWidth - nav.clientWidth);
        const targetScroll = Math.max(
          0,
          Math.min(maxScroll, nextRect.left - nav.clientWidth / 2 + nextRect.width / 2)
        );
        if (immediate || shouldReduce) {
          nav.scrollLeft = targetScroll;
        } else {
          gsap.to(nav, {
            scrollTo: { x: targetScroll, autoKill: true },
            duration: 0.42,
            ease: "power3.out"
          });
        }
      }
    };

    const frame = window.requestAnimationFrame(() => applyIndicator(false));
    const onSettledResize = (): void => applyIndicator(true);
    window.addEventListener("resize", onSettledResize, { passive: true });

    let resizeObserver: ResizeObserver | null = null;
    if (typeof ResizeObserver !== "undefined") {
      resizeObserver = new ResizeObserver(() => {
        if (hasMountedRef.current) {
          applyIndicator(true);
        }
      });
      resizeObserver.observe(list);
    }

    let cancelledFonts = false;
    void document.fonts?.ready.then(() => {
      if (!cancelledFonts && hasMountedRef.current) {
        applyIndicator(true);
      }
    });

    return () => {
      cancelledFonts = true;
      window.cancelAnimationFrame(frame);
      window.removeEventListener("resize", onSettledResize);
      resizeObserver?.disconnect();
    };
  }, [effectiveHref, groupKey]);

  const hideHoverPill = (): void => {
    const hoverEl = hoverIndicatorRef.current;
    if (!hoverEl) return;
    hoverVisibleRef.current = false;
    if (prefersReducedMotion()) {
      gsap.set(hoverEl, { opacity: 0 });
      return;
    }
    gsap.to(hoverEl, { opacity: 0, duration: 0.18, ease: "power2.out", overwrite: "auto" });
  };

  const showHoverPill = (target: HTMLElement): void => {
    const list = listRef.current;
    const hoverEl = hoverIndicatorRef.current;
    if (!list || !hoverEl || prefersReducedMotion()) return;
    ensureGsapRegistered();
    const rect = measureRelativeRect(target, list);

    if (hoverVisibleRef.current) {
      gsap.to(hoverEl, {
        x: rect.left,
        y: rect.top,
        width: rect.width,
        height: rect.height,
        scale: 1,
        opacity: 1,
        duration: 0.26,
        ease: "power3.out",
        overwrite: "auto"
      });
    } else {
      hoverVisibleRef.current = true;
      gsap.fromTo(
        hoverEl,
        {
          x: rect.left,
          y: rect.top,
          width: rect.width,
          height: rect.height,
          scale: 0.96,
          opacity: 0
        },
        {
          scale: 1,
          opacity: 1,
          duration: 0.24,
          ease: "power3.out",
          overwrite: "auto"
        }
      );
    }
  };

  return (
    <nav
      ref={navRef}
      aria-label="Page tabs"
      className="w-full max-w-full overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
    >
      <ul
        ref={listRef}
        onMouseLeave={hideHoverPill}
        className={cn(
          "surface-card relative flex items-center gap-1 p-1 sm:gap-1.5 sm:p-1.5",
          fullWidth ? "w-full" : "w-max min-w-max",
          !fullWidth && align === "center" && "mx-auto"
        )}
      >
        <span
          ref={hoverIndicatorRef}
          aria-hidden="true"
          className="pointer-events-none absolute top-0 left-0 rounded-xl bg-brand-50 opacity-0"
        />
        <span
          ref={indicatorRef}
          aria-hidden="true"
          className="pointer-events-none absolute top-0 left-0 rounded-xl bg-brand-600 opacity-0 shadow-sm"
        />
        {tabs.map((tab) => {
          const isSelected = tab.href === effectiveHref;
          return (
            <li key={tab.href} className={cn("relative z-10", fullWidth && "min-w-0 flex-1")}>
              <Link
                href={tab.href}
                data-tab-active={isSelected ? "true" : undefined}
                onClick={() => {
                  hideHoverPill();
                  if (tab.href !== effectiveHref) {
                    setPendingSelection({ fromHref: activeHref, toHref: tab.href });
                  }
                }}
                onMouseEnter={(event) => {
                  if (isSelected) {
                    hideHoverPill();
                  } else {
                    showHoverPill(event.currentTarget);
                  }
                }}
                onPointerDown={(event) => {
                  if (prefersReducedMotion()) return;
                  ensureGsapRegistered();
                  gsap.to(event.currentTarget, {
                    scale: 0.97,
                    duration: 0.12,
                    ease: "power2.out",
                    overwrite: "auto"
                  });
                }}
                onPointerUp={(event) => {
                  if (prefersReducedMotion()) return;
                  gsap.to(event.currentTarget, {
                    scale: 1,
                    duration: 0.22,
                    ease: "back.out(1.7)",
                    clearProps: "transform",
                    overwrite: "auto"
                  });
                }}
                className={cn(
                  "rounded-xl px-3 py-1.5 text-xs font-semibold transition-colors duration-200 sm:px-3.5 sm:py-2 sm:text-sm",
                  fullWidth
                    ? "flex w-full min-w-0 items-center justify-center gap-1.5 text-center"
                    : "inline-flex items-center justify-center gap-1.5 whitespace-nowrap",
                  isSelected
                    ? indicatorReady
                      ? "bg-transparent text-white"
                      : "bg-brand-600 text-white shadow-sm"
                    : "text-slate-700 hover:text-brand-700"
                )}
              >
                {tab.icon}
                <span className={cn(fullWidth && "truncate")}>{tab.label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
