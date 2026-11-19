import { expect, test } from "@playwright/test";

test("homepage loads", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: "Live Cricket Scores" })).toBeVisible();
});

test("live page loads", async ({ page }) => {
  await page.goto("/live");
  await expect(page.getByRole("heading", { name: "Live Matches" })).toBeVisible();
});

test("match detail page loads", async ({ page }) => {
  await page.goto("/matches/match-1001");
  await expect(page.getByRole("link", { name: "Scorecard" })).toBeVisible();
});

test("invalid match page shows not found", async ({ page }) => {
  await page.goto("/matches/unknown-match-id");
  await expect(page.getByText("Content Not Found")).toBeVisible();
});

test("search flow", async ({ page }) => {
  await page.goto("/search");
  await page.getByRole("searchbox").fill("india");
  await expect(page.getByText("IND vs AUS")).toBeVisible();
});
