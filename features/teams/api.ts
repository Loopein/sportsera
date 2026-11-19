import { getTeam, getTeams } from "@/lib/api/read";

export async function fetchTeams() {
  return getTeams();
}

export async function fetchTeamById(teamId: string) {
  return getTeam(teamId);
}
