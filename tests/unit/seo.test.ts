import { describe, expect, it } from "vitest";
import robots from "@/app/robots";
import { SITE_NAME } from "@/lib/constants/site";
import {
  buildBreadcrumbJsonLd,
  buildNewsArticleJsonLd,
  buildSportsEventJsonLd,
  buildSportsTeamJsonLd,
  serializeJsonLd
} from "@/lib/seo/jsonld";
import { buildPageMetadata } from "@/lib/seo/metadata";

describe("SEO metadata and structured data", () => {
  it("builds canonical, Open Graph, Twitter, and noIndex metadata", () => {
    const meta = buildPageMetadata({
      title: "Live Matches",
      description: "Live sports scores",
      path: "/live",
      keywords: ["cricket"]
    });

    expect(meta.title).toBe("Live Matches");
    expect(meta.alternates?.canonical).toBe("/live");
    expect(meta.openGraph?.siteName).toBe(SITE_NAME);
    expect(meta.openGraph?.title).toBe(`Live Matches | ${SITE_NAME}`);
    expect(meta.twitter).toMatchObject({ card: "summary_large_image" });

    const privateMeta = buildPageMetadata({
      title: "Search",
      description: "Search results",
      path: "/search",
      noIndex: true
    });
    expect(privateMeta.robots).toEqual({ index: false, follow: true });
  });

  it("serializes JSON-LD schemas safely against inline script breakout", () => {
    const breadcrumb = buildBreadcrumbJsonLd([
      { name: "Home", path: "/" },
      { name: "Live", path: "/live" }
    ]);
    const sportsEvent = buildSportsEventJsonLd(
      {
        id: "m1",
        status: "live",
        format: "T20",
        seriesName: "Test <script>Cup",
        venue: "Dhaka Stadium",
        teamA: { id: "t1", name: "Bangladesh", shortName: "BAN" },
        teamB: { id: "t2", name: "India", shortName: "IND" }
      },
      "/matches/m1"
    );
    const article = buildNewsArticleJsonLd({
      slug: "match-report",
      title: "Headline",
      summary: "Summary",
      content: "Body",
      publishedAt: "2026-11-26T10:00:00Z"
    });
    const team = buildSportsTeamJsonLd(
      {
        id: "t1",
        name: "Bangladesh",
        shortName: "BAN",
        squad: [{ playerId: "p1", name: "Player One", role: "Batter" }]
      },
      "/teams/t1"
    );

    const raw = serializeJsonLd([breadcrumb, sportsEvent, article, team]);
    expect(raw).not.toContain("<script");
    expect(raw).toContain("\\u003cscript");
    expect(raw).toContain("SportsEvent");
    expect(raw).toContain("NewsArticle");
    expect(raw).toContain("SportsTeam");
    expect(raw).toContain("BreadcrumbList");
  });

  it("configures robots.txt rules with sitemap and /api/ disallow", () => {
    const config = robots();
    expect(config.sitemap).toContain("/sitemap.xml");
    expect(config.rules).toEqual([
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/"]
      }
    ]);
  });
});
