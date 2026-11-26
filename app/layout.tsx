import type { Metadata, Viewport } from "next";
import { AnimatedScoreBackground } from "@/components/layout/AnimatedScoreBackground";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { SmoothMotionRuntime } from "@/components/layout/SmoothMotionRuntime";
import { JsonLd } from "@/components/seo/JsonLd";
import { GoogleAdSenseScript } from "@/components/shared/GoogleAdSenseScript";
import {
  GOOGLE_ADSENSE_CLIENT_ID,
  SITE_DESCRIPTION,
  SITE_ICON_PATH,
  SITE_KEYWORDS,
  SITE_NAME,
  SITE_POWERED_BY,
  SPORTSERA_FAVICON_DATA_URI,
  getSiteUrl
} from "@/lib/constants/site";
import { buildOrganizationJsonLd, buildWebSiteJsonLd } from "@/lib/seo/jsonld";
import "@/styles/tokens.css";
import "@/app/globals.css";

const siteUrl = getSiteUrl();

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f4f7fb" },
    { media: "(prefers-color-scheme: dark)", color: "#0b1221" }
  ]
};

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  applicationName: SITE_NAME,
  title: {
    default: `${SITE_NAME} | Live Scores, Fixtures, Results & Sports Analytics`,
    template: `%s | ${SITE_NAME}`
  },
  description: `${SITE_DESCRIPTION} Powered by ${SITE_POWERED_BY}.`,
  keywords: SITE_KEYWORDS,
  authors: [{ name: `${SITE_NAME} by ${SITE_POWERED_BY}`, url: siteUrl }],
  creator: SITE_POWERED_BY,
  publisher: SITE_POWERED_BY,
  category: "sports",
  alternates: {
    canonical: "/"
  },
  formatDetection: {
    telephone: false
  },
  robots: {
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
    type: "website",
    locale: "en_US",
    siteName: SITE_NAME,
    url: siteUrl,
    title: `${SITE_NAME} | Live Scores, Fixtures, Results & Sports Analytics`,
    description: `${SITE_DESCRIPTION} Powered by ${SITE_POWERED_BY}.`
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_NAME} | Live Scores, Fixtures, Results & Sports Analytics`,
    description: `${SITE_DESCRIPTION} Powered by ${SITE_POWERED_BY}.`
  },
  icons: {
    icon: [
      { url: SPORTSERA_FAVICON_DATA_URI, type: "image/svg+xml" },
      { url: SITE_ICON_PATH, type: "image/svg+xml" }
    ],
    shortcut: [
      { url: SPORTSERA_FAVICON_DATA_URI, type: "image/svg+xml" },
      { url: SITE_ICON_PATH, type: "image/svg+xml" }
    ],
    apple: [{ url: "/apple-icon.png", type: "image/png" }]
  }
};

const THEME_INIT_SCRIPT = `(function(){try{var t=localStorage.getItem("sportsera-theme");if(t==="light"||t==="dark"){document.documentElement.dataset.theme=t;}}catch(e){}})();`;

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>): React.ReactElement {
  return (
    <html lang="en" data-theme="dark" suppressHydrationWarning>
      <head>
        <meta name="google-adsense-account" content={GOOGLE_ADSENSE_CLIENT_ID} />
        <GoogleAdSenseScript />
        <link rel="icon" type="image/svg+xml" href={SPORTSERA_FAVICON_DATA_URI} />
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
      </head>
      <body className="min-h-screen antialiased">
        <JsonLd data={[buildOrganizationJsonLd(), buildWebSiteJsonLd()]} />
        <SmoothMotionRuntime />
        <AnimatedScoreBackground />
        <div className="relative z-10 flex min-h-screen flex-col">
          <Header />
          <main className="relative z-10 min-w-0 flex-1">{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  );
}

