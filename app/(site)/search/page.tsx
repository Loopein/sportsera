import type { Metadata } from "next";
import { FiSearch } from "react-icons/fi";
import { SearchClient } from "@/app/(site)/search/SearchClient";
import { JsonLd } from "@/components/seo/JsonLd";
import { AdSlot } from "@/components/shared/AdSlot";
import { Card } from "@/components/ui/card";
import { search } from "@/lib/api/read";
import { buildBreadcrumbJsonLd } from "@/lib/seo/jsonld";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { sanitizeSearchQuery } from "@/lib/validations/search";

type SearchPageProps = {
  searchParams?: Promise<{
    q?: string;
  }>;
};

export async function generateMetadata({ searchParams }: SearchPageProps): Promise<Metadata> {
  const query = sanitizeSearchQuery((await searchParams)?.q ?? "");
  return buildPageMetadata({
    title: query ? `Search: ${query}` : "Search",
    description: "Search live matches, teams, players, series, and news across SportsEra.",
    path: "/search",
    noIndex: true
  });
}

export default async function SearchPage({ searchParams }: SearchPageProps): Promise<React.ReactElement> {
  const query = sanitizeSearchQuery((await searchParams)?.q ?? "");
  const results = query ? await search(query) : [];

  return (
    <div className="space-y-6">
      <JsonLd
        data={buildBreadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Search", path: "/search" }
        ])}
      />
      <Card as="section" variant="strong" className="page-hero-card p-4 sm:p-6">
        <div className="flex items-start gap-3">
          <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-700 ring-1 ring-brand-200/80">
            <FiSearch className="h-5 w-5" aria-hidden="true" />
          </span>
          <div className="min-w-0">
            <p className="text-xs font-extrabold uppercase tracking-wider text-brand-700">Unified Discovery</p>
            <h1 className="mt-0.5 text-2xl font-black tracking-tight text-slate-900 sm:text-3xl">Search</h1>
            <p className="mt-1 text-sm text-slate-600">Find live matches, players, teams, and tournaments instantly.</p>
          </div>
        </div>
      </Card>
      <SearchClient initialQuery={query} initialResults={results} />
      <AdSlot variant="leaderboard" label="Sponsored · Discovery Desk" />
    </div>
  );
}
