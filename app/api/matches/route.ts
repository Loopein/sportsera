import { NextResponse } from "next/server";
import { getMatches } from "@/lib/api/read";

type RequestContext = {
  request: Request;
};

export async function GET(request: RequestContext["request"]): Promise<NextResponse> {
  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status") ?? undefined;
  const data = await getMatches(status);
  return NextResponse.json(
    { data, meta: { generatedAt: new Date().toISOString() } },
    { headers: { "Cache-Control": "public, s-maxage=20, stale-while-revalidate=60" } }
  );
}
