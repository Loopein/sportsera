import { NextResponse } from "next/server";
import { getRankings } from "@/lib/api/read";

export async function GET(): Promise<NextResponse> {
  const data = await getRankings();
  return NextResponse.json(
    { data, meta: { generatedAt: new Date().toISOString() } },
    { headers: { "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600" } }
  );
}
