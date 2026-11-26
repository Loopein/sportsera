import { ImageResponse } from "next/og";
import { SITE_NAME } from "@/lib/constants/site";
import { getOgLogoSrc } from "@/lib/seo/og-image";

export const runtime = "nodejs";
export const alt = `${SITE_NAME} - Live scores, fixtures and results`;
export const size = {
  width: 1200,
  height: 630
};

export const contentType = "image/png";

export default async function OpenGraphImage(): Promise<ImageResponse> {
  const logoSrc = await getOgLogoSrc();

  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background:
            "linear-gradient(135deg, rgb(29,112,242), rgb(17,24,39))",
          color: "white",
          padding: "48px"
        }}
      >
        <div
          style={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            gap: 36,
            borderRadius: 28,
            background: "rgba(255,255,255,0.1)",
            border: "2px solid rgba(255,255,255,0.2)",
            padding: "30px 36px"
          }}
        >
          <img
            src={logoSrc}
            alt={`${SITE_NAME} logo`}
            width={260}
            height={260}
            style={{
              borderRadius: 20,
              border: "2px solid rgba(255,255,255,0.3)",
              objectFit: "contain",
              background: "rgba(15,23,42,0.32)",
              padding: "14px"
            }}
          />
          <div
            style={{
              display: "flex",
              flexDirection: "column"
            }}
          >
            <span style={{ fontSize: 84, fontWeight: 800, lineHeight: 1 }}>{SITE_NAME}</span>
            <span style={{ marginTop: 10, fontSize: 34, opacity: 0.95 }}>Live scores, fixtures and results</span>
          </div>
        </div>
      </div>
    ),
    size
  );
}
