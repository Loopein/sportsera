import {
  SITE_DESCRIPTION,
  SITE_LOGO_PATH,
  SITE_NAME,
  SITE_POWERED_BY,
  buildAbsoluteUrl,
  getSiteUrl
} from "@/lib/constants/site";
import type { MatchSummary } from "@/types/match";
import type { NewsArticle } from "@/types/news";
import type { PlayerProfile } from "@/types/player";
import type { SeriesSummary } from "@/types/series";
import type { TeamProfile } from "@/types/team";

type JsonLdNode = Record<string, unknown>;

export type BreadcrumbCrumb = {
  name: string;
  path: string;
};

export function serializeJsonLd(data: JsonLdNode | JsonLdNode[]): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}

export function buildOrganizationJsonLd(): JsonLdNode {
  const siteUrl = getSiteUrl();
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE_NAME,
    url: siteUrl,
    logo: buildAbsoluteUrl(SITE_LOGO_PATH),
    parentOrganization: {
      "@type": "Organization",
      name: SITE_POWERED_BY
    }
  };
}

export function buildWebSiteJsonLd(): JsonLdNode {
  const siteUrl = getSiteUrl();
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    description: SITE_DESCRIPTION,
    url: siteUrl,
    publisher: {
      "@type": "Organization",
      name: SITE_NAME
    },
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${siteUrl}/search?q={search_term_string}`
      },
      "query-input": "required name=search_term_string"
    }
  };
}

export function buildBreadcrumbJsonLd(items: BreadcrumbCrumb[]): JsonLdNode {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: buildAbsoluteUrl(item.path)
    }))
  };
}

export function buildCollectionPageJsonLd({
  name,
  description,
  path
}: {
  name: string;
  description: string;
  path: string;
}): JsonLdNode {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name,
    description,
    url: buildAbsoluteUrl(path),
    isPartOf: {
      "@type": "WebSite",
      name: SITE_NAME,
      url: getSiteUrl()
    }
  };
}

function toEventStatusUrl(status: MatchSummary["status"]): string {
  if (status === "upcoming") return "https://schema.org/EventScheduled";
  return "https://schema.org/EventScheduled";
}

export function buildSportsEventJsonLd(match: MatchSummary, path: string): JsonLdNode {
  const eventUrl = buildAbsoluteUrl(path);
  const startDate = match.startAt ?? match.lastUpdatedAt;

  return {
    "@context": "https://schema.org",
    "@type": "SportsEvent",
    name: `${match.teamA.name} vs ${match.teamB.name} - ${match.seriesName}`,
    description:
      match.resultText ||
      `${match.teamA.name} vs ${match.teamB.name} (${match.format}) in ${match.seriesName} at ${match.venue}.`,
    url: eventUrl,
    eventStatus: toEventStatusUrl(match.status),
    eventAttendanceMode: "https://schema.org/MixedEventAttendanceMode",
    ...(startDate ? { startDate } : {}),
    location: {
      "@type": "Place",
      name: match.venue
    },
    competitor: [
      {
        "@type": "SportsTeam",
        name: match.teamA.name,
        url: buildAbsoluteUrl(`/teams/${match.teamA.id}`)
      },
      {
        "@type": "SportsTeam",
        name: match.teamB.name,
        url: buildAbsoluteUrl(`/teams/${match.teamB.id}`)
      }
    ],
    organizer: {
      "@type": "SportsOrganization",
      name: match.seriesName
    }
  };
}

export function buildNewsArticleJsonLd(article: NewsArticle): JsonLdNode {
  const articleUrl = buildAbsoluteUrl(`/news/${article.slug}`);
  return {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: article.title,
    description: article.summary,
    datePublished: article.publishedAt,
    dateModified: article.publishedAt,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": articleUrl
    },
    author: {
      "@type": "Organization",
      name: `${SITE_NAME} Editorial Desk`
    },
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
      logo: {
        "@type": "ImageObject",
        url: buildAbsoluteUrl(SITE_LOGO_PATH)
      }
    }
  };
}

export function buildSportsTeamJsonLd(team: TeamProfile, path: string): JsonLdNode {
  return {
    "@context": "https://schema.org",
    "@type": "SportsTeam",
    name: team.name,
    alternateName: team.shortName,
    url: buildAbsoluteUrl(path),
    ...(team.coach ? { coach: { "@type": "Person", name: team.coach } } : {}),
    ...(team.homeGround ? { location: { "@type": "Place", name: team.homeGround } } : {}),
    athlete: team.squad.slice(0, 20).map((member) => ({
      "@type": "Person",
      name: member.name,
      url: buildAbsoluteUrl(`/players/${member.playerId}`)
    }))
  };
}

export function buildPersonJsonLd(player: PlayerProfile, path: string): JsonLdNode {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: player.name,
    url: buildAbsoluteUrl(path),
    jobTitle: player.role,
    ...(player.teamId
      ? {
          memberOf: {
            "@type": "SportsTeam",
            url: buildAbsoluteUrl(`/teams/${player.teamId}`)
          }
        }
      : {})
  };
}

export function buildSeriesEventJsonLd(series: SeriesSummary, path: string): JsonLdNode {
  return {
    "@context": "https://schema.org",
    "@type": "SportsEvent",
    name: `${series.name} ${series.season}`.trim(),
    url: buildAbsoluteUrl(path),
    ...(series.startDate ? { startDate: series.startDate } : {}),
    ...(series.endDate ? { endDate: series.endDate } : {}),
    organizer: {
      "@type": "SportsOrganization",
      name: SITE_NAME
    }
  };
}
