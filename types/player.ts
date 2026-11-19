export type PlayerCareerStat = {
  format: string;
  matches: number;
  runs?: number;
  wickets?: number;
  average?: number;
  strikeRate?: number;
};

export type PlayerProfile = {
  id: string;
  name: string;
  teamId: string;
  role: string;
  battingStyle?: string;
  bowlingStyle?: string;
  image?: string;
  career: PlayerCareerStat[];
  recentForm: string[];
};
