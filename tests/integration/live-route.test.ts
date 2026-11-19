import { describe, expect, it } from "vitest";
import { GET } from "@/app/api/live/route";

describe("GET /api/live", () => {
  it("returns live match list", async () => {
    const response = await GET(new Request("http://localhost/api/live"));
    const json = (await response.json()) as { data: Array<{ id: string }> };
    expect(response.status).toBe(200);
    expect(Array.isArray(json.data)).toBe(true);
    expect(json.data.length).toBeGreaterThan(0);
  });

  it("returns 304 when live payload is unchanged", async () => {
    const first = await GET(new Request("http://localhost/api/live"));
    const etag = first.headers.get("etag");
    expect(etag).toBeTruthy();

    const second = await GET(
      new Request("http://localhost/api/live", {
        headers: { "if-none-match": etag ?? "" }
      })
    );

    expect(second.status).toBe(304);
  });
});
