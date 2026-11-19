import { search } from "@/lib/api/read";

export async function fetchSearchResults(query: string) {
  return search(query);
}
