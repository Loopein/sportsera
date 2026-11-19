import Link from "next/link";
import { FiPlay } from "react-icons/fi";
import type { NewsArticle } from "@/types/news";
import { formatTime } from "@/lib/utils/date";
import { Card } from "@/components/ui/card";

export function NewsCard({ article }: { article: NewsArticle }): React.ReactElement {
  return (
    <Card as="article" interactive className="overflow-hidden p-0">
      <div className="relative h-24 overflow-hidden bg-gradient-to-r from-sky-500 via-blue-500 to-indigo-500">
        <div className="absolute -left-6 top-3 h-14 w-14 rounded-full bg-white/20" />
        <div className="absolute right-6 top-1 h-16 w-16 rounded-full bg-white/15" />
        <div className="absolute inset-x-0 bottom-2 px-4">
          <p className="inline-flex items-center gap-1 rounded-full bg-white/90 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-brand-700">
            Breaking Story
            <FiPlay className="h-3 w-3" aria-hidden="true" />
          </p>
        </div>
      </div>
      <div className="p-4">
        <h3 className="text-lg font-bold text-slate-900">
          <Link href={`/news/${article.slug}`} className="hover:text-brand-700">
            {article.title}
          </Link>
        </h3>
        <p className="mt-1 text-xs font-semibold text-slate-500">{formatTime(article.publishedAt)}</p>
        <p className="mt-2 text-sm leading-6 text-slate-700">{article.summary}</p>
      </div>
    </Card>
  );
}

