import { getLiveMatches } from "@/lib/api/read";

export async function fetchLiveMatches() {
  return getLiveMatches();
}
