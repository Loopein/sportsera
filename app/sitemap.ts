import type { MetadataRoute } from "next";
import { getMatches, getNews, getPlayers, getSeries, getTeams } from "@/lib/api/read";
import { optionalEnv } from "@/lib/utils/env";

const siteUrl = optionalEnv("NEXT_PUBLIC_SITE_URL", "http://localhost:3000");

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes = ["", "/live", "/matches", "/fixtures", "/results", "/rankings", "/series", "/teams", "/players", "/news", "/search"];
  const [matches, series, teams, players, news] = await Promise.all([
    getMatches(),
    getSeries(),
    getTeams(),
    getPlayers(),
    getNews()
  ]);

  return [
    ...staticRoutes.map((route) => ({
      url: `${siteUrl}${route}`,
      lastModified: new Date(),
      changeFrequency: "hourly" as const
    })),
    ...matches.map((m) => ({
      url: `${siteUrl}/matches/${m.id}`,
      lastModified: new Date(m.lastUpdatedAt ?? Date.now()),
      changeFrequency: "always" as const
    })),
    ...series.map((series) => ({
      url: `${siteUrl}/series/${series.id}`,
      lastModified: new Date(series.endDate),
      changeFrequency: "daily" as const
    })),
    ...teams.map((team) => ({
      url: `${siteUrl}/teams/${team.id}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const
    })),
    ...players.map((player) => ({
      url: `${siteUrl}/players/${player.id}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const
    })),
    ...news.map((article) => ({
      url: `${siteUrl}/news/${article.slug}`,
      lastModified: new Date(article.publishedAt),
      changeFrequency: "daily" as const
    }))
  ];
}
