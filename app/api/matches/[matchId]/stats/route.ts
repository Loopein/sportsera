import { NextResponse } from "next/server";
import { getMatchStats } from "@/lib/api/read";
import { isValidId } from "@/lib/validations/params";

type StatsRouteProps = {
  params: Promise<{ matchId: string }>;
};

export async function GET(_request: Request, { params }: StatsRouteProps): Promise<NextResponse> {
  const { matchId } = await params;

  if (!isValidId(matchId)) {
    return NextResponse.json({ error: "Invalid match id" }, { status: 400 });
  }

  const data = await getMatchStats(matchId);
  if (!data) {
    return NextResponse.json({ error: "Stats not found" }, { status: 404 });
  }

  return NextResponse.json(
    { data, meta: { generatedAt: new Date().toISOString() } },
    { headers: { "Cache-Control": "public, s-maxage=20, stale-while-revalidate=40" } }
  );
}
