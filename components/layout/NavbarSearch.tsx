"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { FiSearch, FiX } from "react-icons/fi";
import { cn } from "@/lib/utils/text";

export function NavbarSearch(): React.ReactElement {
  const router = useRouter();
  const pathname = usePathname() ?? "/";
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const containerRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const isSearchPage = pathname === "/search" || pathname.startsWith("/search/");

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!open) return;
    inputRef.current?.focus();

    const onPointerDown = (event: MouseEvent): void => {
      const target = event.target as Node | null;
      if (target && containerRef.current && !containerRef.current.contains(target)) {
        setOpen(false);
      }
    };

    const onKeyDown = (event: KeyboardEvent): void => {
      if (event.key === "Escape") {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    const trimmed = query.trim();
    setOpen(false);
    router.push(trimmed ? `/search?q=${encodeURIComponent(trimmed)}` : "/search");
  };

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        aria-label={open ? "Close search" : "Search"}
        aria-expanded={open}
        title="Search"
        className={cn(
          "menu-trigger inline-flex h-10 w-10 items-center justify-center",
          (open || isSearchPage) && "text-brand-600"
        )}
      >
        {open ? (
          <FiX className="h-4 w-4" aria-hidden="true" />
        ) : (
          <FiSearch className="h-4 w-4" aria-hidden="true" />
        )}
      </button>

      {open ? (
        <div className="header-dropdown-panel fixed inset-x-2 top-[4.15rem] z-50 rounded-xl border border-slate-200 bg-white p-2 shadow-2xl sm:absolute sm:inset-x-auto sm:right-0 sm:top-[calc(100%+0.5rem)] sm:w-96">
          <form onSubmit={handleSubmit} className="flex items-center gap-1.5" role="search">
            <label htmlFor="navbar-search-input" className="sr-only">
              Search matches, teams, players, or leagues
            </label>
            <div className="relative flex flex-1 items-center">
              <FiSearch
                className="pointer-events-none absolute left-3 h-4 w-4 text-slate-400"
                aria-hidden="true"
              />
              <input
                ref={inputRef}
                id="navbar-search-input"
                type="search"
                name="q"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search matches, teams, players, leagues..."
                className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2 pl-9 pr-3 text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:border-brand-400 focus:outline-none"
              />
            </div>
            <button
              type="submit"
              className="inline-flex h-9 shrink-0 items-center justify-center rounded-lg bg-brand-600 px-3.5 text-xs font-extrabold uppercase tracking-wider text-white transition hover:bg-brand-700"
            >
              Go
            </button>
          </form>
        </div>
      ) : null}
    </div>
  );
}
