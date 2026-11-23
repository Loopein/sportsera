import Script from "next/script";
import { GOOGLE_ADSENSE_CLIENT_ID } from "@/lib/constants/site";

export function GoogleAdSenseScript(): React.ReactElement | null {
  const clientId = GOOGLE_ADSENSE_CLIENT_ID;
  if (!clientId) return null;

  return (
    <Script
      id="google-adsense-script"
      async
      strategy="lazyOnload"
      src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${encodeURIComponent(clientId)}`}
      crossOrigin="anonymous"
    />
  );
}
