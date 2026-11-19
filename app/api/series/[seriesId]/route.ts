import { NextResponse } from "next/server";
import { getSeriesById } from "@/lib/api/read";
import { isValidId } from "@/lib/validations/params";

type SeriesRouteProps = {
  params: Promise<{ seriesId: string }>;
};

export async function GET(_request: Request, { params }: SeriesRouteProps): Promise<NextResponse> {
  const { seriesId } = await params;

  if (!isValidId(seriesId)) {
    return NextResponse.json({ error: "Invalid series id" }, { status: 400 });
  }

  const data = await getSeriesById(seriesId);
  if (!data) {
    return NextResponse.json({ error: "Series not found" }, { status: 404 });
  }

  return NextResponse.json(
    { data, meta: { generatedAt: new Date().toISOString() } },
    { headers: { "Cache-Control": "public, s-maxage=60, stale-while-revalidate=180" } }
  );
}
