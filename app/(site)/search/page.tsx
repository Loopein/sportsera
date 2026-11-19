import type { Metadata } from "next";
import { SearchClient } from "@/app/(site)/search/SearchClient";
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
    <div className="space-y-5">
      <section>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Search</h1>
        <p className="mt-1 text-sm text-slate-600">Find matches, players, teams, and series quickly.</p>
      </section>
      <SearchClient initialQuery={query} initialResults={results} />
    </div>
  );
}

