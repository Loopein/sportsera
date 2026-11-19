import { NextResponse } from "next/server";
import { getPlayer } from "@/lib/api/read";
import { isValidId } from "@/lib/validations/params";

type PlayerRouteProps = {
  params: Promise<{ playerId: string }>;
};

export async function GET(_request: Request, { params }: PlayerRouteProps): Promise<NextResponse> {
  const { playerId } = await params;

  if (!isValidId(playerId)) {
    return NextResponse.json({ error: "Invalid player id" }, { status: 400 });
  }

  const data = await getPlayer(playerId);
  if (!data) {
    return NextResponse.json({ error: "Player not found" }, { status: 404 });
  }

  return NextResponse.json(
    { data, meta: { generatedAt: new Date().toISOString() } },
    { headers: { "Cache-Control": "public, s-maxage=600, stale-while-revalidate=1200" } }
  );
}
