"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { IconType } from "react-icons";
import { AiOutlineAlignRight } from "react-icons/ai";
import { BiBroadcast } from "react-icons/bi";
import { FiActivity, FiBarChart2, FiCalendar, FiCheckCircle, FiFileText, FiHome, FiLayers, FiSearch, FiUsers, FiVideo } from "react-icons/fi";
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
    <nav className={cn("hidden items-center gap-2 lg:flex", className)} aria-label="Main navigation">
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
                  isActive && "border-[#b8c5ed] bg-[#edf2ff] text-[rgb(6,12,58)] shadow-[0_10px_18px_rgba(6,12,58,0.16)]"
                )}
              >
                <NavIcon className={cn("header-nav-link-icon h-3.5 w-3.5", isActive && "text-[rgb(6,12,58)]")} aria-hidden="true" />
                <span>{item.label}</span>
              </Link>
            );
          })
        : null}
      {showMenu ? (
        <details data-menu-dropdown className="group relative">
          <summary
            aria-label="Open more menu"
            className="menu-trigger list-none inline-flex h-10 w-11 items-center justify-center [&::-webkit-details-marker]:hidden"
          >
            <AiOutlineAlignRight className="menu-trigger-icon h-5 w-5" aria-hidden="true" />
            <span className="sr-only">More menu</span>
          </summary>
          <div className="header-dropdown-panel absolute right-0 top-[calc(100%+0.5rem)] z-50 w-48 overflow-hidden rounded-xl border border-slate-200 bg-white p-1.5 shadow-lg">
            {MORE_NAV.map((item) => {
              const isActive = isNavItemActive(pathname, item.href);
              const MenuIcon = moreNavIcons[item.label] ?? FiActivity;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={isActive ? "page" : undefined}
                  className={cn("header-menu-link", isActive && "bg-[#edf2ff] text-[rgb(6,12,58)]")}
                >
                  <MenuIcon className={cn("header-menu-link-icon h-4 w-4", isActive && "text-[rgb(6,12,58)]")} aria-hidden="true" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>
        </details>
      ) : null}
    </nav>
  );
}



