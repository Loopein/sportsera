import Script from "next/script";

export function GoogleAdSenseScript(): React.ReactElement | null {
  const clientId = process.env.NEXT_PUBLIC_GOOGLE_ADSENSE_ID?.trim();
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
