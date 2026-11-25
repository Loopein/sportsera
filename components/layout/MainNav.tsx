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

type MainNavProps = {
  className?: string;
  mode?: "full" | "links" | "menu";
};

const mainNavIcons: Record<string, IconType> = {
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

export function MainNav({ className, mode = "full" }: MainNavProps): React.ReactElement {
  const pathname = usePathname() ?? "/";
  const primaryNav = MAIN_NAV.filter((item) => item.label !== "More");
  const showLinks = mode === "full" || mode === "links";
  const showMenu = mode === "full" || mode === "menu";

  return (
    <nav className={cn("hidden items-center gap-1.5 lg:flex xl:gap-2", className)} aria-label="Main navigation">
      {showLinks
        ? primaryNav.map((item) => {
            const isActive = isNavItemActive(pathname, item.href);
            const NavIcon = mainNavIcons[item.label] ?? FiActivity;
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={isActive ? "page" : undefined}
                className={cn(
                  "header-nav-link",
                  isActive && "header-nav-link-active"
                )}
              >
                <NavIcon className="header-nav-link-icon h-3.5 w-3.5" aria-hidden="true" />
                <span>{item.label}</span>
              </Link>
            );
          })
        : null}
      {showMenu ? (
        <details
          data-menu-dropdown
          className="group relative"
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
            aria-label="Open more menu"
            className="menu-trigger list-none inline-flex h-9 w-10 items-center justify-center sm:h-10 sm:w-11 [&::-webkit-details-marker]:hidden"
          >
            <AiOutlineAlignRight className="menu-trigger-icon h-5 w-5" aria-hidden="true" />
            <span className="sr-only">More menu</span>
          </summary>
          <div className="header-dropdown-panel absolute right-0 top-[calc(100%+0.5rem)] z-50 w-56 overflow-hidden rounded-xl border border-slate-200 bg-white p-1.5 shadow-2xl">
            {MORE_NAV.map((item) => {
              const isActive = isNavItemActive(pathname, item.href);
              const MenuIcon = moreNavIcons[item.label] ?? FiActivity;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={isActive ? "page" : undefined}
                  className={cn("header-menu-link", isActive && "header-menu-link-active")}
                >
                  <MenuIcon className="header-menu-link-icon h-4 w-4" aria-hidden="true" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
            <div className="mt-1.5 flex justify-center border-t border-slate-200 px-1 pt-2 pb-1">
              <PoweredByLoopein logoHeight={13} />
            </div>
          </div>
        </details>
      ) : null}
    </nav>
  );
}



