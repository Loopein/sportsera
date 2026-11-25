import { FiFileText } from "react-icons/fi";
import { NewsList } from "@/components/news/NewsList";
import { AdSlot } from "@/components/shared/AdSlot";
import { EmptyState } from "@/components/shared/EmptyState";
import { Card } from "@/components/ui/card";
import { getNews } from "@/lib/api/read";

export const revalidate = 30;

export default async function NewsPage(): Promise<React.ReactElement> {
  const news = await getNews();

  return (
    <div className="space-y-6">
      <Card as="section" variant="strong" className="page-hero-card p-4 sm:p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-700 ring-1 ring-brand-200/80">
              <FiFileText className="h-5 w-5" aria-hidden="true" />
            </span>
            <div className="min-w-0">
              <p className="text-xs font-extrabold uppercase tracking-wider text-brand-700">Editorial Coverage</p>
              <h1 className="mt-0.5 text-2xl font-black tracking-tight text-slate-900 sm:text-3xl">News</h1>
              <p className="mt-1 text-sm text-slate-600">
                Breaking sports headlines, match reports, transfer updates, and tournament analysis across every sport.
              </p>
            </div>
          </div>
          <span className="score-pill">{news.length} stories</span>
        </div>
      </Card>
      <AdSlot variant="in-feed" label="Sponsored · Breaking News" />
      {news.length ? (
        <NewsList articles={news} />
      ) : (
        <EmptyState title="No articles published yet" description="Latest sports stories will appear here." />
      )}
      <AdSlot variant="leaderboard" label="Sponsored · Editorial Desk Banner" />
    </div>
  );
}
