import { clsx, type ClassValue } from "clsx";

export function cn(...values: ClassValue[]): string {
  return clsx(values);
}

export function trimText(value: string, max = 120): string {
  if (value.length <= max) return value;
  return `${value.slice(0, max - 3)}...`;
}
