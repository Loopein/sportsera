import { NextResponse } from "next/server";
import { getSeries } from "@/lib/api/read";

export async function GET(): Promise<NextResponse> {
  const data = await getSeries();
  return NextResponse.json(
    { data, meta: { generatedAt: new Date().toISOString() } },
    { headers: { "Cache-Control": "public, s-maxage=60, stale-while-revalidate=180" } }
  );
}
