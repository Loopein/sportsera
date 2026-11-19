import type { Metadata } from "next";
import { FiSearch } from "react-icons/fi";
import { SearchClient } from "@/app/(site)/search/SearchClient";
import { AdSlot } from "@/components/shared/AdSlot";
import { Card } from "@/components/ui/card";
import { search } from "@/lib/api/read";
import { sanitizeSearchQuery } from "@/lib/validations/search";

type SearchPageProps = {
  searchParams?: Promise<{
    q?: string;
  }>;
};

export const metadata: Metadata = {
  title: "Search",
  description: "Search matches, teams, players and series."
};

export default async function SearchPage({ searchParams }: SearchPageProps): Promise<React.ReactElement> {
  const query = sanitizeSearchQuery((await searchParams)?.q ?? "");
  const results = query ? await search(query) : [];

  return (
    <div className="space-y-6">
      <Card as="section" variant="strong" className="p-5 sm:p-6">
        <p className="inline-flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-wider text-brand-700">
          <FiSearch className="h-3.5 w-3.5" aria-hidden="true" />
          Unified Discovery
        </p>
        <h1 className="mt-1 text-2xl font-black tracking-tight text-slate-900 sm:text-3xl">Search</h1>
        <p className="mt-1 text-sm text-slate-600">Find live matches, players, teams, and tournaments instantly.</p>
      </Card>
      <SearchClient initialQuery={query} initialResults={results} />
      <AdSlot variant="leaderboard" label="Sponsored · Discovery Desk" />
    </div>
  );
}
