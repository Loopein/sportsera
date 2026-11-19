import type { MetadataRoute } from "next";
import { optionalEnv } from "@/lib/utils/env";

const siteUrl = optionalEnv("NEXT_PUBLIC_SITE_URL", "http://localhost:3000");

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/"
    },
    sitemap: `${siteUrl}/sitemap.xml`
  };
}
