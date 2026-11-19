import { describe, expect, it } from "vitest";
import { GET } from "@/app/api/matches/[matchId]/route";

describe("GET /api/matches/[matchId]", () => {
  it("returns match summary for valid id", async () => {
    const request = new Request("http://localhost/api/matches/match-1001");
    const response = await GET(request, { params: Promise.resolve({ matchId: "match-1001" }) });
    const json = (await response.json()) as { data?: { id: string } };
    expect(response.status).toBe(200);
    expect(json.data?.id).toBe("match-1001");
  });

  it("returns 404 for unknown id", async () => {
    const request = new Request("http://localhost/api/matches/match-does-not-exist");
    const response = await GET(request, { params: Promise.resolve({ matchId: "match-does-not-exist" }) });
    expect(response.status).toBe(404);
  });

  it("returns 304 when match summary is unchanged", async () => {
    const request = new Request("http://localhost/api/matches/match-1001");
    const first = await GET(request, { params: Promise.resolve({ matchId: "match-1001" }) });
    const etag = first.headers.get("etag");
    expect(etag).toBeTruthy();

    const second = await GET(
      new Request("http://localhost/api/matches/match-1001", {
        headers: { "if-none-match": etag ?? "" }
      }),
      { params: Promise.resolve({ matchId: "match-1001" }) }
    );

    expect(second.status).toBe(304);
  });
});
