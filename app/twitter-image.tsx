import { ImageResponse } from "next/og";
import { SITE_LOGO_PATH, SITE_NAME } from "@/lib/constants/site";

export const size = {
  width: 1200,
  height: 600
};

export const contentType = "image/png";

const logoUrl = (() => {
  try {
    return new URL(SITE_LOGO_PATH, process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").toString();
  } catch {
    return `http://localhost:3000${SITE_LOGO_PATH}`;
  }
})();

export default function TwitterImage(): ImageResponse {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(120deg, rgb(15,23,42), rgb(29,112,242))",
          color: "white",
          padding: "42px"
        }}
      >
        <div
          style={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderRadius: 26,
            background: "rgba(255,255,255,0.1)",
            border: "2px solid rgba(255,255,255,0.2)",
            padding: "24px 32px"
          }}
        >
          <div style={{ display: "flex", flexDirection: "column" }}>
            <span style={{ fontSize: 74, fontWeight: 800, lineHeight: 1 }}>{SITE_NAME}</span>
            <span style={{ marginTop: 10, fontSize: 30, opacity: 0.95 }}>Real-time match center</span>
          </div>
          <img
            src={logoUrl}
            alt={`${SITE_NAME} logo`}
            width={240}
            height={240}
            style={{
              borderRadius: 18,
              border: "2px solid rgba(255,255,255,0.3)",
              objectFit: "contain",
              background: "rgba(15,23,42,0.32)",
              padding: "14px"
            }}
          />
        </div>
      </div>
    ),
    size
  );
}
