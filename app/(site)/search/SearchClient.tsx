"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { SearchBar } from "@/components/shared/SearchBar";
import { EmptyState } from "@/components/shared/EmptyState";
import { useDebounce } from "@/hooks/useDebounce";
import { API_ENDPOINTS } from "@/lib/api/endpoints";
import type { SearchResult } from "@/types/api";

type SearchResponse = {
  data: SearchResult[];
};

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
  const debounced = useDebounce(query, 300);

  useEffect(() => {
    if (!debounced.trim()) {
      setResults([]);
      return;
    }
    const run = async () => {
      setLoading(true);
      const response = await fetch(`${API_ENDPOINTS.search}?q=${encodeURIComponent(debounced)}`, { cache: "no-store" });
      if (response.ok) {
        const json = (await response.json()) as SearchResponse;
        setResults(json.data);
      }
      setLoading(false);
    };
    void run();
  }, [debounced]);

  return (
    <div className="space-y-4">
      <SearchBar defaultValue={initialQuery} onSearchChange={setQuery} />
      {loading ? <p className="text-sm text-slate-600">Searching...</p> : null}
      {!results.length && debounced ? (
        <EmptyState title="No results" description="Try another keyword." />
      ) : (
        <ul className="space-y-3">
          {results.map((result) => (
            <li key={`${result.type}-${result.id}`}>
              <Link href={result.href} className="block rounded-xl border border-slate-200 bg-white p-4 hover:border-brand-300">
                <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">{result.type}</p>
                <p className="mt-1 text-base font-semibold text-slate-900">{result.label}</p>
                {result.description ? <p className="mt-1 text-sm text-slate-600">{result.description}</p> : null}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

