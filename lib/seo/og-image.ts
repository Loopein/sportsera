import { readFile } from "node:fs/promises";
import path from "node:path";
import { SPORTSERA_FAVICON_DATA_URI } from "@/lib/constants/site";

let cachedLogoDataUri: string | null = null;

/**
 * Loads the brand logo from disk as a base64 data URI so `next/og` never
 * issues loopback HTTP fetches (which Next.js SSRF protection blocks at build time).
 */
export async function getOgLogoSrc(): Promise<string> {
  if (cachedLogoDataUri) return cachedLogoDataUri;

  try {
    const iconPath = path.join(process.cwd(), "public", "icons", "SportsEra-icon.png");
    const buffer = await readFile(iconPath);
    cachedLogoDataUri = `data:image/png;base64,${buffer.toString("base64")}`;
    return cachedLogoDataUri;
  } catch {
    return SPORTSERA_FAVICON_DATA_URI;
  }
}
