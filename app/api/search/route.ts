import { NextResponse } from "next/server";
import { search } from "@/lib/api/read";
import { sanitizeSearchQuery } from "@/lib/validations/search";

export async function GET(request: Request): Promise<NextResponse> {
  const { searchParams } = new URL(request.url);
  const rawQuery = searchParams.get("q") ?? "";
  const query = sanitizeSearchQuery(rawQuery);

  if (!query) {
    return NextResponse.json(
      { data: [], meta: { generatedAt: new Date().toISOString() } },
      { headers: { "Cache-Control": "public, s-maxage=5, stale-while-revalidate=10" } }
    );
  }

  const data = await search(query);
  return NextResponse.json(
    { data, meta: { generatedAt: new Date().toISOString() } },
    { headers: { "Cache-Control": "public, s-maxage=10, stale-while-revalidate=20" } }
  );
}
