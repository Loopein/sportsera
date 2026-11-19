import { NewsList } from "@/components/news/NewsList";
import { getNews } from "@/lib/api/read";

export const revalidate = 30;

export default async function NewsPage(): Promise<React.ReactElement> {
  const news = await getNews();

  return (
    <div className="space-y-5">
      <section>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">News</h1>
        <p className="mt-1 text-sm text-slate-600">Cricket headlines and match updates.</p>
      </section>
      <NewsList articles={news} />
    </div>
  );
}

