import type { MetadataRoute } from "next";
import { SITE_DESCRIPTION, SITE_NAME } from "@/lib/constants/site";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${SITE_NAME} - Live Scores & Sports Hub`,
    short_name: SITE_NAME,
    description: SITE_DESCRIPTION,
    start_url: "/",
    display: "standalone",
    background_color: "#0b1221",
    theme_color: "#1d70f2",
    categories: ["sports", "news", "entertainment"],
    icons: [
      {
        src: "/icon.png",
        sizes: "192x192",
        type: "image/png"
      },
      {
        src: "/apple-icon.png",
        sizes: "180x180",
        type: "image/png"
      }
    ]
  };
}
