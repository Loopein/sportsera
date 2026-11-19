import Link from "next/link";
import { notFound } from "next/navigation";
import { FiArrowLeft, FiClock, FiFileText } from "react-icons/fi";
import { AdSlot } from "@/components/shared/AdSlot";
import { Card } from "@/components/ui/card";
import { getNewsArticle } from "@/lib/api/read";
import { SITE_POWERED_BY } from "@/lib/constants/site";
import { formatTime } from "@/lib/utils/date";

type NewsDetailProps = {
  params: Promise<{ slug: string }>;
};

export default async function NewsDetailPage({ params }: NewsDetailProps): Promise<React.ReactElement> {
  const { slug } = await params;
  const article = await getNewsArticle(slug);
  if (!article) notFound();

  return (
    <div className="mx-auto max-w-3xl space-y-4">
      <Link
        href="/news"
        className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider text-slate-700 shadow-sm transition hover:border-brand-300 hover:text-brand-700"
      >
        <FiArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
        Back to News
      </Link>

      <AdSlot variant="in-feed" label="Sponsored · Top Story" />

      <Card as="article" variant="strong" className="overflow-hidden p-0">
        <div className="bg-gradient-to-br from-[rgb(6,12,58)] via-indigo-900 to-sky-700 px-5 py-6 text-white sm:px-8 sm:py-8">
          <div className="flex flex-wrap items-center gap-2 text-xs font-bold uppercase tracking-wider">
            <span className="inline-flex items-center gap-1 rounded-full bg-white/95 px-2.5 py-1 text-[10px] text-[rgb(6,12,58)]">
              <FiFileText className="h-3 w-3 text-red-600" aria-hidden="true" />
              Match Report
            </span>
            <span className="inline-flex items-center gap-1 rounded-full bg-black/25 px-2.5 py-1 text-[11px] font-medium text-white/90">
              <FiClock className="h-3 w-3" aria-hidden="true" />
              {formatTime(article.publishedAt)}
            </span>
          </div>
          <h1 className="mt-4 text-2xl font-black leading-tight tracking-tight sm:text-3xl md:text-4xl">
            {article.title}
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-slate-200 sm:text-base">{article.summary}</p>
        </div>

        <div className="space-y-4 bg-white p-5 sm:p-8">
          <p className="text-base leading-8 text-slate-800">{article.content}</p>
          <div className="flex flex-wrap items-center justify-between gap-2 border-t border-slate-100 pt-4 text-xs font-semibold text-slate-500">
            <span>SportsEra News Desk · Powered by {SITE_POWERED_BY}</span>
            <Link href="/live" className="font-bold text-brand-700 hover:underline">
              Follow Live Matches &rarr;
            </Link>
          </div>
        </div>
      </Card>

      <AdSlot variant="in-feed" label="Sponsored · Story Footer Unit" />
    </div>
  );
}
