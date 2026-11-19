import { NextResponse } from "next/server";
import { getTeam } from "@/lib/api/read";
import { isValidId } from "@/lib/validations/params";

type TeamRouteProps = {
  params: Promise<{ teamId: string }>;
};

export async function GET(_request: Request, { params }: TeamRouteProps): Promise<NextResponse> {
  const { teamId } = await params;

  if (!isValidId(teamId)) {
    return NextResponse.json({ error: "Invalid team id" }, { status: 400 });
  }

  const data = await getTeam(teamId);
  if (!data) {
    return NextResponse.json({ error: "Team not found" }, { status: 404 });
  }

  return NextResponse.json(
    { data, meta: { generatedAt: new Date().toISOString() } },
    { headers: { "Cache-Control": "public, s-maxage=600, stale-while-revalidate=1200" } }
  );
}
