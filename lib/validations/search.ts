import { z } from "zod";

const SearchSchema = z
  .string()
  .trim()
  .min(1)
  .max(100)
  .transform((v) => v.replace(/[<>]/g, ""));

export function sanitizeSearchQuery(input: string): string {
  const parsed = SearchSchema.safeParse(input);
  if (!parsed.success) return "";
  return parsed.data;
}
