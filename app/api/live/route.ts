import { NextResponse } from "next/server";
import { getLiveMatches } from "@/lib/api/read";
import { etagMatches, toEtagFromData } from "@/lib/utils/data-version";

export async function GET(request: Request = new Request("http://localhost/api/live")): Promise<NextResponse> {
  const data = await getLiveMatches();
  const etag = toEtagFromData(data);
  const headers = {
    "Cache-Control": "public, s-maxage=10, stale-while-revalidate=20",
    ETag: etag
  };

  if (etagMatches(request.headers.get("if-none-match"), etag)) {
    return new NextResponse(null, { status: 304, headers });
  }

  return NextResponse.json(
    { data, meta: { generatedAt: new Date().toISOString(), etag } },
    { headers }
  );
}
