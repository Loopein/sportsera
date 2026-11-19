import { getPlayer, getPlayers } from "@/lib/api/read";

export async function fetchPlayers() {
  return getPlayers();
}

export async function fetchPlayerById(playerId: string) {
  return getPlayer(playerId);
}
