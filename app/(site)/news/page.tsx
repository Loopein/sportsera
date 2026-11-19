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
      <Card as="section" variant="strong" className="p-5 sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="inline-flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-wider text-brand-700">
              <FiFileText className="h-3.5 w-3.5" aria-hidden="true" />
              Editorial Coverage
            </p>
            <h1 className="mt-1 text-2xl font-black tracking-tight text-slate-900 sm:text-3xl">News</h1>
            <p className="mt-1 text-sm text-slate-600">Cricket headlines, match reports, and tournament analysis.</p>
          </div>
          <span className="score-pill">{news.length} stories</span>
        </div>
      </Card>
      <AdSlot variant="in-feed" label="Sponsored · Breaking News" />
      {news.length ? (
        <NewsList articles={news} />
      ) : (
        <EmptyState title="No articles published yet" description="Latest cricket stories will appear here." />
      )}
      <AdSlot variant="leaderboard" label="Sponsored · Editorial Desk Banner" />
    </div>
  );
}
