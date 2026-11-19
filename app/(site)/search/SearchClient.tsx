"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { FiActivity, FiArrowRight, FiLayers, FiShield, FiUser } from "react-icons/fi";
import { SearchBar } from "@/components/shared/SearchBar";
import { EmptyState } from "@/components/shared/EmptyState";
import { Card } from "@/components/ui/card";
import { useDebounce } from "@/hooks/useDebounce";
import { API_ENDPOINTS } from "@/lib/api/endpoints";
import type { SearchResult } from "@/types/api";

type SearchResponse = {
  data: SearchResult[];
};

const QUICK_SUGGESTIONS = ["India", "Australia", "England", "Kohli", "Cummins", "Asia Cup"] as const;

export function SearchClient({
  initialQuery,
  initialResults
}: {
  initialQuery: string;
  initialResults: SearchResult[];
}): React.ReactElement {
  const [query, setQuery] = useState(initialQuery);
  const [results, setResults] = useState(initialResults);
  const [loading, setLoading] = useState(false);
  const debounced = useDebounce(query, 250);

  useEffect(() => {
    if (!debounced.trim()) {
      setResults([]);
      return;
    }
    let cancelled = false;
    const run = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${API_ENDPOINTS.search}?q=${encodeURIComponent(debounced)}`, {
          cache: "no-store"
        });
        if (!cancelled && response.ok) {
          const json = (await response.json()) as SearchResponse;
          setResults(json.data);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    void run();
    return () => {
      cancelled = true;
    };
  }, [debounced]);

  const iconForType = (type: SearchResult["type"]) => {
    if (type === "match") return FiActivity;
    if (type === "team") return FiShield;
    if (type === "player") return FiUser;
    return FiLayers;
  };

  return (
    <div className="space-y-4">
      <SearchBar defaultValue={initialQuery} onSearchChange={setQuery} />

      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Popular:</span>
        {QUICK_SUGGESTIONS.map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => setQuery(item)}
            className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-700 shadow-sm transition hover:border-brand-300 hover:bg-brand-50 hover:text-brand-700"
          >
            {item}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="rounded-xl border border-slate-200 bg-white/80 px-4 py-3 text-sm font-medium text-slate-600">
          Searching matches, teams, players, and series...
        </div>
      ) : null}

      {!results.length && debounced ? (
        <EmptyState title="No results" description="Try another team, player, or series keyword." />
      ) : results.length ? (
        <ul className="grid gap-3 sm:grid-cols-2">
          {results.map((result) => {
            const TypeIcon = iconForType(result.type);
            return (
              <li key={`${result.type}-${result.id}`}>
                <Link
                  href={result.href}
                  className="group block h-full rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
                >
                  <Card
                    interactive
                    className="flex h-full items-center justify-between gap-3 p-4 transition-all duration-200 group-hover:-translate-y-0.5 group-hover:border-brand-300 group-hover:shadow-md"
                  >
                    <div className="flex min-w-0 items-start gap-3">
                      <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-brand-200 bg-brand-50 text-brand-700">
                        <TypeIcon className="h-4 w-4" aria-hidden="true" />
                      </span>
                      <div className="min-w-0">
                        <span className="inline-flex rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wider text-slate-600">
                          {result.type}
                        </span>
                        <p className="mt-1 truncate text-base font-extrabold text-slate-900 group-hover:text-brand-700">
                          {result.label}
                        </p>
                        {result.description ? (
                          <p className="mt-0.5 truncate text-xs font-medium text-slate-500">{result.description}</p>
                        ) : null}
                      </div>
                    </div>
                    <FiArrowRight className="h-4 w-4 shrink-0 text-slate-400 transition-transform duration-200 group-hover:translate-x-1 group-hover:text-brand-700" aria-hidden="true" />
                  </Card>
                </Link>
              </li>
            );
          })}
        </ul>
      ) : null}
    </div>
  );
}
