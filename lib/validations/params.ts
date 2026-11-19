import { z } from "zod";

const IdSchema = z
  .string()
  .trim()
  .min(1)
  .max(120)
  .regex(/^[a-zA-Z0-9-_]+$/);

export function isValidId(value: string): boolean {
  return IdSchema.safeParse(value).success;
}
