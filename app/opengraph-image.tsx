import { ImageResponse } from "next/og";
import { SITE_LOGO_PATH, SITE_NAME } from "@/lib/constants/site";

export const size = {
  width: 1200,
  height: 630
};

export const contentType = "image/png";

const logoUrl = (() => {
  try {
    return new URL(SITE_LOGO_PATH, process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").toString();
  } catch {
    return `http://localhost:3000${SITE_LOGO_PATH}`;
  }
})();

export default function OpenGraphImage(): ImageResponse {
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
            src={logoUrl}
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
