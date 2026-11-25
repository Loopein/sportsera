import type { NewsArticle } from "@/types/news";
import { NewsCard } from "@/components/news/NewsCard";

export function NewsList({ articles }: { articles: NewsArticle[] }): React.ReactElement {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {articles.map((article) => (
        <NewsCard key={article.slug} article={article} />
      ))}
    </div>
  );
}

