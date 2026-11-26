import type { MetadataRoute } from "next";
import { getMatches, getNews, getPlayers, getSeries, getTeams } from "@/lib/api/read";
import { getSiteUrl } from "@/lib/constants/site";

function toSafeDate(value?: string): Date {
  if (!value) return new Date();
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? new Date() : parsed;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = getSiteUrl();
  const staticRoutes: Array<{ path: string; changeFrequency: "always" | "hourly" | "daily" | "weekly"; priority: number }> = [
    { path: "", changeFrequency: "always", priority: 1.0 },
    { path: "/live", changeFrequency: "always", priority: 0.95 },
    { path: "/matches", changeFrequency: "hourly", priority: 0.9 },
    { path: "/fixtures", changeFrequency: "hourly", priority: 0.85 },
    { path: "/results", changeFrequency: "hourly", priority: 0.85 },
    { path: "/rankings", changeFrequency: "daily", priority: 0.85 },
    { path: "/stats", changeFrequency: "daily", priority: 0.85 },
    { path: "/series", changeFrequency: "daily", priority: 0.85 },
    { path: "/teams", changeFrequency: "weekly", priority: 0.8 },
    { path: "/players", changeFrequency: "weekly", priority: 0.8 },
    { path: "/news", changeFrequency: "hourly", priority: 0.85 },
    { path: "/videos", changeFrequency: "hourly", priority: 0.8 },
    { path: "/more", changeFrequency: "weekly", priority: 0.6 }
  ];

  const [matches, series, teams, players, news] = await Promise.all([
    getMatches(),
    getSeries(),
    getTeams(),
    getPlayers(),
    getNews()
  ]);

  const now = new Date();

  return [
    ...staticRoutes.map((route) => ({
      url: `${siteUrl}${route.path}`,
      lastModified: now,
      changeFrequency: route.changeFrequency,
      priority: route.priority
    })),
    ...matches.flatMap((m) => {
      const updated = toSafeDate(m.lastUpdatedAt ?? m.startAt);
      const isLive = m.status === "live" || m.status === "innings_break";
      return [
        {
          url: `${siteUrl}/matches/${m.id}`,
          lastModified: updated,
          changeFrequency: isLive ? ("always" as const) : ("hourly" as const),
          priority: isLive ? 0.9 : 0.75
        },
        {
          url: `${siteUrl}/matches/${m.id}/scorecard`,
          lastModified: updated,
          changeFrequency: isLive ? ("always" as const) : ("daily" as const),
          priority: 0.75
        },
        {
          url: `${siteUrl}/matches/${m.id}/commentary`,
          lastModified: updated,
          changeFrequency: isLive ? ("always" as const) : ("daily" as const),
          priority: 0.7
        },
        {
          url: `${siteUrl}/matches/${m.id}/squads`,
          lastModified: updated,
          changeFrequency: "daily" as const,
          priority: 0.65
        },
        {
          url: `${siteUrl}/matches/${m.id}/stats`,
          lastModified: updated,
          changeFrequency: "daily" as const,
          priority: 0.65
        },
        {
          url: `${siteUrl}/matches/${m.id}/watch`,
          lastModified: updated,
          changeFrequency: isLive ? ("always" as const) : ("daily" as const),
          priority: 0.7
        }
      ];
    }),
    ...series.flatMap((s) => {
      const updated = toSafeDate(s.endDate || s.startDate);
      return [
        {
          url: `${siteUrl}/series/${s.id}`,
          lastModified: updated,
          changeFrequency: "daily" as const,
          priority: 0.8
        },
        {
          url: `${siteUrl}/series/${s.id}/fixtures`,
          lastModified: updated,
          changeFrequency: "daily" as const,
          priority: 0.75
        },
        {
          url: `${siteUrl}/series/${s.id}/points-table`,
          lastModified: updated,
          changeFrequency: "daily" as const,
          priority: 0.75
        },
        {
          url: `${siteUrl}/series/${s.id}/stats`,
          lastModified: updated,
          changeFrequency: "daily" as const,
          priority: 0.7
        }
      ];
    }),
    ...teams.flatMap((team) => [
      {
        url: `${siteUrl}/teams/${team.id}`,
        lastModified: now,
        changeFrequency: "weekly" as const,
        priority: 0.7
      },
      {
        url: `${siteUrl}/teams/${team.id}/fixtures`,
        lastModified: now,
        changeFrequency: "daily" as const,
        priority: 0.65
      },
      {
        url: `${siteUrl}/teams/${team.id}/squad`,
        lastModified: now,
        changeFrequency: "weekly" as const,
        priority: 0.65
      }
    ]),
    ...players.flatMap((player) => [
      {
        url: `${siteUrl}/players/${player.id}`,
        lastModified: now,
        changeFrequency: "weekly" as const,
        priority: 0.7
      },
      {
        url: `${siteUrl}/players/${player.id}/career`,
        lastModified: now,
        changeFrequency: "weekly" as const,
        priority: 0.65
      },
      {
        url: `${siteUrl}/players/${player.id}/recent`,
        lastModified: now,
        changeFrequency: "daily" as const,
        priority: 0.65
      }
    ]),
    ...news.map((article) => ({
      url: `${siteUrl}/news/${article.slug}`,
      lastModified: toSafeDate(article.publishedAt),
      changeFrequency: "daily" as const,
      priority: 0.8
    }))
  ];
}
