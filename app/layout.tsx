import type { Metadata } from "next";
import { AnimatedScoreBackground } from "@/components/layout/AnimatedScoreBackground";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { GoogleAdSenseScript } from "@/components/shared/GoogleAdSenseScript";
import {
  GOOGLE_ADSENSE_CLIENT_ID,
  SITE_DESCRIPTION,
  SITE_ICON_PATH,
  SITE_NAME,
  SITE_POWERED_BY,
  SPORTSERA_FAVICON_DATA_URI
} from "@/lib/constants/site";
import "@/styles/tokens.css";
import "@/app/globals.css";

const metadataBase = (() => {
  try {
    return new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000");
  } catch {
    return new URL("http://localhost:3000");
  }
})();

export const metadata: Metadata = {
  metadataBase,
  title: {
    default: SITE_NAME,
    template: `%s | ${SITE_NAME}`
  },
  description: `${SITE_DESCRIPTION} Powered by ${SITE_POWERED_BY}.`,
  creator: SITE_POWERED_BY,
  publisher: SITE_POWERED_BY,
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
        <AnimatedScoreBackground />
        <div className="relative z-10 flex min-h-screen flex-col">
          <Header />
          <main className="relative z-10 flex-1">{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  );
}

