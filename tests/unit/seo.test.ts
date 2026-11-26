import { describe, expect, it } from "vitest";
import robots from "@/app/robots";
import { SITE_NAME, getSiteUrl } from "@/lib/constants/site";
import {
  buildBreadcrumbJsonLd,
  buildNewsArticleJsonLd,
  buildSportsEventJsonLd,
  buildSportsTeamJsonLd,
  serializeJsonLd
} from "@/lib/seo/jsonld";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { getOgLogoSrc } from "@/lib/seo/og-image";

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

  it("loads OG logo as local data URI without localhost HTTP fetch and resolves Vercel domain fallback", async () => {
    const logoSrc = await getOgLogoSrc();
    expect(logoSrc.startsWith("data:image/")).toBe(true);
    expect(logoSrc).not.toContain("localhost");

    const prevSiteUrl = process.env.NEXT_PUBLIC_SITE_URL;
    const prevVercelProd = process.env.VERCEL_PROJECT_PRODUCTION_URL;
    delete process.env.NEXT_PUBLIC_SITE_URL;
    process.env.VERCEL_PROJECT_PRODUCTION_URL = "sportsera.vercel.app";
    expect(getSiteUrl()).toBe("https://sportsera.vercel.app");

    if (prevSiteUrl === undefined) delete process.env.NEXT_PUBLIC_SITE_URL;
    else process.env.NEXT_PUBLIC_SITE_URL = prevSiteUrl;
    if (prevVercelProd === undefined) delete process.env.VERCEL_PROJECT_PRODUCTION_URL;
    else process.env.VERCEL_PROJECT_PRODUCTION_URL = prevVercelProd;
  });
});
