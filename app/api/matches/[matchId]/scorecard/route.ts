import { NextResponse } from "next/server";
import { getMatchScorecard } from "@/lib/api/read";
import { isValidId } from "@/lib/validations/params";

type ScorecardRouteProps = {
  params: Promise<{ matchId: string }>;
};

export async function GET(_request: Request, { params }: ScorecardRouteProps): Promise<NextResponse> {
  const { matchId } = await params;

  if (!isValidId(matchId)) {
    return NextResponse.json({ error: "Invalid match id" }, { status: 400 });
  }

  const data = await getMatchScorecard(matchId);
  if (!data) {
    return NextResponse.json({ error: "Scorecard not found" }, { status: 404 });
  }

  return NextResponse.json(
    { data, meta: { generatedAt: new Date().toISOString() } },
    { headers: { "Cache-Control": "public, s-maxage=30, stale-while-revalidate=60" } }
  );
}
