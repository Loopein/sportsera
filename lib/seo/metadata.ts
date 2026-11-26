import type { Metadata } from "next";
import { SITE_DESCRIPTION, SITE_KEYWORDS, SITE_NAME, SITE_POWERED_BY, buildAbsoluteUrl } from "@/lib/constants/site";

type BuildPageMetadataOptions = {
  title: string;
  description: string;
  path: string;
  keywords?: string[];
  type?: "website" | "article";
  publishedTime?: string;
  noIndex?: boolean;
  absoluteTitle?: boolean;
};

export function buildPageMetadata({
  title,
  description,
  path,
  keywords = [],
  type = "website",
  publishedTime,
  noIndex = false,
  absoluteTitle = false
}: BuildPageMetadataOptions): Metadata {
  const fullTitle = title.includes(SITE_NAME) ? title : `${title} | ${SITE_NAME}`;
  const canonicalUrl = buildAbsoluteUrl(path);
  const mergedKeywords = Array.from(new Set([...keywords, ...SITE_KEYWORDS]));

  return {
    title: absoluteTitle ? { absolute: title } : title,
    description: description || SITE_DESCRIPTION,
    keywords: mergedKeywords,
    alternates: {
      canonical: path
    },
    robots: noIndex
      ? {
          index: false,
          follow: true
        }
      : {
          index: true,
          follow: true,
          googleBot: {
            index: true,
            follow: true,
            "max-snippet": -1,
            "max-image-preview": "large",
            "max-video-preview": -1
          }
        },
    openGraph: {
      type,
      locale: "en_US",
      siteName: SITE_NAME,
      title: fullTitle,
      description: description || SITE_DESCRIPTION,
      url: canonicalUrl,
      ...(type === "article" && publishedTime ? { publishedTime, authors: [SITE_POWERED_BY] } : {})
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description: description || SITE_DESCRIPTION
    }
  };
}
