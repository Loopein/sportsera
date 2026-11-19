import { fetchLiveMatches } from "@/features/live/api";

export async function getLiveMatchesQuery() {
  return fetchLiveMatches();
}
