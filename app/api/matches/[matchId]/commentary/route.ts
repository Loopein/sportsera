import { NextResponse } from "next/server";
import { getMatchCommentary } from "@/lib/api/read";
import { etagMatches, toEtagFromData } from "@/lib/utils/data-version";
import { isValidId } from "@/lib/validations/params";

type CommentaryRouteProps = {
  params: Promise<{ matchId: string }>;
};

export async function GET(request: Request, { params }: CommentaryRouteProps): Promise<NextResponse> {
  const { matchId } = await params;

  if (!isValidId(matchId)) {
    return NextResponse.json({ error: "Invalid match id" }, { status: 400 });
  }

  const data = await getMatchCommentary(matchId);
  const etag = toEtagFromData(data);
  const headers = {
    "Cache-Control": "public, s-maxage=6, stale-while-revalidate=12",
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
