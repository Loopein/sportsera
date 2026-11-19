import { NextResponse } from "next/server";
import { getMatchSummary } from "@/lib/api/read";
import { etagMatches, toEtagFromData } from "@/lib/utils/data-version";
import { isValidId } from "@/lib/validations/params";

type MatchRouteProps = {
  params: Promise<{ matchId: string }>;
};

export async function GET(_request: Request, { params }: MatchRouteProps): Promise<NextResponse> {
  const { matchId } = await params;

  if (!isValidId(matchId)) {
    return NextResponse.json({ error: "Invalid match id" }, { status: 400 });
  }

  const data = await getMatchSummary(matchId);
  if (!data) {
    return NextResponse.json({ error: "Match not found" }, { status: 404 });
  }

  const etag = toEtagFromData(data);
  const headers = {
    "Cache-Control": "public, s-maxage=6, stale-while-revalidate=12",
    ETag: etag
  };

  if (etagMatches(_request.headers.get("if-none-match"), etag)) {
    return new NextResponse(null, { status: 304, headers });
  }

  return NextResponse.json(
    { data, meta: { generatedAt: new Date().toISOString(), etag } },
    { headers }
  );
}
