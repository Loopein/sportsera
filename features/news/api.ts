import { getNews, getNewsArticle } from "@/lib/api/read";

export async function fetchNews() {
  return getNews();
}

export async function fetchNewsBySlug(slug: string) {
  return getNewsArticle(slug);
}
