"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { IconType } from "react-icons";
import { AiOutlineAlignRight } from "react-icons/ai";
import { BiBroadcast } from "react-icons/bi";
import { FiActivity, FiBarChart2, FiCalendar, FiCheckCircle, FiFileText, FiHome, FiLayers, FiSearch, FiUsers, FiVideo } from "react-icons/fi";
import { PoweredByLoopein } from "@/components/shared/LoopeinBranding";
import { ensureGsapRegistered, gsap, prefersReducedMotion } from "@/lib/gsap/client";
import { MAIN_NAV, MORE_NAV } from "@/lib/constants/nav";
import { cn } from "@/lib/utils/text";

const primaryNavIcons: Record<string, IconType> = {
  Home: FiHome,
  Matches: FiCalendar,
  Standings: FiBarChart2,
  News: FiFileText,
  Videos: FiVideo,
  Stats: FiActivity
};

const moreNavIcons: Record<string, IconType> = {
  "Live Center": BiBroadcast,
  Fixtures: FiCalendar,
  Results: FiCheckCircle,
  Series: FiLayers,
  Teams: FiUsers,
  Players: FiUsers,
  Search: FiSearch
};

function isNavItemActive(pathname: string, href: string): boolean {
  if (href === "/") {
    return pathname === "/";
  }

  return pathname === href || pathname.startsWith(`${href}/`);
}

export function MobileNav(): React.ReactElement {
  const pathname = usePathname() ?? "/";
  const primaryNav = MAIN_NAV.filter((item) => item.label !== "More");
  const moreItems = MORE_NAV;

  return (
    <details
      data-menu-dropdown
      className="group relative lg:hidden"
      onToggle={(event) => {
        const detailsEl = event.currentTarget;
        if (!detailsEl.open || prefersReducedMotion()) return;
        ensureGsapRegistered();
        const panel = detailsEl.querySelector<HTMLElement>(".header-dropdown-panel");
        const links = detailsEl.querySelectorAll<HTMLElement>(".header-menu-link");
        if (panel) {
          gsap.fromTo(
            panel,
            { y: -6, scale: 0.98 },
            { y: 0, scale: 1, duration: 0.24, ease: "power3.out", clearProps: "transform" }
          );
        }
        if (links.length) {
          gsap.fromTo(
            links,
            { opacity: 0, x: -5 },
            { opacity: 1, x: 0, duration: 0.2, stagger: 0.016, ease: "power2.out", clearProps: "transform,opacity" }
          );
        }
      }}
    >
      <summary
        aria-label="Open menu"
        className="menu-trigger list-none inline-flex h-9 w-10 items-center justify-center sm:h-10 sm:w-11 [&::-webkit-details-marker]:hidden"
      >
        <AiOutlineAlignRight className="menu-trigger-icon h-5 w-5" aria-hidden="true" />
        <span className="sr-only">Open menu</span>
      </summary>
      <div className="header-dropdown-panel absolute right-0 top-[calc(100%+0.5rem)] z-50 max-h-[calc(100dvh-4.5rem)] w-[min(22rem,calc(100vw-1rem))] overflow-y-auto rounded-xl border border-slate-200 bg-white p-3 shadow-2xl">
        <nav className="grid grid-cols-2 gap-2" aria-label="Primary navigation">
          {primaryNav.map((item) => {
            const isActive = isNavItemActive(pathname, item.href);
            const NavIcon = primaryNavIcons[item.label] ?? FiActivity;
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={isActive ? "page" : undefined}
                className={cn(
                  "header-menu-link rounded-lg bg-slate-50 px-2 py-2 text-left text-xs font-semibold",
                  isActive && "header-menu-link-active"
                )}
              >
                <NavIcon className="header-menu-link-icon h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                <span className="truncate">{item.label}</span>
              </Link>
            );
          })}
        </nav>
        <div className="my-2 h-px bg-slate-200" />
        <p className="text-left text-[10px] font-bold uppercase tracking-wide text-slate-500">More</p>
        <nav className="mt-2 grid grid-cols-2 gap-2" aria-label="More navigation">
          {moreItems.map((item) => {
            const isActive = isNavItemActive(pathname, item.href);
            const MoreIcon = moreNavIcons[item.label] ?? FiActivity;
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={isActive ? "page" : undefined}
                className={cn(
                  "header-menu-link rounded-lg bg-slate-50 px-2 py-2 text-left text-xs font-semibold",
                  isActive && "header-menu-link-active"
                )}
              >
                <MoreIcon className="header-menu-link-icon h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                <span className="truncate">{item.label}</span>
              </Link>
            );
          })}
        </nav>
        <div className="mt-2.5 flex justify-center border-t border-slate-200 pt-2.5">
          <PoweredByLoopein logoHeight={13} />
        </div>
      </div>
    </details>
  );
}



