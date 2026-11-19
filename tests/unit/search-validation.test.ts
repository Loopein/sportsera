import { describe, expect, it } from "vitest";
import { sanitizeSearchQuery } from "@/lib/validations/search";

describe("search sanitizer", () => {
  it("strips angle brackets", () => {
    expect(sanitizeSearchQuery("<india>")).toBe("india");
  });

  it("rejects empty queries", () => {
    expect(sanitizeSearchQuery("")).toBe("");
  });
});
