import Link from "next/link";
import { FiArrowRight, FiClock, FiFileText } from "react-icons/fi";
import type { NewsArticle } from "@/types/news";
import { formatTime } from "@/lib/utils/date";
import { Card } from "@/components/ui/card";

export function NewsCard({ article }: { article: NewsArticle }): React.ReactElement {
  return (
    <Link
      href={`/news/${article.slug}`}
      className="group block h-full rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
    >
      <Card
        as="article"
        interactive
        className="flex h-full flex-col justify-between overflow-hidden p-0 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:border-brand-300 group-hover:shadow-lg"
      >
        <div>
          <div className="relative h-28 overflow-hidden bg-gradient-to-br from-[rgb(6,12,58)] via-indigo-900 to-sky-700 p-4">
            <div className="absolute -left-6 -top-4 h-20 w-20 rounded-full bg-white/10 blur-md" />
            <div className="absolute right-4 top-2 h-16 w-16 rounded-full bg-sky-400/20 blur-md" />
            <div className="relative flex h-full flex-col justify-between">
              <div className="flex items-center justify-between gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-white/95 px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-wider text-[rgb(6,12,58)] shadow-sm">
                  <FiFileText className="h-3 w-3 text-red-600" aria-hidden="true" />
                  Cricket Desk
                </span>
                <span className="inline-flex items-center gap-1 rounded-full bg-black/25 px-2.5 py-1 text-[11px] font-medium text-white/90 backdrop-blur-sm">
                  <FiClock className="h-3 w-3" aria-hidden="true" />
                  {formatTime(article.publishedAt)}
                </span>
              </div>
            </div>
          </div>
          <div className="p-4 sm:p-5">
            <h3 className="text-lg font-extrabold leading-snug text-slate-900 transition-colors group-hover:text-brand-700">
              {article.title}
            </h3>
            <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-slate-600">{article.summary}</p>
          </div>
        </div>
        <div className="flex items-center justify-between border-t border-slate-100 px-4 py-3 text-xs font-bold uppercase tracking-wider text-brand-700 sm:px-5">
          <span>Read Full Story</span>
          <FiArrowRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-1" aria-hidden="true" />
        </div>
      </Card>
    </Link>
  );
}
