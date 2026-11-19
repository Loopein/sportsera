import { notFound } from "next/navigation";
import { getNewsArticle } from "@/lib/api/read";
import { formatTime } from "@/lib/utils/date";

type NewsDetailProps = {
  params: Promise<{ slug: string }>;
};

export default async function NewsDetailPage({ params }: NewsDetailProps): Promise<React.ReactElement> {
  const { slug } = await params;
  const article = await getNewsArticle(slug);
  if (!article) notFound();

  return (
    <article className="mx-auto max-w-3xl space-y-4 rounded-xl border border-slate-200 bg-white p-6">
      <p className="text-xs font-medium uppercase tracking-wide text-slate-500">{formatTime(article.publishedAt)}</p>
      <h1 className="text-3xl font-bold tracking-tight text-slate-900">{article.title}</h1>
      <p className="text-sm text-slate-700">{article.content}</p>
    </article>
  );
}

